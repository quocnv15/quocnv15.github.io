#!/usr/bin/env bash
# Sync public-safe content from ios-memory → GitHub Pages site.
# Allowlist only — never copy dailies, SOUL, mentor corpus, beads.
# Case studies: merge body from ios-memory, keep/inject Jekyll frontmatter.
set -euo pipefail

ROOT_BKPLUS="${BKPLUS_ROOT:-/Volumes/Workspace/0-Working/bkplus}"
IOS_MEMORY="${IOS_MEMORY_ROOT:-$ROOT_BKPLUS/ios-memory}"
GITHUB_IO="${GITHUB_IO_ROOT:-$ROOT_BKPLUS/quocnv15.github.io}"

if [[ ! -d "$IOS_MEMORY" ]]; then
  echo "ios-memory missing: $IOS_MEMORY" >&2
  exit 1
fi
if [[ ! -d "$GITHUB_IO" ]]; then
  echo "github.io missing: $GITHUB_IO" >&2
  exit 1
fi

echo "🔄 Syncing public-safe content..."
echo "   from: $IOS_MEMORY"
echo "   to:   $GITHUB_IO"

# Dashboard HTML
if [[ -f "$IOS_MEMORY/site/index.html" ]]; then
  echo "📊 Dashboard"
  mkdir -p "$GITHUB_IO/ios-memory"
  cp "$IOS_MEMORY/site/index.html" "$GITHUB_IO/ios-memory/dashboard.html"
else
  echo "⚠️  skip dashboard (site/index.html missing)"
fi

# Case studies — inject/preserve Jekyll frontmatter
sync_case_studies() {
  local src="$IOS_MEMORY/portfolio/showcase/case-studies"
  local dst="$GITHUB_IO/portfolio/showcase/case-studies"
  [[ -d "$src" ]] || { echo "⚠️  skip case-studies"; return; }
  echo "📚 Case studies (merge + frontmatter)"
  mkdir -p "$dst"
  python3 - <<'PY' "$src" "$dst"
import re, sys
from pathlib import Path

src, dst = Path(sys.argv[1]), Path(sys.argv[2])

def strip_fm(text: str) -> str:
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            return parts[2].lstrip("\n")
    return text

def title_from_body(body: str, slug: str) -> str:
    for line in body.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return slug.replace("-", " ").title()

def existing_fm(path: Path):
    if not path.exists():
        return None
    t = path.read_text(encoding="utf-8", errors="replace")
    if t.startswith("---"):
        parts = t.split("---", 2)
        if len(parts) >= 3:
            return parts[1]
    return None

for md in sorted(src.glob("*.md")):
    body = strip_fm(md.read_text(encoding="utf-8", errors="replace"))
    out = dst / md.name
    slug = md.stem
    fm = existing_fm(out)
    if fm is None:
        title = title_from_body(body, slug)
        fm = f"""
layout: portfolio-detail
title: "{title.replace('"', "'")}"
back_url: /portfolio/showcase/
back_label: "← Showcase"
permalink: /portfolio/showcase/case-studies/{slug}/
""".strip("\n")
    # ensure permalink present
    if "permalink:" not in fm:
        fm = fm.rstrip() + f"\npermalink: /portfolio/showcase/case-studies/{slug}/\n"
    out.write_text(f"---\n{fm.strip()}\n---\n\n{body.lstrip()}", encoding="utf-8")
    print(f"  + {md.name}")
PY
}

sync_case_studies

# Portfolio overview metrics
if [[ -f "$IOS_MEMORY/apps/PORTFOLIO-OVERVIEW.md" ]]; then
  echo "📈 Portfolio overview"
  mkdir -p "$GITHUB_IO/portfolio"
  cp "$IOS_MEMORY/apps/PORTFOLIO-OVERVIEW.md" "$GITHUB_IO/portfolio/_overview.md"
fi

echo "✅ Sync complete (allowlist only)"
echo "Excluded: dailies, SOUL, mentors corpus, beads, private plans"
