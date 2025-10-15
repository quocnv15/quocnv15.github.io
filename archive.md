---
layout: page
title: Archive
---

<div class="archive-page">
  <div class="archive-header">
    <h1>Blog Archive</h1>
    <p>Welcome to the blog archive! Here you'll find all my posts organized chronologically with the newest posts first. Feel free to explore and discover content that interests you.</p>
    
    <!-- Simple Category Filter -->
    <div class="category-filter">
      <label for="archiveFilter">Filter by category:</label>
      <select id="archiveFilter" class="filter-dropdown">
        <option value="all">All Categories</option>
        <option value="iOS">📱 iOS</option>
        <option value="Swift">💻 Swift</option>
        <option value="Architecture">🏗️ Architecture</option>
        <option value="AI">🤖 AI & Strategy</option>
        <option value="Interview">💼 Interview</option>
        <option value="Data Structures">🔧 Data Structures</option>
        <option value="Concurrency">⚡ Concurrency</option>
        <option value="notes">📝 Notes</option>
      </select>
    </div>
  </div>

  {% if site.posts.size > 0 %}
    {% assign sorted_posts = site.posts | sort: 'date' | reverse %}
    
    <!-- Posts by Year with Enhanced Details -->
    <div class="archive-section posts-section">
      <h3>All Posts <span class="post-count">({{ site.posts.size }} posts)</span></h3>
      
      {% assign current_year = '' %}
      {% for post in sorted_posts %}
        {% assign post_year = post.date | date: "%Y" %}
        {% assign post_date = post.date | date: "%b %-d, %Y" %}
        {% assign categories_str = post.categories | join: ' ' | downcase %}
        
        {% comment %} Calculate read time {% endcomment %}
        {% assign read_time = 5 %}
        {% if post.read_time %}
          {% assign read_time = post.read_time %}
        {% elsif post.categories contains 'Architecture' %}
          {% assign read_time = 20 %}
        {% elsif post.categories contains 'Interview' %}
          {% assign read_time = 15 %}
        {% elsif post.categories contains 'AI' %}
          {% assign read_time = 12 %}
        {% elsif post.categories contains 'iOS' %}
          {% assign read_time = 10 %}
        {% elsif post.categories contains 'Data Structures' %}
          {% assign read_time = 8 %}
        {% elsif post.categories contains 'Swift' %}
          {% assign read_time = 6 %}
        {% endif %}
        
        {% if post_year != current_year %}
          {% unless current_year == '' %}
            </ul>
          {% endunless %}
          
          <h4 class="year-header">{{ post_year }}</h4>
          <ul class="archive-list">
          {% assign current_year = post_year %}
        {% endif %}
        
        <li class="archive-item" data-categories="{{ categories_str }}">
          <div class="archive-item-header">
            <span class="post-date">{{ post_date }}</span>
            <div class="post-categories">
              {% include category-badge.html post=post %}
            </div>
          </div>
          <div class="archive-item-content">
            <a href="{{ post.url | relative_url }}" class="post-title-link">{{ post.title | default: post.path }}</a>
            <span class="post-read-time">· {{ read_time }} min read</span>
          </div>
        </li>
      {% endfor %}
      
      </ul>
    </div>
    
    <!-- Recent Posts Highlight -->
    <div class="archive-section recent-section">
      <h3>Recent Posts</h3>
      <ul class="archive-list recent-posts">
        {% for post in sorted_posts limit: 5 %}
          {% assign post_date = post.date | date: "%b %-d, %Y" %}
          {% assign categories_str = post.categories | join: ' ' | downcase %}
          
          {% comment %} Calculate read time {% endcomment %}
          {% assign read_time = 5 %}
          {% if post.read_time %}
            {% assign read_time = post.read_time %}
          {% elsif post.categories contains 'Architecture' %}
            {% assign read_time = 20 %}
          {% elsif post.categories contains 'Interview' %}
            {% assign read_time = 15 %}
          {% elsif post.categories contains 'AI' %}
            {% assign read_time = 12 %}
          {% elsif post.categories contains 'iOS' %}
            {% assign read_time = 10 %}
          {% elsif post.categories contains 'Data Structures' %}
            {% assign read_time = 8 %}
          {% elsif post.categories contains 'Swift' %}
            {% assign read_time = 6 %}
          {% endif %}
          
          <li class="archive-item" data-categories="{{ categories_str }}">
            <div class="archive-item-header">
              <span class="post-date">{{ post_date }}</span>
              <div class="post-categories">
                {% include category-badge.html post=post %}
              </div>
            </div>
            <div class="archive-item-content">
              <a href="{{ post.url | relative_url }}" class="post-title-link">{{ post.title | default: post.path }}</a>
              <span class="post-read-time">· {{ read_time }} min read</span>
            </div>
          </li>
        {% endfor %}
      </ul>
    </div>
  {% else %}
    <p>No posts found. Check back soon for new content!</p>
  {% endif %}

  <!-- Notes Collection -->
  {% if site.notes.size > 0 %}
    <div class="archive-section notes-section">
      <h3>Knowledge Curation <span class="post-count">({{ site.notes.size }} notes)</span></h3>
      
      <ul class="archive-list notes-list">
        {% assign sorted_notes = site.notes | sort: 'date' | reverse %}
        {% for note in sorted_notes %}
          {% assign note_date = note.date | date: "%b %-d, %Y" %}
          {% assign read_time = 5 %}
          
          <li class="archive-item" data-categories="notes">
            <div class="archive-item-header">
              <span class="post-date">{{ note_date }}</span>
              <div class="post-categories">
                <span class="post-tag">📝 Notes</span>
              </div>
            </div>
            <div class="archive-item-content">
              <a href="{{ note.url | relative_url }}" class="post-title-link">{{ note.title }}</a>
              <span class="post-read-time">· {{ read_time }} min read</span>
            </div>
          </li>
        {% endfor %}
      </ul>
    </div>
  {% endif %}
</div>

<style>
.archive-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.archive-header {
  margin-bottom: 3rem;
  text-align: center;
}

.archive-header h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.archive-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.category-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.category-filter label {
  font-weight: 600;
  color: #2c3e50;
}

.filter-dropdown {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid #e8e8e8;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-dropdown:hover,
.filter-dropdown:focus {
  border-color: #3498db;
  outline: none;
}

.archive-section {
  margin-bottom: 3rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e8e8e8;
}

.archive-section h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.year-header {
  color: #3498db;
  margin: 2rem 0 1rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.post-count {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: normal;
  background: #f8f9fa;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.archive-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.archive-item {
  padding: 1.25rem 0;
  border-bottom: 1px solid #ecf0f1;
  transition: all 0.3s ease;
}

.archive-item:hover {
  background: #f8f9fa;
  margin: 0 -1rem;
  padding: 1.25rem 1rem;
  border-radius: 8px;
}

.archive-item:last-child {
  border-bottom: none;
}

.archive-item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.post-date {
  color: #7f8c8d;
  font-size: 0.875rem;
  min-width: 100px;
  font-weight: 500;
}

.post-categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.archive-item-content {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-title-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.05rem;
  flex: 1;
  transition: color 0.3s ease;
}

.post-title-link:hover {
  color: #3498db;
}

.post-read-time {
  color: #95a5a6;
  font-size: 0.875rem;
  white-space: nowrap;
}

.recent-posts {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.recent-posts .archive-item {
  border-left: 3px solid #3498db;
  padding-left: 1rem;
}

.notes-list {
  background: linear-gradient(135deg, #fff9e6, #ffeaa7);
}

.notes-list .archive-item {
  border-left: 3px solid #fdcb6e;
  padding-left: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .archive-header h1 {
    font-size: 2rem;
  }
  
  .archive-section {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .archive-section h3 {
    font-size: 1.3rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .year-header {
    font-size: 1.1rem;
  }
  
  .archive-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-date {
    min-width: auto;
  }
  
  .archive-item-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .category-filter {
    flex-direction: column;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const filterDropdown = document.getElementById('archiveFilter');
  const archiveItems = document.querySelectorAll('.archive-item');
  
  if (filterDropdown) {
    filterDropdown.addEventListener('change', function() {
      const selectedCategory = this.value.toLowerCase();
      
      archiveItems.forEach(item => {
        const itemCategories = item.getAttribute('data-categories') || '';
        
        if (selectedCategory === 'all' || itemCategories.toLowerCase().includes(selectedCategory)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});
</script>
