# Phase 05: Accessibility Improvements

## Context Links
- Research: [researcher-js-layout-report.md](research/researcher-js-layout-report.md) (a11y considerations)
- Parent: [plan.md](plan.md)
- Depends on: Phase 04 (layouts must be integrated)

## Parallelization Info
- **Can run with**: Phase 06 (after Phase 04)
- **Must wait for**: Phase 04 (needs integrated layouts)
- **Blocking**: None

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 (critical) |
| Status | pending |
| Effort | 2 hours |
| Files | 6 modify |

## Key Insights from Research
From `researcher-js-layout-report.md`:
- Keyboard navigation must be preserved (ESC, Enter)
- ARIA label compatibility needed
- Screen reader support required

## Requirements
1. Achieve WCAG 2.1 AA compliance
2. Ensure keyboard navigation works
3. Add proper ARIA labels
4. Test with screen readers
5. Verify color contrast ratios

## Architecture
```
Accessibility improvements across:
- Navigation (keyboard, ARIA)
- Forms (labels, error handling)
- Cards (semantic structure)
- Search (announcements)
- Focus management
```

## Related Code Files

### Files to MODIFY
| File | Changes |
|------|---------|
| `_includes/header-nav.html` | ARIA labels, focus states |
| `css/components/navigation.css` | Focus indicators |
| `css/components/forms.css` | Focus states, error styles |
| `assets/js/navigation.js` | Focus trapping in menu |
| `assets/js/search.js` | ARIA live regions |
| `assets/js/filter.js` | State announcements |

### Files to CREATE
None

### Files to DELETE
None

## File Ownership (Exclusive)
- **ARIA attributes in includes/** (owned by Phase 05)
- **Focus styles in CSS/** (owned by Phase 05)
- **A11y JS enhancements** (owned by Phase 05)

## Implementation Steps

### 1. Navigation accessibility
```html
<!-- _includes/header-nav.html -->
<nav aria-label="Main navigation">
  <button aria-expanded="false" aria-controls="mobile-menu">
    Menu
  </button>
  <ul id="mobile-menu" role="menu">
    <li role="none"><a role="menuitem" href="/">Home</a></li>
  </ul>
</nav>
```

### 2. Form accessibility
```html
<!-- _includes/search.html -->
<label for="search-input" class="visually-hidden">Search</label>
<input id="search-input" type="search" aria-describedby="search-hint">
<span id="search-hint">Type to search posts</span>
```

### 3. Focus indicators
```css
/* css/components/navigation.css */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: var(--space-sm);
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
```

### 4. Screen reader support
```javascript
// assets/js/search.js
const searchResults = document.getElementById('search-results');
searchResults.setAttribute('aria-live', 'polite');
searchResults.setAttribute('role', 'region');
searchResults.setAttribute('aria-label', 'Search results');
```

### 5. Color contrast verification
- All text meets 4.5:1 contrast ratio
- Interactive elements meet 3:1 contrast ratio
- Use CSS variables for consistent colors

## Todo List
- [ ] Add ARIA labels to navigation
- [ ] Add ARIA labels to forms
- [ ] Implement focus indicators
- [ ] Add skip link
- [ ] Add aria-live regions for search
- [ ] Add state announcements for filters
- [ ] Verify color contrast ratios
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Run axe-core audit

## Success Criteria
- WCAG 2.1 AA compliant
- All interactive elements keyboard accessible
- ARIA labels properly applied
- Focus indicators visible
- Color contrast passes
- axe-core scan passes

## Conflict Prevention
- Only adds ARIA attributes (does not change structure)
- Only adds focus styles (does not change component styles)
- Enhances JS modules (does not rewrite logic)

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Over-annotating ARIA | Use native HTML elements first |
| Focus trapping bugs | Test with keyboard only |
| Screen reader issues | Test with NVDA/VoiceOver |

## Security Considerations
- Ensure ARIA doesn't expose sensitive info
- Verify error messages don't leak data

## Next Steps
- Phase 6 optimizes performance
- Final integration test
