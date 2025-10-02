# Templates Directory

This directory contains templates for creating different types of content on the blog.

## Available Templates

### 📝 Blog Posts
- **`blog-post-template.md`** - Standard template for technical blog posts
  - Use for: Original content, tutorials, technical guides
  - Layout: `post`
  - Location: `_posts/[category]/`

### 📚 Knowledge Curation Notes
- **`video-note-template.md`** - Template for video content notes
  - Use for: YouTube videos, podcasts, online lectures
  - Layout: `note`
  - Location: `_notes/video-notes/`

- **`book-note-template.md`** - Template for book summaries and notes
  - Use for: Non-fiction books, technical books, self-help books
  - Layout: `note`
  - Location: `_notes/book-notes/`

- **`article-note-template.md`** - Template for article analysis
  - Use for: Blog posts, research papers, news articles
  - Layout: `note`
  - Location: `_notes/article-notes/`

## How to Use Templates

### 1. Choose the Right Template
- **Original content** → `blog-post-template.md`
- **Video content** → `video-note-template.md`
- **Books** → `book-note-template.md`
- **Articles/Papers** → `article-note-template.md`

### 2. Copy and Customize
```bash
# For blog post
cp templates/blog-post-template.md "_posts/[category]/$(date +%Y-%m-%d)-your-title.md"

# For notes
cp templates/[note-type]-template.md "_notes/[note-type]/$(date +%Y-%m-%d)-your-title.md"
```

### 3. Update Front Matter
- Update `title`, `date`, `tags`
- Ensure correct `layout` (post vs note)
- Add appropriate `categories` for blog posts

### 4. Replace Placeholder Content
- Remove bracketed placeholders: `[Your content here]`
- Add your actual content
- Update links and references
- Remove unused sections

### 5. Final Checks
- Test local build: `bundle exec jekyll serve`
- Check for formatting issues
- Verify all links work
- Proofread for typos

## Quick Reference

### Front Matter Comparison

**Blog Post:**
```yaml
---
layout: post
title: "Title"
date: YYYY-MM-DD HH:MM:SS +0700
tags: [tag1, tag2]
categories: [Category]
---
```

**Note:**
```yaml
---
layout: note
title: "Title"
date: YYYY-MM-DD HH:MM:SS +0700
tags: [tag1, tag2]
---
```

### Directory Mapping

| Content Type | Template | Target Directory |
|--------------|----------|------------------|
| Technical Tutorial | `blog-post-template.md` | `_posts/[category]/` |
| Personal Insight | `blog-post-template.md` | `_posts/reflection/` |
| Video Summary | `video-note-template.md` | `_notes/video-notes/` |
| Book Summary | `book-note-template.md` | `_notes/book-notes/` |
| Article Analysis | `article-note-template.md` | `_notes/article-notes/` |

## Customization Tips

### For Technical Posts
- Add code blocks with syntax highlighting
- Include implementation examples
- Add step-by-step tutorials

### For Personal Notes
- Focus on actionable insights
- Include personal reflections
- Add "How I'll apply this" sections

### For Research/Academic Content
- Include citations and references
- Add critical analysis sections
- Note methodology and limitations

---

*Templates maintained by: NGUYEN VAN QUOC*
*Last Updated: 2025-10-02*