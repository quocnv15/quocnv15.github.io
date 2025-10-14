/**
 * Component Registry System
 *
 * Provides centralized management for components:
 * - Component registration and discovery
 * - Lifecycle management
 * - Component lookup and retrieval
 * - Statistics and monitoring
 */

import type { BaseComponent } from './base.component';
import { CleanupManager } from '../core/cleanup-manager';

export interface ComponentConfig {
  element: HTMLElement;
  autoInit?: boolean;
  autoCleanup?: boolean;
  [key: string]: any;
}

export interface ComponentRegistration {
  name: string;
  componentClass: new (config?: any) => BaseComponent;
  instance?: BaseComponent;
  config?: ComponentConfig;
  registeredAt: Date;
  initializedAt?: Date;
  destroyedAt?: Date;
}

export interface ComponentRegistryStats {
  totalRegistered: number;
  totalInitialized: number;
  totalDestroyed: number;
  componentsByStatus: {
    registered: string[];
    initialized: string[];
    destroyed: string[];
  };
  oldestRegistration?: Date;
  newestRegistration?: Date;
}

/**
 * Component Registry class for managing component lifecycle
 */
export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, ComponentRegistration> = new Map();
  private cleanupManager: CleanupManager;
  private _registryDestroyed: boolean = false;

  private constructor() {
    this.cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: process.env.NODE_ENV === 'development'
    });

    // Register cleanup for the registry itself
    this.cleanupManager.register(() => {
      this.destroyAll();
    }, {
      description: 'Component Registry cleanup',
      priority: 1 // High priority - clean up components early
    });
  }

  /**
   * Get singleton instance of the registry
   */
  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  /**
   * Register a component class with the registry
   */
  public register(
    name: string,
    componentClass: new (config?: any) => BaseComponent,
    config?: ComponentConfig
  ): void {
    if (this._registryDestroyed) {
      throw new Error('Cannot register components on destroyed registry');
    }

    if (this.components.has(name)) {
      throw new Error(`Component with name '${name}' is already registered`);
    }

    const registration: ComponentRegistration = {
      name,
      componentClass,
      ...(config && { config }),
      registeredAt: new Date()
    };

    this.components.set(name, registration);

    // Auto-initialize if configured
    if (config?.autoInit && config.element) {
      this.init(name);
    }

    console.log(`📋 Component registered: ${name}`);
  }

  /**
   * Initialize a registered component
   */
  public async init(name: string): Promise<void> {
    if (this._registryDestroyed) {
      throw new Error('Cannot initialize components on destroyed registry');
    }

    const registration = this.components.get(name);
    if (!registration) {
      throw new Error(`Component '${name}' is not registered`);
    }

    if (registration.instance) {
      if (registration.instance.isReady()) {
        console.warn(`⚠️ Component '${name}' is already initialized`);
        return;
      }
      throw new Error(`Component '${name}' has an existing instance in invalid state`);
    }

    if (!registration.config?.element) {
      throw new Error(`Component '${name}' cannot be initialized without an element`);
    }

    try {
      // Create component instance
      const config = registration.config!;
      const component = new registration.componentClass({
        element: config.element,
        autoCleanup: config.autoCleanup,
        cleanupManager: this.cleanupManager,
        ...config
      });

      // Initialize the component
      await component.init();

      // Store the instance
      registration.instance = component;
      registration.initializedAt = new Date();

      console.log(`✅ Component initialized: ${name}`);
    } catch (error) {
      console.error(`❌ Failed to initialize component '${name}':`, error);
      throw error;
    }
  }

  /**
   * Get a component instance by name
   */
  public get(name: string): BaseComponent | undefined {
    const registration = this.components.get(name);
    return registration?.instance;
  }

  /**
   * Get a component registration by name
   */
  public getRegistration(name: string): ComponentRegistration | undefined {
    return this.components.get(name);
  }

  /**
   * Check if a component is registered
   */
  public isRegistered(name: string): boolean {
    return this.components.has(name);
  }

  /**
   * Check if a component is initialized
   */
  public isInitialized(name: string): boolean {
    const registration = this.components.get(name);
    return !!registration?.instance?.isReady();
  }

  /**
   * Check if a component is destroyed
   */
  public isDestroyed(name: string): boolean {
    const registration = this.components.get(name);
    return !!registration?.instance?.isComponentDestroyed();
  }

  /**
   * Destroy a component instance
   */
  public destroy(name: string): void {
    const registration = this.components.get(name);
    if (!registration) {
      console.warn(`⚠️ Cannot destroy unregistered component: ${name}`);
      return;
    }

    if (registration.instance) {
      registration.instance.destroy();
      registration.destroyedAt = new Date();
      console.log(`🧹 Component destroyed: ${name}`);
    }
  }

  /**
   * Remove a component from the registry
   */
  public remove(name: string): void {
    this.destroy(name);
    this.components.delete(name);
    console.log(`🗑️ Component removed from registry: ${name}`);
  }

  /**
   * Destroy all registered components
   */
  public destroyAll(): void {
    const names = Array.from(this.components.keys());
    names.forEach(name => this.destroy(name));
    console.log(`🧹 All components destroyed (${names.length} total)`);
  }

  /**
   * Get all registered component names
   */
  public getRegisteredNames(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * Get all initialized component names
   */
  public getInitializedNames(): string[] {
    return Array.from(this.components.entries())
      .filter(([, registration]) => registration.instance?.isReady())
      .map(([name]) => name);
  }

  /**
   * Get all destroyed component names
   */
  public getDestroyedNames(): string[] {
    return Array.from(this.components.entries())
      .filter(([, registration]) => registration.instance?.isComponentDestroyed())
      .map(([name]) => name);
  }

  /**
   * Get registry statistics
   */
  public getStats(): ComponentRegistryStats {
    const components = Array.from(this.components.values());
    const totalRegistered = components.length;
    const totalInitialized = components.filter(c => c.instance?.isReady()).length;
    const totalDestroyed = components.filter(c => c.instance?.isComponentDestroyed()).length;

    const registeredDates = components.map(c => c.registeredAt);
    const oldestRegistration = registeredDates.length > 0 ? new Date(Math.min(...registeredDates.map(d => d.getTime()))) : undefined;
    const newestRegistration = registeredDates.length > 0 ? new Date(Math.max(...registeredDates.map(d => d.getTime()))) : undefined;

    return {
      totalRegistered,
      totalInitialized,
      totalDestroyed,
      componentsByStatus: {
        registered: this.getRegisteredNames(),
        initialized: this.getInitializedNames(),
        destroyed: this.getDestroyedNames()
      },
      oldestRegistration,
      newestRegistration
    };
  }

  /**
   * Get detailed component information
   */
  public getComponentInfo(name: string): object | undefined {
    const registration = this.components.get(name);
    if (!registration) {
      return undefined;
    }

    return {
      name: registration.name,
      className: registration.componentClass.name,
      config: registration.config,
      registeredAt: registration.registeredAt,
      initializedAt: registration.initializedAt,
      destroyedAt: registration.destroyedAt,
      isInitialized: !!registration.instance?.isReady(),
      isDestroyed: !!registration.instance?.isComponentDestroyed(),
      stats: registration.instance?.getStats()
    };
  }

  /**
   * Get all component information
   */
  public getAllComponentInfo(): object {
    const info: Record<string, object> = {};
    for (const name of this.components.keys()) {
      info[name] = this.getComponentInfo(name) || {};
    }
    return info;
  }

  /**
   * Find components by class name
   */
  public findByClassName(className: string): string[] {
    return Array.from(this.components.entries())
      .filter(([, registration]) => registration.componentClass.name === className)
      .map(([name]) => name);
  }

  /**
   * Find components by element
   */
  public findByElement(element: HTMLElement): string[] {
    return Array.from(this.components.entries())
      .filter(([, registration]) => registration.instance?.getElement() === element)
      .map(([name]) => name);
  }

  /**
   * Destroy the registry itself
   */
  public destroyRegistry(): void {
    this.destroyAll();
    this.components.clear();
    this._registryDestroyed = true;
    console.log('💀 Component registry destroyed');
  }

  /**
   * Log registry status for debugging
   */
  public logStatus(): void {
    const stats = this.getStats();
    console.group('📊 Component Registry Status');
    console.log('Total Registered:', stats.totalRegistered);
    console.log('Total Initialized:', stats.totalInitialized);
    console.log('Total Destroyed:', stats.totalDestroyed);
    console.log('Registry Age:', this.getRegistryAge());
    console.log('Components:', stats.componentsByStatus);
    console.groupEnd();
  }

  /**
   * Get registry age in milliseconds
   */
  private getRegistryAge(): number {
    const names = this.getRegisteredNames();
    if (names.length === 0) return 0;

    const firstName = names[0];
    const registration = this.components.get(firstName);
    if (!registration?.registeredAt) return 0;

    return Date.now() - registration.registeredAt.getTime();
  }
}

/**
 * Global registry instance for convenience
 */
export const componentRegistry = ComponentRegistry.getInstance();

/**
 * Helper function to register a component
 */
export const registerComponent = (
  name: string,
  componentClass: new (config?: any) => BaseComponent,
  config?: ComponentConfig
): void => {
  componentRegistry.register(name, componentClass, config);
};

/**
 * Helper function to get a component
 */
export const getComponent = (name: string): BaseComponent | undefined => {
  return componentRegistry.get(name);
};

/**
 * Helper function to initialize a component
 */
export const initComponent = async (name: string): Promise<void> => {
  await componentRegistry.init(name);
};

/**
 * Helper function to destroy a component
 */
export const destroyComponent = (name: string): void => {
  componentRegistry.destroy(name);
};