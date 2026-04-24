# Phase 04: Layout Refactoring & Integration

## Context Links
- Research: [researcher-js-layout-report.md](research/researcher-js-layout-report.md)
- Parent: [plan.md](plan.md)
- Depends on: Phase 01, Phase 02, Phase 03

## Parallelization Info
- **Can run with**: None (integration phase)
- **Must wait for**: Phase 01 (variables), Phase 02 (components), Phase 03 (modules)
- **Blocking**: Phase 05, Phase 06

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 (critical) |
| Status | pending |
| Effort | 4 hours |
| Files | 5 modify |

## Key Insights from Research
From `researcher-js-layout-report.md`:
- Inline scripts need module references
- CSS classes from Phase 02 need to be applied
- Layout structure should be semantic HTML5

## Requirements
1. Apply CSS component classes to all layouts
2. Add module script references
3. Ensure semantic HTML structure
4. Verify responsive classes
5. Test all layout variations

## Architecture
```
_layouts/
├── default.html       # Add CSS links, structure
├── post.html          # Apply component classes
├── page.html          # Apply component classes
├── project.html       # Clean (inline CSS removed in Phase 02)
└── note.html          # Clean (inline CSS removed in Phase 02)

_includes/
├── header.html        # Apply navigation classes
├── header-nav.html    # Add navigation.js import
├── footer.html        # Apply footer classes
└── search.html        # Apply form classes
```

## Related Code Files

### Files to MODIFY
| File | Changes | Dependencies |
|------|---------|--------------|
| `_layouts/default.html` | Add CSS links, structure | Phase 01, 02 |
| `_layouts/post.html` | Apply component classes | Phase 02 |
| `_layouts/page.html` | Apply component classes | Phase 02 |
| `_includes/header-nav.html` | Add navigation.js import | Phase 03 |
| `_includes/search.html` | Apply form classes | Phase 02 |

### Files to CREATE
None

### Files to DELETE
None

## File Ownership (Exclusive)
- **_layouts/default.html** (CSS links, structure only)
- **_layouts/post.html** (class application only)
- **_layouts/page.html** (class application only)
- **_includes/header-nav.html** (script import only - JS extracted in Phase 03)
- **_includes/search.html** (class application only)

**Note:** `_layouts/project.html` and `_layouts/note.html` were cleaned in Phase 02.

## Implementation Steps

### 1. Update _layouts/default.html
```html
---
layout: compress
---
<!DOCTYPE html>
<html lang="{{ site.lang | default: 'en' }}">
<head>
  {% include head.html %}
  <!-- CSS from Phase 01, 02 -->
  <link rel="stylesheet" href="/css/variables.css">
  <link rel="stylesheet" href="/css/base/reset.css">
  <link rel="stylesheet" href="/css/base/typography.css">
  <link rel="stylesheet" href="/css/components/buttons.css">
  <link rel="stylesheet" href="/css/components/cards.css">
  <link rel="stylesheet" href="/css/components/navigation.css">
  <link rel="stylesheet" href="/css/components/forms.css">
  <link rel="stylesheet" href="/css/components/layout.css">
  <link rel="stylesheet" href="/css/utilities/spacing.css">
</head>
<body class="layout">
  {% include header.html %}
  <main class="layout__main">{{ content }}</main>
  {% include footer.html %}
  <!-- JS from Phase 03 -->
  {% if page.layout == 'home' %}
  <script type="module" src="/assets/js/search.js"></script>
  <script type="module" src="/assets/js/filter.js"></script>
  {% endif %}
</body>
</html>
```

### 2. Apply component classes to layouts
- **post.html**: Add `.card`, `.card__content` classes
- **page.html**: Add `.layout__container` classes
- **search.html**: Add `.form__group`, `.input` classes

### 3. Verify semantic structure
- Use `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`
- Ensure proper heading hierarchy (h1-h6)
- Add ARIA landmarks where needed

### 4. Test responsive behavior
- Verify mobile menu works
- Test breakpoints (sm: 640px, md: 768px, lg: 1024px)
- Check container widths

## Todo List
- [ ] Update default.html with CSS links
- [ ] Update default.html with conditional JS imports
- [ ] Apply component classes to post.html
- [ ] Apply component classes to page.html
- [ ] Apply component classes to search.html
- [ ] Verify semantic HTML structure
- [ ] Test responsive breakpoints
- [ ] Test mobile navigation
- [ ] Visual regression test

## Success Criteria
- All layouts use component classes
- CSS variables applied consistently
- Module scripts load correctly
- Semantic HTML5 structure
- No inline styles remaining
- Responsive at all breakpoints

## Conflict Prevention
- Only applies classes (does not define CSS)
- Only adds script imports (does not write JS)
- Integrates outputs from Phases 01-03

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Missing classes on layouts | Audit all layout files |
| Script load order issues | Verify module dependencies |
| Visual regressions | Screenshot comparison |

## Security Considerations
- Ensure CSP headers allow module scripts
- Verify no eval() or unsafe patterns

## Next Steps
- Phase 05 audits accessibility
- Phase 06 optimizes performance
