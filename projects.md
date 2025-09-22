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
      <input type="text" id="projectSearch" class="search-input" placeholder="🔍 Search projects..." autocomplete="off">
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

<style>
.projects-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.projects-header {
  text-align: center;
  margin-bottom: 3rem;
}

.projects-title {
  font-size: 3rem;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.projects-subtitle {
  font-size: 1.25rem;
  color: #5a6c7d;
  margin: 0;
  opacity: 0.9;
}

/* Controls Section */
.projects-controls {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e8e8e8;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e8e8e8;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #3498db;
  color: #3498db;
}

.filter-btn.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

.results-info {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #5a6c7d;
  font-size: 0.9rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.project-card-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #f8f9fa;
}

.project-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-card-image img {
  transform: scale(1.05);
}

.project-card-placeholder {
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}

.project-card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-card-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.project-card-title {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
  font-weight: 600;
  line-height: 1.3;
}

.project-card-title a {
  text-decoration: none;
  color: inherit;
  transition: color 0.3s ease;
}

.project-card-title a:hover {
  color: #3498db;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.project-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-maintenance {
  background: #fff3cd;
  color: #856404;
}

.status-in-progress {
  background: #cce7ff;
  color: #004085;
}

.project-category {
  padding: 0.25rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.project-card-description {
  color: #5a6c7d;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  flex: 1;
}

.project-card-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-tag {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tech-tag.more {
  background: #95a5a6;
}

.project-card-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.project-link.demo {
  background: #3498db;
  color: white;
}

.project-link.demo:hover {
  background: #2980b9;
}

.project-link.github {
  background: #2c3e50;
  color: white;
}

.project-link.github:hover {
  background: #34495e;
}

.project-link.app-store {
  background: #000;
  color: white;
}

.project-link.app-store:hover {
  background: #333;
}

.project-link.google-play {
  background: #3ddc84;
  color: #000;
}

.project-link.google-play:hover {
  background: #2fb872;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 2rem 0;
}

.no-results h3 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.no-results p {
  color: #5a6c7d;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .projects-page {
    padding: 1rem 0.5rem;
  }
  
  .projects-title {
    font-size: 2rem;
  }
  
  .projects-controls {
    padding: 1rem;
  }
  
  .filter-container {
    justify-content: center;
  }
  
  .filter-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .project-card-title {
    font-size: 1.1rem;
  }
  
  .project-card-content {
    padding: 1.25rem;
  }
  
  .project-card-links {
    flex-direction: column;
  }
  
  .project-link {
    justify-content: center;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) and (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1201px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Animation for smooth filtering */
.project-card {
  transition: all 0.3s ease, opacity 0.3s ease;
}

.project-card[style*="display: none"] {
  opacity: 0;
  transform: scale(0.8);
}
</style>