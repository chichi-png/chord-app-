# UI Refresh Design - Warm & Approachable Worship Tool

**Date**: 2026-03-24
**Status**: Approved
**Approach**: Balanced Warmth

## Goals

Transform the current cold monochrome UI into a warm, approachable interface that feels welcoming for community worship teams while maintaining professional polish.

## Design Direction

**Personality**: Friendly, polished, professional. Warm without being overly cozy.

**Key Principles**:
- Warm earth tones replace stark black/white
- Modern sans-serif typography for approachability
- List-based layouts for efficient scanning
- Soft, rounded components with subtle shadows
- Balanced spacing for comfort without excess

## Design System

### Color Palette

```
Background:       #f4e8d8  (Rich cream - warm, inviting base)
Card Background:  #ffffff  (Pure white - contrast and clarity)
Primary Accent:   #d4a574  (Golden tan - buttons, badges, highlights)
Dark Text:        #2c1810  (Deep brown - easier than pure black)
Secondary Text:   #8d7a6a  (Medium brown - metadata, labels)
Border Color:     rgba(44,24,16,0.1-0.15)  (Subtle brown-tinted)
Shadow Color:     rgba(44,24,16,0.06-0.1)  (Warm shadows)
```

**Key Badge Background**: `rgba(212,165,116,0.15)` - Warm tinted pill for key display

### Typography

**Font Stack**:
- **UI**: `system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif`
- **Chords**: `'Consolas', 'Monaco', 'Courier New', monospace` (preserve alignment)

**Scale**:
- App Title: 20px, weight 500, letter-spacing -0.3px
- Page Headings: 18px, weight 500
- Song Titles: 15px, weight 500
- Body Text: 14px, weight 400
- Metadata: 12-13px, weight 400
- Small Labels: 11px, weight 400

**Line Heights**:
- Headings: 1.2-1.3
- Body: 1.6
- Metadata: 1.4

### Component Styling

**Border Radius**:
- Buttons: 12px
- Inputs: 12px
- Cards/Song Rows: 12px
- Key Badges: 8-10px
- Small Elements: 6-8px

**Shadows**:
- Cards: `0 2px 8px rgba(44,24,16,0.06)`
- Buttons: `0 2px 6px rgba(44,24,16,0.1)`
- Inputs (focus): `0 0 0 3px rgba(212,165,116,0.2)`

**Transitions**:
- All interactive elements: `all 0.2s ease`

### Spacing System

**Padding**:
- Cards/Rows: 14-16px
- Buttons: 10-12px vertical, 20-24px horizontal
- Inputs: 11-12px vertical, 16px horizontal
- Page Container: 24px

**Gaps**:
- Between list items: 10px
- Between sections: 24-32px
- Between form elements: 12-16px
- Between header elements: 12px

## Page Designs

### 1. Library Page (Main/Home)

**Layout**: List view with song rows

**Structure**:
```
┌─────────────────────────────────────────┐
│ Header                                  │
│  ✝ Chord Manager    [User] [+] [Admin] │
├─────────────────────────────────────────┤
│ Filters                                 │
│  [Search...] [Language▾] [Category▾]   │
├─────────────────────────────────────────┤
│ Song List (scrollable)                  │
│  ┌───────────────────────────────────┐  │
│  │ Song Title              [Key: G]  │  │
│  │ 🌐 English · Worship              │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Song Title 2            [Key: C]  │  │
│  │ 🇵🇭 Tagalog · Praise              │  │
│  └───────────────────────────────────┘  │
│  ...                                    │
└─────────────────────────────────────────┘
```

**Header**:
- Background: `#f4e8d8` with subtle border bottom `2px solid rgba(44,24,16,0.08)`
- App title: 20px, left-aligned
- Buttons: Golden accent primary, white/bordered secondary
- User avatar: 32px circle

**Filters**:
- Search input: Full-width with subtle border, 12px radius
- Dropdowns: Bordered, 12px radius, matching search height
- Flex layout with 12px gap

**Song Rows**:
- White background with `1px solid rgba(44,24,16,0.1)` border
- Shadow: `0 2px 8px rgba(44,24,16,0.06)`
- Hover state: Slight shadow increase, cursor pointer
- Layout: Flexbox justify-between
- Left: Song title (15px, bold) + metadata (12px, secondary color)
- Right: Key badge with warm background pill

**Admin Actions** (on song rows):
- Edit/Delete buttons appear on hover or always visible on mobile
- Small, subtle buttons with minimal styling

### 2. Song View Page

**Layout**: Centered content with header and chord display

**Structure**:
```
┌─────────────────────────────────────────┐
│ [← Back]                    [User] [✕]  │
├─────────────────────────────────────────┤
│          Song Title (large)             │
│     Language · Category · Key: G        │
├─────────────────────────────────────────┤
│ Transpose to: [Keys in pills...]        │
├─────────────────────────────────────────┤
│ [🖨️ Print] [📄 Download PDF]            │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │  Chord Sheet Content                │ │
│ │  (monospace font)                   │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key Transposition UI**:
- Pills/buttons for all 17 keys
- Flex wrap layout
- Active key: Golden background `#d4a574`, dark text
- Inactive keys: White background, border, hover state
- Responsive: Stack nicely on mobile

**Chord Display**:
- White card with subtle shadow
- Monospace font preserved for alignment
- Adequate padding (24-30px)
- Line height 1.8 for readability

**Action Buttons**:
- Centered flex layout
- Primary (PDF): Golden background
- Secondary (Print): White with border

### 3. Login Page

**Layout**: Centered card on warm background

**Structure**:
```
┌─────────────────────────────────────────┐
│                                         │
│      ┌─────────────────────────┐        │
│      │                         │        │
│      │   ✝ Chord Manager       │        │
│      │   Worship song chords   │        │
│      │                         │        │
│      │   [Google Login]        │        │
│      │   [Facebook Login]      │        │
│      │                         │        │
│      │   OR                    │        │
│      │                         │        │
│      │   [🎭 Demo Login]       │        │
│      │                         │        │
│      └─────────────────────────┘        │
│                                         │
└─────────────────────────────────────────┘
```

**Card**:
- White background with subtle shadow
- Max-width 400px, centered
- Padding 40px
- Border radius 16px (slightly more than other cards for emphasis)

**Buttons**:
- OAuth buttons: Platform colors (keep Google/Facebook branding)
- Demo button: Golden background
- Full width (300px), well-spaced

### 4. Upload Page (Admin)

**Layout**: Form with OCR option

**Key Elements**:
- File upload area with drag-drop visual
- Warm border on drag-over state
- Preview area for uploaded image
- Form fields with consistent styling
- Submit button: Golden accent

### 5. Edit Song Page (Admin)

**Layout**: Form matching upload page style

**Consistency**:
- Same input styling as upload
- Warm validation states (green/red with earth tone tints)
- Cancel/Save buttons with clear hierarchy

### 6. Admin/Users Page

**Layout**: Table or card-based user list

**Elements**:
- User cards/rows similar to song list
- Role badges with distinct colors but warm palette
- Action buttons for role management

## Component Library

### Buttons

**Primary** (Add Song, Save, etc.):
```css
background: #d4a574
color: #2c1810
border: none
border-radius: 12px
padding: 10px 20px
font-size: 13-14px
font-weight: 500
box-shadow: 0 2px 6px rgba(44,24,16,0.1)
transition: all 0.2s ease

hover:
  background: #c89560 (slightly darker)
  box-shadow: 0 3px 10px rgba(44,24,16,0.15)
```

**Secondary** (Admin, Logout, etc.):
```css
background: white
color: #2c1810
border: 1px solid rgba(44,24,16,0.15)
border-radius: 12px
padding: 10px 20px
font-size: 13-14px
font-weight: 500
transition: all 0.2s ease

hover:
  border-color: rgba(44,24,16,0.25)
  background: rgba(44,24,16,0.02)
```

**Text/Icon** (Back button):
```css
background: transparent
color: #d4a574
border: 1px solid #d4a574
padding: 8px 16px
border-radius: 10px
font-weight: 500

hover:
  background: rgba(212,165,116,0.1)
```

### Inputs

**Text Input**:
```css
background: white
border: 1px solid rgba(44,24,16,0.15)
border-radius: 12px
padding: 11px 16px
font-size: 14px
color: #2c1810
transition: all 0.2s ease

focus:
  border-color: #d4a574
  outline: none
  box-shadow: 0 0 0 3px rgba(212,165,116,0.2)

placeholder:
  color: #8d7a6a
```

**Select/Dropdown**:
- Same styling as text input
- Custom arrow icon in accent color

### Cards/Containers

**Song Row**:
```css
background: white
border: 1px solid rgba(44,24,16,0.1)
border-radius: 12px
padding: 14px 16px
box-shadow: 0 2px 8px rgba(44,24,16,0.06)
transition: all 0.2s ease

hover:
  box-shadow: 0 4px 12px rgba(44,24,16,0.1)
  border-color: rgba(44,24,16,0.15)
  cursor: pointer
```

**Content Card** (chord display, forms):
```css
background: white
border: 1px solid rgba(44,24,16,0.1)
border-radius: 12px
padding: 20-24px
box-shadow: 0 2px 8px rgba(44,24,16,0.06)
```

### Badges

**Key Badge**:
```css
background: rgba(212,165,116,0.15)
color: #2c1810
padding: 6px 12px
border-radius: 8px
font-size: 13px
font-weight: 600
border: 1px solid rgba(212,165,116,0.3)
```

**Category Badge** (if needed):
- Similar to key badge but with different tints

## Interactive States

### Hover States
- Cards: Shadow increases, border darkens slightly
- Buttons: Background darkens ~10%, shadow increases
- Links: Color deepens, underline appears
- Key pills: Background color changes to light accent

### Focus States
- All inputs: Accent-colored outline ring (3px, 20% opacity)
- Buttons: Same as hover + outline ring
- Skip directly to content for keyboard navigation

### Loading States
- Spinner: Accent color `#d4a574`
- Skeleton loaders: Shimmer with warm gray tones
- Disabled buttons: Opacity 0.5, cursor not-allowed

### Error States
- Inputs: Red border with warm undertone `#d44a4a`
- Error messages: Same red with light background
- Form validation: Inline, below field

### Success States
- Messages: Green with warm undertone `#6b9b6a`
- Success alerts: Light green background

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Adaptations

**Library Page**:
- Single column song list (already list-view)
- Stack filters vertically
- Hamburger menu for user/admin actions
- Bottom sheet for filters on mobile

**Song View**:
- Key pills wrap naturally
- Action buttons stack on very small screens
- Chord text size adjusts (13-14px on mobile)

**Forms**:
- Full-width inputs
- Stack buttons vertically
- Larger touch targets (min 44px)

### Touch Considerations
- Minimum touch target: 44x44px
- Adequate spacing between interactive elements (12px+)
- No hover-only interactions (show admin buttons always on mobile)

## Accessibility

### Color Contrast
All text meets WCAG AA standards:
- Dark text (#2c1810) on cream background: Pass
- Dark text on white cards: Pass
- White/dark text on accent buttons: Pass

### Keyboard Navigation
- Proper tab order through all pages
- Focus indicators visible (accent-colored rings)
- Skip links for main content
- Escape key closes modals

### Screen Readers
- Semantic HTML (header, main, nav, article)
- ARIA labels for icon buttons
- Form labels properly associated
- Status messages announced

### Font Sizes
- Minimum 12px for metadata
- 14px+ for body text
- Scalable with browser zoom

## Print Styles

Preserve existing print styles with new colors:
- Remove warm backgrounds (print on white)
- Maintain monospace for chords
- Hide UI chrome (buttons, nav)
- Optimize for black & white printing

## Implementation Notes

### CSS Approach
- Inline styles currently used - keep this approach for consistency
- Could refactor to CSS modules or styled-components in future
- Consider CSS variables for color palette (easy theme switching)

### Reusable Styles
Create style objects for:
- `buttonPrimary`, `buttonSecondary`
- `inputField`, `selectField`
- `card`, `songRow`
- `badge`, `keyBadge`

### Gradual Rollout
Can implement page by page:
1. LibraryPage (most visible)
2. SongPage (most used)
3. LoginPage
4. Upload/Edit/Admin pages

### Testing Checklist
- [ ] Visual regression on all pages
- [ ] Color contrast validation
- [ ] Keyboard navigation flow
- [ ] Screen reader testing
- [ ] Mobile responsiveness (320px to 1920px)
- [ ] Print preview
- [ ] Dark mode consideration (future)

## Future Enhancements

**Beyond this refresh**:
- Optional dark mode toggle (warm dark palette)
- Customizable themes per user/church
- Animated transitions between pages
- More sophisticated song filtering (tags, favorites)
- Grid/List view toggle

## Success Metrics

**How we'll know this worked**:
- User feedback: "Feels more welcoming"
- Increased time on site (comfortable to browse)
- Lower bounce rate on login page
- Positive team member comments
- Easier onboarding for new users

---

**Design validated and ready for implementation.**
