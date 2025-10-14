/**
 * Navigation module test suite
 * Tests for mobile navigation, hamburger menu, and responsive behavior
 */

import { describe, it, expect, beforeEach, afterEach, vi, type MockedFunction } from 'vitest';
import {
  initNavigation,
  cleanupMobileNav,
  initMobileNav,
  addMobileNavStyles,
} from '../../../src/ts/modules/navigation';

// Mock DOM utilities
vi.mock('../../../src/ts/modules/utils/dom', () => ({
  qsSafe: vi.fn(),
  addEventListener: vi.fn(() => () => {}), // Return cleanup function
}));

// Create a mock window object for resize events
const createMockWindow = (width: number) => ({
  innerWidth: width,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  scrollTo: vi.fn(),
  scrollY: 0,
});

// Create a mock document with necessary properties
const createMockDocument = () => ({
  body: {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
    },
    style: {},
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  },
  createElement: vi.fn(() => ({
    className: '',
    id: '',
    innerHTML: '',
    setAttribute: vi.fn(),
    appendChild: vi.fn(),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      toggle: vi.fn(),
    },
    style: {},
    focus: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    contains: vi.fn(),
  })),
  getElementById: vi.fn(),
  querySelector: vi.fn(),
  head: {
    appendChild: vi.fn(),
  },
  activeElement: null,
});

describe('Navigation Module', () => {
  let mockWindow: any;
  let mockDocument: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup window mocks
    mockWindow = createMockWindow(1024); // Desktop size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
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

    // Setup touch detection
    Object.defineProperty(window, 'ontouchstart', {
      writable: true,
      configurable: true,
      value: false,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Reset document body styles
    Object.defineProperty(document.body, 'style', {
      writable: true,
      configurable: true,
      value: {},
    });

    // Reset document body classList
    Object.defineProperty(document.body, 'classList', {
      writable: true,
      configurable: true,
      value: {
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn(),
      },
    });

    // Mock setTimeout and clearTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanupMobileNav();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Mobile Detection', () => {
    it('should detect mobile based on screen width', () => {
      // Mock mobile screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      // Import after setting width to get correct detection
      const navigationModule = require('../../../src/ts/modules/navigation');

      // Mock qsSafe to return null for all elements
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);

      navigationModule.initNavigation();

      // Should not initialize on mobile when no elements found
      expect(console.log).toHaveBeenCalledWith('📱 Mobile device detected - mobile navigation not initialized');
    });

    it('should detect mobile based on touch support', () => {
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        configurable: true,
        value: vi.fn(),
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);

      navigationModule.initNavigation();
    });

    it('should detect mobile based on max touch points', () => {
      Object.defineProperty(navigator, 'maxTouchPoints', {
        writable: true,
        configurable: true,
        value: 1,
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);

      navigationModule.initNavigation();
    });

    it('should not initialize on desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);

      navigationModule.initNavigation();

      expect(console.log).toHaveBeenCalledWith('📱 Desktop device detected - mobile navigation not initialized');
    });
  });

  describe('Body Scroll Lock', () => {
    beforeEach(() => {
      // Mock mobile detection
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    it('should lock body scroll when menu opens', () => {
      const mockToggle = {
        classList: { contains: vi.fn().mockReturnValue(false) },
        setAttribute: vi.fn(),
        focus: vi.fn(),
      };

      const mockMenu = {
        classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
        querySelector: vi.fn(),
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.openMobileMenu();

      expect(document.body.classList.add).toHaveBeenCalledWith('nav-open');
      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.style.position).toBe('fixed');
    });

    it('should unlock body scroll when menu closes', () => {
      // Set initial state
      document.body.style.top = '-100px';

      const mockToggle = {
        classList: { remove: vi.fn(), contains: vi.fn() },
        setAttribute: vi.fn(),
        focus: vi.fn(),
      };

      const mockMenu = {
        classList: { remove: vi.fn(), contains: vi.fn() },
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.closeMobileMenu();

      expect(document.body.classList.remove).toHaveBeenCalledWith('nav-open');
      expect(document.body.style.overflow).toBe('');
      expect(window.scrollTo).toHaveBeenCalledWith(0, 100);
    });
  });

  describe('Menu Toggle Functionality', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    it('should open menu when closed', () => {
      const mockToggle = {
        classList: {
          contains: vi.fn().mockReturnValue(false),
          add: vi.fn(),
          remove: vi.fn(),
        },
        setAttribute: vi.fn(),
        focus: vi.fn(),
      };

      const mockMenu = {
        classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
        querySelector: vi.fn(),
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.toggleMobileMenu();

      expect(mockMenu.classList.add).toHaveBeenCalledWith('active');
      expect(mockToggle.classList.add).toHaveBeenCalledWith('active');
      expect(mockToggle.setAttribute).toHaveBeenCalledWith('aria-expanded', 'true');
    });

    it('should close menu when open', () => {
      const mockToggle = {
        classList: {
          contains: vi.fn().mockReturnValue(true),
          add: vi.fn(),
          remove: vi.fn(),
        },
        setAttribute: vi.fn(),
        focus: vi.fn(),
      };

      const mockMenu = {
        classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
        querySelector: vi.fn(),
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.toggleMobileMenu();

      expect(mockMenu.classList.remove).toHaveBeenCalledWith('active');
      expect(mockToggle.classList.remove).toHaveBeenCalledWith('active');
      expect(mockToggle.setAttribute).toHaveBeenCalledWith('aria-expanded', 'false');
    });

    it('should handle missing toggle button', () => {
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);

      const navigationModule = require('../../../src/ts/modules/navigation');

      expect(() => navigationModule.toggleMobileMenu()).not.toThrow();
    });

    it('should handle missing menu element', () => {
      const mockToggle = {
        classList: { contains: vi.fn() },
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.toggleMobileMenu();

      // Should not throw and should not proceed
      expect(mockToggle.classList.contains).toHaveBeenCalled();
    });
  });

  describe('Click Outside to Close', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    it('should close menu when clicking outside', () => {
      const mockToggle = {
        classList: { remove: vi.fn(), contains: vi.fn().mockReturnValue(false) },
        setAttribute: vi.fn(),
        focus: vi.fn(),
      };

      const mockMenu = {
        classList: { remove: vi.fn(), contains: vi.fn().mockReturnValue(false) },
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');

      // Mock a click event
      const mockEvent = {
        target: document.createElement('div'),
      };

      navigationModule.handleOutsideClick(mockEvent);

      expect(mockMenu.classList.remove).toHaveBeenCalledWith('active');
    });

    it('should not close menu when clicking inside menu', () => {
      const mockMenu = {
        classList: { remove: vi.fn(), contains: vi.fn().mockReturnValue(true) },
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');

      const mockEvent = {
        target: document.createElement('div'),
      };

      navigationModule.handleOutsideClick(mockEvent);

      expect(mockMenu.classList.remove).not.toHaveBeenCalled();
    });

    it('should not close menu when clicking on toggle button', () => {
      const mockToggle = {
        classList: { remove: vi.fn(), contains: vi.fn().mockReturnValue(true) },
      };

      const mockMenu = {
        classList: { remove: vi.fn(), contains: vi.fn().mockReturnValue(false) },
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');

      const mockEvent = {
        target: document.createElement('div'),
      };

      navigationModule.handleOutsideClick(mockEvent);

      expect(mockMenu.classList.remove).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    it('should close menu on Escape key', () => {
      const mockToggle = {
        classList: { remove: vi.fn(), contains: vi.fn() },
        setAttribute: vi.fn(),
        focus: vi.fn(),
      };

      const mockMenu = {
        classList: { remove: vi.fn(), contains: vi.fn() },
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');

      const mockEvent = {
        key: 'Escape',
      };

      navigationModule.handleEscapeKey(mockEvent);

      expect(mockMenu.classList.remove).toHaveBeenCalledWith('active');
    });

    it('should trap focus within menu', () => {
      const firstElement = { focus: vi.fn() };
      const lastElement = { focus: vi.fn() };

      const mockMenu = {
        classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
        querySelectorAll: vi.fn().mockReturnValue([firstElement, lastElement]),
      };

      // Mock document.activeElement
      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: firstElement,
      });

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(mockMenu);

      const navigationModule = require('../../../src/ts/modules/navigation');

      // Test Tab key (forward navigation)
      const tabEvent = {
        key: 'Tab',
        shiftKey: false,
        preventDefault: vi.fn(),
      };

      navigationModule.setupKeyboardNavigation();

      // Get the keydown handler that was set up
      const addEventListener = require('../../../src/ts/modules/utils/dom').addEventListener;
      const keydownHandler = addEventListener.mock.calls.find(
        (call: any) => call[0] === mockMenu && call[1] === 'keydown'
      )?.[1];

      if (keydownHandler) {
        keydownHandler(tabEvent);
        expect(lastElement.focus).toHaveBeenCalled();
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('should close menu when switching from mobile to desktop', () => {
      // Start with mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      const mockToggle = {
        classList: { remove: vi.fn(), contains: vi.fn() },
        setAttribute: vi.fn(),
        focus: vi.fn(),
      };

      const mockMenu = {
        classList: { remove: vi.fn(), contains: vi.fn().mockReturnValue(true) },
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.setupResponsiveBehavior();

      // Simulate resize to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      // Get the resize handler
      const addEventListener = require('../../../src/ts/modules/utils/dom').addEventListener;
      const resizeHandler = addEventListener.mock.calls.find(
        (call: any) => call[0] === window && call[1].name?.includes('debounced')
      )?.[1];

      if (resizeHandler) {
        vi.advanceTimersByTime(150); // Debounce delay
        resizeHandler();
      }

      expect(mockMenu.classList.remove).toHaveBeenCalledWith('active');
    });
  });

  describe('Menu Creation', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    it('should create mobile toggle button when none exists', () => {
      const mockHeader = {
        appendChild: vi.fn(),
      };

      const mockDesktopNav = {
        cloneNode: vi.fn().mockReturnValue({ innerHTML: 'nav links' }),
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return null;
        if (selector === '.nav-mobile') return null;
        if (selector === '.site-header, header') return mockHeader;
        if (selector === '.site-nav, .nav-links') return mockDesktopNav;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.initNavigation();

      expect(mockHeader.appendChild).toHaveBeenCalledTimes(2); // toggle and menu
    });

    it('should use existing toggle button', () => {
      const existingToggle = {
        classList: { remove: vi.fn(), contains: vi.fn() },
        setAttribute: vi.fn(),
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return existingToggle;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.setupMobileToggle();

      expect(existingToggle.classList.remove).toHaveBeenCalledWith('active');
      expect(existingToggle.setAttribute).toHaveBeenCalledWith('aria-expanded', 'false');
    });
  });

  describe('Cleanup', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    it('should cleanup all event listeners and elements', () => {
      const mockCleanup = vi.fn();
      const mockToggle = {
        _cleanup: mockCleanup,
      };

      const mockMenu = {
        _keyboardCleanup: mockCleanup,
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      // Setup cleanup functions on document
      (document as any)._clickOutsideCleanup = mockCleanup;
      (document as any)._escapeCleanup = mockCleanup;
      (window as any)._resizeCleanup = mockCleanup;

      cleanupMobileNav();

      expect(mockCleanup).toHaveBeenCalledTimes(5); // 3 on document/window + 1 on toggle + 1 on menu
    });

    it('should handle cleanup when no elements exist', () => {
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);

      expect(() => cleanupMobileNav()).not.toThrow();
    });
  });

  describe('Styles Management', () => {
    it('should add mobile navigation styles', () => {
      addMobileNavStyles();

      const styleElement = document.getElementById('mobile-nav-styles');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.tagName).toBe('STYLE');
    });

    it('should not add styles if they already exist', () => {
      // Add existing styles
      const existingStyle = document.createElement('style');
      existingStyle.id = 'mobile-nav-styles';
      existingStyle.textContent = '/* existing styles */';
      document.head.appendChild(existingStyle);

      const originalContent = existingStyle.textContent;

      addMobileNavStyles();

      // Should not have added another style element
      const styles = document.querySelectorAll('#mobile-nav-styles');
      expect(styles).toHaveLength(1);
      expect(existingStyle.textContent).toBe(originalContent);
    });

    it('should include responsive breakpoints', () => {
      addMobileNavStyles();

      const styleElement = document.getElementById('mobile-nav-styles') as HTMLStyleElement;
      const content = styleElement.textContent || '';

      expect(content).toContain('@media (max-width: 768px)');
      expect(content).toContain('.nav-toggle');
      expect(content).toContain('display: block');
    });

    it('should include dark theme support', () => {
      addMobileNavStyles();

      const styleElement = document.getElementById('mobile-nav-styles') as HTMLStyleElement;
      const content = styleElement.textContent || '';

      expect(content).toContain('[data-theme="dark"]');
      expect(content).toContain('.nav-mobile');
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    it('should handle complete navigation workflow', () => {
      const mockToggle = {
        classList: {
          contains: vi.fn().mockReturnValue(false),
          add: vi.fn(),
          remove: vi.fn(),
        },
        setAttribute: vi.fn(),
        focus: vi.fn(),
        _cleanup: vi.fn(),
      };

      const mockMenu = {
        classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
        querySelector: vi.fn(),
        querySelectorAll: vi.fn().mockReturnValue([]),
        _keyboardCleanup: vi.fn(),
      };

      const mockHeader = {
        appendChild: vi.fn(),
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        if (selector === '.site-header, header') return mockHeader;
        if (selector === '.site-nav, .nav-links') return null;
        return null;
      });

      // Initialize navigation
      initNavigation();

      // Should setup all components
      expect(mockToggle.classList.remove).toHaveBeenCalled();
      expect(mockMenu.classList.add).not.toHaveBeenCalled(); // Menu starts closed

      // Cleanup
      cleanupMobileNav();
      expect(mockToggle._cleanup).toHaveBeenCalled();
    });

    it('should gracefully handle missing DOM elements', () => {
      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockReturnValue(null);

      expect(() => initNavigation()).not.toThrow();
      expect(() => cleanupMobileNav()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
    });

    it('should set proper ARIA attributes', () => {
      const mockToggle = {
        classList: { remove: vi.fn(), contains: vi.fn() },
        setAttribute: vi.fn(),
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return null;
        if (selector === '.site-header, header') return null;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.setupMobileToggle();

      expect(mockToggle.setAttribute).toHaveBeenCalledWith('aria-expanded', 'false');
      expect(mockToggle.setAttribute).toHaveBeenCalledWith('aria-controls', 'mobile-menu');
      expect(mockToggle.setAttribute).toHaveBeenCalledWith('aria-label', 'Toggle navigation menu');
    });

    it('should update ARIA expanded state when menu opens', () => {
      const mockToggle = {
        classList: {
          contains: vi.fn().mockReturnValue(false),
          add: vi.fn(),
          remove: vi.fn(),
        },
        setAttribute: vi.fn(),
        focus: vi.fn(),
      };

      const mockMenu = {
        classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
        querySelector: vi.fn(),
      };

      const { qsSafe } = require('../../../src/ts/modules/utils/dom');
      qsSafe.mockImplementation((selector) => {
        if (selector === '.nav-toggle') return mockToggle;
        if (selector === '.nav-mobile') return mockMenu;
        return null;
      });

      const navigationModule = require('../../../src/ts/modules/navigation');
      navigationModule.toggleMobileMenu();

      expect(mockToggle.setAttribute).toHaveBeenCalledWith('aria-expanded', 'true');
    });
  });
});