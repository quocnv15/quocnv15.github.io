# Content Management System - Current State

## 📋 Overview

Documentation về cách content (posts, notes, projects) được quản lý trong Jekyll site.

**Last Updated:** 2025-10-15  
**Status:** ✅ Stable  

## 🏗️ Content Architecture

### Content Types

1. **Posts** (`_posts/`)
   - Technical blog posts
   - Organized by category folders
   - Required frontmatter: layout, title, date, categories, tags

2. **Notes** (`_notes/`)
   - Knowledge curation
   - Video notes, article notes, insights
   - Organized by type folders

3. **Projects** (`_projects/`)
   - Portfolio projects
   - Project descriptions and links

### Folder Structure

```
_posts/
  ├── AI/                    # AI & Strategy posts
  ├── iOS/                   # iOS Development posts
  ├── swift/                 # Swift Programming posts
  ├── architecture/          # Architecture & Design posts
  ├── code-quality/          # Code Quality & Concurrency
  ├── coding/                # Data Structures & Algorithms
  └── reflection/            # Best Practices & Reflections

_notes/
  ├── article-notes/         # Notes from articles
  ├── behavioral/            # Behavioral interview prep
  ├── video-notes/           # Notes from videos
  └── [other types]/

_projects/
  └── [project files]

_includes/
  ├── post-card.html         # Reusable post card component
  ├── post-metadata.html     # Metadata calculation logic
  └── category-badge.html    # Category display with icons
```

## 📝 Post Frontmatter Standards

### Required Fields

```yaml
---
layout: post
title: "Post Title"
date: YYYY-MM-DD HH:MM:SS +0700
categories: [Category1, Category2]
tags: [tag1, tag2, tag3]
---
```

### Category Standards

**Primary Categories:**
- `iOS` - iOS Development
- `Swift` - Swift Programming
- `Architecture` - Software Architecture
- `AI` - AI & Machine Learning
- `Strategy` - Coding Strategy
- `Interview` - Interview Preparation
- `Data Structures` - Data Structures & Algorithms
- `Concurrency` - Concurrency & Threading
- `Best Practices` - General Best Practices
- `Coding` - General Coding Topics

**Multi-category Example:**
```yaml
categories: [iOS, Interview]  # iOS interview prep post
categories: [Swift, iOS]      # Swift for iOS
categories: [Architecture, Flutter]  # Flutter architecture
```

### Tag Standards

Tags are more specific than categories:
- Technical terms: `GCD`, `Memory Management`, `MVVM`
- Tools: `Xcode`, `Instruments`, `Testing`
- Concepts: `Clean Architecture`, `SOLID`, `Design Patterns`

## 🔧 Reusable Components

### 1. `post-metadata.html`

**Purpose:** Calculate and provide consistent metadata for posts

**Usage:**
```liquid
{% include post-metadata.html post=post %}
```

**Provides:**
- `calculated_read_time` - Read time in minutes
- `categories_data` - Categories as space-separated string
- `formatted_date` - Human-readable date (e.g., "Oct 15, 2025")
- `formatted_date_sort` - Sortable date (e.g., "20251015")

**Read Time Calculation:**
```
Architecture/Flutter: 20 min
Interview: 15 min
AI/Strategy: 12 min
iOS: 10 min
Data Structures: 8 min
Swift: 6 min
Default: 5 min
Custom: post.read_time (if specified)
```

### 2. `category-badge.html`

**Purpose:** Display category with appropriate icon

**Usage:**
```liquid
{% include category-badge.html post=post %}
```

**Icon Mapping:**
- 🤖 AI
- 💼 Interview
- 🏗️ Architecture
- 📱 iOS
- 💻 Swift
- 🔧 Data Structures
- ⚡ Concurrency
- 📝 Notes

### 3. `post-card.html`

**Purpose:** Reusable post card component with consistent styling

**Usage:**
```liquid
{% include post-card.html post=post %}
```

**Features:**
- Uses post-metadata for consistency
- Uses category-badge for icons
- Includes title, date, read time, excerpt
- Data attributes for filtering

## 🎨 Display Pages

### Home Page (`index.md`)

**Features:**
- Featured posts slider (4 latest)
- Category sections:
  - iOS Development
  - Data Structures & Algorithms
  - Architecture & Design
  - Swift Programming
  - AI & Coding Strategy
  - Interview Preparation
  - Concurrency & Threading
  - Knowledge Curation (Notes)
- Category filter dropdown
- View all link to Archive

**Filtering:**
- Category-based: `post.categories contains 'Category'`
- NO path-based filtering
- JavaScript for interactive filtering

### Archive Page (`archive.md`)

**Features:**
- All posts by year
- Recent posts highlight
- Notes collection section
- Category filter dropdown
- Full metadata display (categories, read time)

**Structure:**
1. Header with description and filter
2. Posts by year (grouped)
3. Recent posts section
4. Notes section

## 📊 Content Metrics

**As of 2025-10-15:**
```
Posts: 23 total
  - iOS: 8 posts
  - Swift: 6 posts
  - Architecture: 3 posts
  - AI: 4 posts
  - Interview: 4 posts
  - Data Structures: 4 posts
  - Concurrency: 2 posts

Notes: 10+ notes
Projects: Multiple

Build time: ~0.67 seconds
Bundle size: <15KB
```

## 🔄 Content Workflow

### Adding a New Post

1. **Create file:**
   ```bash
   touch _posts/[category]/YYYY-MM-DD-title.md
   ```

2. **Add frontmatter:**
   ```yaml
   ---
   layout: post
   title: "Your Title"
   date: 2025-10-15 10:00:00 +0700
   categories: [Primary, Secondary]
   tags: [tag1, tag2]
   ---
   ```

3. **Write content in Markdown**

4. **Build and test:**
   ```bash
   bundle exec jekyll build
   bundle exec jekyll serve
   ```

5. **Verify:**
   - Post appears on Home page in correct category
   - Post appears in Archive
   - Filtering works correctly
   - Read time displays correctly

### Adding a New Category

1. **Update filter dropdowns:**
   - `index.md` - Add option to filter dropdown
   - `archive.md` - Add option to filter dropdown

2. **Add category section (Home only):**
   ```liquid
   <div class="category-section" data-category="newcat">
     <div class="category-header">
       <h2 class="category-title">
         <span class="category-icon">🆕</span>
         New Category
       </h2>
       ...
     </div>
     <div class="posts-grid">
       {% for post in sorted_posts %}
         {% if post.categories contains 'NewCategory' %}
           {% include post-card.html post=post %}
         {% endif %}
       {% endfor %}
     </div>
   </div>
   ```

3. **Update post-metadata.html (if needed custom read time)**

4. **Update category-badge.html (for icon)**

### Modifying Display Logic

**Read time:**
- Edit `_includes/post-metadata.html` only
- Changes apply everywhere automatically

**Category icons:**
- Edit `_includes/category-badge.html` only
- Changes apply everywhere automatically

**Post card styling:**
- Edit `_includes/post-card.html` only
- Changes apply everywhere automatically

## 🎯 Best Practices

### ✅ Do's

- Always add complete frontmatter
- Use category-based filtering
- Use includes for consistency
- Test after adding posts
- Keep categories consistent
- Use meaningful tags

### ❌ Don'ts

- Don't use path-based filtering
- Don't hard-code read times
- Don't duplicate display logic
- Don't skip frontmatter
- Don't create too many categories
- Don't use inconsistent date formats

## 🐛 Troubleshooting

### Post not showing on Home page
- Check frontmatter has correct categories
- Verify category matches section filter
- Check date is not in future
- Build and refresh cache

### Read time incorrect
- Check post has categories in frontmatter
- Verify category name matches logic in post-metadata.html
- Override with `read_time: X` in frontmatter if needed

### Filter not working
- Check data-categories attribute on post card
- Verify JavaScript filter logic
- Check console for errors

### Build errors
- Verify all posts have frontmatter
- Check for syntax errors in Liquid
- Run `bundle exec jekyll build` for details

## 📚 References

- Jekyll Posts: https://jekyllrb.com/docs/posts/
- Jekyll Collections: https://jekyllrb.com/docs/collections/
- Liquid Syntax: https://shopify.github.io/liquid/

## 🔄 Update History

- **2025-10-15:** Initial documentation
- **2025-10-15:** Added post sync implementation
- **2025-10-15:** Added reusable components
