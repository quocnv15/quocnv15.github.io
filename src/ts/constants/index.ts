/**
 * Application constants
 */

// DOM selectors
export const SELECTORS = {
  // Theme
  THEME_TOGGLE: '.theme-toggle',
  THEME_ICON: '.theme-icon',

  // Navigation
  NAV_TOGGLE: '.nav-toggle',
  NAV_MOBILE: '.nav-mobile',
  NAV_LINKS: '.nav-links, .site-nav',

  // Content
  POST_CONTENT: '.post-content',
  PAGE_CONTENT: '.page-content',
  SITE_HEADER: '.site-header, header',

  // Code blocks
  CODE_BLOCKS: 'pre code, highlight > code, .highlight > pre > code',
  COPY_BUTTON: '.copy-button',

  // TOC
  TOC_CONTAINER: '#toc-container',
  HEADINGS: 'h2, h3, h4, h5, h6',

  // Config
  SITE_CONFIG: '#site-config',

  // Body classes
  BODY: 'body',
} as const;

// CSS classes
export const CSS_CLASSES = {
  // Loading states
  JS_LOADING: 'js-loading',
  JS_ENABLED: 'js-enabled',
  JS_FALLBACK: 'js-fallback',

  // Theme
  THEME_TRANSITIONING: 'theme-transitioning',
  THEME_ACTIVE: 'active',
  THEME_TOGGLE: 'theme-toggle',

  // Navigation
  NAV_OPEN: 'nav-open',
  NAV_ACTIVE: 'active',

  // Copy code
  COPY_SUCCESS: 'copied',
  COPY_ERROR: 'copy-error',
  COPY_BUTTON: 'copy-button',

  // TOC
  TOC_ACTIVE: 'toc-active',
  TOC_CONTAINER: 'toc-container',
  TOC_LIST: 'toc-list',
  TOC_ITEM: 'toc-item',
  TOC_LINK: 'toc-link',
  TOC_TITLE: 'toc-title',
  TOC_EMPTY: 'toc-empty',
} as const;

// Data attributes
export const DATA_ATTRIBUTES = {
  THEME: 'data-theme',
  LEVEL: 'data-level',
  CLIPBOARD_TEXT: 'data-clipboard-text',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  PREFERENCES: 'site-preferences',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;

// Animations
export const ANIMATIONS = {
  THEME_TRANSITION: 300,
  NAV_TRANSITION: 300,
  DEBOUNCE_DELAY: 150,
  THROTTLE_DELAY: 100,
  COPY_TIMEOUT: 2000,
} as const;

// Accessibility
export const ARIA = {
  FOCUSABLE_ELEMENTS: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  ELEMENT_NOT_FOUND: 'Required element not found',
  CONFIG_PARSE_FAILED: 'Failed to parse site config',
  STORAGE_FAILED: 'Failed to access localStorage',
  COPY_FAILED: 'Failed to copy text',
  NETWORK_ERROR: 'Network request failed',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  COPIED: 'Copied!',
  THEME_SAVED: 'Theme preference saved',
  FEATURE_ENABLED: 'Feature enabled successfully',
} as const;