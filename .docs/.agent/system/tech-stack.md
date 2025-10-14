# 🛠️ Technology Stack Documentation

## Overview

This document outlines the complete technology stack used in the Jekyll TypeScript Frontend project, including versions, configurations, and rationale for each technology choice.

## Core Technologies

### Frontend Framework & Language
- **TypeScript 5.9.3** - Strict type safety and modern JavaScript features
- **ES2019+ Target** - Modern JavaScript standards with broad browser support
- **Jekyll 4.x** - Static site generator for content management

### Build Tools
- **ESBuild 0.25.10** - Ultra-fast bundler and minifier
- **Custom build script (build.js)** - TypeScript compilation and bundling pipeline
- **Concurrently 8.2.2** - Parallel process execution for development

### Testing Framework
- **Vitest 1.0.4** - Fast unit test framework with TypeScript support
- **JSDOM 23.0.1** - DOM simulation for browser environment testing
- **Coverage reporting** - Built-in Vitest coverage integration

### Development Tools
- **Node.js** - JavaScript runtime and package management
- **npm** - Package manager and script execution
- **TypeScript Compiler (tsc)** - Type checking and compilation
- **@types/node 24.7.2** - Node.js type definitions

## Project Structure

```
src/
├── ts/                    # TypeScript source code
│   ├── components/        # Reusable UI components
│   ├── constants/         # Application constants
│   ├── hooks/            # Custom React-like hooks (DOM focused)
│   ├── interfaces/       # TypeScript interfaces and types
│   ├── modules/          # Feature modules
│   │   ├── utils/        # Utility functions
│   │   ├── theme.ts      # Theme management
│   │   ├── navigation.ts # Navigation enhancements
│   │   ├── copy-code.ts  # Code copying functionality
│   │   └── toc.ts        # Table of contents
│   ├── services/         # Application services
│   ├── types/           # Type definitions
│   └── main.ts          # Application entry point
├── test/                # Test files
│   ├── setup.ts         # Test configuration
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
└── css/                # CSS stylesheets
```

## Configuration Files

### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    // Strict Type Checking
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,

    // Module Configuration
    "module": "esnext",
    "target": "es2019",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,

    // Code Quality
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Additional Checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,

    // Path Mapping
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/types/*": ["types/*"],
      "@/constants/*": ["constants/*"],
      "@/components/*": ["components/*"],
      "@/services/*": ["services/*"],
      "@/hooks/*": ["hooks/*"],
      "@/modules/*": ["modules/*"],
      "@/utils/*": ["modules/utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "assets",
    "_site",
    ".jekyll-cache",
    "src/test/**/*"
  ]
}
```

### ESBuild Configuration (build.js)
The build system uses a custom ESBuild configuration with the following features:

```javascript
const buildConfig = {
  entryPoints: ['src/ts/main.ts'],
  bundle: true,
  minify: isProduction,
  sourcemap: true,
  target: 'es2019',
  format: 'esm',
  outdir: 'assets/js',
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`
  },
  loader: { '.ts': 'ts' },
  plugins: [
    // TypeScript checking plugin
    // Bundle size analyzer plugin
  ]
};
```

**Key Features:**
- **TypeScript integration** with pre-build type checking
- **Bundle analysis** with size monitoring (150KB warning threshold)
- **Environment variable handling** for development/production modes
- **Source maps** for debugging
- **Watch mode** for development
- **Bundle size tracking** and detailed analysis

### Vitest Configuration (vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/ts')
    }
  }
});
```

## Build Pipeline

### Development Build
```bash
npm run dev
# - TypeScript compilation with watch mode
# - Jekyll serve with live reload
# - Type checking in parallel
```

### Production Build
```bash
npm run build:prod
# - TypeScript compilation
# - Bundle optimization
# - Type checking
# - Jekyll static site generation
```

### Type Checking
```bash
npm run check:types
# - TypeScript compiler type validation
# - No output emission (type checking only)
```

## Package.json Scripts

### Development Scripts
- `dev` - Full development environment (TypeScript + Jekyll)
- `dev:ts` - TypeScript watch mode only
- `dev:jekyll` - Jekyll development server only
- `build:ts:watch` - TypeScript compilation with file watching

### Build Scripts
- `build:ts` - Compile and bundle TypeScript
- `build` - Clean build with type checking
- `build:prod` - Production build with Jekyll
- `clean` - Remove build artifacts

### Testing Scripts
- `test` - Full test suite (types + bundle + unit)
- `test:unit` - Run unit tests only
- `test:unit:watch` - Unit tests in watch mode
- `test:coverage` - Generate coverage report

### Quality Scripts
- `check:types` - TypeScript type checking
- `lint` - ESLint code linting (when configured)
- `format` - Prettier code formatting (when configured)

## Performance Optimization

### Bundle Optimization
- **Tree shaking** - Unused code elimination
- **Minification** - ESBuild built-in minification
- **Source maps** - Debug-friendly development builds
- **Bundle size monitoring** - Automated size checks (Current: 13KB, Target: ≤15KB)

### Build Performance
- **Incremental compilation** - TypeScript incremental builds
- **Parallel processes** - Concurrent TypeScript and Jekyll builds
- **Fast bundling** - ESBuild's Go-based performance
- **Watch mode** - Efficient file watching for development

## Environment Configuration

### Development Environment
- **NODE_ENV=development** (implicit)
- **Jekyll livereload** enabled
- **Source maps** generated
- **Verbose logging** enabled

### Production Environment
- **NODE_ENV=production** (explicit)
- **Bundle minification** enabled
- **Source maps** disabled
- **Error reporting** minimal

## Integration Points

### Jekyll Integration
- **Site configuration** via JavaScript injection
- **Content access** through DOM inspection
- **Asset pipeline** integration
- **Template system** compatibility

### GitHub Pages Integration
- **Static deployment** ready
- **HTTPS support** inherent
- **CDN distribution** automatic
- **Domain configuration** flexible

## Browser Support

### Target Browsers
- **Modern browsers** (ES2020+ support)
- **Chrome 80+** - Full feature support
- **Firefox 75+** - Full feature support
- **Safari 13+** - Full feature support
- **Edge 80+** - Full feature support

### Progressive Enhancement
- **Graceful degradation** for older browsers
- **Feature detection** before API usage
- **Fallback behaviors** implemented
- **Error boundaries** for robustness

## Security Considerations

### Content Security Policy
- **Inline scripts** minimized
- **External resources** validated
- **XSS prevention** through type safety
- **Sanitization** for user inputs

### Dependency Management
- **Regular updates** for security patches
- **Vulnerability scanning** automated
- **Minimal dependencies** to reduce attack surface
- **Trusted sources** only

## Future Technology Additions

### Planned Integrations
- **ESLint** - Code quality and style enforcement
- **Prettier** - Code formatting consistency
- **GitHub Actions** - Automated CI/CD pipeline
- **Lighthouse CI** - Performance monitoring
- **Playwright** - End-to-end testing

### Technology Evaluation Criteria
- **Performance impact** - Bundle size and runtime
- **Developer experience** - Learning curve and tooling
- **Maintenance overhead** - Updates and security
- **Community support** - Documentation and ecosystem
- **Compatibility** - Existing stack integration

---

**Last Updated**: 2025-10-14
**Review Frequency**: Quarterly
**Owner**: Tech Lead (Member 1)