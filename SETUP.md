# Chord Manager Setup Guide

## Prerequisites

- Docker Desktop installed and running
- Google Cloud Console account (for Google OAuth)
- Meta Developer account (for Facebook OAuth)

## Step 1: Clone and Configure

```bash
cd /c/Users/Sarah/Downloads/chord-app
cp .env.example .env
```

Edit `.env` and fill in your credentials (see below for how to get them).

## Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure consent screen:
   - User Type: External
   - App name: Chord Manager
   - Support email: your email
   - Authorized domains: localhost
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: Chord Manager Web Client
   - Authorized JavaScript origins: `http://localhost`
   - Authorized redirect URIs: `http://localhost`
7. Copy the Client ID to `.env` as both `GOOGLE_CLIENT_ID` and `REACT_APP_GOOGLE_CLIENT_ID`

## Step 3: Get Facebook OAuth Credentials

1. Go to [Meta Developers](https://developers.facebook.com/)
2. Create a new app (or select existing)
3. Select "Consumer" app type
4. Add "Facebook Login" product
5. Configure Facebook Login:
   - Valid OAuth Redirect URIs: `http://localhost/`
   - Allowed Domains: `localhost`
6. Go to Settings > Basic
7. Copy the "App ID" to `.env` as both `FACEBOOK_APP_ID` and `REACT_APP_FACEBOOK_APP_ID`
8. Set App Domains: `localhost`
9. Make sure app is set to "Development" mode (or "Live" if ready for production)

## Step 4: Generate SECRET_KEY

Run this command to generate a secure random key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output to `.env` as `SECRET_KEY`.

## Step 5: Set Admin Email

Set `ADMIN_EMAIL` in `.env` to your email address. This user will automatically become admin when they first sign up.

## Step 6: Build and Run

```bash
docker compose up --build
```

The app will be available at `http://localhost`

**First build may take 5-10 minutes** as it installs all dependencies and Tesseract OCR.

## First Time Setup

1. Open `http://localhost` in your browser
2. Click "Sign in with Google" or "Sign in with Facebook"
3. If your email matches `ADMIN_EMAIL`, you'll be auto-promoted to admin
4. Otherwise, the first user to sign up becomes admin automatically

## Troubleshooting

**OAuth errors:**
- Check that redirect URIs match exactly (http://localhost, no port)
- Verify app is in Development mode for testing
- Clear browser cookies and try again

**Docker errors:**
- Make sure Docker Desktop is running
- Try `docker compose down -v` then `docker compose up --build`

**"Connection refused" errors:**
- Backend may still be starting (check logs: `docker compose logs -f backend`)
- Wait 30 seconds and refresh

**Database reset:**
- `docker compose down -v` (WARNING: deletes all data)
- `docker compose up --build`

## Development Notes

- SQLite database persists in Docker volume `chord_db_data`
- Logs: `docker compose logs -f backend` or `docker compose logs -f frontend`
- Rebuild after code changes: `docker compose up --build`
- Stop services: `docker compose down`
- Remove volumes: `docker compose down -v`

## Port Configuration

- Main app: `http://localhost` (port 80)
- Backend API (internal): `http://localhost/api/`
- Frontend is served by nginx reverse proxy

If port 80 is already in use, edit `docker-compose.yml` to change the nginx port mapping from `80:80` to `8080:80` (or another available port), then access the app at `http://localhost:8080`
