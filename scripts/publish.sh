#!/bin/bash
# Complete publish workflow: sync + commit + push

GITHUB_IO="/Users/djv033/work-quocnv15/quocnv15.github.io"

echo "🚀 Publishing to GitHub Pages..."

# Run sync
bash "$GITHUB_IO/scripts/sync-content.sh"

# Commit
echo ""
echo "📝 Committing changes..."
cd "$GITHUB_IO"
git add -A
git commit -m "update: sync published content from ios-memory"

# Push
echo "📤 Pushing to GitHub..."
git push

echo "✅ Published! View at https://quocnv15.github.io/"
