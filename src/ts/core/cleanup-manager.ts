/**
 * Cleanup Manager - Memory Management Foundation
 *
 * Provides centralized cleanup management for preventing memory leaks.
 * This is a singleton service that tracks all cleanup tasks and ensures
 * they are executed when the application is destroyed or when explicitly called.
 *
 * @example
 * ```typescript
 * const cleanup = CleanupManager.getInstance();
 *
 * // Register event listener cleanup
 * const removeListener = cleanup.register(() => {
 *   element.removeEventListener('click', handler);
 * });
 *
 * // Register async cleanup
 * cleanup.register(async () => {
 *   await someAsyncCleanup();
 * });
 *
 * // Execute all cleanup tasks
 * cleanup.cleanup();
 * ```
 */

// Define disposable types locally to avoid circular imports
export interface Disposable {
  dispose(): void | Promise<void>;
}

export interface AsyncDisposable {
  dispose(): Promise<void>;
}

/**
 * Cleanup task that can be either synchronous or asynchronous
 */
export type CleanupTask = (() => void) | (() => Promise<void>) | Disposable | AsyncDisposable;

/**
 * Cleanup task metadata for tracking and debugging
 */
export interface CleanupTaskInfo {
  id: string;
  task: CleanupTask;
  description?: string;
  priority: number;
  createdAt: Date;
  executedAt?: Date;
  error?: Error;
}

/**
 * Cleanup manager configuration
 */
export interface CleanupManagerConfig {
  autoCleanupOnUnload: boolean;
  logCleanupActivity: boolean;
  maxTasks: number;
  defaultPriority: number;
}

/**
 * Global cleanup manager singleton
 * Ensures proper cleanup of resources, event listeners, and memory references
 */
export class CleanupManager {
  private static instance: CleanupManager | null = null;
  private tasks: Map<string, CleanupTaskInfo> = new Map();
  private isDestroyed: boolean = false;
  private config: CleanupManagerConfig;

  /**
   * Private constructor for singleton pattern
   */
  private constructor(config: Partial<CleanupManagerConfig> = {}) {
    this.config = {
      autoCleanupOnUnload: true,
      logCleanupActivity: process.env.NODE_ENV === 'development',
      maxTasks: 1000,
      defaultPriority: 0,
      ...config
    };

    // Setup automatic cleanup on page unload
    if (this.config.autoCleanupOnUnload && typeof window !== 'undefined') {
      this.setupAutoCleanup();
    }

    if (this.config.logCleanupActivity) {
      console.log('🧹 CleanupManager initialized');
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<CleanupManagerConfig>): CleanupManager {
    if (!CleanupManager.instance) {
      CleanupManager.instance = new CleanupManager(config);
    }
    return CleanupManager.instance;
  }

  /**
   * Reset singleton instance (useful for testing)
   */
  public static resetInstance(): void {
    if (CleanupManager.instance) {
      CleanupManager.instance.destroy();
    }
    CleanupManager.instance = null;
  }

  /**
   * Register a cleanup task
   *
   * @param task - Cleanup function or disposable object
   * @param options - Registration options
   * @returns Function to unregister the task
   */
  public register(
    task: CleanupTask,
    options: {
      id?: string;
      description?: string;
      priority?: number;
    } = {}
  ): () => void {
    if (this.isDestroyed) {
      console.warn('CleanupManager: Cannot register task after destruction');
      return () => {};
    }

    const id = options.id || this.generateTaskId();
    const priority = options.priority ?? this.config.defaultPriority;

    // Check if task already exists
    if (this.tasks.has(id)) {
      console.warn(`CleanupManager: Task with id '${id}' already exists`);
      return () => this.unregister(id);
    }

    // Check maximum tasks limit
    if (this.tasks.size >= this.config.maxTasks) {
      console.warn('CleanupManager: Maximum tasks limit reached');
      // Remove oldest low-priority tasks
      this.removeOldestTasks(1);
    }

    const taskInfo: CleanupTaskInfo = {
      id,
      task,
      ...(options.description && { description: options.description }),
      priority,
      createdAt: new Date()
    };

    this.tasks.set(id, taskInfo);

    if (this.config.logCleanupActivity) {
      console.log(`🧹 Cleanup task registered: ${id} ${options.description ? `- ${options.description}` : ''}`);
    }

    // Return unregister function
    return () => this.unregister(id);
  }

  /**
   * Unregister a cleanup task by ID
   */
  public unregister(id: string): boolean {
    const removed = this.tasks.delete(id);
    if (removed && this.config.logCleanupActivity) {
      console.log(`🧹 Cleanup task unregistered: ${id}`);
    }
    return removed;
  }

  /**
   * Execute all cleanup tasks
   *
   * @param options - Execution options
   * @returns Promise that resolves when all tasks are complete
   */
  public async cleanup(options: {
    priority?: number;
    reverse?: boolean;
    errors?: 'throw' | 'log' | 'ignore';
  } = {}): Promise<void> {
    if (this.isDestroyed) {
      console.warn('CleanupManager: Already destroyed');
      return;
    }

    const {
      priority,
      reverse = false,
      errors = 'log'
    } = options;

    const tasks = this.getTasksForCleanup(priority, reverse);

    if (this.config.logCleanupActivity) {
      console.log(`🧹 Executing ${tasks.length} cleanup tasks`);
    }

    const results = await Promise.allSettled(
      tasks.map(async (taskInfo) => this.executeTask(taskInfo, errors))
    );

    // Handle errors based on error strategy
    const failures = results.filter(result => result.status === 'fulfilled' && !result.value);
    const exceptions = results.filter(result => result.status === 'rejected');

    if (failures.length > 0) {
      console.warn(`🧹 ${failures.length} cleanup tasks failed`);
    }

    if (exceptions.length > 0 && errors === 'throw') {
      throw new Error(`${exceptions.length} cleanup tasks threw exceptions`);
    }

    if (this.config.logCleanupActivity) {
      console.log(`🧹 Cleanup completed: ${results.length - failures.length - exceptions.length} successful, ${failures.length} failed, ${exceptions.length} exceptions`);
    }
  }

  /**
   * Execute a single cleanup task
   */
  private async executeTask(
    taskInfo: CleanupTaskInfo,
    errorStrategy: 'throw' | 'log' | 'ignore'
  ): Promise<boolean> {
    const { id, task } = taskInfo;

    try {
      taskInfo.executedAt = new Date();

      if (this.isDisposable(task)) {
        if ('dispose' in task && typeof task.dispose === 'function') {
          await task.dispose();
        }
      } else if (typeof task === 'function') {
        const result = task();
        if (result instanceof Promise) {
          await result;
        }
      }

      return true;
    } catch (error) {
      taskInfo.error = error instanceof Error ? error : new Error(String(error));

      if (errorStrategy === 'throw') {
        throw error;
      } else if (errorStrategy === 'log') {
        console.error(`🧹 Cleanup task '${id}' failed:`, error);
      }

      return false;
    }
  }

  /**
   * Check if object is disposable
   */
  private isDisposable(obj: any): obj is Disposable | AsyncDisposable {
    return obj && typeof obj === 'object' && 'dispose' in obj;
  }

  /**
   * Get tasks for cleanup, sorted by priority
   */
  private getTasksForCleanup(
    priority?: number,
    reverse: boolean = false
  ): CleanupTaskInfo[] {
    let tasks = Array.from(this.tasks.values());

    // Filter by priority if specified
    if (priority !== undefined) {
      tasks = tasks.filter(task => task.priority >= priority);
    }

    // Sort by priority (higher priority first) and creation time
    tasks.sort((a, b) => {
      if (a.priority !== b.priority) {
        return reverse ? a.priority - b.priority : b.priority - a.priority;
      }
      return reverse ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime();
    });

    return tasks;
  }

  /**
   * Remove oldest tasks to make room for new ones
   */
  private removeOldestTasks(count: number): void {
    const tasks = Array.from(this.tasks.entries())
      .sort(([, a], [, b]) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, count);

    for (const [id] of tasks) {
      this.tasks.delete(id);
      if (this.config.logCleanupActivity) {
        console.log(`🧹 Removed old cleanup task: ${id}`);
      }
    }
  }

  /**
   * Generate unique task ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup automatic cleanup on page unload
   */
  private setupAutoCleanup(): void {
    const cleanupHandler = () => {
      // Execute only synchronous cleanup on unload
      const syncTasks = Array.from(this.tasks.values())
        .filter(taskInfo => {
          const task = taskInfo.task;
          if (this.isDisposable(task)) {
            return 'dispose' in task && typeof task.dispose === 'function';
          }
          return typeof task === 'function';
        });

      syncTasks.forEach(taskInfo => {
        try {
          this.executeTask(taskInfo, 'log');
        } catch (error) {
          console.error('Auto-cleanup error:', error);
        }
      });
    };

    // Register for multiple unload events
    window.addEventListener('unload', cleanupHandler, { once: true });
    window.addEventListener('beforeunload', cleanupHandler, { once: true });

    // Also cleanup on pagehide for better support in modern browsers
    window.addEventListener('pagehide', cleanupHandler, { once: true });
  }

  /**
   * Get cleanup statistics
   */
  public getStats(): {
    totalTasks: number;
    tasksByPriority: Record<number, number>;
    oldestTask: Date | null;
    newestTask: Date | null;
    isDestroyed: boolean;
  } {
    const tasks = Array.from(this.tasks.values());

    const tasksByPriority: Record<number, number> = {};
    tasks.forEach(task => {
      tasksByPriority[task.priority] = (tasksByPriority[task.priority] || 0) + 1;
    });

    const dates = tasks.map(task => task.createdAt);
    const oldestTask = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : null;
    const newestTask = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : null;

    return {
      totalTasks: tasks.length,
      tasksByPriority,
      oldestTask,
      newestTask,
      isDestroyed: this.isDestroyed
    };
  }

  /**
   * List all registered tasks
   */
  public listTasks(): Array<{
    id: string;
    description?: string;
    priority: number;
    createdAt: Date;
    executedAt?: Date;
    hasError: boolean;
  }> {
    return Array.from(this.tasks.values()).map(task => {
      const result: {
        id: string;
        description?: string;
        priority: number;
        createdAt: Date;
        executedAt?: Date;
        hasError: boolean;
      } = {
        id: task.id,
        priority: task.priority,
        createdAt: task.createdAt,
        hasError: !!task.error
      };

      if (task.description !== undefined) {
        result.description = task.description;
      }

      if (task.executedAt !== undefined) {
        result.executedAt = task.executedAt;
      }

      return result;
    });
  }

  /**
   * Clear all tasks without executing them
   */
  public clear(): void {
    const count = this.tasks.size;
    this.tasks.clear();

    if (this.config.logCleanupActivity) {
      console.log(`🧹 Cleared ${count} cleanup tasks without execution`);
    }
  }

  /**
   * Destroy the cleanup manager
   */
  public destroy(): void {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;

    // Execute cleanup tasks asynchronously but don't wait
    this.cleanup({ errors: 'log' }).catch(error => {
      console.error('Error during cleanup manager destruction:', error);
    });

    // Clear tasks
    this.tasks.clear();

    if (this.config.logCleanupActivity) {
      console.log('🧹 CleanupManager destroyed');
    }
  }

  /**
   * Force immediate synchronous cleanup (for emergency situations)
   */
  public forceCleanup(): void {
    if (this.isDestroyed) {
      return;
    }

    const tasks = this.getTasksForCleanup(undefined, false);

    for (const taskInfo of tasks) {
      try {
        const task = taskInfo.task;

        if (this.isDisposable(task) && typeof task.dispose === 'function') {
          task.dispose();
        } else if (typeof task === 'function') {
          task(); // Execute synchronously, ignore return value
        }

        taskInfo.executedAt = new Date();
      } catch (error) {
        console.error(`🧹 Force cleanup error for task '${taskInfo.id}':`, error);
        taskInfo.error = error instanceof Error ? error : new Error(String(error));
      }
    }

    this.tasks.clear();
    this.isDestroyed = true;

    if (this.config.logCleanupActivity) {
      console.log(`🧹 Force cleanup completed for ${tasks.length} tasks`);
    }
  }
}

/**
 * Create a cleanup manager instance
 * Convenience function for creating a new CleanupManager instance
 */
export const createCleanupManager = (config?: Partial<CleanupManagerConfig>): CleanupManager => {
  return CleanupManager.getInstance(config);
};

/**
 * Global cleanup manager instance
 * Default instance that can be used throughout the application
 */
export const globalCleanup = CleanupManager.getInstance();

/**
 * Utility function to register cleanup task with global instance
 */
export const registerCleanup = (
  task: CleanupTask,
  options?: {
    id?: string;
    description?: string;
    priority?: number;
  }
): (() => void) => {
  return globalCleanup.register(task, options);
};

/**
 * Utility function to cleanup all tasks with global instance
 */
export const cleanupAll = (options?: {
  priority?: number;
  reverse?: boolean;
  errors?: 'throw' | 'log' | 'ignore';
}): Promise<void> => {
  return globalCleanup.cleanup(options);
};