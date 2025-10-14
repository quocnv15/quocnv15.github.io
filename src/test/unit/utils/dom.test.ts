/**
 * DOM utilities test suite
 * Tests for type-safe DOM manipulation, element creation, and utility functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  qs,
  qsSafe,
  qsa,
  create,
  ready,
  debounce,
  throttle,
  isInViewport,
  scrollToElement,
  addEventListener,
  getStyle,
  supportsCustomProperties,
  loadScript,
} from '../../../src/ts/modules/utils/dom';

describe('DOM Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    // Mock window methods
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
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
      },
    });

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
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('qs (query selector with guaranteed return)', () => {
    it('should return element when found', () => {
      const div = document.createElement('div');
      div.id = 'test-element';
      document.body.appendChild(div);

      const element = qs('#test-element');
      expect(element).toBe(div);
      expect(element.id).toBe('test-element');
    });

    it('should throw error when element not found', () => {
      expect(() => qs('#non-existent')).toThrow(
        'Required element not found: #non-existent'
      );
    });

    it('should search within parent element', () => {
      const parent = document.createElement('div');
      parent.innerHTML = '<span class="child">Child</span>';
      document.body.appendChild(parent);

      const child = qs('.child', parent);
      expect(child.tagName).toBe('SPAN');
      expect(child.textContent).toBe('Child');
    });

    it('should work with TypeScript generics', () => {
      const button = document.createElement('button');
      button.id = 'test-button';
      document.body.appendChild(button);

      const element = qs<HTMLButtonElement>('#test-button');
      expect(element).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('qsSafe (query selector with optional return)', () => {
    it('should return element when found', () => {
      const div = document.createElement('div');
      div.className = 'test-class';
      document.body.appendChild(div);

      const element = qsSafe('.test-class');
      expect(element).toBe(div);
    });

    it('should return null when element not found', () => {
      const element = qsSafe('.non-existent');
      expect(element).toBeNull();
    });

    it('should search within parent element', () => {
      const parent = document.createElement('div');
      parent.innerHTML = '<p class="paragraph">Text</p>';
      document.body.appendChild(parent);

      const paragraph = qsSafe('.paragraph', parent);
      expect(paragraph?.tagName).toBe('P');
    });

    it('should work with TypeScript generics', () => {
      const input = document.createElement('input');
      input.type = 'text';
      document.body.appendChild(input);

      const element = qsSafe<HTMLInputElement>('input[type="text"]');
      expect(element).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('qsa (query selector all)', () => {
    it('should return all matching elements', () => {
      document.body.innerHTML = `
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
        <span class="item">4</span>
      `;

      const items = qsa('.item');
      expect(items).toHaveLength(4);
      expect(items[0].textContent).toBe('1');
    });

    it('should return empty NodeList when no matches', () => {
      const items = qsa('.non-existent');
      expect(items).toHaveLength(0);
    });

    it('should search within parent element', () => {
      const parent = document.createElement('div');
      parent.innerHTML = `
        <div class="child">Child 1</div>
        <div class="child">Child 2</div>
      `;
      document.body.appendChild(parent);

      const children = qsa('.child', parent);
      expect(children).toHaveLength(2);
    });

    it('should work with TypeScript generics', () => {
      document.body.innerHTML = `
        <input type="checkbox" class="check">
        <input type="checkbox" class="check">
      `;

      const checkboxes = qsa<HTMLInputElement>('input[type="checkbox"]');
      expect(checkboxes[0]).toBeInstanceOf(HTMLInputElement);
      expect(checkboxes).toHaveLength(2);
    });
  });

  describe('create (element creation)', () => {
    it('should create element with tag name', () => {
      const div = create('div');
      expect(div.tagName).toBe('DIV');
      expect(div).toBeInstanceOf(HTMLDivElement);
    });

    it('should create element with attributes', () => {
      const button = create('button', {
        type: 'button',
        class: 'btn btn-primary',
        'aria-label': 'Click me',
        disabled: '',
      });

      expect(button.type).toBe('button');
      expect(button.className).toBe('btn btn-primary');
      expect(button.getAttribute('aria-label')).toBe('Click me');
      expect(button.disabled).toBe(true);
    });

    it('should create element with text content', () => {
      const paragraph = create('p', {}, 'Hello, World!');
      expect(paragraph.textContent).toBe('Hello, World!');
    });

    it('should create element with attributes and text content', () => {
      const link = create('a', {
        href: 'https://example.com',
        target: '_blank',
      }, 'Example Link');

      expect(link.href).toBe('https://example.com/');
      expect(link.target).toBe('_blank');
      expect(link.textContent).toBe('Example Link');
    });

    it('should work with TypeScript generics for specific element types', () => {
      const image = create<HTMLImageElement>('img', {
        src: 'test.jpg',
        alt: 'Test image',
        width: '100',
        height: '100',
      });

      expect(image).toBeInstanceOf(HTMLImageElement);
      expect(image.src).toContain('test.jpg');
      expect(image.alt).toBe('Test image');
    });

    it('should handle empty attributes object', () => {
      const element = create('span', {});
      expect(element.tagName).toBe('SPAN');
    });

    it('should handle undefined text content', () => {
      const element = create('div', {}, undefined);
      expect(element.textContent).toBe('');
    });
  });

  describe('ready (DOM ready state)', () => {
    it('should execute callback immediately if DOM is ready', () => {
      Object.defineProperty(document, 'readyState', {
        writable: true,
        configurable: true,
        value: 'complete',
      });

      const callback = vi.fn();
      ready(callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should add event listener if DOM is loading', () => {
      Object.defineProperty(document, 'readyState', {
        writable: true,
        configurable: true,
        value: 'loading',
      });

      const callback = vi.fn();
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      ready(callback);

      expect(callback).not.toHaveBeenCalled();
      expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', callback);

      // Simulate DOMContentLoaded event
      const domEvent = new Event('DOMContentLoaded');
      document.dispatchEvent(domEvent);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle interactive ready state', () => {
      Object.defineProperty(document, 'readyState', {
        writable: true,
        configurable: true,
        value: 'interactive',
      });

      const callback = vi.fn();
      ready(callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('debounce', () => {
    it('should delay function execution', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous timeout if called again', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      vi.advanceTimersByTime(50);

      debouncedFunc(); // Should reset timer
      vi.advanceTimersByTime(50);
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc('arg1', 'arg2', 'arg3');
      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    it('should maintain correct context', () => {
      const obj = {
        value: 42,
        method: vi.fn(function(this: any) {
          return this.value;
        }),
      };

      const debouncedMethod = debounce(obj.method, 100);
      debouncedMethod.call(obj);
      vi.advanceTimersByTime(100);

      expect(obj.method).toHaveBeenCalled();
    });
  });

  describe('throttle', () => {
    it('should execute function immediately', () => {
      const func = vi.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc();
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should throttle subsequent calls', () => {
      const func = vi.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc();
      throttledFunc();
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttledFunc();

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to throttled function', () => {
      const func = vi.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc('test', 123);
      expect(func).toHaveBeenCalledWith('test', 123);
    });

    it('should maintain correct context', () => {
      const obj = {
        name: 'test',
        method: vi.fn(function(this: any) {
          return this.name;
        }),
      };

      const throttledMethod = throttle(obj.method, 100);
      throttledMethod.call(obj);

      expect(obj.method).toHaveBeenCalled();
    });
  });

  describe('isInViewport', () => {
    it('should return true when element is fully visible', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top: 100,
          left: 100,
          bottom: 200,
          right: 200,
        }),
      });

      expect(isInViewport(element)).toBe(true);
    });

    it('should return false when element is above viewport', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top: -50,
          left: 100,
          bottom: 50,
          right: 200,
        }),
      });

      expect(isInViewport(element)).toBe(false);
    });

    it('should return false when element is below viewport', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top: 900,
          left: 100,
          bottom: 1000,
          right: 200,
        }),
      });

      expect(isInViewport(element)).toBe(false);
    });

    it('should return false when element is left of viewport', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top: 100,
          left: -50,
          bottom: 200,
          right: 50,
        }),
      });

      expect(isInViewport(element)).toBe(false);
    });

    it('should return false when element is right of viewport', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top: 100,
          left: 1300,
          bottom: 200,
          right: 1400,
        }),
      });

      expect(isInViewport(element)).toBe(false);
    });
  });

  describe('scrollToElement', () => {
    it('should scroll to element with default options', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top: 300,
          left: 0,
          bottom: 400,
          right: 100,
        }),
      });

      scrollToElement(element);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 300,
        behavior: 'smooth',
      });
    });

    it('should scroll to element with offset', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top: 300,
          left: 0,
          bottom: 400,
          right: 100,
        }),
      });

      scrollToElement(element, 50);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 250, // 300 - 50
        behavior: 'smooth',
      });
    });

    it('should scroll with custom behavior', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top: 300,
          left: 0,
          bottom: 400,
          right: 100,
        }),
      });

      scrollToElement(element, 0, 'auto');

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 300,
        behavior: 'auto',
      });
    });

    it('should account for current scroll position', () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 100,
      });

      const element = document.createElement('div');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({
          top: 200,
          left: 0,
          bottom: 300,
          right: 100,
        }),
      });

      scrollToElement(element);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 300, // 200 + 100 (scrollY)
        behavior: 'smooth',
      });
    });
  });

  describe('addEventListener', () => {
    it('should add event listener and return cleanup function', () => {
      const element = document.createElement('button');
      const handler = vi.fn();
      const cleanup = addEventListener(element, 'click', handler);

      element.click();
      expect(handler).toHaveBeenCalledTimes(1);

      cleanup();
      element.click();
      expect(handler).toHaveBeenCalledTimes(1); // Should not increase
    });

    it('should work with different event types', () => {
      const element = document.createElement('input');
      const keydownHandler = vi.fn();
      const cleanup = addEventListener(element, 'keydown', keydownHandler);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      element.dispatchEvent(event);

      expect(keydownHandler).toHaveBeenCalledWith(event);

      cleanup();
    });

    it('should support event options', () => {
      const element = document.createElement('button');
      const handler = vi.fn();
      const options = { once: true };
      const cleanup = addEventListener(element, 'click', handler, options);

      element.click();
      element.click(); // Should not trigger due to once option

      expect(handler).toHaveBeenCalledTimes(1);

      cleanup();
    });

    it('should maintain correct this context', () => {
      const element = document.createElement('div');
      const handler = vi.fn(function(this: HTMLElement) {
        expect(this).toBe(element);
      });

      addEventListener(element, 'click', handler);
      element.click();

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('getStyle', () => {
    it('should return computed style value', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      const style = getStyle(element, 'color');
      expect(style).toBe('16px'); // Mocked value

      expect(window.getComputedStyle).toHaveBeenCalledWith(element);
    });

    it('should work with different CSS properties', () => {
      const element = document.createElement('span');
      const mockComputedStyle = {
        getPropertyValue: vi.fn()
          .mockReturnValueOnce('10px')
          .mockReturnValueOnce('rgba(0,0,0,0.5)')
          .mockReturnValueOnce('flex'),
      };

      window.getComputedStyle = vi.fn(() => mockComputedStyle);

      expect(getStyle(element, 'margin')).toBe('10px');
      expect(getStyle(element, 'background-color')).toBe('rgba(0,0,0,0.5)');
      expect(getStyle(element, 'display')).toBe('flex');
    });
  });

  describe('supportsCustomProperties', () => {
    it('should return true when CSS custom properties are supported', () => {
      CSS.supports = vi.fn(() => true);

      const result = supportsCustomProperties();
      expect(result).toBe(true);
      expect(CSS.supports).toHaveBeenCalledWith('color', 'var(--test)');
    });

    it('should return false when CSS custom properties are not supported', () => {
      CSS.supports = vi.fn(() => false);

      const result = supportsCustomProperties();
      expect(result).toBe(false);
    });
  });

  describe('loadScript', () => {
    it('should load script successfully', async () => {
      const scriptSrc = 'https://example.com/script.js';

      // Mock script element methods
      const mockScript = {
        src: '',
        async: false,
        onload: null as any,
        onerror: null as any,
      };

      const originalCreateElement = document.createElement;
      document.createElement = vi.fn((tagName) => {
        if (tagName === 'script') {
          return mockScript as any;
        }
        return originalCreateElement.call(document, tagName);
      });

      const promise = loadScript(scriptSrc);

      expect(mockScript.src).toBe(scriptSrc);
      expect(mockScript.async).toBe(true);

      // Simulate successful load
      mockScript.onload();

      await expect(promise).resolves.toBeUndefined();

      // Restore
      document.createElement = originalCreateElement;
    });

    it('should reject when script fails to load', async () => {
      const scriptSrc = 'https://example.com/nonexistent.js';

      const mockScript = {
        src: '',
        async: false,
        onload: null as any,
        onerror: null as any,
      };

      const originalCreateElement = document.createElement;
      document.createElement = vi.fn(() => mockScript as any);

      const promise = loadScript(scriptSrc);

      // Simulate load error
      mockScript.onerror();

      await expect(promise).rejects.toThrow('Failed to load script: https://example.com/nonexistent.js');

      // Restore
      document.createElement = originalCreateElement;
    });

    it('should append script to document head', async () => {
      const mockScript = {
        src: '',
        async: false,
        onload: null as any,
        onerror: null as any,
      };

      const originalCreateElement = document.createElement;
      const originalAppendChild = document.head.appendChild;

      document.createElement = vi.fn(() => mockScript as any);
      document.head.appendChild = vi.fn();

      const promise = loadScript('test.js');
      mockScript.onload();

      await promise;

      expect(document.head.appendChild).toHaveBeenCalledWith(mockScript);

      // Restore
      document.createElement = originalCreateElement;
      document.head.appendChild = originalAppendChild;
    });
  });

  describe('Integration Tests', () => {
    it('should work together in complex scenarios', () => {
      // Create elements
      const container = create('div', { class: 'container' });
      const button = create('button', { class: 'btn' }, 'Click me');
      const list = create('ul', { class: 'list' });

      // Add list items
      for (let i = 1; i <= 3; i++) {
        const item = create('li', {}, `Item ${i}`);
        list.appendChild(item);
      }

      // Assemble DOM
      container.appendChild(button);
      container.appendChild(list);
      document.body.appendChild(container);

      // Query elements
      const foundButton = qsSafe('.btn', container);
      const items = qsa('li', list);

      expect(foundButton).toBe(button);
      expect(items).toHaveLength(3);

      // Test event handling
      let clickCount = 0;
      const cleanup = addEventListener(button, 'click', () => {
        clickCount++;
      });

      button.click();
      expect(clickCount).toBe(1);

      // Test throttling
      const throttledHandler = throttle(() => {
        clickCount++;
      }, 100);

      throttledHandler();
      throttledHandler();
      throttledHandler();

      expect(clickCount).toBe(2); // One immediate, one throttled

      // Cleanup
      cleanup();
    });

    it('should handle error conditions gracefully', () => {
      // Test qs with non-existent element
      expect(() => qs('.non-existent')).toThrow();

      // Test qsSafe with non-existent element
      const element = qsSafe('.non-existent');
      expect(element).toBeNull();

      // Test qsa with non-existent elements
      const elements = qsa('.non-existent');
      expect(elements).toHaveLength(0);
    });
  });
});