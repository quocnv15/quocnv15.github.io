/**
 * Type-safe DOM manipulation utilities
 *
 * Provides:
 * - Safe element querying with TypeScript generics
 * - Null-checked element access
 * - Performance-optimized DOM operations
 * - Cross-browser compatibility helpers
 */

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