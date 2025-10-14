/**
 * Copy code to clipboard functionality
 *
 * Features:
 * - Copy code blocks with clipboard API
 * - Visual feedback for success/error states
 * - Fallback method for older browsers
 * - Touch-friendly interactions
 * - Accessibility support
 */

import { qsa, create, addEventListener } from './utils/dom';

const COPY_BUTTON_CLASS = 'copy-button';
const COPY_SUCCESS_CLASS = 'copied';
const COPY_ERROR_CLASS = 'copy-error';
const COPY_TIMEOUT = 2000;

/**
 * Copy text to clipboard with fallback
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback method for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

/**
 * Show copy success feedback
 */
const showCopySuccess = (button: HTMLElement): void => {
  const originalText = button.textContent || 'Copy';
  const originalClasses = button.className;

  button.textContent = 'Copied!';
  button.classList.add(COPY_SUCCESS_CLASS);

  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClasses;
  }, COPY_TIMEOUT);
};

/**
 * Show copy error feedback
 */
const showCopyError = (button: HTMLElement): void => {
  const originalText = button.textContent || 'Copy';
  const originalClasses = button.className;

  button.textContent = 'Failed!';
  button.classList.add(COPY_ERROR_CLASS);

  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClasses;
  }, COPY_TIMEOUT);
};

/**
 * Handle copy button click
 */
const handleCopyClick = async (button: HTMLElement, codeBlock: HTMLElement): Promise<void> => {
  const code = codeBlock.textContent || '';

  if (!code.trim()) {
    console.warn('No code to copy');
    return;
  }

  // Disable button temporarily to prevent multiple clicks
  (button as HTMLButtonElement).disabled = true;
  button.style.opacity = '0.6';
  button.style.cursor = 'wait';

  try {
    const success = await copyToClipboard(code);

    if (success) {
      showCopySuccess(button);
    } else {
      showCopyError(button);
    }
  } catch (error) {
    console.error('Copy failed:', error);
    showCopyError(button);
  } finally {
    // Re-enable button
    (button as HTMLButtonElement).disabled = false;
    button.style.opacity = '';
    button.style.cursor = '';
  }
};

/**
 * Create copy button for code block
 */
const createCopyButton = (): HTMLElement => {
  const button = create('button', {
    class: COPY_BUTTON_CLASS,
    type: 'button',
    'aria-label': 'Copy code to clipboard',
    title: 'Copy code',
    'data-clipboard-text': ''
  }, 'Copy');

  return button;
};

/**
 * Setup copy button for a code block
 */
const setupCopyButton = (codeBlock: HTMLElement): void => {
  // Skip if already has copy button
  const parent = codeBlock.parentElement;
  if (!parent || parent.classList.contains('has-copy-button')) {
    return;
  }

  // Check if it's a code block inside pre
  const preElement = parent.tagName === 'PRE' ? parent : codeBlock.closest('pre');
  if (!preElement) {
    return;
  }

  // Mark as processed
  preElement.classList.add('has-copy-button');

  // Create and append button
  const button = createCopyButton();
  preElement.style.position = 'relative';
  preElement.appendChild(button);

  // Add click handler
  const cleanup = addEventListener(button, 'click', async (e) => {
    e.preventDefault();
    await handleCopyClick(button, codeBlock);
  });

  // Store cleanup function for potential removal later
  (button as any)._cleanup = cleanup;

  // Add keyboard support (Ctrl+C / Cmd+C when code block is focused)
  const keyboardHandler = (e: KeyboardEvent): void => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      // Only handle if code block or its children are focused
      const activeElement = document.activeElement;
      if (activeElement === codeBlock || codeBlock.contains(activeElement)) {
        e.preventDefault();
        handleCopyClick(button, codeBlock);
      }
    }
  };

  const keydownCleanup = addEventListener(codeBlock, 'keydown', keyboardHandler);
  (codeBlock as any)._keycleanup = keydownCleanup;
};

/**
 * Initialize copy functionality for all code blocks
 */
export const initCopyCode = (): void => {
  // Find all code blocks (including those from highlight.js)
  const codeBlocks = Array.from(qsa('pre code, highlight > code, .highlight > pre > code')) as HTMLElement[];

  if (codeBlocks.length === 0) {
    console.log('📝 No code blocks found for copy functionality');
    return;
  }

  codeBlocks.forEach((codeBlock) => {
    setupCopyButton(codeBlock);
  });

  console.log(`📋 Copy buttons initialized for ${codeBlocks.length} code blocks`);
};

/**
 * Cleanup copy functionality (for testing or dynamic content)
 */
export const cleanupCopyCode = (): void => {
  const buttons = qsa(`.${COPY_BUTTON_CLASS}`);
  buttons.forEach(button => {
    const cleanup = (button as any)._cleanup;
    if (typeof cleanup === 'function') {
      cleanup();
    }
    button.remove();
  });

  const codeBlocks = Array.from(qsa('pre code, highlight > code, .highlight > pre > code')) as HTMLElement[];
  codeBlocks.forEach(codeBlock => {
    const keycleanup = (codeBlock as any)._keycleanup;
    if (typeof keycleanup === 'function') {
      keycleanup();
    }
  });

  const preElements = qsa('.has-copy-button');
  preElements.forEach(pre => {
    pre.classList.remove('has-copy-button');
  });

  console.log('🧹 Copy code functionality cleaned up');
};

/**
 * Copy button styles are now loaded from external CSS files
 * This function is kept for backward compatibility but no longer does anything
 */
export const addCopyButtonStyles = (): void => {
  // Styles are now in src/css/components.css and loaded via the build system
  console.log('📋 Copy button styles loaded from external CSS file');
};