/**
 * Full Application Integration Tests
 * Tests for complete application workflow and cross-module interactions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfigService } from '../../ts/services/config.service';
import { ThemeToggleComponent } from '../../ts/components/theme-toggle.component';
import { initTheme, setTheme, getCurrentTheme } from '../../ts/modules/theme';
import { initNavigation, cleanupMobileNav } from '../../ts/modules/navigation';
import { initCopyCode, cleanupCopyCode } from '../../ts/modules/copy-code';
import { qs, create, ready } from '../../ts/modules/utils/dom';
import type { ThemeMode } from '../../ts/types';

// Mock window APIs that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query === '(prefers-color-scheme: light)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Full Application Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.className = '';

    // Reset localStorage
    localStorage.clear();

    // Reset ConfigService singleton
    (ConfigService as any).instance = undefined;

    // Mock window properties
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200, // Desktop
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });

    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      configurable: true,
      value: vi.fn(),
    });

    Object.defineProperty(document, 'documentElement', {
      writable: true,
      configurable: true,
      value: {
        clientHeight: 800,
        clientWidth: 1200,
        getAttribute: vi.fn(),
        setAttribute: vi.fn(),
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
          contains: vi.fn(),
        },
      },
    });

    // Mock document body
    Object.defineProperty(document.body, 'classList', {
      writable: true,
      configurable: true,
      value: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(),
      },
    });

    Object.defineProperty(document.body, 'style', {
      writable: true,
      configurable: true,
      value: {},
    });

    // Mock process environment
    delete (process as any).env.NODE_ENV;
    delete (window as any).jekyllEnvironment;

    // Mock getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      writable: true,
      configurable: true,
      value: vi.fn(() => ({
        getPropertyValue: vi.fn(() => '16px'),
      })),
    });

    // Mock CSS.supports
    Object.defineProperty(CSS, 'supports', {
      writable: true,
      configurable: true,
      value: vi.fn(() => true),
    });
  });

  afterEach(() => {
    cleanupCopyCode();
    cleanupMobileNav();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Theme System Integration', () => {
    it('should integrate theme module with theme toggle component', () => {
      // Setup DOM structure
      document.body.innerHTML = `
        <header class="site-header">
          <h1>Test Site</h1>
        </header>
        <main>
          <p>Test content</p>
        </main>
      `;

      // Initialize theme module
      initTheme('light');
      expect(getCurrentTheme()).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      // Initialize theme toggle component
      const themeComponent = new ThemeToggleComponent();
      themeComponent.init();

      const toggleButton = document.querySelector('.theme-toggle');
      expect(toggleButton).toBeTruthy();

      // Test theme toggle
      themeComponent.toggleTheme();
      expect(getCurrentTheme()).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // Cleanup
      themeComponent.destroy();
    });

    it('should persist theme choice across sessions', () => {
      // Set theme
      setTheme('dark');
      expect(localStorage.getItem('theme')).toBe('dark');

      // Simulate page reload by clearing DOM state
      document.documentElement.removeAttribute('data-theme');

      // Reinitialize (should load from localStorage)
      initTheme();
      expect(getCurrentTheme()).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should handle system theme changes', () => {
      // Set to system theme
      setTheme('system');
      expect(getCurrentTheme()).toBe('light'); // Default system preference

      // Mock system theme change to dark
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === 'change') {
            setTimeout(handler, 0); // Async handler
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      initTheme();

      // Simulate system theme change
      vi.runAllTimers();

      expect(getCurrentTheme()).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('Navigation and Theme Integration', () => {
    it('should initialize both theme and navigation systems', () => {
      // Setup mobile DOM structure
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600, // Mobile
      });

      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: vi.fn(),
      });

      document.body.innerHTML = `
        <header class="site-header">
          <nav class="site-nav">
            <ul class="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <p>Mobile content</p>
        </main>
      `;

      // Initialize both systems
      initTheme('dark');
      initNavigation();

      // Check both are initialized
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.querySelector('.nav-toggle')).toBeTruthy();
      expect(document.querySelector('.nav-mobile')).toBeTruthy();

      // Test mobile menu functionality
      const menuToggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
      const mobileMenu = document.querySelector('.nav-mobile');

      expect(menuToggle).toBeTruthy();
      expect(mobileMenu).toBeTruthy();

      menuToggle.click();

      // Should not throw errors
      expect(() => menuToggle.click()).not.toThrow();

      // Cleanup
      cleanupMobileNav();
    });

    it('should handle responsive behavior with theme changes', () => {
      // Start with desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      document.body.innerHTML = `
        <header class="site-header">
          <nav class="site-nav">
            <ul class="nav-links">
              <li><a href="/">Home</a></li>
            </ul>
          </nav>
        </header>
      `;

      // Initialize on desktop
      initNavigation();
      expect(document.querySelector('.nav-toggle')).toBeNull();

      // Switch to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      // Simulate resize event
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(150); // Debounce delay

      // Navigation should handle resize
      expect(() => window.dispatchEvent(new Event('resize'))).not.toThrow();
    });
  });

  describe('Copy Code Integration', () => {
    it('should integrate copy code functionality with themed content', () => {
      // Setup content with code blocks
      document.body.innerHTML = `
        <article class="post">
          <h1>Sample Post</h1>
          <pre><code>const greeting = "Hello, World!";
console.log(greeting);</code></pre>
          <pre><code>function add(a, b) {
  return a + b;
}</code></pre>
        </article>
      `;

      // Initialize theme and copy code
      initTheme('dark');
      initCopyCode();

      // Check copy buttons are added
      const copyButtons = document.querySelectorAll('.copy-button');
      expect(copyButtons).toHaveLength(2);

      // Test copy functionality
      const firstButton = copyButtons[0] as HTMLButtonElement;
      const mockWriteText = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        configurable: true,
        value: {
          writeText: mockWriteText,
        },
      });

      firstButton.click();

      // Should attempt to copy code
      expect(mockWriteText).toHaveBeenCalled();

      // Cleanup
      cleanupCopyCode();
    });

    it('should handle copy code in different page types', () => {
      // Test homepage (no post class)
      document.body.innerHTML = `
        <div class="home">
          <h1>Welcome</h1>
          <pre><code>console.log("Welcome!");</code></pre>
        </div>
      `;

      initCopyCode();

      const copyButtons = document.querySelectorAll('.copy-button');
      expect(copyButtons).toHaveLength(1);

      cleanupCopyCode();
    });
  });

  describe('Config Service Integration', () => {
    it('should integrate config service with theme module', () => {
      // Setup config script
      const configScript = document.createElement('script');
      configScript.id = 'site-config';
      configScript.type = 'application/json';
      configScript.textContent = JSON.stringify({
        theme: 'dark',
        features: {
          searchEnabled: true,
          analyticsEnabled: false,
        },
      });
      document.head.appendChild(configScript);

      const configService = ConfigService.getInstance();
      const config = configService.getSiteConfig();

      expect(config.theme).toBe('dark');
      expect(config.features.searchEnabled).toBe(true);
      expect(config.features.analyticsEnabled).toBe(false);

      // Initialize theme with config
      initTheme(config.theme);
      expect(getCurrentTheme()).toBe('dark');
    });

    it('should handle feature flags across modules', () => {
      // Setup environment
      (process as any).env.NODE_ENV = 'production';

      // Add search input
      const searchInput = document.createElement('input');
      searchInput.id = 'search-input';
      document.body.appendChild(searchInput);

      const configService = ConfigService.getInstance();
      const config = configService.getSiteConfig();

      expect(config.features.searchEnabled).toBe(true);
      expect(config.features.analyticsEnabled).toBe(true);
      expect(configService.isProduction()).toBe(true);
    });
  });

  describe('Complete Application Workflow', () => {
    it('should handle complete user journey', () => {
      // Setup complete page structure
      document.body.innerHTML = `
        <header class="site-header">
          <h1>My Blog</h1>
          <nav class="site-nav">
            <ul class="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </header>
        <main class="post">
          <article>
            <h1>Sample Post</h1>
            <p>This is a sample blog post with code examples.</p>
            <pre><code>function greet(name) {
  return \`Hello, \${name}!\`;
}</code></pre>
            <pre><code>const result = greet("World");
console.log(result); // "Hello, World!"</code></pre>
            <p>Thanks for reading!</p>
          </article>
        </main>
        <footer>
          <p>&copy; 2024 My Blog</p>
        </footer>
      `;

      // Set mobile environment
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: vi.fn(),
      });

      // Initialize all systems
      const configService = ConfigService.getInstance();
      const themeComponent = new ThemeToggleComponent();

      ready(() => {
        initTheme('system');
        themeComponent.init();
        initNavigation();
        initCopyCode();
      });

      // Simulate DOM ready
      Object.defineProperty(document, 'readyState', {
        writable: true,
        configurable: true,
        value: 'complete',
      });

      // Run ready callback
      ready(() => {
        initTheme('system');
        themeComponent.init();
        initNavigation();
        initCopyCode();
      });

      // Verify all systems initialized
      expect(document.querySelector('.theme-toggle')).toBeTruthy();
      expect(document.querySelector('.nav-toggle')).toBeTruthy();
      expect(document.querySelectorAll('.copy-button')).toHaveLength(2);

      // Test user interactions
      const themeToggle = document.querySelector('.theme-toggle') as HTMLButtonElement;
      const navToggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
      const copyButton = document.querySelector('.copy-button') as HTMLButtonElement;

      // Toggle theme
      themeToggle.click();
      expect(getCurrentTheme()).toBe('dark');

      // Toggle mobile menu
      navToggle.click();
      expect(navToggle.classList.contains('active')).toBe(true);

      // Copy code
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        configurable: true,
        value: {
          writeText: mockWriteText,
        },
      });

      copyButton.click();
      expect(mockWriteText).toHaveBeenCalled();

      // Cleanup
      themeComponent.destroy();
      cleanupMobileNav();
      cleanupCopyCode();
    });

    it('should handle error states gracefully', () => {
      // Test with minimal DOM
      document.body.innerHTML = '<div>Minimal content</div>';

      // Initialize systems - should not throw
      expect(() => {
        initTheme();
        initNavigation();
        initCopyCode();
      }).not.toThrow();

      // Test with corrupted localStorage
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => initTheme()).not.toThrow();

      // Restore
      localStorage.getItem = originalGetItem;
    });
  });

  describe('Performance and Memory Management', () => {
    it('should cleanup resources properly', () => {
      // Setup full application
      document.body.innerHTML = `
        <header class="site-header">
          <nav class="site-nav"></nav>
        </header>
        <main class="post">
          <pre><code>test code</code></pre>
        </main>
      `;

      const themeComponent = new ThemeToggleComponent();
      themeComponent.init();
      initNavigation();
      initCopyCode();

      // Verify resources created
      expect(document.querySelector('.theme-toggle')).toBeTruthy();
      expect(document.querySelector('.nav-toggle')).toBeTruthy();
      expect(document.querySelectorAll('.copy-button')).toHaveLength(1);

      // Cleanup all resources
      themeComponent.destroy();
      cleanupMobileNav();
      cleanupCopyCode();

      // Verify cleanup (should not throw if properly cleaned)
      expect(() => themeComponent.destroy()).not.toThrow();
      expect(() => cleanupMobileNav()).not.toThrow();
      expect(() => cleanupCopyCode()).not.toThrow();
    });

    it('should handle multiple initialization attempts', () => {
      document.body.innerHTML = `
        <header class="site-header"></header>
        <main><pre><code>code</code></pre></main>
      `;

      // Initialize multiple times - should not create duplicates
      initTheme();
      initTheme();

      initNavigation();
      initNavigation();

      initCopyCode();
      initCopyCode();

      // Should not create duplicate elements
      expect(document.querySelectorAll('.theme-toggle')).toHaveLength(1);
      expect(document.querySelectorAll('.nav-toggle')).toHaveLength(1);
      expect(document.querySelectorAll('.copy-button')).toHaveLength(1);
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain accessibility across all features', () => {
      document.body.innerHTML = `
        <header class="site-header">
          <nav class="site-nav"></nav>
        </header>
        <main class="post">
          <h1>Accessible Content</h1>
          <pre><code>accessible code</code></pre>
        </main>
      `;

      // Initialize all systems
      const themeComponent = new ThemeToggleComponent();
      themeComponent.init();
      initNavigation();
      initCopyCode();

      // Check ARIA attributes
      const themeToggle = document.querySelector('.theme-toggle') as HTMLElement;
      const navToggle = document.querySelector('.nav-toggle') as HTMLElement;
      const copyButton = document.querySelector('.copy-button') as HTMLElement;

      expect(themeToggle?.getAttribute('aria-label')).toBeTruthy();
      expect(themeToggle?.getAttribute('aria-pressed')).toBeTruthy();
      expect(navToggle?.getAttribute('aria-label')).toBeTruthy();
      expect(navToggle?.getAttribute('aria-expanded')).toBeTruthy();
      expect(copyButton?.getAttribute('aria-label')).toBeTruthy();

      // Test keyboard navigation
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      // Should not throw errors
      expect(() => document.dispatchEvent(escapeEvent)).not.toThrow();

      // Cleanup
      themeComponent.destroy();
      cleanupMobileNav();
      cleanupCopyCode();
    });
  });
});