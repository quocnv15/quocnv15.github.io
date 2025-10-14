/**
 * Advanced State Management System
 *
 * Provides reactive state management with:
 * - Reactive patterns with observable state
 * - State persistence and recovery
 * - Debugging tools and monitoring
 * - TypeScript type safety
 * - Performance optimization
 */

import { CleanupManager } from './cleanup-manager';
import { performanceMonitor } from './performance-monitor';

// ============================================================================
// Type Definitions
// ============================================================================

export type StateValue = string | number | boolean | object | null | undefined;
export type StateListener<T = StateValue> = (value: T, previousValue: T | undefined) => void;
export type StateMiddleware = (next: () => void, action: StateAction) => void;
export type StateSelector<T, R> = (state: T) => R;

export interface StateAction {
  type: string;
  payload?: StateValue;
  meta?: Record<string, any>;
  timestamp: number;
}

export interface StateConfig {
  persistence?: {
    enabled: boolean;
    key?: string;
    storage?: 'localStorage' | 'sessionStorage' | 'memory';
    serialize?: (state: any) => string;
    deserialize?: (data: string) => any;
    excludeKeys?: string[];
  };
  debug?: {
    enabled: boolean;
    logActions?: boolean;
    logStateChanges?: boolean;
    maxHistorySize?: number;
  };
  performance?: {
    trackMetrics?: boolean;
    batchSize?: number;
    batchTimeout?: number;
  };
}

export interface ReactiveState<T = StateValue> {
  value: T;
  subscribe(listener: StateListener<T>): () => void;
  select<R>(selector: StateSelector<T, R>): ReactiveState<R>;
  get(): T;
  set(value: T): void;
  update(updater: (current: T) => T): void;
}

export interface StateStoreConfig<T> {
  initialState: T;
  reducers?: Record<string, (state: T, action: StateAction) => T>;
  middleware?: StateMiddleware[];
  config?: StateConfig;
}

export interface StateDebugInfo {
  action: StateAction;
  previousState: any;
  nextState: any;
  timestamp: number;
  duration: number;
  stackTrace?: string;
}

export interface StateMetrics {
  totalActions: number;
  totalSubscribers: number;
  averageActionTime: number;
  memoryUsage: number;
  lastUpdated: number;
}

// ============================================================================
// Reactive State Implementation
// ============================================================================

class ReactiveStateImpl<T> implements ReactiveState<T> {
  private _value: T;
  private listeners: Set<StateListener<T>> = new Set();
  private cleanupManager: CleanupManager;
  private key: string;

  constructor(initialValue: T, key: string, cleanupManager: CleanupManager) {
    this._value = initialValue;
    this.key = key;
    this.cleanupManager = cleanupManager;
  }

  get value(): T {
    return this._value;
  }

  subscribe(listener: StateListener<T>): () => void {
    this.listeners.add(listener);

    // Cleanup subscription
    const cleanup = () => {
      this.listeners.delete(listener);
    };

    this.cleanupManager.register(cleanup, {
      id: `state-subscription-${this.key}`,
      description: `State subscription cleanup for ${this.key}`,
      priority: 5
    });

    return cleanup;
  }

  select<R>(selector: StateSelector<T, R>): ReactiveState<R> {
    const selectedValue = selector(this._value);
    const selectedState = new ReactiveStateImpl(selectedValue, `${this.key}-selected`, this.cleanupManager);

    // Subscribe to parent state and update selected state
    this.subscribe((newValue) => {
      const newSelectedValue = selector(newValue);
      if (JSON.stringify(newSelectedValue) !== JSON.stringify(selectedState._value)) {
        selectedState._value = newSelectedValue;
        selectedState.notify();
      }
    });

    return selectedState;
  }

  get(): T {
    return this._value;
  }

  set(value: T): void {
    const previousValue = this._value;
    if (JSON.stringify(previousValue) !== JSON.stringify(value)) {
      this._value = value;
      this.notify();
    }
  }

  update(updater: (current: T) => T): void {
    const newValue = updater(this._value);
    this.set(newValue);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this._value, this._value);
      } catch (error) {
        console.error(`Error in state listener for ${this.key}:`, error);
      }
    }
  }

  destroy(): void {
    this.listeners.clear();
  }
}

// ============================================================================
// State Store Implementation
// ============================================================================

export class StateStore<T = Record<string, any>> {
  private state: ReactiveState<T>;
  private reducers: Record<string, (state: T, action: StateAction) => T>;
  private middleware: StateMiddleware[];
  private config: StateConfig;
  private cleanupManager: CleanupManager;
  private debugHistory: StateDebugInfo[] = [];
  private metrics: StateMetrics;

  constructor(config: StateStoreConfig<T>) {
    this.cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: process.env.NODE_ENV === 'development'
    });

    this.state = new ReactiveStateImpl(config.initialState, 'root', this.cleanupManager);
    this.reducers = config.reducers || {};
    this.middleware = config.middleware || [];
    this.config = this.mergeConfig(config.config);

    this.metrics = {
      totalActions: 0,
      totalSubscribers: 0,
      averageActionTime: 0,
      memoryUsage: 0,
      lastUpdated: Date.now()
    };

    this.initializePersistence();
    this.setupDebugging();
  }

  // State Access Methods
  get<K extends keyof T>(key?: K): K extends undefined ? T : T[K] {
    if (key === undefined) {
      return this.state.get() as any;
    }
    return this.state.get()[key] as any;
  }

  select<R>(selector: StateSelector<T, R>): ReactiveState<R> {
    return this.state.select(selector);
  }

  subscribe(listener: StateListener<T>): () => void {
    this.metrics.totalSubscribers++;
    const cleanup = this.state.subscribe(listener);

    return () => {
      this.metrics.totalSubscribers--;
      cleanup();
    };
  }

  // State Mutation Methods
  dispatch(action: StateAction | string, payload?: StateValue, meta?: Record<string, any>): void {
    const startTime = performance.now();

    const fullAction: StateAction = typeof action === 'string'
      ? { type: action, payload, meta: meta || {}, timestamp: Date.now() }
      : action;

    if (this.config.debug?.enabled) {
      this.logAction(fullAction);
    }

    const previousState = this.state.get();
    let nextState = previousState;

    try {
      // Apply middleware
      let index = 0;
      const runMiddleware = () => {
        if (index < this.middleware.length) {
          const middleware = this.middleware[index];
          index++;
          middleware?.(() => runMiddleware(), fullAction);
        } else {
          // Apply reducer
          if (this.reducers[fullAction.type]) {
            nextState = this.reducers[fullAction.type]!(previousState, fullAction);
          } else {
            // Default reducer for simple updates
            if (fullAction.payload !== undefined) {
              if (fullAction.meta?.key) {
                nextState = { ...previousState, [fullAction.meta.key]: fullAction.payload };
              } else {
                nextState = typeof fullAction.payload === 'object'
                  ? { ...previousState, ...fullAction.payload }
                  : fullAction.payload as T;
              }
            }
          }

          // Update state
          this.state.set(nextState);
          this.persistState(nextState);

          // Update metrics
          const duration = performance.now() - startTime;
          this.updateMetrics(duration);

          if (this.config.debug?.enabled) {
            this.recordDebugInfo(fullAction, previousState, nextState, duration);
          }
        }
      };

      runMiddleware();

    } catch (error) {
      console.error(`Error dispatching action ${fullAction.type}:`, error);

      if (this.config.debug?.enabled) {
        this.recordDebugInfo(fullAction, previousState, previousState, performance.now() - startTime, error as Error);
      }
    }
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.dispatch('SET_STATE', value as StateValue, { key: key as string });
  }

  update(key: keyof T, updater: (current: any) => any): void {
    const currentValue = this.get(key as any);
    const newValue = updater(currentValue);
    this.set(key as any, newValue);
  }

  reset(newState?: Partial<T>): void {
    const resetAction: StateAction = {
      type: 'RESET',
      payload: newState as StateValue,
      timestamp: Date.now()
    };
    this.dispatch(resetAction);
  }

  // Persistence Methods
  private initializePersistence(): void {
    if (this.config.persistence?.enabled) {
      const persistedState = this.loadPersistedState();
      if (persistedState) {
        this.state.set(persistedState);
      }
    }
  }

  private persistState(state: T): void {
    if (!this.config.persistence?.enabled) return;

    try {
      const { key = 'app-state', storage = 'localStorage', serialize, excludeKeys = [] } = this.config.persistence;

      let stateToPersist = state;
      if (excludeKeys.length > 0) {
        stateToPersist = { ...state };
        excludeKeys.forEach(excludeKey => {
          delete (stateToPersist as any)[excludeKey];
        });
      }

      const serialized = serialize ? serialize(stateToPersist) : JSON.stringify(stateToPersist);

      if (storage === 'localStorage') {
        localStorage.setItem(key, serialized);
      } else if (storage === 'sessionStorage') {
        sessionStorage.setItem(key, serialized);
      }
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  }

  private loadPersistedState(): T | null {
    if (!this.config.persistence?.enabled) return null;

    try {
      const { key = 'app-state', storage = 'localStorage', deserialize } = this.config.persistence;

      let serialized: string | null = null;
      if (storage === 'localStorage') {
        serialized = localStorage.getItem(key);
      } else if (storage === 'sessionStorage') {
        serialized = sessionStorage.getItem(key);
      }

      if (serialized) {
        return deserialize ? deserialize(serialized) : JSON.parse(serialized);
      }
    } catch (error) {
      console.error('Failed to load persisted state:', error);
    }

    return null;
  }

  // Debugging Methods
  private setupDebugging(): void {
    if (this.config.debug?.enabled) {
      this.setupConsoleDebugging();
      this.setupPerformanceTracking();
    }
  }

  private setupConsoleDebugging(): void {
    if (process.env.NODE_ENV === 'development') {
      (window as any).__STATE_STORE__ = this;

      console.group('🗄️ State Manager Debug Mode');
      console.log('State Store initialized');
      console.log('Access via window.__STATE_STORE__');
      console.log('Available methods: getState(), getDebugInfo(), getMetrics()');
      console.groupEnd();
    }
  }

  private setupPerformanceTracking(): void {
    if (this.config.performance?.trackMetrics) {
      performanceMonitor.recordMetric('state-store-init', Date.now());
    }
  }

  private logAction(action: StateAction): void {
    if (this.config.debug?.logActions) {
      console.group(`🎬 Action: ${action.type}`);
      console.log('Payload:', action.payload);
      console.log('Meta:', action.meta);
      console.log('Timestamp:', new Date(action.timestamp));
      console.groupEnd();
    }
  }

  private recordDebugInfo(action: StateAction, previousState: any, nextState: any, duration: number, error?: Error): void {
    const debugInfo: StateDebugInfo = {
      action,
      previousState,
      nextState,
      timestamp: Date.now(),
      duration,
      stackTrace: error?.stack || ''
    };

    this.debugHistory.push(debugInfo);

    const maxHistorySize = this.config.debug?.maxHistorySize || 50;
    if (this.debugHistory.length > maxHistorySize) {
      this.debugHistory = this.debugHistory.slice(-maxHistorySize);
    }

    if (this.config.debug?.logStateChanges) {
      console.group(`🔄 State Change: ${action.type}`);
      console.log('Duration:', `${duration.toFixed(2)}ms`);
      console.log('Previous:', previousState);
      console.log('Next:', nextState);
      if (error) {
        console.error('Error:', error);
      }
      console.groupEnd();
    }
  }

  private updateMetrics(duration: number): void {
    this.metrics.totalActions++;
    this.metrics.lastUpdated = Date.now();

    // Update average action time
    this.metrics.averageActionTime =
      (this.metrics.averageActionTime * (this.metrics.totalActions - 1) + duration) / this.metrics.totalActions;

    // Estimate memory usage
    this.metrics.memoryUsage = JSON.stringify(this.state.get()).length;
  }

  // Utility Methods
  private mergeConfig(userConfig?: StateConfig): StateConfig {
    const defaultConfig: StateConfig = {
      persistence: {
        enabled: false,
        key: 'app-state',
        storage: 'localStorage'
      },
      debug: {
        enabled: process.env.NODE_ENV === 'development',
        logActions: true,
        logStateChanges: false,
        maxHistorySize: 50
      },
      performance: {
        trackMetrics: true,
        batchSize: 10,
        batchTimeout: 16
      }
    };

    return {
      persistence: { ...defaultConfig.persistence, ...userConfig?.persistence, enabled: userConfig?.persistence?.enabled ?? defaultConfig.persistence?.enabled ?? false },
      debug: { ...defaultConfig.debug, ...userConfig?.debug, enabled: userConfig?.debug?.enabled ?? defaultConfig.debug?.enabled ?? false },
      performance: { ...defaultConfig.performance, ...userConfig?.performance }
    };
  }

  // Public API Methods
  getState(): T {
    return this.state.get();
  }

  getDebugInfo(): StateDebugInfo[] {
    return [...this.debugHistory];
  }

  getMetrics(): StateMetrics {
    return { ...this.metrics };
  }

  clearDebugHistory(): void {
    this.debugHistory = [];
  }

  clearPersistedState(): void {
    if (this.config.persistence?.enabled) {
      const { key = 'app-state', storage = 'localStorage' } = this.config.persistence;

      if (storage === 'localStorage') {
        localStorage.removeItem(key);
      } else if (storage === 'sessionStorage') {
        sessionStorage.removeItem(key);
      }
    }
  }

  destroy(): void {
    this.debugHistory = [];
    this.cleanupManager.cleanup();
  }
}

// ============================================================================
// State Manager Factory
// ============================================================================

class StateManager {
  private stores: Map<string, StateStore> = new Map();
  private cleanupManager: CleanupManager;

  constructor() {
    this.cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: process.env.NODE_ENV === 'development'
    });
  }

  createStore<T>(
    name: string,
    config: StateStoreConfig<T>
  ): StateStore<T> {
    if (this.stores.has(name)) {
      throw new Error(`State store '${name}' already exists`);
    }

    const store = new StateStore(config) as any;
    this.stores.set(name, store);

    // Cleanup store on page unload
    this.cleanupManager.register(() => {
      this.stores.delete(name);
    }, {
      id: `state-store-${name}`,
      description: `State store cleanup for ${name}`,
      priority: 3
    });

    return store;
  }

  getStore<T>(name: string): StateStore<T> | undefined {
    return this.stores.get(name) as StateStore<T>;
  }

  removeStore(name: string): boolean {
    const store = this.stores.get(name);
    if (store) {
      store.destroy();
      this.stores.delete(name);
      return true;
    }
    return false;
  }

  getAllStores(): Map<string, StateStore> {
    return new Map(this.stores);
  }

  getStoreNames(): string[] {
    return Array.from(this.stores.keys());
  }

  // Utility method to create common store configurations
  static createStoreConfig<T>(
    initialState: T,
    options?: Partial<StateStoreConfig<T>>
  ): StateStoreConfig<T> {
    return {
      initialState,
      ...options
    };
  }

  destroy(): void {
    for (const store of this.stores.values()) {
      store.destroy();
    }
    this.stores.clear();
    this.cleanupManager.cleanup();
  }
}

// ============================================================================
// Exports
// ============================================================================

export const stateManager = new StateManager();

// Convenience exports
export const createStore = <T>(name: string, config: StateStoreConfig<T>) =>
  stateManager.createStore(name, config);

export const getStore = <T>(name: string): StateStore<T> | undefined =>
  stateManager.getStore<T>(name);

// Prebuilt middleware
export const loggerMiddleware: StateMiddleware = (next, action) => {
  console.log(`🔄 Dispatching: ${action.type}`, action.payload);
  next();
};

export const performanceMiddleware: StateMiddleware = (next, action) => {
  const start = performance.now();
  next();
  const duration = performance.now() - start;

  if (duration > 10) { // Log slow actions
    console.warn(`⚠️ Slow action detected: ${action.type} took ${duration.toFixed(2)}ms`);
  }
};

export const persistenceMiddleware: StateMiddleware = (next, action) => {
  // Prevent certain actions from being persisted
  if (action.type.startsWith('TEMP_')) {
    const originalMeta = action.meta || {};
    action.meta = { ...originalMeta, persist: false };
  }
  next();
};

export default stateManager;