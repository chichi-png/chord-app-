# 🎨 Chord Manager - Handoff Documentation

## Overview
This is a full-stack worship song chord sheet manager with a **newly refreshed warm, approachable UI**. The app has been completely redesigned from a cold monochrome theme to warm earth tones.

**Status**: ✅ Ready for deployment
**Last Updated**: 2026-03-24

---

## 🎯 What Was Changed

### UI Refresh (Complete)
- ✅ **New Design System**: Warm earth color palette (cream #f4e8d8, golden tan #d4a574, deep brown #2c1810)
- ✅ **All 7 Pages Updated**: Modern sans-serif typography, soft rounded corners, warm shadows
- ✅ **Responsive Design**: Mobile-friendly list layouts
- ✅ **Role Badges**: Warm-colored badges for Admin/Viewer/Pending users

### Bug Fixes (Complete)
- ✅ Fixed duplicate 'normal' key in typography object
- ✅ Removed unused imports across all pages
- ✅ Fixed JWT exception handling for python-jose compatibility
- ✅ Cleaned up old design documentation

---

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- OAuth credentials (or use Demo Mode for testing)

### Setup Steps

1. **Clone/Download the repository**
   ```bash
   cd chord-app
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings (see Environment Variables section below)
   ```

3. **Build and run**
   ```bash
   docker compose up --build
   ```

4. **Access the app**
   - Open: `http://localhost`
   - Use Demo Login (🎭 button) or OAuth to sign in

---

## 🔐 Environment Variables

### Required for Production
```env
SECRET_KEY=your-secret-key-at-least-32-characters-long
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
FACEBOOK_APP_ID=your-facebook-app-id
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id
FRONTEND_URL=https://yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### For Testing/Development
```env
DEMO_MODE=true  # Enables Demo Login button (no OAuth needed)
```

---

## 📁 Project Structure

```
chord-app/
├── backend/              # FastAPI Python backend
│   ├── main.py          # API routes
│   ├── auth.py          # OAuth & JWT authentication
│   ├── models.py        # Database models (SQLAlchemy)
│   ├── transpose.py     # Chord transposition logic
│   ├── ocr.py           # Tesseract OCR integration
│   ├── pdf_gen.py       # ReportLab PDF generation
│   └── requirements.txt # Python dependencies
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/      # All 7 page components
│   │   ├── styles/     # Design system module
│   │   ├── contexts/   # Auth context
│   │   └── utils/      # API client
│   ├── Dockerfile      # Multi-stage build
│   └── package.json    # Node dependencies
│
├── nginx/              # Reverse proxy config
│   └── nginx.conf      # Routes API & frontend
│
├── docs/               # Design specs & plans
│   └── superpowers/
│       ├── specs/      # UI design specification
│       └── plans/      # Implementation plans
│
├── docker-compose.yml  # Service orchestration
├── .env.example        # Environment template
└── HANDOFF.md         # This file
```

---

## 🎨 Design System

Located at: `frontend/src/styles/designSystem.js`

### Colors
- **Background**: `#f4e8d8` (Rich cream)
- **Card Background**: `#ffffff` (Pure white)
- **Primary Accent**: `#d4a574` (Golden tan)
- **Dark Text**: `#2c1810` (Deep brown)
- **Secondary Text**: `#8d7a6a` (Medium brown)

### Typography
- **Font Family**: `system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif`
- **Monospace** (for chords): `'Consolas', 'Monaco', 'Courier New', monospace`

### Components
- **Buttons**: 12px border radius, golden accent (primary) or white bordered (secondary)
- **Inputs**: 12px border radius, warm focus ring
- **Cards**: White background, subtle shadows, 12px radius
- **Badges**: 8px radius, warm tinted backgrounds

---

## 🔧 Technical Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM with SQLite database
- **Tesseract OCR** - Image text extraction
- **ReportLab** - PDF generation
- **JWT** - Token-based auth
- **Python 3.11+**

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Google/Facebook OAuth** - Authentication

### Infrastructure
- **Docker Compose** - Multi-container setup
- **Nginx** - Reverse proxy
- **SQLite** - Database (in Docker volume)

---

## 📋 Features

### For All Users
- Browse song library with search and filters
- View songs with chords
- Transpose to any of 17 keys
- Print chord sheets
- Download as PDF

### For Admins
- Upload songs via OCR or manual entry
- Edit/delete songs
- Manage user roles
- View user statistics

---

## 🐛 Known Issues & Notes

### React Hooks Warnings
- Some ESLint warnings about useEffect dependencies
- **These are intentional** to avoid infinite loops
- Not actual bugs, just linter suggestions

### OCR Limitations
- Tesseract works best with printed text
- Handwriting recognition is limited
- For better handwriting OCR, configure Google Cloud Vision API (optional)

---

## 🚢 Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Set `DEMO_MODE=false` in production
- [ ] Configure OAuth apps with production redirect URIs
- [ ] Set strong `SECRET_KEY` (32+ characters)
- [ ] Set `ADMIN_EMAIL` for automatic admin promotion
- [ ] Update `FRONTEND_URL` to your domain
- [ ] Test OAuth login flow
- [ ] Test file upload and OCR
- [ ] Test PDF generation
- [ ] Verify database persistence (check Docker volume)

---

## 📚 Documentation

- **UI Design**: `docs/superpowers/specs/2026-03-24-ui-refresh-design.md`
- **Implementation Plan**: `docs/superpowers/plans/2026-03-24-ui-refresh-implementation.md`
- **Setup Guide**: `SETUP.md`
- **README**: `README.md`

---

## 🤝 Support

If you encounter issues:
1. Check Docker logs: `docker compose logs -f backend` or `docker compose logs -f frontend`
2. Verify `.env` file has correct values
3. Ensure Docker Desktop is running
4. Check OAuth credentials and redirect URIs

---

## ✨ What's New in This Version

### UI Transformation
- Warm earth tone color palette throughout
- Modern, approachable design system
- List-based song layout for better scanning
- Soft rounded components with warm shadows
- Improved mobile responsiveness

### Code Improvements
- Fixed duplicate typography keys
- Removed unused imports
- Updated JWT exception handling
- Cleaned up documentation
- Comprehensive design system module

---

**Built for worship teams. Ready for deployment.** 🎵✝

Last commit: `682fc38 - fix: remove unused 'shadows' imports from pages`
