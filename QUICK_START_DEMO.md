# 🚀 Quick Start with Demo Mode

Demo mode is now enabled! You can interact with the full app without setting up OAuth credentials.

## ✅ What's New

**Demo Login Button** - Click "🎭 Demo Login (Testing Only)" on the login page to bypass OAuth
- Instant access with full admin privileges
- No Google/Facebook credentials needed
- Perfect for testing and making changes

## 🏃 Run It Now

1. **Open PowerShell or Command Prompt**

2. **Navigate to the project:**
   ```powershell
   cd C:\Users\Sarah\Downloads\chord-app
   ```

3. **Start the app:**
   ```powershell
   docker compose up --build
   ```

4. **Wait 5-10 minutes** for first build (installing Node modules, Tesseract, etc.)
   - You'll see logs scrolling
   - Wait for: `backend-1  | INFO:     Started server process`

5. **Open your browser** to: `http://localhost`

6. **Click "🎭 Demo Login (Testing Only)"** button

7. **You're in!** 🎉

## 🎯 What You Can Do

Once logged in as demo admin, you can:

### ✅ Browse the Library
- Initially empty (no songs yet)
- See the 4 grouped sections:
  - 🇵🇭 Tagalog — Praise
  - 🇵🇭 Tagalog — Worship
  - 🌐 English — Praise
  - 🌐 English — Worship
- Use search and filters

### ✅ Add a Song
1. Click **"+ Add Song"** button (top right)
2. Try the OCR feature:
   - Upload a photo of a printed chord sheet
   - Click "Extract Chords via OCR"
   - Watch it extract the text (works best with clear, printed text)
3. OR manually type the song details:
   - **Title**: "Amazing Grace"
   - **Language**: English
   - **Category**: Worship
   - **Key**: C
   - **Chords**:
     ```
     Verse 1:
     C           F        C
     Amazing grace how sweet the sound
           Am      G
     That saved a wretch like me
     C             F         C
     I once was lost but now am found
           G          C
     Was blind but now I see
     ```
4. Click **"Save Song"**

### ✅ View & Transpose a Song
1. Click on any song card
2. See the 17-key selector grid
3. Click any key (e.g., "G") to transpose
4. Watch the chords update in real-time
5. Click the original key to reset

### ✅ Print a Chord Sheet
1. On song view page, click **"🖨 Print"**
2. Print dialog opens
3. All UI chrome is hidden (clean layout)
4. Just title, key, and chords

### ✅ Download as PDF
1. On song view page, click **"⬇ PDF"**
2. Downloads immediately
3. Includes current transposition (if you transposed)
4. Filename: `SongTitle-Key.pdf`

### ✅ Edit a Song
1. From song view, click **"Edit Song"** button
2. Modify any field
3. Save changes

### ✅ Delete a Song
1. From library, click **"Delete"** on any song card
2. Confirm deletion
3. Song removed immediately

### ✅ Manage Users (Admin Panel)
1. Click **"Admin"** button (top right)
2. See user table with:
   - Avatar, name, email, provider, role
3. Change user roles with dropdown
4. Your own role dropdown is disabled (can't change yourself)

**Note**: In demo mode, you're the only user. To test user management:
- Turn off demo mode (`DEMO_MODE=false` in `.env`)
- Set up real OAuth
- Have friends/team sign in
- Then promote them from "pending" to "viewer" or "admin"

## 🎨 Check Out the Design

- **Dark Theme**: Deep navy background (#0a0e1a)
- **Gold Accents**: Gold highlights (#f0c040) on buttons and headings
- **Typography**: Georgia serif for UI, Courier monospace for chords
- **Print Styles**: Clean, professional chord sheet printouts
- **Mobile Friendly**: Responsive design works on all devices

## 🔄 Making Changes

Want to modify something? After making code changes:

```powershell
# Stop the app
Ctrl + C

# Rebuild and restart
docker compose up --build
```

## 🐛 Troubleshooting

**"docker: command not found"**
- Make sure Docker Desktop is running
- Open Docker Desktop first, then try again

**Port 80 already in use**
- Edit `docker-compose.yml`
- Change `"80:80"` to `"8080:80"`
- Access at `http://localhost:8080`

**Build fails**
- Check Docker Desktop is running
- Try: `docker compose down -v` then `docker compose up --build`

**Page not loading**
- Wait for logs to show "Started server process"
- Refresh browser
- Check: `http://localhost/api/health` (should return `{"status":"healthy"}`)

## 📝 What to Tell Me

As you interact with the app, let me know:
- ✏️ UI/design changes you want
- 🐛 Bugs you find
- ✨ Features you want to add
- 🎨 Colors/fonts you want to change
- 📱 Layout improvements

I can update anything instantly!

## 🔒 Turning Off Demo Mode

When you're ready to use real OAuth:

1. Edit `.env` file:
   ```
   DEMO_MODE=false
   ```

2. Add real OAuth credentials (see `SETUP.md`)

3. Restart:
   ```powershell
   docker compose down
   docker compose up --build
   ```

---

**Ready to see it?** Run the commands above and click that demo button! 🎭✨
