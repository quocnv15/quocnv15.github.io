/**
 * Plugin System Architecture
 *
 * Provides a flexible plugin system that allows dynamic loading and management
 * of modular functionality. Features include:
 * - Plugin lifecycle management
 * - Dependency resolution
 * - Configuration management
 * - Event-driven communication
 * - Security sandboxing
 * - Hot-reloading capabilities
 */

// Define plugin types locally to avoid circular imports
export interface Plugin {
  metadata?: PluginMetadata;
  init?(context: PluginContext): Promise<void> | void;
  destroy?(): Promise<void> | void;
}

export interface PluginContext {
  config: any; // SiteConfig
  utils: PluginUtils;
  events: PluginEventEmitter;
  storage: PluginStorage;
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, data?: any): void;
  get<T = any>(key: string): T | undefined;
  set<T = any>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

export interface PluginEventEmitter {
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, data?: any): void;
  removeAllListeners(event?: string): void;
  listenerCount(event: string): number;
}

export interface PluginStorage {
  get<T = any>(key: string): T | undefined;
  set<T = any>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
  values(): any[];
  entries(): Array<[string, any]>;
}

export interface PluginUtils {
  dom: any;
  storage: any;
  events: any;
}

// ============================================================================
// Plugin System Types
// ============================================================================

/**
 * Plugin loading strategy
 */
export type PluginLoadingStrategy = 'eager' | 'lazy' | 'manual';

/**
 * Plugin state
 */
export type PluginState = 'unloaded' | 'loading' | 'loaded' | 'initializing' | 'active' | 'deinitializing' | 'error' | 'disabled';

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  license?: string;
  homepage?: string;
  keywords?: string[];
  repository?: string;
  bugs?: string;
  dependencies?: string[];
  peerDependencies?: string[];
  engines?: {
    node?: string;
    npm?: string;
  };
  jekyll?: {
    version?: string;
    compatibility?: string[];
  };
}

/**
 * Plugin registration information
 */
export interface PluginRegistration {
  metadata: PluginMetadata;
  plugin: Plugin;
  instance?: any;
  state: PluginState;
  config: Record<string, any>;
  loadTime?: number;
  error?: Error;
  registeredAt: Date;
  lastActive?: Date;
}

/**
 * Plugin system configuration
 */
export interface PluginSystemConfig {
  /** Default loading strategy */
  defaultLoadingStrategy?: PluginLoadingStrategy;
  /** Enable hot-reloading in development */
  hotReload?: boolean;
  /** Enable plugin sandboxing */
  sandboxing?: boolean;
  /** Plugin timeout in milliseconds */
  pluginTimeout?: number;
  /** Enable debug logging */
  debug?: boolean;
  /** Maximum number of plugins */
  maxPlugins?: number;
  /** Allowed plugin sources */
  allowedSources?: string[];
}

/**
 * Plugin load options
 */
export interface PluginLoadOptions {
  strategy?: PluginLoadingStrategy;
  config?: Record<string, any>;
  timeout?: number;
  dependencies?: Record<string, any>;
}

// ============================================================================
// Plugin Context Implementation
// ============================================================================

/**
 * Plugin context implementation
 */
class PluginContextImpl implements PluginContext {
  private eventListeners = new Map<string, Set<Function>>();
  private internalStorage: Map<string, any> = new Map();

  constructor(
    public config: any, // SiteConfig - using any to avoid circular import
    public utils: PluginUtils,
    public events: PluginEventEmitter,
    public storageImpl: PluginStorage
  ) {}

  // Make storage public to match interface
  public get storage(): PluginStorage {
    return this.storageImpl;
  }

  // Event handling
  on(event: string, handler: Function): void {
    this.events.on(event, handler);
    this.trackListener(event, handler);
  }

  off(event: string, handler: Function): void {
    this.events.off(event, handler);
    this.untrackListener(event, handler);
  }

  emit(event: string, data?: any): void {
    this.events.emit(event, data);
  }

  // Storage operations
  get<T = any>(key: string): T | undefined {
    return this.internalStorage.get(key) ?? this.storageImpl.get(key);
  }

  set<T = any>(key: string, value: T): void {
    this.internalStorage.set(key, value);
    this.storageImpl.set(key, value);
  }

  remove(key: string): void {
    this.internalStorage.delete(key);
    this.storageImpl.remove(key);
  }

  clear(): void {
    this.internalStorage.clear();
    this.storageImpl.clear();
  }

  // Internal listener tracking
  private trackListener(event: string, handler: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(handler);
  }

  private untrackListener(event: string, handler: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(handler);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  /**
   * Cleanup all listeners and storage
   */
  cleanup(): void {
    // Remove all tracked listeners
    for (const [event, listeners] of this.eventListeners) {
      for (const listener of listeners) {
        this.events.off(event, listener);
      }
    }
    this.eventListeners.clear();

    // Clear storage
    this.clear();
  }
}

// ============================================================================
// Plugin Storage Implementation
// ============================================================================

/**
 * Plugin storage implementation
 */
class PluginStorageImpl implements PluginStorage {
  private data = new Map<string, any>();

  get<T = any>(key: string): T | undefined {
    return this.data.get(key);
  }

  set<T = any>(key: string, value: T): void {
    this.data.set(key, value);
  }

  remove(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  keys(): string[] {
    return Array.from(this.data.keys());
  }

  values(): any[] {
    return Array.from(this.data.values());
  }

  entries(): Array<[string, any]> {
    return Array.from(this.data.entries());
  }
}

// ============================================================================
// Plugin Event Emitter
// ============================================================================

/**
 * Plugin event emitter implementation
 */
class PluginEventEmitterImpl implements PluginEventEmitter {
  private listeners = new Map<string, Set<Function>>();
  private maxListeners: number = 10;

  on(event: string, handler: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const eventListeners = this.listeners.get(event)!;
    if (eventListeners.size >= this.maxListeners) {
      console.warn(`PluginEventEmitter: Maximum listeners (${this.maxListeners}) exceeded for event "${event}"`);
    }

    eventListeners.add(handler);
  }

  off(event: string, handler: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(handler);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      for (const listener of eventListeners) {
        try {
          listener(data);
        } catch (error) {
          console.error(`PluginEventEmitter: Error in event listener for "${event}":`, error);
        }
      }
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount(event: string): number {
    return this.listeners.get(event)?.size || 0;
  }
}

// ============================================================================
// Plugin Utilities
// ============================================================================

/**
 * Plugin utilities implementation
 */
export const pluginUtils: PluginUtils = {
  // Import utilities from existing modules
  dom: null as any, // Will be populated dynamically
  storage: null as any, // Will be populated dynamically
  events: null as any, // Will be populated dynamically
};

// ============================================================================
// Plugin System Implementation
// ============================================================================

/**
 * Main plugin system
 */
export class PluginSystem {
  private config: PluginSystemConfig;
  private plugins = new Map<string, PluginRegistration>();
  private eventEmitter: PluginEventEmitterImpl;
  private pluginStorage: PluginStorageImpl;
  private loadingPlugins = new Set<string>();
  private debug: boolean;

  constructor(config: PluginSystemConfig = {}) {
    this.config = {
      defaultLoadingStrategy: 'lazy',
      hotReload: process.env.NODE_ENV === 'development',
      sandboxing: false,
      pluginTimeout: 30000, // 30 seconds
      debug: process.env.NODE_ENV === 'development',
      maxPlugins: 50,
      allowedSources: [],
      ...config
    };

    this.debug = this.config.debug!;
    this.eventEmitter = new PluginEventEmitterImpl();
    this.pluginStorage = new PluginStorageImpl();

    if (this.debug) {
      console.log('🔌 Plugin system initialized with config:', this.config);
    }
  }

  /**
   * Register a plugin
   */
  async register(plugin: Plugin, options: PluginLoadOptions = {}): Promise<void> {
    const metadata = await this.extractMetadata(plugin);
    const pluginName = metadata.name;

    if (this.plugins.has(pluginName)) {
      throw new Error(`Plugin "${pluginName}" is already registered`);
    }

    if (this.plugins.size >= this.config.maxPlugins!) {
      throw new Error(`Maximum number of plugins (${this.config.maxPlugins}) reached`);
    }

    if (this.debug) {
      console.log(`🔌 Registering plugin: ${pluginName} v${metadata.version}`);
    }

    const registration: PluginRegistration = {
      metadata,
      plugin,
      state: 'loaded',
      config: options.config || {},
      registeredAt: new Date()
    };

    this.plugins.set(pluginName, registration);
    this.eventEmitter.emit('plugin-registered', { name: pluginName, metadata });

    // Load plugin if strategy is eager
    if (options.strategy === 'eager' || (!options.strategy && this.config.defaultLoadingStrategy === 'eager')) {
      await this.load(pluginName, options);
    }
  }

  /**
   * Load a plugin
   */
  async load(name: string, _options: PluginLoadOptions = {}): Promise<void> {
    const registration = this.plugins.get(name);
    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }

    if (registration.state === 'active') {
      if (this.debug) {
        console.log(`🔌 Plugin "${name}" is already active`);
      }
      return;
    }

    if (registration.state === 'loading' || this.loadingPlugins.has(name)) {
      throw new Error(`Plugin "${name}" is already loading`);
    }

    this.loadingPlugins.add(name);
    registration.state = 'loading';

    try {
      const startTime = Date.now();

      // Check dependencies
      if (registration.metadata.dependencies) {
        await this.checkDependencies(registration.metadata.dependencies);
      }

      // Create plugin context
      const context = this.createContext(registration);

      // Initialize plugin
      registration.state = 'initializing';
      await this.initializePlugin(registration.plugin, context);

      // Store instance
      registration.instance = context;
      registration.state = 'active';
      registration.loadTime = Date.now() - startTime;
      registration.lastActive = new Date();

      if (this.debug) {
        console.log(`🔌 Plugin "${name}" loaded successfully in ${registration.loadTime}ms`);
      }

      this.eventEmitter.emit('plugin-loaded', { name, registration });

    } catch (error) {
      registration.state = 'error';
      registration.error = error instanceof Error ? error : new Error(String(error));

      console.error(`🔌 Failed to load plugin "${name}":`, error);
      this.eventEmitter.emit('plugin-error', { name, error });

      throw error;
    } finally {
      this.loadingPlugins.delete(name);
    }
  }

  /**
   * Unload a plugin
   */
  async unload(name: string): Promise<void> {
    const registration = this.plugins.get(name);
    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }

    if (registration.state !== 'active') {
      if (this.debug) {
        console.log(`🔌 Plugin "${name}" is not active`);
      }
      return;
    }

    if (this.debug) {
      console.log(`🔌 Unloading plugin: ${name}`);
    }

    registration.state = 'deinitializing';

    try {
      // Call destroy if available
      if (registration.plugin.destroy && typeof registration.plugin.destroy === 'function') {
        await registration.plugin.destroy();
      }

      // Cleanup context
      if (registration.instance && typeof registration.instance.cleanup === 'function') {
        registration.instance.cleanup();
      }

      registration.state = 'loaded';
      registration.instance = undefined;

      if (this.debug) {
        console.log(`🔌 Plugin "${name}" unloaded successfully`);
      }

      this.eventEmitter.emit('plugin-unloaded', { name, registration });

    } catch (error) {
      registration.state = 'error';
      registration.error = error instanceof Error ? error : new Error(String(error));

      console.error(`🔌 Failed to unload plugin "${name}":`, error);
      this.eventEmitter.emit('plugin-error', { name, error });
    }
  }

  /**
   * Enable a plugin
   */
  async enable(name: string): Promise<void> {
    const registration = this.plugins.get(name);
    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }

    if (registration.state === 'disabled') {
      registration.state = 'loaded';
      await this.load(name);
    }
  }

  /**
   * Disable a plugin
   */
  async disable(name: string): Promise<void> {
    const registration = this.plugins.get(name);
    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }

    if (registration.state === 'active') {
      await this.unload(name);
      registration.state = 'disabled';
    }
  }

  /**
   * Get plugin registration
   */
  getPlugin(name: string): PluginRegistration | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): PluginRegistration[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get active plugins
   */
  getActivePlugins(): PluginRegistration[] {
    return Array.from(this.plugins.values()).filter(p => p.state === 'active');
  }

  /**
   * Get plugin by state
   */
  getPluginsByState(state: PluginState): PluginRegistration[] {
    return Array.from(this.plugins.values()).filter(p => p.state === state);
  }

  /**
   * Check if plugin exists
   */
  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Unregister a plugin
   */
  async unregister(name: string): Promise<void> {
    const registration = this.plugins.get(name);
    if (!registration) {
      return;
    }

    // Unload if active
    if (registration.state === 'active') {
      await this.unload(name);
    }

    this.plugins.delete(name);
    this.eventEmitter.emit('plugin-unregistered', { name });

    if (this.debug) {
      console.log(`🔌 Plugin "${name}" unregistered`);
    }
  }

  /**
   * Get system statistics
   */
  getStats(): {
    total: number;
    active: number;
    loaded: number;
    error: number;
    disabled: number;
    loading: number;
    plugins: Array<{
      name: string;
      version: string;
      state: PluginState;
      loadTime?: number;
      registeredAt: Date;
    }>;
  } {
    const plugins = Array.from(this.plugins.values());

    return {
      total: plugins.length,
      active: plugins.filter(p => p.state === 'active').length,
      loaded: plugins.filter(p => p.state === 'loaded').length,
      error: plugins.filter(p => p.state === 'error').length,
      disabled: plugins.filter(p => p.state === 'disabled').length,
      loading: this.loadingPlugins.size,
      plugins: plugins.map(p => ({
        name: p.metadata.name,
        version: p.metadata.version,
        state: p.state,
        ...(p.loadTime !== undefined && { loadTime: p.loadTime }),
        registeredAt: p.registeredAt
      }))
    };
  }

  /**
   * Get system events
   */
  get events(): PluginEventEmitterImpl {
    return this.eventEmitter;
  }

  /**
   * Shutdown plugin system
   */
  async shutdown(): Promise<void> {
    if (this.debug) {
      console.log('🔌 Shutting down plugin system...');
    }

    // Unload all active plugins
    const activePlugins = this.getActivePlugins();
    for (const plugin of activePlugins) {
      try {
        await this.unload(plugin.metadata.name);
      } catch (error) {
        console.error(`Error unloading plugin "${plugin.metadata.name}" during shutdown:`, error);
      }
    }

    // Clear all plugins
    this.plugins.clear();
    this.loadingPlugins.clear();

    // Clear event listeners
    this.eventEmitter.removeAllListeners();

    if (this.debug) {
      console.log('🔌 Plugin system shutdown complete');
    }
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Extract metadata from plugin
   */
  private async extractMetadata(plugin: Plugin): Promise<PluginMetadata> {
    // Try to get metadata from plugin properties
    if (plugin.metadata) {
      return plugin.metadata;
    }

    // Try to get from constructor
    const constructor = plugin.constructor;
    if (constructor.name && constructor.name !== 'Object') {
      return {
        name: constructor.name,
        version: '1.0.0',
        description: `${constructor.name} plugin`,
        author: 'Unknown'
      };
    }

    // Default metadata
    return {
      name: 'unknown',
      version: '1.0.0',
      description: 'Unknown plugin',
      author: 'Unknown'
    };
  }

  /**
   * Check plugin dependencies
   */
  private async checkDependencies(dependencies: string[]): Promise<void> {
    for (const dep of dependencies) {
      if (!this.plugins.has(dep)) {
        throw new Error(`Dependency "${dep}" is not available`);
      }

      const depPlugin = this.plugins.get(dep)!;
      if (depPlugin.state !== 'active') {
        throw new Error(`Dependency "${dep}" is not active (state: ${depPlugin.state})`);
      }
    }
  }

  /**
   * Create plugin context
   */
  private createContext(registration: PluginRegistration): PluginContext {
    const config = this.createPluginConfig(registration);

    return new PluginContextImpl(
      config,
      pluginUtils,
      this.eventEmitter,
      this.pluginStorage
    );
  }

  /**
   * Create plugin configuration
   */
  private createPluginConfig(_registration: PluginRegistration): any { // SiteConfig
    // In a real implementation, this would provide access to the actual site config
    // For now, return a basic config
    return {
      theme: 'system' as any,
      environment: 'development' as any,
      isPost: false,
      isHomePage: false,
      language: 'en',
      baseUrl: window.location.origin,
      features: {
        searchEnabled: false,
        tocEnabled: false,
        copyCodeEnabled: false,
        shareButtonsEnabled: false,
        analyticsEnabled: false,
        commentsEnabled: false
      },
      navigation: {
        items: [],
        mobile: false,
        search: false
      },
      social: {},
      performance: {
        bundleSize: 0,
        buildTime: 0
      },
      seo: {
        titleTemplate: '',
        description: '',
        image: '',
        keywords: []
      }
    };
  }

  /**
   * Initialize plugin
   */
  private async initializePlugin(plugin: Plugin, context: PluginContext): Promise<void> {
    if (plugin.init && typeof plugin.init === 'function') {
      await plugin.init(context);
    }
  }
}

// ============================================================================
// Default Plugin System Instance
// ============================================================================

/**
 * Default plugin system instance
 */
export const pluginSystem = new PluginSystem({
  defaultLoadingStrategy: 'lazy',
  hotReload: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development'
});

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Register a plugin
 */
export const registerPlugin = async (plugin: Plugin, options?: PluginLoadOptions): Promise<void> => {
  return pluginSystem.register(plugin, options);
};

/**
 * Load a plugin
 */
export const loadPlugin = async (name: string, options?: PluginLoadOptions): Promise<void> => {
  return pluginSystem.load(name, options);
};

/**
 * Get a plugin
 */
export const getPlugin = (name: string): PluginRegistration | undefined => {
  return pluginSystem.getPlugin(name);
};

/**
 * Get all plugins
 */
export const getAllPlugins = (): PluginRegistration[] => {
  return pluginSystem.getAllPlugins();
};

/**
 * Get active plugins
 */
export const getActivePlugins = (): PluginRegistration[] => {
  return pluginSystem.getActivePlugins();
};

/**
 * Unregister a plugin
 */
export const unregisterPlugin = async (name: string): Promise<void> => {
  return pluginSystem.unregister(name);
};

// ============================================================================
// Plugin Builder
// ============================================================================

/**
 * Plugin builder for creating plugins
 */
export class PluginBuilder {
  private metadata: Partial<PluginMetadata> = {};
  private initFn?: (context: PluginContext) => Promise<void> | void;
  private destroyFn?: () => Promise<void> | void;

  name(name: string): this {
    this.metadata.name = name;
    return this;
  }

  version(version: string): this {
    this.metadata.version = version;
    return this;
  }

  description(description: string): this {
    this.metadata.description = description;
    return this;
  }

  author(author: string): this {
    this.metadata.author = author;
    return this;
  }

  license(license: string): this {
    this.metadata.license = license;
    return this;
  }

  homepage(url: string): this {
    this.metadata.homepage = url;
    return this;
  }

  dependencies(deps: string[]): this {
    this.metadata.dependencies = deps;
    return this;
  }

  init(fn: (context: PluginContext) => Promise<void> | void): this {
    this.initFn = fn;
    return this;
  }

  destroy(fn: () => Promise<void> | void): this {
    this.destroyFn = fn;
    return this;
  }

  build(): Plugin {
    const plugin: Plugin = {
      ...(this.initFn && { init: this.initFn }),
      ...(this.destroyFn && { destroy: this.destroyFn })
    };

    // Add metadata only if it has required fields
    if (this.metadata.name && this.metadata.version && this.metadata.description && this.metadata.author) {
      plugin.metadata = this.metadata as PluginMetadata;
    }

    return plugin;
  }
}

/**
 * Create a plugin builder
 */
export const createPlugin = (): PluginBuilder => {
  return new PluginBuilder();
};