---
layout: page
title: Archive
hide_title: true
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
        <option value="iOS">iOS</option>
        <option value="Swift">Swift</option>
        <option value="Architecture">Architecture</option>
        <option value="AI">AI & Strategy</option>
        <option value="Interview">Interview</option>
        <option value="Data Structures">Data Structures</option>
        <option value="Concurrency">Concurrency</option>
        <option value="notes">Notes</option>
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
