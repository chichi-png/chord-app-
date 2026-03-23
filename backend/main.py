from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
from pathlib import Path

from config import settings
from database import get_db, init_db
from models import User, Song
from auth import (
    verify_google_token,
    verify_facebook_token,
    create_jwt_token,
    get_or_create_user,
    get_current_user,
    require_admin,
    require_viewer_or_admin
)
from ocr import extract_text_from_image
from transpose import transpose_chords, get_all_keys
from pdf_gen import generate_song_pdf, sanitize_filename

# Initialize FastAPI app
app = FastAPI(title="Chord Manager API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()

# Pydantic models for request/response

class OAuthRequest(BaseModel):
    access_token: str
    provider: str  # 'google' or 'facebook'

class OAuthResponse(BaseModel):
    token: str
    user: dict

class UpdateRoleRequest(BaseModel):
    role: str

class CreateSongRequest(BaseModel):
    title: str
    chords: str
    original_key: str
    language: str
    category: str

class UpdateSongRequest(BaseModel):
    title: Optional[str] = None
    chords: Optional[str] = None
    original_key: Optional[str] = None
    language: Optional[str] = None
    category: Optional[str] = None

class TransposeRequest(BaseModel):
    chords: str
    from_key: str
    to_key: str

class TransposeResponse(BaseModel):
    transposed: str

# API Routes

# Health check
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Authentication routes

@app.post("/api/auth/oauth", response_model=OAuthResponse)
async def oauth_login(request: OAuthRequest, db: Session = Depends(get_db)):
    """Authenticate user via Google or Facebook OAuth"""
    try:
        # Verify token based on provider
        if request.provider == 'google':
            user_info = await verify_google_token(request.access_token)
        elif request.provider == 'facebook':
            user_info = await verify_facebook_token(request.access_token)
        else:
            raise HTTPException(status_code=400, detail="Invalid provider")

        # Get or create user
        user = get_or_create_user(db, user_info, request.provider)

        # Generate JWT token
        token = create_jwt_token(user)

        return OAuthResponse(
            token=token,
            user=user.to_dict()
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user info"""
    user = db.query(User).filter(User.id == current_user['user_id']).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": user.to_dict()}

@app.post("/api/auth/demo", response_model=OAuthResponse)
async def demo_login(db: Session = Depends(get_db)):
    """Demo login - bypasses OAuth for testing (only available in DEMO_MODE)"""
    if not settings.DEMO_MODE:
        raise HTTPException(status_code=403, detail="Demo mode is disabled")

    # Check if demo user exists
    demo_user = db.query(User).filter(User.email == "demo@chordmanager.local").first()

    if not demo_user:
        # Create demo admin user
        demo_user = User(
            email="demo@chordmanager.local",
            name="Demo User",
            provider="demo",
            provider_user_id="demo_user_123",
            avatar_url=None,
            role="admin"  # Demo user is always admin for full testing
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    # Generate JWT token
    token = create_jwt_token(demo_user)

    return OAuthResponse(
        token=token,
        user=demo_user.to_dict()
    )

# User management routes (admin only)

@app.get("/api/users")
async def list_users(
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """List all users (admin only)"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [user.to_dict() for user in users]

@app.patch("/api/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    request: UpdateRoleRequest,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update user role (admin only)"""
    # Validate role
    valid_roles = ['pending', 'viewer', 'admin']
    if request.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}")

    # Cannot modify own role
    if user_id == current_user['user_id']:
        raise HTTPException(status_code=403, detail="Cannot modify your own role")

    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update role
    user.role = request.role
    db.commit()
    db.refresh(user)

    return {"message": "Role updated successfully", "user": user.to_dict()}

# OCR route (admin only)

@app.post("/api/ocr")
async def ocr_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_admin)
):
    """Extract text from image using OCR (admin only)"""
    text = await extract_text_from_image(file)
    return {"text": text}

# Song routes

@app.get("/api/songs")
async def list_songs(
    language: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(require_viewer_or_admin),
    db: Session = Depends(get_db)
):
    """List songs with optional filters"""
    query = db.query(Song)

    # Apply filters
    if language:
        query = query.filter(Song.language == language)
    if category:
        query = query.filter(Song.category == category)
    if search:
        query = query.filter(Song.title.ilike(f"%{search}%"))

    # Order by title
    songs = query.order_by(Song.title).all()

    return [song.to_dict(include_uploader=True) for song in songs]

@app.get("/api/songs/{song_id}")
async def get_song(
    song_id: int,
    current_user: dict = Depends(require_viewer_or_admin),
    db: Session = Depends(get_db)
):
    """Get single song by ID"""
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    return song.to_dict(include_uploader=True)

@app.post("/api/songs")
async def create_song(
    request: CreateSongRequest,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create new song (admin only)"""
    # Validate required fields
    if not request.title or not request.chords or not request.original_key:
        raise HTTPException(status_code=400, detail="Missing required fields")

    # Validate language and category
    valid_languages = ['Tagalog', 'English']
    valid_categories = ['Praise', 'Worship']

    if request.language not in valid_languages:
        raise HTTPException(status_code=400, detail=f"Invalid language. Must be: {', '.join(valid_languages)}")
    if request.category not in valid_categories:
        raise HTTPException(status_code=400, detail=f"Invalid category. Must be: {', '.join(valid_categories)}")

    # Create song
    song = Song(
        title=request.title,
        chords=request.chords,
        original_key=request.original_key,
        language=request.language,
        category=request.category,
        uploaded_by_id=current_user['user_id']
    )

    db.add(song)
    db.commit()
    db.refresh(song)

    return {"message": "Song created successfully", "song": song.to_dict(include_uploader=True)}

@app.patch("/api/songs/{song_id}")
async def update_song(
    song_id: int,
    request: UpdateSongRequest,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update song (admin only)"""
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    # Update fields
    if request.title is not None:
        song.title = request.title
    if request.chords is not None:
        song.chords = request.chords
    if request.original_key is not None:
        song.original_key = request.original_key
    if request.language is not None:
        song.language = request.language
    if request.category is not None:
        song.category = request.category

    db.commit()
    db.refresh(song)

    return {"message": "Song updated successfully", "song": song.to_dict(include_uploader=True)}

@app.delete("/api/songs/{song_id}")
async def delete_song(
    song_id: int,
    current_user: dict = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete song (admin only)"""
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    db.delete(song)
    db.commit()

    return {"message": "Song deleted successfully"}

# Transposition routes

@app.post("/api/transpose", response_model=TransposeResponse)
async def transpose(
    request: TransposeRequest,
    current_user: dict = Depends(require_viewer_or_admin)
):
    """Transpose chords from one key to another"""
    try:
        transposed = transpose_chords(request.chords, request.from_key, request.to_key)
        return TransposeResponse(transposed=transposed)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/keys")
async def get_keys():
    """Get all available keys"""
    return get_all_keys()

# PDF generation

@app.get("/api/songs/{song_id}/pdf")
async def download_song_pdf(
    song_id: int,
    transposed_key: Optional[str] = None,
    current_user: dict = Depends(require_viewer_or_admin),
    db: Session = Depends(get_db)
):
    """Download song as PDF with optional transposition"""
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    # Transpose if requested
    transposed_chords = None
    if transposed_key and transposed_key != song.original_key:
        try:
            transposed_chords = transpose_chords(song.chords, song.original_key, transposed_key)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Transposition failed: {str(e)}")

    # Generate PDF
    pdf_buffer = generate_song_pdf(song, transposed_key, transposed_chords)

    # Create filename
    key_for_filename = transposed_key or song.original_key
    filename = sanitize_filename(song.title, key_for_filename)

    # Return as streaming response
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

# Serve static files (React frontend) if available
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    # Mount static files
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

    # Catch-all route to serve React app (must be last)
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """Serve React app for all non-API routes"""
        # Check if it's a static file request
        file_path = static_dir / full_path
        if file_path.is_file():
            return FileResponse(file_path)

        # Otherwise serve index.html for client-side routing
        index_file = static_dir / "index.html"
        if index_file.exists():
            return FileResponse(index_file)

        raise HTTPException(status_code=404, detail="Not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
