---
layout: default
title: "SwiftUI Templates Showcase"
permalink: /swiftui/
---

<link href="{{ '/css/portfolio-hub.css' | relative_url }}" rel="stylesheet">
<div class="swiftui-page">
  <!-- Back button -->
  <div class="swiftui-back">
    <a href="{{ '/portfolio/' | relative_url }}" class="portfolio-back-bar__link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
      Back to Portfolio
    </a>
  </div>

  <!-- Hero -->
  <section class="swiftui-hero">
    <span class="swiftui-hero__badge">Templates Hub</span>
    <h1 class="swiftui-hero__title">SwiftUI Showcase Library</h1>
    <p class="swiftui-hero__subtitle">Tổng hợp và hệ thống hóa 160+ SwiftUI components, animations và premium layouts từ sucodee, Shubham Singh và Kavsoft.</p>
    
    {% assign projects = site.data.swiftui_projects %}
    {% assign sucodee_count = projects | where: "author", "sucodee" | size %}
    {% assign singh_count = projects | where: "author", "Shubham Singh" | size %}
    {% assign other_count = projects | where: "author", "Kavsoft / Other" | size %}
    
    <div class="swiftui-hero__stats">
      <div class="swiftui-hero__stat-item">
        <span><b>{{ projects.size }}</b> Components</span>
      </div>
      <div class="swiftui-hero__stat-item swiftui-hero__stat-item--muted">
        <span><b>{{ sucodee_count }}</b> Sucodee</span>
      </div>
      <div class="swiftui-hero__stat-item swiftui-hero__stat-item--muted">
        <span><b>{{ singh_count }}</b> Shubham Singh</span>
      </div>
      <div class="swiftui-hero__stat-item swiftui-hero__stat-item--muted">
        <span><b>{{ other_count }}</b> Kavsoft</span>
      </div>
    </div>
  </section>

  <!-- Controls (Search / Filters) -->
  <section class="swiftui-controls">
    <!-- Row 1: Search & Sorting -->
    <div class="search-row">
      <div class="search-wrapper">
        <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="searchInput" class="search-input-field" placeholder="Search templates, components or details..." aria-label="Search templates">
      </div>
      
      <div class="select-wrapper">
        <select id="sortSelect" class="sort-select-field" aria-label="Sort projects">
          <option value="name-asc">Sort: A to Z</option>
          <option value="name-desc">Sort: Z to A</option>
          <option value="author">Sort: By Author</option>
          <option value="category">Sort: By Category</option>
        </select>
      </div>
    </div>

    <!-- Row 2: Author filter -->
    <div class="filter-row">
      <span class="filter-label">Author</span>
      <div class="author-filter-pills">
        <button class="author-filter-btn active" data-author="all">All ({{ projects.size }})</button>
        <button class="author-filter-btn" data-author="sucodee">Sucodee ({{ sucodee_count }})</button>
        <button class="author-filter-btn" data-author="Shubham Singh">Shubham Singh ({{ singh_count }})</button>
        <button class="author-filter-btn" data-author="Kavsoft / Other">Kavsoft/Other ({{ other_count }})</button>
      </div>
    </div>

    <!-- Row 3: Category filter -->
    <div class="filter-row">
      <span class="filter-label">Category</span>
      <div class="portfolio-filters" style="margin-bottom: 0;">
        <button class="portfolio-filter active" data-category="all">All Categories</button>
        
        {% assign cat_list = "Text & Typography,Animations & Loaders,Buttons & Interaction,Pickers & Selection,UI & Layouts,Visual Effects & 3D,Forms & Inputs,Lists, Alerts & Progress,Concepts & Tutorials,Premium & Advanced,Games & Media" | split: "," %}
        {% for cat in cat_list %}
          {% assign c_count = projects | where: "category", cat | size %}
          {% if c_count > 0 %}
            <button class="portfolio-filter" data-category="{{ cat }}">{{ cat }} <span class="portfolio-filter__count">{{ c_count }}</span></button>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  </section>

  <!-- Active filter status count -->
  <div style="display: flex; justify-content: center; margin-bottom: var(--space-md);">
    <div class="results-count-banner">
      Found <span id="matchCount">{{ projects.size }}</span> matches
    </div>
  </div>

  <!-- Grid -->
  <div class="portfolio-grid" id="projectsGrid">
    {% for proj in projects %}
      {% assign cat_slug = proj.category | slugify | replace: '_', '' | replace: 'amp_amp_', '' | replace: 'amp_', '' | replace: 'and', '' | replace: '___', '' | replace: '__', '' | replace: '_', '' %}
      
      <!-- Safe slug creation for dynamic gradient classes -->
      {% if proj.category == "Text & Typography" %}{% assign cat_slug = "text_typography" %}
      {% elsif proj.category == "Animations & Loaders" %}{% assign cat_slug = "animations_loaders" %}
      {% elsif proj.category == "Buttons & Interaction" %}{% assign cat_slug = "buttons_interaction" %}
      {% elsif proj.category == "Pickers & Selection" %}{% assign cat_slug = "pickers_selection" %}
      {% elsif proj.category == "UI & Layouts" %}{% assign cat_slug = "ui_layouts" %}
      {% elsif proj.category == "Visual Effects & 3D" %}{% assign cat_slug = "visual_effects_3d" %}
      {% elsif proj.category == "Forms & Inputs" %}{% assign cat_slug = "forms_inputs" %}
      {% elsif proj.category == "Lists, Alerts & Progress" %}{% assign cat_slug = "lists_alerts_progress" %}
      {% elsif proj.category == "Concepts & Tutorials" %}{% assign cat_slug = "concepts_tutorials" %}
      {% elsif proj.category == "Premium & Advanced" %}{% assign cat_slug = "premium_advanced" %}
      {% elsif proj.category == "Games & Media" %}{% assign cat_slug = "games_media" %}
      {% else %}{% assign cat_slug = "other" %}
      {% endif %}

      <div class="portfolio-card swiftui-card" 
           data-author="{{ proj.author }}" 
           data-category="{{ proj.category }}" 
           data-name="{{ proj.name | downcase }}"
           data-desc="{{ proj.description | downcase }}"
           data-source="{% if proj.has_source %}true{% else %}false{% endif %}">
        
        <!-- Media / Preview -->
        <div class="card-media">
          {% if proj.preview_image != "" %}
            <img src="{{ proj.preview_image }}" alt="{{ proj.name }}" loading="lazy">
          {% else %}
            <!-- Styled gradient placeholder -->
            <div class="card-gradient-placeholder placeholder-{{ cat_slug }}">
              <span></span>
            </div>
          {% endif %}
        </div>

        <!-- Body -->
        <div class="card-body-content">
          <div class="card-author-tag">@{{ proj.author | replace: ' / Other', '' }}</div>
          <h3 class="card-title-text">{{ proj.name }}</h3>
          <p class="card-desc-text">{{ proj.description }}</p>
          
          <div class="card-meta-tags">
            <span class="portfolio-tag">{{ proj.category }}</span>
            {% if proj.has_source %}
              <span class="portfolio-tag portfolio-tag--success">✅ Source Code</span>
            {% else %}
              <span class="portfolio-tag portfolio-tag--warning">📋 Code Snippet</span>
            {% endif %}
          </div>
        </div>

        <!-- Actions -->
        <div class="card-actions-row">
          <!-- Copy local path -->
          <button class="btn-action btn-action-primary copy-path-btn" data-path="{{ proj.relative_path }}" title="Copy absolute workspace path to clipboard">
            <svg style="width:12px;height:12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy Path
          </button>
          
          <!-- Open Local Folder shortcut (works only locally) -->
          <a href="{{ proj.local_link }}" class="btn-action btn-action-secondary local-finder-btn" title="Open project folder in Finder (works locally only)">
            📁 Open Folder
          </a>
        </div>
      </div>
    {% endfor %}
  </div>

  <!-- Empty state -->
  <div class="no-results-view" id="noResultsView">
    <h3>No matching templates found</h3>
    <p>Try refining your search terms or adjusting the category filters.</p>
  </div>
</div>

<!-- Toast notification popup -->
<div class="toast-alert" id="toastAlert">Path copied to clipboard!</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const authorButtons = document.querySelectorAll('.author-filter-btn');
    const categoryButtons = document.querySelectorAll('.portfolio-filter');
    const projectsGrid = document.getElementById('projectsGrid');
    const projectCards = Array.from(document.querySelectorAll('.swiftui-card'));
    const matchCountSpan = document.getElementById('matchCount');
    const noResultsView = document.getElementById('noResultsView');
    const toastAlert = document.getElementById('toastAlert');

    let activeCategory = 'all';
    let activeAuthor = 'all';
    let currentSort = 'name-asc';

    // Copy path clipboard feature
    const absoluteRoot = "/Volumes/Workspace/0-Working/manking/SwiftUI_Temp/";
    
    document.querySelectorAll('.copy-path-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const relativePath = btn.dataset.path;
        const fullPath = absoluteRoot + relativePath;
        
        // Try standard clipboard copy
        navigator.clipboard.writeText(fullPath)
          .then(() => showToast(`Copied absolute path to clipboard!`))
          .catch(() => showToast(`Failed to copy path.`));
      });
    });

    function showToast(message) {
      toastAlert.textContent = message;
      toastAlert.classList.add('show');
      setTimeout(() => {
        toastAlert.classList.remove('show');
      }, 2500);
    }

    // Hide Open Folder buttons if deployed (not running on localhost)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      document.querySelectorAll('.local-finder-btn').forEach(btn => {
        btn.style.display = 'none';
      });
    }

    // Input handlers
    searchInput.addEventListener('input', filterAndSort);
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterAndSort();
    });

    // Author filtering
    authorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        authorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeAuthor = btn.dataset.author;
        filterAndSort();
      });
    });

    // Category filtering
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        filterAndSort();
      });
    });

    function filterAndSort() {
      const query = searchInput.value.trim().toLowerCase();
      let matchedCards = [];

      projectCards.forEach(card => {
        const name = card.dataset.name;
        const desc = card.dataset.desc;
        const category = card.dataset.category;
        const author = card.dataset.author;

        const matchesSearch = query === '' || name.includes(query) || desc.includes(query);
        const matchesCategory = activeCategory === 'all' || category === activeCategory;
        const matchesAuthor = activeAuthor === 'all' || author === activeAuthor;

        if (matchesSearch && matchesCategory && matchesAuthor) {
          card.style.display = 'flex';
          matchedCards.push(card);
        } else {
          card.style.display = 'none';
        }
      });

      // Update counters
      matchCountSpan.textContent = matchedCards.length;
      noResultsView.style.display = matchedCards.length === 0 ? 'block' : 'none';

      // Sort
      sortCards(matchedCards);
    }

    function sortCards(cards) {
      cards.sort((a, b) => {
        const nameA = a.dataset.name;
        const nameB = b.dataset.name;
        const authorA = a.dataset.author;
        const authorB = b.dataset.author;
        const categoryA = a.dataset.category;
        const categoryB = b.dataset.category;

        if (currentSort === 'name-asc') {
          return nameA.localeCompare(nameB);
        } else if (currentSort === 'name-desc') {
          return nameB.localeCompare(nameA);
        } else if (currentSort === 'author') {
          const authCompare = authorA.localeCompare(authorB);
          return authCompare !== 0 ? authCompare : nameA.localeCompare(nameB);
        } else if (currentSort === 'category') {
          const catCompare = categoryA.localeCompare(categoryB);
          return catCompare !== 0 ? catCompare : nameA.localeCompare(nameB);
        }
        return 0;
      });

      // Append in sorted order
      cards.forEach(card => {
        projectsGrid.appendChild(card);
      });
    }

    // Run initial filter and sort
    filterAndSort();
  });
</script>
