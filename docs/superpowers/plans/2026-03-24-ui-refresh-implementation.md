# UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform cold monochrome UI into warm, approachable interface with earth tones, modern typography, and polished components.

**Architecture:** Page-by-page refactoring of inline styles in existing React components. No structural changes, just visual design system update. Start with most-visible pages (Library, Song) then progress to admin pages.

**Tech Stack:** React 18, inline styles (existing pattern), no new dependencies

---

## File Structure

**Files to Modify:**
- `frontend/src/App.jsx` - Loading states styling
- `frontend/src/pages/LibraryPage.jsx` - Main library with song list
- `frontend/src/pages/SongPage.jsx` - Song view with transpose controls
- `frontend/src/pages/LoginPage.jsx` - OAuth login page
- `frontend/src/pages/UploadPage.jsx` - Admin song upload
- `frontend/src/pages/EditSongPage.jsx` - Admin song editing
- `frontend/src/pages/AdminPage.jsx` - User management

**Files to Create:**
- `frontend/src/styles/designSystem.js` - Reusable style constants

**Reference:**
- `docs/superpowers/specs/2026-03-24-ui-refresh-design.md` - Complete design spec

---

## Design System Constants

### Task 1: Create Design System Module

**Files:**
- Create: `frontend/src/styles/designSystem.js`

This provides reusable constants for all pages.

- [ ] **Step 1: Create styles directory and design system file**

```bash
mkdir -p frontend/src/styles
```

Create `frontend/src/styles/designSystem.js`:

```javascript
// Design System - Warm & Approachable
// Based on: docs/superpowers/specs/2026-03-24-ui-refresh-design.md

export const colors = {
  // Base colors
  background: '#f4e8d8',       // Rich cream
  cardBg: '#ffffff',           // Pure white
  primaryAccent: '#d4a574',    // Golden tan
  darkText: '#2c1810',         // Deep brown
  secondaryText: '#8d7a6a',    // Medium brown

  // Functional colors
  border: 'rgba(44,24,16,0.1)',
  borderDark: 'rgba(44,24,16,0.15)',
  shadow: 'rgba(44,24,16,0.06)',
  shadowMedium: 'rgba(44,24,16,0.1)',
  keyBadgeBg: 'rgba(212,165,116,0.15)',
  keyBadgeBorder: 'rgba(212,165,116,0.3)',
  focusRing: 'rgba(212,165,116,0.2)',

  // Interactive states
  hoverAccent: '#c89560',
  hoverBg: 'rgba(44,24,16,0.02)',

  // State colors (warm tints)
  error: '#d44a4a',
  errorBg: 'rgba(212,74,74,0.1)',
  errorBorder: 'rgba(212,74,74,0.3)',
  success: '#6b9b6a',
  successBg: 'rgba(107,155,106,0.1)',
  successBorder: 'rgba(107,155,106,0.3)',

  // Role badge colors (warm palette)
  roleAdmin: '#d4a574',      // Golden tan (matches primary)
  roleAdminText: '#2c1810',
  roleViewer: '#6b9b6a',     // Warm green
  roleViewerText: '#ffffff',
  rolePending: '#d4a574',    // Warm orange/tan
  rolePendingText: '#2c1810',
};

export const typography = {
  fontFamily: "system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  fontFamilyMono: "'Consolas', 'Monaco', 'Courier New', monospace",

  // Font sizes
  appTitle: '20px',
  heading: '18px',
  songTitle: '15px',
  body: '14px',
  metadata: '12px',
  small: '11px',

  // Font weights
  normal: 400,
  medium: 500,
  semibold: 600,

  // Line heights
  tight: 1.2,
  normal: 1.6,
  relaxed: 1.8,
};

export const spacing = {
  // Padding
  cardPadding: '14px 16px',
  buttonPaddingSmall: '10px 20px',
  buttonPaddingMedium: '12px 24px',
  inputPadding: '11px 16px',
  containerPadding: '24px',

  // Gaps
  listGap: '10px',
  sectionGap: '24px',
  formGap: '12px',
  headerGap: '12px',
};

export const borderRadius = {
  button: '12px',
  input: '12px',
  card: '12px',
  badge: '8px',
  small: '6px',
};

export const shadows = {
  card: '0 2px 8px rgba(44,24,16,0.06)',
  button: '0 2px 6px rgba(44,24,16,0.1)',
  inputFocus: '0 0 0 3px rgba(212,165,116,0.2)',
  cardHover: '0 4px 12px rgba(44,24,16,0.1)',
};

export const transitions = {
  default: 'all 0.2s ease',
};

// Component style builders
export const components = {
  buttonPrimary: {
    background: colors.primaryAccent,
    color: colors.darkText,
    border: 'none',
    borderRadius: borderRadius.button,
    padding: spacing.buttonPaddingSmall,
    fontSize: typography.body,
    fontWeight: typography.medium,
    boxShadow: shadows.button,
    transition: transitions.default,
    cursor: 'pointer',
  },

  buttonSecondary: {
    background: colors.cardBg,
    color: colors.darkText,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: borderRadius.button,
    padding: spacing.buttonPaddingSmall,
    fontSize: typography.body,
    fontWeight: typography.medium,
    transition: transitions.default,
    cursor: 'pointer',
  },

  input: {
    background: colors.cardBg,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: borderRadius.input,
    padding: spacing.inputPadding,
    fontSize: typography.body,
    color: colors.darkText,
    transition: transitions.default,
  },

  card: {
    background: colors.cardBg,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.card,
    padding: spacing.cardPadding,
    boxShadow: shadows.card,
    transition: transitions.default,
  },

  keyBadge: {
    background: colors.keyBadgeBg,
    color: colors.darkText,
    padding: '6px 12px',
    borderRadius: borderRadius.badge,
    fontSize: '13px',
    fontWeight: typography.semibold,
    border: `1px solid ${colors.keyBadgeBorder}`,
  },
};
```

- [ ] **Step 2: Verify file and test imports**

Run: `ls -la frontend/src/styles/`
Expected: `designSystem.js` exists

Test that the module can be imported:
```bash
cd frontend && npm start
```
Should start without import errors (Ctrl+C to stop once verified)

- [ ] **Step 3: Commit**

```bash
git add frontend/src/styles/designSystem.js
git commit -m "feat: add design system constants module

- Warm earth color palette
- Typography scale and font stacks
- Spacing and border radius values
- Component style builders

Based on UI refresh spec 2026-03-24"
```

---

## Page Updates

### Task 2: Update App.jsx Loading States

**Files:**
- Modify: `frontend/src/App.jsx:122-135` (loading styles)

Update loading spinner to use new design system.

- [ ] **Step 1: Import design system**

Add to top of `frontend/src/App.jsx`:

```javascript
import { colors, typography } from './styles/designSystem';
```

- [ ] **Step 2: Update loading container styles**

Replace the `styles` object at bottom of file:

```javascript
const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: colors.background,
  },
  loadingSpinner: {
    fontSize: '24px',
    color: colors.primaryAccent,
    fontFamily: typography.fontFamily,
    fontWeight: typography.medium,
  },
};
```

- [ ] **Step 3: Test loading state**

Run: `cd frontend && npm start`
Navigate to app, verify loading spinner appears with warm cream background

- [ ] **Step 4: Commit**

```bash
git add frontend/src/App.jsx
git commit -m "style: update App loading states with warm design"
```

---

### Task 3: Update LibraryPage

**Files:**
- Modify: `frontend/src/pages/LibraryPage.jsx:267-416` (styles object)

Transform from dark monochrome to warm list-based layout.

- [ ] **Step 1: Import design system**

Add to top of `LibraryPage.jsx`:

```javascript
import { colors, typography, spacing, borderRadius, shadows, transitions, components } from '../styles/designSystem';
```

- [ ] **Step 2: Replace styles object**

Replace entire `styles` object at bottom of file with:

```javascript
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background,
    color: colors.darkText,
    padding: spacing.containerPadding,
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: colors.secondaryText,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sectionGap,
    paddingBottom: '16px',
    borderBottom: `2px solid ${colors.border}`,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: typography.appTitle,
    color: colors.darkText,
    margin: 0,
    fontWeight: typography.medium,
    letterSpacing: '-0.3px',
    fontFamily: typography.fontFamily,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.headerGap,
  },
  addButton: {
    ...components.buttonPrimary,
  },
  adminButton: {
    ...components.buttonSecondary,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userName: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
  },
  logoutButton: {
    ...components.buttonSecondary,
  },
  filters: {
    display: 'flex',
    gap: spacing.formGap,
    marginBottom: spacing.sectionGap,
    flexWrap: 'wrap',
  },
  searchInput: {
    ...components.input,
    flex: 1,
    minWidth: '200px',
  },
  select: {
    ...components.input,
    minWidth: '150px',
  },
  error: {
    color: '#d44a4a',
    padding: '12px',
    backgroundColor: 'rgba(212,74,74,0.1)',
    borderRadius: borderRadius.card,
    marginBottom: spacing.sectionGap,
  },
  content: {
    maxWidth: '100%',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px',
    color: colors.secondaryText,
  },
  group: {
    marginBottom: '32px',
  },
  groupTitle: {
    fontSize: typography.heading,
    fontWeight: typography.medium,
    color: colors.darkText,
    marginBottom: '16px',
    letterSpacing: '-0.3px',
    fontFamily: typography.fontFamily,
  },
  songGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.listGap,
  },
  songCard: {
    ...components.card,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songCardContent: {
    flex: 1,
  },
  songTitle: {
    fontSize: typography.songTitle,
    fontWeight: typography.medium,
    color: colors.darkText,
    margin: '0 0 4px 0',
    fontFamily: typography.fontFamily,
  },
  songKey: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
    margin: 0,
    fontFamily: typography.fontFamily,
  },
  songActions: {
    display: 'flex',
    gap: '8px',
    marginLeft: '16px',
  },
  editButton: {
    background: colors.cardBg,
    color: colors.darkText,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: borderRadius.small,
    padding: '6px 12px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: typography.normal,
    fontFamily: typography.fontFamily,
    transition: transitions.default,
  },
  deleteButton: {
    background: 'rgba(212,74,74,0.05)',
    color: '#d44a4a',
    border: '1px solid rgba(212,74,74,0.2)',
    borderRadius: borderRadius.small,
    padding: '6px 12px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: typography.normal,
    fontFamily: typography.fontFamily,
    transition: transitions.default,
  },
};
```

- [ ] **Step 3: Add hover styles to song cards**

Add inline hover handler to `songCard` in JSX. Find the line with `<div key={song.id} style={styles.songCard}` and update:

```javascript
<div
  key={song.id}
  style={styles.songCard}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = shadows.cardHover;
    e.currentTarget.style.borderColor = colors.borderDark;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = shadows.card;
    e.currentTarget.style.borderColor = colors.border;
  }}
  onClick={() => onSongClick(song.id)}
>
```

- [ ] **Step 4: Update SongGroup to display as list rows**

In the `SongGroup` component, change `songGrid` to use list layout. Update the JSX structure:

```javascript
<div style={styles.songGrid}>
  {songs.map(song => (
    <div
      key={song.id}
      style={styles.songCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.cardHover;
        e.currentTarget.style.borderColor = colors.borderDark;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = shadows.card;
        e.currentTarget.style.borderColor = colors.border;
      }}
      onClick={() => onSongClick(song.id)}
    >
      <div style={styles.songCardContent}>
        <h3 style={styles.songTitle}>{song.title}</h3>
        <p style={styles.songKey}>{song.language} · {song.category}</p>
      </div>
      <div style={{...components.keyBadge}}>
        {song.original_key}
      </div>
      {isAdmin && (
        <div style={styles.songActions} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(song.id)} style={styles.editButton}>
            Edit
          </button>
          <button onClick={() => onDelete(song.id, song.title)} style={styles.deleteButton}>
            Delete
          </button>
        </div>
      )}
    </div>
  ))}
</div>
```

- [ ] **Step 5: Test library page**

Run: `npm start` and navigate to `/`
Verify:
- Warm cream background
- White song cards in list layout
- Golden accent buttons
- Key badges with warm background
- Hover states work

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/LibraryPage.jsx
git commit -m "style: transform LibraryPage to warm list layout

- List-based song rows instead of grid cards
- Key displayed in warm badge on right
- Hover states with shadow increase
- Modern sans-serif typography"
```

---

### Task 4: Update SongPage

**Files:**
- Modify: `frontend/src/pages/SongPage.jsx:191-377` (styles object)

Update song viewing and transpose page.

- [ ] **Step 1: Import design system**

Add to top of `SongPage.jsx`:

```javascript
import { colors, typography, spacing, borderRadius, shadows, transitions, components } from '../styles/designSystem';
```

- [ ] **Step 2: Replace styles object**

Replace entire `styles` object:

```javascript
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background,
    color: colors.darkText,
    padding: spacing.containerPadding,
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: colors.secondaryText,
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#d44a4a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sectionGap,
    paddingBottom: '16px',
    borderBottom: `2px solid ${colors.border}`,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.headerGap,
  },
  backButton: {
    background: 'transparent',
    color: colors.primaryAccent,
    border: `1px solid ${colors.primaryAccent}`,
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: typography.body,
    fontWeight: typography.medium,
    cursor: 'pointer',
    fontFamily: typography.fontFamily,
    transition: transitions.default,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userName: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
  },
  logoutButton: {
    ...components.buttonSecondary,
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  songTitle: {
    fontSize: '28px',
    color: colors.darkText,
    marginBottom: '10px',
    textAlign: 'center',
    fontFamily: typography.fontFamily,
    fontWeight: typography.medium,
  },
  metadata: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: spacing.sectionGap,
    fontSize: typography.metadata,
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
  },
  metadataItem: {
    padding: '5px 10px',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.small,
    border: `1px solid ${colors.border}`,
  },
  keySelector: {
    marginBottom: spacing.sectionGap,
    padding: '20px',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.card,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.card,
  },
  keySelectorLabel: {
    display: 'block',
    fontSize: typography.body,
    color: colors.darkText,
    marginBottom: '15px',
    fontWeight: typography.medium,
    fontFamily: typography.fontFamily,
  },
  keyButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  keyButton: {
    padding: '10px 16px',
    backgroundColor: colors.cardBg,
    color: colors.darkText,
    border: `1px solid ${colors.borderDark}`,
    borderRadius: borderRadius.small,
    fontSize: typography.body,
    fontWeight: typography.semibold,
    cursor: 'pointer',
    minWidth: '50px',
    transition: transitions.default,
    fontFamily: typography.fontFamily,
  },
  keyButtonActive: {
    backgroundColor: colors.primaryAccent,
    color: colors.darkText,
    borderColor: colors.primaryAccent,
  },
  transposingMessage: {
    marginTop: '15px',
    color: colors.primaryAccent,
    fontSize: typography.body,
    fontFamily: typography.fontFamily,
  },
  actions: {
    display: 'flex',
    gap: spacing.formGap,
    marginBottom: spacing.sectionGap,
    justifyContent: 'center',
  },
  printButton: {
    background: colors.cardBg,
    color: colors.primaryAccent,
    border: `1px solid ${colors.primaryAccent}`,
    borderRadius: borderRadius.button,
    padding: spacing.buttonPaddingSmall,
    fontSize: typography.body,
    fontWeight: typography.semibold,
    cursor: 'pointer',
    fontFamily: typography.fontFamily,
    transition: transitions.default,
  },
  pdfButton: {
    ...components.buttonPrimary,
    fontWeight: typography.semibold,
  },
  chordsContainer: {
    backgroundColor: colors.cardBg,
    padding: '30px',
    borderRadius: borderRadius.card,
    marginBottom: spacing.sectionGap,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.card,
  },
  chordsText: {
    fontSize: typography.body,
    lineHeight: typography.relaxed,
    color: colors.darkText,
    fontFamily: typography.fontFamilyMono,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  printHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  printTitle: {
    fontSize: '32px',
    marginBottom: '10px',
    fontFamily: typography.fontFamily,
  },
  printMetadata: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
  },
};
```

- [ ] **Step 3: Test song page**

Navigate to any song page
Verify:
- Warm background and white content cards
- Key selector pills with warm styling
- Active key highlighted in golden accent
- Print and PDF buttons styled correctly
- Chords display in monospace on white card

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/SongPage.jsx
git commit -m "style: update SongPage with warm design system

- White card for chord display
- Warm key selector pills
- Golden accent for active key and buttons
- Consistent with design spec"
```

---

### Task 5: Update LoginPage

**Files:**
- Modify: `frontend/src/pages/LoginPage.jsx:161-295` (styles object)

Update OAuth login page.

- [ ] **Step 1: Import design system**

Add to top of `LoginPage.jsx`:

```javascript
import { colors, typography, spacing, borderRadius, shadows, components } from '../styles/designSystem';
```

- [ ] **Step 2: Replace styles object**

```javascript
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.containerPadding,
  },
  card: {
    backgroundColor: colors.cardBg,
    padding: '40px',
    borderRadius: '16px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 16px rgba(44,24,16,0.08)',
  },
  title: {
    fontSize: '28px',
    marginBottom: '10px',
    color: colors.darkText,
    fontFamily: typography.fontFamily,
    fontWeight: typography.medium,
    letterSpacing: '-0.3px',
  },
  subtitle: {
    fontSize: typography.songTitle,
    color: colors.secondaryText,
    marginBottom: '40px',
    fontWeight: typography.normal,
    fontFamily: typography.fontFamily,
  },
  loginButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.formGap,
    alignItems: 'center',
  },
  googleButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  facebookButton: {
    width: '300px',
    padding: spacing.buttonPaddingSmall,
    backgroundColor: '#1877f2',
    color: 'white',
    border: 'none',
    borderRadius: borderRadius.button,
    fontSize: typography.body,
    fontWeight: typography.semibold,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: typography.fontFamily,
    transition: transitions.default,
  },
  facebookIcon: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  error: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: 'rgba(212,74,74,0.1)',
    color: '#d44a4a',
    borderRadius: borderRadius.small,
    fontSize: typography.body,
    border: '1px solid rgba(212,74,74,0.3)',
    fontFamily: typography.fontFamily,
  },
  loading: {
    marginTop: '20px',
    color: colors.darkText,
    fontSize: typography.body,
    fontFamily: typography.fontFamily,
  },
  pendingContainer: {
    padding: '20px',
  },
  pendingIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  pendingTitle: {
    fontSize: typography.heading,
    color: colors.darkText,
    marginBottom: '15px',
    fontFamily: typography.fontFamily,
    fontWeight: typography.medium,
  },
  pendingText: {
    fontSize: typography.body,
    color: colors.secondaryText,
    lineHeight: typography.normal,
    marginBottom: '25px',
    fontFamily: typography.fontFamily,
  },
  refreshButton: {
    ...components.buttonPrimary,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '20px 0 10px 0',
  },
  dividerText: {
    padding: '0 10px',
    color: colors.secondaryText,
    fontSize: typography.small,
    fontWeight: typography.semibold,
    fontFamily: typography.fontFamily,
  },
  demoButton: {
    width: '300px',
    ...components.buttonPrimary,
  },
  demoNote: {
    fontSize: typography.small,
    color: colors.secondaryText,
    margin: '10px 0 0 0',
    maxWidth: '300px',
    lineHeight: 1.4,
    fontFamily: typography.fontFamily,
  },
};
```

- [ ] **Step 3: Test login page**

Navigate to `/login`
Verify:
- Warm cream background
- White centered card with soft shadow
- Golden demo button
- Proper typography

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/LoginPage.jsx
git commit -m "style: update LoginPage with warm design

- Centered white card on cream background
- Golden accent on demo button
- Modern typography throughout"
```

---

### Task 6: Update UploadPage

**Files:**
- Modify: `frontend/src/pages/UploadPage.jsx` (styles object, find around line 100+)

Update admin upload page with warm design.

- [ ] **Step 1: Import design system**

Add to top of `UploadPage.jsx`:

```javascript
import { colors, typography, spacing, borderRadius, shadows, transitions, components } from '../styles/designSystem';
```

- [ ] **Step 2: Replace styles object**

Replace entire `styles` object at bottom of file. Key areas:

```javascript
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background,
    color: colors.darkText,
    padding: spacing.containerPadding,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sectionGap,
    paddingBottom: '16px',
    borderBottom: `2px solid ${colors.border}`,
  },
  headerLeft: {},
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.headerGap,
  },
  backButton: {
    background: 'transparent',
    color: colors.primaryAccent,
    border: `1px solid ${colors.primaryAccent}`,
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: typography.body,
    fontWeight: typography.medium,
    cursor: 'pointer',
    fontFamily: typography.fontFamily,
    transition: transitions.default,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userName: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
  },
  logoutButton: {
    ...components.buttonSecondary,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: typography.heading,
    color: colors.darkText,
    marginBottom: spacing.sectionGap,
    fontFamily: typography.fontFamily,
    fontWeight: typography.medium,
  },
  formLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  section: {
    backgroundColor: colors.cardBg,
    padding: '24px',
    borderRadius: borderRadius.card,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.card,
  },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: typography.medium,
    color: colors.darkText,
    marginBottom: '16px',
    fontFamily: typography.fontFamily,
  },
  imageUpload: {
    marginBottom: '16px',
  },
  imageInput: {
    display: 'block',
    marginBottom: '12px',
    fontSize: typography.body,
    fontFamily: typography.fontFamily,
  },
  imagePreview: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: borderRadius.small,
    marginBottom: '12px',
    border: `1px solid ${colors.border}`,
  },
  ocrButton: {
    ...components.buttonSecondary,
    width: '100%',
  },
  ocrError: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: colors.errorBg,
    color: colors.error,
    borderRadius: borderRadius.small,
    fontSize: typography.metadata,
    border: `1px solid ${colors.errorBorder}`,
    fontFamily: typography.fontFamily,
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: typography.body,
    fontWeight: typography.medium,
    color: colors.darkText,
    marginBottom: '8px',
    fontFamily: typography.fontFamily,
  },
  input: {
    ...components.input,
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    ...components.input,
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    ...components.input,
    width: '100%',
    minHeight: '300px',
    resize: 'vertical',
    fontFamily: typography.fontFamilyMono,
    fontSize: '14px',
    lineHeight: typography.relaxed,
    boxSizing: 'border-box',
  },
  submitButton: {
    ...components.buttonPrimary,
    width: '100%',
    padding: spacing.buttonPaddingMedium,
    fontSize: typography.body,
  },
  '@media (max-width: 768px)': {
    formLayout: {
      gridTemplateColumns: '1fr',
    },
  },
};
```

- [ ] **Step 3: Test upload page**

Navigate to `/upload` (as admin)
Verify:
- Two-column layout (image upload left, form right)
- White cards on cream background
- Form inputs styled consistently
- OCR button matches design
- Textarea for chords uses monospace
- Submit button golden accent
- Error messages (if any) use warm red

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/UploadPage.jsx
git commit -m "style: update UploadPage with warm design system

- Two-column layout with white cards
- Consistent input and button styling
- Warm error state colors
- Monospace preserved for chord textarea"
```

---

### Task 7: Update EditSongPage

**Files:**
- Modify: `frontend/src/pages/EditSongPage.jsx` (styles object)

Update admin edit page - similar to UploadPage but single column form.

- [ ] **Step 1: Import design system**

Add to top of `EditSongPage.jsx`:

```javascript
import { colors, typography, spacing, borderRadius, shadows, transitions, components } from '../styles/designSystem';
```

- [ ] **Step 2: Replace styles object**

Replace entire `styles` object. Similar to UploadPage but single column:

```javascript
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background,
    color: colors.darkText,
    padding: spacing.containerPadding,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sectionGap,
    paddingBottom: '16px',
    borderBottom: `2px solid ${colors.border}`,
  },
  headerLeft: {},
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.headerGap,
  },
  backButton: {
    background: 'transparent',
    color: colors.primaryAccent,
    border: `1px solid ${colors.primaryAccent}`,
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: typography.body,
    fontWeight: typography.medium,
    cursor: 'pointer',
    fontFamily: typography.fontFamily,
    transition: transitions.default,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userName: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
  },
  logoutButton: {
    ...components.buttonSecondary,
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: typography.heading,
    color: colors.darkText,
    marginBottom: spacing.sectionGap,
    fontFamily: typography.fontFamily,
    fontWeight: typography.medium,
  },
  form: {
    backgroundColor: colors.cardBg,
    padding: '24px',
    borderRadius: borderRadius.card,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.card,
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: typography.body,
    fontWeight: typography.medium,
    color: colors.darkText,
    marginBottom: '8px',
    fontFamily: typography.fontFamily,
  },
  input: {
    ...components.input,
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    ...components.input,
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    ...components.input,
    width: '100%',
    minHeight: '300px',
    resize: 'vertical',
    fontFamily: typography.fontFamilyMono,
    fontSize: '14px',
    lineHeight: typography.relaxed,
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: spacing.formGap,
    marginTop: '24px',
  },
  submitButton: {
    ...components.buttonPrimary,
    flex: 1,
    padding: spacing.buttonPaddingSmall,
  },
  cancelButton: {
    ...components.buttonSecondary,
    flex: 1,
    padding: spacing.buttonPaddingSmall,
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: colors.secondaryText,
  },
  error: {
    padding: '12px',
    backgroundColor: colors.errorBg,
    color: colors.error,
    borderRadius: borderRadius.small,
    marginBottom: '16px',
    border: `1px solid ${colors.errorBorder}`,
    fontFamily: typography.fontFamily,
  },
};
```

- [ ] **Step 3: Test edit page**

Navigate to any song's edit page (as admin via "Edit" button)
Verify:
- Single column form in white card
- All inputs styled consistently
- Textarea uses monospace font
- Cancel and Save buttons side-by-side
- Error messages (if triggered) use warm red
- Form validation states work

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/EditSongPage.jsx
git commit -m "style: update EditSongPage with warm design system

- Single column form layout
- Consistent input styling
- Cancel/Save button group
- Warm error states"
```

---

### Task 8: Update AdminPage

**Files:**
- Modify: `frontend/src/pages/AdminPage.jsx` (styles object and getRoleBadgeStyle function)

Update user management page with warm colors and role badges.

- [ ] **Step 1: Import design system**

Add to top of `AdminPage.jsx`:

```javascript
import { colors, typography, spacing, borderRadius, shadows, transitions, components } from '../styles/designSystem';
```

- [ ] **Step 2: Update getRoleBadgeStyle function**

Replace the `getRoleBadgeStyle` function (around line 50) with warm palette colors:

```javascript
const getRoleBadgeStyle = (role) => {
  const baseStyle = {
    padding: '4px 10px',
    borderRadius: borderRadius.badge,
    fontSize: typography.small,
    fontWeight: typography.semibold,
    display: 'inline-block',
    fontFamily: typography.fontFamily,
  };

  switch (role) {
    case 'admin':
      return {
        ...baseStyle,
        backgroundColor: colors.roleAdmin,
        color: colors.roleAdminText,
      };
    case 'viewer':
      return {
        ...baseStyle,
        backgroundColor: colors.roleViewer,
        color: colors.roleViewerText,
      };
    case 'pending':
      return {
        ...baseStyle,
        backgroundColor: 'rgba(212,165,116,0.2)',
        color: colors.rolePendingText,
        border: `1px solid ${colors.rolePending}`,
      };
    default:
      return baseStyle;
  }
};
```

- [ ] **Step 3: Replace styles object**

Replace entire `styles` object:

```javascript
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.background,
    color: colors.darkText,
    padding: spacing.containerPadding,
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: colors.secondaryText,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sectionGap,
    paddingBottom: '16px',
    borderBottom: `2px solid ${colors.border}`,
  },
  headerLeft: {},
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.headerGap,
  },
  backButton: {
    background: 'transparent',
    color: colors.primaryAccent,
    border: `1px solid ${colors.primaryAccent}`,
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: typography.body,
    fontWeight: typography.medium,
    cursor: 'pointer',
    fontFamily: typography.fontFamily,
    transition: transitions.default,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userName: {
    fontSize: typography.metadata,
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
  },
  logoutButton: {
    ...components.buttonSecondary,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: typography.heading,
    color: colors.darkText,
    marginBottom: spacing.sectionGap,
    fontFamily: typography.fontFamily,
    fontWeight: typography.medium,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: colors.cardBg,
    padding: '20px',
    borderRadius: borderRadius.card,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.card,
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: typography.semibold,
    color: colors.primaryAccent,
    marginBottom: '8px',
    fontFamily: typography.fontFamily,
  },
  statLabel: {
    fontSize: typography.body,
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
  },
  tableContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.card,
    border: `1px solid ${colors.border}`,
    boxShadow: shadows.card,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: 'rgba(44,24,16,0.02)',
    borderBottom: `2px solid ${colors.border}`,
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.darkText,
    fontFamily: typography.fontFamily,
  },
  td: {
    padding: '16px',
    borderBottom: `1px solid ${colors.border}`,
    fontSize: typography.body,
    color: colors.darkText,
    fontFamily: typography.fontFamily,
  },
  userRow: {
    transition: transitions.default,
  },
  avatarCell: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
  },
  roleSelect: {
    ...components.input,
    padding: '6px 12px',
    fontSize: typography.metadata,
  },
  youBadge: {
    marginLeft: '8px',
    padding: '2px 8px',
    backgroundColor: 'rgba(212,165,116,0.15)',
    borderRadius: borderRadius.small,
    fontSize: typography.small,
    color: colors.secondaryText,
    fontFamily: typography.fontFamily,
  },
  error: {
    padding: '12px',
    backgroundColor: colors.errorBg,
    color: colors.error,
    borderRadius: borderRadius.small,
    marginBottom: '16px',
    border: `1px solid ${colors.errorBorder}`,
    fontFamily: typography.fontFamily,
  },
};
```

- [ ] **Step 4: Test admin page**

Navigate to `/admin` (as admin)
Verify:
- Stats cards display with golden numbers
- User table with warm styling
- Role badges use warm palette colors (golden for admin, green for viewer, tan for pending)
- Role dropdown styled consistently
- "You" badge for current user
- Responsive stats grid stacks on mobile
- Table scrolls horizontally on mobile if needed

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/AdminPage.jsx
git commit -m "style: update AdminPage with warm design system

- Stats cards with golden accent numbers
- User table with warm styling
- Role badges use warm palette colors
- Responsive stats grid"
```

---

## Testing & Verification

### Task 9: Visual Regression Testing

**Files:**
- All updated pages

Manual visual testing across all pages.

- [ ] **Step 1: Test all pages systematically**

Navigate through entire app and verify:

**LibraryPage (`/`):**
- Warm cream background
- White song rows in list format
- Key badges with golden tint background
- Hover states work (shadow increase)
- Buttons use golden accent
- Typography is sans-serif

**SongPage (`/songs/:id`):**
- Key selector pills styled correctly
- Active key has golden background
- Chord display in white card
- Print/PDF buttons styled
- Monospace preserved for chords

**LoginPage (`/login`):**
- Centered white card
- Warm background
- Demo button golden
- OAuth buttons maintain brand colors

**UploadPage (`/upload`):**
- Form inputs styled consistently
- OCR section matches design
- Buttons use design system

**EditSongPage (`/songs/:id/edit`):**
- Form styled like upload
- Cancel/Save buttons clear

**AdminPage (`/admin`):**
- User list readable
- Role dropdowns styled
- Stats cards consistent

- [ ] **Step 2: Test responsive behavior**

Resize browser window to test mobile:
- Song rows stack nicely
- Buttons remain readable
- No horizontal scroll
- Touch targets adequate (44px+)

- [ ] **Step 3: Test interactions**

Verify all interactive elements:
- Hover states on cards and buttons
- Focus states on inputs (golden ring)
- Disabled states look correct
- Transitions smooth (200ms)

- [ ] **Step 4: Test accessibility**

Check keyboard navigation:
- Tab through all interactive elements
- Focus indicators visible
- Can operate without mouse
- Proper tab order

- [ ] **Step 5: Document any issues**

Create GitHub issues for any visual bugs found.

---

### Task 10: Cross-browser Testing

- [ ] **Step 1: Test in Chrome/Edge**

Verify design renders correctly in Chromium browsers.

- [ ] **Step 2: Test in Firefox**

Check font rendering and layout.

- [ ] **Step 3: Test in Safari** (if available)

Verify WebKit compatibility.

- [ ] **Step 4: Document browser-specific issues**

Note any CSS tweaks needed for compatibility.

---

## Final Steps

### Task 11: Update Documentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Verify README references new design spec**

Check that README.md line ~163 points to the correct design spec location.

- [ ] **Step 2: Add screenshot or demo note** (optional)

Consider adding a note about the UI refresh in README.

- [ ] **Step 3: Commit if changes made**

```bash
git add README.md
git commit -m "docs: update README with UI refresh notes"
```

---

### Task 12: Final Review and Cleanup

- [ ] **Step 1: Review all commits**

Run: `git log --oneline -15`
Verify commit messages follow convention.

- [ ] **Step 2: Check for console warnings**

Open browser dev tools, navigate through app.
Fix any warnings in console.

- [ ] **Step 3: Verify no unused imports**

Check that all design system imports are actually used.

- [ ] **Step 4: Test print functionality**

On SongPage, click Print button.
Verify print styles still work (white background, no UI chrome).

- [ ] **Step 5: Test PDF download**

Download a PDF, verify it renders correctly.

- [ ] **Step 6: Final commit if cleanup needed**

```bash
git add .
git commit -m "chore: final cleanup after UI refresh"
```

---

## Success Criteria

**UI Refresh is complete when:**

✅ All 6 pages use warm earth color palette
✅ Typography is modern sans-serif (except chords)
✅ Components use soft rounded edges (12px radius)
✅ Shadows are subtle and warm-tinted
✅ Song library is list-based with key badges
✅ Hover/focus states work smoothly
✅ No console warnings or errors
✅ Responsive on mobile (320px+)
✅ Print and PDF still function correctly
✅ Keyboard navigation works
✅ Design matches spec document

---

## Rollback Plan

If issues arise, revert commits page-by-page:

```bash
# Revert specific page
git revert <commit-hash>

# Or reset to before UI refresh
git log --oneline  # Find commit before Task 1
git reset --hard <commit-before-refresh>
```

---

**Estimated Time:** 3-4 hours for full implementation
**Recommended Approach:** Implement in order, test each page before moving to next
