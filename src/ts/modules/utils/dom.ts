/**
 * Type-safe DOM manipulation utilities
 *
 * Provides:
 * - Safe element querying with TypeScript generics
 * - Null-checked element access
 * - Performance-optimized DOM operations
 * - Cross-browser compatibility helpers
 * - Memory leak prevention through automatic cleanup
 */

import { registerCleanup } from '../../core/cleanup-manager';

/**
 * Query selector with guaranteed return type
 * Throws error if element not found - use when element is required
 */
export const qs = <T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T => {
  const element = parent.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Required element not found: ${selector}`);
  }
  return element;
};

/**
 * Query selector with optional return type
 * Returns null if element not found - use when element is optional
 */
export const qsSafe = <T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T | null => {
  return parent.querySelector<T>(selector);
};

/**
 * Query selector all with type safety
 */
export const qsa = <T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): NodeListOf<T> => {
  return parent.querySelectorAll<T>(selector);
};

/**
 * Create element with attributes and text content
 */
export const create = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes?: Record<string, string>,
  textContent?: string
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return element;
};

/**
 * Check if DOM is ready
 */
export const ready = (callback: () => void): void => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

/**
 * Debounce function for event handlers
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for scroll handlers
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Smooth scroll to element with offset
 */
export const scrollToElement = (
  element: Element,
  offset: number = 0,
  behavior: ScrollBehavior = 'smooth'
): void => {
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior
  });
};

/**
 * Add event listener with cleanup function
 */
export const addEventListener = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): (() => void) => {
  element.addEventListener(event, handler, options);

  const cleanup = () => {
    element.removeEventListener(event, handler, options);
  };

  // Auto-register with cleanup manager for memory leak prevention
  registerCleanup(cleanup, {
    description: `Event listener: ${event} on ${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}`,
    priority: 1 // Event listeners are high priority
  });

  return cleanup;
};

/**
 * Add event listener with manual cleanup (doesn't auto-register)
 * Use when you want to manage cleanup manually
 */
export const addEventListenerManual = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): (() => void) => {
  element.addEventListener(event, handler, options);

  return () => {
    element.removeEventListener(event, handler, options);
  };
};

/**
 * Get computed style value
 */
export const getStyle = (element: Element, property: string): string => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

/**
 * Check if CSS custom property is supported
 */
export const supportsCustomProperties = (): boolean => {
  return CSS.supports('color', 'var(--test)');
};

/**
 * Load external script dynamically
 */
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);
  });
};

/**
 * Create MutationObserver with automatic cleanup
 */
export const createMutationObserver = (
  callback: MutationCallback,
  options?: MutationObserverInit
): {
  observer: MutationObserver;
  disconnect: () => void;
  observe: (target: Node, options?: MutationObserverInit) => void;
} => {
  const observer = new MutationObserver(callback);

  const disconnect = () => observer.disconnect();

  // Register cleanup
  registerCleanup(disconnect, {
    description: 'MutationObserver',
    priority: 2 // Observers are high priority
  });

  return {
    observer,
    disconnect,
    observe: (target: Node, observeOptions?: MutationObserverInit) => {
      observer.observe(target, observeOptions || options);
    }
  };
};

/**
 * Create IntersectionObserver with automatic cleanup
 */
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): {
  observer: IntersectionObserver;
  disconnect: () => void;
  observe: (target: Element) => void;
  unobserve: (target: Element) => void;
} => {
  const observer = new IntersectionObserver(callback, options);

  const disconnect = () => observer.disconnect();

  // Register cleanup
  registerCleanup(disconnect, {
    description: 'IntersectionObserver',
    priority: 2 // Observers are high priority
  });

  return {
    observer,
    disconnect,
    observe: (target: Element) => observer.observe(target),
    unobserve: (target: Element) => observer.unobserve(target)
  };
};

/**
 * Create ResizeObserver with automatic cleanup
 */
export const createResizeObserver = (
  callback: ResizeObserverCallback
): {
  observer: ResizeObserver;
  disconnect: () => void;
  observe: (target: Element) => void;
  unobserve: (target: Element) => void;
} => {
  const observer = new ResizeObserver(callback);

  const disconnect = () => observer.disconnect();

  // Register cleanup
  registerCleanup(disconnect, {
    description: 'ResizeObserver',
    priority: 2 // Observers are high priority
  });

  return {
    observer,
    disconnect,
    observe: (target: Element) => observer.observe(target),
    unobserve: (target: Element) => observer.unobserve(target)
  };
};

/**
 * Add interval with automatic cleanup
 */
export const setIntervalWithCleanup = (
  callback: () => void,
  delay: number,
  description?: string
): {
  intervalId: ReturnType<typeof setInterval>;
  clear: () => void;
} => {
  const intervalId = setInterval(callback, delay);

  const clear = () => clearInterval(intervalId);

  // Register cleanup
  registerCleanup(clear, {
    description: description || `Interval: ${delay}ms`,
    priority: 1 // Intervals are high priority
  });

  return {
    intervalId,
    clear
  };
};

/**
 * Add timeout with automatic cleanup
 */
export const setTimeoutWithCleanup = (
  callback: () => void,
  delay: number,
  description?: string
): {
  timeoutId: ReturnType<typeof setTimeout>;
  clear: () => void;
} => {
  const timeoutId = setTimeout(callback, delay);

  const clear = () => clearTimeout(timeoutId);

  // Register cleanup with lower priority since timeouts are often one-time
  registerCleanup(clear, {
    description: description || `Timeout: ${delay}ms`,
    priority: 0 // Timeouts are lower priority
  });

  return {
    timeoutId,
    clear
  };
};

/**
 * Add multiple event listeners to an element with batch cleanup
 */
export const addEventListeners = (
  element: HTMLElement,
  events: Array<{
    event: keyof HTMLElementEventMap;
    handler: (event: Event) => void;
    options?: boolean | AddEventListenerOptions;
  }>
): (() => void) => {
  const cleanupFunctions = events.map(({ event, handler, options }) =>
    addEventListener(element, event, handler as any, options)
  );

  const cleanupAll = () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };

  // Register batch cleanup
  registerCleanup(cleanupAll, {
    description: `Multiple event listeners on ${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}`,
    priority: 1
  });

  return cleanupAll;
};

/**
 * Create DOM element with automatic cleanup of children
 */
export const createWithCleanup = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes?: Record<string, string>,
  textContent?: string,
  cleanupChildren: boolean = true
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  if (cleanupChildren) {
    // Register cleanup to remove element from DOM
    registerCleanup(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, {
      description: `Remove element: ${tag.toLowerCase()}${element.id ? '#' + element.id : ''}`,
      priority: 0 // Element removal is lower priority
    });
  }

  return element;
};