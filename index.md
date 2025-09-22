---
layout: page
title: Home
---

<div class="posts-homepage">
  <div class="page-header">
    <h1 class="page-title">Technical Articles & Insights</h1>
    <p class="page-description">Explore my collection of iOS development articles, architecture patterns, and programming best practices</p>
  </div>

  <!-- iOS Development Articles -->
  <div class="category-section">
    <div class="category-header">
      <h2 class="category-title">
        <span class="category-icon">📱</span>
        iOS Development
      </h2>
      <span class="post-count">3 articles</span>
    </div>
    
    <div class="posts-grid">
      {% for post in site.posts %}
        {% if post.path contains 'GCD' or post.path contains 'memory-leak' or post.path contains 'testing' %}
      <article class="post-card">
        <div class="post-content">
          <h3 class="post-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>
          <div class="post-meta">
            <time class="post-date">{{ post.date | date: "%b %-d, %Y" }}</time>
            <span class="post-read-time">5 min read</span>
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

  <!-- Data Structures & Algorithms -->
  <div class="category-section">
    <div class="category-header">
      <h2 class="category-title">
        <span class="category-icon">🔧</span>
        Data Structures & Algorithms
      </h2>
      <span class="post-count">4 articles</span>
    </div>
    
    <div class="posts-grid">
      {% for post in site.posts %}
        {% if post.path contains 'data-structure' %}
      <article class="post-card">
        <div class="post-content">
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

  <!-- Architecture & Design -->
  <div class="category-section">
    <div class="category-header">
      <h2 class="category-title">
        <span class="category-icon">🏗️</span>
        Architecture & Design
      </h2>
      <span class="post-count">3 articles</span>
    </div>
    
    <div class="posts-grid">
      {% for post in site.posts %}
        {% if post.path contains 'Architecture' or post.path contains 'layers' or post.path contains 'technical-design' %}
      <article class="post-card">
        <div class="post-content">
          <h3 class="post-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>
          <div class="post-meta">
            <time class="post-date">{{ post.date | date: "%b %-d, %Y" }}</time>
            <span class="post-read-time">10 min read</span>
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

  <!-- Swift Programming -->
  <div class="category-section">
    <div class="category-header">
      <h2 class="category-title">
        <span class="category-icon">💻</span>
        Swift Programming
      </h2>
      <span class="post-count">2 articles</span>
    </div>
    
    <div class="posts-grid">
      {% for post in site.posts %}
        {% if post.path contains 'map' %}
      <article class="post-card">
        <div class="post-content">
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

  <!-- All Posts Link -->
  <div class="view-all-section">
    <a href="/archive.html" class="view-all-btn">View All Articles →</a>
  </div>
</div>

