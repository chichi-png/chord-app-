# ✝ Chord Manager

A full-stack worship song chord sheet manager with OCR, transposition, PDF generation, and OAuth authentication.

## 🎯 What This App Does

- **Store worship songs** with chords, organized by language (Tagalog/English) and category (Praise/Worship)
- **Scan chord sheets** using OCR (Tesseract) to convert photos to editable text
- **Transpose chords** to any of 17 keys in real-time
- **Print clean chord sheets** with print-friendly CSS
- **Download as PDF** with optional transposition
- **User authentication** via Google and Facebook OAuth
- **Role-based access** (Admin, Viewer, Pending)

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** installed and running
- **Google OAuth credentials** (see SETUP.md)
- **Facebook OAuth credentials** (see SETUP.md)

### Setup

1. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OAuth credentials
   ```

2. **Get OAuth credentials:**
   - See `SETUP.md` for detailed instructions on getting Google and Facebook OAuth credentials

3. **Build and run:**
   ```bash
   docker compose up --build
   ```

4. **Access the app:**
   - Open `http://localhost` in your browser
   - Sign in with Google or Facebook
   - First user becomes admin automatically (or set `ADMIN_EMAIL` in `.env`)

## 📁 Project Structure

```
chord-app/
├── backend/              # FastAPI backend
│   ├── main.py          # API routes and app setup
│   ├── auth.py          # OAuth verification & JWT
│   ├── models.py        # SQLAlchemy database models
│   ├── database.py      # Database connection
│   ├── transpose.py     # Chord transposition logic
│   ├── ocr.py           # Tesseract OCR integration
│   ├── pdf_gen.py       # ReportLab PDF generation
│   ├── config.py        # Environment configuration
│   └── Dockerfile       # Backend container
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/      # All 6 page components
│   │   ├── contexts/   # Auth context provider
│   │   ├── utils/      # Axios API client
│   │   ├── App.jsx     # React Router setup
│   │   └── index.js    # Entry point
│   ├── Dockerfile      # Multi-stage build
│   └── nginx.conf      # SPA routing config
├── nginx/              # Reverse proxy
│   └── nginx.conf      # API/frontend routing
├── docker-compose.yml  # Service orchestration
├── .env.example        # Environment template
├── SETUP.md           # Detailed setup guide
└── README.md          # This file
```

## 🎨 Features

### For All Users (Viewers & Admins)

- **Browse library** with search and filters (language, category)
- **View songs** with metadata and chord sheets
- **Transpose** to any of 17 keys (C, C#, Db, D, D#, Eb, E, F, F#, Gb, G, G#, Ab, A, A#, Bb, B)
- **Print** chord sheets with clean, print-friendly layout
- **Download PDF** with current transposition
- **View original uploader** and creation date

### For Admins Only

- **Upload songs** via OCR image scanning or manual entry
- **Edit any song** (title, chords, key, language, category)
- **Delete songs**
- **Manage users** - promote pending users to viewer or admin
- **View user stats** - see all registered users and their roles

## 🔐 Authentication & Roles

### Roles

1. **Admin** - Full access (upload, edit, delete, manage users)
2. **Viewer** - Can view, transpose, print, and download
3. **Pending** - New users awaiting admin approval

### First User

- The first person to sign up automatically becomes admin
- OR set `ADMIN_EMAIL` in `.env` to auto-promote a specific email

## 🎵 Song Organization

Songs are automatically grouped into 4 sections:

- 🇵🇭 **Tagalog — Praise**
- 🇵🇭 **Tagalog — Worship**
- 🌐 **English — Praise**
- 🌐 **English — Worship**

## 🛠️ Technical Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM with SQLite database
- **Tesseract OCR** - Image text extraction (English + Tagalog)
- **ReportLab** - PDF generation
- **JWT** - Token-based authentication
- **Google/Facebook OAuth** - ID token verification

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client with JWT interceptor
- **@react-oauth/google** - Google OAuth integration
- **react-facebook-login** - Facebook OAuth integration

### Infrastructure
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **SQLite** - Persistent database in Docker volume

## 📝 API Endpoints

### Authentication
- `POST /api/auth/oauth` - OAuth login (Google/Facebook)
- `GET /api/auth/me` - Get current user

### Songs
- `GET /api/songs` - List songs (with filters)
- `GET /api/songs/:id` - Get single song
- `POST /api/songs` - Create song (admin)
- `PATCH /api/songs/:id` - Update song (admin)
- `DELETE /api/songs/:id` - Delete song (admin)
- `GET /api/songs/:id/pdf` - Download PDF

### Transposition
- `POST /api/transpose` - Transpose chords
- `GET /api/keys` - Get all available keys

### OCR
- `POST /api/ocr` - Extract text from image (admin)

### Users
- `GET /api/users` - List all users (admin)
- `PATCH /api/users/:id/role` - Update user role (admin)

## 🎨 Design System

- **Background:** `#0a0e1a` (deep navy/black)
- **Cards:** `#1a1f2e` (lighter navy)
- **Gold Accent:** `#f0c040` (headings, buttons, highlights)
- **Typography:** Georgia serif for UI, Courier monospace for chords
- **Dark Theme:** Optimized for evening worship team use

## 🔧 Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Database Reset
```bash
docker compose down -v  # WARNING: Deletes all data
docker compose up --build
```

### View Logs
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

## 📚 Documentation

- **SETUP.md** - Detailed setup instructions and OAuth credential guide
- **frontend/COMPONENT_REFERENCE.md** - Frontend component documentation
- **.env.example** - Environment variable template

## 🐛 Troubleshooting

### OAuth Not Working
- Check that redirect URIs match exactly (`http://localhost`)
- Verify OAuth apps are in Development mode
- Clear browser cookies and try again

### Backend Not Starting
- Check logs: `docker compose logs -f backend`
- Verify `.env` file exists with correct values
- Ensure Tesseract installed correctly (handled by Dockerfile)

### Frontend Not Loading
- Check logs: `docker compose logs -f frontend`
- Verify build completed successfully
- Check nginx logs: `docker compose logs -f nginx`

### Database Issues
- Stop services: `docker compose down`
- Remove volumes: `docker compose down -v` (deletes all data)
- Rebuild: `docker compose up --build`

## 📄 License

Built for worship teams. Use freely for church and ministry purposes.

## 👥 Credits

- **OCR:** Tesseract (Apache 2.0)
- **PDF:** ReportLab (BSD)
- **Icons:** Native emoji support
- **Built with:** FastAPI, React, Docker

---

**First build may take 5-10 minutes** as Docker installs all dependencies and Tesseract OCR.

For detailed setup instructions, see `SETUP.md`.
