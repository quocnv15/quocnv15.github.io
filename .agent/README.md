# 📚 Agent Documentation Index

Thư mục này chứa tài liệu dành cho AI agents và developers để hiểu và maintain project.

## 📁 Documentation Structure

```
.agent/
  ├── README.md                    # This file - Documentation index
  ├── Tasks/                       # PRD & implementation plans
  │   ├── post-sync-implementation.md
  │   ├── simplification-proposal.md
  │   └── MIGRATION_COMPLETE.md
  ├── System/                      # Current state documentation
  │   ├── content-management.md
  │   └── architecture-review.md
  └── SOP/                        # Standard operating procedures
      └── TESTING_CHECKLIST.md
```

## 📋 Tasks - Implementation Plans

### 1. Post Synchronization
- **File:** [Tasks/post-sync-implementation.md](./Tasks/post-sync-implementation.md)
- **Status:** ✅ Completed
- **Purpose:** Đồng bộ thông tin post giữa Home và Archive pages
- **Content:**
  - Problem analysis
  - Implementation details
  - Reusable components created
  - Results and metrics
- **Audience:** Developers

### 2. Simplification Proposal
- **File:** [Tasks/simplification-proposal.md](./Tasks/simplification-proposal.md)
- **Status:** ⏳ Pending Review
- **Purpose:** Chi tiết kỹ thuật về việc đơn giản hóa architecture
- **Content:**
  - So sánh code Before/After
  - Metrics: -75% code, -60% layers
  - Migration plan (4 giờ)
  - Code examples
- **Audience:** Developers

### 3. Migration Complete
- **File:** [Tasks/MIGRATION_COMPLETE.md](./Tasks/MIGRATION_COMPLETE.md)
- **Status:** ✅ Completed
- **Purpose:** Record of completed migration
- **Audience:** Reference

### 4. Minimalist Design System Fixes
- **File:** [Tasks/minimalist-design-system-fixes.md](./Tasks/minimalist-design-system-fixes.md)
- **Status:** ✅ Fixed locally (pending ship)
- **Purpose:** Root-cause fixes for design-token refactor regressions (archive nesting, missing tokens, projects/tools inline CSS, featured cards)
- **Prevention:** `npm run check:design` → `scripts/check-design-system.js`

## 🏗️ System - Current State

### 1. Content Management
- **File:** [System/content-management.md](./System/content-management.md)
- **Purpose:** Documentation về content management system
- **Content:**
  - Content architecture
  - Frontmatter standards
  - Reusable components
  - Display pages
  - Best practices
- **Audience:** All developers

### 2. Architecture Review
- **File:** [System/architecture-review.md](./System/architecture-review.md)
- **Purpose:** Đánh giá tổng quan kiến trúc
- **Content:**
  - Current state analysis
  - Problems identified
  - 3 options with trade-offs
  - Recommendation
- **Audience:** Tech leads, architects

### 3. Coding Standards
- **File:** [System/coding-standards.md](./System/coding-standards.md)
- **Purpose:** Coding style và quality guidelines
- **Content:**
  - TypeScript standards
  - HTML/CSS/Liquid best practices
  - Code quality requirements
  - Testing standards
  - Documentation guidelines
- **Audience:** All developers

## 📚 SOP - Standard Operating Procedures

### Testing Checklist
- **File:** [SOP/TESTING_CHECKLIST.md](./SOP/TESTING_CHECKLIST.md)
- **Purpose:** Testing procedures and checklist
- **Audience:** QA, Developers

## 📖 How to Use This Documentation

### For New Team Members
1. Start with **System/content-management.md** - Understand how content works
2. Read **System/architecture-review.md** - Get architecture overview
3. Review **System/coding-standards.md** - Learn coding guidelines
4. Check **Tasks/** folder - See recent implementation work

### For Adding Content
1. Read **System/content-management.md**
2. Follow frontmatter standards
3. Use reusable components
4. Test with Jekyll build

### For Implementing Features
1. Check **Tasks/** for similar implementations
2. Follow established patterns
3. Create documentation when done
4. Update this README

### For Maintenance
1. Reference **System/** docs for current state
2. Follow **SOP/** for testing procedures
3. Update docs when making changes

## 🔄 Recent Updates

- **2025-01-XX:** Added coding standards and quality guidelines
- **2025-10-15:** Post sync implementation completed
- **2025-10-15:** Added content management documentation
- **2025-10-15:** Organized docs into Tasks/System/SOP structure

## 📞 Quick Reference

**Adding a post?** → [System/content-management.md](./System/content-management.md#adding-a-new-post)  
**Adding a category?** → [System/content-management.md](./System/content-management.md#adding-a-new-category)  
**Coding standards?** → [System/coding-standards.md](./System/coding-standards.md)  
**Testing checklist?** → [SOP/TESTING_CHECKLIST.md](./SOP/TESTING_CHECKLIST.md)  

---

**Note:** Keep documentation up to date when making changes. Future you (and AI agents) will thank you!
