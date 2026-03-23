# Frontend Component Reference

Complete React frontend for Chord Manager application.

## Directory Structure

```
frontend/src/
├── contexts/
│   └── AuthContext.jsx          # Authentication context & hooks
├── pages/
│   ├── LoginPage.jsx            # OAuth login (Google/Facebook)
│   ├── LibraryPage.jsx          # Song library with search/filter
│   ├── SongPage.jsx             # Song viewer with transpose & PDF
│   ├── UploadPage.jsx           # Add new song with OCR
│   ├── EditSongPage.jsx         # Edit existing song
│   └── AdminPage.jsx            # User management (role changes)
├── utils/
│   └── api.js                   # Axios instance with auth interceptor
├── App.jsx                      # React Router with protected routes
└── index.js                     # ReactDOM entry point
```

## Pages Overview

### 1. LoginPage.jsx
**Route:** `/login`
**Access:** Public

**Features:**
- Google OAuth login button
- Facebook OAuth login button
- Pending approval state display
- Auto-redirect to library if already logged in

**Key Components:**
- `GoogleLogin` from `@react-oauth/google`
- `FacebookLogin` from `react-facebook-login`
- Pending approval UI with refresh button

---

### 2. LibraryPage.jsx
**Route:** `/`
**Access:** Protected (viewer + admin)

**Features:**
- Search bar (filters by song title)
- Language filter dropdown (All/Tagalog/English)
- Category filter dropdown (All/Praise/Worship)
- Songs grouped by language + category (4 groups)
- Click song card to view
- Admin-only: Edit and Delete buttons on cards
- Admin-only: "+ Add Song" and "Admin" buttons in header

**Song Groups:**
1. 🇵🇭 Tagalog — Praise
2. 🇵🇭 Tagalog — Worship
3. 🌐 English — Praise
4. 🌐 English — Worship

**API Calls:**
- `GET /api/songs` - Fetch all songs
- `DELETE /api/songs/:id` - Delete song (admin only)

---

### 3. SongPage.jsx
**Route:** `/songs/:id`
**Access:** Protected (viewer + admin)

**Features:**
- Song title, metadata display (language, category, original key)
- 17-key transpose selector (C, C#, D, D#, E, F, F#, G, G#, A, A#, B, Db, Eb, Gb, Ab, Bb)
- Real-time transpose via API
- Print button (triggers browser print dialog)
- Download PDF button
- Chords display in monospace
- Print-friendly CSS (hides UI elements, shows print-only header)

**API Calls:**
- `GET /api/songs/:id` - Fetch song details
- `POST /api/transpose` - Transpose chords to target key
- `POST /api/songs/:id/pdf` - Generate PDF (blob download)

**Print CSS:**
- `.no-print` class hides: header, key selector, action buttons
- `.print-only` class shows: print-specific header

---

### 4. UploadPage.jsx
**Route:** `/upload`
**Access:** Admin only

**Features:**
- Two-column layout:
  - **Left:** Image upload + OCR extraction
  - **Right:** Song form
- Image upload with preview
- OCR button (extracts text from image)
- Song form fields:
  - Title (required text input)
  - Original Key (dropdown, 17 keys)
  - Language (dropdown: Tagalog/English)
  - Category (dropdown: Praise/Worship)
  - Chords (textarea, required)
- Submit button (creates new song)

**API Calls:**
- `POST /api/ocr` - Extract text from image (FormData)
- `POST /api/songs` - Create new song

**Workflow:**
1. (Optional) Upload image → Click OCR → Text extracted to chords textarea
2. Fill title, key, language, category
3. Edit chords textarea if needed
4. Submit → Redirects to new song page

---

### 5. EditSongPage.jsx
**Route:** `/songs/:id/edit`
**Access:** Admin only

**Features:**
- Pre-filled form with existing song data
- Same fields as UploadPage (minus OCR section)
- Save Changes button
- Cancel button (confirms before discarding)

**API Calls:**
- `GET /api/songs/:id` - Load song data
- `PUT /api/songs/:id` - Update song

---

### 6. AdminPage.jsx
**Route:** `/admin`
**Access:** Admin only

**Features:**
- User table with columns:
  - Avatar
  - Name
  - Email
  - OAuth Provider (Google/Facebook)
  - Role (dropdown: pending/viewer/admin)
  - Created date
- Role dropdown disabled for current user ("You")
- Stats cards:
  - Total Users
  - Pending Approval
  - Viewers
  - Admins

**API Calls:**
- `GET /api/users` - Fetch all users
- `PUT /api/users/:id/role` - Update user role

---

## Core Components

### App.jsx
**Purpose:** React Router setup with route protection

**Route Protection:**
- `<ProtectedRoute>` - Requires authenticated user (not pending)
- `<AdminRoute>` - Requires admin role
- Auto-redirects to `/login` if not authenticated
- Auto-redirects to `/` if non-admin tries to access admin routes

**Routes:**
```
/login               → LoginPage (public)
/                    → LibraryPage (protected)
/songs/:id           → SongPage (protected)
/upload              → UploadPage (admin)
/songs/:id/edit      → EditSongPage (admin)
/admin               → AdminPage (admin)
*                    → Redirect to /
```

---

### AuthContext.jsx
**Purpose:** Authentication state management

**Exports:**
- `AuthProvider` - Context provider component
- `useAuth()` - Hook to access auth state

**State:**
- `user` - Current user object (null if logged out)
- `token` - JWT token
- `loading` - Initial load state

**Methods:**
- `login(accessToken, provider)` - Authenticate via OAuth
- `logout()` - Clear auth state
- `isAdmin()` - Check if user is admin
- `isPending()` - Check if user is pending approval
- `isViewer()` - Check if user is viewer

**Persistence:**
- Stores `token` and `user` in localStorage
- Auto-loads on mount

---

## Design System

### Color Palette
- **Background:** `#0a0e1a` (dark navy)
- **Cards:** `#1a1f2e` (lighter navy)
- **Primary (Gold):** `#f0c040`
- **Text:** `#ffffff` (white)
- **Muted Text:** `#aaa` (gray)
- **Borders:** `#333` (dark gray)
- **Secondary Buttons:** `#444` (medium gray)

### Typography
- **Font Family:** Georgia, serif (main)
- **Headings:** Gold (#f0c040) with Georgia font
- **Body:** White (#fff) on dark background

### Button Styles
1. **Primary (Gold):** `#f0c040` background, `#0a0e1a` text
2. **Secondary:** `#333` background, `#f0c040` text, gold border
3. **Tertiary:** `#444` background, white text
4. **Disabled:** `#555` background, `#888` text

### Layout
- **Max Width:** 900px (single column), 1400px (multi-column)
- **Cards:** `#1a1f2e` background, 12px border radius, 30px padding
- **Spacing:** 20px base, 30px sections

---

## API Integration

### Base Configuration
- **Base URL:** `/api`
- **Auth:** JWT token in `Authorization: Bearer <token>` header
- **Interceptors:**
  - Request: Attaches token from localStorage
  - Response: Handles 401 (auto-logout and redirect)

### Endpoints Used

**Auth:**
- `POST /auth/oauth` - Exchange OAuth token for JWT

**Songs:**
- `GET /songs` - List all songs
- `GET /songs/:id` - Get single song
- `POST /songs` - Create song (admin)
- `PUT /songs/:id` - Update song (admin)
- `DELETE /songs/:id` - Delete song (admin)
- `POST /songs/:id/pdf` - Generate PDF

**Transpose:**
- `POST /transpose` - Transpose chords

**OCR:**
- `POST /ocr` - Extract text from image

**Users:**
- `GET /users` - List all users (admin)
- `PUT /users/:id/role` - Update user role (admin)

---

## Print Functionality

### CSS Classes
- `.no-print` - Hidden when printing (header, buttons, controls)
- `.print-only` - Visible only when printing (print header)

### Print Styles (in public/index.html)
```css
@media print {
  .no-print { display: none !important; }
  body { background-color: white; color: black; }
  .print-only { display: block !important; }
}
```

### Print Flow (SongPage)
1. User clicks "🖨️ Print" button
2. `window.print()` triggers browser print dialog
3. CSS hides UI elements (`.no-print`)
4. Shows simplified header (`.print-only`)
5. Chords display in black text on white background

---

## Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "axios": "^1.6.5",
  "@react-oauth/google": "^0.12.1",
  "react-facebook-login": "^4.1.1",
  "react-scripts": "^5.0.1"
}
```

---

## Environment Variables

Create `frontend/.env` file:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
```

---

## Running the Frontend

```bash
cd frontend
npm install
npm start
```

Access at: `http://localhost:3000`

---

## Key Features Summary

✅ **Authentication:** OAuth (Google/Facebook) with JWT
✅ **Role-Based Access:** Pending, Viewer, Admin
✅ **Song Library:** Search, filter, grouped display
✅ **Transpose:** 17-key transpose with live API calls
✅ **OCR:** Image upload → text extraction
✅ **PDF Generation:** Download transposed chord sheets
✅ **Print-Friendly:** Clean print layout
✅ **Admin Panel:** User management, role changes
✅ **Protected Routes:** Auto-redirect based on auth/role
✅ **Dark Theme:** Navy background, gold accents, Georgia font

---

## File Sizes

```
LoginPage.jsx     - 6.0 KB (232 lines)
LibraryPage.jsx   - 9.8 KB (350+ lines)
SongPage.jsx      - 9.9 KB (312 lines)
UploadPage.jsx    - 12.9 KB (400+ lines)
EditSongPage.jsx  - 10.0 KB (330 lines)
AdminPage.jsx     - 10.3 KB (340 lines)
App.jsx           - 3.1 KB (130 lines)
AuthContext.jsx   - 2.0 KB (86 lines)
api.js            - 1.0 KB (40 lines)
index.js          - 0.2 KB (9 lines)
```

Total: ~65 KB (production-ready code)

---

**Status:** ✅ All 7 components complete and production-ready
