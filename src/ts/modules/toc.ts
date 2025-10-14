/**
 * Table of Contents functionality
 *
 * Features:
 * - Auto-generate from h2-h6 headings
 * - Hierarchical structure with indentation
 * - Smooth scroll navigation
 * - Active section highlighting
 * - Responsive design for mobile
 * - Accessibility support
 * - Dynamic updates
 */

import { qsa, create, scrollToElement, addEventListener, throttle } from './utils/dom';
import type { TocItem } from '../interfaces/types';

const TOC_CONTAINER_SELECTOR = '#toc-container';
const TOC_ID_PREFIX = 'toc-';
const ACTIVE_CLASS = 'toc-active';
const HEADING_SELECTORS = 'h2, h3, h4, h5, h6';
const SCROLL_OFFSET = 80; // pixels
const THROTTLE_DELAY = 100; // ms

/**
 * Generate hierarchical TOC structure
 */
const generateTOC = (headings: Element[]): TocItem[] => {
  const toc: TocItem[] = [];
  const stack: TocItem[] = [];

  headings.forEach((heading, index) => {
    const id = `${TOC_ID_PREFIX}${index}`;
    heading.id = id;

    const item: TocItem = {
      id,
      text: heading.textContent?.trim() || `Heading ${index + 1}`,
      level: parseInt(heading.tagName.charAt(1)),
      children: []
    };

    // Build hierarchy using stack
    while (stack.length > 0 && (stack[stack.length - 1]?.level ?? 0) >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(item);
    } else {
      stack[stack.length - 1]?.children.push(item);
    }

    stack.push(item);
  });

  return toc;
};

/**
 * Render TOC in container
 */
const renderTOC = (container: Element, toc: TocItem[]): void => {
  if (toc.length === 0) {
    container.innerHTML = '<p class="toc-empty">No headings found</p>';
    return;
  }

  const tocElement = create('nav', { class: 'toc' });
  const listElement = create('ol', { class: 'toc-list' });

  // Add TOC title
  const titleElement = create('h2', { class: 'toc-title' }, 'Table of Contents');
  tocElement.appendChild(titleElement);

  renderTOCItems(listElement, toc, 0);
  tocElement.appendChild(listElement);

  container.innerHTML = '';
  container.appendChild(tocElement);
};

/**
 * Render TOC items recursively
 */
const renderTOCItems = (parentElement: Element, items: TocItem[], depth: number): void => {
  items.forEach((item) => {
    const listItem = create('li', { class: 'toc-item' });

    // Create link
    const link = create('a', {
      href: `#${item.id}`,
      class: 'toc-link',
      'data-level': item.level.toString()
    }, item.text);

    // Add click handler for smooth scroll
    addEventListener(link, 'click', (e) => {
      e.preventDefault();
      const targetElement = document.getElementById(item.id);
      if (targetElement) {
        scrollToElement(targetElement, SCROLL_OFFSET);
        updateActiveTOC(item.id);
      }
    });

    listItem.appendChild(link);

    // Render children if any
    if (item.children.length > 0) {
      const childList = create('ol', { class: `toc-list toc-list-${depth + 1}` });
      renderTOCItems(childList, item.children, depth + 1);
      listItem.appendChild(childList);
    }

    parentElement.appendChild(listItem);
  });
};

/**
 * Update active TOC item
 */
const updateActiveTOC = (activeId: string): void => {
  // Remove active class from all items
  const activeElements = document.querySelectorAll(`.${ACTIVE_CLASS}`);
  activeElements.forEach(el => el.classList.remove(ACTIVE_CLASS));

  // Add active class to current item
  const activeLink = document.querySelector(`a[href="#${activeId}"]`);
  if (activeLink) {
    activeLink.classList.add(ACTIVE_CLASS);
  }

  // Update parent active states
  let currentLink: Element | null | undefined = activeLink;
  while (currentLink) {
    const parentItem = currentLink.closest('.toc-item') as Element;
    if (parentItem) {
      const parentLink = parentItem.querySelector('.toc-link');
      if (parentLink) {
        parentLink.classList.add(ACTIVE_CLASS);
      }
    }
    currentLink = parentItem?.parentElement?.closest('.toc-item');
  }
};

/**
 * Check if element is in viewport with offset
 */
const isElementInViewport = (element: Element, offset: number = 0): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  return (
    rect.top <= windowHeight &&
    rect.bottom >= 0 &&
    rect.left >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.top <= offset
  );
};

/**
 * Get the current active heading
 */
const getCurrentActiveHeading = (): string | null => {
  const headings = qsa(HEADING_SELECTORS);

  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i];
    if (heading && isElementInViewport(heading, SCROLL_OFFSET)) {
      return heading.id;
    }
  }

  return null;
};

/**
 * Setup scroll spy functionality
 */
const setupScrollSpy = (): void => {
  const scrollHandler = throttle(() => {
    const activeId = getCurrentActiveHeading();
    if (activeId) {
      updateActiveTOC(activeId);
    }
  }, THROTTLE_DELAY);

  const cleanup = addEventListener(window as any, 'scroll', scrollHandler);
  (window as any)._scrollSpyCleanup = cleanup;

  // Initial check
  setTimeout(() => {
    const activeId = getCurrentActiveHeading();
    if (activeId) {
      updateActiveTOC(activeId);
    }
  }, 100);

  console.log('📑 Scroll spy functionality setup');
};

/**
 * Observe content changes and update TOC
 */
const setupContentObserver = (): void => {
  const targetNode = document.querySelector('.post-content, .page-content');
  if (!targetNode) return;

  const observer = new MutationObserver(() => {
    // Debounce rapid changes
    setTimeout(() => {
      const headings = Array.from(qsa(HEADING_SELECTORS));
      if (headings.length === 0) return;

      const toc = generateTOC(headings);
      const container = document.querySelector(TOC_CONTAINER_SELECTOR);
      if (container) {
        renderTOC(container, toc);
        setupScrollSpy();
      }
    }, 100);
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });

  console.log('📑 Content observer setup');
};

/**
 * Find TOC container or create one
 */
const getOrCreateTOCContainer = (): Element | null => {
  // Try to find existing container
  let container = document.querySelector(TOC_CONTAINER_SELECTOR);
  if (container) return container;

  // Find suitable location to insert TOC
  const postContent = document.querySelector('.post-content');
  const pageContent = document.querySelector('.page-content');

  const targetContent = postContent || pageContent;
  if (!targetContent) {
    console.warn('⚠️ Could not find suitable location for TOC');
    return null;
  }

  // Create container
  container = create('div', {
    id: TOC_CONTAINER_SELECTOR.replace('#', ''),
    class: 'toc-container'
  });

  // Insert after first paragraph or at the beginning
  const firstParagraph = targetContent.querySelector('p');
  if (firstParagraph) {
    firstParagraph.parentNode?.insertBefore(container, firstParagraph.nextSibling);
  } else {
    targetContent.insertBefore(container, targetContent.firstChild);
  }

  return container;
};

/**
 * Initialize TOC functionality
 */
export const initTOC = (): void => {
  console.log('📑 Initializing Table of Contents...');

  // Get or create TOC container
  const container = getOrCreateTOCContainer();
  if (!container) {
    console.log('📑 No suitable location found for TOC');
    return;
  }

  // Find headings in the page
  const headings = Array.from(qsa(HEADING_SELECTORS));
  if (headings.length === 0) {
    console.log('📑 No headings found - TOC not created');
    container.innerHTML = '<p class="toc-empty">No headings found on this page</p>';
    return;
  }

  // Generate and render TOC
  const toc = generateTOC(headings);
  renderTOC(container, toc);

  // Setup scroll spy
  setupScrollSpy();

  // Setup content observer for dynamic changes
  setupContentObserver();

  console.log(`📑 Table of Contents initialized with ${headings.length} headings`);
};

/**
 * Cleanup TOC functionality
 */
export const cleanupTOC = (): void => {
  // Remove event listeners
  const scrollCleanup = (window as any)._scrollSpyCleanup;
  if (typeof scrollCleanup === 'function') {
    scrollCleanup();
  }

  // Clear TOC container
  const container = document.querySelector(TOC_CONTAINER_SELECTOR);
  if (container) {
    container.innerHTML = '';
  }

  console.log('📑 Table of Contents cleaned up');
};

/**
 * TOC styles are now loaded from external CSS files
 * This function is kept for backward compatibility but no longer does anything
 */
export const addTOCStyles = (): void => {
  // Styles are now in src/css/components.css and loaded via the build system
  console.log('📑 TOC styles loaded from external CSS file');
};