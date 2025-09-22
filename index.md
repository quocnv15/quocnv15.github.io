---
layout: page
title: Home
---

## A Blog by QuocNV

Hello and welcome to my blog! This space is dedicated to sharing valuable knowledge about iOS development and helping you prepare for interviews in the tech industry. Whether you're a seasoned developer or just starting out, you'll find a wealth of resources here to enhance your skills and boost your career.

### What You'll Find Here:
- **iOS Development Tips**: From Swift programming to UIKit and SwiftUI, we cover a wide range of topics to help you master iOS development.
- **Project Tutorials**: Step-by-step guides on building real-world iOS applications, with code snippets and explanations.
- **Interview Preparation**: Insights into common interview questions, coding challenges, and strategies to excel in technical interviews.
- **Career Advice**: Tips on building a strong resume, networking, and navigating the job market in the tech industry.
- **Community Support**: Engage with fellow developers, share your experiences, and learn from others in our interactive community.

### Why Follow This Blog?
My goal is to provide practical, up-to-date content that empowers you to become a proficient iOS developer and succeed in your career. With a focus on real-world applications and best practices, this blog is your go-to resource for continuous learning and professional growth.

Stay tuned for regular updates, tutorials, and insights. Happy coding!

---

### **Recent Posts**

{% for post in site.posts limit:5 %}
<div class="recent-post">
  <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
  <p class="post-meta">{{ post.date | date: "%b %-d, %Y" }}{% if post.tags %} • Tags: {{ post.tags | join: ", " }}{% endif %}</p>
  {% if post.excerpt %}
    <p>{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
  {% endif %}
</div>
{% endfor %}

<div class="all-posts-link">
  <a href="{{ 'archive.html' | relative_url }}">View all posts →</a>
</div>

