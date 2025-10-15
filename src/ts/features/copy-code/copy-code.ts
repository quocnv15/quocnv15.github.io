/**
 * Simple Copy Code Feature for Personal Blog
 * 
 * Adds copy buttons to code blocks with visual feedback.
 * No external dependencies.
 */

class CopyCode {
  private cleanupFns: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    // Setup when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    // Find all code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    
    if (codeBlocks.length === 0) {
      console.log('📋 No code blocks found');
      return;
    }

    codeBlocks.forEach(code => {
      const pre = code.parentElement;
      if (!pre || pre.classList.contains('has-copy-button')) return;

      // Mark as processed
      pre.classList.add('has-copy-button');
      pre.style.position = 'relative';

      // Create copy button
      const button = this.createButton();
      pre.appendChild(button);

      // Add click handler
      const handler = () => this.copy(code.textContent || '', button);
      button.addEventListener('click', handler);
      this.cleanupFns.push(() => button.removeEventListener('click', handler));
    });

    console.log(`📋 Copy buttons added to ${codeBlocks.length} code blocks`);
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.textContent = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    return button;
  }

  private async copy(text: string, button: HTMLButtonElement): Promise<void> {
    if (!text.trim()) return;

    try {
      // Try modern clipboard API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Show success feedback
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('copied');

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);

    } catch (err) {
      console.error('Copy failed:', err);
      button.textContent = 'Failed';
      button.classList.add('error');

      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('error');
      }, 2000);
    }
  }

  /**
   * Cleanup (for testing)
   */
  public destroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
    
    // Remove buttons
    document.querySelectorAll('.copy-button').forEach(btn => btn.remove());
    document.querySelectorAll('.has-copy-button').forEach(pre => {
      pre.classList.remove('has-copy-button');
    });
  }
}

// Export singleton instance
export const copyCode = new CopyCode();
