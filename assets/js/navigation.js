/**
 * Navigation Module
 * Handles mobile navigation menu and nav interactions
 * @module navigation
 */

/**
 * Trap focus within the mobile menu when open
 */
let focusableElements = [];
let firstFocusableElement;
let lastFocusableElement;

function updateFocusableElements(navMobile) {
  focusableElements = Array.from(
    navMobile.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
  firstFocusableElement = focusableElements[0];
  lastFocusableElement = focusableElements[focusableElements.length - 1];
}

/**
 * Trap focus within the modal
 */
function trapFocus(e) {
  if (e.key !== 'Tab' && e.keyCode !== 9) return;

  if (e.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus();
      e.preventDefault();
    }
  } else {
    // Tab
    if (document.activeElement === lastFocusableElement) {
      firstFocusableElement.focus();
      e.preventDefault();
    }
  }
}

/**
 * Open mobile menu with focus management
 */
function openMobileMenu(navToggle, navMobile, body) {
  navMobile.classList.add('active');
  navToggle.classList.add('active');
  body.classList.add('nav-open');

  // Update ARIA attributes
  navToggle.setAttribute('aria-expanded', 'true');
  navMobile.setAttribute('aria-hidden', 'false');

  // Update focusable elements and trap focus
  updateFocusableElements(navMobile);

  // Focus first link
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }

  // Add focus trap listener
  navMobile.addEventListener('keydown', trapFocus);
}

/**
 * Close mobile menu with focus management
 */
function closeMobileMenu(navToggle, navMobile, body) {
  navMobile.classList.remove('active');
  navToggle.classList.remove('active');
  body.classList.remove('nav-open');

  // Update ARIA attributes
  navToggle.setAttribute('aria-expanded', 'false');
  navMobile.setAttribute('aria-hidden', 'true');

  // Return focus to toggle button
  navToggle.focus();

  // Remove focus trap listener
  navMobile.removeEventListener('keydown', trapFocus);
}

/**
 * Initialize mobile navigation on DOM content loaded
 */
function init() {
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const body = document.body;

  if (!navToggle || !navMobile) {
    console.warn('Navigation elements not found');
    return;
  }

  // Toggle mobile menu
  navToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = navMobile.classList.contains('active');

    if (isOpen) {
      closeMobileMenu(navToggle, navMobile, body);
    } else {
      openMobileMenu(navToggle, navMobile, body);
    }
  });

  // Close mobile menu when clicking on a link
  const mobileLinks = navMobile.querySelectorAll('.nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMobileMenu(navToggle, navMobile, body);
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navMobile.contains(e.target) && !navToggle.contains(e.target)) {
      if (navMobile.classList.contains('active')) {
        closeMobileMenu(navToggle, navMobile, body);
      }
    }
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMobile.classList.contains('active')) {
      closeMobileMenu(navToggle, navMobile, body);
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768 && navMobile.classList.contains('active')) {
        closeMobileMenu(navToggle, navMobile, body);
      }
    }, 250);
  });
}

/**
 * Initialize mobile menu
 * Exported for external use if needed
 */
export function initMobileMenu() {
  init();
}

/**
 * Handle navigation clicks
 * Exported for external use if needed
 */
export function handleNavClicks() {
  // Navigation clicks are handled in init()
  // This function is a placeholder for potential future customization
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);
