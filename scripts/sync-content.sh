#!/usr/bin/env bash
# Sync public-safe content from ios-memory → GitHub Pages site.
# Allowlist only — never copy dailies, SOUL, mentor corpus, beads.
# Case studies: merge body from ios-memory, keep/inject Jekyll frontmatter.
# Finance scrub: dollar amounts + common ROI/ROAS figures redacted on public mirror.
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

scrub_finance() {
  # $1 = file path
  python3 - "$1" <<'PY'
import re, sys
from pathlib import Path
path = Path(sys.argv[1])
if not path.exists():
    raise SystemExit(0)
text = path.read_text(encoding="utf-8", errors="replace")
orig = text
text = re.sub(
    r"(?<![\w-])[~≈]?\s*[+\-−+]?\s*\$\s*\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:[kKmM])?",
    "[redacted]",
    text,
)
text = re.sub(r"\$\d+(?:\.\d+)?/[^\s|<)·]+", "[redacted]", text)
# High-signal portfolio multiples often published by mistake
for a, b in [
    (r"\b7\.7x\b", "[redacted]x"),
    (r"\b1\.1x\b", "[redacted]x"),
    (r"\b1\.24x\b", "[redacted]x"),
    (r"\b1\.35x\b", "[redacted]x"),
    (r"\b1\.01x\b", "[redacted]x"),
]:
    text = re.sub(a, b, text)
if text != orig:
    path.write_text(text, encoding="utf-8")
    print(f"  🔒 scrubbed finance: {path.name}")
PY
}

# Dashboard HTML — copy then scrub (never leave raw P&L on public mirror)
if [[ -f "$IOS_MEMORY/site/index.html" ]]; then
  echo "📊 Dashboard (copy + finance scrub)"
  mkdir -p "$GITHUB_IO/ios-memory"
  cp "$IOS_MEMORY/site/index.html" "$GITHUB_IO/ios-memory/dashboard.html"
  scrub_finance "$GITHUB_IO/ios-memory/dashboard.html"
  # Ensure public banner exists
  python3 - "$GITHUB_IO/ios-memory/dashboard.html" <<'PY'
from pathlib import Path
import re, sys
path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8", errors="replace")
if "public-safe-banner" not in text:
    note = '''
        <div class="public-safe-banner" style="margin:1rem 1.25rem;padding:0.85rem 1rem;border:1px solid var(--border, #334155);border-radius:10px;background:rgba(148,163,184,0.12);color:var(--text-secondary,#94a3b8);font-size:0.9rem;line-height:1.5;">
          <strong style="color:var(--text-primary,#e2e8f0);">Public-safe board.</strong>
          Revenue, spend, profit, and ROAS figures are redacted on this public mirror.
          Full P&amp;L stays in the private <code>ios-memory</code> workspace.
        </div>
'''
    if re.search(r"<main[^>]*>", text):
        text = re.sub(r"(<main[^>]*>)", r"\1\n" + note, text, count=1)
    else:
        text = re.sub(r"(<body[^>]*>)", r"\1\n" + note, text, count=1)
    path.write_text(text, encoding="utf-8")
    print("  + public-safe banner")
# Extra label softeners
python3 - "$GITHUB_IO/ios-memory/dashboard.html" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
t = p.read_text(encoding="utf-8", errors="replace")
repls = {
    "Thu Nhập Từng Đợt (Revenue Milestones)": "Operating Windows (detail private)",
    "Total Revenue (30d SOT)": "Portfolio signal (private detail)",
    "Portfolio ROI (June/Scale)": "Efficiency stance (private detail)",
    "P&amp;L cashflow · rev/spend/profit/ROAS": "Cashflow lane · detail private",
    "P&L cashflow · rev/spend/profit/ROAS": "Cashflow lane · detail private",
}
for a, b in repls.items():
    t = t.replace(a, b)
p.write_text(t, encoding="utf-8")
PY
else
  echo "⚠️  skip dashboard (site/index.html missing)"
fi

# Case studies — inject/preserve Jekyll frontmatter + finance scrub
sync_case_studies() {
  local src="$IOS_MEMORY/portfolio/showcase/case-studies"
  local dst="$GITHUB_IO/portfolio/showcase/case-studies"
  [[ -d "$src" ]] || { echo "⚠️  skip case-studies"; return; }
  echo "📚 Case studies (merge + frontmatter + scrub)"
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

def scrub(body: str) -> str:
    body = re.sub(
        r"(?<![\w-])[~≈]?\s*[+\-−+]?\s*\$\s*\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:[kKmM])?",
        "[redacted]",
        body,
    )
    body = re.sub(r"\b7\.7x\b", "[redacted]x", body)
    body = re.sub(r"\b1\.1x\b", "[redacted]x", body)
    body = re.sub(r"\b1\.24x\b", "[redacted]x", body)
    return body

for md in sorted(src.glob("*.md")):
    body = scrub(strip_fm(md.read_text(encoding="utf-8", errors="replace")))
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
    if "permalink:" not in fm:
        fm = fm.rstrip() + f"\npermalink: /portfolio/showcase/case-studies/{slug}/\n"
    note = "> **Public-safe:** Exact revenue / spend / ROI figures are redacted on this public mirror.\n\n"
    if "Public-safe:" not in body[:300]:
        body = note + body.lstrip()
    out.write_text(f"---\n{fm.strip()}\n---\n\n{body.lstrip()}", encoding="utf-8")
    print(f"  + {md.name}")
PY
}

sync_case_studies

# Portfolio overview — NEVER copy raw P&L; keep public stub only
echo "📈 Portfolio overview (public stub only — raw P&L not synced)"
mkdir -p "$GITHUB_IO/portfolio"
cat > "$GITHUB_IO/portfolio/_overview.md" <<'MD'
# App Portfolio Overview (Public)

> **Public-safe summary only.**  
> Full P&L, revenue, spend, ROAS, and app-level finance live in the private `ios-memory` repo — **not published here**.

**Last updated:** auto-synced stub

## What this portfolio is

Multi-app **iOS indie** portfolio operated as a small factory:

- Shared monetization infrastructure (IAP + ads modules)
- Quality gates and agent harness over feature thrash
- Category playbooks (utility camera, wallpaper, etc.)
- Public case studies for systems and hard lessons

## Operating stance (no numbers)

| Lane | Stance |
|------|--------|
| Utility / camera tools | Scale only when efficiency holds |
| Wallpaper / consumer | Optimize before opening spend |
| Early / pipeline apps | Organic first — no paid until signal |
| Agent OS / harness | Active systems work |

## What is public

- [Featured cases on Home](/#cases)
- [Showcase hub](/portfolio/showcase/)
- [Case studies index](/portfolio/case-studies/)
- [Playbooks](/portfolio/playbooks/) (qualitative patterns)
- [Work hub](/work/) — weekly operator view (public-safe)

## What stays private

- Exact revenue / profit / spend / ROAS
- Per-app P&L tables and finance identifiers
- Daily spend bands and cashflow milestones
- Private dailies, SOUL, mentor corpus

> Public site intentionally omits finance detail. Full metrics: private `ios-memory` only.
MD

# Optional: scrub playbooks if synced later
if [[ -d "$GITHUB_IO/portfolio/playbooks" ]]; then
  echo "🔒 Scrub playbooks finance tokens"
  find "$GITHUB_IO/portfolio/playbooks" -name '*.md' -print0 | while IFS= read -r -d '' f; do
    scrub_finance "$f"
  done
fi

if [[ -d "$GITHUB_IO/portfolio/growth" ]]; then
  echo "🔒 Scrub growth pages finance tokens"
  find "$GITHUB_IO/portfolio/growth" -name '*.md' -print0 | while IFS= read -r -d '' f; do
    scrub_finance "$f"
  done
fi

echo "✅ Sync complete (allowlist + finance scrub)"
echo "Excluded: dailies, SOUL, mentors corpus, beads, private plans, raw P&L overview"
echo "Scrubbed: currency amounts and known ROI multiples on public mirror"
