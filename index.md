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
      <div class="filter-status" id="filterStatus" style="display: none;" role="status" aria-live="polite" aria-atomic="true">
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
            aria-describedby="search-hint"
          >
          <span id="search-hint" class="visually-hidden">Type to search through all articles and bookmarks</span>
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

        {% comment %} Define valid categories - only show categories that have corresponding sections {% endcomment %}
        {% comment %} Mapping: category name -> section data-category attribute {% endcomment %}
        {% comment %} Sections available: ios, data, architecture, swift, ai, interview, concurrency {% endcomment %}
        {% assign category_mapping = "iOS:ios,Swift:swift,AI Tools & Workflow:ai-workflow,AI Agents & Automation:ai-agents,AI Strategy & Business:ai-strategy,Architecture:architecture,Data Structures:data,Interview:interview,Concurrency:concurrency" | split: "," %}
        {% assign min_posts = 1 %}

        {% for category in sorted_categories %}
          {% assign category_slug = category | slugify %}
          {% assign posts_in_category = sorted_posts | where_exp: "post", "post.categories contains category" %}
          
          {% comment %} Only show if has minimum posts {% endcomment %}
          {% if posts_in_category.size >= min_posts %}
            {% assign has_section = false %}
            {% assign mapped_slug = "" %}
            
            {% comment %} Check if category has a corresponding section {% endcomment %}
            {% for mapping in category_mapping %}
              {% assign parts = mapping | split: ":" %}
              {% assign mapped_category = parts[0] %}
              {% assign mapped_data_category = parts[1] %}
              
              {% if category == mapped_category %}
                {% assign has_section = true %}
                {% assign mapped_slug = mapped_data_category %}
                {% break %}
              {% endif %}
            {% endfor %}
            
            {% comment %} Show category only if it has a corresponding section {% endcomment %}
            {% if has_section %}
              <a href="#{{ mapped_slug }}" class="category-item" data-category="{{ mapped_slug }}">
                <span class="category-name">{{ category }}</span>
                <span class="category-count">{{ posts_in_category.size }} Bookmarks</span>
              </a>
            {% endif %}
          {% endif %}
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
  <div class="search-results" id="searchResults" style="display: none;" role="region" aria-label="Search results" aria-live="polite">
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

    <!-- AI Tools & Workflow Section -->
    <div id="ai-workflow" class="category-section" data-category="ai-workflow">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">🛠️</span>
          AI Tools & Workflow
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign ai_workflow_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'AI Tools & Workflow' %}
                {% assign ai_workflow_count = ai_workflow_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ ai_workflow_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'AI Tools & Workflow' %}
            {% include post-card.html post=post %}
          {% endif %}
        {% endfor %}
      </div>
    </div>
    
    <!-- AI Agents & Automation Section -->
    <div id="ai-agents" class="category-section" data-category="ai-agents">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">🤖</span>
          AI Agents & Automation
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign ai_agents_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'AI Agents & Automation' %}
                {% assign ai_agents_count = ai_agents_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ ai_agents_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'AI Agents & Automation' %}
            {% include post-card.html post=post %}
          {% endif %}
        {% endfor %}
      </div>
    </div>
    
    <!-- AI Strategy & Business Section -->
    <div id="ai-strategy" class="category-section" data-category="ai-strategy">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">📊</span>
          AI Strategy & Business
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign ai_strategy_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'AI Strategy & Business' %}
                {% assign ai_strategy_count = ai_strategy_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ ai_strategy_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'AI Strategy & Business' %}
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

<script type="module" src="/assets/js/search.js"></script>
<script type="module" src="/assets/js/filter.js"></script>

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
