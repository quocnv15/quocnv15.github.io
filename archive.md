---
layout: page
title: Archive
---

## Blog Archive

Welcome to the blog archive! Here you'll find all my posts organized chronologically with the newest posts first. Feel free to explore and discover content that interests you.

{% if site.posts.size > 0 %}
  {% assign sorted_posts = site.posts | sort: 'date' | reverse %}
  
  <!-- Posts by Year -->
  <div class="archive-section">
    <h3>All Posts <span class="post-count">({{ site.posts.size }} posts)</span></h3>
    
    {% assign current_year = '' %}
    {% for post in sorted_posts %}
      {% assign post_year = post.date | date: "%Y" %}
      
      {% if post_year != current_year %}
        {% unless current_year == '' %}
          </ul>
        {% endunless %}
        
        <h4 class="year-header">{{ post_year }}</h4>
        <ul class="archive-list">
        {% assign current_year = post_year %}
      {% endif %}
      
      <li>
        <span class="post-date">{{ post.date | date: "%b %-d" }}</span>
        <a href="{{ post.url | relative_url }}">{{ post.title | default: post.path }}</a>
      </li>
    {% endfor %}
    
    </ul>
  </div>
  
  <!-- Recent Posts -->
  <div class="archive-section">
    <h3>Recent Posts</h3>
    <ul class="archive-list recent-posts">
      {% for post in sorted_posts limit: 5 %}
        <li>
          <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
          <a href="{{ post.url | relative_url }}">{{ post.title | default: post.path }}</a>
        </li>
      {% endfor %}
    </ul>
  </div>
{% else %}
  <p>No posts found. Check back soon for new content!</p>
{% endif %}

<style>
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

.archive-list li {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #ecf0f1;
  transition: all 0.3s ease;
}

.archive-list li:hover {
  background: #f8f9fa;
  margin: 0 -1rem;
  padding: 1rem;
  border-radius: 8px;
}

.archive-list li:last-child {
  border-bottom: none;
}

.post-date {
  color: #7f8c8d;
  font-size: 0.875rem;
  min-width: 80px;
  margin-right: 1rem;
  font-weight: 500;
}

.archive-list a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  flex: 1;
  transition: color 0.3s ease;
}

.archive-list a:hover {
  color: #3498db;
}

.recent-posts {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.recent-posts li {
  border-left: 3px solid #3498db;
}

/* Responsive design */
@media (max-width: 768px) {
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
  
  .archive-list li {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-date {
    min-width: auto;
    margin-right: 0;
  }
}
</style>
