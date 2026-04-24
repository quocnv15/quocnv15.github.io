# Phase 01: CSS Variables & Design System Foundation

## Context Links
- Research: [researcher-css-report.md](research/researcher-css-report.md)
- Parent: [plan.md](plan.md)

## Parallelization Info
- **Can run with**: Phase 02, Phase 03 (Wave 1 - Parallel)
- **Must wait for**: None (foundation phase)
- **Blocking**: Phase 04

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 (critical) |
| Status | pending |
| Effort | 2 hours |
| Files | 1 create, 0 modify |

## Key Insights from Research
From `researcher-css-report.md`:
- Lines 31-35: Multiple white background variants (#fff, rgba(255,255,255,0.95))
- Lines 42-48: Duplicate border colors (#e8e8e8)
- Lines 89-112: Scattered primary color (#3498db) usage
- 47+ unique colors need consolidation
<!-- Updated: Validation Session 1 - Color consolidation to 8-10 colors approved -->

## Requirements
1. Create comprehensive CSS variable system
2. Consolidate 47+ colors to 8-10 core colors (APPROVED in validation)
3. Define spacing scale (xs to xxl)
4. Define typography scale
5. Establish breakpoint system

## Architecture
```
css/
└── variables.css          # NEW - Design tokens
    :root {
      /* Colors: 8-10 core colors */
      /* Spacing: 7-step scale */
      /* Typography: 8-step scale */
      /* Breakpoints: 4 responsive points */
      /* Transitions: easing functions */
    }
```

## Related Code Files

### Files to CREATE
| File | Purpose |
|------|---------|
| `css/variables.css` | Design token definitions |

### Files to MODIFY
| File | Changes |
|------|---------|
| `_layouts/default.html` | Add `<link>` to variables.css |

### Files to DELETE
None

## File Ownership (Exclusive)
- **css/variables.css** (owned by Phase 01)

## Implementation Steps

1. **Create `css/variables.css` with:**
   ```css
   :root {
     /* Colors - 8 core palette */
     --color-primary: #3498db;
     --color-secondary: #667eea;
     --color-accent: #764ba2;
     --color-text: #2c3e50;
     --color-text-muted: #666;
     --color-border: #e8e8e8;
     --color-bg: #ffffff;
     --color-bg-alt: #f8f9fa;

     /* Spacing - 0.25rem to 3rem */
     --space-xs: 0.25rem;
     --space-sm: 0.5rem;
     --space-md: 1rem;
     --space-lg: 1.5rem;
     --space-xl: 2rem;
     --space-2xl: 2.5rem;
     --space-3xl: 3rem;

     /* Typography */
     --font-xs: 0.75rem;
     --font-sm: 0.875rem;
     --font-base: 1rem;
     --font-lg: 1.125rem;
     --font-xl: 1.25rem;
     --font-2xl: 1.5rem;
     --font-3xl: 2rem;

     /* Breakpoints (for reference, not CSS vars) */
     /* sm: 640px, md: 768px, lg: 1024px, xl: 1280px */
   }
   ```

2. **Update `_layouts/default.html`:**
   - Add `<link rel="stylesheet" href="/css/variables.css">` before main stylesheet

3. **Verify:**
   - Variables load before main CSS
   - No conflicts with existing CSS

## Todo List
- [ ] Create `css/variables.css` with color tokens
- [ ] Add spacing scale to variables
- [ ] Add typography scale to variables
- [ ] Update default.html to include variables
- [ ] Verify variables are accessible in DevTools

## Success Criteria
- Variables file <100 lines
- All 47+ colors mapped to 8-10 core variables
- Variables load before main CSS
- No breaking changes to existing styles

## Conflict Prevention
- Creates NEW file only (no ownership conflicts)
- Does not modify existing CSS (defers to Phase 02)

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Variable naming conflicts | Use consistent `--color-*`, `--space-*`, `--font-*` prefixing |
| Browser support | CSS variables supported in 97%+ browsers |

## Security Considerations
- None (CSS-only changes)

## Next Steps
- Phase 02 uses these variables for component refactoring
- Phase 04 uses variables in layout templates
