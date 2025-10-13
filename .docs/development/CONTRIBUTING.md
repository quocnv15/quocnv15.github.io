# Contributing Guide

This guide helps developers contribute to the Jekyll TypeScript frontend.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Ruby 2.7+
- Bundler

### Setup
```bash
# Clone repository
git clone https://github.com/quocnv15/quocnv15.github.io.git
cd quocnv15.github.io

# Install dependencies
bundle install    # Ruby dependencies
npm install        # Node.js dependencies

# Start development
npm run dev        # TypeScript watch + Jekyll server
```

## 📁 Project Structure

### TypeScript Source (`src/ts/`)
- `types/` - Global type definitions
- `constants/` - Application constants
- `services/` - Business logic services
- `components/` - Reusable UI components
- `hooks/` - Custom utility hooks
- `modules/` - Feature-specific modules
- `utils/` - Utility functions

### Build Output (`assets/js/`)
- `main.js` - Production bundle
- `main.js.map` - Source maps

## 🔧 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Development
```bash
# Watch TypeScript compilation
npm run dev:ts

# Start Jekyll with live reload
npm run dev:jekyll

# Or run both together
npm run dev
```

### 3. Code Style
- Use TypeScript strict mode
- Follow naming conventions
- Add JSDoc comments for public APIs
- Use semantic commit messages

### 4. Testing
```bash
# Type checking
npm run check:types

# Bundle testing
npm run test:bundle

# Full test suite
npm test
```

### 5. Build & Deploy
```bash
# Production build
npm run build:prod

# Analyze bundle
npm run analyze
```

## 📝 Coding Standards

### TypeScript Guidelines
```typescript
// ✅ Good
interface UserConfig {
  readonly id: string;
  name: string;
  age?: number;
}

// ✅ Use proper typing
const getUser = (id: string): Promise<User | null> => {
  return fetchUser(id);
};

// ❌ Avoid 'any'
const getData = (id: any): any => {
  return fetch(id);
};
```

### Component Pattern
```typescript
export class ExampleComponent {
  private cleanupFunctions: (() => void)[] = [];

  public init(): void {
    this.setupEventListeners();
    console.log('Component initialized');
  }

  public destroy(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
    console.log('Component destroyed');
  }

  private setupEventListeners(): void {
    // Event listener setup with cleanup tracking
  }
}
```

### Service Pattern
```typescript
export class ExampleService {
  private static instance: ExampleService;

  public static getInstance(): ExampleService {
    if (!ExampleService.instance) {
      ExampleService.instance = new ExampleService();
    }
    return ExampleService.instance;
  }

  // Business logic methods
}
```

## 🎯 Best Practices

### 1. **Type Safety**
- Always define explicit types
- Use unions instead of enums when possible
- Prefer `readonly` for immutable data
- Use `unknown` instead of `any` for dynamic data

### 2. **Performance**
- Lazy load features when possible
- Use debounce/throttle for event handlers
- Clean up event listeners
- Optimize bundle size

### 3. **Accessibility**
- Add ARIA labels
- Support keyboard navigation
- Ensure color contrast
- Test with screen readers

### 4. **Error Handling**
```typescript
const safeOperation = (): Result<string> => {
  try {
    const result = riskyOperation();
    return { success: true, data: result };
  } catch (error) {
    console.error('Operation failed:', error);
    return { success: false, error: error.message };
  }
};
```

## 🧪 Testing

### Unit Testing Structure
```typescript
describe('ComponentName', () => {
  let component: ComponentName;

  beforeEach(() => {
    component = new ComponentName();
  });

  afterEach(() => {
    component.destroy();
  });

  it('should initialize correctly', () => {
    expect(component).toBeDefined();
  });
});
```

### Integration Testing
```typescript
describe('Feature Integration', () => {
  it('should work end-to-end', async () => {
    // Test complete user flows
  });
});
```

## 📊 Performance Guidelines

### Bundle Size Monitoring
```bash
# Check current bundle size
npm run size-check

# Analyze bundle contents
npm run analyze
```

### Performance Budgets
- **Bundle Size**: < 150KB (gzipped)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🐛 Debugging

### Source Maps
Source maps are automatically generated for development builds.

### Console Logging
Use structured logging:
```typescript
console.log('🎨 Theme initialized:', { mode, stored });
console.warn('⚠️ Element not found:', selector);
console.error('❌ Operation failed:', error);
```

### Browser DevTools
- Use TypeScript sources in browser devtools
- Check network requests
- Monitor performance metrics
- Test accessibility features

## 📋 Commit Guidelines

### Semantic Commit Messages
```
feat: add new feature
fix: resolve issue with component
refactor: improve code organization
docs: update documentation
test: add unit tests
perf: optimize bundle size
chore: update dependencies
```

### Commit Body
```
Add detailed description of changes:

- What was changed
- Why it was changed
- How it was tested
- Any breaking changes
```

## 🚀 Release Process

1. Update version in `package.json`
2. Update changelog
3. Run full test suite
4. Create production build
5. Commit and tag release
6. Deploy to GitHub Pages

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [esbuild Documentation](https://esbuild.github.io/)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Web Performance Best Practices](https://web.dev/performance/)