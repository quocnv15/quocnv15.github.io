---
layout: page
title: Archive
---

## Blog Archive

Welcome to the blog archive! Here you'll find all my posts organized by tags. Feel free to explore and discover content that interests you.

{% if site.tags.size > 0 %}
  {% for tag in site.tags %}
    <h3>{{ tag[0] }} <span class="tag-count">({{ tag[1].size }} posts)</span></h3>
    <ul class="archive-list">
      {% for post in tag[1] %}
        <li>
          <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
          <a href="{{ post.url }}">{{ post.title }}</a>
        </li>
      {% endfor %}
    </ul>
  {% endfor %}
{% else %}
  <p>No posts found. Check back soon for new content!</p>
{% endif %}
