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
  max-width: 1600px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.projects-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 2rem 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.projects-title {
  font-size: 2.8rem;
  color: #2c3e50;
  margin: 0 0 0.8rem 0;
  font-weight: 800;
  background: linear-gradient(135deg, #3498db, #2980b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.projects-subtitle {
  font-size: 1.2rem;
  color: #5a6c7d;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

/* Controls Section */
.projects-controls {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  backdrop-filter: blur(10px);
}

.search-container {
  margin-bottom: 1.8rem;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  background: white;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.8rem;
  justify-content: center;
}

.filter-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid #e8e8e8;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.filter-btn:hover {
  border-color: #3498db;
  color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.filter-btn.active {
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-color: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  justify-content: center;
}

.sort-select {
  padding: 0.8rem 1.2rem;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.sort-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.results-info {
  text-align: center;
  margin-bottom: 2rem;
  color: #5a6c7d;
  font-size: 1rem;
  font-weight: 500;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.project-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  position: relative;
}

.project-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 48px rgba(52, 152, 219, 0.2);
  border-color: #3498db;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.project-card:hover::before {
  transform: scaleX(1);
}

.project-card-image {
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  position: relative;
}

.project-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.project-card:hover .project-card-image img {
  transform: scale(1.1) rotate(1deg);
}

.project-card-placeholder {
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3.5rem;
  position: relative;
  overflow: hidden;
}

.project-card-placeholder::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.project-card-content {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.project-card-header {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.project-card-title {
  margin: 0;
  font-size: 1.4rem;
  color: #2c3e50;
  font-weight: 700;
  line-height: 1.3;
}

.project-card-title a {
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  position: relative;
}

.project-card-title a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  transition: width 0.3s ease;
}

.project-card-title a:hover {
  color: #3498db;
}

.project-card-title a:hover::after {
  width: 100%;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}

.project-status {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-completed {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-maintenance {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7);
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-in-progress {
  background: linear-gradient(135deg, #cce7ff, #b8daff);
  color: #004085;
  border: 1px solid #b8daff;
}

.project-category {
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1976d2;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid #bbdefb;
}

.project-card-description {
  color: #5a6c7d;
  line-height: 1.7;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  flex: 1;
  text-align: left;
}

.project-card-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #2980b9;
  transition: all 0.3s ease;
}

.tech-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.tech-tag.more {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
  border: 1px solid #7f8c8d;
}

.project-card-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.5rem;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.project-link:hover::before {
  left: 100%;
}

.project-link.demo {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: 1px solid #2980b9;
}

.project-link.demo:hover {
  background: linear-gradient(135deg, #2980b9, #21618c);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.project-link.github {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  border: 1px solid #34495e;
}

.project-link.github:hover {
  background: linear-gradient(135deg, #34495e, #2c3e50);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 73, 94, 0.4);
}

.project-link.app-store {
  background: linear-gradient(135deg, #000, #333);
  color: white;
  border: 1px solid #333;
}

.project-link.app-store:hover {
  background: linear-gradient(135deg, #333, #000);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.project-link.google-play {
  background: linear-gradient(135deg, #3ddc84, #2fb872);
  color: #000;
  border: 1px solid #2fb872;
}

.project-link.google-play:hover {
  background: linear-gradient(135deg, #2fb872, #26a65b);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(45, 184, 114, 0.4);
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  margin: 2rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
}

.no-results h3 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.no-results p {
  color: #5a6c7d;
  margin: 0;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .projects-page {
    padding: 1rem 0.5rem;
  }
  
  .projects-header {
    padding: 1.5rem 1rem;
    margin-bottom: 2rem;
  }
  
  .projects-title {
    font-size: 2.2rem;
  }
  
  .projects-subtitle {
    font-size: 1.1rem;
  }
  
  .projects-controls {
    padding: 1.5rem;
  }
  
  .filter-container {
    justify-content: center;
    gap: 0.4rem;
  }
  
  .filter-btn {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .project-card-content {
    padding: 1.5rem;
  }
  
  .project-card-title {
    font-size: 1.2rem;
  }
  
  .project-card-description {
    font-size: 0.95rem;
  }
  
  .project-card-links {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .project-link {
    justify-content: center;
    padding: 0.7rem 1.2rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1025px) and (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1201px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Animation for smooth filtering */
.project-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
}

.project-card[style*="display: none"] {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

/* Loading animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card {
  animation: fadeInUp 0.6s ease forwards;
}

.project-card:nth-child(1) { animation-delay: 0.1s; }
.project-card:nth-child(2) { animation-delay: 0.2s; }
.project-card:nth-child(3) { animation-delay: 0.3s; }
.project-card:nth-child(4) { animation-delay: 0.4s; }
.project-card:nth-child(5) { animation-delay: 0.5s; }
.project-card:nth-child(6) { animation-delay: 0.6s; }

/* Large Screen Optimization (1400px and above) */
@media (min-width: 1400px) {
  .projects-page {
    max-width: 1800px;
    padding: 4rem 3rem;
  }
  
  .projects-title {
    font-size: 3.2rem;
  }
  
  .projects-subtitle {
    font-size: 1.3rem;
  }
  
  .projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
    gap: 3.5rem;
  }
  
  .projects-controls {
    padding: 2.5rem;
  }
  
  .project-card-content {
    padding: 2.5rem;
  }
  
  .project-card-title {
    font-size: 1.5rem;
  }
  
  .project-card-description {
    font-size: 1.1rem;
    line-height: 1.7;
  }
}

/* Ultra-Wide Screen Optimization (1920px and above) */
@media (min-width: 1920px) {
  .projects-page {
    max-width: 2000px;
    padding: 5rem 4rem;
  }
  
  .projects-title {
    font-size: 3.5rem;
  }
  
  .projects-subtitle {
    font-size: 1.4rem;
  }
  
  .projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 4rem;
  }
  
  .projects-controls {
    padding: 3rem;
  }
  
  .project-card-content {
    padding: 3rem;
  }
  
  .project-card-title {
    font-size: 1.6rem;
  }
  
  .project-card-description {
    font-size: 1.2rem;
    line-height: 1.8;
  }
}

/* Super Ultra-Wide Screen Optimization (2560px and above) */
@media (min-width: 2560px) {
  .projects-page {
    max-width: 2400px;
    padding: 6rem 5rem;
  }
  
  .projects-title {
    font-size: 4rem;
  }
  
  .projects-subtitle {
    font-size: 1.5rem;
  }
  
  .projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
    gap: 4.5rem;
  }
  
  .projects-controls {
    padding: 3.5rem;
  }
  
  .project-card-content {
    padding: 3.5rem;
  }
  
  .project-card-title {
    font-size: 1.7rem;
  }
  
  .project-card-description {
    font-size: 1.3rem;
    line-height: 1.9;
  }
}
</style>