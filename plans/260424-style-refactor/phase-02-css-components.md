# Phase 02: CSS Component Architecture

## Context Links
- Research: [researcher-css-report.md](research/researcher-css-report.md)
- Parent: [plan.md](plan.md)
- Depends on: [phase-01-css-variables.md](phase-01-css-variables.md)

## Parallelization Info
- **Can run with**: None (must wait for Phase 01)
- **Must wait for**: Phase 01 (CSS variables must exist first)
- **Blocking**: Phase 04
<!-- Updated: Validation Session 1 - Changed from parallel to sequential after user decision -->

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 (critical) |
| Status | pending |
| Effort | 4 hours |
| Files | 6 create, 2 modify |

## Key Insights from Research
From `researcher-css-report.md`:
- Lines 12-67: Header/navigation mixed with utilities
- Lines 136-233: Button styles scattered
- Lines 631-1200: No clear component grouping
- Lines 2040+: Complex post-list container selectors
- Target: Reduce 3,474 lines by 40-50%

## Requirements
1. Split monolithic CSS into component files
2. Use semantic naming methodology (current .post-card, .nav-link style)
3. Apply CSS variables from Phase 01
4. Mobile-first responsive approach
5. Extract inline CSS from layouts (73 lines in project.html, 43 in note.html)
<!-- Updated: Validation Session 1 - Changed from BEM to semantic naming per user decision -->

## Architecture
```
css/
├── base/                 # NEW - Base styles
│   ├── reset.css        # CSS reset, normalize
│   └── typography.css   # Base type styles
├── components/           # NEW - UI components
│   ├── buttons.css      # Lines 136-233 from main.css
│   ├── cards.css        # Post cards, project cards
│   ├── navigation.css   # Header, footer, nav (lines 12-67)
│   ├── forms.css        # Inputs, search, labels
│   └── layout.css       # Container, grid (lines 2040+)
└── utilities/            # NEW - Helper classes
    └── spacing.css      # Margin, padding utilities
```

## Related Code Files

### Files to CREATE
| File | Source Lines | Purpose |
|------|--------------|---------|
| `css/base/reset.css` | Extracted from main:1-50 | Normalize browser styles |
| `css/base/typography.css` | Extracted from main:78-135 | Base type |
| `css/components/buttons.css` | main:136-233 | Button variants |
| `css/components/cards.css` | main:400-800 | Card components |
| `css/components/navigation.css` | main:12-67, 234-400 | Header/footer |
| `css/components/forms.css` | main:800-1200 | Search, inputs |
| `css/components/layout.css` | main:2040+ | Grid, containers |
| `css/utilities/spacing.css` | main:345-456 | Spacing helpers |

### Files to MODIFY
| File | Changes |
|------|---------|
| `_layouts/project.html` | Remove 73 lines inline CSS, use components |
| `_layouts/note.html` | Remove 43 lines inline CSS, use components |
| `_layouts/default.html` | Add `<link>` tags for new CSS files |

### Files to DELETE
| File | Reason |
|------|--------|
| `css/override.css` | Keep until testing complete, then delete (safer approach) |
| `assets/css/main.css` | Keep until testing complete, then delete (safer approach) |
<!-- Updated: Validation Session 1 - Changed deletion strategy to keep files until testing -->

## File Ownership (Exclusive)
- **css/base/** (owned by Phase 02)
- **css/components/** (owned by Phase 02)
- **css/utilities/** (owned by Phase 02)
- **_layouts/project.html** (inline CSS removal only)
- **_layouts/note.html** (inline CSS removal only)
- **assets/css/main.css** (deletion only)

## Implementation Steps

1. **Create base styles:**
   - Extract reset rules to `css/base/reset.css`
   - Extract typography to `css/base/typography.css`
   - Apply `--font-*` variables

2. **Create component files:**
   - Extract button styles (lines 136-233) → `buttons.css`
   - Replace hardcoded colors with `--color-*` variables
   - Extract navigation (lines 12-67, 234-400) → `navigation.css`
   - Extract cards (lines 400-800) → `cards.css`
   - Extract forms (lines 800-1200) → `forms.css`
   - Extract layout (lines 2040+) → `layout.css`

3. **Extract inline CSS from layouts:**
   - Remove 73 lines from `_layouts/project.html`
   - Remove 43 lines from `_layouts/note.html`
   - Move to appropriate component files

4. **Create utilities:**
   - Extract spacing patterns (lines 345-456) → `spacing.css`
   - Use `--space-*` variables

5. **Update _layouts/default.html:**
   ```html
   <link rel="stylesheet" href="/css/variables.css">
   <link rel="stylesheet" href="/css/base/reset.css">
   <link rel="stylesheet" href="/css/base/typography.css">
   <link rel="stylesheet" href="/css/components/buttons.css">
   <link rel="stylesheet" href="/css/components/cards.css">
   <link rel="stylesheet" href="/css/components/navigation.css">
   <link rel="stylesheet" href="/css/components/forms.css">
   <link rel="stylesheet" href="/css/components/layout.css">
   <link rel="stylesheet" href="/css/utilities/spacing.css">
   ```

6. **Delete old `assets/css/main.css`**

## Todo List
- [ ] Create css/base/reset.css
- [ ] Create css/base/typography.css
- [ ] Create css/components/buttons.css
- [ ] Create css/components/cards.css
- [ ] Create css/components/navigation.css
- [ ] Create css/components/forms.css
- [ ] Create css/components/layout.css
- [ ] Create css/utilities/spacing.css
- [ ] Extract inline CSS from project.html (73 lines)
- [ ] Extract inline CSS from note.html (43 lines)
- [ ] Update default.html with new CSS links
- [ ] Delete old main.css
- [ ] Verify visual consistency

## Success Criteria
- Total CSS reduced to <2,000 lines
- Zero inline styles in layouts
- All colors use CSS variables
- Components follow semantic naming (.post-card, .nav-link)
- No visual regressions
<!-- Updated: Validation Session 1 - Changed success criteria from BEM to semantic naming -->

## Conflict Prevention
- Only modifies layout files for inline CSS removal
- Does NOT touch JavaScript (Phase 03 ownership)
- Does NOT modify content structure (Phase 04)

## Risk Assessment
| Risk | Mitigation |
|------|------------|
| Visual regression | Compare before/after screenshots |
| Missing styles | Audit component coverage |
| Load order issues | Verify CSS load sequence |

## Security Considerations
- None (CSS-only changes)

## Next Steps
- Phase 04 integrates component classes into layouts
- Phase 05 verifies accessibility of components
