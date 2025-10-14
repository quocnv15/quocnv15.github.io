/**
 * Comprehensive test setup file for Vitest
 * Provides all necessary mocks for DOM APIs, browser features, and Node.js environment
 */

import { vi } from 'vitest';

// ======================
// Window and Browser APIs
// ======================

// Mock matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query: string) => ({
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

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window dimensions
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock scroll properties
Object.defineProperty(window, 'scrollY', {
  writable: true,
  configurable: true,
  value: 0,
});

Object.defineProperty(window, 'scrollX', {
  writable: true,
  configurable: true,
  value: 0,
});

Object.defineProperty(window, 'pageYOffset', {
  writable: true,
  configurable: true,
  value: 0,
});

Object.defineProperty(window, 'pageXOffset', {
  writable: true,
  configurable: true,
  value: 0,
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  configurable: true,
  value: vi.fn(),
});

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  configurable: true,
  value: vi.fn(() => ({
    getPropertyValue: vi.fn(() => '16px'),
    getPropertyValue: vi.fn().mockReturnValue('16px'),
  })),
});

// Mock CSS.supports - CSS object might not exist in test environment
if (typeof CSS !== 'undefined') {
  Object.defineProperty(CSS, 'supports', {
    writable: true,
    configurable: true,
    value: vi.fn(() => true),
  });
} else {
  // Create CSS object if it doesn't exist
  (global as any).CSS = {
    supports: vi.fn(() => true),
  };
}

// Mock touch support
Object.defineProperty(window, 'ontouchstart', {
  writable: true,
  configurable: true,
  value: undefined,
});

Object.defineProperty(navigator, 'maxTouchPoints', {
  writable: true,
  configurable: true,
  value: 0,
});

// Mock secure context
Object.defineProperty(window, 'isSecureContext', {
  writable: true,
  configurable: true,
  value: true,
});

// ======================
// Storage APIs
// ======================

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index: number) {
      return Object.keys(store)[index] || null;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// ======================
// Modern Web APIs
// ======================

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Mock execCommand for clipboard fallback
Object.defineProperty(document, 'execCommand', {
  writable: true,
  configurable: true,
  value: vi.fn().mockReturnValue(true),
});

// ======================
// Environment Detection
// ======================

// Mock process.env for Node.js environment detection
const originalEnv = process.env;

// Mock Jekyll environment
Object.defineProperty(window, 'jekyllEnvironment', {
  writable: true,
  configurable: true,
  value: undefined,
});

// ======================
// DOM Properties
// ======================

// Mock document.documentElement properties
Object.defineProperty(document.documentElement, 'lang', {
  writable: true,
  configurable: true,
  value: 'en',
});

Object.defineProperty(document.documentElement, 'clientHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

Object.defineProperty(document.documentElement, 'clientWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

// Mock document.body properties
Object.defineProperty(document.body, 'classList', {
  writable: true,
  configurable: true,
  value: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(),
    toggle: vi.fn(),
  },
});

Object.defineProperty(document.body, 'style', {
  writable: true,
  configurable: true,
  value: {},
});

// Mock readyState
Object.defineProperty(document, 'readyState', {
  writable: true,
  configurable: true,
  value: 'complete',
});

// ======================
// Console Mocking
// ======================

// Mock console methods for cleaner test output while preserving errors
const originalConsole = { ...console };
global.console = {
  ...originalConsole,
  log: vi.fn((...args) => originalConsole.log(...args)),
  warn: vi.fn((...args) => originalConsole.warn(...args)),
  error: vi.fn((...args) => originalConsole.error(...args)),
  info: vi.fn((...args) => originalConsole.info(...args)),
  debug: vi.fn((...args) => originalConsole.debug(...args)),
};

// ======================
// Timer Mocks
// ======================

// Note: vi.useFakeTimers() should be used in individual tests when needed
// This allows for more granular control over timing in specific test scenarios

// ======================
// Cleanup Helpers
// ======================

// Global cleanup function to reset mocks between tests
global.resetTestEnvironment = () => {
  // Clear localStorage
  localStorageMock.clear();

  // Reset window properties
  Object.defineProperty(window, 'innerWidth', { value: 1024 });
  Object.defineProperty(window, 'innerHeight', { value: 768 });
  Object.defineProperty(window, 'scrollY', { value: 0 });
  Object.defineProperty(window, 'isSecureContext', { value: true });

  // Reset DOM
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.className = '';
  document.documentElement.lang = 'en';

  // Reset mocks
  vi.clearAllMocks();

  // Reset process env
  process.env = { ...originalEnv };

  // Reset navigator
  Object.defineProperty(navigator, 'maxTouchPoints', { value: 0 });
  Object.defineProperty(window, 'ontouchstart', { value: undefined });
};

// ======================
// Custom Test Utilities
// ======================

// Helper to create mock elements with properties
global.createMockElement = (tagName: string, properties: Record<string, any> = {}) => {
  const element = document.createElement(tagName);

  Object.entries(properties).forEach(([key, value]) => {
    if (key === 'classList') {
      Object.defineProperty(element, 'classList', {
        value: {
          add: vi.fn(),
          remove: vi.fn(),
          contains: vi.fn().mockReturnValue(false),
          toggle: vi.fn(),
        },
      });
    } else if (key === 'style') {
      Object.defineProperty(element, 'style', {
        value: value || {},
      });
    } else if (key === 'getBoundingClientRect') {
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: typeof value === 'function' ? value : vi.fn(() => value),
      });
    } else {
      (element as any)[key] = value;
    }
  });

  return element;
};

// Helper to mock media queries
global.mockMediaQuery = (matches: boolean = false) => {
  return {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
};

// Helper to simulate user interactions
global.simulateClick = (element: Element) => {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  element.dispatchEvent(event);
};

// Helper to simulate keyboard events
global.simulateKeydown = (key: string, options: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  document.dispatchEvent(event);
  return event;
};

// Export types for better TypeScript support in tests
export type MockElement = HTMLElement & {
  _cleanup?: () => void;
  _keycleanup?: () => void;
  _keyboardCleanup?: () => void;
};

declare global {
  var resetTestEnvironment: () => void;
  var createMockElement: (tagName: string, properties?: Record<string, any>) => HTMLElement;
  var mockMediaQuery: (matches?: boolean) => MediaQueryList;
  var simulateClick: (element: Element) => void;
  var simulateKeydown: (key: string, options?: KeyboardEventInit) => KeyboardEvent;
}