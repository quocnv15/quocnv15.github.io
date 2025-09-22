---
layout: page
title: Archive
---

## Blog Archive

Welcome to the blog archive! Here you'll find all my posts organized chronologically. Feel free to explore and discover content that interests you.

{% if site.posts.size > 0 %}
  <div class="archive-section">
    <h3>All Posts <span class="post-count">({{ site.posts.size }} posts)</span></h3>
    <ul class="archive-list">
      {% for post in site.posts reversed %}
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
  margin-bottom: 2rem;
}

.archive-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.post-count {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: normal;
}

.archive-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.archive-list li {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #ecf0f1;
}

.archive-list li:last-child {
  border-bottom: none;
}

.post-date {
  color: #7f8c8d;
  font-size: 0.875rem;
  min-width: 100px;
  margin-right: 1rem;
}

.archive-list a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
}

.archive-list a:hover {
  color: #3498db;
  text-decoration: underline;
}
</style>
