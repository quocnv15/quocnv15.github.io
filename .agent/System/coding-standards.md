# Coding Standards & Quality Guidelines

## 📋 Overview

Documentation về coding standards, style guidelines, và quality requirements cho project.

**Last Updated:** 2025-01-XX  
**Status:** ✅ Active  
**Applies To:** All code contributions

## 🎯 Core Principles

### 1. Readability First
- **Code should be written to minimize the time it takes for someone else to understand it**
- Prefer clarity over cleverness
- Self-documenting code > comments
- Consistent patterns across codebase

### 2. Maintainability
- DRY (Don't Repeat Yourself)
- Single Responsibility Principle
- Modular and reusable components
- Clear separation of concerns

### 3. Quality Standards
- TypeScript strict mode enabled
- No `any` types without justification
- Comprehensive error handling
- Accessible and semantic HTML

## 📝 TypeScript Standards

### Type Safety

```typescript
// ✅ Good - Explicit types
interface UserConfig {
  readonly id: string;
  name: string;
  age?: number;
}

function getUser(id: string): Promise<User | null> {
  return fetchUser(id);
}

// ❌ Bad - Avoid 'any'
function getData(id: any): any {
  return fetch(id);
}

// ✅ Good - Use proper types
function processData<T>(data: T[]): T[] {
  return data.filter(item => item !== null);
}
```

### Naming Conventions

```typescript
// Classes: PascalCase
class UserManager {}
class ThemeService {}

// Interfaces: PascalCase (often with descriptive suffix)
interface UserConfig {}
interface ThemeOptions {}

// Variables & Functions: camelCase
const currentUserName = '';
const maxRetries = 3;
function calculateReadTime() {}

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 3;
const DEFAULT_THEME = 'light';

// Private members: prefix with underscore (if needed)
class Example {
  private _internalState = '';
  private cleanupFunctions: (() => void)[] = [];
}
```

### Code Organization

```typescript
// ✅ Good - Clear structure
export class ThemeManager {
  // 1. Private properties
  private currentTheme: Theme = 'light';
  private listeners: Set<ThemeListener> = new Set();

  // 2. Constructor
  constructor(private storage: StorageService) {}

  // 3. Public methods
  public setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.notifyListeners();
  }

  // 4. Private methods
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme));
  }
}

// ❌ Bad - Unorganized
export class ThemeManager {
  private notifyListeners() {}
  public setTheme() {}
  private currentTheme = '';
  constructor() {}
}
```

### Error Handling

```typescript
// ✅ Good - Explicit error handling
async function fetchUserData(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      console.error(`Failed to fetch user: ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// ❌ Bad - Silent failures
async function fetchUserData(id: string) {
  return await fetch(`/api/users/${id}`).then(r => r.json());
}
```

### Comments & Documentation

```typescript
// ✅ Good - JSDoc for public APIs
/**
 * Calculates read time for a post based on its categories.
 * 
 * @param categories - Array of post categories
 * @param customTime - Optional custom read time override
 * @returns Read time in minutes
 * 
 * @example
 * ```typescript
 * const time = calculateReadTime(['iOS', 'Interview'], 15);
 * // Returns: 15 (custom override)
 * ```
 */
export function calculateReadTime(
  categories: string[],
  customTime?: number
): number {
  // Implementation
}

// ✅ Good - Inline comments explain WHY, not WHAT
// Use localStorage for persistence to survive page reloads
const storage = new LocalStorageService();

// ❌ Bad - Comments that just repeat code
// Set the theme to light
theme.setTheme('light');
```

## 🎨 HTML/Liquid Standards

### Semantic HTML

```html
<!-- ✅ Good - Semantic structure -->
<article class="post-card">
  <header class="post-header">
    <h2 class="post-title">
      <a href="{{ post.url }}">{{ post.title }}</a>
    </h2>
  </header>
  <div class="post-content">
    <p class="post-excerpt">{{ post.excerpt }}</p>
  </div>
  <footer class="post-footer">
    <time datetime="{{ post.date }}">{{ formatted_date }}</time>
  </footer>
</article>

<!-- ❌ Bad - Non-semantic -->
<div class="post-card">
  <div class="post-header">
    <div class="post-title">{{ post.title }}</div>
  </div>
  <div class="post-content">{{ post.excerpt }}</div>
</div>
```

### Liquid Template Best Practices

```liquid
{%- comment -%}
  ✅ Good - Use includes for reusable components
{%- endcomment -%}
{% include post-card.html post=post %}

{%- comment -%}
  ✅ Good - Use filters appropriately
{%- endcomment -%}
{{ post.title | escape }}
{{ post.date | date: "%b %-d, %Y" }}

{%- comment -%}
  ✅ Good - Consistent spacing with Liquid tags
{%- endcomment -%}
{%- if post.categories contains 'iOS' -%}
  {%- include post-card.html post=post -%}
{%- endif -%}

{%- comment -%}
  ❌ Bad - Inconsistent spacing
{%- endcomment -%}
{%if post.categories contains 'iOS'%}
{% include post-card.html post=post %}
{%endif%}
```

### Accessibility

```html
<!-- ✅ Good - Accessible form controls -->
<label for="searchInput" class="sr-only">Search articles</label>
<input 
  type="text" 
  id="searchInput" 
  class="search-input" 
  placeholder="Search articles..."
  aria-label="Search articles by title, content, or tags"
>

<!-- ✅ Good - ARIA labels for interactive elements -->
<button 
  class="nav-toggle" 
  id="navToggle" 
  aria-label="Toggle navigation"
  aria-expanded="false"
>
  <span class="nav-toggle-icon"></span>
</button>

<!-- ✅ Good - Semantic landmarks -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>
```

## 🎨 CSS Standards

### Naming Conventions

```css
/* ✅ Good - BEM-like naming */
.post-card { }
.post-card__title { }
.post-card__title--featured { }
.post-card__meta { }

/* ✅ Good - Semantic class names */
.search-input { }
.nav-link { }
.metric-value { }

/* ❌ Bad - Non-descriptive */
.box { }
.red-text { }
.big { }
```

### Organization

```css
/* ✅ Good - Logical grouping */
/* ========================================
   POST CARD COMPONENT
   ======================================== */

.post-card {
  /* Layout */
  display: flex;
  flex-direction: column;
  
  /* Spacing */
  padding: 1.5rem;
  margin-bottom: 1rem;
  
  /* Visual */
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  /* Transitions */
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */

@media (max-width: 768px) {
  .post-card {
    padding: 1rem;
  }
}
```

### CSS Variables

```css
/* ✅ Good - Use CSS custom properties for theming */
:root {
  --color-primary: #3498db;
  --color-text: #2c3e50;
  --color-text-secondary: #5a6c7d;
  --spacing-unit: 1rem;
  --border-radius: 12px;
}

.button {
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
}
```

## 📁 File Structure Standards

### TypeScript Files

```
src/ts/
├── main.ts                    # Entry point
├── modules/                   # Feature modules
│   ├── post-list-navigation.ts
│   └── utils/
│       └── dom.ts
├── features/                  # Feature-specific code
│   ├── theme/
│   │   └── theme.ts
│   └── navigation/
│       └── navigation.ts
└── core/                      # Core utilities
    ├── types/
    │   └── feature.types.ts
    └── services/
        └── storage.service.ts
```

### Naming Patterns

- **Components**: `feature-name.ts` or `feature.component.ts`
- **Services**: `feature.service.ts`
- **Types**: `feature.types.ts`
- **Utilities**: `utility-name.ts`
- **Tests**: `feature.test.ts`

### File Organization

```typescript
// ✅ Good - Clear file structure
/**
 * Feature: Theme Management
 * Handles theme switching and persistence
 */

// 1. Imports
import { StorageService } from '@/core/services/storage.service';
import type { Theme, ThemeListener } from '@/core/types/theme.types';

// 2. Constants
const THEME_STORAGE_KEY = 'theme';
const DEFAULT_THEME: Theme = 'light';

// 3. Class/Function definitions
export class ThemeManager {
  // Implementation
}

// 4. Exports (if needed)
export { ThemeManager };
```

## ✅ Code Quality Requirements

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Required Checks Before Commit

1. **Type Checking**
   ```bash
   npm run check:types
   ```

2. **Build Verification**
   ```bash
   npm run build
   ```

3. **Jekyll Build**
   ```bash
   bundle exec jekyll build
   ```

4. **No Console Errors**
   - Check browser console
   - Verify no TypeScript errors
   - Ensure no runtime errors

### Code Review Checklist

- [ ] TypeScript types are explicit (no `any` without justification)
- [ ] Code follows naming conventions
- [ ] Error handling is comprehensive
- [ ] Comments explain WHY, not WHAT
- [ ] HTML is semantic and accessible
- [ ] CSS follows BEM-like naming
- [ ] No console.log statements in production code
- [ ] All functions have clear return types
- [ ] Code is DRY (no duplication)
- [ ] Responsive design tested on mobile

## 🧪 Testing Standards

### Unit Tests

```typescript
// ✅ Good - Comprehensive test coverage
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeManager } from './theme';

describe('ThemeManager', () => {
  let themeManager: ThemeManager;
  let mockStorage: StorageService;

  beforeEach(() => {
    mockStorage = new MockStorageService();
    themeManager = new ThemeManager(mockStorage);
  });

  it('should set theme correctly', () => {
    themeManager.setTheme('dark');
    expect(themeManager.getCurrentTheme()).toBe('dark');
  });

  it('should persist theme to storage', () => {
    themeManager.setTheme('dark');
    expect(mockStorage.getItem('theme')).toBe('dark');
  });
});
```

### Test Requirements

- Unit tests for all utility functions
- Integration tests for feature modules
- DOM tests for interactive components
- Test coverage > 80% for critical paths

## 📚 Documentation Standards

### Code Documentation

```typescript
/**
 * Calculates read time for blog posts based on categories.
 * 
 * Read time calculation rules:
 * - Architecture/Flutter: 20 min
 * - Interview: 15 min
 * - AI/Strategy: 12 min
 * - iOS: 10 min
 * - Data Structures: 8 min
 * - Swift: 6 min
 * - Default: 5 min
 * 
 * @param categories - Array of post categories
 * @param customTime - Optional override (takes precedence)
 * @returns Read time in minutes
 * 
 * @example
 * ```typescript
 * calculateReadTime(['iOS', 'Interview']); // Returns: 15
 * calculateReadTime(['iOS'], 20); // Returns: 20 (custom)
 * ```
 */
export function calculateReadTime(
  categories: string[],
  customTime?: number
): number {
  // Implementation
}
```

### README Updates

- Update `.agent/README.md` when adding new features
- Document breaking changes
- Include examples for new APIs
- Update quick reference section

## 🚫 Anti-Patterns to Avoid

### TypeScript

```typescript
// ❌ Bad - Using 'any'
function process(data: any): any {
  return data.map(item => item.value);
}

// ✅ Good - Proper types
function process<T extends { value: number }>(data: T[]): number[] {
  return data.map(item => item.value);
}

// ❌ Bad - Silent failures
function getUser(id: string) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// ✅ Good - Error handling
async function getUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
```

### HTML/Liquid

```liquid
{%- comment -%}
  ❌ Bad - Path-based filtering
{%- endcomment -%}
{% if post.path contains 'iOS' %}

{%- comment -%}
  ✅ Good - Category-based filtering
{%- endcomment -%}
{% if post.categories contains 'iOS' %}
```

### CSS

```css
/* ❌ Bad - Non-semantic classes */
.red { color: red; }
.big { font-size: 2rem; }

/* ✅ Good - Semantic classes */
.error-message { color: #e74c3c; }
.heading-large { font-size: 2rem; }
```

## 🔍 Code Review Guidelines

### What to Look For

1. **Type Safety**
   - No `any` types
   - Proper null checks
   - Type guards where needed

2. **Readability**
   - Clear variable names
   - Logical code organization
   - Appropriate comments

3. **Performance**
   - No unnecessary re-renders
   - Efficient DOM queries
   - Proper event listener cleanup

4. **Accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation support

5. **Maintainability**
   - DRY principle
   - Reusable components
   - Clear separation of concerns

## 📊 Quality Metrics

### Target Metrics

- **Type Coverage**: 100% (no `any` without justification)
- **Test Coverage**: >80% for critical paths
- **Build Time**: <2 seconds
- **Bundle Size**: <20KB (minified)
- **Lighthouse Score**: >90 for all categories

### Monitoring

```bash
# Type checking
npm run check:types

# Bundle size
npm run size-check

# Build verification
npm run build

# Test coverage
npm run test:coverage
```

## 🔄 Update History

- **2025-01-XX:** Initial coding standards documentation
- Based on existing project patterns and best practices

## 📚 References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)

