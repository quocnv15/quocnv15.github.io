// src/ts/core/cleanup-manager.ts
var _CleanupManager = class _CleanupManager {
  /**
   * Private constructor for singleton pattern
   */
  constructor(config = {}) {
    this.tasks = /* @__PURE__ */ new Map();
    this.isDestroyed = false;
    this.config = {
      autoCleanupOnUnload: true,
      logCleanupActivity: true,
      maxTasks: 1e3,
      defaultPriority: 0,
      ...config
    };
    if (this.config.autoCleanupOnUnload && typeof window !== "undefined") {
      this.setupAutoCleanup();
    }
    if (this.config.logCleanupActivity) {
      console.log("\u{1F9F9} CleanupManager initialized");
    }
  }
  /**
   * Get singleton instance
   */
  static getInstance(config) {
    if (!_CleanupManager.instance) {
      _CleanupManager.instance = new _CleanupManager(config);
    }
    return _CleanupManager.instance;
  }
  /**
   * Reset singleton instance (useful for testing)
   */
  static resetInstance() {
    if (_CleanupManager.instance) {
      _CleanupManager.instance.destroy();
    }
    _CleanupManager.instance = null;
  }
  /**
   * Register a cleanup task
   *
   * @param task - Cleanup function or disposable object
   * @param options - Registration options
   * @returns Function to unregister the task
   */
  register(task, options = {}) {
    var _a;
    if (this.isDestroyed) {
      console.warn("CleanupManager: Cannot register task after destruction");
      return () => {
      };
    }
    const id = options.id || this.generateTaskId();
    const priority = (_a = options.priority) != null ? _a : this.config.defaultPriority;
    if (this.tasks.has(id)) {
      console.warn(`CleanupManager: Task with id '${id}' already exists`);
      return () => this.unregister(id);
    }
    if (this.tasks.size >= this.config.maxTasks) {
      console.warn("CleanupManager: Maximum tasks limit reached");
      this.removeOldestTasks(1);
    }
    const taskInfo = {
      id,
      task,
      ...options.description && { description: options.description },
      priority,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.tasks.set(id, taskInfo);
    if (this.config.logCleanupActivity) {
      console.log(`\u{1F9F9} Cleanup task registered: ${id} ${options.description ? `- ${options.description}` : ""}`);
    }
    return () => this.unregister(id);
  }
  /**
   * Unregister a cleanup task by ID
   */
  unregister(id) {
    const removed = this.tasks.delete(id);
    if (removed && this.config.logCleanupActivity) {
      console.log(`\u{1F9F9} Cleanup task unregistered: ${id}`);
    }
    return removed;
  }
  /**
   * Execute all cleanup tasks
   *
   * @param options - Execution options
   * @returns Promise that resolves when all tasks are complete
   */
  async cleanup(options = {}) {
    if (this.isDestroyed) {
      console.warn("CleanupManager: Already destroyed");
      return;
    }
    const {
      priority,
      reverse = false,
      errors = "log"
    } = options;
    const tasks = this.getTasksForCleanup(priority, reverse);
    if (this.config.logCleanupActivity) {
      console.log(`\u{1F9F9} Executing ${tasks.length} cleanup tasks`);
    }
    const results = await Promise.allSettled(
      tasks.map(async (taskInfo) => this.executeTask(taskInfo, errors))
    );
    const failures = results.filter((result) => result.status === "fulfilled" && !result.value);
    const exceptions = results.filter((result) => result.status === "rejected");
    if (failures.length > 0) {
      console.warn(`\u{1F9F9} ${failures.length} cleanup tasks failed`);
    }
    if (exceptions.length > 0 && errors === "throw") {
      throw new Error(`${exceptions.length} cleanup tasks threw exceptions`);
    }
    if (this.config.logCleanupActivity) {
      console.log(`\u{1F9F9} Cleanup completed: ${results.length - failures.length - exceptions.length} successful, ${failures.length} failed, ${exceptions.length} exceptions`);
    }
  }
  /**
   * Execute a single cleanup task
   */
  async executeTask(taskInfo, errorStrategy) {
    const { id, task } = taskInfo;
    try {
      taskInfo.executedAt = /* @__PURE__ */ new Date();
      if (this.isDisposable(task)) {
        if ("dispose" in task && typeof task.dispose === "function") {
          await task.dispose();
        }
      } else if (typeof task === "function") {
        const result = task();
        if (result instanceof Promise) {
          await result;
        }
      }
      return true;
    } catch (error) {
      taskInfo.error = error instanceof Error ? error : new Error(String(error));
      if (errorStrategy === "throw") {
        throw error;
      } else if (errorStrategy === "log") {
        console.error(`\u{1F9F9} Cleanup task '${id}' failed:`, error);
      }
      return false;
    }
  }
  /**
   * Check if object is disposable
   */
  isDisposable(obj) {
    return obj && typeof obj === "object" && "dispose" in obj;
  }
  /**
   * Get tasks for cleanup, sorted by priority
   */
  getTasksForCleanup(priority, reverse = false) {
    let tasks = Array.from(this.tasks.values());
    if (priority !== void 0) {
      tasks = tasks.filter((task) => task.priority >= priority);
    }
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
  removeOldestTasks(count) {
    const tasks = Array.from(this.tasks.entries()).sort(([, a], [, b]) => a.createdAt.getTime() - b.createdAt.getTime()).slice(0, count);
    for (const [id] of tasks) {
      this.tasks.delete(id);
      if (this.config.logCleanupActivity) {
        console.log(`\u{1F9F9} Removed old cleanup task: ${id}`);
      }
    }
  }
  /**
   * Generate unique task ID
   */
  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Setup automatic cleanup on page unload
   */
  setupAutoCleanup() {
    const cleanupHandler = () => {
      const syncTasks = Array.from(this.tasks.values()).filter((taskInfo) => {
        const task = taskInfo.task;
        if (this.isDisposable(task)) {
          return "dispose" in task && typeof task.dispose === "function";
        }
        return typeof task === "function";
      });
      syncTasks.forEach((taskInfo) => {
        try {
          this.executeTask(taskInfo, "log");
        } catch (error) {
          console.error("Auto-cleanup error:", error);
        }
      });
    };
    window.addEventListener("unload", cleanupHandler, { once: true });
    window.addEventListener("beforeunload", cleanupHandler, { once: true });
    window.addEventListener("pagehide", cleanupHandler, { once: true });
  }
  /**
   * Get cleanup statistics
   */
  getStats() {
    const tasks = Array.from(this.tasks.values());
    const tasksByPriority = {};
    tasks.forEach((task) => {
      tasksByPriority[task.priority] = (tasksByPriority[task.priority] || 0) + 1;
    });
    const dates = tasks.map((task) => task.createdAt);
    const oldestTask = dates.length > 0 ? new Date(Math.min(...dates.map((d) => d.getTime()))) : null;
    const newestTask = dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : null;
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
  listTasks() {
    return Array.from(this.tasks.values()).map((task) => {
      const result = {
        id: task.id,
        priority: task.priority,
        createdAt: task.createdAt,
        hasError: !!task.error
      };
      if (task.description !== void 0) {
        result.description = task.description;
      }
      if (task.executedAt !== void 0) {
        result.executedAt = task.executedAt;
      }
      return result;
    });
  }
  /**
   * Clear all tasks without executing them
   */
  clear() {
    const count = this.tasks.size;
    this.tasks.clear();
    if (this.config.logCleanupActivity) {
      console.log(`\u{1F9F9} Cleared ${count} cleanup tasks without execution`);
    }
  }
  /**
   * Destroy the cleanup manager
   */
  destroy() {
    if (this.isDestroyed) {
      return;
    }
    this.isDestroyed = true;
    this.cleanup({ errors: "log" }).catch((error) => {
      console.error("Error during cleanup manager destruction:", error);
    });
    this.tasks.clear();
    if (this.config.logCleanupActivity) {
      console.log("\u{1F9F9} CleanupManager destroyed");
    }
  }
  /**
   * Force immediate synchronous cleanup (for emergency situations)
   */
  forceCleanup() {
    if (this.isDestroyed) {
      return;
    }
    const tasks = this.getTasksForCleanup(void 0, false);
    for (const taskInfo of tasks) {
      try {
        const task = taskInfo.task;
        if (this.isDisposable(task) && typeof task.dispose === "function") {
          task.dispose();
        } else if (typeof task === "function") {
          task();
        }
        taskInfo.executedAt = /* @__PURE__ */ new Date();
      } catch (error) {
        console.error(`\u{1F9F9} Force cleanup error for task '${taskInfo.id}':`, error);
        taskInfo.error = error instanceof Error ? error : new Error(String(error));
      }
    }
    this.tasks.clear();
    this.isDestroyed = true;
    if (this.config.logCleanupActivity) {
      console.log(`\u{1F9F9} Force cleanup completed for ${tasks.length} tasks`);
    }
  }
};
_CleanupManager.instance = null;
var CleanupManager = _CleanupManager;
var globalCleanup = CleanupManager.getInstance();
var registerCleanup = (task, options) => {
  return globalCleanup.register(task, options);
};

// src/ts/modules/utils/dom.ts
var qsSafe = (selector, parent = document) => {
  return parent.querySelector(selector);
};
var qsa = (selector, parent = document) => {
  return parent.querySelectorAll(selector);
};
var create = (tag, attributes, textContent) => {
  const element = document.createElement(tag);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  if (textContent !== void 0) {
    element.textContent = textContent;
  }
  return element;
};
var ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};
var throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
var scrollToElement = (element, offset = 0, behavior = "smooth") => {
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - offset;
  window.scrollTo({
    top: offsetPosition,
    behavior
  });
};
var addEventListener = (element, event, handler, options) => {
  element.addEventListener(event, handler, options);
  const cleanup = () => {
    element.removeEventListener(event, handler, options);
  };
  registerCleanup(cleanup, {
    description: `Event listener: ${event} on ${element.tagName.toLowerCase()}${element.id ? "#" + element.id : ""}`,
    priority: 1
    // Event listeners are high priority
  });
  return cleanup;
};

// src/ts/core/performance-monitor.ts
var PerformanceMonitor = class {
  constructor(config = {}) {
    this.observers = [];
    this.startTime = 0;
    this.config = {
      enabled: true,
      collectVitals: true,
      collectRuntime: true,
      collectBundle: true,
      reportingEndpoint: null,
      reportInterval: 3e4,
      // 30 seconds
      ...config
    };
    this.metrics = this.initializeMetrics();
  }
  /**
   * Initialize performance monitoring
   */
  init() {
    if (!this.config.enabled) {
      console.log("\u{1F4CA} Performance monitoring disabled");
      return;
    }
    this.startTime = performance.now();
    console.log("\u{1F4CA} Performance monitoring initialized");
    if (this.config.collectVitals) {
      this.setupVitalsCollection();
    }
    if (this.config.collectRuntime) {
      this.setupRuntimeCollection();
    }
    if (this.config.collectBundle) {
      this.collectBundleMetrics();
    }
    this.setupPeriodicReporting();
  }
  /**
   * Get current performance metrics
   */
  getMetrics() {
    this.updateRuntimeMetrics();
    return { ...this.metrics };
  }
  /**
   * Record a custom performance metric
   */
  recordMetric(name, value) {
    this.metrics.custom[name] = value;
    console.log(`\u{1F4CA} Custom metric recorded: ${name} = ${value}ms`);
  }
  /**
   * Mark a performance point
   */
  mark(name) {
    if (performance.mark) {
      performance.mark(name);
      console.log(`\u{1F4CA} Performance mark: ${name}`);
    }
  }
  /**
   * Measure time between marks
   */
  measure(name, startMark, endMark) {
    var _a;
    if (performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name, "measure");
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          const duration = (_a = lastEntry == null ? void 0 : lastEntry.duration) != null ? _a : 0;
          console.log(`\u{1F4CA} Performance measure: ${name} = ${duration.toFixed(2)}ms`);
          return duration;
        }
      } catch (error) {
        console.warn(`\u26A0\uFE0F Performance measure failed for ${name}:`, error);
      }
    }
    return 0;
  }
  /**
   * Generate performance report
   */
  generateReport() {
    const metrics = this.getMetrics();
    const timestamp = Date.now();
    return {
      timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics,
      score: this.calculatePerformanceScore(metrics),
      recommendations: this.generateRecommendations(metrics)
    };
  }
  /**
   * Cleanup performance monitoring
   */
  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    console.log("\u{1F4CA} Performance monitoring destroyed");
  }
  // ============================================================================
  // Private Methods
  // ============================================================================
  initializeMetrics() {
    return {
      bundle: {
        size: { raw: 0, gzipped: 0, brotli: 0 },
        loadTime: 0,
        parseTime: 0,
        modules: 0
      },
      runtime: {
        initTime: 0,
        renderTime: 0,
        interactiveTime: 0,
        memoryUsage: 0,
        domNodes: 0
      },
      vitals: {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0
      },
      custom: {}
    };
  }
  setupVitalsCollection() {
    this.observePerformanceObserver("largest-contentful-paint", (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.vitals.lcp = lastEntry.startTime;
      console.log(`\u{1F4CA} LCP: ${lastEntry.startTime.toFixed(2)}ms`);
    });
    this.observePerformanceObserver("first-input", (entries) => {
      const firstEntry = entries[0];
      if (firstEntry) {
        this.metrics.vitals.fid = firstEntry.processingStart - firstEntry.startTime;
        console.log(`\u{1F4CA} FID: ${this.metrics.vitals.fid.toFixed(2)}ms`);
      }
    });
    let clsValue = 0;
    this.observePerformanceObserver("layout-shift", (entries) => {
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.vitals.cls = clsValue;
      console.log(`\u{1F4CA} CLS: ${clsValue.toFixed(4)}`);
    });
    this.observePerformanceObserver("paint", (entries) => {
      const fcpEntry = entries.find((entry) => entry.name === "first-contentful-paint");
      if (fcpEntry) {
        this.metrics.vitals.fcp = fcpEntry.startTime;
        console.log(`\u{1F4CA} FCP: ${fcpEntry.startTime.toFixed(2)}ms`);
      }
    });
    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType("navigation");
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        if ((navEntry == null ? void 0 : navEntry.responseStart) && (navEntry == null ? void 0 : navEntry.requestStart)) {
          this.metrics.vitals.ttfb = navEntry.responseStart - navEntry.requestStart;
          console.log(`\u{1F4CA} TTFB: ${this.metrics.vitals.ttfb.toFixed(2)}ms`);
        }
      }
    }
  }
  observePerformanceObserver(type, callback) {
    if (!("PerformanceObserver" in window)) {
      return;
    }
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`\u26A0\uFE0F Failed to observe ${type}:`, error);
    }
  }
  setupRuntimeCollection() {
    setTimeout(() => {
      this.updateRuntimeMetrics();
    }, 0);
    if ("memory" in performance) {
      setInterval(() => {
        this.metrics.runtime.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
      }, 5e3);
    }
    const observer = new MutationObserver(() => {
      this.metrics.runtime.domNodes = document.querySelectorAll("*").length;
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    this.observers.push(observer);
  }
  updateRuntimeMetrics() {
    this.metrics.runtime.initTime = performance.now() - this.startTime;
    if (performance.getEntriesByType) {
      const entries = performance.getEntriesByType("navigation");
      if (entries.length > 0) {
        const navEntry = entries[0];
        if ((navEntry == null ? void 0 : navEntry.loadEventEnd) && (navEntry == null ? void 0 : navEntry.loadEventStart)) {
          this.metrics.runtime.interactiveTime = navEntry.loadEventEnd - navEntry.loadEventStart;
        }
      }
    }
  }
  collectBundleMetrics() {
    const scripts = document.querySelectorAll("script[src]");
    let totalSize = 0;
    let moduleCount = 0;
    scripts.forEach((script) => {
      var _a;
      if ((_a = script.src) == null ? void 0 : _a.includes("/assets/js/main.js")) {
        moduleCount++;
        totalSize += 64e3;
      }
    });
    this.metrics.bundle.size.raw = totalSize;
    this.metrics.bundle.modules = moduleCount;
    if (performance.getEntriesByType) {
      const entries = performance.getEntriesByType("resource");
      const bundleEntry = entries.find(
        (entry) => entry.name.includes("/assets/js/main.js")
      );
      if (bundleEntry && "responseEnd" in bundleEntry && "requestStart" in bundleEntry) {
        const bundleTiming = bundleEntry;
        this.metrics.bundle.loadTime = bundleTiming.responseEnd - bundleTiming.requestStart;
      }
    }
    console.log(`\u{1F4CA} Bundle metrics collected: ${totalSize} bytes, ${moduleCount} modules`);
  }
  setupPeriodicReporting() {
    if (!this.config.reportingEndpoint) {
      return;
    }
    setInterval(() => {
      this.sendReport();
    }, this.config.reportInterval);
  }
  sendReport() {
    if (!this.config.reportingEndpoint) {
      return;
    }
    const report = this.generateReport();
    fetch(this.config.reportingEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(report)
    }).catch((error) => {
      console.warn("\u26A0\uFE0F Failed to send performance report:", error);
    });
  }
  calculatePerformanceScore(metrics) {
    let score = 100;
    if (metrics.vitals.lcp > 2500) score -= 20;
    if (metrics.vitals.fid > 100) score -= 15;
    if (metrics.vitals.cls > 0.1) score -= 15;
    if (metrics.vitals.fcp > 1800) score -= 15;
    if (metrics.vitals.ttfb > 800) score -= 10;
    if (metrics.bundle.size.raw > 5e4) score -= 10;
    if (metrics.runtime.initTime > 1e3) score -= 10;
    return Math.max(0, score);
  }
  generateRecommendations(metrics) {
    const recommendations = [];
    if (metrics.vitals.lcp > 2500) {
      recommendations.push("Optimize images and reduce server response time for better LCP");
    }
    if (metrics.vitals.fid > 100) {
      recommendations.push("Reduce JavaScript execution time and break up long tasks");
    }
    if (metrics.vitals.cls > 0.1) {
      recommendations.push("Ensure proper dimensions for images and avoid inserting content above existing content");
    }
    if (metrics.bundle.size.raw > 5e4) {
      recommendations.push("Consider code splitting and tree shaking to reduce bundle size");
    }
    if (metrics.runtime.initTime > 1e3) {
      recommendations.push("Optimize application initialization and load critical resources first");
    }
    if (metrics.runtime.memoryUsage > 50) {
      recommendations.push("Monitor for memory leaks and optimize memory usage");
    }
    return recommendations;
  }
};
var performanceMonitor = new PerformanceMonitor({
  enabled: false,
  collectVitals: true,
  collectRuntime: true,
  collectBundle: true,
  reportingEndpoint: null,
  // Configure as needed
  reportInterval: 3e4
});
var initPerformanceMonitoring = () => {
  performanceMonitor.init();
};

// src/ts/core/state-manager.ts
var ReactiveStateImpl = class _ReactiveStateImpl {
  constructor(initialValue, key, cleanupManager) {
    this.listeners = /* @__PURE__ */ new Set();
    this._value = initialValue;
    this.key = key;
    this.cleanupManager = cleanupManager;
  }
  get value() {
    return this._value;
  }
  subscribe(listener) {
    this.listeners.add(listener);
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
  select(selector) {
    const selectedValue = selector(this._value);
    const selectedState = new _ReactiveStateImpl(selectedValue, `${this.key}-selected`, this.cleanupManager);
    this.subscribe((newValue) => {
      const newSelectedValue = selector(newValue);
      if (JSON.stringify(newSelectedValue) !== JSON.stringify(selectedState._value)) {
        selectedState._value = newSelectedValue;
        selectedState.notify();
      }
    });
    return selectedState;
  }
  get() {
    return this._value;
  }
  set(value) {
    const previousValue = this._value;
    if (JSON.stringify(previousValue) !== JSON.stringify(value)) {
      this._value = value;
      this.notify();
    }
  }
  update(updater) {
    const newValue = updater(this._value);
    this.set(newValue);
  }
  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this._value, this._value);
      } catch (error) {
        console.error(`Error in state listener for ${this.key}:`, error);
      }
    }
  }
  destroy() {
    this.listeners.clear();
  }
};
var StateStore = class {
  constructor(config) {
    this.debugHistory = [];
    this.cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: true
    });
    this.state = new ReactiveStateImpl(config.initialState, "root", this.cleanupManager);
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
  get(key) {
    if (key === void 0) {
      return this.state.get();
    }
    return this.state.get()[key];
  }
  select(selector) {
    return this.state.select(selector);
  }
  subscribe(listener) {
    this.metrics.totalSubscribers++;
    const cleanup = this.state.subscribe(listener);
    return () => {
      this.metrics.totalSubscribers--;
      cleanup();
    };
  }
  // State Mutation Methods
  dispatch(action, payload, meta) {
    var _a, _b;
    const startTime = performance.now();
    const fullAction = typeof action === "string" ? { type: action, payload, meta, timestamp: Date.now() } : action;
    if ((_a = this.config.debug) == null ? void 0 : _a.enabled) {
      this.logAction(fullAction);
    }
    const previousState = this.state.get();
    let nextState = previousState;
    try {
      let index = 0;
      const runMiddleware = () => {
        var _a2;
        if (index < this.middleware.length) {
          const middleware = this.middleware[index];
          index++;
          middleware(() => runMiddleware(), fullAction);
        } else {
          if (this.reducers[fullAction.type]) {
            nextState = this.reducers[fullAction.type](previousState, fullAction);
          } else {
            if (fullAction.payload !== void 0) {
              if (meta == null ? void 0 : meta.key) {
                nextState = { ...previousState, [meta.key]: fullAction.payload };
              } else {
                nextState = typeof fullAction.payload === "object" ? { ...previousState, ...fullAction.payload } : fullAction.payload;
              }
            }
          }
          this.state.set(nextState);
          this.persistState(nextState);
          const duration = performance.now() - startTime;
          this.updateMetrics(duration);
          if ((_a2 = this.config.debug) == null ? void 0 : _a2.enabled) {
            this.recordDebugInfo(fullAction, previousState, nextState, duration);
          }
        }
      };
      runMiddleware();
    } catch (error) {
      console.error(`Error dispatching action ${fullAction.type}:`, error);
      if ((_b = this.config.debug) == null ? void 0 : _b.enabled) {
        this.recordDebugInfo(fullAction, previousState, previousState, performance.now() - startTime, error);
      }
    }
  }
  set(key, value) {
    this.dispatch("SET_STATE", value, { key });
  }
  update(key, updater) {
    const currentValue = this.get(key);
    const newValue = updater(currentValue);
    this.set(key, newValue);
  }
  reset(newState) {
    const resetAction = {
      type: "RESET",
      payload: newState,
      timestamp: Date.now()
    };
    this.dispatch(resetAction);
  }
  // Persistence Methods
  initializePersistence() {
    var _a;
    if ((_a = this.config.persistence) == null ? void 0 : _a.enabled) {
      const persistedState = this.loadPersistedState();
      if (persistedState) {
        this.state.set(persistedState);
      }
    }
  }
  persistState(state) {
    var _a;
    if (!((_a = this.config.persistence) == null ? void 0 : _a.enabled)) return;
    try {
      const { key = "app-state", storage = "localStorage", serialize, excludeKeys = [] } = this.config.persistence;
      let stateToPersist = state;
      if (excludeKeys.length > 0) {
        stateToPersist = { ...state };
        excludeKeys.forEach((excludeKey) => {
          delete stateToPersist[excludeKey];
        });
      }
      const serialized = serialize ? serialize(stateToPersist) : JSON.stringify(stateToPersist);
      if (storage === "localStorage") {
        localStorage.setItem(key, serialized);
      } else if (storage === "sessionStorage") {
        sessionStorage.setItem(key, serialized);
      }
    } catch (error) {
      console.error("Failed to persist state:", error);
    }
  }
  loadPersistedState() {
    var _a;
    if (!((_a = this.config.persistence) == null ? void 0 : _a.enabled)) return null;
    try {
      const { key = "app-state", storage = "localStorage", deserialize } = this.config.persistence;
      let serialized = null;
      if (storage === "localStorage") {
        serialized = localStorage.getItem(key);
      } else if (storage === "sessionStorage") {
        serialized = sessionStorage.getItem(key);
      }
      if (serialized) {
        return deserialize ? deserialize(serialized) : JSON.parse(serialized);
      }
    } catch (error) {
      console.error("Failed to load persisted state:", error);
    }
    return null;
  }
  // Debugging Methods
  setupDebugging() {
    var _a;
    if ((_a = this.config.debug) == null ? void 0 : _a.enabled) {
      this.setupConsoleDebugging();
      this.setupPerformanceTracking();
    }
  }
  setupConsoleDebugging() {
    if (true) {
      window.__STATE_STORE__ = this;
      console.group("\u{1F5C4}\uFE0F State Manager Debug Mode");
      console.log("State Store initialized");
      console.log("Access via window.__STATE_STORE__");
      console.log("Available methods: getState(), getDebugInfo(), getMetrics()");
      console.groupEnd();
    }
  }
  setupPerformanceTracking() {
    var _a;
    if ((_a = this.config.performance) == null ? void 0 : _a.trackMetrics) {
      performanceMonitor.recordMetric("state-store-init", Date.now());
    }
  }
  logAction(action) {
    var _a;
    if ((_a = this.config.debug) == null ? void 0 : _a.logActions) {
      console.group(`\u{1F3AC} Action: ${action.type}`);
      console.log("Payload:", action.payload);
      console.log("Meta:", action.meta);
      console.log("Timestamp:", new Date(action.timestamp));
      console.groupEnd();
    }
  }
  recordDebugInfo(action, previousState, nextState, duration, error) {
    var _a, _b;
    const debugInfo = {
      action,
      previousState,
      nextState,
      timestamp: Date.now(),
      duration,
      stackTrace: error == null ? void 0 : error.stack
    };
    this.debugHistory.push(debugInfo);
    const maxHistorySize = ((_a = this.config.debug) == null ? void 0 : _a.maxHistorySize) || 50;
    if (this.debugHistory.length > maxHistorySize) {
      this.debugHistory = this.debugHistory.slice(-maxHistorySize);
    }
    if ((_b = this.config.debug) == null ? void 0 : _b.logStateChanges) {
      console.group(`\u{1F504} State Change: ${action.type}`);
      console.log("Duration:", `${duration.toFixed(2)}ms`);
      console.log("Previous:", previousState);
      console.log("Next:", nextState);
      if (error) {
        console.error("Error:", error);
      }
      console.groupEnd();
    }
  }
  updateMetrics(duration) {
    this.metrics.totalActions++;
    this.metrics.lastUpdated = Date.now();
    this.metrics.averageActionTime = (this.metrics.averageActionTime * (this.metrics.totalActions - 1) + duration) / this.metrics.totalActions;
    this.metrics.memoryUsage = JSON.stringify(this.state.get()).length;
  }
  // Utility Methods
  mergeConfig(userConfig) {
    const defaultConfig = {
      persistence: {
        enabled: false,
        key: "app-state",
        storage: "localStorage"
      },
      debug: {
        enabled: true,
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
      persistence: { ...defaultConfig.persistence, ...userConfig == null ? void 0 : userConfig.persistence },
      debug: { ...defaultConfig.debug, ...userConfig == null ? void 0 : userConfig.debug },
      performance: { ...defaultConfig.performance, ...userConfig == null ? void 0 : userConfig.performance }
    };
  }
  // Public API Methods
  getState() {
    return this.state.get();
  }
  getDebugInfo() {
    return [...this.debugHistory];
  }
  getMetrics() {
    return { ...this.metrics };
  }
  clearDebugHistory() {
    this.debugHistory = [];
  }
  clearPersistedState() {
    var _a;
    if ((_a = this.config.persistence) == null ? void 0 : _a.enabled) {
      const { key = "app-state", storage = "localStorage" } = this.config.persistence;
      if (storage === "localStorage") {
        localStorage.removeItem(key);
      } else if (storage === "sessionStorage") {
        sessionStorage.removeItem(key);
      }
    }
  }
  destroy() {
    this.state.destroy();
    this.debugHistory = [];
    this.cleanupManager.cleanupAll();
  }
};
var StateManager = class {
  constructor() {
    this.stores = /* @__PURE__ */ new Map();
    this.cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: true
    });
  }
  createStore(name, config) {
    if (this.stores.has(name)) {
      throw new Error(`State store '${name}' already exists`);
    }
    const store = new StateStore(config);
    this.stores.set(name, store);
    this.cleanupManager.register(() => {
      store.destroy();
      this.stores.delete(name);
    }, {
      id: `state-store-${name}`,
      description: `State store cleanup for ${name}`,
      priority: 3
    });
    return store;
  }
  getStore(name) {
    return this.stores.get(name);
  }
  removeStore(name) {
    const store = this.stores.get(name);
    if (store) {
      store.destroy();
      this.stores.delete(name);
      return true;
    }
    return false;
  }
  getAllStores() {
    return new Map(this.stores);
  }
  getStoreNames() {
    return Array.from(this.stores.keys());
  }
  // Utility method to create common store configurations
  static createStoreConfig(initialState, options) {
    return {
      initialState,
      ...options
    };
  }
  destroy() {
    for (const store of this.stores.values()) {
      store.destroy();
    }
    this.stores.clear();
    this.cleanupManager.cleanupAll();
  }
};
var stateManager = new StateManager();
var createStore = (name, config) => stateManager.createStore(name, config);

// src/ts/core/state-persistence.ts
var StateCompressor = class {
  static async compress(data) {
    if ("CompressionStream" in window) {
      const stream = new CompressionStream("gzip");
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      writer.write(new TextEncoder().encode(data));
      writer.close();
      const chunks = [];
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }
      const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        compressed.set(chunk, offset);
        offset += chunk.length;
      }
      return btoa(String.fromCharCode(...compressed));
    }
    return this.simpleCompress(data);
  }
  static async decompress(compressedData) {
    if ("DecompressionStream" in window) {
      try {
        const compressed = Uint8Array.from(atob(compressedData), (c) => c.charCodeAt(0));
        const stream = new DecompressionStream("gzip");
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        writer.write(compressed);
        writer.close();
        const chunks = [];
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) chunks.push(value);
        }
        const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
          decompressed.set(chunk, offset);
          offset += chunk.length;
        }
        return new TextDecoder().decode(decompressed);
      } catch (error) {
        console.warn("Failed to decompress with gzip, trying fallback:", error);
      }
    }
    return this.simpleDecompress(compressedData);
  }
  static simpleCompress(data) {
    const dict = {
      "true": "1",
      "false": "0",
      "null": "n",
      "undefined": "u",
      '"': "'",
      "{": "{",
      "}": "}",
      "[": "[",
      "]": "]",
      ",": ",",
      ":": ":"
    };
    let compressed = data;
    for (const [key, value] of Object.entries(dict)) {
      compressed = compressed.split(key).join(value);
    }
    return compressed;
  }
  static simpleDecompress(compressedData) {
    const dict = {
      "1": "true",
      "0": "false",
      "n": "null",
      "u": "undefined"
    };
    let decompressed = compressedData;
    for (const [key, value] of Object.entries(dict)) {
      decompressed = decompressed.split(key).join(value);
    }
    return decompressed;
  }
};
var StateEncryptor = class {
  static async generateKey(password) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("state-manager-salt"),
        iterations: 1e5,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }
  static async encrypt(data, password) {
    if (!password) return data;
    try {
      const key = await this.generateKey(password);
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(data)
      );
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error("Encryption failed:", error);
      return data;
    }
  }
  static async decrypt(encryptedData, password) {
    if (!password) return encryptedData;
    try {
      const key = await this.generateKey(password);
      const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encrypted
      );
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Decryption failed:", error);
      return encryptedData;
    }
  }
};
var LocalStorageAdapter = class {
  async get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  async set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  async remove(key) {
    localStorage.removeItem(key);
  }
  async clear() {
    localStorage.clear();
  }
  async getQuota() {
    var _a;
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        used += ((_a = localStorage.getItem(key)) == null ? void 0 : _a.length) || 0;
      }
    }
    const estimated = 5 * 1024 * 1024;
    return { used, available: estimated - used };
  }
  async listKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }
};
var SessionStorageAdapter = class {
  async get(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  async set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  async remove(key) {
    sessionStorage.removeItem(key);
  }
  async clear() {
    sessionStorage.clear();
  }
  async getQuota() {
    var _a;
    let used = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        used += ((_a = sessionStorage.getItem(key)) == null ? void 0 : _a.length) || 0;
      }
    }
    const estimated = 5 * 1024 * 1024;
    return { used, available: estimated - used };
  }
  async listKeys() {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }
};
var IndexedDBAdapter = class {
  constructor(dbName = "StateDB", storeName = "state-store") {
    this.db = null;
    this.dbName = dbName;
    this.storeName = storeName;
  }
  async initDB() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }
  async get(key) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        var _a;
        return resolve(((_a = request.result) == null ? void 0 : _a.value) || null);
      };
    });
  }
  async set(key, value) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ key, value });
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
  async remove(key) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
  async clear() {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
  async getQuota() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0)
      };
    }
    return { used: 0, available: 50 * 1024 * 1024 };
  }
  async listKeys() {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
};
var MemoryAdapter = class {
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  async get(key) {
    return this.store.get(key) || null;
  }
  async set(key, value) {
    this.store.set(key, value);
  }
  async remove(key) {
    this.store.delete(key);
  }
  async clear() {
    this.store.clear();
  }
  async getQuota() {
    let used = 0;
    for (const [key, value] of this.store) {
      used += key.length + JSON.stringify(value).length;
    }
    return { used, available: Number.MAX_SAFE_INTEGER };
  }
  async listKeys() {
    return Array.from(this.store.keys());
  }
};
var StateMigration = class {
  static async migrate(data, config) {
    const { migration } = config;
    if (!migration) {
      return { success: true, fromVersion: config.version, toVersion: config.version, dataMigrated: false };
    }
    try {
      const dataVersion = data._version || 1;
      if (dataVersion === migration.currentVersion) {
        return { success: true, fromVersion: dataVersion, toVersion: migration.currentVersion, dataMigrated: false };
      }
      if (dataVersion > migration.currentVersion) {
        console.warn(`Data version (${dataVersion}) is newer than expected (${migration.currentVersion})`);
        return { success: true, fromVersion: dataVersion, toVersion: dataVersion, dataMigrated: false };
      }
      const errors = [];
      let migratedData = { ...data };
      for (let version = dataVersion; version < migration.currentVersion; version++) {
        try {
          migratedData = migration.migrate(migratedData, version, version + 1);
          migratedData._version = version + 1;
        } catch (error) {
          const errorMsg = `Migration from v${version} to v${version + 1} failed: ${error}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      return {
        success: errors.length === 0,
        fromVersion: dataVersion,
        toVersion: migration.currentVersion,
        dataMigrated: errors.length === 0,
        errors: errors.length > 0 ? errors : void 0
      };
    } catch (error) {
      return {
        success: false,
        fromVersion: data._version || 1,
        toVersion: migration.currentVersion,
        dataMigrated: false,
        errors: [`Migration failed: ${error}`]
      };
    }
  }
};
var StateBackup = class {
  static async createBackup(data, config, backupId) {
    var _a, _b;
    const id = backupId || this.generateBackupId();
    const timestamp = Date.now();
    const backupData = {
      id,
      timestamp,
      version: config.version,
      data,
      metadata: {
        compressed: config.compression || false,
        encrypted: ((_a = config.encryption) == null ? void 0 : _a.enabled) || false,
        size: JSON.stringify(data).length
      }
    };
    const backupKey = this.BACKUP_KEY_PREFIX + id;
    const adapter = this.getStorageAdapter(config.backend);
    await adapter.set(backupKey, backupData);
    const backupInfo = {
      id,
      timestamp,
      version: config.version,
      size: backupData.metadata.size,
      compressed: backupData.metadata.compressed,
      encrypted: backupData.metadata.encrypted
    };
    if ((_b = config.backup) == null ? void 0 : _b.maxBackups) {
      await this.cleanupOldBackups(config.backend, config.backup.maxBackups);
    }
    return backupInfo;
  }
  static async restoreBackup(backupId, backend) {
    const backupKey = this.BACKUP_KEY_PREFIX + backupId;
    const adapter = this.getStorageAdapter(backend);
    const backupData = await adapter.get(backupKey);
    if (!backupData) {
      throw new Error(`Backup '${backupId}' not found`);
    }
    return backupData.data;
  }
  static async listBackups(backend) {
    const adapter = this.getStorageAdapter(backend);
    const keys = await adapter.listKeys();
    const backupKeys = keys.filter((key) => key.startsWith(this.BACKUP_KEY_PREFIX));
    const backups = [];
    for (const key of backupKeys) {
      const backupData = await adapter.get(key);
      if (backupData) {
        backups.push({
          id: backupData.id,
          timestamp: backupData.timestamp,
          version: backupData.version,
          size: backupData.metadata.size,
          compressed: backupData.metadata.compressed,
          encrypted: backupData.metadata.encrypted
        });
      }
    }
    return backups.sort((a, b) => b.timestamp - a.timestamp);
  }
  static async deleteBackup(backupId, backend) {
    const backupKey = this.BACKUP_KEY_PREFIX + backupId;
    const adapter = this.getStorageAdapter(backend);
    await adapter.remove(backupKey);
  }
  static generateBackupId() {
    return `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  static async cleanupOldBackups(backend, maxBackups) {
    const backups = await this.listBackups(backend);
    if (backups.length <= maxBackups) return;
    const backupsToDelete = backups.slice(maxBackups);
    const adapter = this.getStorageAdapter(backend);
    for (const backup of backupsToDelete) {
      await this.deleteBackup(backup.id, backend);
    }
  }
  static getStorageAdapter(backend) {
    switch (backend) {
      case "localStorage":
        return new LocalStorageAdapter();
      case "sessionStorage":
        return new SessionStorageAdapter();
      case "indexedDB":
        return new IndexedDBAdapter();
      case "memory":
        return new MemoryAdapter();
      default:
        return new LocalStorageAdapter();
    }
  }
};
StateBackup.BACKUP_KEY_PREFIX = "state-backup-";
var StatePersistenceManager = class {
  constructor(config) {
    this.config = config;
    this.adapter = this.getStorageAdapter(config.backend);
  }
  async save(data) {
    var _a, _b, _c;
    try {
      let processedData = {
        _version: this.config.version,
        _timestamp: Date.now(),
        data
      };
      const migrationResult = await StateMigration.migrate(processedData, this.config);
      if (!migrationResult.success && migrationResult.errors) {
        console.error("State migration failed:", migrationResult.errors);
        throw new Error("State migration failed");
      }
      processedData = migrationResult.dataMigrated ? processedData : data;
      let serialized = JSON.stringify(processedData);
      if (this.config.compression) {
        serialized = await StateCompressor.compress(serialized);
      }
      if ((_a = this.config.encryption) == null ? void 0 : _a.enabled) {
        serialized = await StateEncryptor.encrypt(serialized, this.config.encryption.key);
      }
      await this.adapter.set(this.config.key, {
        compressed: this.config.compression || false,
        encrypted: ((_b = this.config.encryption) == null ? void 0 : _b.enabled) || false,
        data: serialized
      });
      if ((_c = this.config.backup) == null ? void 0 : _c.enabled) {
        await this.createPeriodicBackup(processedData);
      }
    } catch (error) {
      console.error("Failed to save state:", error);
      throw error;
    }
  }
  async load() {
    var _a;
    try {
      const stored = await this.adapter.get(this.config.key);
      if (!stored) return null;
      let data = stored.data;
      if (stored.encrypted && ((_a = this.config.encryption) == null ? void 0 : _a.enabled)) {
        data = await StateEncryptor.decrypt(data, this.config.encryption.key);
      }
      if (stored.compressed && this.config.compression) {
        data = await StateCompressor.decompress(data);
      }
      const parsedData = JSON.parse(data);
      const migrationResult = await StateMigration.migrate(parsedData, this.config);
      if (!migrationResult.success && migrationResult.errors) {
        console.error("State migration failed during load:", migrationResult.errors);
      }
      return migrationResult.dataMigrated ? parsedData.data : parsedData.data || parsedData;
    } catch (error) {
      console.error("Failed to load state:", error);
      return null;
    }
  }
  async remove() {
    await this.adapter.remove(this.config.key);
  }
  async clear() {
    await this.adapter.clear();
  }
  async getQuota() {
    const quota = await this.adapter.getQuota();
    const percentage = quota.available > 0 ? quota.used / (quota.used + quota.available) * 100 : 100;
    return { ...quota, percentage };
  }
  async createBackup(backupId) {
    const data = await this.load();
    if (!data) {
      throw new Error("No data available to backup");
    }
    return StateBackup.createBackup(data, this.config, backupId);
  }
  async restoreBackup(backupId) {
    const data = await StateBackup.restoreBackup(backupId, this.config.backend);
    await this.save(data);
  }
  async listBackups() {
    return StateBackup.listBackups(this.config.backend);
  }
  async deleteBackup(backupId) {
    await StateBackup.deleteBackup(backupId, this.config.backend);
  }
  async createPeriodicBackup(data) {
    var _a;
    const lastBackupKey = `${this.config.key}-last-backup`;
    const lastBackupTime = await this.adapter.get(lastBackupKey);
    const now = Date.now();
    const interval = (((_a = this.config.backup) == null ? void 0 : _a.interval) || 60) * 60 * 1e3;
    if (!lastBackupTime || now - lastBackupTime > interval) {
      await StateBackup.createBackup(data, this.config);
      await this.adapter.set(lastBackupKey, now);
    }
  }
  getStorageAdapter(backend) {
    switch (backend) {
      case "localStorage":
        return new LocalStorageAdapter();
      case "sessionStorage":
        return new SessionStorageAdapter();
      case "indexedDB":
        return new IndexedDBAdapter();
      case "memory":
        return new MemoryAdapter();
      default:
        return new LocalStorageAdapter();
    }
  }
};

// src/ts/core/state-debug-tools.ts
var StateInspector = class {
  constructor(store, config) {
    this.container = null;
    this.isVisible = false;
    this.store = store;
    this.config = config;
    this.createInspector();
  }
  createInspector() {
    if (!this.config.visualInspector) return;
    this.container = document.createElement("div");
    this.container.id = "state-inspector";
    this.container.innerHTML = `
      <div class="state-inspector-header">
        <h3>\u{1F5C4}\uFE0F State Inspector</h3>
        <div class="inspector-controls">
          <button id="inspector-toggle" title="Toggle Inspector">\u{1F441}\uFE0F</button>
          <button id="inspector-minimize" title="Minimize">\u2796</button>
          <button id="inspector-close" title="Close">\u2716\uFE0F</button>
        </div>
      </div>
      <div class="state-inspector-content">
        <div class="inspector-tabs">
          <button class="tab active" data-tab="state">State</button>
          <button class="tab" data-tab="actions">Actions</button>
          <button class="tab" data-tab="performance">Performance</button>
          <button class="tab" data-tab="tools">Tools</button>
        </div>
        <div class="inspector-panels">
          <div class="panel active" id="state-panel">
            <div class="state-view"></div>
          </div>
          <div class="panel" id="actions-panel">
            <div class="actions-timeline"></div>
          </div>
          <div class="panel" id="performance-panel">
            <div class="performance-metrics"></div>
          </div>
          <div class="panel" id="tools-panel">
            <div class="debug-tools"></div>
          </div>
        </div>
      </div>
    `;
    this.addStyles();
    this.setupEventListeners();
    document.body.appendChild(this.container);
    this.hide();
  }
  addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #state-inspector {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 400px;
        max-height: 600px;
        background: #1e1e1e;
        border: 1px solid #444;
        border-radius: 8px;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 12px;
        color: #fff;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
      }

      #state-inspector.minimized {
        height: 40px;
        overflow: hidden;
      }

      #state-inspector.hidden {
        display: none;
      }

      .state-inspector-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background: #2d2d2d;
        border-bottom: 1px solid #444;
        cursor: move;
      }

      .state-inspector-header h3 {
        margin: 0;
        font-size: 14px;
        color: #4fc3f7;
      }

      .inspector-controls {
        display: flex;
        gap: 5px;
      }

      .inspector-controls button {
        background: none;
        border: none;
        color: #ccc;
        cursor: pointer;
        padding: 5px;
        border-radius: 3px;
        transition: background 0.2s;
      }

      .inspector-controls button:hover {
        background: #444;
      }

      .state-inspector-content {
        max-height: 560px;
        overflow-y: auto;
      }

      .inspector-tabs {
        display: flex;
        background: #2d2d2d;
        border-bottom: 1px solid #444;
      }

      .inspector-tabs .tab {
        flex: 1;
        padding: 10px;
        background: none;
        border: none;
        color: #ccc;
        cursor: pointer;
        transition: all 0.2s;
      }

      .inspector-tabs .tab:hover,
      .inspector-tabs .tab.active {
        background: #3d3d3d;
        color: #4fc3f7;
      }

      .inspector-panels {
        padding: 15px;
      }

      .panel {
        display: none;
      }

      .panel.active {
        display: block;
      }

      .state-view {
        background: #1a1a1a;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
      }

      .state-json {
        color: #ccc;
        white-space: pre-wrap;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 11px;
      }

      .actions-timeline {
        max-height: 400px;
        overflow-y: auto;
      }

      .action-item {
        background: #2a2a2a;
        margin-bottom: 8px;
        padding: 10px;
        border-radius: 4px;
        border-left: 3px solid #4fc3f7;
      }

      .action-item.error {
        border-left-color: #f44336;
      }

      .action-type {
        color: #4fc3f7;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .action-payload {
        color: #ccc;
        font-size: 11px;
        margin-bottom: 5px;
      }

      .action-timestamp {
        color: #888;
        font-size: 10px;
      }

      .performance-metrics {
        display: grid;
        gap: 15px;
      }

      .metric-card {
        background: #2a2a2a;
        padding: 15px;
        border-radius: 4px;
        border-left: 3px solid #4fc3f7;
      }

      .metric-label {
        color: #888;
        font-size: 10px;
        text-transform: uppercase;
        margin-bottom: 5px;
      }

      .metric-value {
        color: #4fc3f7;
        font-size: 18px;
        font-weight: bold;
      }

      .debug-tools {
        display: grid;
        gap: 10px;
      }

      .tool-button {
        background: #2a2a2a;
        border: 1px solid #444;
        color: #ccc;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
      }

      .tool-button:hover {
        background: #3a3a3a;
        border-color: #4fc3f7;
      }

      .tool-button .tool-name {
        color: #4fc3f7;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .tool-button .tool-description {
        color: #888;
        font-size: 10px;
      }
    `;
    document.head.appendChild(style);
  }
  setupEventListeners() {
    if (!this.container) return;
    this.container.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });
    const toggleBtn = this.container.querySelector("#inspector-toggle");
    const minimizeBtn = this.container.querySelector("#inspector-minimize");
    const closeBtn = this.container.querySelector("#inspector-close");
    toggleBtn == null ? void 0 : toggleBtn.addEventListener("click", () => this.toggle());
    minimizeBtn == null ? void 0 : minimizeBtn.addEventListener("click", () => this.toggleMinimize());
    closeBtn == null ? void 0 : closeBtn.addEventListener("click", () => this.hide());
    const header = this.container.querySelector(".state-inspector-header");
    this.makeDraggable(header, this.container);
    this.store.subscribe(() => this.updateStateView());
  }
  switchTab(tabName) {
    if (!this.container) return;
    this.container.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
      if (tab.dataset.tab === tabName) {
        tab.classList.add("active");
      }
    });
    this.container.querySelectorAll(".panel").forEach((panel) => {
      panel.classList.remove("active");
    });
    const activePanel = this.container.querySelector(`#${tabName}-panel`);
    activePanel == null ? void 0 : activePanel.classList.add("active");
    switch (tabName) {
      case "state":
        this.updateStateView();
        break;
      case "actions":
        this.updateActionsView();
        break;
      case "performance":
        this.updatePerformanceView();
        break;
      case "tools":
        this.updateToolsView();
        break;
    }
  }
  updateStateView() {
    if (!this.container) return;
    const stateView = this.container.querySelector(".state-view");
    const state = this.store.getState();
    stateView.innerHTML = `
      <div class="state-json">${JSON.stringify(state, null, 2)}</div>
    `;
  }
  updateActionsView() {
    if (!this.container) return;
    const actionsTimeline = this.container.querySelector(".actions-timeline");
    const debugInfo = this.store.getDebugInfo();
    actionsTimeline.innerHTML = debugInfo.map((info) => `
      <div class="action-item ${info.stackTrace ? "error" : ""}">
        <div class="action-type">${info.action.type}</div>
        <div class="action-payload">${JSON.stringify(info.action.payload)}</div>
        <div class="action-timestamp">
          ${new Date(info.timestamp).toLocaleTimeString()} (${info.duration.toFixed(2)}ms)
        </div>
      </div>
    `).reverse().join("");
  }
  updatePerformanceView() {
    if (!this.container) return;
    const performanceMetrics = this.container.querySelector(".performance-metrics");
    const metrics = this.store.getMetrics();
    const debugInfo = this.store.getDebugInfo();
    const slowestActions = debugInfo.filter((info) => info.duration > 5).sort((a, b) => b.duration - a.duration).slice(0, 5);
    performanceMetrics.innerHTML = `
      <div class="metric-card">
        <div class="metric-label">Total Actions</div>
        <div class="metric-value">${metrics.totalActions}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Average Action Time</div>
        <div class="metric-value">${metrics.averageActionTime.toFixed(2)}ms</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Memory Usage</div>
        <div class="metric-value">${(metrics.memoryUsage / 1024).toFixed(1)}KB</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Active Subscribers</div>
        <div class="metric-value">${metrics.totalSubscribers}</div>
      </div>
      ${slowestActions.length > 0 ? `
        <div class="metric-card">
          <div class="metric-label">Slowest Actions</div>
          ${slowestActions.map((action) => `
            <div style="margin-bottom: 5px; font-size: 11px;">
              ${action.action.type}: ${action.duration.toFixed(2)}ms
            </div>
          `).join("")}
        </div>
      ` : ""}
    `;
  }
  updateToolsView() {
    if (!this.container) return;
    const debugTools = this.container.querySelector(".debug-tools");
    debugTools.innerHTML = `
      <button class="tool-button" id="export-state">
        <div class="tool-name">\u{1F4E4} Export State</div>
        <div class="tool-description">Export current state to JSON</div>
      </button>
      <button class="tool-button" id="import-state">
        <div class="tool-name">\u{1F4E5} Import State</div>
        <div class="tool-description">Import state from JSON</div>
      </button>
      <button class="tool-button" id="create-backup">
        <div class="tool-name">\u{1F4BE} Create Backup</div>
        <div class="tool-description">Create state backup</div>
      </button>
      <button class="tool-button" id="clear-debug">
        <div class="tool-name">\u{1F9F9} Clear Debug History</div>
        <div class="tool-description">Clear debugging history</div>
      </button>
      <button class="tool-button" id="reset-state">
        <div class="tool-name">\u{1F504} Reset State</div>
        <div class="tool-description">Reset to initial state</div>
      </button>
    `;
    this.setupToolListeners();
  }
  setupToolListeners() {
    if (!this.container) return;
    const exportBtn = this.container.querySelector("#export-state");
    const importBtn = this.container.querySelector("#import-state");
    const backupBtn = this.container.querySelector("#create-backup");
    const clearBtn = this.container.querySelector("#clear-debug");
    const resetBtn = this.container.querySelector("#reset-state");
    exportBtn == null ? void 0 : exportBtn.addEventListener("click", () => this.exportState());
    importBtn == null ? void 0 : importBtn.addEventListener("click", () => this.importState());
    backupBtn == null ? void 0 : backupBtn.addEventListener("click", () => this.createBackup());
    clearBtn == null ? void 0 : clearBtn.addEventListener("click", () => this.clearDebugHistory());
    resetBtn == null ? void 0 : resetBtn.addEventListener("click", () => this.resetState());
  }
  makeDraggable(dragHandle, element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    dragHandle.addEventListener("mousedown", (e) => {
      isDragging = true;
      initialX = e.clientX - element.offsetLeft;
      initialY = e.clientY - element.offsetTop;
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      element.style.left = `${currentX}px`;
      element.style.top = `${currentY}px`;
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }
  exportState() {
    const state = this.store.getState();
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `state-export-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
  importState() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      var _a;
      const file = (_a = e.target.files) == null ? void 0 : _a[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e2) => {
        var _a2;
        try {
          const state = JSON.parse((_a2 = e2.target) == null ? void 0 : _a2.result);
          this.store.reset(state);
          alert("State imported successfully!");
        } catch (error) {
          alert("Failed to import state: Invalid JSON");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
  async createBackup() {
    try {
      const state = this.store.getState();
      const backupData = {
        timestamp: Date.now(),
        state,
        debugInfo: this.store.getDebugInfo(),
        metrics: this.store.getMetrics()
      };
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `state-backup-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      alert("Backup created successfully!");
    } catch (error) {
      alert("Failed to create backup");
    }
  }
  clearDebugHistory() {
    this.store.clearDebugHistory();
    this.updateActionsView();
    alert("Debug history cleared!");
  }
  resetState() {
    if (confirm("Are you sure you want to reset the state? This cannot be undone.")) {
      this.store.reset();
      alert("State reset successfully!");
    }
  }
  show() {
    if (this.container) {
      this.container.classList.remove("hidden");
      this.isVisible = true;
    }
  }
  hide() {
    if (this.container) {
      this.container.classList.add("hidden");
      this.isVisible = false;
    }
  }
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  toggleMinimize() {
    if (this.container) {
      this.container.classList.toggle("minimized");
    }
  }
  destroy() {
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
  }
};
var ActionTimeline = class {
  constructor(maxSnapshots = 100) {
    this.snapshots = [];
    this.errors = [];
    this.maxSnapshots = maxSnapshots;
  }
  recordSnapshot(action, state, metrics, performance2) {
    const snapshot = {
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(state)),
      // Deep clone
      action: { ...action },
      metrics: { ...metrics },
      performance: { ...performance2 }
    };
    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots = this.snapshots.slice(-this.maxSnapshots);
    }
  }
  recordError(action, error) {
    this.errors.push({
      action: { ...action },
      error: { ...error },
      timestamp: Date.now(),
      stackTrace: error.stack || ""
    });
  }
  getTimeline() {
    return {
      actions: this.snapshots.map((s) => s.action).filter(Boolean),
      snapshots: [...this.snapshots],
      errors: [...this.errors]
    };
  }
  getSnapshotsInRange(startTime, endTime) {
    return this.snapshots.filter((s) => s.timestamp >= startTime && s.timestamp <= endTime);
  }
  clear() {
    this.snapshots = [];
    this.errors = [];
  }
  export() {
    return JSON.stringify(this.getTimeline(), null, 2);
  }
  import(data) {
    try {
      const timeline = JSON.parse(data);
      this.snapshots = timeline.snapshots || [];
      this.errors = timeline.errors || [];
    } catch (error) {
      throw new Error("Invalid timeline data format");
    }
  }
};
var StatePerformanceMonitor = class {
  constructor() {
    this.actionTimes = [];
    this.memorySnapshots = [];
    this.errorCount = 0;
  }
  recordAction(action, duration) {
    this.actionTimes.push({ action, duration, timestamp: Date.now() });
    if (this.actionTimes.length > 1e3) {
      this.actionTimes = this.actionTimes.slice(-1e3);
    }
  }
  recordMemoryUsage() {
    if ("memory" in performance) {
      const memory = performance.memory;
      this.memorySnapshots.push({
        timestamp: Date.now(),
        usage: memory.usedJSHeapSize
      });
      if (this.memorySnapshots.length > 100) {
        this.memorySnapshots = this.memorySnapshots.slice(-100);
      }
    }
  }
  recordError() {
    this.errorCount++;
  }
  generateReport() {
    const totalActions = this.actionTimes.length;
    const averageActionTime = totalActions > 0 ? this.actionTimes.reduce((sum, a) => sum + a.duration, 0) / totalActions : 0;
    const slowestActions = [...this.actionTimes].sort((a, b) => b.duration - a.duration).slice(0, 10).map(({ action, duration, timestamp }) => ({ action, duration, timestamp }));
    return {
      totalActions,
      averageActionTime,
      slowestActions,
      memoryTrend: this.memorySnapshots,
      errors: this.errorCount
    };
  }
  clear() {
    this.actionTimes = [];
    this.memorySnapshots = [];
    this.errorCount = 0;
  }
};
var StateDebugManager = class {
  constructor(store, config) {
    this.config = config;
    this.inspector = new StateInspector(store, config);
    this.timeline = new ActionTimeline(config.maxHistorySize || 100);
    this.performanceMonitor = new StatePerformanceMonitor();
    this.setupStoreMonitoring(store);
    this.setupGlobalAccess();
  }
  setupStoreMonitoring(store) {
    if (!this.config.enabled) return;
    store.subscribe((state, previousState) => {
      if (this.config.performanceMonitoring) {
        this.performanceMonitor.recordMemoryUsage();
      }
      if (this.config.actionTimeline && previousState) {
        const metrics = store.getMetrics();
        const debugInfo = store.getDebugInfo();
        const lastAction = debugInfo[debugInfo.length - 1];
        if (lastAction) {
          this.timeline.recordSnapshot(
            lastAction.action,
            state,
            metrics,
            {
              actionTime: lastAction.duration,
              renderTime: 0,
              // Could be measured with requestAnimationFrame
              memoryUsage: metrics.memoryUsage
            }
          );
          if (this.config.performanceMonitoring) {
            this.performanceMonitor.recordAction(lastAction.action.type, lastAction.duration);
          }
        }
      }
    });
    this.setupErrorMonitoring(store);
  }
  setupErrorMonitoring(store) {
    if (!this.config.errorTracking) return;
    const originalDispatch = store.dispatch.bind(store);
    store.dispatch = (...args) => {
      try {
        return originalDispatch(...args);
      } catch (error) {
        const action = args[0];
        this.timeline.recordError(action, error);
        this.performanceMonitor.recordError();
        if (this.config.logLevel !== "none") {
          console.error("State action error:", error);
        }
        throw error;
      }
    };
  }
  setupGlobalAccess() {
    if (true) {
      window.__STATE_DEBUG__ = {
        inspector: this.inspector,
        timeline: this.timeline,
        performanceMonitor: this.performanceMonitor,
        generateReport: () => this.performanceMonitor.generateReport(),
        exportTimeline: () => this.timeline.export(),
        clearHistory: () => this.clearAll()
      };
      console.group("\u{1F5C4}\uFE0F State Debug Tools Initialized");
      console.log("Access via window.__STATE_DEBUG__");
      console.log("Available methods:");
      console.log("  - inspector: Visual state inspector");
      console.log("  - timeline: Action timeline viewer");
      console.log("  - performanceMonitor: Performance metrics");
      console.log("  - generateReport(): Generate performance report");
      console.log("  - exportTimeline(): Export action timeline");
      console.log("  - clearHistory(): Clear all debug data");
      console.groupEnd();
    }
  }
  clearAll() {
    this.timeline.clear();
    this.performanceMonitor.clear();
  }
  destroy() {
    this.inspector.destroy();
    this.clearAll();
  }
};

// src/ts/core/app-state.ts
var getInitialState = () => ({
  theme: {
    mode: "system",
    systemPreference: "light",
    isTransitioning: false
  },
  navigation: {
    isMobileMenuOpen: false,
    isMobile: false,
    activeSection: "",
    scrollPosition: 0
  },
  ui: {
    isLoading: false,
    notifications: [],
    modals: [],
    sidebar: {
      isOpen: false,
      activeTab: "main"
    }
  },
  user: {
    preferences: {
      language: "en",
      timezone: "UTC",
      dateFormat: "YYYY-MM-DD",
      animationsEnabled: true,
      reducedMotion: false
    },
    session: {
      startTime: Date.now(),
      pageViews: 1,
      timeOnPage: 0,
      lastActivity: Date.now()
    }
  },
  app: {
    version: "1.0.0",
    buildNumber: process.env.BUILD_NUMBER || "dev",
    environment: "development",
    isFirstVisit: !localStorage.getItem("app-visited"),
    hasSeenOnboarding: false,
    lastVisit: 0
  }
});
var themeReducers = {
  SET_THEME: (state, action) => {
    const newMode = action.payload;
    return {
      ...state,
      mode: newMode,
      isTransitioning: true
    };
  },
  SET_SYSTEM_THEME: (state, action) => {
    return {
      ...state,
      systemPreference: action.payload
    };
  },
  THEME_TRANSITION_END: (state) => {
    return {
      ...state,
      isTransitioning: false
    };
  }
};
var navigationReducers = {
  TOGGLE_MOBILE_MENU: (state) => {
    return {
      ...state,
      isMobileMenuOpen: !state.isMobileMenuOpen
    };
  },
  SET_MOBILE_MENU_OPEN: (state, action) => {
    return {
      ...state,
      isMobileMenuOpen: action.payload
    };
  },
  SET_MOBILE: (state, action) => {
    return {
      ...state,
      isMobile: action.payload
    };
  },
  SET_ACTIVE_SECTION: (state, action) => {
    return {
      ...state,
      activeSection: action.payload
    };
  },
  SET_SCROLL_POSITION: (state, action) => {
    return {
      ...state,
      scrollPosition: action.payload
    };
  }
};
var uiReducers = {
  SET_LOADING: (state, action) => {
    return {
      ...state,
      isLoading: action.payload
    };
  },
  ADD_NOTIFICATION: (state, action) => {
    const notification = action.payload;
    return {
      ...state,
      notifications: [...state.notifications, notification]
    };
  },
  REMOVE_NOTIFICATION: (state, action) => {
    const id = action.payload;
    return {
      ...state,
      notifications: state.notifications.filter((n) => n.id !== id)
    };
  },
  CLEAR_NOTIFICATIONS: (state) => {
    return {
      ...state,
      notifications: []
    };
  },
  OPEN_MODAL: (state, action) => {
    const { id, title, content } = action.payload;
    const existingModalIndex = state.modals.findIndex((m) => m.id === id);
    if (existingModalIndex !== -1) {
      const updatedModals = [...state.modals];
      updatedModals[existingModalIndex] = { id, isOpen: true, title, content };
      return {
        ...state,
        modals: updatedModals
      };
    }
    return {
      ...state,
      modals: [...state.modals, { id, isOpen: true, title, content }]
    };
  },
  CLOSE_MODAL: (state, action) => {
    const id = action.payload;
    return {
      ...state,
      modals: state.modals.map(
        (modal) => modal.id === id ? { ...modal, isOpen: false } : modal
      )
    };
  },
  TOGGLE_SIDEBAR: (state) => {
    return {
      ...state,
      sidebar: {
        ...state.sidebar,
        isOpen: !state.sidebar.isOpen
      }
    };
  },
  SET_SIDEBAR_TAB: (state, action) => {
    return {
      ...state,
      sidebar: {
        ...state.sidebar,
        activeTab: action.payload
      }
    };
  }
};
var userReducers = {
  UPDATE_PREFERENCES: (state, action) => {
    return {
      ...state,
      preferences: {
        ...state.preferences,
        ...action.payload
      }
    };
  },
  UPDATE_SESSION: (state, action) => {
    return {
      ...state,
      session: {
        ...state.session,
        ...action.payload,
        lastActivity: Date.now()
      }
    };
  },
  INCREMENT_PAGE_VIEWS: (state) => {
    return {
      ...state,
      session: {
        ...state.session,
        pageViews: state.session.pageViews + 1,
        lastActivity: Date.now()
      }
    };
  }
};
var appReducers = {
  SET_ONBOARDING_COMPLETE: (state) => {
    return {
      ...state,
      hasSeenOnboarding: true
    };
  },
  UPDATE_LAST_VISIT: (state) => {
    return {
      ...state,
      lastVisit: Date.now()
    };
  },
  MARK_VISITED: (state) => {
    return {
      ...state,
      isFirstVisit: false
    };
  }
};
var AppStateManager = class {
  constructor(config) {
    var _a;
    const persistenceConfig = {
      backend: "localStorage",
      key: "app-state",
      version: 1,
      compression: true,
      encryption: {
        enabled: false
      },
      migration: {
        currentVersion: 1,
        migrate: (data, fromVersion, toVersion) => {
          return data;
        }
      },
      backup: {
        enabled: true,
        interval: 30,
        // minutes
        maxBackups: 5
      },
      cleanup: {
        enabled: true,
        maxAge: 7,
        // days
        maxQuota: 80
        // percentage
      },
      ...config == null ? void 0 : config.persistence
    };
    const debugConfig = {
      enabled: true,
      visualInspector: true,
      actionTimeline: true,
      performanceMonitoring: true,
      errorTracking: true,
      stateDiff: true,
      exportImport: true,
      maxHistorySize: 100,
      logLevel: "info",
      ...config == null ? void 0 : config.debug
    };
    const allReducers = {
      ...themeReducers,
      ...navigationReducers,
      ...uiReducers,
      ...userReducers,
      ...appReducers
    };
    this.store = createStore("app", {
      initialState: getInitialState(),
      reducers: allReducers,
      config: {
        persistence: {
          enabled: !!(config == null ? void 0 : config.persistence),
          ...persistenceConfig
        },
        debug: debugConfig
      }
    });
    if (config == null ? void 0 : config.persistence) {
      this.persistenceManager = new StatePersistenceManager(persistenceConfig);
      this.setupPersistence();
    }
    if ((_a = config == null ? void 0 : config.debug) == null ? void 0 : _a.enabled) {
      this.debugManager = new StateDebugManager(this.store, debugConfig);
    }
    this.initializeSessionTracking();
    console.log("\u{1F5C4}\uFE0F App State Manager initialized");
  }
  setupPersistence() {
    if (!this.persistenceManager) return;
    this.store.subscribe(async (state) => {
      try {
        await this.persistenceManager.save(state);
      } catch (error) {
        console.error("Failed to persist state:", error);
      }
    });
    this.loadPersistedState();
  }
  async loadPersistedState() {
    if (!this.persistenceManager) return;
    try {
      const persistedState = await this.persistenceManager.load();
      if (persistedState) {
        this.store.reset(persistedState);
        console.log("\u{1F5C4}\uFE0F Persisted state loaded");
      }
    } catch (error) {
      console.error("Failed to load persisted state:", error);
    }
  }
  initializeSessionTracking() {
    const updateActivity = () => {
      this.dispatch("UPDATE_SESSION", {
        timeOnPage: Date.now() - this.getState().user.session.startTime
      });
    };
    setInterval(updateActivity, 3e4);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateActivity();
      } else {
        this.dispatch("INCREMENT_PAGE_VIEWS");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (this.getState().app.isFirstVisit) {
      this.dispatch("MARK_VISITED");
      localStorage.setItem("app-visited", "true");
    }
  }
  // Public API
  dispatch(action, payload, meta) {
    if (typeof action === "string") {
      this.store.dispatch({
        type: action,
        payload,
        meta: meta || {},
        timestamp: Date.now()
      });
    } else {
      this.store.dispatch({
        ...action,
        timestamp: action.timestamp || Date.now()
      });
    }
  }
  getState() {
    return this.store.getState();
  }
  subscribe(listener) {
    return this.store.subscribe(listener);
  }
  select(selector) {
    return this.store.select(selector);
  }
  // Convenience methods for common actions
  setTheme(mode) {
    this.dispatch("SET_THEME", mode);
  }
  toggleMobileMenu() {
    this.dispatch("TOGGLE_MOBILE_MENU");
  }
  setMobileMenuOpen(open) {
    this.dispatch("SET_MOBILE_MENU_OPEN", open);
  }
  addNotification(type, message, autoHide) {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
      autoHide
    };
    this.dispatch("ADD_NOTIFICATION", notification);
    if (autoHide) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, autoHide);
    }
  }
  removeNotification(id) {
    this.dispatch("REMOVE_NOTIFICATION", id);
  }
  setLoading(loading) {
    this.dispatch("SET_LOADING", loading);
  }
  openModal(id, title, content) {
    this.dispatch("OPEN_MODAL", { id, title, content });
  }
  closeModal(id) {
    this.dispatch("CLOSE_MODAL", id);
  }
  updateUserPreferences(preferences) {
    this.dispatch("UPDATE_PREFERENCES", preferences);
  }
  // Get specific state slices
  getThemeState() {
    return this.getState().theme;
  }
  getNavigationState() {
    return this.getState().navigation;
  }
  getUIState() {
    return this.getState().ui;
  }
  getUserState() {
    return this.getState().user;
  }
  getAppState() {
    return this.getState().app;
  }
  // Debug and development methods
  getDebugInfo() {
    return this.store.getDebugInfo();
  }
  getMetrics() {
    return this.store.getMetrics();
  }
  exportState() {
    return JSON.stringify(this.getState(), null, 2);
  }
  importState(stateJson) {
    try {
      const state = JSON.parse(stateJson);
      this.store.reset(state);
      console.log("\u{1F5C4}\uFE0F State imported successfully");
    } catch (error) {
      console.error("Failed to import state:", error);
      throw error;
    }
  }
  async createBackup() {
    if (!this.persistenceManager) {
      throw new Error("Persistence not configured");
    }
    const backupInfo = await this.persistenceManager.createBackup();
    return backupInfo.id;
  }
  async restoreBackup(backupId) {
    if (!this.persistenceManager) {
      throw new Error("Persistence not configured");
    }
    await this.persistenceManager.restoreBackup(backupId);
  }
  destroy() {
    var _a;
    (_a = this.debugManager) == null ? void 0 : _a.destroy();
    this.store.destroy();
  }
};
var appStateManager = new AppStateManager({
  persistence: {
    enabled: true,
    backend: "localStorage",
    compression: true
  },
  debug: {
    enabled: true,
    visualInspector: true,
    actionTimeline: true
  }
});

// src/ts/modules/theme.ts
var STORAGE_KEY = "theme";
var THEME_ATTRIBUTE = "data-theme";
var THEME_TRANSITION_DURATION = 300;
var getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};
var getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["light", "dark", "system"].includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn("Failed to read theme from localStorage:", error);
  }
  return "system";
};
var getCurrentTheme = () => {
  const stored = getStoredTheme();
  if (stored === "system") {
    return getSystemTheme();
  }
  return stored;
};
var applyTheme = (theme) => {
  const actualTheme = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.setAttribute(THEME_ATTRIBUTE, actualTheme);
  updateToggleButton(actualTheme);
  document.documentElement.classList.add("theme-transitioning");
  setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
    if (typeof window !== "undefined" && window.__APP_STATE_MANAGER__) {
      window.__APP_STATE_MANAGER__.dispatch("THEME_TRANSITION_END");
    }
  }, THEME_TRANSITION_DURATION);
  console.log(`\u{1F3A8} Theme applied: ${actualTheme} (stored: ${theme})`);
};
var storeTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
};
var toggleTheme = () => {
  const current = getCurrentTheme();
  const next = current === "light" ? "dark" : "light";
  if (typeof window !== "undefined" && window.__APP_STATE_MANAGER__) {
    window.__APP_STATE_MANAGER__.setTheme(next);
  } else {
    const stored = getStoredTheme();
    storeTheme(stored === "system" ? next : "system");
    applyTheme(stored === "system" ? next : "system");
  }
};
var updateToggleButton = (actualTheme) => {
  const toggle = qsSafe(".theme-toggle");
  if (!toggle) return;
  const isActive = actualTheme === "dark";
  toggle.classList.toggle("active", isActive);
  toggle.setAttribute("aria-pressed", isActive.toString());
  const icon = toggle.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = actualTheme === "dark" ? "\u{1F319}" : "\u2600\uFE0F";
  }
  toggle.setAttribute("title", actualTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
};
var watchSystemTheme = () => {
  if (!window.matchMedia) return;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    const stored = getStoredTheme();
    if (stored === "system") {
      applyTheme("system");
    }
  };
  if (mediaQuery.addEventListener) {
    const cleanup = () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
    registerCleanup(cleanup, {
      description: "System theme watcher",
      priority: 2
      // High priority - system watchers should be cleaned up early
    });
    mediaQuery.addEventListener("change", handleChange);
  } else {
    const cleanup = () => {
      mediaQuery.removeListener(handleChange);
    };
    registerCleanup(cleanup, {
      description: "System theme watcher (legacy)",
      priority: 2
    });
    mediaQuery.addListener(handleChange);
  }
  console.log("\u{1F440} System theme watcher initialized");
};
var createThemeToggleButton = () => {
  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.setAttribute("type", "button");
  button.setAttribute("aria-label", "Toggle dark mode");
  button.setAttribute("title", "Toggle dark mode");
  button.innerHTML = '<span class="theme-icon">\u{1F319}</span>';
  return button;
};
var setupThemeToggleButton = () => {
  const existingButton = qsSafe(".theme-toggle");
  if (existingButton) {
    updateToggleButton(getCurrentTheme());
    return;
  }
  const header = qsSafe(".site-header, header, .site-nav");
  if (!header) {
    console.warn("\u26A0\uFE0F Could not find suitable location for theme toggle button");
    return;
  }
  const button = createThemeToggleButton();
  header.appendChild(button);
  const cleanup = addEventListener(button, "click", (e) => {
    e.preventDefault();
    toggleTheme();
  });
  button._cleanup = cleanup;
  updateToggleButton(getCurrentTheme());
  console.log("\u{1F3A8} Theme toggle button created and added to header");
};
var initTheme = (defaultTheme) => {
  const theme = defaultTheme || getStoredTheme();
  applyTheme(theme);
  watchSystemTheme();
  setupThemeToggleButton();
  console.log(`\u{1F3A8} Theme functionality initialized with mode: ${theme}`);
};

// src/ts/services/config.service.ts
var DEFAULT_SELECTORS = {
  siteConfig: "#site-config",
  searchInput: "#search-input",
  preCode: "pre code",
  shareLinks: ".share-links",
  comments: ".comments"
};
var DEFAULT_FEATURES = {
  searchEnabled: false,
  tocEnabled: false,
  copyCodeEnabled: false,
  shareButtonsEnabled: false,
  analyticsEnabled: false,
  commentsEnabled: false,
  notificationsEnabled: false,
  themeCustomizationEnabled: false,
  keyboardShortcutsEnabled: false
};
var DEFAULT_CONFIG = {
  isPost: false,
  isHomePage: false,
  title: "",
  description: "",
  author: "",
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
    titleTemplate: "",
    description: "",
    image: "",
    keywords: []
  }
};
var getCurrentEnvironment = () => {
  if (typeof process !== "undefined" && "development") {
    return "development";
  }
  const jekyllEnv = window.jekyllEnvironment;
  if (jekyllEnv) {
    return jekyllEnv === "production" ? "production" : "development";
  }
  return "development";
};
var getBaseUrl = () => {
  const baseElement = document.querySelector("base");
  if (baseElement == null ? void 0 : baseElement.getAttribute("href")) {
    return baseElement.getAttribute("href");
  }
  const siteConfigScript = document.querySelector(DEFAULT_SELECTORS.siteConfig);
  if (siteConfigScript == null ? void 0 : siteConfigScript.textContent) {
    try {
      const config = JSON.parse(siteConfigScript.textContent);
      if (config.baseUrl) {
        return config.baseUrl;
      }
    } catch {
    }
  }
  return window.location.origin;
};
var detectFeatures = (selectors) => ({
  searchEnabled: !!document.querySelector(selectors.searchInput),
  tocEnabled: document.body.classList.contains("post"),
  copyCodeEnabled: !!document.querySelector(selectors.preCode),
  shareButtonsEnabled: !!document.querySelector(selectors.shareLinks),
  analyticsEnabled: getCurrentEnvironment() === "production",
  commentsEnabled: !!document.querySelector(selectors.comments),
  notificationsEnabled: false,
  // Could be detected later
  themeCustomizationEnabled: false,
  // Could be detected later
  keyboardShortcutsEnabled: false
  // Could be detected later
});
var extractFromScript = (selectors) => {
  const script = document.querySelector(selectors.siteConfig);
  if (!(script == null ? void 0 : script.textContent)) {
    return null;
  }
  try {
    return JSON.parse(script.textContent);
  } catch (error) {
    console.warn("Failed to parse site config from script:", error);
    return null;
  }
};
var createFromDOM = (selectors) => {
  return {
    ...DEFAULT_CONFIG,
    theme: "system",
    environment: getCurrentEnvironment(),
    isPost: document.body.classList.contains("post"),
    isHomePage: document.body.classList.contains("home"),
    language: document.documentElement.lang || "en",
    baseUrl: getBaseUrl(),
    features: detectFeatures(selectors)
  };
};
var enrichConfig = (baseConfig, selectors) => {
  var _a, _b;
  return {
    ...DEFAULT_CONFIG,
    theme: baseConfig.theme || "system",
    environment: getCurrentEnvironment(),
    isPost: (_a = baseConfig.isPost) != null ? _a : document.body.classList.contains("post"),
    isHomePage: (_b = baseConfig.isHomePage) != null ? _b : document.body.classList.contains("home"),
    language: baseConfig.language || document.documentElement.lang || "en",
    baseUrl: baseConfig.baseUrl || getBaseUrl(),
    features: {
      ...DEFAULT_FEATURES,
      ...detectFeatures(selectors),
      ...baseConfig.features
    },
    // Include any additional properties from base config
    ...baseConfig
  };
};
var ConfigCache = class {
  constructor(defaultTTL = 5 * 60 * 1e3) {
    this.cache = /* @__PURE__ */ new Map();
    this.defaultTTL = defaultTTL;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.config;
  }
  set(key, config, ttl) {
    this.cache.set(key, {
      config,
      timestamp: Date.now(),
      source: "script",
      // Will be updated by caller
      ttl: ttl != null ? ttl : this.defaultTTL
    });
  }
  clear() {
    this.cache.clear();
  }
  delete(key) {
    return this.cache.delete(key);
  }
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      source: entry.source,
      ttl: entry.ttl
    }));
    return {
      size: this.cache.size,
      entries
    };
  }
};
var createConfigService = (options = {}) => {
  const {
    cacheTTL = 5 * 60 * 1e3,
    // 5 minutes
    debug = true,
    selectors = DEFAULT_SELECTORS
  } = options;
  const cache = new ConfigCache(cacheTTL);
  const cacheKey = "site-config";
  const getSiteConfig = () => {
    const cached = cache.get(cacheKey);
    if (cached) {
      if (debug) {
        console.log("\u{1F4CB} Using cached configuration");
      }
      return cached;
    }
    const scriptConfig = extractFromScript(selectors);
    if (scriptConfig) {
      const config = enrichConfig(scriptConfig, selectors);
      cache.set(cacheKey, config);
      if (debug) {
        console.log("\u{1F4CB} Configuration loaded from script");
      }
      return config;
    }
    const domConfig = createFromDOM(selectors);
    cache.set(cacheKey, domConfig);
    if (debug) {
      console.log("\u{1F4CB} Configuration created from DOM inspection");
    }
    return domConfig;
  };
  const get = (key) => {
    return getSiteConfig()[key];
  };
  const getCurrentTheme2 = () => {
    return get("theme");
  };
  const getEnvironment = () => {
    return get("environment");
  };
  const isProduction = () => {
    return getEnvironment() === "production";
  };
  const isFeatureEnabled = (feature) => {
    return get("features")[feature] || false;
  };
  const getFeatures = () => {
    return get("features");
  };
  const refresh = () => {
    cache.delete(cacheKey);
    return getSiteConfig();
  };
  const resetCache = () => {
    cache.clear();
    if (debug) {
      console.log("\u{1F4CB} Configuration cache cleared");
    }
  };
  const getCacheStats = () => {
    return cache.getStats();
  };
  const createBuilder = () => {
    let config = {};
    return {
      theme(theme) {
        config.theme = theme;
        return this;
      },
      environment(env) {
        config.environment = env;
        return this;
      },
      isPost(isPost) {
        config.isPost = isPost;
        return this;
      },
      isHomePage(isHomePage) {
        config.isHomePage = isHomePage;
        return this;
      },
      language(lang) {
        config.language = lang;
        return this;
      },
      baseUrl(url) {
        config.baseUrl = url;
        return this;
      },
      features(features) {
        config.features = { ...DEFAULT_FEATURES, ...features };
        return this;
      },
      build() {
        return enrichConfig(config, selectors);
      }
    };
  };
  const createOverride = (override) => {
    return enrichConfig(override, selectors);
  };
  return {
    // Core methods
    getSiteConfig,
    get,
    getCurrentTheme: getCurrentTheme2,
    getEnvironment,
    isProduction,
    isFeatureEnabled,
    getFeatures,
    // Cache management
    refresh,
    resetCache,
    getCacheStats,
    // Builders
    createBuilder,
    createOverride,
    // Utilities
    selectors,
    options
  };
};
var configService = createConfigService({
  cacheTTL: 5 * 60 * 1e3,
  // 5 minutes
  debug: true
});
var _ConfigService = class _ConfigService {
  static getInstance() {
    return _ConfigService.service;
  }
  getSiteConfig() {
    return _ConfigService.service.getSiteConfig();
  }
  isProduction() {
    return _ConfigService.service.isProduction();
  }
  isFeatureEnabled(feature) {
    return _ConfigService.service.isFeatureEnabled(feature);
  }
  getCurrentTheme() {
    return _ConfigService.service.getCurrentTheme();
  }
  resetCache() {
    _ConfigService.service.resetCache();
  }
};
_ConfigService.service = createConfigService();
var ConfigService = _ConfigService;

// src/ts/modules/navigation.ts
var MOBILE_BREAKPOINT = 768;
var ANIMATION_DURATION = 300;
var FOCUSABLE_ELEMENTS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
var isMobile = () => {
  return window.innerWidth <= MOBILE_BREAKPOINT || "ontouchstart" in window || navigator.maxTouchPoints > 0;
};
var toggleBodyScrollLock = (lock) => {
  const body = document.body;
  if (lock) {
    body.classList.add("nav-open");
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.top = `-${window.scrollY}px`;
  } else {
    const scrollY = Math.abs(parseInt(body.style.top || "0", 10));
    body.classList.remove("nav-open");
    body.style.overflow = "";
    body.style.position = "";
    body.style.width = "";
    body.style.top = "";
    window.scrollTo(0, scrollY);
  }
};
var closeMobileMenu = () => {
  const toggle = qsSafe(".nav-toggle");
  const menu = qsSafe(".nav-mobile");
  if (!toggle || !menu) return;
  toggle.classList.remove("active");
  toggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("active");
  toggleBodyScrollLock(false);
  if (typeof window !== "undefined" && window.__APP_STATE_MANAGER__) {
    window.__APP_STATE_MANAGER__.setMobileMenuOpen(false);
  }
  setTimeout(() => {
    toggle.focus();
  }, ANIMATION_DURATION);
  console.log("\u{1F4F1} Mobile menu closed");
};
var openMobileMenu = () => {
  const toggle = qsSafe(".nav-toggle");
  const menu = qsSafe(".nav-mobile");
  if (!toggle || !menu) return;
  toggle.classList.add("active");
  toggle.setAttribute("aria-expanded", "true");
  menu.classList.add("active");
  toggleBodyScrollLock(true);
  if (typeof window !== "undefined" && window.__APP_STATE_MANAGER__) {
    window.__APP_STATE_MANAGER__.setMobileMenuOpen(true);
  }
  setTimeout(() => {
    const firstMenuItem = menu.querySelector(FOCUSABLE_ELEMENTS);
    if (firstMenuItem) {
      firstMenuItem.focus();
    }
  }, 100);
  console.log("\u{1F4F1} Mobile menu opened");
};
var toggleMobileMenu = () => {
  if (typeof window !== "undefined" && window.__APP_STATE_MANAGER__) {
    window.__APP_STATE_MANAGER__.toggleMobileMenu();
  } else {
    const toggle = qsSafe(".nav-toggle");
    if (!toggle) return;
    const isOpen = toggle.classList.contains("active");
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
};
var handleOutsideClick = (event) => {
  const menu = qsSafe(".nav-mobile");
  const toggle = qsSafe(".nav-toggle");
  if (!menu || !toggle) return;
  const target = event.target;
  const isClickInsideMenu = menu.contains(target);
  const isClickOnToggle = toggle.contains(target);
  if (!isClickInsideMenu && !isClickOnToggle) {
    closeMobileMenu();
  }
};
var handleEscapeKey = (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
};
var setupMobileToggle = () => {
  const toggle = qsSafe(".nav-toggle");
  if (!toggle) {
    console.warn("\u26A0\uFE0F Mobile navigation toggle button not found");
    return;
  }
  toggle.classList.remove("active");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "mobile-menu");
  toggle.setAttribute("aria-label", "Toggle navigation menu");
  const cleanup = addEventListener(toggle, "click", (e) => {
    e.preventDefault();
    toggleMobileMenu();
  });
  toggle._cleanup = cleanup;
  console.log("\u{1F4F1} Mobile navigation toggle setup complete");
};
var setupClickOutsideToClose = () => {
  const cleanup = addEventListener(document, "click", handleOutsideClick);
  document._clickOutsideCleanup = cleanup;
  console.log("\u{1F4F1} Click outside to close functionality setup");
};
var setupKeyboardNavigation = () => {
  const menu = qsSafe(".nav-mobile");
  if (!menu) return;
  const keydownHandler = (e) => {
    if (e.key === "Tab") {
      const focusableElements = Array.from(menu.querySelectorAll(FOCUSABLE_ELEMENTS));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === firstElement && firstElement) {
          e.preventDefault();
          lastElement == null ? void 0 : lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement && lastElement) {
          e.preventDefault();
          firstElement == null ? void 0 : firstElement.focus();
        }
      }
    }
  };
  const cleanup = addEventListener(menu, "keydown", keydownHandler);
  menu._keyboardCleanup = cleanup;
  console.log("\u{1F4F1} Keyboard navigation setup complete");
};
var setupEscapeKeyHandler = () => {
  const cleanup = addEventListener(document, "keydown", handleEscapeKey);
  document._escapeCleanup = cleanup;
  console.log("\u{1F4F1} Escape key handler setup complete");
};
var setupResponsiveBehavior = () => {
  let isCurrentlyMobile = isMobile();
  const handleResize = () => {
    const isNowMobile = isMobile();
    if (!isCurrentlyMobile && isNowMobile) {
      const menu = qsSafe(".nav-mobile");
      if (menu && menu.classList.contains("active")) {
        closeMobileMenu();
      }
    }
    if (isCurrentlyMobile && !isNowMobile) {
      closeMobileMenu();
    }
    isCurrentlyMobile = isNowMobile;
  };
  let resizeTimeout;
  const debouncedResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 150);
  };
  const cleanup = addEventListener(window, "resize", debouncedResize);
  window._resizeCleanup = cleanup;
  console.log("\u{1F4F1} Responsive behavior setup complete");
};
var createMobileToggle = () => {
  const button = document.createElement("button");
  button.className = "nav-toggle";
  button.setAttribute("type", "button");
  button.setAttribute("aria-label", "Toggle navigation menu");
  button.setAttribute("aria-controls", "mobile-menu");
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = `
    <span class="hamburger">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </span>
  `;
  return button;
};
var setupMobileMenu = () => {
  const existingMenu = qsSafe(".nav-mobile");
  if (existingMenu) {
    console.log("\u{1F4F1} Mobile menu already exists");
    return;
  }
  const menu = document.createElement("nav");
  menu.className = "nav-mobile";
  menu.setAttribute("id", "mobile-menu");
  menu.setAttribute("role", "navigation");
  menu.setAttribute("aria-label", "Mobile navigation");
  const desktopNav = qsSafe(".site-nav, .nav-links");
  if (desktopNav) {
    const navLinks = desktopNav.cloneNode(true);
    menu.appendChild(navLinks);
  }
  const header = qsSafe(".site-header, header");
  if (header) {
    header.appendChild(menu);
  }
  console.log("\u{1F4F1} Mobile navigation menu created");
};
var initNavigation = () => {
  if (!isMobile()) {
    console.log("\u{1F4F1} Desktop device detected - mobile navigation not initialized");
    return;
  }
  setupMobileMenu();
  let toggle = qsSafe(".nav-toggle");
  if (!toggle) {
    toggle = createMobileToggle();
    const header = qsSafe(".site-header, header");
    if (header) {
      header.appendChild(toggle);
    }
  }
  setupMobileToggle();
  setupClickOutsideToClose();
  setupKeyboardNavigation();
  setupEscapeKeyHandler();
  setupResponsiveBehavior();
  const menu = qsSafe(".nav-mobile");
  if (menu) {
    menu.style.display = "block";
  }
  console.log("\u{1F4F1} Mobile navigation initialized successfully");
};

// src/ts/modules/copy-code.ts
var COPY_BUTTON_CLASS = "copy-button";
var COPY_SUCCESS_CLASS = "copied";
var COPY_ERROR_CLASS = "copy-error";
var COPY_TIMEOUT = 2e3;
var copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error("Failed to copy text:", error);
    return false;
  }
};
var showCopySuccess = (button) => {
  const originalText = button.textContent || "Copy";
  const originalClasses = button.className;
  button.textContent = "Copied!";
  button.classList.add(COPY_SUCCESS_CLASS);
  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClasses;
  }, COPY_TIMEOUT);
};
var showCopyError = (button) => {
  const originalText = button.textContent || "Copy";
  const originalClasses = button.className;
  button.textContent = "Failed!";
  button.classList.add(COPY_ERROR_CLASS);
  setTimeout(() => {
    button.textContent = originalText;
    button.className = originalClasses;
  }, COPY_TIMEOUT);
};
var handleCopyClick = async (button, codeBlock) => {
  const code = codeBlock.textContent || "";
  if (!code.trim()) {
    console.warn("No code to copy");
    return;
  }
  button.disabled = true;
  button.style.opacity = "0.6";
  button.style.cursor = "wait";
  try {
    const success = await copyToClipboard(code);
    if (success) {
      showCopySuccess(button);
    } else {
      showCopyError(button);
    }
  } catch (error) {
    console.error("Copy failed:", error);
    showCopyError(button);
  } finally {
    button.disabled = false;
    button.style.opacity = "";
    button.style.cursor = "";
  }
};
var createCopyButton = () => {
  const button = create("button", {
    class: COPY_BUTTON_CLASS,
    type: "button",
    "aria-label": "Copy code to clipboard",
    title: "Copy code",
    "data-clipboard-text": ""
  }, "Copy");
  return button;
};
var setupCopyButton = (codeBlock) => {
  const parent = codeBlock.parentElement;
  if (!parent || parent.classList.contains("has-copy-button")) {
    return;
  }
  const preElement = parent.tagName === "PRE" ? parent : codeBlock.closest("pre");
  if (!preElement) {
    return;
  }
  preElement.classList.add("has-copy-button");
  const button = createCopyButton();
  preElement.style.position = "relative";
  preElement.appendChild(button);
  const cleanup = addEventListener(button, "click", async (e) => {
    e.preventDefault();
    await handleCopyClick(button, codeBlock);
  });
  button._cleanup = cleanup;
  const keyboardHandler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "c") {
      const activeElement = document.activeElement;
      if (activeElement === codeBlock || codeBlock.contains(activeElement)) {
        e.preventDefault();
        handleCopyClick(button, codeBlock);
      }
    }
  };
  const keydownCleanup = addEventListener(codeBlock, "keydown", keyboardHandler);
  codeBlock._keycleanup = keydownCleanup;
};
var initCopyCode = () => {
  const codeBlocks = Array.from(qsa("pre code, highlight > code, .highlight > pre > code"));
  if (codeBlocks.length === 0) {
    console.log("\u{1F4DD} No code blocks found for copy functionality");
    return;
  }
  codeBlocks.forEach((codeBlock) => {
    setupCopyButton(codeBlock);
  });
  console.log(`\u{1F4CB} Copy buttons initialized for ${codeBlocks.length} code blocks`);
};

// src/ts/modules/toc.ts
var TOC_CONTAINER_SELECTOR = "#toc-container";
var TOC_ID_PREFIX = "toc-";
var ACTIVE_CLASS = "toc-active";
var HEADING_SELECTORS = "h2, h3, h4, h5, h6";
var SCROLL_OFFSET = 80;
var THROTTLE_DELAY = 100;
var generateTOC = (headings) => {
  const toc = [];
  const stack = [];
  headings.forEach((heading, index) => {
    var _a, _b, _c, _d;
    const id = `${TOC_ID_PREFIX}${index}`;
    heading.id = id;
    const item = {
      id,
      text: ((_a = heading.textContent) == null ? void 0 : _a.trim()) || `Heading ${index + 1}`,
      level: parseInt(heading.tagName.charAt(1)),
      children: []
    };
    while (stack.length > 0 && ((_c = (_b = stack[stack.length - 1]) == null ? void 0 : _b.level) != null ? _c : 0) >= item.level) {
      stack.pop();
    }
    if (stack.length === 0) {
      toc.push(item);
    } else {
      (_d = stack[stack.length - 1]) == null ? void 0 : _d.children.push(item);
    }
    stack.push(item);
  });
  return toc;
};
var renderTOC = (container, toc) => {
  if (toc.length === 0) {
    container.innerHTML = '<p class="toc-empty">No headings found</p>';
    return;
  }
  const tocElement = create("nav", { class: "toc" });
  const listElement = create("ol", { class: "toc-list" });
  const titleElement = create("h2", { class: "toc-title" }, "Table of Contents");
  tocElement.appendChild(titleElement);
  renderTOCItems(listElement, toc, 0);
  tocElement.appendChild(listElement);
  container.innerHTML = "";
  container.appendChild(tocElement);
};
var renderTOCItems = (parentElement, items, depth) => {
  items.forEach((item) => {
    const listItem = create("li", { class: "toc-item" });
    const link = create("a", {
      href: `#${item.id}`,
      class: "toc-link",
      "data-level": item.level.toString()
    }, item.text);
    addEventListener(link, "click", (e) => {
      e.preventDefault();
      const targetElement = document.getElementById(item.id);
      if (targetElement) {
        scrollToElement(targetElement, SCROLL_OFFSET);
        updateActiveTOC(item.id);
      }
    });
    listItem.appendChild(link);
    if (item.children.length > 0) {
      const childList = create("ol", { class: `toc-list toc-list-${depth + 1}` });
      renderTOCItems(childList, item.children, depth + 1);
      listItem.appendChild(childList);
    }
    parentElement.appendChild(listItem);
  });
};
var updateActiveTOC = (activeId) => {
  var _a;
  const activeElements = document.querySelectorAll(`.${ACTIVE_CLASS}`);
  activeElements.forEach((el) => el.classList.remove(ACTIVE_CLASS));
  const activeLink = document.querySelector(`a[href="#${activeId}"]`);
  if (activeLink) {
    activeLink.classList.add(ACTIVE_CLASS);
  }
  let currentLink = activeLink;
  while (currentLink) {
    const parentItem = currentLink.closest(".toc-item");
    if (parentItem) {
      const parentLink = parentItem.querySelector(".toc-link");
      if (parentLink) {
        parentLink.classList.add(ACTIVE_CLASS);
      }
    }
    currentLink = (_a = parentItem == null ? void 0 : parentItem.parentElement) == null ? void 0 : _a.closest(".toc-item");
  }
};
var isElementInViewport = (element, offset = 0) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowHeight && rect.bottom >= 0 && rect.left >= 0 && rect.right <= (window.innerWidth || document.documentElement.clientWidth) && rect.top <= offset;
};
var getCurrentActiveHeading = () => {
  const headings = qsa(HEADING_SELECTORS);
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i];
    if (heading && isElementInViewport(heading, SCROLL_OFFSET)) {
      return heading.id;
    }
  }
  return null;
};
var setupScrollSpy = () => {
  const scrollHandler = throttle(() => {
    const activeId = getCurrentActiveHeading();
    if (activeId) {
      updateActiveTOC(activeId);
    }
  }, THROTTLE_DELAY);
  const cleanup = addEventListener(window, "scroll", scrollHandler);
  window._scrollSpyCleanup = cleanup;
  setTimeout(() => {
    const activeId = getCurrentActiveHeading();
    if (activeId) {
      updateActiveTOC(activeId);
    }
  }, 100);
  console.log("\u{1F4D1} Scroll spy functionality setup");
};
var setupContentObserver = () => {
  const targetNode = document.querySelector(".post-content, .page-content");
  if (!targetNode) return;
  const observer = new MutationObserver(() => {
    setTimeout(() => {
      const headings = Array.from(qsa(HEADING_SELECTORS));
      if (headings.length === 0) return;
      const toc = generateTOC(headings);
      const container = document.querySelector(TOC_CONTAINER_SELECTOR);
      if (container) {
        renderTOC(container, toc);
        setupScrollSpy();
      }
    }, 100);
  });
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
  console.log("\u{1F4D1} Content observer setup");
};
var getOrCreateTOCContainer = () => {
  var _a;
  let container = document.querySelector(TOC_CONTAINER_SELECTOR);
  if (container) return container;
  const postContent = document.querySelector(".post-content");
  const pageContent = document.querySelector(".page-content");
  const targetContent = postContent || pageContent;
  if (!targetContent) {
    console.warn("\u26A0\uFE0F Could not find suitable location for TOC");
    return null;
  }
  container = create("div", {
    id: TOC_CONTAINER_SELECTOR.replace("#", ""),
    class: "toc-container"
  });
  const firstParagraph = targetContent.querySelector("p");
  if (firstParagraph) {
    (_a = firstParagraph.parentNode) == null ? void 0 : _a.insertBefore(container, firstParagraph.nextSibling);
  } else {
    targetContent.insertBefore(container, targetContent.firstChild);
  }
  return container;
};
var initTOC = () => {
  console.log("\u{1F4D1} Initializing Table of Contents...");
  const container = getOrCreateTOCContainer();
  if (!container) {
    console.log("\u{1F4D1} No suitable location found for TOC");
    return;
  }
  const headings = Array.from(qsa(HEADING_SELECTORS));
  if (headings.length === 0) {
    console.log("\u{1F4D1} No headings found - TOC not created");
    container.innerHTML = '<p class="toc-empty">No headings found on this page</p>';
    return;
  }
  const toc = generateTOC(headings);
  renderTOC(container, toc);
  setupScrollSpy();
  setupContentObserver();
  console.log(`\u{1F4D1} Table of Contents initialized with ${headings.length} headings`);
};

// src/ts/core/service-factory.ts
var ServiceFactoryScope = class _ServiceFactoryScope {
  constructor(config = {}, parent) {
    this.services = /* @__PURE__ */ new Map();
    this.children = /* @__PURE__ */ new Set();
    var _a, _b;
    this.debug = (_a = config.debug) != null ? _a : false;
    this.autoDispose = (_b = config.autoDispose) != null ? _b : true;
    this.parent = parent || null;
    if (parent) {
      parent.children.add(this);
    }
  }
  /**
   * Register a service factory
   */
  register(name, factory, singleton = true) {
    if (this.services.has(name)) {
      this.unregister(name);
    }
    this.services.set(name, {
      factory,
      singleton,
      created: Date.now()
    });
    if (this.debug) {
      console.log(`\u{1F3ED} Service registered: ${name} (${singleton ? "singleton" : "transient"})`);
    }
  }
  /**
   * Register a service instance
   */
  registerInstance(name, instance) {
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
      console.log(`\u{1F3ED} Service instance registered: ${name}`);
    }
  }
  /**
   * Get a service instance
   */
  get(name) {
    const registration = this.services.get(name);
    if (!registration) {
      if (this.parent) {
        return this.parent.get(name);
      }
      throw new Error(`Service not found: ${name}`);
    }
    if (registration.singleton && registration.instance) {
      return registration.instance;
    }
    const instance = registration.factory();
    if (registration.singleton) {
      registration.instance = instance;
    }
    if (this.autoDispose && this.isDisposable(instance)) {
      this.registerDisposable(instance);
    }
    if (this.debug) {
      const type = registration.singleton ? "singleton" : "transient";
      console.log(`\u{1F3ED} Service created: ${name} (${type})`);
    }
    return instance;
  }
  /**
   * Check if a service is registered
   */
  has(name) {
    var _a, _b;
    return this.services.has(name) || ((_b = (_a = this.parent) == null ? void 0 : _a.has(name)) != null ? _b : false);
  }
  /**
   * Unregister a service
   */
  unregister(name) {
    const registration = this.services.get(name);
    if (!registration) {
      return false;
    }
    if (registration.instance && this.isDisposable(registration.instance)) {
      try {
        registration.instance.dispose();
      } catch (error) {
        console.error(`Error disposing service ${name}:`, error);
      }
    }
    this.services.delete(name);
    if (this.debug) {
      console.log(`\u{1F3ED} Service unregistered: ${name}`);
    }
    return true;
  }
  /**
   * Create a child scope
   */
  createScope(config = {}) {
    return new _ServiceFactoryScope(config, this);
  }
  /**
   * Get service statistics
   */
  getStats() {
    const servicesList = Array.from(this.services.entries()).map(([name, registration]) => ({
      name,
      type: registration.singleton ? "singleton" : "transient",
      hasInstance: !!registration.instance,
      created: registration.created
    }));
    return {
      scope: this.parent ? "child" : "root",
      services: this.services.size,
      singletons: servicesList.filter((s) => s.type === "singleton").length,
      transient: servicesList.filter((s) => s.type === "transient").length,
      children: this.children.size,
      servicesList
    };
  }
  /**
   * Clear all services
   */
  clear() {
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
      console.log("\u{1F3ED} All services cleared");
    }
  }
  /**
   * Destroy scope and cleanup
   */
  destroy() {
    if (this.parent) {
      this.parent.children.delete(this);
    }
    for (const child of this.children) {
      child.destroy();
    }
    this.clear();
    if (this.debug) {
      console.log("\u{1F3ED} Service factory scope destroyed");
    }
  }
  /**
   * Check if object is disposable
   */
  isDisposable(obj) {
    return obj && typeof obj === "object" && typeof obj.dispose === "function";
  }
  /**
   * Register disposable for automatic cleanup
   */
  registerDisposable(_instance) {
    if (this.debug) {
      console.log("\u{1F3ED} Disposable service tracked for cleanup");
    }
  }
};
var serviceFactory = new ServiceFactoryScope({
  debug: true,
  autoDispose: true
});
var registerService = (name, factory, singleton = true) => {
  serviceFactory.register(name, factory, singleton);
};
var getService = (name) => {
  return serviceFactory.get(name);
};

// src/ts/core/plugin-system.ts
var PluginContextImpl = class {
  constructor(config, utils, events, storageImpl) {
    this.config = config;
    this.utils = utils;
    this.events = events;
    this.storageImpl = storageImpl;
    this.eventListeners = /* @__PURE__ */ new Map();
    this.internalStorage = /* @__PURE__ */ new Map();
  }
  // Make storage public to match interface
  get storage() {
    return this.storageImpl;
  }
  // Event handling
  on(event, handler) {
    this.events.on(event, handler);
    this.trackListener(event, handler);
  }
  off(event, handler) {
    this.events.off(event, handler);
    this.untrackListener(event, handler);
  }
  emit(event, data) {
    this.events.emit(event, data);
  }
  // Storage operations
  get(key) {
    var _a;
    return (_a = this.internalStorage.get(key)) != null ? _a : this.storageImpl.get(key);
  }
  set(key, value) {
    this.internalStorage.set(key, value);
    this.storageImpl.set(key, value);
  }
  remove(key) {
    this.internalStorage.delete(key);
    this.storageImpl.remove(key);
  }
  clear() {
    this.internalStorage.clear();
    this.storageImpl.clear();
  }
  // Internal listener tracking
  trackListener(event, handler) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, /* @__PURE__ */ new Set());
    }
    this.eventListeners.get(event).add(handler);
  }
  untrackListener(event, handler) {
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
  cleanup() {
    for (const [event, listeners] of this.eventListeners) {
      for (const listener of listeners) {
        this.events.off(event, listener);
      }
    }
    this.eventListeners.clear();
    this.clear();
  }
};
var PluginStorageImpl = class {
  constructor() {
    this.data = /* @__PURE__ */ new Map();
  }
  get(key) {
    return this.data.get(key);
  }
  set(key, value) {
    this.data.set(key, value);
  }
  remove(key) {
    this.data.delete(key);
  }
  clear() {
    this.data.clear();
  }
  has(key) {
    return this.data.has(key);
  }
  keys() {
    return Array.from(this.data.keys());
  }
  values() {
    return Array.from(this.data.values());
  }
  entries() {
    return Array.from(this.data.entries());
  }
};
var PluginEventEmitterImpl = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
    this.maxListeners = 10;
  }
  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, /* @__PURE__ */ new Set());
    }
    const eventListeners = this.listeners.get(event);
    if (eventListeners.size >= this.maxListeners) {
      console.warn(`PluginEventEmitter: Maximum listeners (${this.maxListeners}) exceeded for event "${event}"`);
    }
    eventListeners.add(handler);
  }
  off(event, handler) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(handler);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }
  emit(event, data) {
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
  removeAllListeners(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
  listenerCount(event) {
    var _a;
    return ((_a = this.listeners.get(event)) == null ? void 0 : _a.size) || 0;
  }
};
var pluginUtils = {
  // Import utilities from existing modules
  dom: null,
  // Will be populated dynamically
  storage: null,
  // Will be populated dynamically
  events: null
  // Will be populated dynamically
};
var PluginSystem = class {
  constructor(config = {}) {
    this.plugins = /* @__PURE__ */ new Map();
    this.loadingPlugins = /* @__PURE__ */ new Set();
    this.config = {
      defaultLoadingStrategy: "lazy",
      hotReload: true,
      sandboxing: false,
      pluginTimeout: 3e4,
      // 30 seconds
      debug: true,
      maxPlugins: 50,
      allowedSources: [],
      ...config
    };
    this.debug = this.config.debug;
    this.eventEmitter = new PluginEventEmitterImpl();
    this.pluginStorage = new PluginStorageImpl();
    if (this.debug) {
      console.log("\u{1F50C} Plugin system initialized with config:", this.config);
    }
  }
  /**
   * Register a plugin
   */
  async register(plugin, options = {}) {
    const metadata = await this.extractMetadata(plugin);
    const pluginName = metadata.name;
    if (this.plugins.has(pluginName)) {
      throw new Error(`Plugin "${pluginName}" is already registered`);
    }
    if (this.plugins.size >= this.config.maxPlugins) {
      throw new Error(`Maximum number of plugins (${this.config.maxPlugins}) reached`);
    }
    if (this.debug) {
      console.log(`\u{1F50C} Registering plugin: ${pluginName} v${metadata.version}`);
    }
    const registration = {
      metadata,
      plugin,
      state: "loaded",
      config: options.config || {},
      registeredAt: /* @__PURE__ */ new Date()
    };
    this.plugins.set(pluginName, registration);
    this.eventEmitter.emit("plugin-registered", { name: pluginName, metadata });
    if (options.strategy === "eager" || !options.strategy && this.config.defaultLoadingStrategy === "eager") {
      await this.load(pluginName, options);
    }
  }
  /**
   * Load a plugin
   */
  async load(name, _options = {}) {
    const registration = this.plugins.get(name);
    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }
    if (registration.state === "active") {
      if (this.debug) {
        console.log(`\u{1F50C} Plugin "${name}" is already active`);
      }
      return;
    }
    if (registration.state === "loading" || this.loadingPlugins.has(name)) {
      throw new Error(`Plugin "${name}" is already loading`);
    }
    this.loadingPlugins.add(name);
    registration.state = "loading";
    try {
      const startTime = Date.now();
      if (registration.metadata.dependencies) {
        await this.checkDependencies(registration.metadata.dependencies);
      }
      const context = this.createContext(registration);
      registration.state = "initializing";
      await this.initializePlugin(registration.plugin, context);
      registration.instance = context;
      registration.state = "active";
      registration.loadTime = Date.now() - startTime;
      registration.lastActive = /* @__PURE__ */ new Date();
      if (this.debug) {
        console.log(`\u{1F50C} Plugin "${name}" loaded successfully in ${registration.loadTime}ms`);
      }
      this.eventEmitter.emit("plugin-loaded", { name, registration });
    } catch (error) {
      registration.state = "error";
      registration.error = error instanceof Error ? error : new Error(String(error));
      console.error(`\u{1F50C} Failed to load plugin "${name}":`, error);
      this.eventEmitter.emit("plugin-error", { name, error });
      throw error;
    } finally {
      this.loadingPlugins.delete(name);
    }
  }
  /**
   * Unload a plugin
   */
  async unload(name) {
    const registration = this.plugins.get(name);
    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }
    if (registration.state !== "active") {
      if (this.debug) {
        console.log(`\u{1F50C} Plugin "${name}" is not active`);
      }
      return;
    }
    if (this.debug) {
      console.log(`\u{1F50C} Unloading plugin: ${name}`);
    }
    registration.state = "deinitializing";
    try {
      if (registration.plugin.destroy && typeof registration.plugin.destroy === "function") {
        await registration.plugin.destroy();
      }
      if (registration.instance && typeof registration.instance.cleanup === "function") {
        registration.instance.cleanup();
      }
      registration.state = "loaded";
      registration.instance = void 0;
      if (this.debug) {
        console.log(`\u{1F50C} Plugin "${name}" unloaded successfully`);
      }
      this.eventEmitter.emit("plugin-unloaded", { name, registration });
    } catch (error) {
      registration.state = "error";
      registration.error = error instanceof Error ? error : new Error(String(error));
      console.error(`\u{1F50C} Failed to unload plugin "${name}":`, error);
      this.eventEmitter.emit("plugin-error", { name, error });
    }
  }
  /**
   * Enable a plugin
   */
  async enable(name) {
    const registration = this.plugins.get(name);
    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }
    if (registration.state === "disabled") {
      registration.state = "loaded";
      await this.load(name);
    }
  }
  /**
   * Disable a plugin
   */
  async disable(name) {
    const registration = this.plugins.get(name);
    if (!registration) {
      throw new Error(`Plugin "${name}" is not registered`);
    }
    if (registration.state === "active") {
      await this.unload(name);
      registration.state = "disabled";
    }
  }
  /**
   * Get plugin registration
   */
  getPlugin(name) {
    return this.plugins.get(name);
  }
  /**
   * Get all plugins
   */
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
  /**
   * Get active plugins
   */
  getActivePlugins() {
    return Array.from(this.plugins.values()).filter((p) => p.state === "active");
  }
  /**
   * Get plugin by state
   */
  getPluginsByState(state) {
    return Array.from(this.plugins.values()).filter((p) => p.state === state);
  }
  /**
   * Check if plugin exists
   */
  hasPlugin(name) {
    return this.plugins.has(name);
  }
  /**
   * Unregister a plugin
   */
  async unregister(name) {
    const registration = this.plugins.get(name);
    if (!registration) {
      return;
    }
    if (registration.state === "active") {
      await this.unload(name);
    }
    this.plugins.delete(name);
    this.eventEmitter.emit("plugin-unregistered", { name });
    if (this.debug) {
      console.log(`\u{1F50C} Plugin "${name}" unregistered`);
    }
  }
  /**
   * Get system statistics
   */
  getStats() {
    const plugins = Array.from(this.plugins.values());
    return {
      total: plugins.length,
      active: plugins.filter((p) => p.state === "active").length,
      loaded: plugins.filter((p) => p.state === "loaded").length,
      error: plugins.filter((p) => p.state === "error").length,
      disabled: plugins.filter((p) => p.state === "disabled").length,
      loading: this.loadingPlugins.size,
      plugins: plugins.map((p) => ({
        name: p.metadata.name,
        version: p.metadata.version,
        state: p.state,
        ...p.loadTime !== void 0 && { loadTime: p.loadTime },
        registeredAt: p.registeredAt
      }))
    };
  }
  /**
   * Get system events
   */
  get events() {
    return this.eventEmitter;
  }
  /**
   * Shutdown plugin system
   */
  async shutdown() {
    if (this.debug) {
      console.log("\u{1F50C} Shutting down plugin system...");
    }
    const activePlugins = this.getActivePlugins();
    for (const plugin of activePlugins) {
      try {
        await this.unload(plugin.metadata.name);
      } catch (error) {
        console.error(`Error unloading plugin "${plugin.metadata.name}" during shutdown:`, error);
      }
    }
    this.plugins.clear();
    this.loadingPlugins.clear();
    this.eventEmitter.removeAllListeners();
    if (this.debug) {
      console.log("\u{1F50C} Plugin system shutdown complete");
    }
  }
  // ============================================================================
  // Private Methods
  // ============================================================================
  /**
   * Extract metadata from plugin
   */
  async extractMetadata(plugin) {
    if (plugin.metadata) {
      return plugin.metadata;
    }
    const constructor = plugin.constructor;
    if (constructor.name && constructor.name !== "Object") {
      return {
        name: constructor.name,
        version: "1.0.0",
        description: `${constructor.name} plugin`,
        author: "Unknown"
      };
    }
    return {
      name: "unknown",
      version: "1.0.0",
      description: "Unknown plugin",
      author: "Unknown"
    };
  }
  /**
   * Check plugin dependencies
   */
  async checkDependencies(dependencies) {
    for (const dep of dependencies) {
      if (!this.plugins.has(dep)) {
        throw new Error(`Dependency "${dep}" is not available`);
      }
      const depPlugin = this.plugins.get(dep);
      if (depPlugin.state !== "active") {
        throw new Error(`Dependency "${dep}" is not active (state: ${depPlugin.state})`);
      }
    }
  }
  /**
   * Create plugin context
   */
  createContext(registration) {
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
  createPluginConfig(_registration) {
    return {
      theme: "system",
      environment: "development",
      isPost: false,
      isHomePage: false,
      language: "en",
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
        titleTemplate: "",
        description: "",
        image: "",
        keywords: []
      }
    };
  }
  /**
   * Initialize plugin
   */
  async initializePlugin(plugin, context) {
    if (plugin.init && typeof plugin.init === "function") {
      await plugin.init(context);
    }
  }
};
var pluginSystem = new PluginSystem({
  defaultLoadingStrategy: "lazy",
  hotReload: true,
  debug: true
});

// src/ts/components/component-registry.ts
var ComponentRegistry = class _ComponentRegistry {
  constructor() {
    this.components = /* @__PURE__ */ new Map();
    this._registryDestroyed = false;
    this.cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: true
    });
    this.cleanupManager.register(() => {
      this.destroyAll();
    }, {
      description: "Component Registry cleanup",
      priority: 1
      // High priority - clean up components early
    });
  }
  /**
   * Get singleton instance of the registry
   */
  static getInstance() {
    if (!_ComponentRegistry.instance) {
      _ComponentRegistry.instance = new _ComponentRegistry();
    }
    return _ComponentRegistry.instance;
  }
  /**
   * Register a component class with the registry
   */
  register(name, componentClass, config) {
    if (this._registryDestroyed) {
      throw new Error("Cannot register components on destroyed registry");
    }
    if (this.components.has(name)) {
      throw new Error(`Component with name '${name}' is already registered`);
    }
    const registration = {
      name,
      componentClass,
      ...config && { config },
      registeredAt: /* @__PURE__ */ new Date()
    };
    this.components.set(name, registration);
    if ((config == null ? void 0 : config.autoInit) && config.element) {
      this.init(name);
    }
    console.log(`\u{1F4CB} Component registered: ${name}`);
  }
  /**
   * Initialize a registered component
   */
  async init(name) {
    var _a;
    if (this._registryDestroyed) {
      throw new Error("Cannot initialize components on destroyed registry");
    }
    const registration = this.components.get(name);
    if (!registration) {
      throw new Error(`Component '${name}' is not registered`);
    }
    if (registration.instance) {
      if (registration.instance.isReady()) {
        console.warn(`\u26A0\uFE0F Component '${name}' is already initialized`);
        return;
      }
      throw new Error(`Component '${name}' has an existing instance in invalid state`);
    }
    if (!((_a = registration.config) == null ? void 0 : _a.element)) {
      throw new Error(`Component '${name}' cannot be initialized without an element`);
    }
    try {
      const config = registration.config;
      const component = new registration.componentClass({
        element: config.element,
        autoCleanup: config.autoCleanup,
        cleanupManager: this.cleanupManager,
        ...Object.fromEntries(
          Object.entries(config).filter(
            ([key]) => !["element", "autoCleanup"].includes(key)
          )
        )
      });
      await component.init();
      registration.instance = component;
      registration.initializedAt = /* @__PURE__ */ new Date();
      console.log(`\u2705 Component initialized: ${name}`);
    } catch (error) {
      console.error(`\u274C Failed to initialize component '${name}':`, error);
      throw error;
    }
  }
  /**
   * Get a component instance by name
   */
  get(name) {
    const registration = this.components.get(name);
    return registration == null ? void 0 : registration.instance;
  }
  /**
   * Get a component registration by name
   */
  getRegistration(name) {
    return this.components.get(name);
  }
  /**
   * Check if a component is registered
   */
  isRegistered(name) {
    return this.components.has(name);
  }
  /**
   * Check if a component is initialized
   */
  isInitialized(name) {
    var _a;
    const registration = this.components.get(name);
    return !!((_a = registration == null ? void 0 : registration.instance) == null ? void 0 : _a.isReady());
  }
  /**
   * Check if a component is destroyed
   */
  isDestroyed(name) {
    var _a;
    const registration = this.components.get(name);
    return !!((_a = registration == null ? void 0 : registration.instance) == null ? void 0 : _a.isComponentDestroyed());
  }
  /**
   * Destroy a component instance
   */
  destroy(name) {
    const registration = this.components.get(name);
    if (!registration) {
      console.warn(`\u26A0\uFE0F Cannot destroy unregistered component: ${name}`);
      return;
    }
    if (registration.instance) {
      registration.instance.destroy();
      registration.destroyedAt = /* @__PURE__ */ new Date();
      console.log(`\u{1F9F9} Component destroyed: ${name}`);
    }
  }
  /**
   * Remove a component from the registry
   */
  remove(name) {
    this.destroy(name);
    this.components.delete(name);
    console.log(`\u{1F5D1}\uFE0F Component removed from registry: ${name}`);
  }
  /**
   * Destroy all registered components
   */
  destroyAll() {
    const names = Array.from(this.components.keys());
    names.forEach((name) => this.destroy(name));
    console.log(`\u{1F9F9} All components destroyed (${names.length} total)`);
  }
  /**
   * Get all registered component names
   */
  getRegisteredNames() {
    return Array.from(this.components.keys());
  }
  /**
   * Get all initialized component names
   */
  getInitializedNames() {
    return Array.from(this.components.entries()).filter(([, registration]) => {
      var _a;
      return (_a = registration.instance) == null ? void 0 : _a.isReady();
    }).map(([name]) => name);
  }
  /**
   * Get all destroyed component names
   */
  getDestroyedNames() {
    return Array.from(this.components.entries()).filter(([, registration]) => {
      var _a;
      return (_a = registration.instance) == null ? void 0 : _a.isComponentDestroyed();
    }).map(([name]) => name);
  }
  /**
   * Get registry statistics
   */
  getStats() {
    const components = Array.from(this.components.values());
    const totalRegistered = components.length;
    const totalInitialized = components.filter((c) => {
      var _a;
      return (_a = c.instance) == null ? void 0 : _a.isReady();
    }).length;
    const totalDestroyed = components.filter((c) => {
      var _a;
      return (_a = c.instance) == null ? void 0 : _a.isComponentDestroyed();
    }).length;
    const registeredDates = components.map((c) => c.registeredAt);
    const oldestRegistration = registeredDates.length > 0 ? new Date(Math.min(...registeredDates.map((d) => d.getTime()))) : void 0;
    const newestRegistration = registeredDates.length > 0 ? new Date(Math.max(...registeredDates.map((d) => d.getTime()))) : void 0;
    const stats = {
      totalRegistered,
      totalInitialized,
      totalDestroyed,
      componentsByStatus: {
        registered: this.getRegisteredNames(),
        initialized: this.getInitializedNames(),
        destroyed: this.getDestroyedNames()
      }
    };
    if (oldestRegistration) {
      stats.oldestRegistration = oldestRegistration;
    }
    if (newestRegistration) {
      stats.newestRegistration = newestRegistration;
    }
    return stats;
  }
  /**
   * Get detailed component information
   */
  getComponentInfo(name) {
    var _a, _b, _c;
    const registration = this.components.get(name);
    if (!registration) {
      return void 0;
    }
    return {
      name: registration.name,
      className: registration.componentClass.name,
      config: registration.config,
      registeredAt: registration.registeredAt,
      initializedAt: registration.initializedAt,
      destroyedAt: registration.destroyedAt,
      isInitialized: !!((_a = registration.instance) == null ? void 0 : _a.isReady()),
      isDestroyed: !!((_b = registration.instance) == null ? void 0 : _b.isComponentDestroyed()),
      stats: (_c = registration.instance) == null ? void 0 : _c.getStats()
    };
  }
  /**
   * Get all component information
   */
  getAllComponentInfo() {
    const info = {};
    for (const name of this.components.keys()) {
      info[name] = this.getComponentInfo(name) || {};
    }
    return info;
  }
  /**
   * Find components by class name
   */
  findByClassName(className) {
    return Array.from(this.components.entries()).filter(([, registration]) => registration.componentClass.name === className).map(([name]) => name);
  }
  /**
   * Find components by element
   */
  findByElement(element) {
    return Array.from(this.components.entries()).filter(([, registration]) => {
      var _a;
      return ((_a = registration.instance) == null ? void 0 : _a.getElement()) === element;
    }).map(([name]) => name);
  }
  /**
   * Destroy the registry itself
   */
  destroyRegistry() {
    this.destroyAll();
    this.components.clear();
    this._registryDestroyed = true;
    console.log("\u{1F480} Component registry destroyed");
  }
  /**
   * Log registry status for debugging
   */
  logStatus() {
    const stats = this.getStats();
    console.group("\u{1F4CA} Component Registry Status");
    console.log("Total Registered:", stats.totalRegistered);
    console.log("Total Initialized:", stats.totalInitialized);
    console.log("Total Destroyed:", stats.totalDestroyed);
    console.log("Registry Age:", this.getRegistryAge());
    console.log("Components:", stats.componentsByStatus);
    console.groupEnd();
  }
  /**
   * Get registry age in milliseconds
   */
  getRegistryAge() {
    const names = this.getRegisteredNames();
    if (names.length === 0) return 0;
    const firstName = names[0];
    if (!firstName) return 0;
    const registration = this.components.get(firstName);
    if (!(registration == null ? void 0 : registration.registeredAt)) return 0;
    return Date.now() - registration.registeredAt.getTime();
  }
};
var componentRegistry = ComponentRegistry.getInstance();

// src/ts/main.ts
var loadExternalCSS = () => {
  const cssFiles = [
    "/assets/css/theme.css",
    "/assets/css/components.css",
    "/assets/css/utilities.css"
  ];
  cssFiles.forEach((cssFile) => {
    const existingLink = document.querySelector(`link[href="${cssFile}"]`);
    if (existingLink) {
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssFile;
    link.media = "screen";
    link.onerror = () => {
      console.warn(`\u26A0\uFE0F Failed to load CSS file: ${cssFile}`);
    };
    link.onload = () => {
      console.log(`\u2705 CSS file loaded: ${cssFile}`);
    };
    document.head.appendChild(link);
  });
  console.log("\u{1F3A8} External CSS files loading initiated");
};
var getAppConfig = () => {
  const configService2 = getService("config");
  const siteConfig = configService2.getSiteConfig();
  return {
    theme: siteConfig.theme,
    searchEnabled: siteConfig.features.searchEnabled,
    tocEnabled: siteConfig.features.tocEnabled,
    copyCodeEnabled: siteConfig.features.copyCodeEnabled,
    shareButtonsEnabled: siteConfig.features.shareButtonsEnabled,
    isPost: siteConfig.isPost,
    isHomePage: siteConfig.isHomePage,
    environment: siteConfig.environment
  };
};
var initializeApp = async () => {
  const config = getAppConfig();
  performanceMonitor.mark("app-init-start");
  try {
    console.log("\u{1F680} Jekyll TypeScript Frontend Starting...");
    console.log("\u{1F4CA} Config:", config);
    loadExternalCSS();
    const cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: true
    });
    console.log("\u{1F9F9} Cleanup manager initialized");
    registerService("config", createConfigService, true);
    registerService("plugins", () => pluginSystem, true);
    registerService("components", () => componentRegistry, true);
    const configService2 = getService("config");
    const siteConfig = configService2.getSiteConfig();
    console.log("\u{1F4CB} Configuration service initialized with factory pattern");
    console.log("\u{1F4CA} Site config:", {
      theme: siteConfig.theme,
      environment: siteConfig.environment,
      features: siteConfig.features,
      isPost: siteConfig.isPost
    });
    console.log("\u{1F5C4}\uFE0F State management system initialized");
    if (typeof window !== "undefined") {
      window.__APP_STATE_MANAGER__ = appStateManager;
    }
    registerService("stateManager", () => appStateManager, true);
    console.log("\u{1F4CA} App state metrics:", appStateManager.getMetrics());
    console.log("\u{1F50C} Plugin system initialized");
    console.log("\u{1F4CA} Plugin system stats:", pluginSystem.getStats());
    console.log("\u{1F4CB} Component registry initialized");
    console.log("\u{1F4CA} Component registry stats:", componentRegistry.getStats());
    initTheme(config.theme);
    initNavigation();
    if (config.copyCodeEnabled) {
      await initCopyCode();
    }
    if (config.tocEnabled && config.isPost) {
      await initTOC();
    }
    if (config.searchEnabled) {
      console.log("\u{1F50D} Search functionality not implemented yet");
    }
    if (config.shareButtonsEnabled && config.isPost) {
      console.log("\u{1F4E4} Share buttons not implemented yet");
    }
    document.body.classList.add("js-enabled");
    document.body.classList.remove("js-loading");
    performanceMonitor.mark("app-init-end");
    const initTime = performanceMonitor.measure("app-init", "app-init-start", "app-init-end");
    performanceMonitor.recordMetric("app-initialization", initTime);
    initPerformanceMonitoring();
    console.log("\u2705 Jekyll TypeScript frontend initialized successfully (Phase 2 complete)");
    console.log(`\u26A1 Initialization time: ${initTime.toFixed(2)}ms`);
    if (true) {
      setTimeout(() => {
        const cleanupStats = cleanupManager.getStats();
        console.log("\u{1F4CA} Cleanup Manager Stats:", cleanupStats);
        const configStats = configService2.getCacheStats();
        console.log("\u{1F4CA} Configuration Service Stats:", configStats);
        const serviceStats = serviceFactory.getStats();
        console.log("\u{1F4CA} Service Factory Stats:", serviceStats);
        const plugins = getService("plugins");
        const pluginStats = plugins.getStats();
        console.log("\u{1F4CA} Plugin System Stats:", pluginStats);
        const components = getService("components");
        const componentStats = components.getStats();
        console.log("\u{1F4CA} Component Registry Stats:", componentStats);
      }, 100);
    }
  } catch (error) {
    console.error("\u274C Failed to initialize app:", error);
    document.body.classList.add("js-fallback");
    document.body.classList.remove("js-loading");
    try {
      initTheme(config.theme);
      initNavigation();
    } catch (fallbackError) {
      console.error("\u274C Even fallback initialization failed:", fallbackError);
    }
  }
};
ready(() => {
  document.body.classList.add("js-loading");
  initializeApp();
});
export {
  getAppConfig,
  initializeApp
};
//# sourceMappingURL=main.js.map
