# Plan: Hide Mor-related Projects (SpaceShare, Toyota Wallet, Hotel Booking)

## 1. Objective
Hide the project cards and detail pages for `SpaceShare`, `Toyota Wallet`, and `Hotel Booking Management System` from the website (`projects.md` and Jekyll site build) so they are no longer publicly accessible or displayed in the projects gallery.

## 2. Scope & Target Touchpoints
1. `_projects/spaceshare.md`: Set `published: false` and `hidden: true` in YAML frontmatter.
2. `_projects/toyota-wallet.md`: Set `published: false` and `hidden: true` in YAML frontmatter.
3. `_projects/hotel-booking.md`: Set `published: false` and `hidden: true` in YAML frontmatter.
4. `projects.md`:
   - Add filtering logic `{% if project.hidden or project.published == false %}{% continue %}{% endif %}` to prevent inclusion in the project lists.
   - Update initial `#resultCount` to reflect dynamic count `{{ projects.size }}` instead of hardcoded `11`.
   - Hide or adjust category filter buttons (`Coworking`, `Fintech`, `Travel`) so users aren't presented with filters for hidden projects.

## 3. Implementation Steps
- **Phase 1: Project Metadata Update**
  - Add `published: false` and `hidden: true` to frontmatter of:
    - `_projects/spaceshare.md`
    - `_projects/toyota-wallet.md`
    - `_projects/hotel-booking.md`
- **Phase 2: Projects Page Liquid & UI Refinement**
  - In `projects.md`:
    - Skip projects where `hidden == true` or `published == false`.
    - Set dynamic initial count for `#resultCount` based on `projects.size`.
    - Adjust category filter buttons (comment out or remove categories with 0 active projects: Coworking, Fintech, Travel).
- **Phase 3: Verification & Review**
  - Verify Jekyll files syntax and frontmatter consistency.
  - Verify count of visible projects (should be 8 instead of 11).
  - Verify no regression in remaining projects (Dr.Joy, Pr.Joy, Raffles Group, 3D House Design, 3D Body Measurements, Golf Tracking, Factory Tracking, Bible Reader).
  - Delegate to `code-reviewer` subagent as required by `/ak:cook`.

## 4. Acceptance Criteria
- [x] SpaceShare card does not appear on `/projects.html`.
- [x] Toyota Wallet card does not appear on `/projects.html`.
- [x] Hotel Booking card does not appear on `/projects.html`.
- [x] Detail pages for these 3 projects are marked unpublished (`published: false`).
- [x] Remaining 8 projects render and filter properly.
- [x] Project count on `/projects.html` displays 8.

## 5. Status
- **Status**: Completed & Verified
- **Build**: PASS (8 projects rendered)
- **Review**: PASS (QA tester & Code reviewer subagents passed with 0 issues)
