from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests
from jose import jwt, JWTError
from datetime import datetime, timedelta
from config import settings
from database import get_db
from models import User

# OAuth Token Verification

async def verify_google_token(token: str) -> dict:
    """Verify Google ID token and return user info"""
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )

        return {
            'email': idinfo.get('email'),
            'name': idinfo.get('name', 'Unknown'),
            'picture': idinfo.get('picture'),
            'provider_user_id': idinfo.get('sub')
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")

async def verify_facebook_token(token: str) -> dict:
    """Verify Facebook access token and return user info"""
    try:
        response = requests.get(
            'https://graph.facebook.com/me',
            params={
                'access_token': token,
                'fields': 'id,name,email,picture'
            },
            timeout=10
        )

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Facebook token")

        data = response.json()

        if 'email' not in data:
            raise HTTPException(status_code=400, detail="Email permission required")

        return {
            'email': data['email'],
            'name': data.get('name', 'Unknown'),
            'picture': data.get('picture', {}).get('data', {}).get('url'),
            'provider_user_id': data['id']
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Facebook API error: {str(e)}")

# JWT Token Management

def create_jwt_token(user: User) -> str:
    """Generate JWT token for authenticated user"""
    payload = {
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(days=settings.JWT_EXPIRATION_DAYS)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def decode_jwt_token(token: str) -> dict:
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# User Creation/Retrieval

def get_or_create_user(db: Session, user_info: dict, provider: str) -> User:
    """Get existing user or create new one from OAuth info"""
    # Check if user exists
    user = db.query(User).filter(
        User.provider == provider,
        User.provider_user_id == user_info['provider_user_id']
    ).first()

    if user:
        # Update user info (name/avatar might have changed)
        user.name = user_info['name']
        user.avatar_url = user_info.get('picture')
        db.commit()
        db.refresh(user)
        return user

    # Create new user
    # Check if this should be admin (first user or matches ADMIN_EMAIL)
    user_count = db.query(User).count()
    is_admin = (
        user_count == 0 or
        user_info['email'].lower() == settings.ADMIN_EMAIL.lower()
    )

    new_user = User(
        email=user_info['email'],
        name=user_info['name'],
        provider=provider,
        provider_user_id=user_info['provider_user_id'],
        avatar_url=user_info.get('picture'),
        role='admin' if is_admin else 'pending'
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# FastAPI Dependencies

async def get_current_user(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
) -> dict:
    """Dependency to get current user from JWT token"""
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.split(' ')[1]
    payload = decode_jwt_token(token)

    # Verify user still exists and role hasn't changed
    user = db.query(User).filter(User.id == payload['user_id']).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Update payload with current role (in case it changed)
    payload['role'] = user.role

    return payload

def require_role(*allowed_roles: str):
    """Dependency factory to require specific roles"""
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user['role'] == 'pending':
            raise HTTPException(status_code=403, detail="Account pending approval")

        if allowed_roles and current_user['role'] not in allowed_roles:
            raise HTTPException(status_code=403, detail=f"Requires role: {', '.join(allowed_roles)}")

        return current_user

    return role_checker

# Convenience dependencies
require_admin = require_role('admin')
require_viewer_or_admin = require_role('viewer', 'admin')
