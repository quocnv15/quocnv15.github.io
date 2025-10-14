/**
 * Theme module test suite
 * Tests for dark mode functionality, localStorage persistence, and system theme detection
 */

import { describe, it, expect, beforeEach, afterEach, vi, type MockedFunction } from 'vitest';
import type { ThemeMode } from '../../../src/ts/interfaces/types';
import {
  getStoredTheme,
  getCurrentTheme,
  applyTheme,
  toggleTheme,
  setTheme,
  watchSystemTheme,
  initTheme,
  cleanupTheme,
  addThemeStyles,
} from '../../../src/ts/modules/theme';

// Mock DOM utilities
vi.mock('../../../src/ts/modules/utils/dom', () => ({
  qsSafe: vi.fn(),
  addEventListener: vi.fn(() => () => {}), // Return cleanup function
}));

describe('Theme Module', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Clear localStorage
    localStorage.clear();

    // Reset DOM
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.className = '';

    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanupTheme();
    vi.restoreAllMocks();
  });

  describe('getStoredTheme', () => {
    it('should return stored theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('should return "system" as default when no theme stored', () => {
      expect(getStoredTheme()).toBe('system');
    });

    it('should return "system" for invalid theme values', () => {
      localStorage.setItem('theme', 'invalid');
      expect(getStoredTheme()).toBe('system');
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock localStorage to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(getStoredTheme()).toBe('system');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to read theme from localStorage:', expect.any(Error));

      // Restore
      localStorage.getItem = originalGetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('getCurrentTheme', () => {
    it('should return stored theme when not system', () => {
      localStorage.setItem('theme', 'dark');
      expect(getCurrentTheme()).toBe('dark');
    });

    it('should return system theme when stored as system', () => {
      localStorage.setItem('theme', 'system');

      // Mock light system preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getCurrentTheme()).toBe('light');
    });

    it('should return dark system theme when system prefers dark', () => {
      localStorage.setItem('theme', 'system');

      // Mock dark system preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getCurrentTheme()).toBe('dark');
    });
  });

  describe('applyTheme', () => {
    beforeEach(() => {
      // Mock querySelector for theme toggle button
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null); // No theme toggle button
    });

    it('should apply light theme to document', () => {
      applyTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should apply dark theme to document', () => {
      applyTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should apply system theme based on preference', () => {
      // Mock dark system preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      applyTheme('system');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should add transition class and remove it after delay', () => {
      vi.useFakeTimers();

      applyTheme('light');

      // Check that transition class is added
      expect(document.documentElement.classList.contains('theme-transitioning')).toBe(true);

      // Fast forward 300ms
      vi.advanceTimersByTime(300);

      // Check that transition class is removed
      expect(document.documentElement.classList.contains('theme-transitioning')).toBe(false);

      vi.useRealTimers();
    });

    it('should update theme toggle button if exists', () => {
      const mockButton = {
        classList: {
          toggle: vi.fn(),
        },
        setAttribute: vi.fn(),
        querySelector: vi.fn().mockReturnValue({ textContent: '' }),
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(mockButton);

      applyTheme('dark');

      expect(mockButton.classList.toggle).toHaveBeenCalledWith('active', true);
      expect(mockButton.setAttribute).toHaveBeenCalledWith('aria-pressed', 'true');
    });
  });

  describe('toggleTheme', () => {
    beforeEach(() => {
      // Mock qsSafe to return null (no theme toggle button)
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);
    });

    it('should toggle from light to dark', () => {
      localStorage.setItem('theme', 'light');
      toggleTheme();
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      localStorage.setItem('theme', 'dark');
      toggleTheme();
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should handle system theme correctly', () => {
      localStorage.setItem('theme', 'system');

      // Mock light system preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      toggleTheme();

      // When system is light, toggling should set to dark
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('should store and apply theme', () => {
      setTheme('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should store system theme and apply actual theme', () => {
      // Mock dark system preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      setTheme('system');
      expect(localStorage.getItem('theme')).toBe('system');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('watchSystemTheme', () => {
    it('should set up media query listener for system theme', () => {
      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

      watchSystemTheme();

      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(mockMediaQuery.addEventListener).toHaveBeenCalled();
    });

    it('should handle legacy browsers without addEventListener', () => {
      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        // No addEventListener
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

      watchSystemTheme();

      expect(mockMediaQuery.addListener).toHaveBeenCalled();
    });

    it('should return early if matchMedia is not available', () => {
      (window.matchMedia as any) = undefined;

      expect(() => watchSystemTheme()).not.toThrow();
    });

    it('should update theme when system preference changes', () => {
      localStorage.setItem('theme', 'system');

      let changeHandler: (() => void) | null = null;

      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === 'change') {
            changeHandler = handler;
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

      watchSystemTheme();

      // Simulate system theme change to dark
      mockMediaQuery.matches = true;
      if (changeHandler) {
        changeHandler();
      }

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('initTheme', () => {
    beforeEach(() => {
      // Mock qsSafe to return null for button and header
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);
    });

    it('should initialize with default theme', () => {
      initTheme();

      // Should apply stored theme (defaults to system)
      expect(document.documentElement.hasAttribute('data-theme')).toBe(true);
    });

    it('should initialize with provided default theme', () => {
      initTheme('dark');

      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should watch system theme changes', () => {
      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

      initTheme();

      expect(mockMediaQuery.addEventListener).toHaveBeenCalled();
    });
  });

  describe('cleanupTheme', () => {
    it('should remove theme toggle button and cleanup listeners', () => {
      const mockCleanup = vi.fn();
      const mockButton = {
        remove: vi.fn(),
        _cleanup: mockCleanup,
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(mockButton);

      cleanupTheme();

      expect(mockCleanup).toHaveBeenCalled();
      expect(mockButton.remove).toHaveBeenCalled();
    });

    it('should handle case when no theme button exists', () => {
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);

      expect(() => cleanupTheme()).not.toThrow();
    });
  });

  describe('addThemeStyles', () => {
    it('should add theme styles to document head', () => {
      addThemeStyles();

      const styleElement = document.getElementById('theme-styles');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.tagName).toBe('STYLE');
    });

    it('should not add styles if they already exist', () => {
      // Add existing styles
      const existingStyle = document.createElement('style');
      existingStyle.id = 'theme-styles';
      existingStyle.textContent = '/* existing styles */';
      document.head.appendChild(existingStyle);

      const originalContent = existingStyle.textContent;

      addThemeStyles();

      // Should not have added another style element
      const styles = document.querySelectorAll('#theme-styles');
      expect(styles).toHaveLength(1);
      expect(existingStyle.textContent).toBe(originalContent);
    });

    it('should include CSS custom properties for themes', () => {
      addThemeStyles();

      const styleElement = document.getElementById('theme-styles') as HTMLStyleElement;
      const content = styleElement.textContent || '';

      expect(content).toContain('--bg-primary');
      expect(content).toContain('--text-primary');
      expect(content).toContain('[data-theme="dark"]');
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);
    });

    it('should handle complete theme workflow', () => {
      // Initialize theme
      initTheme('light');
      expect(getCurrentTheme()).toBe('light');

      // Toggle to dark
      toggleTheme();
      expect(getCurrentTheme()).toBe('dark');

      // Set to system
      setTheme('system');
      expect(getStoredTheme()).toBe('system');

      // Cleanup
      cleanupTheme();
      expect(() => cleanupTheme()).not.toThrow();
    });

    it('should persist theme choice across page reloads', () => {
      // Set theme
      setTheme('dark');

      // Simulate page reload by clearing DOM and reinitializing
      document.documentElement.removeAttribute('data-theme');

      // Reinitialize (should load from localStorage)
      initTheme();

      expect(getCurrentTheme()).toBe('dark');
    });
  });
});