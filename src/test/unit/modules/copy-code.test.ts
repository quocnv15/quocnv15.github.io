/**
 * Copy code module test suite
 * Tests for clipboard functionality, fallback methods, and visual feedback
 */

import { describe, it, expect, beforeEach, afterEach, vi, type MockedFunction } from 'vitest';
import {
  initCopyCode,
  cleanupCopyCode,
  addCopyButtonStyles,
} from '../../../src/ts/modules/copy-code';

// Mock DOM utilities
vi.mock('../../../src/ts/modules/utils/dom', () => ({
  qsa: vi.fn(),
  create: vi.fn(),
  addEventListener: vi.fn(() => () => {}), // Return cleanup function
}));

describe('Copy Code Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    // Mock secure context
    Object.defineProperty(window, 'isSecureContext', {
      writable: true,
      configurable: true,
      value: true,
    });

    // Mock execCommand
    Object.defineProperty(document, 'execCommand', {
      writable: true,
      configurable: true,
      value: vi.fn().mockReturnValue(true),
    });

    // Mock setTimeout and clearTimeout
    vi.useFakeTimers();

    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cleanupCopyCode();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('copyToClipboard', () => {
    it('should use modern clipboard API when available', async () => {
      const copyModule = require('../../../src/ts/modules/copy-code');
      const mockWriteText = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        configurable: true,
        value: {
          writeText: mockWriteText,
        },
      });

      const result = await copyModule.copyToClipboard('test code');

      expect(mockWriteText).toHaveBeenCalledWith('test code');
      expect(result).toBe(true);
    });

    it('should use fallback method when clipboard API unavailable', async () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        configurable: true,
        value: undefined,
      });

      // Mock createElement and body methods
      const mockTextArea = {
        value: '',
        style: {},
        focus: vi.fn(),
        select: vi.fn(),
      };

      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === 'textarea') {
          return mockTextArea;
        }
        return originalCreateElement.call(document, tagName);
      });

      const originalAppendChild = document.body.appendChild;
      const originalRemoveChild = document.body.removeChild;
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      const result = await copyModule.copyToClipboard('test code');

      expect(mockTextArea.value).toBe('test code');
      expect(mockTextArea.focus).toHaveBeenCalled();
      expect(mockTextArea.select).toHaveBeenCalled();
      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);

      // Restore
      document.createElement = originalCreateElement;
      document.body.appendChild = originalAppendChild;
      document.body.removeChild = originalRemoveChild;
    });

    it('should handle clipboard API errors', async () => {
      const copyModule = require('../../../src/ts/modules/copy-code');
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard denied'));

      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        configurable: true,
        value: {
          writeText: mockWriteText,
        },
      });

      // Mock fallback to also fail
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation(() => {
        throw new Error('DOM error');
      });

      const result = await copyModule.copyToClipboard('test code');

      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Failed to copy text:', expect.any(Error));

      // Restore
      document.createElement = originalCreateElement;
    });

    it('should handle non-secure context', async () => {
      Object.defineProperty(window, 'isSecureContext', {
        writable: true,
        configurable: true,
        value: false,
      });

      const copyModule = require('../../../src/ts/modules/copy-code');

      const mockTextArea = {
        value: '',
        style: {},
        focus: vi.fn(),
        select: vi.fn(),
      };

      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation((tagName) => {
        if (tagName === 'textarea') {
          return mockTextArea;
        }
        return originalCreateElement.call(document, tagName);
      });

      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      const result = await copyModule.copyToClipboard('test code');

      expect(mockTextArea.focus).toHaveBeenCalled();
      expect(result).toBe(true);

      document.createElement = originalCreateElement;
    });
  });

  describe('showCopySuccess', () => {
    it('should show success feedback and revert after timeout', () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      const mockButton = {
        textContent: 'Copy',
        className: 'copy-button',
        classList: {
          add: vi.fn(),
        },
      };

      copyModule.showCopySuccess(mockButton);

      expect(mockButton.textContent).toBe('Copied!');
      expect(mockButton.classList.add).toHaveBeenCalledWith('copied');

      // Fast forward timeout
      vi.advanceTimersByTime(2000);

      expect(mockButton.textContent).toBe('Copy');
      expect(mockButton.className).toBe('copy-button');
    });

    it('should handle button with no text content', () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      const mockButton = {
        textContent: null,
        className: '',
        classList: {
          add: vi.fn(),
        },
      };

      copyModule.showCopySuccess(mockButton);

      expect(mockButton.textContent).toBe('Copied!');
    });
  });

  describe('showCopyError', () => {
    it('should show error feedback and revert after timeout', () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      const mockButton = {
        textContent: 'Copy',
        className: 'copy-button',
        classList: {
          add: vi.fn(),
        },
      };

      copyModule.showCopyError(mockButton);

      expect(mockButton.textContent).toBe('Failed!');
      expect(mockButton.classList.add).toHaveBeenCalledWith('copy-error');

      // Fast forward timeout
      vi.advanceTimersByTime(2000);

      expect(mockButton.textContent).toBe('Copy');
      expect(mockButton.className).toBe('copy-button');
    });
  });

  describe('handleCopyClick', () => {
    it('should successfully copy code and show success feedback', async () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      const mockCodeBlock = {
        textContent: 'const x = 1;',
      };

      const mockButton = {
        disabled: false,
        style: {},
        textContent: 'Copy',
        className: 'copy-button',
      };

      // Mock successful copy
      vi.spyOn(copyModule, 'copyToClipboard').mockResolvedValue(true);
      vi.spyOn(copyModule, 'showCopySuccess').mockImplementation(() => {});

      await copyModule.handleCopyClick(mockButton as any, mockCodeBlock as any);

      expect(mockButton.disabled).toBe(true);
      expect(mockButton.style.opacity).toBe('0.6');
      expect(mockButton.style.cursor).toBe('wait');
      expect(copyModule.copyToClipboard).toHaveBeenCalledWith('const x = 1;');
      expect(copyModule.showCopySuccess).toHaveBeenCalledWith(mockButton);

      // Button should be re-enabled
      expect(mockButton.disabled).toBe(false);
      expect(mockButton.style.opacity).toBe('');
      expect(mockButton.style.cursor).toBe('');
    });

    it('should show error feedback when copy fails', async () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      const mockCodeBlock = {
        textContent: 'const x = 1;',
      };

      const mockButton = {
        disabled: false,
        style: {},
      };

      // Mock failed copy
      vi.spyOn(copyModule, 'copyToClipboard').mockResolvedValue(false);
      vi.spyOn(copyModule, 'showCopyError').mockImplementation(() => {});

      await copyModule.handleCopyClick(mockButton as any, mockCodeBlock as any);

      expect(copyModule.showCopyError).toHaveBeenCalledWith(mockButton);
    });

    it('should handle copy exceptions', async () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      const mockCodeBlock = {
        textContent: 'const x = 1;',
      };

      const mockButton = {
        disabled: false,
        style: {},
      };

      // Mock copy throwing error
      vi.spyOn(copyModule, 'copyToClipboard').mockRejectedValue(new Error('Copy failed'));
      vi.spyOn(copyModule, 'showCopyError').mockImplementation(() => {});

      await copyModule.handleCopyClick(mockButton as any, mockCodeBlock as any);

      expect(copyModule.showCopyError).toHaveBeenCalledWith(mockButton);
      expect(console.error).toHaveBeenCalledWith('Copy failed:', expect.any(Error));
    });

    it('should handle empty code blocks', async () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      const mockCodeBlock = {
        textContent: '   ', // Only whitespace
      };

      const mockButton = {
        disabled: false,
        style: {},
      };

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await copyModule.handleCopyClick(mockButton as any, mockCodeBlock as any);

      expect(consoleSpy).toHaveBeenCalledWith('No code to copy');
      expect(mockButton.disabled).toBe(false); // Should not be disabled

      consoleSpy.mockRestore();
    });
  });

  describe('createCopyButton', () => {
    it('should create copy button with correct attributes', () => {
      const copyModule = require('../../../src/ts/modules/copy-code');
      const { create } = require('../../../src/ts/modules/utils/dom');

      const mockButton = {
        classList: { add: vi.fn() },
        setAttribute: vi.fn(),
      };

      create.mockReturnValue(mockButton);

      const button = copyModule.createCopyButton();

      expect(create).toHaveBeenCalledWith('button', {
        class: 'copy-button',
        type: 'button',
        'aria-label': 'Copy code to clipboard',
        title: 'Copy code',
        'data-clipboard-text': ''
      }, 'Copy');
    });
  });

  describe('setupCopyButton', () => {
    it('should setup copy button for code block', () => {
      const copyModule = require('../../../src/ts/modules/copy-code');
      const { qsa, create, addEventListener } = require('../../../src/ts/modules/utils/dom');

      const mockCodeBlock = {
        parentElement: {
          tagName: 'PRE',
          classList: { add: vi.fn() },
          appendChild: vi.fn(),
          style: {},
        },
      };

      const mockButton = {
        _cleanup: vi.fn(),
      };

      create.mockReturnValue(mockButton);
      addEventListener.mockReturnValue(vi.fn());

      copyModule.setupCopyButton(mockCodeBlock as any);

      expect(mockCodeBlock.parentElement.classList.add).toHaveBeenCalledWith('has-copy-button');
      expect(mockCodeBlock.parentElement.appendChild).toHaveBeenCalledWith(mockButton);
      expect(addEventListener).toHaveBeenCalled();
    });

    it('should skip if parent already has copy button', () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      const mockCodeBlock = {
        parentElement: {
          classList: { contains: vi.fn().mockReturnValue(true) },
        },
      };

      copyModule.setupCopyButton(mockCodeBlock as any);

      expect(mockCodeBlock.parentElement.classList.contains).toHaveBeenCalledWith('has-copy-button');
    });

    it('should find pre element if parent is not pre', () => {
      const copyModule = require('../../../src/ts/modules/copy-code');
      const { create, addEventListener } = require('../../../src/ts/modules/utils/dom');

      const mockPreElement = {
        classList: { add: vi.fn() },
        appendChild: vi.fn(),
        style: {},
      };

      const mockCodeBlock = {
        parentElement: {
          tagName: 'DIV',
          closest: vi.fn().mockReturnValue(mockPreElement),
        },
      };

      const mockButton = {
        _cleanup: vi.fn(),
      };

      create.mockReturnValue(mockButton);
      addEventListener.mockReturnValue(vi.fn());

      copyModule.setupCopyButton(mockCodeBlock as any);

      expect(mockCodeBlock.parentElement.closest).toHaveBeenCalledWith('pre');
      expect(mockPreElement.classList.add).toHaveBeenCalledWith('has-copy-button');
    });

    it('should setup keyboard support', () => {
      const copyModule = require('../../../src/ts/modules/copy-code');
      const { create, addEventListener } = require('../../../src/ts/modules/utils/dom');

      const mockCodeBlock = {
        parentElement: {
          tagName: 'PRE',
          classList: { add: vi.fn() },
          appendChild: vi.fn(),
          style: {},
        },
        _keycleanup: vi.fn(),
      };

      const mockButton = {
        _cleanup: vi.fn(),
      };

      create.mockReturnValue(mockButton);
      addEventListener.mockReturnValue(vi.fn());

      copyModule.setupCopyButton(mockCodeBlock as any);

      // Should have 2 event listeners: one for click, one for keydown
      expect(addEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('initCopyCode', () => {
    it('should initialize copy functionality for found code blocks', () => {
      const { qsa } = require('../../../src/ts/modules/utils/dom');
      const mockCodeBlocks = [
        { textContent: 'code 1' },
        { textContent: 'code 2' },
      ];

      qsa.mockReturnValue(mockCodeBlocks);

      // Mock setupCopyButton
      const copyModule = require('../../../src/ts/modules/copy-code');
      vi.spyOn(copyModule, 'setupCopyButton').mockImplementation(() => {});

      initCopyCode();

      expect(qsa).toHaveBeenCalledWith('pre code, highlight > code, .highlight > pre > code');
      expect(copyModule.setupCopyButton).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledWith('📋 Copy buttons initialized for 2 code blocks');
    });

    it('should handle when no code blocks are found', () => {
      const { qsa } = require('../../../src/ts/modules/utils/dom');
      qsa.mockReturnValue([]);

      initCopyCode();

      expect(console.log).toHaveBeenCalledWith('📝 No code blocks found for copy functionality');
    });
  });

  describe('cleanupCopyCode', () => {
    it('should cleanup all copy functionality', () => {
      const { qsa } = require('../../../src/ts/modules/utils/dom');

      const mockButton = {
        _cleanup: vi.fn(),
        remove: vi.fn(),
      };

      const mockCodeBlock = {
        _keycleanup: vi.fn(),
      };

      const mockPre = {
        classList: { remove: vi.fn() },
      };

      qsa.mockImplementation((selector) => {
        if (selector === '.copy-button') return [mockButton];
        if (selector.includes('code')) return [mockCodeBlock];
        if (selector === '.has-copy-button') return [mockPre];
        return [];
      });

      cleanupCopyCode();

      expect(mockButton._cleanup).toHaveBeenCalled();
      expect(mockButton.remove).toHaveBeenCalled();
      expect(mockCodeBlock._keycleanup).toHaveBeenCalled();
      expect(mockPre.classList.remove).toHaveBeenCalledWith('has-copy-button');
      expect(console.log).toHaveBeenCalledWith('🧹 Copy code functionality cleaned up');
    });

    it('should handle cleanup when no elements exist', () => {
      const { qsa } = require('../../../src/ts/modules/utils/dom');
      qsa.mockReturnValue([]);

      expect(() => cleanupCopyCode()).not.toThrow();
    });

    it('should handle elements without cleanup functions', () => {
      const { qsa } = require('../../../src/ts/modules/utils/dom');

      const mockButton = {
        remove: vi.fn(),
        // No _cleanup function
      };

      const mockCodeBlock = {
        // No _keycleanup function
      };

      qsa.mockImplementation((selector) => {
        if (selector === '.copy-button') return [mockButton];
        if (selector.includes('code')) return [mockCodeBlock];
        return [];
      });

      expect(() => cleanupCopyCode()).not.toThrow();
      expect(mockButton.remove).toHaveBeenCalled();
    });
  });

  describe('addCopyButtonStyles', () => {
    it('should add copy button styles to document', () => {
      addCopyButtonStyles();

      const styleElement = document.getElementById('copy-button-styles');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.tagName).toBe('STYLE');
    });

    it('should not add styles if they already exist', () => {
      // Add existing styles
      const existingStyle = document.createElement('style');
      existingStyle.id = 'copy-button-styles';
      existingStyle.textContent = '/* existing styles */';
      document.head.appendChild(existingStyle);

      const originalContent = existingStyle.textContent;

      addCopyButtonStyles();

      // Should not have added another style element
      const styles = document.querySelectorAll('#copy-button-styles');
      expect(styles).toHaveLength(1);
      expect(existingStyle.textContent).toBe(originalContent);
    });

    it('should include responsive breakpoints', () => {
      addCopyButtonStyles();

      const styleElement = document.getElementById('copy-button-styles') as HTMLStyleElement;
      const content = styleElement.textContent || '';

      expect(content).toContain('@media (max-width: 768px)');
      expect(content).toContain('.copy-button');
    });

    it('should include dark mode support', () => {
      addCopyButtonStyles();

      const styleElement = document.getElementById('copy-button-styles') as HTMLStyleElement;
      const content = styleElement.textContent || '';

      expect(content).toContain('@media (prefers-color-scheme: dark)');
      expect(content).toContain('.copy-button');
    });

    it('should include hover and focus states', () => {
      addCopyButtonStyles();

      const styleElement = document.getElementById('copy-button-styles') as HTMLStyleElement;
      const content = styleElement.textContent || '';

      expect(content).toContain('.copy-button:hover');
      expect(content).toContain('.copy-button:focus');
      expect(content).toContain('.copy-button:disabled');
    });

    it('should include success and error states', () => {
      addCopyButtonStyles();

      const styleElement = document.getElementById('copy-button-styles') as HTMLStyleElement;
      const content = styleElement.textContent || '';

      expect(content).toContain('.copy-button.copied');
      expect(content).toContain('.copy-button.copy-error');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete copy workflow', () => {
      const { qsa, create, addEventListener } = require('../../../src/ts/modules/utils/dom');

      const mockCodeBlock = {
        textContent: 'const x = 42;',
        parentElement: {
          tagName: 'PRE',
          classList: { add: vi.fn() },
          appendChild: vi.fn(),
          style: {},
        },
      };

      const mockButton = {
        _cleanup: vi.fn(),
        disabled: false,
        style: {},
        textContent: 'Copy',
        className: 'copy-button',
      };

      qsa.mockReturnValue([mockCodeBlock]);
      create.mockReturnValue(mockButton);
      addEventListener.mockReturnValue(vi.fn());

      // Mock clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        configurable: true,
        value: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      // Initialize
      initCopyCode();

      // Should setup copy button
      expect(mockCodeBlock.parentElement.classList.add).toHaveBeenCalledWith('has-copy-button');

      // Cleanup
      cleanupCopyCode();

      // Add styles to document
      addCopyButtonStyles();

      expect(document.getElementById('copy-button-styles')).toBeTruthy();
    });

    it('should handle mixed code block structures', () => {
      const { qsa, create, addEventListener } = require('../../../src/ts/modules/utils/dom');

      const mockCodeBlocks = [
        {
          textContent: 'code 1',
          parentElement: { tagName: 'PRE', classList: { add: vi.fn() }, appendChild: vi.fn(), style: {} },
        },
        {
          textContent: 'code 2',
          parentElement: {
            tagName: 'DIV',
            closest: vi.fn().mockReturnValue({
              classList: { add: vi.fn() },
              appendChild: vi.fn(),
              style: {}
            })
          },
        },
        {
          textContent: 'code 3',
          parentElement: { tagName: 'PRE', classList: { contains: vi.fn().mockReturnValue(true) } },
        },
      ];

      const mockButton = { _cleanup: vi.fn() };
      create.mockReturnValue(mockButton);
      addEventListener.mockReturnValue(vi.fn());
      qsa.mockReturnValue(mockCodeBlocks);

      initCopyCode();

      // Should process code blocks 1 and 2, skip 3 (already has copy button)
      expect(create).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle DOM errors gracefully', () => {
      const { qsa } = require('../../../src/ts/modules/utils/dom');

      // Mock qsa to throw error
      qsa.mockImplementation(() => {
        throw new Error('DOM error');
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      expect(() => initCopyCode()).toThrow('DOM error');

      consoleSpy.mockRestore();
    });

    it('should handle clipboard permission denial', async () => {
      const copyModule = require('../../../src/ts/modules/copy-code');

      // Mock clipboard API throwing permission error
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        configurable: true,
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
        },
      });

      // Mock fallback to also fail
      Object.defineProperty(document, 'execCommand', {
        writable: true,
        configurable: true,
        value: vi.fn().mockReturnValue(false),
      });

      const mockTextArea = {
        value: '',
        style: {},
        focus: vi.fn(),
        select: vi.fn(),
      };

      document.createElement = vi.fn().mockReturnValue(mockTextArea);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      const result = await copyModule.copyToClipboard('test code');

      expect(result).toBe(false);
    });
  });
});