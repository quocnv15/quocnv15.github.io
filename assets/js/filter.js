/**
 * Filter Module
 * Handles category and tag filtering for posts
 * @module filter
 */

// Import search functions
import { clearSearch } from './search.js';

// DOM Elements
let categorySections;
let featuredSection;
let filterStatus;
let filterStatusText;
let clearFilterBtn;
let sidebar;
let sidebarOverlay;

// Filter state
let activeCategories = new Set();
let activeTag = null;

/**
 * Initialize filter functionality on DOM content loaded
 */
function init() {
  // Get DOM elements
  categorySections = document.querySelectorAll('.category-section');
  featuredSection = document.querySelector('.featured-section');
  filterStatus = document.getElementById('filterStatus');
  filterStatusText = document.getElementById('filterStatusText');
  clearFilterBtn = document.getElementById('clearFilterBtn');
  sidebar = document.getElementById('post-sidebar');
  sidebarOverlay = document.getElementById('sidebar-overlay');

  // Attach event listeners
  attachEventListeners();
}

/**
 * Attach all event listeners
 */
function attachEventListeners() {
  // Category filtering
  const categoryItems = document.querySelectorAll('.category-item');
  console.log('Found category items:', categoryItems.length);

  categoryItems.forEach(link => {
    link.addEventListener('click', handleCategoryClick);
  });

  // Tag filtering
  document.querySelectorAll('.tag-item').forEach(link => {
    link.addEventListener('click', handleTagClick);
  });

  // Clear filter button
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', handleClearFilter);
  }

  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle && sidebar && sidebarOverlay) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });
  }
}

/**
 * Handle category click event
 */
function handleCategoryClick(e) {
  e.preventDefault();

  const categorySlug = this.getAttribute('data-category');
  console.log('Category clicked:', categorySlug);

  // Toggle category (multi-select)
  if (activeCategories.has(categorySlug)) {
    // Deselect this category
    activeCategories.delete(categorySlug);
    this.classList.remove('active');
  } else {
    // Select this category (add to set)
    activeCategories.add(categorySlug);
    this.classList.add('active');
  }

  // Clear tag filter when selecting categories
  if (activeCategories.size > 0) {
    activeTag = null;
    document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));
  }

  // Filter posts by selected categories
  if (activeCategories.size === 0) {
    showAllPosts();
  } else {
    filterByCategories();
  }

  // Close mobile sidebar
  if (sidebar) sidebar.classList.remove('active');
  if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

/**
 * Handle tag click event
 */
function handleTagClick(e) {
  e.preventDefault();

  // Get tag name - extract just the tag text before the count
  const fullText = this.textContent.trim();
  // Remove numbers and extra spaces, handle both "TagName 5" and "TagName5" formats
  const tagText = fullText.replace(/\s*\d+\s*$/, '').trim();

  console.log('Tag clicked:', tagText);

  // Toggle tag
  if (activeTag === tagText) {
    // Deselect - show all or categories if active
    activeTag = null;
    document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));

    if (activeCategories.size > 0) {
      filterByCategories();
    } else {
      showAllPosts();
    }
  } else {
    // Select new tag
    activeTag = tagText;

    // Clear category filters when selecting tag
    activeCategories.clear();
    document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));

    // Update active states
    document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));
    this.classList.add('active');

    // Filter posts
    filterByTag(tagText);
  }

  // Close mobile sidebar
  if (sidebar) sidebar.classList.remove('active');
  if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

/**
 * Handle clear filter button click
 */
function handleClearFilter() {
  activeCategories.clear();
  activeTag = null;
  document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));
  hideFilterStatus();
  showAllPosts();
}

/**
 * Filter by selected categories
 */
export function filterByCategories() {
  console.log('Filtering by categories:', Array.from(activeCategories));

  // Clear search
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value) {
    searchInput.value = '';
    clearSearch();
  }

  // If no categories selected, show all
  if (activeCategories.size === 0) {
    showAllPosts();
    return;
  }

  // Hide all sections first
  categorySections.forEach(section => {
    section.style.display = 'none';
  });

  // Show only selected categories
  let visibleSections = [];
  activeCategories.forEach(categorySlug => {
    // Try to find section by ID first, then by data-category attribute
    let targetSection = document.getElementById(categorySlug);
    if (!targetSection) {
      targetSection = document.querySelector(`.category-section[data-category="${categorySlug}"]`);
    }

    if (targetSection) {
      targetSection.style.display = 'block';
      visibleSections.push(targetSection);
    } else {
      console.warn('Category section not found:', categorySlug);
    }
  });

  // Update filter status
  if (activeCategories.size > 0) {
    const categoryNames = Array.from(activeCategories).map(slug => {
      const categoryItem = document.querySelector(`.category-item[data-category="${slug}"]`);
      return categoryItem?.querySelector('.category-name')?.textContent || slug;
    });

    if (categoryNames.length === 1) {
      showFilterStatus(`Filtering by: ${categoryNames[0]}`);
    } else {
      showFilterStatus(`Filtering by: ${categoryNames.length} categories (${categoryNames.join(', ')})`);
    }

    // Smooth scroll to first visible section
    if (visibleSections.length > 0) {
      setTimeout(() => {
        const yOffset = -100;
        const y = visibleSections[0].getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    }
  }

  // Hide featured section when filtering
  if (featuredSection && activeCategories.size > 0) {
    featuredSection.style.display = 'none';
  }
}

/**
 * Filter by tag
 * @param {string} tagText - Tag to filter by
 */
export function filterByTag(tagText) {
  // Clear search
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value) {
    searchInput.value = '';
    clearSearch();
  }

  let visibleCount = 0;
  const searchTag = tagText.toLowerCase().trim();

  console.log('Filtering by tag:', searchTag);

  // Check each category section
  categorySections.forEach(section => {
    const postsInSection = section.querySelectorAll('.post-card');
    let hasVisiblePosts = false;

    postsInSection.forEach(post => {
      // Get tags from post element's data attribute first
      let postTags = post.getAttribute('data-tags') || '';

      // Also get from visible elements
      const metaElement = post.querySelector('.post-meta');
      const tagsElement = post.querySelector('.post-tags');
      const badgeElements = post.querySelectorAll('.post-tag, .tag-badge, .category-badge');

      if (metaElement) postTags += ' ' + metaElement.textContent;
      if (tagsElement) postTags += ' ' + tagsElement.textContent;
      badgeElements.forEach(badge => {
        postTags += ' ' + badge.textContent;
      });

      postTags = postTags.toLowerCase();

      console.log('Post tags:', postTags.substring(0, 100));

      // Check if tag exists - try multiple matching methods
      const tagPattern = new RegExp('\\b' + searchTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      const hasTag = tagPattern.test(postTags) ||
                    postTags.includes(searchTag) ||
                    postTags.includes('#' + searchTag) ||
                    postTags.includes(searchTag.replace(/[-\s]/g, ''));

      if (hasTag) {
        post.style.display = 'block';
        hasVisiblePosts = true;
        visibleCount++;
        console.log('✓ Post matched');
      } else {
        post.style.display = 'none';
      }
    });

    // Show/hide section based on visible posts
    section.style.display = hasVisiblePosts ? 'block' : 'none';
  });

  // Filter featured section
  if (featuredSection) {
    const featuredPosts = featuredSection.querySelectorAll('.featured-card');
    let hasVisibleFeatured = false;

    featuredPosts.forEach(post => {
      let postTags = post.getAttribute('data-tags') || '';

      const metaElement = post.querySelector('.featured-meta');
      const badgeElements = post.querySelectorAll('.featured-badge, .post-tag');

      if (metaElement) postTags += ' ' + metaElement.textContent;
      badgeElements.forEach(badge => {
        postTags += ' ' + badge.textContent;
      });

      postTags = postTags.toLowerCase();

      const tagPattern = new RegExp('\\b' + searchTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      const hasTag = tagPattern.test(postTags) ||
                    postTags.includes(searchTag) ||
                    postTags.includes('#' + searchTag);

      if (hasTag) {
        post.style.display = 'block';
        hasVisibleFeatured = true;
        visibleCount++;
      } else {
        post.style.display = 'none';
      }
    });

    featuredSection.style.display = hasVisibleFeatured ? 'block' : 'none';
  }

  console.log('Total visible posts:', visibleCount);

  // Show filter status
  showFilterStatus(`Filtering by tag: #${tagText} (${visibleCount} post${visibleCount !== 1 ? 's' : ''})`);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Show all posts and reset filters
 */
function showAllPosts() {
  // Clear search
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value) {
    searchInput.value = '';
    clearSearch();
  }

  // Hide filter status
  hideFilterStatus();

  // Show all sections
  categorySections.forEach(section => {
    section.style.display = 'block';

    // Show all posts in section
    section.querySelectorAll('.post-card').forEach(post => {
      post.style.display = 'block';
    });
  });

  // Show featured section
  if (featuredSection) {
    featuredSection.style.display = 'block';

    // Show all featured posts
    featuredSection.querySelectorAll('.featured-card').forEach(post => {
      post.style.display = 'block';
    });
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Show filter status message
 * @param {string} text - Status text to display
 */
function showFilterStatus(text) {
  if (filterStatus && filterStatusText) {
    filterStatusText.textContent = text;
    filterStatus.style.display = 'block';

    // Announce to screen readers
    filterStatus.setAttribute('aria-live', 'polite');
  }
}

/**
 * Hide filter status
 */
function hideFilterStatus() {
  if (filterStatus) {
    filterStatus.style.display = 'none';
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);
