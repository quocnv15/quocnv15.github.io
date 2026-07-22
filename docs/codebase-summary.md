# Codebase Summary

## Repository Overview

**quocnv15.github.io** is a personal iOS indie developer portfolio and blog built with Jekyll static site generator and modern TypeScript frontend architecture. The site serves as a public showcase for case studies, technical writing, and professional work.

**Repository**: [quocnv15/quocnv15.github.io](https://github.com/quocnv15/quocnv15.github.io)  
**Live Site**: [https://quocnv15.github.io](https://quocnv15.github.io)

## Technology Stack

### Core Technologies
- **Static Site Generator**: Jekyll (Ruby-based)
- **Frontend**: TypeScript 5.9+ (ES2019 target, strict mode)
- **Bundler**: esbuild 0.25 (optimized builds, tree shaking)
- **Testing**: Vitest 1.6 + jsdom
- **Hosting**: GitHub Pages

### Build & Development Tools
- **Node.js**: 16+ for TypeScript toolchain
- **Ruby**: 2.7+ for Jekyll
- **Package Manager**: npm
- **CSS**: CSS3 variables, light/dark theme system
- **Type Checking**: TypeScript strict mode with 100% coverage

## Directory Structure

```
quocnv15.github.io/
├── src/ts/                    # TypeScript source (31 files, ~19K LOC)
│   ├── main.ts               # Application entry point
│   ├── components/           # Reusable UI components (3 files)
│   ├── core/                 # Core state management & infrastructure (9 files)
│   │   ├── app-state.ts      # Central state container
│   │   ├── service-factory.ts # Service initialization
│   │   ├── plugin-system.ts   # Plugin architecture
│   │   ├── state-manager.ts   # State management logic
│   │   ├── state-persistence.ts # localStorage integration
│   │   ├── state-debug-tools.ts # Development debugging utilities
│   │   ├── performance-monitor.ts # Performance tracking
│   │   ├── cleanup-manager.ts # Resource cleanup
│   │   └── types/            # Type definitions (3 files)
│   ├── features/             # Feature implementations (4 directories)
│   │   ├── theme/            # Dark mode system
│   │   ├── navigation/        # Mobile navigation
│   │   ├── copy-code/        # Copy code to clipboard
│   │   └── toc/              # Table of contents generation
│   ├── modules/              # Legacy feature modules (5 files)
│   ├── services/             # Business logic layer (1 file)
│   │   └── config.service.ts # Configuration management
│   ├── hooks/                # Custom utility hooks (1 file)
│   ├── types/                # Global type definitions (2 files)
│   ├── constants/            # Application constants (1 file)
│   ├── interfaces/           # Legacy interfaces (1 file)
│   └── test/                 # Test suites (8 files, ~20K LOC)
│
├── scripts/                  # Build & development tools (11 files, ~3.3K LOC)
│   ├── dev-cli.js            # CLI tool for build/test/lint/analyze (487 LOC)
│   ├── dev-server.js         # HMR WebSocket server + file watcher (667 LOC)
│   ├── generate-docs.js      # TypeDoc API docs generator (699 LOC)
│   ├── enhanced-dev.js       # Development enhancements (211 LOC)
│   ├── test-hmr.js           # HMR testing utilities (347 LOC)
│   ├── a11y-audit.js         # WCAG 2.1 AA compliance checker (204 LOC)
│   ├── check-design-system.js # CSS design token validator (124 LOC)
│   ├── build_swiftui_showcase.py # SwiftUI showcase data generator
│   ├── publish.sh            # GitHub Pages publication script
│   ├── sync-content.sh       # Content sync from ios-memory repo (262 LOC)
│   └── README.md             # Scripts documentation
│
├── _config.yml              # Jekyll configuration
├── _posts/                  # Blog posts (33 files, ~5.6K LOC)
│   └── Topics: ai-agents, ai-strategy, ai-workflow, architecture,
│       blockchain, code-quality, coding, iOS, reflection, swift, thoughts
│
├── _projects/               # Project case cards (11 files, ~1.7K LOC)
├── _layouts/                # Custom HTML layouts (8 files)
├── _includes/               # Reusable components (8 files)
├── portfolio/               # Work + Cases system (59 files, ~6.2K LOC)
│   ├── work/                # Operator hub & daily systems
│   ├── cases/               # Case studies (001-023+)
│   ├── showcase/            # Curated gallery
│   ├── growth/              # Personal reviews & audits
│   └── playbooks/           # Utility templates
│
├── css/                     # Styling (base, components, utilities, overrides)
├── assets/js/               # Compiled JavaScript output
│   ├── main.js             # Production bundle (13KB minified)
│   └── main.js.map         # Source maps for debugging
│
├── _data/                   # Jekyll data files
│   └── swiftui_projects.json # SwiftUI component gallery (400+ entries, 72.2KB)
│
├── docs/                    # Documentation (this directory)
├── package.json             # Node.js dependencies
├── tsconfig.json            # TypeScript configuration
├── Gemfile                  # Ruby dependencies
└── README.md                # Repository README
```

## Lines of Code (LOC) Breakdown

| Component | Files | LOC | Purpose |
|-----------|-------|-----|---------|
| TypeScript Source | 31 | ~19K | Core frontend logic, components, state management |
| Tests | 8 | ~20K | Unit, integration, component tests (Vitest) |
| Build/Dev Scripts | 11 | ~3.3K | CLI, HMR server, generators, audits |
| Jekyll Content | 53+ | ~13.5K | Blog posts, projects, portfolio content |
| CSS | ~15 | ~3KB | Design tokens, component styles, utilities |
| **Total** | **120+** | **~62K** | Complete project codebase |

## Feature Modules

### 1. **Theme Management** (`src/ts/features/theme/`)
- Automatic OS dark/light preference detection
- Manual light/dark/system mode toggle
- 300ms smooth CSS transitions
- localStorage persistence
- ARIA compliance for accessibility

### 2. **Mobile Navigation** (`src/ts/features/navigation/`)
- Responsive hamburger menu for mobile
- Touch gesture support (swipe, tap)
- Keyboard navigation (Tab, Escape)
- Body scroll lock when menu open
- Click-outside to close

### 3. **Copy Code** (`src/ts/features/copy-code/`)
- Clipboard API with fallback support
- Visual feedback (success/error states)
- Keyboard shortcut support (Ctrl+C / Cmd+C)
- Optimized button positioning for touch
- Timeout animations (success state 2s)

### 4. **Table of Contents (TOC)** (`src/ts/features/toc/`)
- Auto-generation from h2-h6 headings
- Hierarchical structure with proper indentation
- Smooth scroll navigation with offset calculation
- Scroll spy with active highlighting
- Responsive mobile optimization
- Throttled scroll event (100ms) for performance

## Core Infrastructure

### Application State (`src/ts/core/app-state.ts`)
Central state container managing:
- Theme preference (light/dark/system)
- Mobile menu visibility
- Production environment flag
- Navigation and TOC state

### State Management (`src/ts/core/state-manager.ts`)
- Reactive state updates
- Listener subscription pattern
- Type-safe state mutations
- Performance optimization with debouncing

### Service Factory (`src/ts/core/service-factory.ts`)
Lazy-loads and manages singleton services:
- ConfigService
- PerformanceMonitor
- StateDebugTools

### Plugin System (`src/ts/core/plugin-system.ts`)
Extensible plugin architecture for feature initialization:
- Theme plugin (theme switching logic)
- Navigation plugin (mobile menu)
- Copy Code plugin
- TOC plugin

### State Persistence (`src/ts/core/state-persistence.ts`)
Handles localStorage management:
- Theme preference persistence
- Automatic hydration on page load
- Fallback to system preference if unavailable

### Performance Monitor (`src/ts/core/performance-monitor.ts`)
Tracks runtime metrics:
- Feature initialization times
- DOM operation duration
- Custom event recording
- Development console logging

## Configuration

### TypeScript (`src/tsconfig.json`)
- **Target**: ES2019 (broad browser compatibility)
- **Module**: ES2020
- **Strict Mode**: Enabled (no implicit any, strict null checks)
- **Path Aliases**: `@/` → `src/`, `@/core/*`, `@/components/*`, etc.

### Jekyll (`_config.yml`)
- **Collections**: 
  - `projects` → `/projects/:path/`
  - `notes` → `/notes/:path/`
  - `tools` → `/tools/:path/`
- **Default Tags**: "Other"
- **Theme**: Minima (customized)

### Environment Variables
Controlled via `NODE_ENV`:
- `development`: Source maps, dev console logging, larger bundles
- `production`: Minified bundles, tree shaking, optimized output

## Build Pipeline

### Development Build (`npm run dev`)
1. TypeScript watch mode (src/ts → assets/js/main.js)
2. Jekyll livereload server (http://localhost:4000)
3. CSS hot-injection via WebSocket
4. Error overlay for compilation issues

### Production Build (`npm run build:prod`)
1. Set `NODE_ENV=production`
2. esbuild minification & tree shaking
3. Jekyll static site generation
4. Output to `_site/`
5. Auto-deployment to GitHub Pages

### Testing (`npm run test`)
- Vitest framework with jsdom environment
- TypeScript type checking integrated
- V8 coverage provider
- Watch mode for development

## CSS Architecture

### Design System (`css/variables.css`)
**Light Theme**:
- Background: #ffffff
- Surface: #ffffff (bg-alt variant for secondary)
- Solid: #2563eb (action elements)
- Text: #0f172a (heading color)
- Accent: #2563eb (primary action color)

**Dark Theme**:
- Background: #0b1120
- Surface: #2a3548 (bg-alt for secondary)
- Solid: #6ea8ff (action elements)
- Text: #e0e0e0 (text color)
- Accent: #6ea8ff (primary action color)

### Structure
- **base/**: Reset, typography, buttons, layout, navigation, spacing
- **components/**: Cards, forms, projects-tools, SwiftUI page, lifetime-calculator
- **utilities/**: Utility classes for spacing, alignment, display
- **overrides/**: 75.5KB of post/case-study specific tweaks

## Content Management

### Blog Posts (`_posts/`, 33 files)
- Format: `YYYY-MM-DD-title.md` with YAML frontmatter
- 11 topic categories (iOS, AI, architecture, etc.)
- Default tag "Other"
- ~5.6K LOC of technical content

### Projects (`_projects/`, 11 files)
- Project case cards with metadata
- Links to demos, GitHub repos, App Store listings
- ~1.7K LOC of project descriptions

### Portfolio System (`portfolio/`, 59 files)
- **Work Mode**: `/work/` operator hub for daily systems
- **Cases Mode**: `/cases/` numbered public case studies (001-023+)
  - Categories: Architecture, AI/Automation, Growth, Dev Philosophy
- **Showcase**: Curated case studies with gallery
- **Growth**: Personal audit/skill review section
- **Playbooks**: Utility templates and references
- Content synced from separate `ios-memory` repository

### SwiftUI Showcase (`_data/swiftui_projects.json`)
- 400+ SwiftUI component entries
- Fields: name, category, author, description, platform, preview images, links
- Auto-generated via `scripts/build_swiftui_showcase.py`
- 72.2KB data file supporting dynamic component gallery

## Performance Metrics

### Bundle Size
- **Production Bundle**: 13KB minified (gzip-optimized)
- **Development Bundle**: 24.6KB with source maps
- **Target**: 150KB → **91% under target**

### Build Performance
- **Build Time**: ~718ms (includes type checking)
- **Incremental Build**: Sub-second for single file changes
- **Watch Mode**: Instant feedback with HMR

### Runtime Performance
- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Theme Switch**: <300ms with smooth transitions
- **Mobile Navigation**: 60fps animations
- **Copy Code Feedback**: Instant visual response
- **TOC Scroll Spy**: Throttled at 100ms for efficiency

### Browser Support
- Chrome 73+
- Firefox 65+
- Safari 12+
- Edge 79+

## npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start full dev environment (TS watch + Jekyll livereload) |
| `npm run dev:hmr` | Development with custom HMR via scripts/dev-server.js |
| `npm run build` | Clean + TypeScript + Jekyll build |
| `npm run build:prod` | Production build with NODE_ENV=production |
| `npm run test` | Full test suite (types + bundle + vitest) |
| `npm run analyze` | Detailed bundle analysis and metrics |
| `npm run size-check` | Bundle size verification against 150KB target |
| `npm run check:types` | TypeScript type checking only |
| `npm run check:design` | Design token validation via check-design-system.js |

## Testing Framework

- **Runner**: Vitest 1.6
- **Environment**: jsdom (browser simulation)
- **Setup**: `src/test/setup.ts` with DOM mocking
- **Coverage**: V8 provider with HTML reports
- **Test Location**: `src/test/{integration,services,unit}/`

### Example Test Coverage
- `config.service.test.ts`: Configuration management
- `theme.test.ts`: Dark mode toggle logic
- `navigation.test.ts`: Mobile menu behavior
- `copy-code.test.ts`: Clipboard functionality
- `full-app.test.ts`: Integration scenarios

## Integration Points

### Content Sync (`scripts/sync-content.sh`)
- Bidirectional sync with separate `ios-memory` repository
- Syncs: dashboard HTML, case studies, Jekyll frontmatter, portfolio overview
- Maintains separation between private memory and public portfolio

### Data Generation (`scripts/generate-docs.js`)
- Generates TypeDoc API documentation
- Creates architecture documentation
- Parses TypeScript interfaces for API reference

### Accessibility Audits (`scripts/a11y-audit.js`)
- WCAG 2.1 AA compliance checking
- Color contrast validation
- Skip link presence verification
- ARIA attribute checks

## Recent Changes (Git History)

- **2f80992**: Custom site footer + homepage layout CSS refinements
- **75e321b**: Minimalist design system overhaul + portfolio restructuring
- **b86eb5a**: Minimalist slate design system release
- **7c2b5bc**: Work + Cases modes for portfolio
- **ace2bd9**: Dashboard update with Memory Timeline section

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/ts/main.ts` | Entry point; auto-initializes 4 feature plugins |
| `src/ts/core/app-state.ts` | Central state container |
| `src/ts/core/plugin-system.ts` | Plugin registration & initialization |
| `src/ts/core/state-manager.ts` | State reactivity & listeners |
| `scripts/dev-server.js` | HMR WebSocket server (667 LOC) |
| `_config.yml` | Jekyll configuration & collections |
| `package.json` | npm dependencies & script definitions |
| `tsconfig.json` | TypeScript compiler options & path aliases |

## Related Documentation

- See `./docs/code-standards.md` for coding conventions and patterns
- See `./docs/system-architecture.md` for architectural patterns
- See `./docs/project-overview-pdr.md` for project goals and requirements
- See `./docs/project-roadmap.md` for planned features and milestones
