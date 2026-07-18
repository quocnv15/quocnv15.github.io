---
layout: page
title: Projects
permalink: /projects/
---

<div class="projects-page">
  <div class="projects-header">
    <h1 class="projects-title">My Projects</h1>
    <p class="projects-subtitle">A collection of my iOS development work and personal projects</p>
  </div>

  <!-- Filter and Search Controls -->
  <div class="projects-controls">
    <!-- Search Box -->
    <div class="search-container">
      <input type="text" id="projectSearch" class="search-input" placeholder="Search projects..." autocomplete="off">
    </div>
    
    <!-- Category Filter -->
    <div class="filter-container">
      <button class="filter-btn active" data-category="all">All Projects</button>
      <button class="filter-btn" data-category="Healthcare">Healthcare</button>
      <button class="filter-btn" data-category="Fintech">Fintech</button>
      <button class="filter-btn" data-category="Coworking">Coworking</button>
      <button class="filter-btn" data-category="Business">Business</button>
      <button class="filter-btn" data-category="Travel">Travel</button>
      <button class="filter-btn" data-category="Sports">Sports</button>
      <button class="filter-btn" data-category="Lifestyle">Lifestyle</button>
      <button class="filter-btn" data-category="3D Design">3D Design</button>
    </div>
    
    <!-- Sort Options -->
    <div class="sort-container">
      <select id="sortSelect" class="sort-select">
        <option value="priority">Sort by Priority</option>
        <option value="date-newest">Newest First</option>
        <option value="date-oldest">Oldest First</option>
        <option value="name">Sort by Name</option>
        <option value="category">Sort by Category</option>
      </select>
    </div>
  </div>

  <!-- Results Info -->
  <div class="results-info">
    <span id="resultCount">11</span> projects found
  </div>

  <!-- Projects Grid -->
  <div class="projects-grid" id="projectsGrid">
    {% assign priority_projects = "" | split: "" %}
    {% assign regular_projects = "" | split: "" %}
    
    {% for project in site.projects %}
      {% if project.priority %}
        {% assign priority_projects = priority_projects | push: project %}
      {% else %}
        {% assign regular_projects = regular_projects | push: project %}
      {% endif %}
    {% endfor %}
    
    {% assign sorted_priority = priority_projects | sort: 'priority' %}
    {% assign sorted_regular = regular_projects | sort: 'date' | reverse %}
    {% assign projects = sorted_priority | concat: sorted_regular %}
    
    {% for project in projects %}
      <div class="project-card" 
           data-category="{{ project.category | default: 'Other' }}" 
           data-title="{{ project.title | downcase }}"
           data-date="{{ project.date | date: '%s' }}"
           data-priority="{{ project.priority | default: 999 }}"
           data-status="{{ project.status | downcase }}">
        
        {% if project.image %}
          <div class="project-card-image">
            <img src="{{ project.image | relative_url }}" alt="{{ project.title }}" loading="lazy">
          </div>
        {% endif %}
        
        <div class="project-card-content">
          <div class="project-card-header">
            <h3 class="project-card-title">
              <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
            </h3>
            <div class="project-meta">
              {% if project.status %}
                <span class="project-status status-{{ project.status | downcase }}">{{ project.status }}</span>
              {% endif %}
              {% if project.category %}
                <span class="project-category">{{ project.category }}</span>
              {% endif %}
            </div>
          </div>
          
          <p class="project-card-description">{{ project.description }}</p>
          
          {% if project.technologies %}
            <div class="project-card-tech">
              {% for tech in project.technologies limit: 4 %}
                <span class="tech-tag">{{ tech }}</span>
              {% endfor %}
              {% if project.technologies.size > 4 %}
                <span class="tech-tag more">+{{ project.technologies.size | minus: 4 }}</span>
              {% endif %}
            </div>
          {% endif %}
          
          {% if project.demo_url or project.github_url or project.app_store_url or project.google_play_url %}
            <div class="project-card-links">
              {% if project.demo_url %}
                <a href="{{ project.demo_url }}" target="_blank" rel="noopener" class="project-link demo">Demo</a>
              {% endif %}
              {% if project.github_url %}
                <a href="{{ project.github_url }}" target="_blank" rel="noopener" class="project-link github">Code</a>
              {% endif %}
              {% if project.app_store_url %}
                <a href="{{ project.app_store_url }}" target="_blank" rel="noopener" class="project-link app-store">App Store</a>
              {% endif %}
              {% if project.google_play_url %}
                <a href="{{ project.google_play_url }}" target="_blank" rel="noopener" class="project-link google-play">Google Play</a>
              {% endif %}
            </div>
          {% endif %}
        </div>
      </div>
    {% endfor %}
  </div>

  <!-- No Results Message -->
  <div class="no-results" id="noResults" style="display: none;">
    <h3>No projects found</h3>
    <p>Try adjusting your search or filter criteria</p>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('projectSearch');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sortSelect');
  const projectsGrid = document.getElementById('projectsGrid');
  const projectCards = document.querySelectorAll('.project-card');
  const resultCount = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');
  
  let currentFilter = 'all';
  let currentSort = 'priority';
  
  // Initialize
  updateDisplay();
  
  // Search functionality
  searchInput.addEventListener('input', function() {
    updateDisplay();
  });
  
  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      currentFilter = this.dataset.category;
      updateDisplay();
    });
  });
  
  // Sort functionality
  sortSelect.addEventListener('change', function() {
    currentSort = this.value;
    updateDisplay();
  });
  
  function updateDisplay() {
    const searchTerm = searchInput.value.toLowerCase();
    let visibleCards = [];
    
    // Filter cards
    projectCards.forEach(card => {
      const title = card.dataset.title;
      const category = card.dataset.category;
      const matchesSearch = title.includes(searchTerm);
      const matchesFilter = currentFilter === 'all' || category === currentFilter;
      
      if (matchesSearch && matchesFilter) {
        card.style.display = '';
        visibleCards.push(card);
      } else {
        card.style.display = 'none';
      }
    });
    
    // Sort visible cards
    sortCards(visibleCards, currentSort);
    
    // Update UI
    resultCount.textContent = visibleCards.length;
    noResults.style.display = visibleCards.length === 0 ? 'block' : 'none';
  }
  
  function sortCards(cards, sortBy) {
    const cardsArray = Array.from(cards);
    
    cardsArray.sort((a, b) => {
      switch(sortBy) {
        case 'date-newest':
          return parseInt(b.dataset.date) - parseInt(a.dataset.date);
        case 'date-oldest':
          return parseInt(a.dataset.date) - parseInt(b.dataset.date);
        case 'name':
          return a.dataset.title.localeCompare(b.dataset.title);
        case 'category':
          return a.dataset.category.localeCompare(b.dataset.category);
        case 'priority':
        default:
          return parseInt(a.dataset.priority) - parseInt(b.dataset.priority);
      }
    });
    
    // Reorder in DOM
    cardsArray.forEach(card => {
      projectsGrid.appendChild(card);
    });
  }
});
</script>
