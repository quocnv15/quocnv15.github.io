# 🧪 Testing Procedures SOP

## Overview

This Standard Operating Procedure (SOP) defines the comprehensive testing strategy for the Jekyll TypeScript frontend, ensuring code quality, functionality, and performance standards are met.

## 🎯 Testing Philosophy

### Testing Pyramid
```
        E2E Tests (5%)
       ─────────────────
    Integration Tests (15%)
   ─────────────────────────
 Unit Tests (80%)
```

### Core Principles
1. **Test Early, Test Often** - Write tests alongside code
2. **Test Behavior, Not Implementation** - Focus on what the code does
3. **Maintainable Tests** - Keep tests simple and readable
4. **Comprehensive Coverage** - Target 80%+ coverage
5. **Performance Testing** - Monitor bundle size and runtime performance

## 🛠️ Testing Stack

### Core Technologies
- **Vitest 1.0.4** - Fast unit testing framework
- **JSDOM 23.0.1** - DOM environment simulation
- **TypeScript** - Type-safe testing
- **Coverage Reporter** - Built-in Vitest coverage

### Test Types
1. **Unit Tests** - Individual function/component testing
2. **Integration Tests** - Module interaction testing
3. **E2E Tests** - Full application flow testing (planned)
4. **Performance Tests** - Bundle size and runtime metrics

## 📁 Test Structure

```
src/test/
├── setup.ts                    # Test configuration and mocks
├── mocks/                      # Mock implementations
│   ├── dom.mock.ts            # DOM utilities mock
│   ├── storage.mock.ts        # localStorage mock
│   └── jekyll.mock.ts         # Jekyll environment mock
├── unit/                      # Unit tests
│   ├── modules/              # Module-specific tests
│   │   ├── theme.test.ts
│   │   ├── navigation.test.ts
│   │   ├── copy-code.test.ts
│   │   └── toc.test.ts
│   ├── services/             # Service tests
│   │   └── config.service.test.ts
│   ├── core/                 # Core infrastructure tests
│   │   ├── cleanup-manager.test.ts
│   │   └── types.test.ts
│   ├── components/           # Component tests
│   │   └── theme-toggle.test.ts
│   └── utils/                # Utility tests
│       └── dom.test.ts
├── integration/              # Integration tests
│   ├── full-app.test.ts      # Full application tests
│   └── jekyll-integration.test.ts
└── e2e/                     # End-to-end tests (planned)
    ├── user-flows.test.ts
    └── accessibility.test.ts
```

## 🧪 Unit Testing Guidelines

### Test Structure Template

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { functionToTest } from '../../../path/to/module';

describe('Module/Function Name', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset DOM, clear mocks, setup test environment
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  // Cleanup after each test
  afterEach(() => {
    // Remove event listeners, cleanup DOM
  });

  describe('basic functionality', () => {
    it('should perform expected behavior', () => {
      // Arrange: Setup test data
      const input = 'test input';

      // Act: Execute function
      const result = functionToTest(input);

      // Assert: Verify results
      expect(result).toBe('expected output');
    });
  });

  describe('edge cases', () => {
    it('should handle null/undefined input', () => {
      expect(() => functionToTest(null)).not.toThrow();
      expect(() => functionToTest(undefined)).not.toThrow();
    });

    it('should handle empty input', () => {
      expect(functionToTest('')).toBe('default result');
    });
  });

  describe('error handling', () => {
    it('should throw appropriate error for invalid input', () => {
      expect(() => functionToTest(invalidInput)).toThrow('Expected error message');
    });
  });
});
```

### DOM Testing Patterns

```typescript
describe('DOM Manipulation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test-container">
        <button class="test-button">Click me</button>
        <div class="test-output"></div>
      </div>
    `;
  });

  it('should add event listener correctly', () => {
    const button = document.querySelector('.test-button');
    const output = document.querySelector('.test-output');

    const mockHandler = vi.fn();
    addEventListener(button, 'click', mockHandler);

    button.click();

    expect(mockHandler).toHaveBeenCalledOnce();
  });

  it('should update DOM correctly', () => {
    const output = document.querySelector('.test-output');

    updateDomElement(output, 'New content');

    expect(output.textContent).toBe('New content');
  });
});
```

### Async Testing Patterns

```typescript
describe('Async Operations', () => {
  it('should handle async initialization', async () => {
    const module = createModule();

    await expect(module.init()).resolves.not.toThrow();

    expect(module.isInitialized).toBe(true);
  });

  it('should handle async errors', async () => {
    const module = createModule();

    vi.spyOn(module, 'fetchData').mockRejectedValue(new Error('Network error'));

    await expect(module.loadData()).rejects.toThrow('Network error');
  });
});
```

## 🔧 Integration Testing

### Application Integration Tests

```typescript
describe('Application Integration', () => {
  beforeEach(() => {
    // Setup complete application environment
    setupJekyllEnvironment();
    setupDOM();
  });

  it('should initialize all modules correctly', async () => {
    await initializeApp();

    // Verify theme system initialized
    expect(document.documentElement.hasAttribute('data-theme')).toBe(true);

    // Verify navigation enhanced
    expect(document.querySelector('.mobile-menu')).not.toBeNull();

    // Verify copy code buttons added
    expect(document.querySelector('.copy-button')).not.toBeNull();
  });

  it('should handle module initialization failures gracefully', async () => {
    // Mock a module failure
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await initializeApp();

    // Application should still be functional
    expect(document.body.classList.contains('js-enabled')).toBe(true);
  });
});
```

### Jekyll Integration Tests

```typescript
describe('Jekyll Integration', () => {
  it('should extract configuration from Jekyll data', () => {
    // Mock Jekyll configuration script
    const mockConfig = {
      theme: 'dark',
      features: { tocEnabled: true, copyCodeEnabled: true }
    };

    setupJekyllConfig(mockConfig);

    const config = getSiteConfig();

    expect(config.theme).toBe('dark');
    expect(config.features.tocEnabled).toBe(true);
  });

  it('should detect page types from Jekyll classes', () => {
    document.body.className = 'post';

    const context = getPageContext();

    expect(context.isPost).toBe(true);
    expect(context.isHomePage).toBe(false);
  });
});
```

## 📊 Coverage Requirements

### Coverage Targets
- **Statements**: 80% minimum
- **Branches**: 75% minimum
- **Functions**: 85% minimum
- **Lines**: 80% minimum

### Coverage Commands

```bash
# Run tests with coverage
npm run test:coverage

# Check specific file coverage
npx vitest run --coverage --reporter=json src/ts/modules/theme.ts

# Generate HTML coverage report
npm run test:coverage -- --reporter=html
```

### Coverage Exclusions

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/ts/main.ts', // Entry point, hard to test
        'src/types/**/*'  // Type definitions only
      ]
    }
  }
});
```

## 🎭 Mocking Strategy

### DOM Mocks

```typescript
// src/test/mocks/dom.mock.ts
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Setup in test setup
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});
```

### Jekyll Mocks

```typescript
// src/test/mocks/jekyll.mock.ts
export const setupJekyllEnvironment = () => {
  (window as any).jekyllEnvironment = 'test';

  const configScript = document.createElement('script');
  configScript.id = 'site-config';
  configScript.type = 'application/json';
  configScript.textContent = JSON.stringify({
    theme: 'system',
    environment: 'test',
    features: {
      tocEnabled: true,
      copyCodeEnabled: true,
      searchEnabled: false
    }
  });

  document.head.appendChild(configScript);
};
```

### API Mocks

```typescript
// Mock fetch for API calls
vi.stubGlobal('fetch', vi.fn());

const mockFetch = vi.mocked(fetch);
mockFetch.mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'test' })
} as Response);
```

### CleanupManager Testing

```typescript
// src/test/unit/core/cleanup-manager.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CleanupManager } from '@/core/cleanup-manager';

describe('CleanupManager', () => {
  let cleanupManager: CleanupManager;

  beforeEach(() => {
    cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: false, // Disable for testing
      logCleanupActivity: false
    });
  });

  afterEach(() => {
    cleanupManager.cleanup();
  });

  describe('event listener management', () => {
    it('should add and remove event listeners', () => {
      const element = document.createElement('button');
      const handler = vi.fn();

      cleanupManager.addEventListener(element, 'click', handler);
      element.click();

      expect(handler).toHaveBeenCalledTimes(1);

      cleanupManager.cleanup();
      element.click();

      expect(handler).toHaveBeenCalledTimes(1); // Should not increase
    });

    it('should track multiple event listeners', () => {
      const element = document.createElement('div');
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      cleanupManager.addEventListener(element, 'click', handler1);
      cleanupManager.addEventListener(element, 'mouseover', handler2);

      const stats = cleanupManager.getStats();
      expect(stats.totalListeners).toBe(2);
      expect(stats.elementsManaged).toBe(1);
    });
  });

  describe('cleanup statistics', () => {
    it('should provide accurate cleanup statistics', () => {
      const button = document.createElement('button');
      const div = document.createElement('div');

      cleanupManager.addEventListener(button, 'click', vi.fn());
      cleanupManager.addEventListener(div, 'mouseover', vi.fn());

      const beforeStats = cleanupManager.getStats();
      expect(beforeStats.totalListeners).toBe(2);

      cleanupManager.cleanup();

      const afterStats = cleanupManager.getStats();
      expect(afterStats.totalListeners).toBe(0);
      expect(afterStats.elementsManaged).toBe(0);
    });
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = CleanupManager.getInstance();
      const instance2 = CleanupManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});
```

### Config Service Testing

```typescript
// src/test/unit/services/config.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getSiteConfig, configService } from '@/services/config.service';

describe('Config Service', () => {
  beforeEach(() => {
    // Setup mock Jekyll configuration
    const configScript = document.createElement('script');
    configScript.id = 'site-config';
    configScript.type = 'application/json';
    configScript.textContent = JSON.stringify({
      theme: 'dark',
      environment: 'test',
      features: {
        tocEnabled: true,
        copyCodeEnabled: true,
        searchEnabled: false,
        shareButtonsEnabled: false
      },
      isPost: false,
      isHomePage: true
    });
    document.head.appendChild(configScript);
  });

  afterEach(() => {
    // Cleanup
    const configScript = document.getElementById('site-config');
    if (configScript) {
      configScript.remove();
    }
  });

  describe('getSiteConfig', () => {
    it('should extract configuration from DOM', () => {
      const config = getSiteConfig();

      expect(config.theme).toBe('dark');
      expect(config.environment).toBe('test');
      expect(config.features.tocEnabled).toBe(true);
      expect(config.isPost).toBe(false);
      expect(config.isHomePage).toBe(true);
    });

    it('should handle missing configuration gracefully', () => {
      const configScript = document.getElementById('site-config');
      if (configScript) {
        configScript.remove();
      }

      const config = getSiteConfig();

      expect(config.theme).toBe('system'); // Default value
      expect(config.environment).toBe('development'); // Default value
    });

    it('should handle invalid JSON gracefully', () => {
      const configScript = document.getElementById('site-config') as HTMLScriptElement;
      if (configScript) {
        configScript.textContent = 'invalid json';
      }

      // Should not throw and should provide defaults
      expect(() => getSiteConfig()).not.toThrow();
    });
  });

  describe('configService functional interface', () => {
    it('should provide functional configuration access', () => {
      const config = configService.get();

      expect(config.theme).toBe('dark');
      expect(config.features.tocEnabled).toBe(true);
    });

    it('should allow configuration updates', () => {
      configService.set({ theme: 'light' });

      const updatedConfig = configService.get();
      expect(updatedConfig.theme).toBe('light');
    });

    it('should provide cache statistics', () => {
      const stats = configService.getCacheStats();

      expect(stats).toHaveProperty('cacheHits');
      expect(stats).toHaveProperty('cacheMisses');
      expect(stats).toHaveProperty('isCacheValid');
    });
  });
});
```

## ⚡ Performance Testing

### Bundle Size Testing

```typescript
describe('Bundle Size', () => {
  it('should maintain bundle size under 15KB', async () => {
    const stats = await getBundleStats();

    expect(stats.size).toBeLessThan(15 * 1024); // 15KB
    expect(stats.gzipSize).toBeLessThan(5 * 1024); // 5KB gzipped
  });
});
```

### Memory Leak Testing

```typescript
describe('Memory Management', () => {
  it('should cleanup event listeners properly', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);

    const cleanup = addEventListener(button, 'click', () => {});

    // Verify listener added
    expect(button.onclick).not.toBeNull();

    // Cleanup
    cleanup();

    // Verify listener removed
    expect(button.onclick).toBeNull();
  });
});
```

## 🚨 Quality Gates

### Pre-commit Checklist
- [ ] **All tests pass** in local environment
- [ ] **Coverage meets minimum** requirements (80%+)
- [ ] **No console errors** in browser
- [ ] **Bundle size check** passes
- [ ] **Type checking** passes (`npm run check:types`)

### Pre-merge Checklist
- [ ] **Full test suite passes** in CI
- [ ] **Integration tests pass** in multiple browsers
- [ ] **Performance benchmarks** met
- [ ] **Documentation updated** for new features
- [ ] **Code review completed** and approved

### Release Checklist
- [ ] **E2E tests pass** (when implemented)
- [ ] **Manual testing completed** on staging
- [ ] **Accessibility tests pass**
- [ ] **Cross-browser compatibility** verified
- [ ] **Performance budget** maintained

## 🔧 Test Commands

### Development Testing
```bash
# Watch mode for development
npm run test:unit:watch

# Run specific test file
npm run test:unit -- src/test/unit/modules/theme.test.ts

# Run tests matching pattern
npm run test:unit -- --grep "theme"
```

### CI Testing
```bash
# Full test suite (CI)
npm run test

# Coverage report
npm run test:coverage

# Type checking
npm run check:types
```

### Debug Testing
```bash
# Run tests with inspector
node --inspect-brk node_modules/.bin/vitest run

# Run specific test with debug
npx vitest run --no-coverage src/test/unit/modules/theme.test.ts
```

## 📈 Test Metrics & Monitoring

### Key Metrics
- **Test execution time**: < 30 seconds for full suite
- **Coverage percentage**: 80%+ maintained
- **Flaky test rate**: 0% tolerated
- **Test failure rate**: < 5% acceptable

### Reporting
- **Coverage reports** generated on each PR
- **Test results** displayed in GitHub Actions
- **Performance regressions** flagged automatically
- **Coverage trends** tracked over time

## 🔄 Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run test:coverage
      - run: npm run check:types

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 🚨 Common Testing Issues

### Issue 1: DOM Tests Failing
**Problem**: Tests fail because DOM isn't properly set up
**Solution**: Use proper test setup and cleanup with JSDOM

### Issue 2: Async Test Timeouts
**Problem**: Tests timeout waiting for async operations
**Solution**: Use proper async/await patterns and mock async operations

### Issue 3: Mock Persistence
**Problem**: Mocks persist between tests
**Solution**: Use `vi.clearAllMocks()` in `beforeEach`

### Issue 4: Coverage False Positives
**Problem**: Coverage reports include test files
**Solution**: Properly configure coverage exclusions

---

**Last Updated**: 2025-10-14
**Review Frequency**: Monthly
**Owner**: Full-Stack Dev (Member 3)