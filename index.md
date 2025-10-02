---
layout: page
title: Home
---

<div class="posts-homepage">
  <div class="page-header">
    <h1 class="page-title">Technical Articles & Insights</h1>
    <p class="page-description">Explore my collection of mobile development and AI integration articles, architecture patterns, and programming best practices</p>
    
    <!-- Category Filter -->
    <div class="category-filter">
      <div class="filter-dropdown-container">
        <select class="filter-dropdown" id="filterDropdown" aria-label="Filter articles by category">
          <option value="all">All Articles</option>
          <option value="ios">📱 iOS Development</option>
          <option value="data">🔧 Data Structures</option>
          <option value="architecture">🏗️ Architecture</option>
          <option value="swift">💻 Swift Programming</option>
          <option value="ai">🤖 AI & Strategy</option>
          <option value="interview">💼 Interview Prep</option>
          <option value="app">🏛️ App Architecture</option>
          <option value="notes">📝 Knowledge Curation</option>
        </select>
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
      <article class="featured-card" data-categories="{% if post.categories %}{{ post.categories | join: ' ' }}{% endif %}" data-date="{{ post.date | date: '%Y%m%d' }}" data-read-time="{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %}">
        <div class="featured-content">
          <div class="featured-badge">
            {% if post.categories contains 'AI' %}🤖 AI{% elsif post.categories contains 'Interview' %}💼 Interview{% elsif post.categories contains 'Architecture' %}🏗️ Architecture{% else %}📱 iOS{% endif %}
          </div>
          <h3 class="featured-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>
          <div class="featured-meta">
            <time class="featured-date">{{ post.date | date: "%b %-d, %Y" }}</time>
            <span class="featured-read-time">{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %} min read</span>
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
    <div class="category-section" data-category="ios">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">📱</span>
          iOS Development
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign ios_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.path contains 'GCD' or post.path contains 'memory-leak' or post.path contains 'testing' or post.categories contains 'iOS' %}
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
          {% if post.path contains 'GCD' or post.path contains 'memory-leak' or post.path contains 'testing' or post.categories contains 'iOS' %}
          <article class="post-card" data-categories="{% if post.categories %}{{ post.categories | join: ' ' }}{% endif %} ios" data-date="{{ post.date | date: '%Y%m%d' }}" data-read-time="{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %}">
            <div class="post-content">
              <div class="post-tags">
                {% if post.categories %}
                  {% for category in post.categories limit: 2 %}
                    <span class="post-tag">{{ category }}</span>
                  {% endfor %}
                {% endif %}
              </div>
              <h3 class="post-title">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </h3>
              <div class="post-meta">
                <time class="post-date">{{ post.date | date: "%b %-d, %Y" }}</time>
                <span class="post-read-time">{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %} min read</span>
              </div>
              <p class="post-excerpt">
                {% if post.content %}
                  {{ post.content | strip_html | truncatewords: 20 | remove: '#' }}
                {% endif %}
              </p>
            </div>
          </article>
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Data Structures & Algorithms Section -->
    <div class="category-section" data-category="data">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">🔧</span>
          Data Structures & Algorithms
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign data_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.path contains 'data-structure' %}
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
          {% if post.path contains 'data-structure' %}
          <article class="post-card" data-categories="{% if post.categories %}{{ post.categories | join: ' ' }}{% endif %} data" data-date="{{ post.date | date: '%Y%m%d' }}" data-read-time="8">
            <div class="post-content">
              <div class="post-tags">
                {% if post.categories %}
                  {% for category in post.categories limit: 2 %}
                    <span class="post-tag">{{ category }}</span>
                  {% endfor %}
                {% endif %}
              </div>
              <h3 class="post-title">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </h3>
              <div class="post-meta">
                <time class="post-date">{{ post.date | date: "%b %-d, %Y" }}</time>
                <span class="post-read-time">8 min read</span>
              </div>
              <p class="post-excerpt">
                {% if post.content %}
                  {{ post.content | strip_html | truncatewords: 20 | remove: '#' }}
                {% endif %}
              </p>
            </div>
          </article>
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Architecture & Design Section -->
    <div class="category-section" data-category="architecture">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">🏗️</span>
          Architecture & Design
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign arch_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' or post.categories contains 'Architecture' %}
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
          {% if post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' or post.categories contains 'Architecture' %}
          <article class="post-card" data-categories="{% if post.categories %}{{ post.categories | join: ' ' }}{% endif %} architecture" data-date="{{ post.date | date: '%Y%m%d' }}" data-read-time="{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %}">
            <div class="post-content">
              <div class="post-tags">
                {% if post.categories %}
                  {% for category in post.categories limit: 2 %}
                    <span class="post-tag">{{ category }}</span>
                  {% endfor %}
                {% endif %}
              </div>
              <h3 class="post-title">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </h3>
              <div class="post-meta">
                <time class="post-date">{{ post.date | date: "%b %-d, %Y" }}</time>
                <span class="post-read-time">{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %} min read</span>
              </div>
              <p class="post-excerpt">
                {% if post.content %}
                  {{ post.content | strip_html | truncatewords: 20 | remove: '#' }}
                {% endif %}
              </p>
            </div>
          </article>
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Swift Programming Section -->
    <div class="category-section" data-category="swift">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">💻</span>
          Swift Programming
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign swift_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.path contains 'map' %}
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
          {% if post.path contains 'map' %}
          <article class="post-card" data-categories="swift" data-date="{{ post.date | date: '%Y%m%d' }}" data-read-time="6">
            <div class="post-content">
              <div class="post-tags">
                {% if post.categories %}
                  {% for category in post.categories limit: 2 %}
                    <span class="post-tag">{{ category }}</span>
                  {% endfor %}
                {% endif %}
              </div>
              <h3 class="post-title">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </h3>
              <div class="post-meta">
                <time class="post-date">{{ post.date | date: "%b %-d, %Y" }}</time>
                <span class="post-read-time">6 min read</span>
              </div>
              <p class="post-excerpt">
                {% if post.content %}
                  {{ post.content | strip_html | truncatewords: 20 | remove: '#' }}
                {% endif %}
              </p>
            </div>
          </article>
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- AI & Coding Strategy Section -->
    <div class="category-section" data-category="ai">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">🤖</span>
          AI & Coding Strategy
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign ai_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'AI' or post.categories contains 'Strategy' or post.path contains 'ai-coding' %}
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
          {% if post.categories contains 'AI' or post.categories contains 'Strategy' or post.path contains 'ai-coding' %}
          <article class="post-card" data-categories="{% if post.categories %}{{ post.categories | join: ' ' }}{% endif %} ai" data-date="{{ post.date | date: '%Y%m%d' }}" data-read-time="{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %}">
            <div class="post-content">
              <div class="post-tags">
                {% if post.categories %}
                  {% for category in post.categories limit: 2 %}
                    <span class="post-tag">{{ category }}</span>
                  {% endfor %}
                {% endif %}
              </div>
              <h3 class="post-title">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </h3>
              <div class="post-meta">
                <time class="post-date">{{ post.date | date: "%b %-d, %Y" }}</time>
                <span class="post-read-time">{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %} min read</span>
              </div>
              <p class="post-excerpt">
                {% if post.content %}
                  {{ post.content | strip_html | truncatewords: 20 | remove: '#' }}
                {% endif %}
              </p>
            </div>
          </article>
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Interview Preparation Section -->
    <div class="category-section" data-category="interview">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">💼</span>
          Interview Preparation
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign interview_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'Interview' or post.path contains 'interview' or post.path contains 'prepare' %}
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
          {% if post.categories contains 'Interview' or post.path contains 'interview' or post.path contains 'prepare' %}
          <article class="post-card" data-categories="{% if post.categories %}{{ post.categories | join: ' ' }}{% endif %} interview" data-date="{{ post.date | date: '%Y%m%d' }}" data-read-time="{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %}">
            <div class="post-content">
              <div class="post-tags">
                {% if post.categories %}
                  {% for category in post.categories limit: 2 %}
                    <span class="post-tag">{{ category }}</span>
                  {% endfor %}
                {% endif %}
              </div>
              <h3 class="post-title">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </h3>
              <div class="post-meta">
                <time class="post-date">{{ post.date | date: "%b %-d, %Y" }}</time>
                <span class="post-read-time">{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %} min read</span>
              </div>
              <p class="post-excerpt">
                {% if post.content %}
                  {{ post.content | strip_html | truncatewords: 20 | remove: '#' }}
                {% endif %}
              </p>
            </div>
          </article>
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- App Architecture Section -->
    <div class="category-section" data-category="app">
      <div class="category-header">
        <h2 class="category-title">
          <span class="category-icon">🏛️</span>
          App Architecture
        </h2>
        <div class="category-controls">
          <span class="post-count">
            {% assign app_count = 0 %}
            {% for post in sorted_posts %}
              {% if post.categories contains 'Architecture' or post.categories contains 'Flutter' or post.path contains 'app-architecture' %}
                {% assign app_count = app_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {{ app_count }} articles
          </span>
          <button class="expand-btn">+</button>
        </div>
      </div>
      
      <div class="posts-grid">
        {% for post in sorted_posts %}
          {% if post.categories contains 'Architecture' or post.categories contains 'Flutter' or post.path contains 'app-architecture' %}
          <article class="post-card" data-categories="{% if post.categories %}{{ post.categories | join: ' ' }}{% endif %} app" data-date="{{ post.date | date: '%Y%m%d' }}" data-read-time="{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %}">
            <div class="post-content">
              <div class="post-tags">
                {% if post.categories %}
                  {% for category in post.categories limit: 2 %}
                    <span class="post-tag">{{ category }}</span>
                  {% endfor %}
                {% endif %}
              </div>
              <h3 class="post-title">
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
              </h3>
              <div class="post-meta">
                <time class="post-date">{{ post.date | date: "%b %-d, %Y" }}</time>
                <span class="post-read-time">{% if post.categories contains 'AI' or post.categories contains 'Strategy' %}12{% elsif post.categories contains 'Interview' %}15{% elsif post.categories contains 'Architecture' or post.categories contains 'Flutter' %}20{% elsif post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}10{% elsif post.path contains 'data-structure' %}8{% elsif post.path contains 'map' %}6{% else %}5{% endif %} min read</span>
              </div>
              <p class="post-excerpt">
                {% if post.content %}
                  {{ post.content | strip_html | truncatewords: 20 | remove: '#' }}
                {% endif %}
              </p>
            </div>
          </article>
          {% endif %}
        {% endfor %}
      </div>
    </div>

    <!-- Knowledge Curation Section -->
    <div class="category-section" data-category="notes">
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
        <article class="post-card" data-categories="notes" data-date="{{ note.date | date: '%Y%m%d' }}" data-read-time="5">
          <div class="post-content">
            <div class="post-tags">
              <span class="post-tag">{{ note.path | split: '/' | last | split: '-' | first | capitalize }}</span>
            </div>
            <h3 class="post-title">
              <a href="{{ note.url | relative_url }}">{{ note.title }}</a>
            </h3>
            <div class="post-meta">
              <time class="post-date">{{ note.date | date: "%b %-d, %Y" }}</time>
              <span class="post-read-time">5 min read</span>
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
  const filterDropdown = document.getElementById('filterDropdown');
  const categorySections = document.querySelectorAll('.category-section');
  const featuredSection = document.querySelector('.featured-section');
  
  // Dropdown functionality
  if (filterDropdown) {
    filterDropdown.addEventListener('change', function() {
      const category = this.value;
      filterByCategory(category);
    });
  }
  
  function filterByCategory(category) {
    // Show/hide sections based on filter
    categorySections.forEach(section => {
      const sectionCategory = section.getAttribute('data-category');
      
      if (category === 'all' || sectionCategory === category) {
        section.style.display = 'block';
        section.classList.remove('hidden');
      } else {
        section.style.display = 'none';
        section.classList.add('hidden');
      }
    });
    
    // Handle featured section
    if (featuredSection) {
      if (category === 'all') {
        featuredSection.style.display = 'block';
        featuredSection.classList.remove('hidden');
      } else {
        featuredSection.style.display = 'none';
        featuredSection.classList.add('hidden');
      }
    }
  }
  
  // Add URL hash support for deep linking
  const urlHash = window.location.hash.substring(1);
  if (urlHash && filterDropdown) {
    filterDropdown.value = urlHash;
    filterByCategory(urlHash);
  }
  
  // Update URL hash when filter changes
  if (filterDropdown) {
    filterDropdown.addEventListener('change', function() {
      const category = this.value;
      if (category !== 'all') {
        window.history.replaceState(null, null, `#${category}`);
      } else {
        window.history.replaceState(null, null, window.location.pathname);
      }
    });
  }
});
</script>

  
