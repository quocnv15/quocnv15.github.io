---
layout: page
title: Home
---

<div class="post-list-container">
  <!-- Sidebar with categories -->
  <aside class="sidebar" id="post-sidebar">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <p class="sidebar-subtitle">Browse by category</p>
      </div>

      <!-- Filter Status -->
      <div class="filter-status" id="filterStatus" style="display: none;">
        <div class="filter-status-content">
          <span class="filter-status-icon">🔍</span>
          <span class="filter-status-text" id="filterStatusText"></span>
          <button class="clear-filter-btn" id="clearFilterBtn" title="Clear filter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Bar in Sidebar -->
      <div class="search-section sidebar-search">
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              id="searchInput" 
              class="search-input" 
              placeholder="Search articles..."
              aria-label="Search articles"
            >
            <button class="search-clear" id="searchClear" aria-label="Clear search" style="display: none;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="search-status" id="searchStatus"></div>
        </div>
      </div>

      <nav class="category-nav">
        {% assign sorted_posts = site.posts | sort: 'date' | reverse %}
        {% assign all_categories = "" | split: "" %}
        {% for post in sorted_posts %}
          {% for category in post.categories %}
            {% unless all_categories contains category %}
              {% assign all_categories = all_categories | push: category %}
            {% endunless %}
          {% endfor %}
        {% endfor %}
        {% assign sorted_categories = all_categories | sort %}

        {% for category in sorted_categories %}
          {% assign posts_in_category = sorted_posts | where_exp: "post", "post.categories contains category" %}
          <a href="#{{ category | slugify }}" class="category-item" data-category="{{ category | slugify }}">
            <span class="category-name">{{ category }}</span>
            <span class="category-count">{{ posts_in_category.size }} Bookmarks</span>
          </a>
        {% endfor %}
      </nav>

      <!-- Tags section -->
      <div class="tags-section">
        <h3 class="tags-title">Tags</h3>
        <div class="tags-cloud">
          {% assign tags = site.tags | sort %}
          {% for tag in tags limit:15 %}
          <a href="#tag-{{ tag[0] | slugify }}" class="tag-item">
            {{ tag[0] }} <span class="tag-count">{{ tag[1].size }}</span>
          </a>
          {% endfor %}
        </div>
      </div>
    </div>
  </aside>

  <!-- Main content area -->
  <div class="post-list-main">
    <div class="posts-homepage" style="padding-top: 2rem;">

  <!-- Search Results -->
  <div class="search-results" id="searchResults" style="display: none;">
    <div class="search-results-header">
      <h2 class="search-results-title">
        Search Results <span class="results-count" id="resultsCount"></span>
      </h2>
      <button class="clear-search-btn" id="clearSearchBtn">Clear Search</button>
    </div>
    <div class="search-results-grid" id="searchResultsGrid">
      <!-- Search results will be dynamically added here -->
    </div>
    <div class="no-results" id="noResults" style="display: none;">
      <div class="no-results-content">
        <svg class="no-results-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
          <path d="M8 11h6"></path>
        </svg>
        <h3>No articles found</h3>
        <p>Try searching with different keywords or browse all articles.</p>
        <button class="browse-all-btn" id="browseAllBtn">Browse All Articles</button>
      </div>
    </div>
  </div>

  <!-- Featured/Latest Posts Section -->
  <div class="featured-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="section-icon">⭐</span>
        Featured Articles
      </h2>
      <div class="section-nav">
        <button class="nav-btn prev">‹</button>
        <button class="nav-btn next">›</button>
      </div>
    </div>

    <div class="featured-slider">
      {% assign featured_posts = site.posts | sort: 'date' | reverse %}
      {% for post in featured_posts limit: 4 %}
      {% include post-metadata.html post=post %}
      <article class="featured-card" 
               data-categories="{{ categories_data }}" 
               data-date="{{ formatted_date_sort }}" 
               data-read-time="{{ calculated_read_time }}">
        <div class="featured-content">
          <div class="featured-badge">
            {% include category-badge.html post=post %}
          </div>
          <h3 class="featured-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>
          <div class="featured-meta">
            <time class="featured-date">{{ formatted_date }}</time>
            <span class="featured-read-time">{{ calculated_read_time }} min read</span>
          </div>
          <p class="featured-excerpt">
            {% if post.content %}
              {{ post.content | strip_html | truncatewords: 30 | remove: '#' }}
            {% endif %}
          </p>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>

  <!-- Dynamic Category Sections -->
  <div class="categories-container">
    {% assign sorted_posts = site.posts | sort: 'date' | reverse %}

    <!-- iOS Development Section -->
    <div id="ios" class="category-section" data-category="ios">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">📱</span>
          iOS Development
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign ios_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'iOS' %}
                {% assign ios_count = ios_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ ios_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'iOS' %}
            {% include post-card.html post=post %}
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Data Structures & Algorithms Section -->
    <div id="data" class="category-section" data-category="data">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">🔧</span>
          Data Structures & Algorithms
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign data_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'Data Structures' %}
                {% assign data_count = data_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ data_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'Data Structures' %}
            {% include post-card.html post=post %}
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Architecture & Design Section -->
    <div id="architecture" class="category-section" data-category="architecture">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">🏗️</span>
          Architecture & Design
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign arch_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'Architecture' %}
                {% assign arch_count = arch_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ arch_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'Architecture' %}
            {% include post-card.html post=post %}
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Swift Programming Section -->
    <div id="swift" class="category-section" data-category="swift">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">💻</span>
          Swift Programming
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign swift_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'Swift' %}
                {% assign swift_count = swift_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ swift_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'Swift' %}
            {% include post-card.html post=post %}
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- AI & Coding Strategy Section -->
    <div id="ai" class="category-section" data-category="ai">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">🤖</span>
          AI & Coding Strategy
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign ai_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'AI' or post.categories contains 'Strategy' %}
                {% assign ai_count = ai_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ ai_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'AI' or post.categories contains 'Strategy' %}
            {% include post-card.html post=post %}
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Interview Preparation Section -->
    <div id="interview" class="category-section" data-category="interview">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">💼</span>
          Interview Preparation
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign interview_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'Interview' %}
                {% assign interview_count = interview_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ interview_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'Interview' %}
            {% include post-card.html post=post %}
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Concurrency Section -->
    <div id="concurrency" class="category-section" data-category="concurrency">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">⚡</span>
          Concurrency & Threading
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign concurrency_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'Concurrency' %}
                {% assign concurrency_count = concurrency_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ concurrency_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'Concurrency' %}
            {% include post-card.html post=post %}
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Knowledge Curation Section -->
    <div id="notes" class="category-section" data-category="notes">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">📝</span>
          Knowledge Curation
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign notes_count = site.notes | size %}
            {{ notes_count }} notes
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>

      <div class="posts-grid">
        {% assign sorted_notes = site.notes | sort: 'date' | reverse %}
        {% for note in sorted_notes %}
        {% include post-metadata.html post=note %}
        <article class="post-card" 
                 data-categories="notes" 
                 data-tags="{% if note.tags %}{{ note.tags | join: ' ' | downcase }}{% endif %} notes"
                 data-date="{{ formatted_date_sort }}" 
                 data-read-time="{{ calculated_read_time }}">
          <div class="post-content">
            <div class="post-tags">
              <span class="post-tag">📝 Notes</span>
            </div>
            <h3 class="post-title">
              <a href="{{ note.url | relative_url }}">{{ note.title }}</a>
            </h3>
            <div class="post-meta">
              <time class="post-date">{{ formatted_date }}</time>
              <span class="post-read-time">{{ calculated_read_time }} min read</span>
            </div>
            <p class="post-excerpt">
              {% if note.content %}
                {{ note.content | strip_html | truncatewords: 20 | remove: '#' }}
              {% endif %}
            </p>
          </div>
        </article>
        {% endfor %}
      </div>
    </div>
  </div>

  <!-- Additional Navigation Links -->
  <div class="bottom-navigation">
    <div class="view-all-section">
      <a href="/archive.html" class="view-all-btn">View All Articles →</a>
    </div>

    <div class="quick-links">
      <a href="#" class="quick-link" data-scroll="top">↑ Back to Top</a>
      <a href="/archive.html" class="quick-link">📚 Archive</a>
      <a href="/projects.html" class="quick-link">💼 Projects</a>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const searchResults = document.getElementById('searchResults');
  const searchResultsGrid = document.getElementById('searchResultsGrid');
  const searchStatus = document.getElementById('searchStatus');
  const resultsCount = document.getElementById('resultsCount');
  const noResults = document.getElementById('noResults');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const browseAllBtn = document.getElementById('browseAllBtn');
  
  // Search state
  const categorySections = document.querySelectorAll('.category-section');
  const featuredSection = document.querySelector('.featured-section');
  let searchTimeout;
  let currentSearch = '';
  
  console.log('Category sections found:', categorySections.length); // Debug
  console.log('Featured section found:', featuredSection ? 'Yes' : 'No'); // Debug
  
  // Get all posts data
  function getAllPosts() {
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
  
  // Search function
  function performSearch(query) {
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
  
  // Display search results
  function displaySearchResults(results, query) {
    // Hide regular content
    featuredSection.style.display = 'none';
    categorySections.forEach(section => section.style.display = 'none');

    // Show search results
    searchResults.style.display = 'block';
    resultsCount.textContent = `(${results.length})`;

    if (results.length === 0) {
      searchResultsGrid.style.display = 'none';
      noResults.style.display = 'block';
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
    }

    // Update status
    searchStatus.textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''}`;
    searchClear.style.display = 'block';
  }
  
  // Create search result card
  function createSearchResultCard(post, query) {
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
  
  // Highlight text
  function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  // Clear search
  function clearSearch() {
    searchInput.value = '';
    searchClear.style.display = 'none';
    searchResults.style.display = 'none';
    searchStatus.textContent = '';

    // Show regular content
    featuredSection.style.display = 'block';
    categorySections.forEach(section => section.style.display = 'block');

    // Reset filter
    currentSearch = '';
    window.history.replaceState(null, null, window.location.pathname);
  }
  
  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', function() {
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
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        clearSearch();
        this.blur();
      }
    });
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
  
  // Check URL hash for search
  const urlHash = window.location.hash.substring(1);
  if (urlHash.startsWith('search=')) {
    const query = decodeURIComponent(urlHash.substring(7));
    if (query) {
      searchInput.value = query;
      performSearch(query);
    }
  }
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }

    // Escape to clear search
    if (e.key === 'Escape' && currentSearch) {
      clearSearch();
    }
  });
  
  // Sidebar toggle for mobile
  const sidebar = document.getElementById('post-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  
  if (sidebarToggle && sidebar && sidebarOverlay) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', function() {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });

    // Filter state
    let activeCategory = null;
    let activeTag = null;
    const filterStatus = document.getElementById('filterStatus');
    const filterStatusText = document.getElementById('filterStatusText');
    const clearFilterBtn = document.getElementById('clearFilterBtn');

    // Show filter status
    function showFilterStatus(text) {
      if (filterStatus && filterStatusText) {
        filterStatusText.textContent = text;
        filterStatus.style.display = 'block';
      }
    }

    // Hide filter status
    function hideFilterStatus() {
      if (filterStatus) {
        filterStatus.style.display = 'none';
      }
    }

    // Clear filter button
    if (clearFilterBtn) {
      clearFilterBtn.addEventListener('click', function() {
        activeCategory = null;
        activeTag = null;
        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));
        hideFilterStatus();
        showAllPosts();
      });
    }

    // Filter by category
    function filterByCategory(categorySlug) {
      console.log('Filtering by category:', categorySlug); // Debug

      // Clear search
      if (searchInput.value) {
        searchInput.value = '';
        clearSearch();
      }

      // Hide all sections first
      categorySections.forEach(section => {
        section.style.display = 'none';
      });

      // Try to find section by ID first, then by data-category attribute
      let targetSection = document.getElementById(categorySlug);
      if (!targetSection) {
        targetSection = document.querySelector(`.category-section[data-category="${categorySlug}"]`);
      }

      console.log('Target section found:', targetSection ? 'Yes' : 'No'); // Debug

      if (targetSection) {
        targetSection.style.display = 'block';

        // Get category name from sidebar
        const categoryItem = document.querySelector(`.category-item[data-category="${categorySlug}"]`);
        const categoryName = categoryItem?.querySelector('.category-name')?.textContent || categorySlug;
        showFilterStatus(`Filtering by: ${categoryName}`);

        // Smooth scroll to section with offset for fixed header
        setTimeout(() => {
          const yOffset = -100; // Offset for fixed header
          const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
      } else {
        console.error('Category section not found:', categorySlug); // Debug
        console.log('Available sections:', Array.from(categorySections).map(s => ({
          id: s.id,
          dataCategory: s.getAttribute('data-category')
        })));
      }

      // Hide featured section when filtering
      if (featuredSection) {
        featuredSection.style.display = 'none';
      }
    }

    // Filter by tag
    function filterByTag(tagText) {
      // Clear search
      if (searchInput.value) {
        searchInput.value = '';
        clearSearch();
      }

      let visibleCount = 0;
      const searchTag = tagText.toLowerCase().trim();

      console.log('Filtering by tag:', searchTag); // Debug

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

          console.log('Post tags:', postTags.substring(0, 100)); // Debug

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
            console.log('✓ Post matched'); // Debug
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

      console.log('Total visible posts:', visibleCount); // Debug

      // Show filter status
      showFilterStatus(`Filtering by tag: #${tagText} (${visibleCount} post${visibleCount !== 1 ? 's' : ''})`);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Show all posts
    function showAllPosts() {
      // Clear search
      if (searchInput.value) {
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

    // Category filtering
    const categoryItems = document.querySelectorAll('.category-item');
    console.log('Found category items:', categoryItems.length); // Debug

    categoryItems.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        const categorySlug = this.getAttribute('data-category');
        console.log('Category clicked:', categorySlug); // Debug

        // Toggle category
        if (activeCategory === categorySlug) {
          // Deselect - show all
          activeCategory = null;
          activeTag = null;
          document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
          document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));
          showAllPosts();
        } else {
          // Select new category
          activeCategory = categorySlug;
          activeTag = null; // Clear tag filter

          // Update active states
          document.querySelectorAll('.category-item').forEach(item => item.classList.remove('active'));
          document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));
          this.classList.add('active');

          // Filter posts
          filterByCategory(categorySlug);
        }

        // Close mobile sidebar
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      });
    });

    // Tag filtering
    document.querySelectorAll('.tag-item').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        // Get tag name - extract just the tag text before the count
        const fullText = this.textContent.trim();
        // Remove numbers and extra spaces, handle both "TagName 5" and "TagName5" formats
        const tagText = fullText.replace(/\s*\d+\s*$/, '').trim();

        console.log('Tag clicked:', tagText); // Debug

        // Toggle tag
        if (activeTag === tagText) {
          // Deselect - show all or category if active
          activeTag = null;
          document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));

          if (activeCategory) {
            filterByCategory(activeCategory);
          } else {
            showAllPosts();
          }
        } else {
          // Select new tag
          activeTag = tagText;

          // Update active states
          document.querySelectorAll('.tag-item').forEach(item => item.classList.remove('active'));
          this.classList.add('active');

          // Filter posts
          filterByTag(tagText);
        }

        // Close mobile sidebar
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
      });
    });
  }
});
</script>

<!-- Close main content and container divs -->
    </div>
  </div>
</div>

<!-- Mobile sidebar toggle button -->
<button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle categories sidebar">
  ☰
</button>

<!-- Sidebar overlay for mobile -->
<div class="sidebar-overlay" id="sidebar-overlay"></div>
