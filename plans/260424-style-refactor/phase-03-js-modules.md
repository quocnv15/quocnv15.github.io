# Phase 03: JavaScript Module Extraction

## Context Links
- Research: [researcher-js-layout-report.md](research/researcher-js-layout-report.md)
- Parent: [plan.md](plan.md)

## Parallelization Info
- **Can run with**: Phase 01, Phase 02 (Wave 1 - Parallel)
- **Must wait for**: None (independent JS work)
- **Blocking**: Phase 04

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 (critical) |
| Status | pending |
| Effort | 3 hours |
| Files | 3 create, 2 modify |

## Key Insights from Research
From `researcher-js-layout-report.md`:
- **index.md:529-747**: 218 lines search functionality (11 functions, 6 event listeners)
- **index.md:779-877**: 98 lines category filtering
- **index.md:880-979**: 99 lines tag filtering
- **_includes/header-nav.html:32-87**: 55 lines mobile navigation
- Total: ~470 lines inline JS to extract

## Requirements
1. Extract inline JavaScript to ES6 modules
2. Implement proper module exports/imports
3. Maintain all existing functionality
4. Preserve event listeners and keyboard handlers
5. Enable code splitting and lazy loading

## Architecture
```
assets/js/
├── search.js            # NEW - Search functionality
│   export: getAllPosts, performSearch, displaySearchResults
├── filter.js            # NEW - Category & tag filtering
│   export: filterByCategory, filterByTags
└── navigation.js        # NEW - Mobile menu, nav handlers
    export: initMobileMenu, handleNavClicks
```

## Related Code Files

### Files to CREATE
| File | Source | Lines | Purpose |
|------|--------|-------|---------|
| `assets/js/search.js` | index.md:529-747 | 218 | Search functionality |
| `assets/js/filter.js` | index.md:779-979 | 197 | Category & tag filtering |
| `assets/js/navigation.js` | header-nav.html:32-87 | 55 | Mobile navigation |

### Files to MODIFY
| File | Changes |
|------|---------|
| `index.md` | Remove lines 529-747, 779-979; add script imports |
| `_includes/header-nav.html` | Remove lines 32-87; add script import |

### Files to DELETE
None (replacing inline with modules)

## File Ownership (Exclusive)
- **assets/js/search.js** (owned by Phase 03)
- **assets/js/filter.js** (owned by Phase 03)
- **assets/js/navigation.js** (owned by Phase 03)
- **index.md** (JS extraction only - lines 529-979)
- **_includes/header-nav.html** (JS extraction only - lines 32-87)

## Implementation Steps

### 1. Create search.js (218 lines)
```javascript
// assets/js/search.js
export function getAllPosts() { /* from index.md */ }
export function performSearch() { /* from index.md */ }
export function displaySearchResults() { /* from index.md */ }
export function createSearchResultCard() { /* from index.md */ }
export function highlightText() { /* from index.md */ }
export function clearSearch() { /* from index.md */ }

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Setup event listeners
});
```

### 2. Create filter.js (197 lines)
```javascript
// assets/js/filter.js
export function filterByCategory(category) { /* from index.md */ }
export function filterByTags(tags) { /* from index.md */ }

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Setup category button handlers
  // Setup tag handlers
});
```

### 3. Create navigation.js (55 lines)
```javascript
// assets/js/navigation.js
export function initMobileMenu() { /* from header-nav.html */ }
export function handleNavClicks() { /* from header-nav.html */ }

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initMobileMenu);
```

### 4. Update index.md
Remove lines 529-979, add:
```html
<script type="module" src="/assets/js/search.js"></script>
<script type="module" src="/assets/js/filter.js"></script>
```

### 5. Update _includes/header-nav.html
Remove lines 32-87, add:
```html
<script type="module" src="/assets/js/navigation.js"></script>
```

## Todo List
- [ ] Create assets/js/search.js with 11 functions
- [ ] Create assets/js/filter.js with category/tag filtering
- [ ] Create assets/js/navigation.js with mobile menu
- [ ] Update index.md to import search.js
- [ ] Update index.md to import filter.js
- [ ] Update header-nav.html to import navigation.js
- [ ] Test search functionality
- [ ] Test category filtering
- [ ] Test tag filtering
- [ ] Test mobile navigation
- [ ] Verify keyboard navigation (ESC, Enter)

## Success Criteria
- Zero inline JavaScript in templates
- All functionality preserved
- Modules use ES6 export/import
- Event listeners properly attached
- Keyboard navigation works

## Conflict Prevention
- Only extracts JavaScript (no CSS changes)
- Does NOT modify layout structure (Phase 04)
- Reads same templates as Phase 04 but different lines

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Broken event listeners | Test each interaction after extraction |
| Scope issues with modules | Use proper export/import |
| Race conditions | Use DOMContentLoaded |

## Security Considerations
- Maintain input sanitization in search
- Preserve XSS protections in highlighting

## Next Steps
- Phase 04 verifies script tags in layouts
- Phase 05 tests keyboard accessibility
- Phase 06 implements lazy loading
