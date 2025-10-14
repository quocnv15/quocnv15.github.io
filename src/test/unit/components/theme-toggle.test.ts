/**
 * Theme Toggle Component test suite
 * Tests for theme toggle component functionality, state management, and user interactions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ThemeToggleComponent } from '../../../src/ts/components/theme-toggle.component';
import { ConfigService } from '../../../src/ts/services/config.service';
import type { ThemeMode } from '../../../src/ts/types';

// Mock ConfigService
vi.mock('../../../src/ts/services/config.service', () => ({
  ConfigService: {
    getInstance: vi.fn(() => ({
      getSiteConfig: vi.fn(() => ({
        theme: 'system',
        environment: 'development',
        isPost: false,
        isHomePage: true,
        language: 'en',
        baseUrl: 'http://localhost:4000',
        features: {},
      })),
      isProduction: vi.fn(() => false),
      isFeatureEnabled: vi.fn(() => false),
    })),
  },
}));

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let mockConfigService: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.className = '';

    // Reset localStorage
    localStorage.clear();

    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
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

    // Get mocked ConfigService instance
    mockConfigService = ConfigService.getInstance();
    vi.mocked(ConfigService.getInstance).mockReturnValue(mockConfigService);

    component = new ThemeToggleComponent();

    // Mock setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    component.destroy();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initialization', () => {
    it('should create component instance', () => {
      expect(component).toBeInstanceOf(ThemeToggleComponent);
    });

    it('should initialize theme toggle functionality', () => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();

      const toggle = document.querySelector('.theme-toggle');
      expect(toggle).toBeTruthy();
      expect(toggle?.tagName).toBe('BUTTON');
    });

    it('should use existing toggle button if present', () => {
      const existingToggle = document.createElement('button');
      existingToggle.className = 'theme-toggle';
      existingToggle.innerHTML = '<span class="theme-icon">🌙</span>';
      document.body.appendChild(existingToggle);

      component.init();

      // Should not create new button
      const toggles = document.querySelectorAll('.theme-toggle');
      expect(toggles).toHaveLength(1);
      expect(toggles[0]).toBe(existingToggle);
    });

    it('should warn when no suitable header found', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      component.init();

      expect(consoleSpy).toHaveBeenCalledWith('⚠️ Could not find suitable location for theme toggle button');

      consoleSpy.mockRestore();
    });
  });

  describe('Button Creation', () => {
    it('should create button with correct attributes', () => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();

      const button = document.querySelector('.theme-toggle') as HTMLButtonElement;

      expect(button).toBeTruthy();
      expect(button.className).toBe('theme-toggle');
      expect(button.type).toBe('button');
      expect(button.getAttribute('aria-label')).toBe('Toggle dark mode');
      expect(button.getAttribute('title')).toBe('Toggle dark mode');
      expect(button.innerHTML).toContain('<span class="theme-icon">🌙</span>');
    });

    it('should insert button into header', () => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();

      const button = mockHeader.querySelector('.theme-toggle');
      expect(button).toBeTruthy();
      expect(button?.parentElement).toBe(mockHeader);
    });
  });

  describe('Event Listeners', () => {
    beforeEach(() => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();
    });

    it('should toggle theme on button click', () => {
      const button = document.querySelector('.theme-toggle') as HTMLButtonElement;
      const toggleSpy = vi.spyOn(component, 'toggleTheme');

      button.click();

      expect(toggleSpy).toHaveBeenCalled();
    });

    it('should prevent default on click', () => {
      const button = document.querySelector('.theme-toggle') as HTMLButtonElement;
      const event = new MouseEvent('click', { cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      button.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('System Theme Watcher', () => {
    beforeEach(() => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();
    });

    it('should setup system theme watcher', () => {
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should update theme when system preference changes', () => {
      // Set theme to system
      localStorage.setItem('theme', 'system');

      const mockMediaQuery = {
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === 'change') {
            // Store handler to call later
            (mockMediaQuery as any).changeHandler = handler;
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);
      component.init(); // Re-init with new mock

      // Simulate system theme change
      if ((mockMediaQuery as any).changeHandler) {
        (mockMediaQuery as any).changeHandler();
      }

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should support legacy browsers without addEventListener', () => {
      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn((handler: () => void) => {
          (mockMediaQuery as any).changeHandler = handler;
        }),
        removeListener: vi.fn(),
        // No addEventListener
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);
      component.init();

      expect(mockMediaQuery.addListener).toHaveBeenCalled();
    });

    it('should handle missing matchMedia gracefully', () => {
      (window.matchMedia as any) = undefined;

      expect(() => component.init()).not.toThrow();
    });
  });

  describe('Theme Management', () => {
    beforeEach(() => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();
    });

    it('should toggle between light and dark themes', () => {
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

      // Set initial theme to system (which resolves to light)
      localStorage.setItem('theme', 'system');

      component.toggleTheme();

      // Should toggle to dark
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // Toggle again
      component.toggleTheme();

      // Should toggle to light
      expect(localStorage.getItem('theme')).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should set specific theme', () => {
      component.setTheme('dark');

      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      component.setTheme('light');

      expect(localStorage.getItem('theme')).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should apply system theme correctly', () => {
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

      component.setTheme('system');

      expect(localStorage.getItem('theme')).toBe('system');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Button State Updates', () => {
    beforeEach(() => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();
    });

    it('should update button state for dark theme', () => {
      const button = document.querySelector('.theme-toggle') as HTMLElement;
      const icon = button.querySelector('.theme-icon');

      component.setTheme('dark');

      expect(button.classList.contains('active')).toBe(true);
      expect(button.getAttribute('aria-pressed')).toBe('true');
      expect(icon?.textContent).toBe('🌙');
      expect(button.getAttribute('title')).toBe('Switch to light mode');
    });

    it('should update button state for light theme', () => {
      const button = document.querySelector('.theme-toggle') as HTMLElement;
      const icon = button.querySelector('.theme-icon');

      component.setTheme('light');

      expect(button.classList.contains('active')).toBe(false);
      expect(button.getAttribute('aria-pressed')).toBe('false');
      expect(icon?.textContent).toBe('☀️');
      expect(button.getAttribute('title')).toBe('Switch to dark mode');
    });

    it('should update button state for system theme (dark)', () => {
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

      const button = document.querySelector('.theme-toggle') as HTMLElement;

      component.setTheme('system');

      expect(button.classList.contains('active')).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Initial State', () => {
    it('should update initial state based on stored theme', () => {
      localStorage.setItem('theme', 'dark');

      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();

      const button = document.querySelector('.theme-toggle') as HTMLElement;
      expect(button.classList.contains('active')).toBe(true);
    });

    it('should use system theme when no theme stored', () => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();

      // Should default to system theme
      expect(localStorage.getItem('theme')).toBeNull();
    });
  });

  describe('Transitions', () => {
    beforeEach(() => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();
    });

    it('should add transition class when applying theme', () => {
      component.setTheme('dark');

      expect(document.documentElement.classList.contains('theme-transitioning')).toBe(true);

      // Fast forward 300ms
      vi.advanceTimersByTime(300);

      expect(document.documentElement.classList.contains('theme-transitioning')).toBe(false);
    });

    it('should remove transition class after timeout', () => {
      component.setTheme('light');

      expect(document.documentElement.classList.contains('theme-transitioning')).toBe(true);

      vi.advanceTimersByTime(301);

      expect(document.documentElement.classList.contains('theme-transitioning')).toBe(false);
    });
  });

  describe('localStorage Integration', () => {
    beforeEach(() => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();
    });

    it('should read theme from localStorage', () => {
      localStorage.setItem('theme', 'light');

      // Access private method through component instance
      const storedTheme = (component as any).getStoredTheme();
      expect(storedTheme).toBe('light');
    });

    it('should default to system when no valid theme in localStorage', () => {
      localStorage.setItem('theme', 'invalid');

      const storedTheme = (component as any).getStoredTheme();
      expect(storedTheme).toBe('system');
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock localStorage to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage error');
      });

      const storedTheme = (component as any).getStoredTheme();
      expect(storedTheme).toBe('system');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to read theme from localStorage:', expect.any(Error));

      // Restore
      localStorage.getItem = originalGetItem;
      consoleSpy.mockRestore();
    });

    it('should handle localStorage write errors', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => component.setTheme('dark')).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save theme to localStorage:', expect.any(Error));

      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('System Theme Detection', () => {
    beforeEach(() => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();
    });

    it('should detect light system theme', () => {
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

      const systemTheme = (component as any).getSystemTheme();
      expect(systemTheme).toBe('light');
    });

    it('should detect dark system theme', () => {
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

      const systemTheme = (component as any).getSystemTheme();
      expect(systemTheme).toBe('dark');
    });

    it('should default to light when matchMedia unavailable', () => {
      (window.matchMedia as any) = undefined;

      const systemTheme = (component as any).getSystemTheme();
      expect(systemTheme).toBe('light');
    });
  });

  describe('Cleanup', () => {
    beforeEach(() => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();
    });

    it('should cleanup event listeners and references', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      component.destroy();

      expect((component as any).element).toBeNull();
      expect((component as any).cleanupFunctions).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith('🎨 Theme toggle component destroyed');

      consoleSpy.mockRestore();
    });

    it('should handle multiple destroy calls', () => {
      expect(() => {
        component.destroy();
        component.destroy();
      }).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete theme workflow', () => {
      // Mock dark system preference
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === 'change') {
            // Store handler
            (window.matchMedia as any).changeHandler = handler;
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      // Initialize
      component.init();

      const button = document.querySelector('.theme-toggle') as HTMLElement;
      expect(button).toBeTruthy();

      // Set to system theme
      component.setTheme('system');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(button.classList.contains('active')).toBe(true);

      // Toggle to light
      component.toggleTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(button.classList.contains('active')).toBe(false);

      // Toggle to dark
      component.toggleTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(button.classList.contains('active')).toBe(true);

      // Cleanup
      component.destroy();
      expect((component as any).element).toBeNull();
    });

    it('should handle DOM elements missing gracefully', () => {
      // No header in DOM
      expect(() => component.init()).not.toThrow();

      // Should not create button
      const button = document.querySelector('.theme-toggle');
      expect(button).toBeNull();

      // Should still be able to destroy
      expect(() => component.destroy()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();
    });

    it('should maintain ARIA attributes', () => {
      const button = document.querySelector('.theme-toggle') as HTMLElement;

      component.setTheme('dark');

      expect(button.getAttribute('aria-pressed')).toBe('true');
      expect(button.getAttribute('aria-label')).toBe('Toggle dark mode');

      component.setTheme('light');

      expect(button.getAttribute('aria-pressed')).toBe('false');
    });

    it('should update title attribute for screen readers', () => {
      const button = document.querySelector('.theme-toggle') as HTMLElement;

      component.setTheme('dark');
      expect(button.getAttribute('title')).toBe('Switch to light mode');

      component.setTheme('light');
      expect(button.getAttribute('title')).toBe('Switch to dark mode');
    });
  });

  describe('Error Handling', () => {
    it('should handle DOM manipulation errors', () => {
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      // Mock appendChild to throw error
      const originalAppendChild = mockHeader.appendChild;
      mockHeader.appendChild = vi.fn().mockImplementation(() => {
        throw new Error('DOM error');
      });

      expect(() => component.init()).toThrow('DOM error');

      // Restore
      mockHeader.appendChild = originalAppendChild;
    });

    it('should handle missing button during state update', () => {
      // Initialize with button
      const mockHeader = document.createElement('header');
      mockHeader.className = 'site-header';
      document.body.appendChild(mockHeader);

      component.init();

      // Remove button
      (component as any).element = null;

      expect(() => component.setTheme('dark')).not.toThrow();
    });
  });
});