# Railway Deployment Guide

## Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with your GitHub account

## Step 2: Deploy from GitHub

1. After signing in, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: **chichi-png/chord-app-**
4. Railway will automatically detect the Dockerfile and start building

## Step 3: Configure Environment Variables

Once the app is deployed, you need to add environment variables:

1. Click on your deployed service
2. Go to the **"Variables"** tab
3. Add these variables:

```
SECRET_KEY=your-super-secret-random-key-at-least-32-characters-long
DEMO_MODE=true
ADMIN_EMAIL=your-email@example.com
FRONTEND_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

**Important:**
- Generate a strong random string for `SECRET_KEY`
- Keep `DEMO_MODE=true` to enable demo login
- The `${{RAILWAY_PUBLIC_DOMAIN}}` will automatically use Railway's assigned domain

## Step 4: Optional - Add Google Vision API (Better OCR)

If you want handwriting recognition:

1. Get credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Download the service account JSON key
3. Add to Railway Variables tab:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/app/google-credentials.json
   ```
4. Add the JSON content as a file in Railway settings

## Step 5: Get Your Live Link

1. Go to the **"Settings"** tab
2. Under **"Domains"**, click **"Generate Domain"**
3. Railway will give you a public URL like: `https://chord-app-production.up.railway.app`

**That's your shareable link!** 🎉

## Using the App

- Navigate to your Railway URL
- Click **"Demo Login"** to test the app
- You'll have admin access to add, edit, and delete songs
- The OCR feature works for both typed and handwritten chord sheets

## Optional: Custom Domain

If you want a custom domain (like `chords.yourdomain.com`):

1. Go to **Settings → Domains**
2. Click **"Custom Domain"**
3. Add your domain and update DNS records as shown

---

## Troubleshooting

**Build fails:**
- Check Railway logs for errors
- Make sure all environment variables are set

**App won't start:**
- Verify `SECRET_KEY` is set
- Check that port 8000 is being used

**OCR not working:**
- Basic OCR (Tesseract) works out of the box
- For handwriting, add Google Vision API credentials

**Need help?**
- Check Railway logs in the "Deployments" tab
- Railway automatically retries failed deployments
