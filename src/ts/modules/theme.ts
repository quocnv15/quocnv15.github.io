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
import type { ThemeMode } from '../interfaces/types';

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

  // If current stored theme is 'system', update it to the actual theme
  const stored = getStoredTheme();
  storeTheme(stored === 'system' ? next : 'system');
  applyTheme(stored === 'system' ? next : 'system');
};

/**
 * Set specific theme
 */
export const setTheme = (theme: ThemeMode): void => {
  storeTheme(theme);
  applyTheme(theme);
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

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Legacy support
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
 * Add CSS styles for theme toggle
 */
export const addThemeStyles = (): void => {
  const styleId = 'theme-styles';

  // Check if styles already exist
  if (document.getElementById(styleId)) {
    return;
  }

  const styles = `
    /* Theme toggle button */
    .theme-toggle {
      background: transparent;
      border: 1px solid #ddd;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      padding: 0;
      margin: 0 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 1.2rem;
      background: white;
    }

    .theme-toggle:hover {
      border-color: #3498db;
      transform: scale(1.1);
    }

    .theme-toggle:focus {
      outline: 2px solid #3498db;
      outline-offset: 2px;
    }

    .theme-toggle:active {
      transform: scale(0.95);
    }

    .theme-toggle .theme-icon {
      font-size: 1.2rem;
      transition: opacity 0.3s ease;
    }

    /* Theme transitions */
    .theme-transitioning,
    .theme-transitioning * {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }

    /* Dark theme */
    [data-theme="dark"] {
      color-scheme: dark;
    }

    /* Light theme (default) */
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fa;
      --text-primary: #2c3e50;
      --text-secondary: #5a6c7d;
      --border-color: #e8e8e8;
      --code-bg: #f6f8fa;
      --accent: #3498db;
    }

    /* Dark theme */
    [data-theme="dark"] {
      --bg-primary: #1a1a1a;
      --bg-secondary: #2d2d2d;
      --text-primary: #ffffff;
      --text-secondary: #b0b0b0;
      --border-color: #404040;
      --code-bg: #2d2d2d;
      --accent: #4a9eff;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .theme-toggle {
        width: 36px;
        height: 36px;
        font-size: 1rem;
      }
    }
  `;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  console.log('🎨 Theme styles added to document');
};