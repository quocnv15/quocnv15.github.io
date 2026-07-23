# NGUYEN VAN QUOC — iOS Indie · Agent OS

[![Powered by Exocortex AI](https://img.shields.io/badge/Powered_by-Exocortex_Agentic_OS-7b2cbf?style=for-the-badge&logo=openai&logoColor=white)](#)

**Personal portfolio & technical blog** | Jekyll + TypeScript | GitHub Pages

[Live Site](https://quocnv15.github.io) · [Documentation](./docs) · [GitHub](https://github.com/quocnv15/quocnv15.github.io)

## Quick Links

| Section | URL | Purpose |
|---------|-----|---------|
| Homepage | [/](https://quocnv15.github.io/) | Featured cases + recent writing |
| Work Mode | [/work/](https://quocnv15.github.io/work/) | Weekly operator hub & priorities |
| Blog | [/archive.html](https://quocnv15.github.io/archive.html) | 50+ technical articles |
| Projects | [/projects/](https://quocnv15.github.io/projects/) | iOS apps showcase |
| Cases | [/cases/](https://quocnv15.github.io/cases/) | 23+ numbered case studies |

## What's Inside

- **50+ blog posts** on iOS, AI agents, architecture, code quality
- **23+ case studies** categorized by type (Architecture, AI/Automation, Growth, Dev Philosophy)
- **11+ iOS projects** with live demos and GitHub links
- **Portfolio board** (`/ios-memory/dashboard.html`) — curated view of professional work
- **Work mode** — daily priorities, operator systems, frameworks
- **400+ SwiftUI components** gallery with metadata

## Key Features

- **Performance**: 13KB production bundle (91% under 150KB target)
- **Type Safety**: 100% strict TypeScript coverage
- **Accessibility**: WCAG 2.1 AA compliant throughout
- **Dark Mode**: Auto-detect + manual toggle with persistence
- **Mobile-First**: Responsive design with touch-optimized navigation
- **Modern DevX**: HMR, source maps, Vitest testing framework

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Static Site** | Jekyll (Ruby) + Markdown |
| **Frontend** | TypeScript 5.9+ (strict mode) |
| **Bundler** | esbuild (optimized builds) |
| **Testing** | Vitest 1.6 + jsdom |
| **Styling** | CSS3 variables (light/dark theme) |
| **Hosting** | GitHub Pages (free, automatic) |
| **Development** | HMR, source maps, type checking |

## Project Structure

```
src/ts/              # TypeScript frontend (31 files, 19K LOC)
  ├── main.ts        # App entry point & plugin initialization
  ├── core/          # State management, infrastructure
  ├── features/      # Theme, navigation, copy-code, TOC
  ├── services/      # Business logic
  └── test/          # Vitest unit & integration tests

scripts/             # Build & development tools (11 files)
  ├── dev-cli.js     # CLI for build/test/lint
  ├── dev-server.js  # HMR WebSocket server (667 LOC)
  └── sync-content.sh # Sync with ios-memory repo

_posts/              # Blog posts (50+ articles)
_projects/           # iOS projects showcase (11 projects)
portfolio/           # Work + Cases system (59 files)
css/                 # Design system & component styles
_config.yml          # Jekyll configuration
docs/                # Documentation (this project)
```

See [`docs/codebase-summary.md`](./docs/codebase-summary.md) for full breakdown.

## Getting Started

**Prerequisites**: Node.js 16+, Ruby 2.7+

```bash
# Clone & install
git clone https://github.com/quocnv15/quocnv15.github.io.git
cd quocnv15.github.io
bundle install && npm install

# Development (HMR enabled)
npm run dev
# Opens http://localhost:4000

# Production build
npm run build:prod

# Testing & quality
npm run test
npm run check:types
npm run size-check
npm run check:design
```

For detailed setup & deployment, see [`docs/deployment-guide.md`](./docs/deployment-guide.md).

## Features

| Feature | Details |
|---------|---------|
| **Dark Mode** | Auto OS detection + manual toggle, 300ms smooth transitions, localStorage persistence |
| **Mobile Navigation** | Hamburger menu, touch-optimized, keyboard navigation (Tab/Escape) |
| **Copy Code** | Clipboard API with fallback, visual feedback, keyboard shortcuts |
| **Table of Contents** | Auto-generated, scroll spy, smooth navigation, hierarchical structure |
| **Accessibility** | WCAG 2.1 AA compliant, keyboard navigation, ARIA labels |
| **Performance** | 13KB bundle, <1.5s FCP, 60fps animations, optimized event handlers |

## Documentation

Comprehensive guides for development, deployment, and contributing:

- **[Project Overview & PDR](./docs/project-overview-pdr.md)** — Goals, scope, requirements
- **[Codebase Summary](./docs/codebase-summary.md)** — Structure, LOC breakdown, tech stack
- **[Code Standards](./docs/code-standards.md)** — Patterns, naming, testing, performance
- **[System Architecture](./docs/system-architecture.md)** — State management, data flow, layers
- **[Deployment Guide](./docs/deployment-guide.md)** — Local dev, build, deployment, troubleshooting
- **[Design Guidelines](./docs/design-guidelines.md)** — Colors, typography, components, accessibility
- **[Project Roadmap](./docs/project-roadmap.md)** — Phases, milestones, future features

## Performance & Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Bundle Size | <150KB | 13KB | ✅ 91% under target |
| FCP (First Contentful Paint) | <1.5s | <1.5s | ✅ On target |
| LCP (Largest Contentful Paint) | <2.5s | <2.5s | ✅ On target |
| Build Time | <1s | ~718ms | ✅ On target |
| Browser Support | 2019+ | Chrome, Firefox, Safari, Edge | ✅ Broad support |

## Development Workflow

```bash
# Start dev server with HMR
npm run dev

# Quality assurance
npm run test           # Run tests
npm run check:types    # Type checking
npm run size-check     # Bundle size verification

# Production build
npm run build:prod

# Deployment (automatic on push to main)
git commit -m "feat: description"
git push origin main
```

Automatic deployment via GitHub Pages (~2 minutes after push).

## Contributing

Contributions welcome! Follow the [Code Standards](./docs/code-standards.md) guide.

```bash
# 1. Create feature branch
git checkout -b feature/name

# 2. Development
npm run dev      # Start dev server
npm run test     # Run tests before commit

# 3. Quality checks
npm run check:types
npm run size-check

# 4. Push & create PR
git push origin feature/name
```

## Status

| Aspect | Status | Notes |
|--------|--------|-------|
| Architecture | 🟢 Modern TypeScript | Plugin-based, state management |
| Performance | 🟢 Optimized | 13KB bundle, <1.5s FCP |
| Code Quality | 🟢 Enterprise Grade | 100% strict TypeScript |
| Testing | 🟢 Framework Ready | Vitest + jsdom |
| Documentation | 🟢 Comprehensive | 7 detailed guides |
| Deployment | 🟢 Production Ready | GitHub Pages auto-deploy |

## Contact

- **Email**: quocnv155@gmail.com
- **LinkedIn**: [nguyen-quoc-3a16a6226](https://linkedin.com/in/nguyen-quoc-3a16a6226)
- **GitHub**: [quocnv15](https://github.com/quocnv15)
- **Location**: Hanoi, Vietnam

---

**Built with Jekyll, TypeScript, and modern web development practices**