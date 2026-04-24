/**
 * Search Module
 * Handles article search functionality with real-time results
 * @module search
 */

// DOM Elements
let searchInput;
let searchClear;
let searchResults;
let searchResultsGrid;
let searchStatus;
let resultsCount;
let noResults;
let clearSearchBtn;
let browseAllBtn;
let categorySections;
let featuredSection;
let searchTimeout;
let currentSearch = '';

/**
 * Initialize search functionality on DOM content loaded
 */
function init() {
  // Get DOM elements
  searchInput = document.getElementById('searchInput');
  searchClear = document.getElementById('searchClear');
  searchResults = document.getElementById('searchResults');
  searchResultsGrid = document.getElementById('searchResultsGrid');
  searchStatus = document.getElementById('searchStatus');
  resultsCount = document.getElementById('resultsCount');
  noResults = document.getElementById('noResults');
  clearSearchBtn = document.getElementById('clearSearchBtn');
  browseAllBtn = document.getElementById('browseAllBtn');
  categorySections = document.querySelectorAll('.category-section');
  featuredSection = document.querySelector('.featured-section');

  console.log('Category sections found:', categorySections.length);
  console.log('Featured section found:', featuredSection ? 'Yes' : 'No');

  // Attach event listeners
  attachEventListeners();

  // Check URL hash for search query
  checkURLHash();
}

/**
 * Attach all event listeners
 */
function attachEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
  }

  if (searchClear) {
    searchClear.addEventListener('click', clearSearch);
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', clearSearch);
  }

  if (browseAllBtn) {
    browseAllBtn.addEventListener('click', clearSearch);
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Handle search input with debouncing
 */
function handleSearchInput() {
  clearTimeout(searchTimeout);
  const query = this.value;

  if (query.trim() === '') {
    clearSearch();
    return;
  }

  // Debounced search
  searchTimeout = setTimeout(() => {
    performSearch(query);
    // Update URL
    window.history.replaceState(null, null, `#search=${encodeURIComponent(query)}`);
  }, 300);
}

/**
 * Handle keyboard events in search input
 */
function handleSearchKeydown(e) {
  if (e.key === 'Escape') {
    clearSearch();
    this.blur();
  }
}

/**
 * Handle global keyboard shortcuts
 */
function handleKeyboardShortcuts(e) {
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (searchInput) searchInput.focus();
  }

  // Escape to clear search
  if (e.key === 'Escape' && currentSearch) {
    clearSearch();
  }
}

/**
 * Get all posts data from the page
 * @returns {Array} Array of post objects
 */
export function getAllPosts() {
  const posts = [];
  const postElements = document.querySelectorAll('.post-card, .featured-card');

  postElements.forEach(element => {
    const titleElement = element.querySelector('.post-title a, .featured-title a');
    const contentElement = element.querySelector('.post-excerpt, .featured-excerpt');
    const tagsElement = element.querySelector('.post-tags, .post-tag, .featured-badge');
    const metaElement = element.querySelector('.post-meta, .featured-meta');

    // Get author from multiple possible sources
    let author = '';
    const authorElement = element.querySelector('[data-author]');
    if (authorElement) {
      author = authorElement.getAttribute('data-author');
    } else {
      // Try to get author from meta or content
      const authorText = element.querySelector('.post-author, .author');
      if (authorText) {
        author = authorText.textContent.trim();
      }
    }

    if (titleElement) {
      posts.push({
        element: element,
        title: titleElement.textContent.trim(),
        content: contentElement ? contentElement.textContent.trim() : '',
        url: titleElement.getAttribute('href'),
        tags: tagsElement ? tagsElement.textContent.trim() : '',
        author: author,
        date: metaElement ? metaElement.textContent.trim() : '',
        categories: element.getAttribute('data-categories') || '',
        isRepost: element.querySelector('.post-tag, .tag-repost, [data-repost], .repost-badge') !== null ||
                  tagsElement.textContent.toLowerCase().includes('repost')
      });
    }
  });

  return posts;
}

/**
 * Perform search with given query
 * @param {string} query - Search query
 */
export function performSearch(query) {
  currentSearch = query.toLowerCase().trim();

  if (currentSearch === '') {
    clearSearch();
    return;
  }

  const allPosts = getAllPosts();
  const results = allPosts.filter(post => {
    // Search in title, content, tags, author
    const searchableText = [
      post.title,
      post.content,
      post.tags,
      post.author
    ].join(' ').toLowerCase();

    return searchableText.includes(currentSearch);
  });

  displaySearchResults(results, query);
}

/**
 * Display search results
 * @param {Array} results - Array of matching posts
 * @param {string} query - Original search query
 */
function displaySearchResults(results, query) {
  // Hide regular content
  if (featuredSection) featuredSection.style.display = 'none';
  categorySections.forEach(section => section.style.display = 'none');

  // Show search results
  searchResults.style.display = 'block';
  resultsCount.textContent = `(${results.length})`;

  if (results.length === 0) {
    searchResultsGrid.style.display = 'none';
    noResults.style.display = 'block';

    // Announce to screen readers
    searchResults.setAttribute('aria-label', `No results found for "${query}"`);
  } else {
    searchResultsGrid.style.display = 'grid';
    noResults.style.display = 'none';

    // Clear previous results
    searchResultsGrid.innerHTML = '';

    // Add results
    results.forEach(post => {
      const resultCard = createSearchResultCard(post, query);
      searchResultsGrid.appendChild(resultCard);
    });

    // Announce to screen readers
    searchResults.setAttribute('aria-label', `${results.length} result${results.length !== 1 ? 's' : ''} found for "${query}"`);
  }

  // Update status
  searchStatus.textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''}`;
  if (searchClear) searchClear.style.display = 'block';
}

/**
 * Create a search result card element
 * @param {Object} post - Post object
 * @param {string} query - Search query for highlighting
 * @returns {HTMLElement} Cloned and highlighted card element
 */
export function createSearchResultCard(post, query) {
  const card = post.element.cloneNode(true);

  // Highlight search terms
  const titleElement = card.querySelector('.post-title a, .featured-title a');
  const contentElement = card.querySelector('.post-excerpt, .featured-excerpt');

  if (titleElement) {
    titleElement.innerHTML = highlightText(titleElement.textContent, query);
  }

  if (contentElement) {
    contentElement.innerHTML = highlightText(contentElement.textContent, query);
  }

  // Add repost indicator if needed
  if (post.isRepost) {
    const repostBadge = document.createElement('span');
    repostBadge.className = 'search-repost-badge';
    repostBadge.textContent = 'Repost';
    card.querySelector('.post-content, .featured-content').prepend(repostBadge);
  }

  return card;
}

/**
 * Highlight matching text in search results
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} HTML with highlighted matches
 */
export function highlightText(text, query) {
  // Escape special regex characters in query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Clear search and reset UI
 */
export function clearSearch() {
  if (searchInput) searchInput.value = '';
  if (searchClear) searchClear.style.display = 'none';
  if (searchResults) searchResults.style.display = 'none';
  if (searchStatus) searchStatus.textContent = '';

  // Show regular content
  if (featuredSection) featuredSection.style.display = 'block';
  categorySections.forEach(section => section.style.display = 'block');

  // Reset filter
  currentSearch = '';
  window.history.replaceState(null, null, window.location.pathname);
}

/**
 * Check URL hash for search query
 */
function checkURLHash() {
  const urlHash = window.location.hash.substring(1);
  if (urlHash.startsWith('search=')) {
    const query = decodeURIComponent(urlHash.substring(7));
    if (query && searchInput) {
      searchInput.value = query;
      performSearch(query);
    }
  }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);
