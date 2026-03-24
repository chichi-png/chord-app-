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
  weightNormal: 400,
  weightMedium: 500,
  weightSemibold: 600,

  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.6,
  lineHeightRelaxed: 1.8,
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
    fontWeight: typography.weightMedium,
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
    fontWeight: typography.weightMedium,
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
    fontWeight: typography.weightSemibold,
    border: `1px solid ${colors.keyBadgeBorder}`,
  },
};
