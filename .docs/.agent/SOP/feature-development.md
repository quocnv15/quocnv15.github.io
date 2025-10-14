# 🚀 Feature Development SOP

## Overview

This Standard Operating Procedure (SOP) outlines the step-by-step process for adding new features to the Jekyll TypeScript frontend, ensuring consistency, quality, and maintainability.

## 🎯 Prerequisites

Before starting any feature development:

1. **Read the system documentation** in `agent/System/`
2. **Check the implementation backlog** in `agent/Tasks/implementation-backlog.md`
3. **Verify the feature is not already planned** or implemented
4. **Create a feature branch** from the latest `main` branch

## 📋 Development Process

### Phase 1: Planning & Design (2-4 hours)

#### 1.1 Feature Definition
- [ ] **Create clear acceptance criteria** for the feature
- [ ] **Define success metrics** and performance requirements
- [ ] **Identify dependencies** on existing systems
- [ ] **Plan the user interface** and interaction patterns
- [ ] **Consider accessibility requirements** from the start

#### 1.2 Architecture Design
- [ ] **Design the TypeScript interfaces** and types needed
- [ ] **Plan the module structure** (component, service, utility)
- [ ] **Define integration points** with existing Jekyll features
- [ ] **Consider the error handling** strategy
- [ ] **Plan for progressive enhancement**

#### 1.3 Documentation Planning
- [ ] **Update the implementation backlog** with task breakdown
- [ ] **Plan documentation updates** required
- [ ] **Identify testing scenarios** needed
- [ ] **Consider migration requirements** for existing data

### Phase 2: Implementation (4-8 hours)

#### 2.1 Setup & Scaffolding
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Create module structure
mkdir -p src/ts/modules/your-feature
mkdir -p src/ts/components/your-feature
mkdir -p src/test/unit/modules/your-feature
```

#### 2.2 Type Definitions First
```typescript
// src/ts/core/types/your-feature.types.ts
export interface YourFeatureConfig {
  enabled: boolean;
  option1: string;
  option2: number;
}

export interface YourFeatureData {
  id: string;
  content: string;
  metadata: Record<string, any>;
}

// Add to main AppConfig interface if needed
export interface AppConfigExtension {
  yourFeatureEnabled: boolean;
  yourFeatureConfig: YourFeatureConfig;
}
```

#### 2.3 Core Module Implementation
```typescript
// src/ts/modules/your-feature/index.ts
import type { YourFeatureConfig, YourFeatureData } from '@/core/types/your-feature.types';
import { CleanupManager } from '@/core/cleanup-manager';

export interface YourFeatureModule {
  init: (config?: YourFeatureConfig) => Promise<void>;
  destroy: () => void;
  update: (data: YourFeatureData) => void;
}

export const createYourFeature = (): YourFeatureModule => {
  let cleanupManager: CleanupManager;
  let config: YourFeatureConfig;

  const init = async (userConfig?: YourFeatureConfig): Promise<void> => {
    config = {
      enabled: true,
      option1: 'default',
      option2: 0,
      ...userConfig
    };

    // Initialize cleanup manager
    cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: process.env.NODE_ENV === 'development'
    });

    // Your feature initialization logic here
    console.log('YourFeature initialized with config:', config);
  };

  const destroy = (): void => {
    if (cleanupManager) {
      cleanupManager.cleanup();
      console.log('YourFeature destroyed');
    }
  };

  const update = (data: YourFeatureData): void => {
    // Your feature update logic here
    console.log('YourFeature updated with data:', data);
  };

  return { init, destroy, update };
};

// Export init function for main.ts integration
export const initYourFeature = async (config?: YourFeatureConfig): Promise<void> => {
  const feature = createYourFeature();
  await feature.init(config);
};

#### 2.4 Component Implementation (if needed)
```typescript
// src/ts/components/your-feature.component.ts
import { BaseComponent } from './base.component';
import type { YourFeatureData } from '../types/your-feature.types';

export class YourFeatureComponent extends BaseComponent {
  constructor(element: HTMLElement, data: YourFeatureData) {
    super(element);
    this.render(data);
  }

  private render(data: YourFeatureData): void {
    // Component rendering logic
  }

  protected cleanup(): void {
    // Component-specific cleanup
  }
}
```

### Phase 3: Testing (2-4 hours)

#### 3.1 Unit Tests
```typescript
// src/test/unit/modules/your-feature.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createYourFeature } from '../../../ts/modules/your-feature';

describe('YourFeature Module', () => {
  let feature: ReturnType<typeof createYourFeature>;

  beforeEach(() => {
    // Setup DOM and test environment
    document.body.innerHTML = '<div id="test-container"></div>';
    feature = createYourFeature();
  });

  afterEach(() => {
    feature.destroy();
  });

  it('should initialize successfully', async () => {
    await expect(feature.init()).resolves.not.toThrow();
  });

  it('should handle configuration options', async () => {
    const config = { enabled: true, option1: 'test' };
    await feature.init(config);
    // Add expectations
  });
});
```

#### 3.2 Integration Tests
```typescript
// src/test/integration/your-feature.integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { initializeApp } from '../../ts/main';

describe('YourFeature Integration', () => {
  beforeEach(() => {
    // Setup full application context
    setupTestDOM();
  });

  it('should integrate with main application', async () => {
    await initializeApp();
    // Test integration points
  });
});
```

#### 3.3 Performance Tests
- [ ] **Bundle size impact** measured and documented
- [ ] **Runtime performance** benchmarked
- [ ] **Memory usage** analyzed for leaks
- [ ] **Load time impact** measured

### Phase 4: Documentation (1-2 hours)

#### 4.1 Code Documentation
- [ ] **JSDoc comments** added to all public APIs
- [ ] **Inline comments** for complex logic
- [ ] **Type definitions** documented with examples
- [ ] **README files** created for complex modules

#### 4.2 System Documentation Updates
- [ ] **Update `agent/README.md`** with new feature
- [ ] **Update `agent/System/tech-stack.md`** if new dependencies added
- [ ] **Update `agent/System/jekyll-architecture.md`** with integration details
- [ ] **Create feature-specific documentation** if needed

#### 4.3 User Documentation
- [ ] **Update project README** if user-facing
- [ ] **Create usage examples** and code samples
- [ ] **Document configuration options** and defaults
- [ ] **Add troubleshooting guide** for common issues

## 🔧 Integration Guidelines

### Path Aliases & Import Structure

#### 1. Available Path Aliases
```typescript
// Current tsconfig.json path mappings
'@/*': ['src/*']
'@/types/*': ['src/types/*']
'@/core/*': ['src/core/*']
'@/core/types/*': ['src/core/types/*']
'@/constants/*': ['src/constants/*']
'@/components/*': ['src/components/*']
'@/services/*': ['src/services/*']
'@/hooks/*': ['src/hooks/*']
'@/modules/*': ['src/modules/*']
'@/utils/*': ['src/modules/utils/*']
```

#### 2. Import Best Practices
```typescript
// ✅ Use path aliases for imports
import type { AppConfig } from '@/core/types';
import { CleanupManager } from '@/core/cleanup-manager';
import { initTheme } from '@/modules/theme';

// ❌ Avoid relative imports when possible
import type { AppConfig } from '../../core/types';
import { CleanupManager } from '../../core/cleanup-manager';
```

### Jekyll Integration

#### 1. Front Matter Configuration
```yaml
---
title: "Your Post"
your_feature:
  enabled: true
  option1: "custom value"
---
```

#### 2. Liquid Template Integration
```liquid
{% if page.your_feature.enabled %}
<div class="your-feature-container" data-config="{{ page.your_feature | jsonify }}">
  <!-- Your feature HTML -->
</div>
{% endif %}
```

#### 3. JavaScript Initialization
```typescript
// In main.ts add import and initialization
import { initYourFeature } from './modules/your-feature';
import type { AppConfig } from '@/core/types';

// In initializeApp function, add:
if (config.yourFeatureEnabled) {
  await initYourFeature(config.yourFeatureConfig);
}

// Alternative: DOM-based initialization
if (document.querySelector('.your-feature-container')) {
  const { initYourFeature } = await import('./modules/your-feature');
  await initYourFeature();
}
```

### Theme Integration

#### 1. CSS Variables
```scss
.your-feature-container {
  --your-feature-bg: var(--bg-secondary);
  --your-feature-text: var(--text-primary);
  --your-feature-border: var(--border-color);
}
```

#### 2. Dark Theme Support
```scss
[data-theme="dark"] .your-feature-container {
  --your-feature-bg: var(--bg-secondary-dark);
  --your-feature-text: var(--text-primary-dark);
}
```

## 🧪 Quality Gates

### Code Quality Checklist
- [ ] **TypeScript strict mode** compliance
- [ ] **No `any` types** used without justification
- [ ] **No console.log statements** in production code
- [ ] **Error boundaries** implemented where needed
- [ ] **Accessibility attributes** added (ARIA labels, etc.)
- [ ] **Responsive design** considered
- [ ] **Cross-browser compatibility** verified

### Performance Checklist
- [ ] **Bundle size increase** < 1KB (gzipped)
- [ ] **No memory leaks** in cleanup functions
- [ ] **Lazy loading** implemented for non-critical features
- [ ] **Efficient DOM queries** (cached selectors)
- [ ] **Event listener cleanup** implemented

### Testing Checklist
- [ ] **Unit test coverage** > 80% for new code
- [ ] **Integration tests** for main user flows
- [ ] **Edge cases** tested and handled
- [ ] **Error scenarios** tested
- [ ] **Accessibility tests** passed

## 📦 Deployment Process

### Pre-Deployment Checks
```bash
# Run full test suite
npm run test

# Check types
npm run check:types

# Build production version
npm run build:prod

# Check bundle size
npm run size-check

# Run E2E tests (if available)
npm run test:e2e
```

### Deployment Steps
1. **Create pull request** with detailed description
2. **Request code review** from team members
3. **Address review feedback** promptly
4. **Merge to main** after approval
5. **Monitor deployment** for any issues
6. **Update documentation** with deployment notes

## 🔄 Post-Launch Process

### Monitoring
- [ ] **Check browser console** for errors
- [ ] **Monitor performance metrics**
- [ ] **Verify feature functionality** across browsers
- [ ] **Check analytics** for usage patterns

### Maintenance
- [ ] **Create maintenance tasks** for regular updates
- [ ] **Document known issues** and workarounds
- [ ] **Plan future improvements** based on usage data
- [ ] **Update SOP** based on lessons learned

## 📋 Templates & Examples

### Feature Module Template
```typescript
// src/ts/modules/your-feature/index.ts
/**
 * Your Feature Module
 *
 * Provides [brief description of functionality]
 *
 * @example
 * ```typescript
 * const feature = createYourFeature();
 * await feature.init({ enabled: true });
 * ```
 */

import type { YourFeatureConfig, YourFeatureData } from '@/core/types/your-feature.types';
import { CleanupManager } from '@/core/cleanup-manager';
import { ready as domReady } from '@/modules/utils/dom';

export interface YourFeatureModule {
  init(config?: YourFeatureConfig): Promise<void>;
  destroy(): void;
  update(data: YourFeatureData): void;
  isEnabled(): boolean;
}

export const createYourFeature = (): YourFeatureModule => {
  let cleanupManager: CleanupManager | null = null;
  let config: YourFeatureConfig;
  let isInitialized = false;

  const init = async (userConfig?: YourFeatureConfig): Promise<void> => {
    if (isInitialized) {
      console.warn('YourFeature already initialized');
      return;
    }

    config = {
      enabled: true,
      option1: 'default',
      option2: 0,
      ...userConfig
    };

    // Initialize cleanup manager
    cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: process.env.NODE_ENV === 'development'
    });

    // Wait for DOM to be ready
    await domReady();

    // Your feature initialization logic here
    setupFeatureElements();
    bindEventListeners();

    isInitialized = true;
    console.log('✅ YourFeature initialized with config:', config);
  };

  const destroy = (): void => {
    if (!isInitialized) {
      return;
    }

    // Cleanup event listeners and DOM elements
    removeEventListeners();
    cleanupFeatureElements();

    if (cleanupManager) {
      cleanupManager.cleanup();
      cleanupManager = null;
    }

    isInitialized = false;
    console.log('🧹 YourFeature destroyed');
  };

  const update = (data: YourFeatureData): void => {
    if (!isInitialized) {
      console.warn('YourFeature not initialized');
      return;
    }

    // Update logic here
    updateFeatureElements(data);
    console.log('🔄 YourFeature updated with data:', data);
  };

  const isEnabled = (): boolean => isInitialized && config.enabled;

  // Private helper methods
  const setupFeatureElements = (): void => {
    // Setup DOM elements, styles, etc.
  };

  const bindEventListeners = (): void => {
    // Bind event listeners and register with cleanup manager
    if (cleanupManager) {
      const handleClick = (event: Event) => {
        // Handle click events
      };

      document.addEventListener('click', handleClick);
      cleanupManager.addEventListener(document, 'click', handleClick);
    }
  };

  const removeEventListeners = (): void => {
    // Event listeners are automatically cleaned up by CleanupManager
  };

  const cleanupFeatureElements = (): void => {
    // Remove any DOM elements created by the feature
  };

  const updateFeatureElements = (data: YourFeatureData): void => {
    // Update DOM elements with new data
  };

  return { init, destroy, update, isEnabled };
};

// Export init function for main.ts integration
export const initYourFeature = async (config?: YourFeatureConfig): Promise<void> => {
  const feature = createYourFeature();
  await feature.init(config);
};
```

### Test Template
```typescript
// src/test/unit/modules/your-feature.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createYourFeature } from '../../../ts/modules/your-feature';

describe('YourFeature', () => {
  let feature: ReturnType<typeof createYourFeature>;

  beforeEach(() => {
    // Setup test environment
    document.body.innerHTML = '<div id="test-root"></div>';
    feature = createYourFeature();
  });

  afterEach(() => {
    feature.destroy();
  });

  describe('initialization', () => {
    it('should initialize with default config', async () => {
      await expect(feature.init()).resolves.not.toThrow();
    });

    it('should accept custom config', async () => {
      const config = { enabled: true, option1: 'test' };
      await expect(feature.init(config)).resolves.not.toThrow();
    });
  });

  describe('functionality', () => {
    it('should perform core functionality', async () => {
      await feature.init();
      // Test your feature's main functionality
    });
  });
});
```

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: Memory Leaks
**Problem**: Event listeners not properly cleaned up
**Solution**: Always use cleanup manager and test memory usage

### Pitfall 2: Type Safety Issues
**Problem**: Using `any` types or improper null handling
**Solution**: Define proper interfaces and use type guards

### Pitfall 3: Performance Regression
**Problem**: Bundle size grows too large
**Solution**: Regular bundle size monitoring and code splitting

### Pitfall 4: Broken Jekyll Integration
**Problem**: JavaScript conflicts with Jekyll templates
**Solution**: Test integration early and use progressive enhancement

---

**Last Updated**: 2025-01-10
**Review Frequency**: Monthly
**Owner**: Tech Lead (Member 1)