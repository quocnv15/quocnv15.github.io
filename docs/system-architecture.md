# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Jekyll Rendered HTML                      │   │
│  │  (Static site content: posts, projects, portfolio)   │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ▲                                    │
│                          │                                    │
│                   (Loaded from _site/)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      TypeScript Frontend (13KB Production Bundle)     │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Entry Point: main.ts                         │   │   │
│  │  │  - Initialize AppState                        │   │   │
│  │  │  - Register plugins                           │   │   │
│  │  │  - Setup event listeners                      │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                          │                           │   │
│  │        ┌─────────────────┼─────────────────┐         │   │
│  │        ▼                 ▼                 ▼         │   │
│  │   ┌─────────┐  ┌──────────────┐  ┌────────────────┐ │   │
│  │   │  Theme  │  │  Navigation  │  │   Copy Code    │ │   │
│  │   │ Plugin  │  │   Plugin     │  │    Plugin      │ │   │
│  │   └─────────┘  └──────────────┘  └────────────────┘ │   │
│  │        │                │                │           │   │
│  │        └────────────────┼────────────────┘           │   │
│  │                         │                           │   │
│  │                  StateManager                        │   │
│  │   (Reactive state updates + listeners)              │   │
│  │                         │                           │   │
│  │          ┌──────────────┼──────────────┐            │   │
│  │          ▼              ▼              ▼            │   │
│  │    localStorage    DOM Mutations    Event Handlers  │   │
│  │  (Persistence)      (Render)        (Interaction)   │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ (HTTP)
                              ▼
              ┌───────────────────────────────┐
              │    GitHub Pages Hosting       │
              │  (Static files only)          │
              │  - HTML                       │
              │  - CSS                        │
              │  - JavaScript (13KB bundle)   │
              │  - Images & assets            │
              └───────────────────────────────┘
```

## Frontend Architecture Layers

### Layer 1: Entry Point (`src/ts/main.ts`)

The application starts here. Responsibilities:
- Load AppState from localStorage (hydration)
- Register plugins via PluginSystem
- Initialize core services (ConfigService, PerformanceMonitor)
- Setup global error handling

```typescript
// Initialization sequence
1. Create AppState instance
2. Load persisted theme preference from localStorage
3. Register 4 plugins (theme, navigation, copy-code, toc)
4. Each plugin initializes independently
5. Setup performance monitoring
6. Listen for cleanup events (beforeunload)
```

### Layer 2: Core Infrastructure

#### AppState (`core/app-state.ts`)
Central state container holding application state:
- `theme`: 'light' | 'dark' | 'system'
- `isMobileMenuOpen`: boolean
- `isProduction`: boolean
- `navigationState`: NavigationState

**Design Pattern**: Immutable state updates through StateManager

#### StateManager (`core/state-manager.ts`)
Manages state mutations and subscriber notifications:
- `setState(updates: Partial<AppState>)`: Updates state and notifies listeners
- `subscribe(listener: Listener)`: Register state change listener
- Prevents direct state mutation; enforces unidirectional data flow

**Trade-off**: Singleton pattern simplifies initialization; slightly harder to test

#### ServiceFactory (`core/service-factory.ts`)
Lazy-loads singleton services:
- `register<T>(name: string, factory: () => T)`: Register service factory
- `get<T>(name: string): T`: Get or create singleton instance

**Benefit**: Services only initialize when needed; reduces startup time

#### PluginSystem (`core/plugin-system.ts`)
Plugin registration and initialization:
- `registerPlugins(plugins: Plugin[])`: Register multiple plugins
- Ensures ordered initialization
- Each plugin can define cleanup logic

```typescript
export interface Plugin {
  name: string;
  version: string;
  initialize(state: AppState): void | Promise<void>;
  cleanup?(): void;
}
```

**Benefit**: Decoupled features; easy to enable/disable features

#### StatePersistence (`core/state-persistence.ts`)
localStorage integration for theme persistence:
- Saves user's theme preference
- Hydrates state on page load
- Falls back to system preference if unavailable

#### StateDebugTools (`core/state-debug-tools.ts`)
Development-only debugging utilities:
- Expose AppState to browser console (`window.__APP_STATE__`)
- Log state changes
- Profile feature initialization times

### Layer 3: Features (Plugins)

Four independent features initialized via PluginSystem:

#### 1. Theme Feature (`features/theme/`)
**Purpose**: Implement dark/light mode switching

**Components**:
- `theme.ts`: Core theme logic (exports `themePlugin`)
- `theme-toggle.component.ts`: UI component

**State Management**:
- Listens to StateManager theme changes
- Applies CSS class to document.documentElement
- Syncs with localStorage

**Flow**:
```
User clicks toggle
    ↓
ThemeToggle component fires event
    ↓
StateManager.setState({ theme: newMode })
    ↓
Listeners notified (theme plugin subscribed)
    ↓
Apply CSS class + localStorage update
```

**Accessibility**:
- ARIA label on toggle button
- Keyboard navigation (Tab, Enter/Space)
- Respects prefers-color-scheme media query

#### 2. Navigation Feature (`features/navigation/`)
**Purpose**: Mobile hamburger menu

**Components**:
- `navigation.ts`: Core navigation logic
- Mobile menu open/close
- Scroll lock when menu open
- Click-outside to close

**Flow**:
```
User clicks hamburger
    ↓
Toggle isMobileMenuOpen state
    ↓
CSS transitions show/hide menu
    ↓
Body scroll lock applied
    ↓
Press Escape or click outside
    ↓
Close menu
```

**Accessibility**:
- `aria-label="Mobile navigation"`
- `aria-expanded` reflects menu state
- Keyboard navigation (Tab, Escape)
- Focus management (return to button after close)

#### 3. Copy Code Feature (`features/copy-code/`)
**Purpose**: Add copy button to code blocks

**Components**:
- `copy-code.ts`: Core copy functionality
- Creates copy button on every `<pre>` or `<code>` block
- Uses Clipboard API with fallback

**Flow**:
```
Page loads
    ↓
Scan for code blocks
    ↓
Add copy button to each block
    ↓
User clicks button
    ↓
Copy text to clipboard (Clipboard API)
    ↓
Show success state (2s timeout)
    ↓
Reset button
```

**Fallback**: If Clipboard API unavailable, use `document.execCommand('copy')`

**Accessibility**:
- Semantic `<button>` element
- ARIA label: "Copy code"
- Keyboard accessible (Tab + Enter)
- Visual feedback (success/error states)

#### 4. TOC Feature (`features/toc/`)
**Purpose**: Auto-generate table of contents from headings

**Components**:
- `toc.ts`: Core TOC logic
- Parses h2-h6 headings
- Creates hierarchical list
- Scroll spy highlighting
- Smooth navigation

**Flow**:
```
Page loads
    ↓
Parse all h2-h6 headings
    ↓
Create hierarchical TOC structure
    ↓
Render TOC (usually in sidebar)
    ↓
Listen to scroll events (throttled 100ms)
    ↓
Update active TOC item based on viewport
    ↓
User clicks TOC item
    ↓
Smooth scroll to heading
```

**Performance**:
- Throttle scroll events (100ms) to reduce reflows
- Use Intersection Observer (future optimization)

**Accessibility**:
- Proper heading hierarchy (h1 → h6)
- Links to headings with `id` attributes
- Keyboard navigation (Tab between TOC items)

### Layer 4: Services (Business Logic)

#### ConfigService (`services/config.service.ts`)
Singleton providing application configuration:
- `isProduction`: boolean (NODE_ENV check)
- `siteConfig`: Site metadata (title, description, etc.)
- `getConfig()`: Unified config access

**Pattern**: Singleton with getInstance()

### Layer 5: Utilities

#### DOM Utilities (`modules/utils/dom.ts`)
Type-safe DOM query helpers:
- `querySelector<T>(selector, parent?)`: Query single element
- `queryAll<T>(selector, parent?)`: Query multiple elements
- Type casting built-in for safety

**Benefit**: Avoids repeated DOM queries; type-safe selectors

#### Hooks (`hooks/useDeviceDetection.ts`)
Reusable stateful logic:
- `useDeviceDetection()`: Detect mobile vs. desktop
- Returns boolean that updates on resize
- Memoized for performance

## Data Flow

### Unidirectional State Flow

```
┌─────────────────────────────────┐
│    User Interaction (Event)     │
│ (click, scroll, keyboard input) │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Feature Handler (Component)   │
│   (Theme Toggle, Nav Button)    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│     StateManager.setState()     │
│   (Update AppState immutably)   │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Notify All Subscribers        │
│   (All listeners notified)      │
└──────────────┬──────────────────┘
               │
        ┌──────┴──────┬──────────┬──────────┐
        ▼             ▼          ▼          ▼
   ┌────────┐  ┌──────────┐ ┌─────────┐ ┌────────┐
   │  Theme │  │Navigation│ │Copy Code│ │  TOC   │
   │ Plugin │  │  Plugin  │ │ Plugin  │ │ Plugin │
   └────┬───┘  └────┬─────┘ └────┬────┘ └───┬────┘
        │           │             │         │
        ├───────────┼─────────────┼─────────┤
        ▼           ▼             ▼         ▼
   ┌──────────────────────────────────────────────┐
   │         Apply DOM Mutations                   │
   │  (Update classes, attributes, content)       │
   └──────────────────────────────────────────────┘
        │
        ├─────────────────┐
        ▼                 ▼
   ┌──────────┐      ┌────────────┐
   │  Browser │      │ localStorage│
   │ Renders  │      │  Persisted   │
   └──────────┘      └────────────┘
```

## State Management

### AppState Structure

```typescript
interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // UI
  isMobileMenuOpen: boolean;
  
  // Environment
  isProduction: boolean;
  
  // Navigation
  navigationState: {
    currentPage: string;
    scrollPosition: number;
  };
}
```

### State Update Pattern

```typescript
// Theme change flow
1. User clicks theme toggle
   
2. ThemeToggle component triggers:
   stateManager.setState({ theme: 'dark' })
   
3. StateManager updates state immutably:
   this.state = { ...this.state, theme: 'dark' }
   
4. StateManager notifies all listeners:
   this.listeners.forEach(listener => listener(newState))
   
5. Each plugin subscribes to updates:
   themePlugin.subscribeToState(state => {
     if (state.theme === 'dark') {
       document.documentElement.classList.add('dark');
     }
   })
   
6. StatePersistence saves to localStorage:
   localStorage.setItem('theme', 'dark')
   
7. Browser applies CSS changes:
   CSS custom properties update (--bg, --text, etc.)
```

## Performance Optimization

### Bundle Size Strategy

**Target**: 13KB production (150KB budget)

1. **Tree Shaking**: Remove unused code via esbuild
2. **Minification**: Compress JavaScript and CSS
3. **No External Dependencies**: All features are custom implementations
4. **Lazy Loading**: Services initialize only when needed
5. **Code Splitting**: Can split features into separate bundles (future)

**Monitoring**:
- `npm run size-check`: Verify bundle doesn't exceed 150KB
- `npm run analyze`: Detailed bundle analysis

### Runtime Performance

1. **Debouncing/Throttling**: Optimize event handlers
   - Scroll events throttled at 100ms (TOC scroll spy)
   - Resize events debounced

2. **DOM Batching**: Group DOM operations
   - Update multiple elements in single query
   - Apply batch classList changes

3. **Event Delegation**: Use event bubbling
   - Single listener on parent instead of individual children
   - Reduces memory and listener count

4. **Service Laziness**: Only initialize services when needed
   - ConfigService created on first access
   - PerformanceMonitor initialized opt-in

## CSS Architecture

### Design Tokens (`css/variables.css`)

```css
:root {
  /* Light theme (default) */
  --bg: #ffffff;
  --bg-alt: #f5f5f5;
  --surface: #ffffff;
  --solid: #2563eb;
  --text: #0f172a;
  --text-muted: #666666;
  --heading: #0f172a;
  --accent: #2563eb;
  
  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
}

:root[data-theme="dark"] {
  /* Dark theme */
  --bg: #0b1120;
  --bg-alt: #1a2332;
  --surface: #2a3548;
  --solid: #6ea8ff;
  --text: #e0e0e0;
  --text-muted: #999999;
  --heading: #ffffff;
  --accent: #6ea8ff;
}
```

### Component Structure

```
css/
├── base/
│   ├── reset.css         # Normalize browser defaults
│   ├── typography.css    # Font faces, sizes, weights
│   ├── buttons.css       # Button styles
│   ├── layout.css        # Grid, flexbox, container queries
│   ├── navigation.css    # Nav menu, links
│   └── spacing.css       # Margin, padding utilities
│
├── components/
│   ├── cards.css         # Card component styles
│   ├── forms.css         # Form inputs, labels
│   ├── projects.css      # Project showcase styles
│   ├── swiftui.css       # SwiftUI page styles
│   └── calculator.css    # Lifetime calculator styles
│
├── utilities/
│   ├── display.css       # display utilities
│   ├── alignment.css     # text-align, justify-content
│   └── spacing.css       # margin, padding utilities
│
└── override.css          # Post/case-study specific tweaks (75.5KB)
```

### Theme Application Flow

```
1. Load page with theme="system" (default)

2. JavaScript checks:
   - localStorage.getItem('theme')
   - matchMedia('(prefers-color-scheme: dark)').matches
   - User selection (if exists)

3. Apply to DOM:
   document.documentElement.setAttribute('data-theme', 'dark')

4. CSS responds:
   :root[data-theme="dark"] { --bg: #0b1120; }

5. All components use CSS variables:
   body { background: var(--bg); color: var(--text); }
```

## Testing Architecture

### Test Pyramid

```
        /\
       /  \  <- E2E Tests (Full app integration)
      /    \ (Vitest + jsdom, full-app.test.ts)
     /______\

      /\
     /  \    <- Integration Tests
    /    \   (State management, service interaction)
   /______\

      /\
     /  \    <- Unit Tests (70% coverage)
    /    \   (Individual functions, components)
   /______\
```

### Test Setup (`src/test/setup.ts`)

```typescript
1. Mock localStorage (persistence testing)
2. Mock matchMedia (theme preference)
3. Mock Clipboard API (copy-code testing)
4. Mock DOM APIs (DOM utility testing)
5. Configure jsdom environment
6. Setup window/document globals
```

### Example Test Flow

```typescript
describe('ThemeToggle Component', () => {
  // Arrange: Setup initial state and mocks
  beforeEach(() => {
    document.body.innerHTML = '<button class="theme-toggle">🌙</button>';
    localStorage.clear();
  });

  it('should toggle theme', () => {
    // Arrange
    const button = document.querySelector<HTMLButtonElement>('.theme-toggle');
    
    // Act
    button?.click();
    
    // Assert
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

## Deployment & Hosting

### GitHub Pages Hosting

**Process**:
1. Push to `main` branch
2. GitHub Actions builds site (Jekyll + esbuild)
3. Output published to `gh-pages` branch
4. Served via CDN at https://quocnv15.github.io

**Build Process** (`npm run build:prod`):
1. Set `NODE_ENV=production`
2. Run esbuild: `src/ts/main.ts` → `assets/js/main.js` (13KB)
3. Run Jekyll: Generate static HTML from `_posts/`, `_projects/`, etc.
4. Output to `_site/` directory
5. Deployed by GitHub Pages

### Environment Variables

```bash
# Development
NODE_ENV=development
  → Source maps enabled
  → Debug logging active
  → Larger bundles (24.6KB)

# Production
NODE_ENV=production
  → Tree shaking enabled
  → Minification applied
  → Bundles optimized (13KB)
```

## Integration Points

### Content Sync (`scripts/sync-content.sh`)

Bidirectional sync with `ios-memory` repository:
- Dashboard HTML (portfolio board)
- Case study markdown + frontmatter
- Portfolio metadata
- Keeps public site in sync with private memory

### Data Generation (`scripts/generate-docs.js`)

TypeDoc integration:
- Parse TypeScript interfaces
- Generate API documentation
- Create architecture docs

## Scalability Considerations

### Current Limitations
- Static site (no database)
- Client-side only (no backend)
- GitHub Pages hosting (no custom server)

### Future Scalability
- Add search via Lunr.js or Algolia (JavaScript-based)
- Add comments via Disqus or GitHub Discussions (third-party)
- Add analytics via Plausible or Fathom (privacy-first)
- Add newsletter integration via Substack or Buttondown

## Summary

The architecture balances **simplicity** with **sophistication**:

- **Simplicity**: Static site, no database, GitHub Pages hosting
- **Sophistication**: Reactive state management, plugin system, comprehensive testing
- **Performance**: 13KB bundle, <1.5s FCP, smooth interactions
- **Maintainability**: Modular features, type-safe code, automated testing
- **Accessibility**: WCAG 2.1 AA compliant throughout

This design allows the site to evolve without major rewrites, while maintaining excellent performance and user experience.

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-22  
**Next Review**: 2026-10-22
