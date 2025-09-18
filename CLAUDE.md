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

### Customizations
- CSS overrides in `css/override.css`
- Custom social media sharing links
- Enhanced post navigation system
- Archive page organized by tags

## Deployment
- Built automatically via GitHub Pages
- No additional deployment commands needed
- Push to main branch triggers automatic build and deployment