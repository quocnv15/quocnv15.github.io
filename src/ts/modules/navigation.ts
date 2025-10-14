/**
 * Mobile navigation functionality
 *
 * Features:
 * - Hamburger menu for mobile devices
 * - Smooth slide-in/out animations
 * - Click-outside-to-close functionality
 * - Keyboard navigation support
 * - Touch-friendly interactions
 * - Accessibility compliant
 * - Body scroll lock when menu is open
 */

import { qsSafe, addEventListener } from './utils/dom';
import { navigationStateIntegration } from '../core/app-state';

const MOBILE_BREAKPOINT = 768; // px
const ANIMATION_DURATION = 300; // ms
const FOCUSABLE_ELEMENTS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Check if device is mobile
 */
const isMobile = (): boolean => {
  return window.innerWidth <= MOBILE_BREAKPOINT ||
       ('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0);
};

/**
 * Toggle body scroll lock
 */
const toggleBodyScrollLock = (lock: boolean): void => {
  const body = document.body;

  if (lock) {
    body.classList.add('nav-open');
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.top = `-${window.scrollY}px`;
  } else {
    const scrollY = Math.abs(parseInt(body.style.top || '0', 10));
    body.classList.remove('nav-open');
    body.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
    body.style.top = '';
    window.scrollTo(0, scrollY);
  }
};

/**
 * Close mobile menu
 */
const closeMobileMenu = (): void => {
  const toggle = qsSafe('.nav-toggle') as HTMLElement;
  const menu = qsSafe('.nav-mobile') as HTMLElement;

  if (!toggle || !menu) return;

  // Update toggle state
  toggle.classList.remove('active');
  toggle.setAttribute('aria-expanded', 'false');

  // Close menu
  menu.classList.remove('active');

  // Restore body scroll
  toggleBodyScrollLock(false);

  // Update state manager
  if (typeof window !== 'undefined' && (window as any).__APP_STATE_MANAGER__) {
    (window as any).__APP_STATE_MANAGER__.setMobileMenuOpen(false);
  }

  // Focus back to toggle button
  setTimeout(() => {
    toggle.focus();
  }, ANIMATION_DURATION);

  console.log('📱 Mobile menu closed');
};

/**
 * Open mobile menu
 */
const openMobileMenu = (): void => {
  const toggle = qsSafe('.nav-toggle') as HTMLElement;
  const menu = qsSafe('.nav-mobile') as HTMLElement;

  if (!toggle || !menu) return;

  // Update toggle state
  toggle.classList.add('active');
  toggle.setAttribute('aria-expanded', 'true');

  // Open menu
  menu.classList.add('active');

  // Prevent body scroll
  toggleBodyScrollLock(true);

  // Update state manager
  if (typeof window !== 'undefined' && (window as any).__APP_STATE_MANAGER__) {
    (window as any).__APP_STATE_MANAGER__.setMobileMenuOpen(true);
  }

  // Focus first menu item
  setTimeout(() => {
    const firstMenuItem = menu.querySelector(FOCUSABLE_ELEMENTS) as HTMLElement;
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }, 100);

  console.log('📱 Mobile menu opened');
};

/**
 * Toggle mobile menu
 */
const toggleMobileMenu = (): void => {
  // Use state manager if available
  if (typeof window !== 'undefined' && (window as any).__APP_STATE_MANAGER__) {
    (window as any).__APP_STATE_MANAGER__.toggleMobileMenu();
  } else {
    // Fallback to DOM-based toggle
    const toggle = qsSafe('.nav-toggle') as HTMLElement;
    if (!toggle) return;

    const isOpen = toggle.classList.contains('active');

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
};

/**
 * Handle click outside menu
 */
const handleOutsideClick = (event: MouseEvent): void => {
  const menu = qsSafe('.nav-mobile');
  const toggle = qsSafe('.nav-toggle');

  if (!menu || !toggle) return;

  const target = event.target as Node;
  const isClickInsideMenu = menu.contains(target);
  const isClickOnToggle = toggle.contains(target);

  if (!isClickInsideMenu && !isClickOnToggle) {
    closeMobileMenu();
  }
};

/**
 * Handle escape key
 */
const handleEscapeKey = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeMobileMenu();
  }
};

/**
 * Setup mobile navigation toggle
 */
const setupMobileToggle = (): void => {
  const toggle = qsSafe('.nav-toggle') as HTMLElement;
  if (!toggle) {
    console.warn('⚠️ Mobile navigation toggle button not found');
    return;
  }

  // Set initial state
  toggle.classList.remove('active');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'mobile-menu');
  toggle.setAttribute('aria-label', 'Toggle navigation menu');

  // Add click handler
  const cleanup = addEventListener(toggle, 'click', (e) => {
    e.preventDefault();
    toggleMobileMenu();
  });

  // Store cleanup function
  (toggle as any)._cleanup = cleanup;

  console.log('📱 Mobile navigation toggle setup complete');
};

/**
 * Setup click outside to close
 */
const setupClickOutsideToClose = (): void => {
  const cleanup = addEventListener(document as any, 'click', handleOutsideClick);
  (document as any)._clickOutsideCleanup = cleanup;
  console.log('📱 Click outside to close functionality setup');
};

/**
 * Setup keyboard navigation
 */
const setupKeyboardNavigation = (): void => {
  const menu = qsSafe('.nav-mobile') as HTMLElement;
  if (!menu) return;

  // Add keydown handler for trap focus
  const keydownHandler = (e: KeyboardEvent): void => {
    if (e.key === 'Tab') {
      const focusableElements = Array.from(menu.querySelectorAll(FOCUSABLE_ELEMENTS)) as HTMLElement[];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement && firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement && lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  const cleanup = addEventListener(menu, 'keydown', keydownHandler);
  (menu as any)._keyboardCleanup = cleanup;

  console.log('📱 Keyboard navigation setup complete');
};

/**
 * Setup escape key handler
 */
const setupEscapeKeyHandler = (): void => {
  const cleanup = addEventListener(document as any, 'keydown', handleEscapeKey);
  (document as any)._escapeCleanup = cleanup;
  console.log('📱 Escape key handler setup complete');
};

/**
 * Setup responsive behavior
 */
const setupResponsiveBehavior = (): void => {
  let isCurrentlyMobile = isMobile();

  const handleResize = (): void => {
    const isNowMobile = isMobile();

    // If switching from desktop to mobile and menu is open, close it
    if (!isCurrentlyMobile && isNowMobile) {
      const menu = qsSafe('.nav-mobile') as HTMLElement;
      if (menu && menu.classList.contains('active')) {
        closeMobileMenu();
      }
    }

    // If switching from mobile to desktop, ensure menu is closed
    if (isCurrentlyMobile && !isNowMobile) {
      closeMobileMenu();
    }

    isCurrentlyMobile = isNowMobile;
  };

  // Debounce resize handler
  let resizeTimeout: NodeJS.Timeout;
  const debouncedResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 150);
  };

  const cleanup = addEventListener(window as any, 'resize', debouncedResize);
  (window as any)._resizeCleanup = cleanup;

  console.log('📱 Responsive behavior setup complete');
};

/**
 * Create mobile navigation toggle button
 */
const createMobileToggle = (): HTMLElement => {
  const button = document.createElement('button');
  button.className = 'nav-toggle';
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Toggle navigation menu');
  button.setAttribute('aria-controls', 'mobile-menu');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = `
    <span class="hamburger">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </span>
  `;
  return button;
};

/**
 * Setup mobile navigation menu
 */
const setupMobileMenu = (): void => {
  // Check if mobile menu already exists
  const existingMenu = qsSafe('.nav-mobile');
  if (existingMenu) {
    console.log('📱 Mobile menu already exists');
    return;
  }

  // Create mobile menu if it doesn't exist
  const menu = document.createElement('nav');
  menu.className = 'nav-mobile';
  menu.setAttribute('id', 'mobile-menu');
  menu.setAttribute('role', 'navigation');
  menu.setAttribute('aria-label', 'Mobile navigation');

  // Copy navigation items from desktop menu
  const desktopNav = qsSafe('.site-nav, .nav-links');
  if (desktopNav) {
    const navLinks = desktopNav.cloneNode(true);
    menu.appendChild(navLinks);
  }

  // Add menu to page
  const header = qsSafe('.site-header, header');
  if (header) {
    header.appendChild(menu);
  }

  console.log('📱 Mobile navigation menu created');
};

/**
 * Initialize mobile navigation
 */
export const initNavigation = (): void => {
  // Only initialize on mobile devices
  if (!isMobile()) {
    console.log('📱 Desktop device detected - mobile navigation not initialized');
    return;
  }

  // Setup mobile menu
  setupMobileMenu();

  // Setup toggle button (check if exists or create)
  let toggle = qsSafe('.nav-toggle') as HTMLElement;
  if (!toggle) {
    toggle = createMobileToggle();
    const header = qsSafe('.site-header, header');
    if (header) {
      header.appendChild(toggle);
    }
  }

  // Setup all functionality
  setupMobileToggle();
  setupClickOutsideToClose();
  setupKeyboardNavigation();
  setupEscapeKeyHandler();
  setupResponsiveBehavior();

  // Make mobile menu visible
  const menu = qsSafe('.nav-mobile') as HTMLElement;
  if (menu) {
    menu.style.display = 'block';
  }

  console.log('📱 Mobile navigation initialized successfully');
};

/**
 * Cleanup mobile navigation
 */
export const cleanupMobileNav = (): void => {
  // Remove event listeners
  const cleanupFunctions = [
    (document as any)._clickOutsideCleanup,
    (document as any)._escapeCleanup,
    (window as any)._resizeCleanup
  ];

  cleanupFunctions.forEach(cleanup => {
    if (typeof cleanup === 'function') {
      cleanup();
    }
  });

  // Remove toggle button cleanup
  const toggle = qsSafe('.nav-toggle') as HTMLElement;
  if (toggle && (toggle as any)._cleanup) {
    (toggle as any)._cleanup();
  }

  // Remove menu cleanup
  const menu = qsSafe('.nav-mobile') as HTMLElement;
  if (menu && (menu as any)._keyboardCleanup) {
    (menu as any)._keyboardCleanup();
  }

  console.log('📱 Mobile navigation cleaned up');
};

/**
 * Alias for backward compatibility
 */
export { initNavigation as initMobileNav };

/**
 * Mobile navigation styles are now loaded from external CSS files
 * This function is kept for backward compatibility but no longer does anything
 */
export const addMobileNavStyles = (): void => {
  // Styles are now in src/css/components.css and loaded via the build system
  console.log('📱 Mobile navigation styles loaded from external CSS file');
};