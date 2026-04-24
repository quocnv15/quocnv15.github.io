# GitHub Pages Publish Workflow

## Scripts

### sync-content.sh
Syncs published content from ios-memory to GitHub Pages.
Only copies content safe for public display.

**What gets synced:**
- Dashboard HTML
- Case Studies (18 files)
- Playbooks (category-specific)
- Portfolio Overview

**What's excluded:**
- Private notes
- Internal analysis
- Work-in-progress content
- Personal development logs

### publish.sh
Complete publish workflow: sync → commit → push

## Usage

```bash
# Sync content only (preview locally)
./scripts/sync-content.sh

# Full publish workflow
./scripts/publish.sh
```

## Source of Truth

`/Users/djv033/work-quocnv15/ios-memory` → Development directory
`quocnv15.github.io` → Published site

## Customization

Edit `sync-content.sh` to add/remove content from sync.
