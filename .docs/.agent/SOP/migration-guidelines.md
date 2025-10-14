# 🔄 Migration Guidelines SOP

## Overview

This Standard Operating Procedure (SOP) provides guidelines for performing system migrations, ensuring smooth transitions while maintaining functionality and preventing regressions.

## 🎯 Migration Types

### 1. Type System Migrations
### 2. Architecture Refactoring
### 3. Dependency Updates
### 4. Configuration Changes
### 5. Build System Updates

## 📋 Migration Process

### Phase 1: Assessment (2-4 hours)

#### 1.1 Impact Analysis
- [ ] **Identify affected files** and modules
- [ ] **Assess breaking changes** and compatibility issues
- [ ] **Estimate migration effort** and timeline
- [ ] **Identify test coverage gaps**
- [ ] **Plan rollback strategy**

#### 1.2 Risk Assessment
- [ ] **Document potential risks** and mitigation strategies
- [ ] **Identify critical functionality** that must be preserved
- [ ] **Plan testing scenarios** for migration verification
- [ ] **Schedule migration** during low-risk periods

### Phase 2: Preparation (1-2 hours)

#### 2.1 Environment Setup
```bash
# Create migration branch
git checkout -b migration/type-system-unification

# Setup testing environment
npm run test:setup

# Backup current state
git tag -a "pre-migration-$(date +%Y%m%d)" -m "Pre-migration backup"
```

#### 2.2 Test Baseline
```bash
# Run full test suite
npm run test:coverage

# Generate performance baseline
npm run build:prod
npm run size-check

# Document current metrics
echo "Current metrics:" > migration-baseline.md
npm run test:coverage >> migration-baseline.md
npm run size-check >> migration-baseline.md
```

### Phase 3: Implementation (4-12 hours)

#### 3.1 Migration Implementation
- [ ] **Implement changes incrementally**
- [ ] **Run tests frequently** during implementation
- [ ] **Update documentation** as changes are made
- [ ] **Maintain backward compatibility** where possible

#### 3.2 Migration-Specific Guidelines

##### Type System Migration
```typescript
// Before:分散的类型定义
// file1.ts
interface UserConfig {
  name: string;
  theme: string;
}

// file2.ts
interface AppSettings {
  debug: boolean;
  version: string;
}

// After:统一的类型系统
// src/ts/core/types/index.ts
export interface UserConfig {
  name: string;
  theme: ThemeMode; // 使用强类型
}

export interface AppSettings {
  debug: boolean;
  version: string;
}

// 更新所有引用
// file1.ts, file2.ts
import type { UserConfig, AppSettings } from '../core/types';
```

##### Service Layer Migration
```typescript
// Before: Singleton模式
class ConfigService {
  private static instance: ConfigService;

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
}

// After: Service Factory Pattern
// src/ts/core/service-factory.ts
interface ServiceFactory {
  register<T>(name: string, factory: () => T, singleton?: boolean): void;
  get<T>(name: string): T;
  has(name: string): boolean;
  clear(): void;
}

export const serviceFactory: ServiceFactory = {
  services: new Map(),

  register<T>(name: string, factory: () => T, singleton = false): void {
    this.services.set(name, { factory, singleton, instance: null });
  },

  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }

    if (service.singleton && !service.instance) {
      service.instance = service.factory();
    }

    return service.singleton ? service.instance : service.factory();
  }
};

// Service registration helpers
export const registerService = <T>(
  name: string,
  factory: () => T,
  singleton = false
): void => serviceFactory.register(name, factory, singleton);

export const getService = <T>(name: string): T => serviceFactory.get<T>(name);

// Usage in main.ts
registerService('config', createConfigService, true);
const configService = getService('config');
```

##### Memory Management Migration
```typescript
// Before:分散的清理逻辑
// module1.ts
const cleanupTasks: (() => void)[] = [];

// module2.ts
const eventListeners: EventListener[] = [];

// After:统一的清理管理器
// src/ts/core/cleanup-manager.ts
export class CleanupManager {
  private tasks: Set<() => void> = new Set();

  public register(task: () => void): () => void {
    this.tasks.add(task);
    return () => this.tasks.delete(task);
  }

  public cleanup(): void {
    this.tasks.forEach(task => task());
    this.tasks.clear();
  }
}

// 使用示例
const cleanup = CleanupManager.getInstance({
  autoCleanupOnUnload: true,
  logCleanupActivity: process.env.NODE_ENV === 'development'
});

const removeListener = cleanup.register(() => {
  element.removeEventListener('click', handler);
});

// 自动清理由CleanupManager处理
```

##### Plugin System Migration
```typescript
// Before: 硬编码的功能初始化
// main.ts
if (config.copyCodeEnabled) {
  await initCopyCode();
}

if (config.tocEnabled) {
  await initTOC();
}

// After: 插件系统架构
// src/ts/core/plugin-system.ts
interface Plugin {
  name: string;
  version: string;
  init: (config: AppConfig) => Promise<void>;
  destroy: () => void;
  isEnabled: () => boolean;
}

export class PluginSystem {
  private plugins: Map<string, Plugin> = new Map();
  private loadedPlugins: Set<string> = new Set();

  register(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  async loadPlugin(name: string, config: AppConfig): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin '${name}' not found`);
    }

    if (this.loadedPlugins.has(name)) {
      return; // Already loaded
    }

    await plugin.init(config);
    this.loadedPlugins.add(name);
  }

  destroyPlugin(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin && this.loadedPlugins.has(name)) {
      plugin.destroy();
      this.loadedPlugins.delete(name);
    }
  }

  getStats() {
    return {
      registered: this.plugins.size,
      loaded: this.loadedPlugins.size,
      available: Array.from(this.plugins.keys())
    };
  }
}

// Plugin definitions
export const copyCodePlugin: Plugin = {
  name: 'copy-code',
  version: '1.0.0',
  init: async (config) => {
    if (config.copyCodeEnabled) {
      await initCopyCode();
    }
  },
  destroy: () => {
    // Cleanup copy code functionality
  },
  isEnabled: () => true
};

// Usage in main.ts
const pluginSystem = new PluginSystem();
registerService('plugins', () => pluginSystem, true);

// Load plugins based on configuration
if (config.copyCodeEnabled) {
  await pluginSystem.loadPlugin('copy-code', config);
}
```

### Phase 4: Testing & Validation (2-4 hours)

#### 4.1 Automated Testing
```bash
# 运行完整测试套件
npm run test

# 检查类型兼容性
npm run check:types

# 性能回归测试
npm run build:prod
npm run size-check

# 对比基线指标
diff migration-baseline.md current-metrics.md
```

#### 4.2 Manual Testing Checklist
- [ ] **Core functionality works** (theme switching, navigation, etc.)
- [ ] **No console errors** in browser
- [ ] **Performance metrics** maintained
- [ ] **Bundle size** within limits
- [ ] **Cross-browser compatibility** verified
- [ ] **Mobile responsiveness** maintained

#### 4.3 Integration Testing
```typescript
// Migration-specific integration tests
describe('Type System Migration Integration', () => {
  it('should maintain type safety across modules', async () => {
    const app = await initializeApp();

    // 验证类型系统正确集成
    expect(() => app.updateConfig(invalidConfig)).toThrow();
  });

  it('should preserve existing functionality', async () => {
    const theme = createThemeManager();
    await theme.init('dark');

    expect(theme.getCurrentTheme()).toBe('dark');
  });
});
```

### Phase 5: Deployment (1 hour)

#### 5.1 Pre-Deployment Checklist
- [ ] **All tests passing** in CI environment
- [ ] **Code review completed** and approved
- [ ] **Documentation updated**
- [ ] **Migration plan reviewed**
- [ ] **Rollback plan prepared**

#### 5.2 Deployment Steps
```bash
# 合并到主分支
git checkout main
git merge migration/type-system-unification

# 创建部署标签
git tag -a "v2.0.0-type-migration" -m "Type system migration"

# 推送部署
git push origin main --tags

# 监控部署
npm run deploy:monitor
```

#### 5.3 Post-Deployment Monitoring
- [ ] **Monitor error rates** for 24 hours
- [ ] **Check performance metrics**
- [ ] **Verify user functionality**
- [ ] **Watch for console errors**
- [ ] **Validate bundle size**

### Phase 6: Cleanup (1 hour)

#### 6.1 Post-Migration Tasks
- [ ] **Remove deprecated code** and imports
- [ ] **Update documentation** references
- [ ] **Clean up temporary files**
- [ ] **Archive migration branch**
- [ ] **Update team on completion**

## 🚨 Common Migration Issues

### Issue 1: Type Compatibility Errors
**Problem**: TypeScript errors after type system changes
**Solution**:
1. Use type assertion as temporary fix
2. Update type definitions incrementally
3. Run `npm run check:types` frequently

### Issue 2: Runtime Errors After Refactoring
**Problem**: Functionality breaks after service layer changes
**Solution**:
1. Implement comprehensive integration tests
2. Use feature flags for gradual rollout
3. Monitor error rates closely

### Issue 3: Performance Regression
**Problem**: Bundle size or runtime performance degrades
**Solution**:
1. Profile bundle size changes
2. Identify and remove unused imports
3. Optimize critical rendering paths

### Issue 4: Memory Leaks After Migration
**Problem**: Memory usage increases after refactoring
**Solution**:
1. Implement proper cleanup patterns
2. Use memory profiling tools
3. Test with long-running sessions

## 📋 Migration Templates

### Migration Planning Template

```markdown
# Migration: [Name]

## Overview
[Brief description of migration purpose and scope]

## Impact Assessment
- **Affected Files**: [List of files]
- **Breaking Changes**: [Yes/No, details]
- **Estimated Effort**: [Hours]
- **Risk Level**: [Low/Medium/High]

## Migration Steps
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

## Testing Plan
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing
- [ ] Performance validation

## Rollback Plan
[Steps to undo migration if needed]

## Success Criteria
- [ ] All tests pass
- [ ] No performance regression
- [ ] Documentation updated
- [ ] Team trained on changes
```

### Migration Test Plan Template

```typescript
// Migration test suite
describe('[Migration Name] - Integration Tests', () => {
  describe('backward compatibility', () => {
    it('should maintain existing API contracts', () => {
      // Test that existing functionality still works
    });

    it('should handle deprecated features gracefully', () => {
      // Test deprecation warnings/fallbacks
    });
  });

  describe('new functionality', () => {
    it('should implement new features correctly', () => {
      // Test new functionality
    });

    it('should improve performance/quality', () => {
      // Validate improvements
    });
  });

  describe('error handling', () => {
    it('should handle migration-specific errors', () => {
      // Test error scenarios
    });
  });
});
```

##### Path Alias Migration
```typescript
// Before: 相对路径导入
import { ConfigService } from '../../services/config.service';
import { CleanupManager } from '../../core/cleanup-manager';
import { ThemeTypes } from '../types/theme.types';

// After: 路径别名导入
// tsconfig.json 配置
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/core/*": ["core/*"],
      "@/core/types/*": ["core/types/*"],
      "@/services/*": ["services/*"],
      "@/modules/*": ["modules/*"],
      "@/utils/*": ["modules/utils/*"]
    }
  }
}

// 使用路径别名
import { ConfigService } from '@/services/config.service';
import { CleanupManager } from '@/core/cleanup-manager';
import { ThemeTypes } from '@/core/types';

// ESBuild 配置支持
// build.js
const buildConfig = {
  plugins: [
    {
      name: 'path-resolution',
      setup(build) {
        build.onResolve({ filter: /^@/ }, (args) => {
          const importPath = args.path.replace(/^@\//, '');
          const resolvedPath = path.resolve(__dirname, 'src', importPath);
          return { path: resolvedPath, external: false };
        });
      }
    }
  ]
};
```

## 🔄 Continuous Migration Strategy

### Incremental Migration Approach
1. **Feature flags** for gradual rollout
2. **Parallel implementations** during transition
3. **A/B testing** for validation
4. **Gradual deprecation** of old systems
5. **Service Factory Pattern** for dependency injection
6. **Plugin Architecture** for extensible features

### Migration Best Practices
- **Document everything** - decisions, changes, issues
- **Test continuously** - at each step of migration
- **Communicate early** - inform team of upcoming changes
- **Monitor closely** - watch for issues post-deployment
- **Plan for rollback** - always have undo strategy
- **Use service factory** for better testability and maintainability
- **Implement plugin system** for future extensibility

### Advanced Migration Patterns
- **Functional Programming**: Move from classes to functional patterns
- **Dependency Injection**: Use service factory for loose coupling
- **Plugin Architecture**: Make system extensible without core changes
- **Type Safety**: Leverage TypeScript strict mode throughout
- **Memory Management**: Implement proper cleanup patterns

---

**Last Updated**: 2025-10-14
**Review Frequency**: As needed for migrations
**Owner**: Tech Lead (Member 1)