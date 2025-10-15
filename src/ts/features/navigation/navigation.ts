/**
 * Simple Mobile Navigation for Personal Blog
 * 
 * Self-contained mobile menu with hamburger toggle.
 * No external dependencies.
 */

class MobileNavigation {
  private isOpen = false;
  private toggle: HTMLElement | null = null;
  private menu: HTMLElement | null = null;
  private cleanupFns: (() => void)[] = [];
  private scrollY = 0;

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
    // Find toggle button and menu
    this.toggle = document.querySelector('.nav-toggle, [data-nav-toggle]');
    this.menu = document.querySelector('.nav-mobile, [data-nav-menu]');

    if (!this.toggle || !this.menu) {
      console.log('📱 Navigation elements not found - skipping mobile nav');
      return;
    }

    // Setup toggle button
    this.setupToggle();

    // Setup click outside to close
    this.setupClickOutside();

    // Setup escape key
    this.setupEscapeKey();

    // Setup responsive behavior
    this.setupResponsive();

    console.log('📱 Mobile navigation initialized');
  }

  private setupToggle(): void {
    if (!this.toggle) return;

    // Set initial ARIA attributes
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.setAttribute('aria-label', 'Toggle navigation menu');

    // Click handler
    const handler = (e: Event) => {
      e.preventDefault();
      this.toggleMenu();
    };

    this.toggle.addEventListener('click', handler);
    this.cleanupFns.push(() => this.toggle?.removeEventListener('click', handler));
  }

  private setupClickOutside(): void {
    const handler = (e: Event) => {
      if (!this.isOpen) return;

      const target = e.target as Node;
      const isInMenu = this.menu?.contains(target);
      const isInToggle = this.toggle?.contains(target);

      if (!isInMenu && !isInToggle) {
        this.close();
      }
    };

    document.addEventListener('click', handler);
    this.cleanupFns.push(() => document.removeEventListener('click', handler));
  }

  private setupEscapeKey(): void {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };

    document.addEventListener('keydown', handler);
    this.cleanupFns.push(() => document.removeEventListener('keydown', handler));
  }

  private setupResponsive(): void {
    let timeoutId: number;
    
    const handler = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        // Close menu on desktop
        if (window.innerWidth > 768 && this.isOpen) {
          this.close();
        }
      }, 150);
    };

    window.addEventListener('resize', handler);
    this.cleanupFns.push(() => {
      window.removeEventListener('resize', handler);
      clearTimeout(timeoutId);
    });
  }

  private toggleMenu(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  private open(): void {
    if (!this.toggle || !this.menu) return;

    this.isOpen = true;

    // Update toggle button
    this.toggle.classList.add('active');
    this.toggle.setAttribute('aria-expanded', 'true');

    // Show menu
    this.menu.classList.add('active', 'is-open');

    // Lock body scroll
    this.scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.width = '100%';
    document.body.classList.add('nav-open');

    console.log('📱 Menu opened');
  }

  private close(): void {
    if (!this.toggle || !this.menu) return;

    this.isOpen = false;

    // Update toggle button
    this.toggle.classList.remove('active');
    this.toggle.setAttribute('aria-expanded', 'false');

    // Hide menu
    this.menu.classList.remove('active', 'is-open');

    // Restore body scroll
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('nav-open');
    window.scrollTo(0, this.scrollY);

    console.log('📱 Menu closed');
  }

  /**
   * Cleanup (for testing)
   */
  public destroy(): void {
    this.close();
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}

// Export singleton instance
export const mobileNav = new MobileNavigation();

// Export public API
export const closeMobileMenu = () => {
  if (mobileNav) {
    (mobileNav as any).close?.();
  }
};
