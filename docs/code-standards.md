# Code Standards & Structure

## Overview

This document defines coding standards, patterns, and conventions for the quocnv15.github.io project. All code follows TypeScript strict mode, emphasizing type safety, maintainability, and performance.

## TypeScript Standards

### Strict Mode Enforcement
```typescript
// tsconfig.json enforces:
{
  "compilerOptions": {
    "strict": true,                      // All strict checks enabled
    "noImplicitAny": true,               // No implicit 'any' types
    "strictNullChecks": true,            // Strict null/undefined checks
    "strictFunctionTypes": true,         // Strict function parameter checking
    "noImplicitThis": true,              // No implicit 'this' type
    "alwaysStrict": true,                // ECMAScript 'use strict' mode
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Definitions

**Use explicit types for:**
- Function parameters and return types
- Public class properties
- Module exports
- Event handlers
- Callback functions

```typescript
// ✅ Good: Explicit types
function processTheme(mode: 'light' | 'dark' | 'system'): void {
  // ...
}

const handleClick = (event: MouseEvent): void => {
  // ...
};

// ❌ Avoid: Implicit types
function processTheme(mode) {
  // ...
}

const handleClick = (event) => {
  // ...
};
```

### Type Organization

```typescript
// src/ts/types/
// - Central location for global types
// - Organized by domain (post.ts, feature.types.ts, etc.)
// - Exported from index.ts for convenience

export type Theme = 'light' | 'dark' | 'system';
export type ContentType = 'post' | 'project' | 'case-study';
export interface AppConfig {
  theme: Theme;
  isProduction: boolean;
  version: string;
}
```

### Generic Types

Use generics for reusable, type-safe components:

```typescript
// ✅ Good: Generic service factory
interface ServiceFactory<T> {
  create(): T;
  getInstance(): T;
}

class SingletonService<T> implements ServiceFactory<T> {
  private static instance: T;
  
  create(): T {
    return new T();
  }
  
  getInstance(): T {
    return SingletonService.instance;
  }
}

// ❌ Avoid: Separate implementations for each type
class ThemeServiceFactory { /* ... */ }
class NavigationServiceFactory { /* ... */ }
```

## Code Organization

### Directory Structure

```
src/ts/
├── main.ts                    # Entry point - initializes app
├── components/                # Reusable UI components
│   ├── base.component.ts      # Abstract base class
│   ├── component-registry.ts  # Component registration
│   └── theme-toggle.component.ts
│
├── core/                       # Infrastructure & state management
│   ├── app-state.ts           # Central state container
│   ├── service-factory.ts     # Service initialization
│   ├── plugin-system.ts       # Plugin architecture
│   ├── state-manager.ts       # Reactive state updates
│   ├── state-persistence.ts   # localStorage integration
│   ├── state-debug-tools.ts   # Development tools
│   ├── performance-monitor.ts # Performance tracking
│   ├── cleanup-manager.ts     # Resource cleanup
│   └── types/                 # Core type definitions
│
├── features/                   # Feature implementations (newer pattern)
│   ├── theme/
│   │   └── theme.ts           # Theme system
│   ├── navigation/
│   │   └── navigation.ts       # Mobile navigation
│   ├── copy-code/
│   │   └── copy-code.ts        # Copy to clipboard
│   └── toc/
│       └── toc.ts             # Table of contents
│
├── modules/                    # Legacy feature modules (gradual migration)
│   ├── theme.ts
│   ├── navigation.ts
│   ├── copy-code.ts
│   ├── toc.ts
│   └── utils/
│       └── dom.ts
│
├── services/                   # Business logic & external integrations
│   └── config.service.ts       # Configuration management
│
├── hooks/                      # Custom hooks (reusable stateful logic)
│   └── useDeviceDetection.ts
│
├── constants/                  # Application constants
│   └── index.ts
│
├── interfaces/                 # Legacy interfaces (gradual removal)
│   └── types.ts
│
└── test/                       # Test files (mirror src/ts structure)
    ├── setup.ts                # Test configuration
    ├── unit/
    ├── integration/
    └── services/
```

### Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| **Files** | kebab-case | `theme-toggle.component.ts`, `config.service.ts` |
| **Classes** | PascalCase | `ConfigService`, `ThemeToggle`, `StateManager` |
| **Functions** | camelCase | `handleThemeChange`, `initializeApp`, `getConfig` |
| **Constants** | UPPER_SNAKE_CASE | `DEFAULT_THEME`, `MAX_RETRIES`, `SELECTORS` |
| **Variables** | camelCase | `isDarkMode`, `isMobileMenuOpen`, `configuration` |
| **Types** | PascalCase | `Theme`, `AppState`, `FeatureConfig` |
| **Enums** | PascalCase | `ThemeMode`, `ContentType` |
| **Interfaces** | PascalCase (no `I` prefix) | `StateManager`, `Service` |
| **React/Component Props** | camelCase | `onThemeChange`, `isVisible` |

### File-to-Feature Mapping

- **One feature per file** (or very closely related features)
- **No barrel exports** (use explicit imports for clarity)
- **Service → Test** naming: `config.service.ts` → `config.service.test.ts`

```typescript
// ✅ Good: Explicit imports
import { ConfigService } from '@/services/config.service';
import { handleThemeToggle } from '@/features/theme/theme';
import type { Theme } from '@/types';

// ❌ Avoid: Barrel exports hiding dependencies
import { ConfigService, Theme, handleThemeToggle } from '@/core';
```

## Patterns & Architecture

### Plugin System

Features initialize via a plugin pattern in `main.ts`:

```typescript
// src/ts/core/plugin-system.ts
export interface Plugin {
  name: string;
  version: string;
  initialize(state: AppState): void | Promise<void>;
  cleanup?(): void;
}

// src/ts/main.ts
import { themePlugin } from '@/features/theme/theme';
import { navigationPlugin } from '@/features/navigation/navigation';
import { copyCodePlugin } from '@/features/copy-code/copy-code';
import { tocPlugin } from '@/features/toc/toc';

const plugins: Plugin[] = [
  themePlugin,
  navigationPlugin,
  copyCodePlugin,
  tocPlugin
];

pluginSystem.registerPlugins(plugins);
```

### Service Singleton Pattern

Services are lazy-loaded singletons via `ServiceFactory`:

```typescript
// src/ts/core/service-factory.ts
export class ServiceFactory {
  private static services: Map<string, any> = new Map();
  
  static register<T>(name: string, factory: () => T): void {
    // Lazy initialization
  }
  
  static get<T>(name: string): T {
    // Returns singleton instance
  }
}

// Usage
const config = ServiceFactory.get<ConfigService>('config');
```

### State Management

Central reactive state with subscription pattern:

```typescript
// src/ts/core/app-state.ts
export interface AppState {
  theme: Theme;
  isMobileMenuOpen: boolean;
  isProduction: boolean;
  navigationState: NavigationState;
}

// src/ts/core/state-manager.ts
export class StateManager {
  private state: AppState;
  private listeners: Set<Listener> = new Set();
  
  setState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }
  
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
```

### DOM Utilities

Type-safe DOM operations in `modules/utils/dom.ts`:

```typescript
// ✅ Good: Type-safe DOM utilities
export function querySelector<T extends Element>(
  selector: string,
  parent?: Document | Element
): T | null {
  return (parent || document).querySelector(selector) as T | null;
}

export function queryAll<T extends Element>(
  selector: string,
  parent?: Document | Element
): T[] {
  return Array.from((parent || document).querySelectorAll(selector)) as T[];
}

// Usage
const button = querySelector<HTMLButtonElement>('.theme-toggle');
button?.addEventListener('click', handleToggle);
```

### Component Base Class

Reusable component foundation:

```typescript
// src/ts/components/base.component.ts
export abstract class BaseComponent {
  protected element: HTMLElement;
  protected listeners: Array<() => void> = [];
  
  constructor(selector: string) {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    this.element = el as HTMLElement;
  }
  
  abstract initialize(): void;
  
  protected addEventListener(
    target: EventTarget,
    event: string,
    handler: EventListener
  ): void {
    target.addEventListener(event, handler);
    this.listeners.push(() => target.removeEventListener(event, handler));
  }
  
  cleanup(): void {
    this.listeners.forEach(remove => remove());
  }
}

// Implementation
export class ThemeToggle extends BaseComponent {
  initialize(): void {
    this.addEventListener(this.element, 'click', () => this.toggle());
  }
  
  private toggle(): void {
    // Toggle logic
  }
}
```

## Testing Standards

### Test Structure (AAA Pattern)

```typescript
// Arrange - Set up test conditions
// Act - Execute the code being tested
// Assert - Verify the results

describe('ConfigService', () => {
  it('should return default configuration', () => {
    // Arrange
    const service = new ConfigService();
    
    // Act
    const config = service.getSiteConfig();
    
    // Assert
    expect(config.theme).toBe('system');
    expect(config.isProduction).toBe(false);
  });
});
```

### Test Organization

```
src/test/
├── setup.ts                  # Global test configuration
├── unit/
│   ├── modules/
│   │   ├── theme.test.ts
│   │   ├── navigation.test.ts
│   │   └── copy-code.test.ts
│   ├── services/
│   │   └── config.service.test.ts
│   ├── components/
│   │   └── theme-toggle.test.ts
│   └── utils/
│       └── dom.test.ts
├── integration/
│   ├── full-app.test.ts
│   └── state-management.test.ts
└── services/
    └── config.service.test.ts
```

### Mocking Strategy

```typescript
// src/test/setup.ts
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
});
```

### Coverage Expectations

- **Target**: >80% coverage for new code
- **Critical Paths**: 100% coverage (state management, services)
- **UI Components**: >60% coverage (harder to test DOM)
- **Utilities**: 100% coverage (pure functions)

## Performance Guidelines

### Bundle Size

- **Target**: <150KB (currently 13KB)
- **Monitor**: Track bundle size in every PR
- **Alert**: Fail if bundle exceeds 150KB
- **Tree Shaking**: Remove unused code via esbuild

```typescript
// ✅ Good: Tree-shakeable exports
export { ConfigService } from '@/services/config.service';
export { theme as themePlugin } from '@/features/theme/theme';

// ❌ Avoid: Side effects at module level
window.addEventListener('load', () => { /* ... */ }); // Prevents tree shaking
```

### Initialization Performance

```typescript
// ✅ Good: Lazy initialization
const getConfig = () => {
  if (!ConfigService.instance) {
    ConfigService.instance = new ConfigService();
  }
  return ConfigService.instance;
};

// ❌ Avoid: Eager initialization
const config = new ConfigService(); // Runs on page load
```

### DOM Operations

```typescript
// ✅ Good: Batch DOM updates
const elements = querySelectorAll<HTMLElement>('.theme-item');
elements.forEach(el => {
  el.classList.toggle('active');
  el.setAttribute('aria-selected', 'true');
});

// ❌ Avoid: Repeated DOM queries
for (let i = 0; i < 100; i++) {
  document.querySelector('.theme-item')?.classList.toggle('active');
}
```

### Event Handler Optimization

```typescript
// ✅ Good: Throttled scroll events
const handleScroll = throttle(() => {
  updateActiveTableOfContents();
}, 100);

window.addEventListener('scroll', handleScroll);

// ❌ Avoid: Every scroll event triggers work
window.addEventListener('scroll', updateActiveTableOfContents);
```

## Documentation Standards

### JSDoc Comments

Document public APIs with JSDoc:

```typescript
/**
 * Toggles the application theme between light and dark modes.
 * 
 * Architecture Decision: Theme toggle is centralized in StateManager
 * to avoid scattered theme switching logic. All theme changes go through
 * state updates to maintain consistency and enable persistence.
 * 
 * @param mode - The theme mode to set ('light' | 'dark' | 'system')
 * @returns void
 * 
 * @example
 * ```typescript
 * themeManager.setTheme('dark');
 * // Applies dark theme, triggers listeners, persists to localStorage
 * ```
 */
export function setTheme(mode: Theme): void {
  // Implementation
}

/**
 * Configuration service for application settings.
 * 
 * Business Rationale: Centralizes config management to enable:
 * - Environment-specific settings (dev vs. production)
 * - Easy feature flag toggling
 * - Type-safe config access
 * 
 * Trade-off: Singleton pattern limits testability, but improves
 * initialization performance and simplifies dependency injection.
 */
export class ConfigService {
  private static instance: ConfigService;
  
  private constructor() {}
  
  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
}
```

### Comment Guidelines

- **Avoid**: Redundant comments explaining what code does
- **Include**: Architecture decisions, business rationale, trade-offs
- **Focus**: "Why" over "What"

```typescript
// ❌ Bad: Redundant comments
const isDarkMode = true; // Set isDarkMode to true

// ✅ Good: Explains reasoning
// Architecture Decision: Check system preference first to provide
// seamless experience on first visit, then respect user override
// from localStorage if available.
const isDarkMode = localStorage.getItem('theme') || 
  matchMedia('(prefers-color-scheme: dark)').matches;
```

## Accessibility Standards

### Keyboard Navigation

All interactive elements must be keyboard accessible:

```typescript
// ✅ Good: Handles keyboard events
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeMobileMenu();
  }
  if (event.key === 'Tab') {
    manageFocusOrder();
  }
};
```

### ARIA Labels

Semantic HTML with proper ARIA attributes:

```typescript
// ✅ Good: Clear ARIA labels
<button
  class="theme-toggle"
  aria-label="Toggle dark mode"
  aria-pressed="false"
>
  🌙
</button>

// ❌ Avoid: Missing ARIA attributes
<button class="theme-toggle">Toggle</button>
```

### Color Contrast

Ensure 4.5:1 contrast ratio for normal text, 3:1 for large text:

```css
/* ✅ Good: High contrast */
.text-primary {
  color: #0f172a; /* Dark text on light bg = 16.5:1 contrast */
  background: #ffffff;
}

/* ❌ Avoid: Low contrast */
.text-muted {
  color: #999999; /* Gray on white = 5.9:1 contrast (fails AA) */
  background: #ffffff;
}
```

## Error Handling

### Graceful Degradation

```typescript
// ✅ Good: Handles failures gracefully
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try modern Clipboard API first
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback to old method
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// ❌ Avoid: Silent failures
async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text); // May fail silently
}
```

### Error Boundaries

```typescript
// ✅ Good: Catches initialization errors
try {
  pluginSystem.registerPlugins([...]);
  console.info('✅ App initialized successfully');
} catch (error) {
  console.error('❌ App initialization failed:', error);
  // Fall back to minimal functionality
}
```

## Git & Commit Standards

### Conventional Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add table of contents scroll spy
fix: resolve theme toggle event handler leak
docs: update code standards documentation
style: align CSS variable naming conventions
refactor: extract DOM utilities into separate module
test: add integration tests for state persistence
chore: update dependencies
```

### Commit Message Guidelines

- **Lowercase** first letter of description
- **No period** at end of description
- **Imperative mood**: "add feature" not "added feature"
- **Separate concerns**: One feature per commit
- **Reference issues**: "fix: resolve #123" if applicable

### Pull Request Standards

- **Title**: Use conventional commit format
- **Description**: Explain what changed and why
- **Testing**: Document how to test the change
- **Review**: Request 1+ reviewers before merging
- **CI**: All checks must pass before merge

## Security Practices

### Content Security

- No eval() or similar dynamic code execution
- Sanitize user input (none in static site, but practice anyway)
- Validate Markdown content on Jekyll build

### Dependency Management

```bash
# Regular security audits
npm audit

# Update dependencies regularly
npm update

# Check for known vulnerabilities
npm audit fix
```

### Environment Variables

- Never commit secrets
- Use `.env.local` (git-ignored) for local config
- Document required env vars in `.env.example`

## Summary Checklist

Before committing code, verify:

- [ ] TypeScript strict mode passes (no `any` types)
- [ ] Tests pass locally (`npm run test`)
- [ ] No console errors or warnings
- [ ] Bundle size checked (`npm run size-check`)
- [ ] Accessibility audit passes (`npm run check:design`)
- [ ] JSDoc comments added for public APIs
- [ ] Proper naming conventions followed
- [ ] Error handling implemented
- [ ] Performance impact considered
- [ ] Related documentation updated
- [ ] Commit message follows conventional format

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-22  
**Next Review**: 2026-10-22
