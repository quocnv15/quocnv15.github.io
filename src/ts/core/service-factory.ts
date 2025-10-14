/**
 * Service Factory Pattern
 *
 * Provides a dependency injection system for creating and managing services.
 * This makes the application more testable and decouples components from concrete service implementations.
 *
 * @example
 * ```typescript
 * // Register a service
 * serviceFactory.register('config', createConfigService);
 *
 * // Get a service
 * const configService = serviceFactory.get('config');
 *
 * // Create a scoped factory for testing
 * const testFactory = serviceFactory.createScope();
 * testFactory.register('config', createMockConfigService);
 * ```
 */

import type { Disposable } from './cleanup-manager';

// ============================================================================
// Service Factory Types
// ============================================================================

/**
 * Service factory function type
 */
export type ServiceFactory<T = any> = (...args: any[]) => T;

/**
 * Service registration metadata
 */
export interface ServiceRegistration<T = any> {
  factory: ServiceFactory<T>;
  instance?: T;
  singleton: boolean;
  dependencies?: string[];
  created?: number;
}

/**
 * Service factory configuration
 */
export interface ServiceFactoryConfig {
  /** Enable debug logging */
  debug?: boolean;
  /** Auto-dispose services on scope destruction */
  autoDispose?: boolean;
}

// ============================================================================
// Service Factory Implementation
// ============================================================================

/**
 * Service Factory for dependency injection
 */
export class ServiceFactoryScope {
  private services = new Map<string, ServiceRegistration>();
  private debug: boolean;
  private autoDispose: boolean;
  private parent: ServiceFactoryScope | null;
  private children = new Set<ServiceFactoryScope>();

  constructor(config: ServiceFactoryConfig = {}, parent?: ServiceFactoryScope) {
    this.debug = config.debug ?? false;
    this.autoDispose = config.autoDispose ?? true;
    this.parent = parent || null;

    if (parent) {
      parent.children.add(this);
    }
  }

  /**
   * Register a service factory
   */
  register<T>(name: string, factory: ServiceFactory<T>, singleton: boolean = true): void {
    if (this.services.has(name)) {
      this.unregister(name);
    }

    this.services.set(name, {
      factory,
      singleton,
      created: Date.now()
    });

    if (this.debug) {
      console.log(`🏭 Service registered: ${name} (${singleton ? 'singleton' : 'transient'})`);
    }
  }

  /**
   * Register a service instance
   */
  registerInstance<T>(name: string, instance: T): void {
    if (this.services.has(name)) {
      this.unregister(name);
    }

    this.services.set(name, {
      factory: () => instance,
      singleton: true,
      instance,
      created: Date.now()
    });

    if (this.debug) {
      console.log(`🏭 Service instance registered: ${name}`);
    }
  }

  /**
   * Get a service instance
   */
  get<T = any>(name: string): T {
    const registration = this.services.get(name);

    if (!registration) {
      // Try to get from parent scope
      if (this.parent) {
        return this.parent.get<T>(name);
      }

      throw new Error(`Service not found: ${name}`);
    }

    // Return existing instance for singletons
    if (registration.singleton && registration.instance) {
      return registration.instance;
    }

    // Create new instance
    const instance = registration.factory();

    // Store instance for singletons
    if (registration.singleton) {
      registration.instance = instance;
    }

    // Auto-register disposable instances for cleanup
    if (this.autoDispose && this.isDisposable(instance)) {
      this.registerDisposable(instance);
    }

    if (this.debug) {
      const type = registration.singleton ? 'singleton' : 'transient';
      console.log(`🏭 Service created: ${name} (${type})`);
    }

    return instance;
  }

  /**
   * Check if a service is registered
   */
  has(name: string): boolean {
    return this.services.has(name) || (this.parent?.has(name) ?? false);
  }

  /**
   * Unregister a service
   */
  unregister(name: string): boolean {
    const registration = this.services.get(name);

    if (!registration) {
      return false;
    }

    // Dispose of instance if it's disposable
    if (registration.instance && this.isDisposable(registration.instance)) {
      try {
        registration.instance.dispose();
      } catch (error) {
        console.error(`Error disposing service ${name}:`, error);
      }
    }

    this.services.delete(name);

    if (this.debug) {
      console.log(`🏭 Service unregistered: ${name}`);
    }

    return true;
  }

  /**
   * Create a child scope
   */
  createScope(config: ServiceFactoryConfig = {}): ServiceFactoryScope {
    return new ServiceFactoryScope(config, this);
  }

  /**
   * Get service statistics
   */
  getStats(): {
    scope: 'root' | 'child';
    services: number;
    singletons: number;
    transient: number;
    children: number;
    servicesList: Array<{
      name: string;
      type: 'singleton' | 'transient';
      hasInstance: boolean;
      created: number;
    }>;
  } {
    const servicesList = Array.from(this.services.entries()).map(([name, registration]) => ({
      name,
      type: registration.singleton ? 'singleton' as const : 'transient' as const,
      hasInstance: !!registration.instance,
      created: registration.created!
    }));

    return {
      scope: this.parent ? 'child' : 'root',
      services: this.services.size,
      singletons: servicesList.filter(s => s.type === 'singleton').length,
      transient: servicesList.filter(s => s.type === 'transient').length,
      children: this.children.size,
      servicesList
    };
  }

  /**
   * Clear all services
   */
  clear(): void {
    // Dispose of all disposable instances
    for (const [name, registration] of this.services) {
      if (registration.instance && this.isDisposable(registration.instance)) {
        try {
          registration.instance.dispose();
        } catch (error) {
          console.error(`Error disposing service ${name}:`, error);
        }
      }
    }

    this.services.clear();

    if (this.debug) {
      console.log('🏭 All services cleared');
    }
  }

  /**
   * Destroy scope and cleanup
   */
  destroy(): void {
    // Remove from parent
    if (this.parent) {
      this.parent.children.delete(this);
    }

    // Destroy all child scopes
    for (const child of this.children) {
      child.destroy();
    }

    // Clear all services
    this.clear();

    if (this.debug) {
      console.log('🏭 Service factory scope destroyed');
    }
  }

  /**
   * Check if object is disposable
   */
  private isDisposable(obj: any): obj is Disposable {
    return obj && typeof obj === 'object' && typeof obj.dispose === 'function';
  }

  /**
   * Register disposable for automatic cleanup
   */
  private registerDisposable(_instance: Disposable): void {
    // In a real implementation, this would integrate with the cleanup manager
    // For now, we just track it for scope cleanup
    if (this.debug) {
      console.log('🏭 Disposable service tracked for cleanup');
    }
  }
}

// ============================================================================
// Default Service Factory
// ============================================================================

/**
 * Default service factory instance
 */
export const serviceFactory = new ServiceFactoryScope({
  debug: process.env.NODE_ENV === 'development',
  autoDispose: true
});

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Register a service
 */
export const registerService = <T>(
  name: string,
  factory: ServiceFactory<T>,
  singleton: boolean = true
): void => {
  serviceFactory.register(name, factory, singleton);
};

/**
 * Register a service instance
 */
export const registerServiceInstance = <T>(name: string, instance: T): void => {
  serviceFactory.registerInstance(name, instance);
};

/**
 * Get a service
 */
export const getService = <T = any>(name: string): T => {
  return serviceFactory.get<T>(name);
};

/**
 * Check if a service exists
 */
export const hasService = (name: string): boolean => {
  return serviceFactory.has(name);
};

/**
 * Unregister a service
 */
export const unregisterService = (name: string): boolean => {
  return serviceFactory.unregister(name);
};

/**
 * Create a test scope with mock services
 */
export const createTestScope = (): ServiceFactoryScope => {
  return serviceFactory.createScope({
    debug: true,
    autoDispose: true
  });
};

// ============================================================================
// Service Builder Pattern
// ============================================================================

/**
 * Service builder for creating complex services
 */
export class ServiceBuilder<T = any> {
  private dependencies: string[] = [];
  private factoryFn: ServiceFactory<T> | undefined;
  private singleton: boolean = true;

  constructor(private name: string) {}

  /**
   * Add a dependency
   */
  dependsOn(...deps: string[]): this {
    this.dependencies.push(...deps);
    return this;
  }

  /**
   * Set as singleton
   */
  asSingleton(singleton: boolean = true): this {
    this.singleton = singleton;
    return this;
  }

  /**
   * Set the factory function
   */
  setFactory(factory: ServiceFactory<T>): this {
    this.factoryFn = factory;
    return this;
  }

  /**
   * Build and register the service
   */
  build(): void {
    if (!this.factoryFn) {
      throw new Error(`Factory function not set for service: ${this.name}`);
    }

    serviceFactory.register(this.name, this.factoryFn, this.singleton);

    if (this.debug) {
      console.log(`🏭 Service built: ${this.name} with dependencies: [${this.dependencies.join(', ')}]`);
    }
  }

  /**
   * Build and register the service with dependencies
   */
  buildWithDependencies(): void {
    const originalFactory = this.factoryFn;
    if (!originalFactory) {
      throw new Error(`Factory function not set for service: ${this.name}`);
    }

    this.factoryFn = (_args: any[]) => {
      const deps = this.dependencies.map(dep => serviceFactory.get(dep));
      return originalFactory(...deps);
    };

    this.build();
  }

  private get debug(): boolean {
    return serviceFactory.getStats().scope === 'root'; // Simple debug detection
  }
}

/**
 * Create a service builder
 */
export const createService = <T>(name: string): ServiceBuilder<T> => {
  return new ServiceBuilder<T>(name);
};