#!/bin/bash
# Sync published content from ios-memory to GitHub Pages
# Only copies content that's safe for public display

IOS_MEMORY="/Users/djv033/work-quocnv15/ios-memory"
GITHUB_IO="/Users/djv033/work-quocnv15/quocnv15.github.io"

echo "🔄 Syncing published content..."

# Dashboard HTML
echo "📊 Dashboard"
cp "$IOS_MEMORY/site/index.html" \
   "$GITHUB_IO/ios-memory/dashboard.html"

# Case Studies (all - these are meant for showcase)
echo "📚 Case Studies"
mkdir -p "$GITHUB_IO/portfolio/showcase"
rsync -av --delete \
  "$IOS_MEMORY/portfolio/showcase/case-studies/" \
  "$GITHUB_IO/portfolio/showcase/case-studies/"

# Playbooks (selective)
echo "📖 Playbooks"
mkdir -p "$GITHUB_IO/portfolio/playbooks"
cp "$IOS_MEMORY/portfolio/showcase/playbooks/category-utility-camera.md" \
   "$GITHUB_IO/portfolio/playbooks/"

# Portfolio Overview (safe metrics only)
echo "📈 Portfolio"
cp "$IOS_MEMORY/apps/PORTFOLIO-OVERVIEW.md" \
   "$GITHUB_IO/portfolio/_overview.md"

echo "✅ Sync complete!"
echo ""
echo "Excluded from sync:"
echo "  - Private notes and reflections"
echo "  - Internal analysis docs"
echo "  - Work-in-progress content"
echo "  - Personal development logs"
