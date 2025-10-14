/**
 * Base Component Abstract Class
 *
 * Provides a foundation for all UI components with:
 * - Lifecycle management (init, destroy, cleanup)
 * - Event handling with automatic cleanup
 * - State management
 * - DOM element management
 * - Error handling and logging
 */

import { CleanupManager } from '../core/cleanup-manager';

export interface ComponentState {
  [key: string]: any;
}

export interface ComponentConfig {
  element?: HTMLElement;
  cleanupManager?: CleanupManager;
  autoCleanup?: boolean;
  logActivity?: boolean;
}

/**
 * Abstract base class for all components
 */
export abstract class BaseComponent<TState extends ComponentState = ComponentState> {
  protected element: HTMLElement | null = null;
  protected state: TState;
  protected cleanupManager: CleanupManager;
  protected isInitialized: boolean = false;
  protected isDestroyed: boolean = false;
  protected config: ComponentConfig;
  protected eventListeners: Map<string, EventListener[]> = new Map();

  constructor(config: ComponentConfig = {}) {
    this.config = {
      autoCleanup: true,
      logActivity: false,
      ...config
    };

    this.cleanupManager = this.config.cleanupManager || CleanupManager.getInstance({
      autoCleanupOnUnload: this.config.autoCleanup ?? true,
      logCleanupActivity: (this.config.logActivity ?? false) || process.env.NODE_ENV === 'development'
    });

    // Initialize state
    this.state = this.getInitialState() as TState;

    if (this.config.element) {
      this.setElement(this.config.element);
    }

    this.log('Component created');
  }

  /**
   * Get initial state for the component
   * Override in subclasses to define default state
   */
  protected getInitialState(): Partial<TState> {
    return {};
  }

  /**
   * Initialize the component
   * This should be called after creating the component
   */
  public async init(): Promise<void> {
    if (this.isInitialized) {
      this.warn('Component already initialized');
      return;
    }

    if (this.isDestroyed) {
      throw new Error('Cannot initialize destroyed component');
    }

    try {
      await this.onInit();
      this.isInitialized = true;
      this.log('Component initialized');
    } catch (error) {
      this.error('Failed to initialize component:', error);
      throw error;
    }
  }

  /**
   * Called during component initialization
   * Override in subclasses to implement initialization logic
   */
  protected async onInit(): Promise<void> {
    // Override in subclasses
  }

  /**
   * Destroy the component and clean up resources
   */
  public destroy(): void {
    if (this.isDestroyed) {
      this.warn('Component already destroyed');
      return;
    }

    try {
      this.onDestroy();
      this.cleanup();
      this.isDestroyed = true;
      this.isInitialized = false;
      this.log('Component destroyed');
    } catch (error) {
      this.error('Failed to destroy component:', error);
    }
  }

  /**
   * Called during component destruction
   * Override in subclasses to implement cleanup logic
   */
  protected onDestroy(): void {
    // Override in subclasses
  }

  /**
   * Set the DOM element for this component
   */
  public setElement(element: HTMLElement): void {
    if (this.isInitialized) {
      throw new Error('Cannot change element after initialization');
    }

    this.element = element;
    this.log('Element set:', element.tagName);
  }

  /**
   * Get the DOM element for this component
   */
  public getElement(): HTMLElement | null {
    return this.element;
  }

  /**
   * Update component state
   */
  public setState(updates: Partial<TState>): void {
    if (this.isDestroyed) {
      this.warn('Cannot update state on destroyed component');
      return;
    }

    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };

    this.onStateUpdate(prevState, this.state);
    this.log('State updated:', updates);
  }

  /**
   * Get current component state
   */
  public getState(): Readonly<TState> {
    return { ...this.state };
  }

  /**
   * Called when state is updated
   * Override in subclasses to react to state changes
   */
  protected onStateUpdate(_prevState: TState, _nextState: TState): void {
    // Override in subclasses
  }

  /**
   * Add event listener with automatic cleanup
   */
  protected addEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (this.isDestroyed) {
      this.warn('Cannot add event listener to destroyed component');
      return;
    }

    // Register with cleanup manager
    element.addEventListener(type, listener as EventListener, options);
    this.cleanupManager.register(() => {
      element.removeEventListener(type, listener as EventListener, options);
    }, {
      description: `${this.constructor.name} event listener: ${type}`,
    });

    // Track for debugging
    const key = `${element.tagName}.${type}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key)!.push(listener as EventListener);
  }

  /**
   * Remove event listener
   */
  protected removeEventListener<K extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void {
    element.removeEventListener(type, listener as EventListener, options);

    // Update tracking
    const key = `${element.tagName}.${type}`;
    const listeners = this.eventListeners.get(key);
    if (listeners) {
      const index = listeners.indexOf(listener as EventListener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Register a cleanup function
   */
  protected registerCleanup(cleanup: () => void, priority?: number): () => void {
    if (this.isDestroyed) {
      this.warn('Cannot register cleanup on destroyed component');
      return () => {};
    }

    return this.cleanupManager.register(cleanup, {
      description: `${this.constructor.name} cleanup`,
      ...(priority !== undefined && { priority })
    });
  }

  /**
   * Clean up all component resources
   */
  protected cleanup(): void {
    if (this.element) {
      // Remove event listeners (handled by cleanup manager)
      this.element = null;
    }

    // Clear state
    this.state = {} as TState;

    // Clear event listener tracking
    this.eventListeners.clear();

    this.log('Component cleanup completed');
  }

  /**
   * Check if component is initialized
   */
  public isReady(): boolean {
    return this.isInitialized && !this.isDestroyed;
  }

  /**
   * Check if component is destroyed
   */
  public isComponentDestroyed(): boolean {
    return this.isDestroyed;
  }

  /**
   * Get component statistics for debugging
   */
  public getStats(): object {
    return {
      name: this.constructor.name,
      isInitialized: this.isInitialized,
      isDestroyed: this.isDestroyed,
      hasElement: !!this.element,
      eventListenerCount: Array.from(this.eventListeners.values())
        .reduce((total, listeners) => total + listeners.length, 0),
      stateKeys: Object.keys(this.state).length,
      cleanupManagerStats: this.cleanupManager.getStats()
    };
  }

  /**
   * Log message if logging is enabled
   */
  protected log(message: string, ...data: any[]): void {
    if (this.config.logActivity || process.env.NODE_ENV === 'development') {
      console.log(`[${this.constructor.name}] ${message}`, ...data);
    }
  }

  /**
   * Log warning if logging is enabled
   */
  protected warn(message: string, ...data: any[]): void {
    if (this.config.logActivity || process.env.NODE_ENV === 'development') {
      console.warn(`[${this.constructor.name}] ${message}`, ...data);
    }
  }

  /**
   * Log error if logging is enabled
   */
  protected error(message: string, ...data: any[]): void {
    console.error(`[${this.constructor.name}] ${message}`, ...data);
  }

  /**
   * Static factory method to create and initialize a component
   */
  public static async createAndInit<T extends BaseComponent>(
    this: new (config?: ComponentConfig) => T,
    config?: ComponentConfig
  ): Promise<T> {
    const component = new this(config);
    await component.init();
    return component;
  }
}