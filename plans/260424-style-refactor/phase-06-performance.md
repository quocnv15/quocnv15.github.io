# Phase 06: Performance Optimization

## Context Links
- Research: [researcher-js-layout-report.md](research/researcher-js-layout-report.md) (lazy loading)
- Parent: [plan.md](plan.md)
- Depends on: Phase 04 (integrated code)

## Parallelization Info
- **Can run with**: Phase 05 (after Phase 04)
- **Must wait for**: Phase 04 (needs integrated codebase)
- **Blocking**: None (final phase)

## Overview
| Field | Value |
|-------|-------|
| Priority | P2 (important) |
| Status | pending |
| Effort | 1 hour |
| Files | 4 modify |

## Key Insights from Research
From `researcher-js-layout-report.md`:
- "Opportunity for lazy loading for non-critical modules"
- Module extraction enables code splitting

## Requirements
1. Achieve Lighthouse score >90
2. Implement lazy loading for non-critical JS
3. Optimize CSS delivery
4. Minimize render-blocking resources
5. Enable compression

## Architecture
```
Performance optimizations:
- CSS: Critical CSS inline, defer non-critical
- JS: Lazy load search/filter modules
- Images: Lazy loading attributes
- Fonts: Display swap strategy
```

## Related Code Files

### Files to MODIFY
| File | Changes |
|------|---------|
| `_layouts/default.html` | Defer CSS, lazy load JS |
| `_includes/head.html` | Preconnect, preload hints |
| `assets/js/navigation.js` | Eager load (critical) |
| `assets/js/search.js` | Lazy load (non-critical) |

### Files to CREATE
None

### Files to DELETE
None

## File Ownership (Exclusive)
- **Performance attributes in templates** (owned by Phase 06)
- **Lazy loading logic** (owned by Phase 06)

## Implementation Steps

### 1. Optimize CSS loading
```html
<!-- _layouts/default.html -->
<!-- Critical CSS inline -->
<style>
  /* Above-fold styles only */
</style>
<!-- Defer non-critical CSS -->
<link rel="preload" href="/css/components/layout.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/components/layout.css"></noscript>
```

### 2. Lazy load JavaScript
```html
<!-- _layouts/default.html -->
<!-- Critical: load immediately -->
<script type="module" src="/assets/js/navigation.js"></script>
<!-- Non-critical: load on interaction -->
<script type="module">
  // Lazy load search when input focused
  const searchInput = document.getElementById('search-input');
  searchInput?.addEventListener('focus', () => {
    import('/assets/js/search.js');
  }, { once: true });
</script>
```

### 3. Add resource hints
```html
<!-- _includes/head.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
```

### 4. Enable font display swap
```css
/* css/base/typography.css */
@font-face {
  font-family: 'Main';
  src: url('/fonts/main.woff2') format('woff2');
  font-display: swap;
}
```

### 5. Add image lazy loading
```html
<img src="..." loading="lazy" decoding="async" alt="...">
```

## Todo List
- [ ] Implement critical CSS inline
- [ ] Defer non-critical CSS
- [ ] Lazy load search.js module
- [ ] Lazy load filter.js module
- [ ] Add resource preconnects
- [ ] Add font display swap
- [ ] Add image lazy loading
- [ ] Run Lighthouse audit
- [ ] Verify CLS < 0.1
- [ ] Verify LCP < 2.5s

## Success Criteria
- Lighthouse Performance >90
- Lighthouse Accessibility >90
- Lighthouse Best Practices >90
- Lighthouse SEO >90
- CLS < 0.1
- LCP < 2.5s
- FID < 100ms

## Conflict Prevention
- Only adds loading attributes (no logic changes)
- Does not modify component functionality
- Final phase - no downstream dependencies

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Flash of unstyled content | Critical CSS inline |
| Lazy loading too late | Interaction trigger |
| Font flickering | Display swap strategy |

## Security Considerations
- Verify CORS for preload hints
- Ensure SRI hashes for external resources

## Next Steps
- Final integration test
- Deploy to production
- Monitor Web Vitals
