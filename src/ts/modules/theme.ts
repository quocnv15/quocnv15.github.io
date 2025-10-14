/**
 * Dark mode theme management
 *
 * Features:
 * - Support light, dark, and system preference modes
 * - Persist user preference in LocalStorage
 * - Smooth transitions between themes
 * - Accessibility compliant (focus indicators, ARIA labels)
 * - Cross-browser compatibility
 * - System preference detection
 */

import { qsSafe, addEventListener } from './utils/dom';
import { registerCleanup } from '../core/cleanup-manager';
import { themeStateIntegration } from '../core/app-state';
import type { ThemeMode } from '../core/types';

export type { ThemeMode };

const STORAGE_KEY = 'theme';
const THEME_ATTRIBUTE = 'data-theme';
const THEME_TRANSITION_DURATION = 300; // ms

/**
 * Get system preferred theme
 */
const getSystemTheme = (): ThemeMode => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

/**
 * Get stored theme from localStorage
 */
export const getStoredTheme = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  return 'system';
};

/**
 * Get current active theme
 */
export const getCurrentTheme = (): ThemeMode => {
  const stored = getStoredTheme();
  if (stored === 'system') {
    return getSystemTheme();
  }
  return stored;
};

/**
 * Apply theme to document
 */
export const applyTheme = (theme: ThemeMode): void => {
  const actualTheme = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.setAttribute(THEME_ATTRIBUTE, actualTheme);

  // Update theme toggle button if it exists
  updateToggleButton(actualTheme);

  // Add transition class for smooth theme switching
  document.documentElement.classList.add('theme-transitioning');

  // Remove transition class after animation completes
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
    // Notify state manager that transition is complete
    if (typeof window !== 'undefined' && (window as any).__APP_STATE_MANAGER__) {
      (window as any).__APP_STATE_MANAGER__.dispatch('THEME_TRANSITION_END');
    }
  }, THEME_TRANSITION_DURATION);

  console.log(`🎨 Theme applied: ${actualTheme} (stored: ${theme})`);
};

/**
 * Store theme preference
 */
const storeTheme = (theme: ThemeMode): void => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

/**
 * Toggle between light and dark themes
 */
export const toggleTheme = (): void => {
  const current = getCurrentTheme();
  const next: ThemeMode = current === 'light' ? 'dark' : 'light';

  // Use state manager if available
  if (typeof window !== 'undefined' && (window as any).__APP_STATE_MANAGER__) {
    (window as any).__APP_STATE_MANAGER__.setTheme(next);
  } else {
    // Fallback to localStorage
    const stored = getStoredTheme();
    storeTheme(stored === 'system' ? next : 'system');
    applyTheme(stored === 'system' ? next : 'system');
  }
};

/**
 * Set specific theme
 */
export const setTheme = (theme: ThemeMode): void => {
  // Use state manager if available
  if (typeof window !== 'undefined' && (window as any).__APP_STATE_MANAGER__) {
    (window as any).__APP_STATE_MANAGER__.setTheme(theme);
  } else {
    // Fallback to localStorage
    storeTheme(theme);
    applyTheme(theme);
  }
};

/**
 * Update toggle button state
 */
const updateToggleButton = (actualTheme: ThemeMode): void => {
  const toggle = qsSafe('.theme-toggle');
  if (!toggle) return;

  const isActive = actualTheme === 'dark';
  toggle.classList.toggle('active', isActive);
  toggle.setAttribute('aria-pressed', isActive.toString());

  // Update button text/icon if needed
  const icon = toggle.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = actualTheme === 'dark' ? '🌙' : '☀️';
  }

  // Update button title
  toggle.setAttribute('title', actualTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
};

/**
 * Listen for system theme changes
 */
export const watchSystemTheme = (): void => {
  if (!window.matchMedia) return;

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (): void => {
    const stored = getStoredTheme();
    if (stored === 'system') {
      applyTheme('system');
    }
  };

  // Modern browsers - addEventListener is automatically cleaned up
  if (mediaQuery.addEventListener) {
    // Since this is a native browser API, we need manual cleanup registration
    const cleanup = () => {
      mediaQuery.removeEventListener('change', handleChange);
    };

    // Register with cleanup manager
    registerCleanup(cleanup, {
      description: 'System theme watcher',
      priority: 2 // High priority - system watchers should be cleaned up early
    });

    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Legacy support - addListener is automatically cleaned up
    const cleanup = () => {
      mediaQuery.removeListener(handleChange);
    };

    // Register with cleanup manager
    registerCleanup(cleanup, {
      description: 'System theme watcher (legacy)',
      priority: 2
    });

    mediaQuery.addListener(handleChange);
  }

  console.log('👀 System theme watcher initialized');
};

/**
 * Create theme toggle button
 */
const createThemeToggleButton = (): HTMLElement => {
  const button = document.createElement('button');
  button.className = 'theme-toggle';
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Toggle dark mode');
  button.setAttribute('title', 'Toggle dark mode');
  button.innerHTML = '<span class="theme-icon">🌙</span>';

  return button;
};

/**
 * Setup theme toggle button
 */
const setupThemeToggleButton = (): void => {
  // Check if button already exists
  const existingButton = qsSafe('.theme-toggle');
  if (existingButton) {
    // Update existing button state
    updateToggleButton(getCurrentTheme());
    return;
  }

  // Find a suitable place to add the button
  const header = qsSafe('.site-header, header, .site-nav');
  if (!header) {
    console.warn('⚠️ Could not find suitable location for theme toggle button');
    return;
  }

  const button = createThemeToggleButton();

  // Add button to header
  header.appendChild(button);

  // Add click handler
  const cleanup = addEventListener(button, 'click', (e) => {
    e.preventDefault();
    toggleTheme();
  });

  // Store cleanup function
  (button as any)._cleanup = cleanup;

  // Initialize button state
  updateToggleButton(getCurrentTheme());

  console.log('🎨 Theme toggle button created and added to header');
};

/**
 * Initialize theme functionality
 */
export const initTheme = (defaultTheme?: ThemeMode): void => {
  // Apply initial theme
  const theme = defaultTheme || getStoredTheme();
  applyTheme(theme);

  // Watch for system theme changes
  watchSystemTheme();

  // Setup theme toggle button
  setupThemeToggleButton();

  console.log(`🎨 Theme functionality initialized with mode: ${theme}`);
};

/**
 * Cleanup theme functionality (for testing)
 */
export const cleanupTheme = (): void => {
  const button = qsSafe('.theme-toggle');
  if (button) {
    const cleanup = (button as any)._cleanup;
    if (typeof cleanup === 'function') {
      cleanup();
    }
    button.remove();
  }

  console.log('🧹 Theme functionality cleaned up');
};

/**
 * Theme styles are now loaded from external CSS files
 * This function is kept for backward compatibility but no longer does anything
 */
export const addThemeStyles = (): void => {
  // Styles are now in src/css/theme.css and loaded via the build system
  console.log('🎨 Theme styles loaded from external CSS file');
};