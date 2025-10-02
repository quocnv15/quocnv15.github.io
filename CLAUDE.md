# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Jekyll-based static blog** focused on iOS development and technical content. It uses GitHub Pages for hosting and the Minima theme for styling.

## Development Commands

### Local Development
```bash
# Install Jekyll and dependencies
bundle install

# Build the site
bundle exec jekyll build

# Serve locally (default: http://localhost:4000)
bundle exec jekyll serve

# Serve with draft posts
bundle exec jekyll serve --drafts

# Watch for changes and rebuild automatically
bundle exec jekyll serve --livereload
```

### Testing
```bash
# Check for build errors
bundle exec jekyll build --verbose

# Validate site configuration
bundle exec jekyll doctor
```

## Architecture

### Directory Structure
- `_posts/`: Blog posts with Jekyll front matter (YYYY-MM-DD-title.md format)
- `_layouts/`: Custom HTML layouts (extends Minima theme)
- `_includes/`: Reusable HTML components (head, navlinks, sharelinks)
- `css/`: Custom CSS overrides
- `js/`: Custom JavaScript files
- `_config.yml`: Jekyll configuration

### Key Components
- **Post Layout** (`_layouts/post.html`): Custom post layout with share links and navigation
- **Archive Page** (`archive.md`): Tag-based blog archive using Jekyll collections
- **Share Links** (`_includes/sharelinks.html`): Social media sharing functionality
- **Navigation** (`_includes/navlinks.html`): Post navigation links

### Content Structure
- Posts use Jekyll front matter with layout, title, and tags
- Default tag: "Other" (configurable in `_config.yml`)
- Date format: "%b %-d, %Y" (configurable)
- Supports syntax highlighting (disabled in current config)

### Two Content Types:
1. **Blog Posts** (`_posts/`): Technical articles, tutorials, original content
2. **Knowledge Curation** (`_notes/`): Curated content, notes, insights from external sources

### Blog Posts Organization
- Organized in category directories: AI/, architecture/, iOS/, swift/, etc.
- Use `layout: post` in front matter
- URLs: `/YYYY/MM/DD/title/`

### Knowledge Curation System
- **Collection**: Uses Jekyll collection `notes` (configured in `_config.yml`)
- **Structure**: `_notes/[type]/YYYY-MM-DD-title.md`
- **Types**: article-notes, book-notes, video-notes, case-study, insights, curation, notes
- Use `layout: note` in front matter
- URLs: `/notes/[type]/title/`

### Customizations
- CSS overrides in `css/override.css`
- Custom social media sharing links
- Enhanced post navigation system
- Archive page organized by tags

## Content Creation Guidelines

### Naming Conventions
- **Format**: `YYYY-MM-DD-title-in-kebab-case.md`
- **Language**: Use English tags for system consistency
- **Front Matter**: Always include proper layout, title, date, and tags

### Tag System (English Only)
**Technical Categories:**
- `ai`, `architecture`, `swift`, `ios`, `flutter`, `testing`
- `code-quality`, `performance`, `design-patterns`, `solid`

**Personal Development:**
- `critical-thinking`, `mental-models`, `emotional-intelligence`
- `productivity`, `systems`, `personal-development`

**Content Types:**
- `education`, `learning`, `career`, `interview`

### File Organization Rules
1. **Blog Posts** → `_posts/[category]/`
2. **Notes** → `_notes/[note-type]/`
3. **Layout** → `layout: post` (blog), `layout: note` (notes)
4. **Categories** → Match directory names
5. **Tags** → 3-5 relevant English tags

### Home Page Integration
- Blog posts appear in relevant category sections
- Notes appear in "Knowledge Curation" section
- Filter dropdown includes all categories
- Automatic post count updates

## Deployment
- Built automatically via GitHub Pages
- No additional deployment commands needed
- Push to main branch triggers automatic build and deployment

## Documentation
- **POST_CREATION_GUIDE.md**: Complete guide for creating new content
- **Templates**: Available for different content types
- **Examples**: Check existing posts for reference