/**
 * Performance Monitoring System
 *
 * Provides comprehensive performance monitoring for the Jekyll-TypeScript application.
 * Tracks Core Web Vitals, bundle metrics, and custom performance indicators.
 */

// ============================================================================
// Core Web Vitals Types
// ============================================================================

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface PerformanceMetrics {
  bundle: BundleMetrics;
  runtime: RuntimeMetrics;
  vitals: CoreWebVitals;
  custom: Record<string, number>;
}

export interface BundleMetrics {
  size: {
    raw: number; // bytes
    gzipped: number; // bytes
    brotli: number; // bytes
  };
  loadTime: number; // milliseconds
  parseTime: number; // milliseconds
  modules: number; // count of modules
}

export interface RuntimeMetrics {
  initTime: number; // application initialization time
  renderTime: number; // initial render time
  interactiveTime: number; // time to interactive
  memoryUsage: number; // MB
  domNodes: number; // DOM node count
}

// ============================================================================
// Performance Monitor Implementation
// ============================================================================

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private observers: PerformanceObserver[] = [];
  private startTime: number = 0;
  private config: PerformanceMonitorConfig;

  constructor(config: PerformanceMonitorConfig = {}) {
    this.config = {
      enabled: true,
      collectVitals: true,
      collectRuntime: true,
      collectBundle: true,
      reportingEndpoint: null,
      reportInterval: 30000, // 30 seconds
      ...config
    };

    this.metrics = this.initializeMetrics();
  }

  /**
   * Initialize performance monitoring
   */
  public init(): void {
    if (!this.config.enabled) {
      console.log('📊 Performance monitoring disabled');
      return;
    }

    this.startTime = performance.now();
    console.log('📊 Performance monitoring initialized');

    // Start collecting metrics
    if (this.config.collectVitals) {
      this.setupVitalsCollection();
    }

    if (this.config.collectRuntime) {
      this.setupRuntimeCollection();
    }

    if (this.config.collectBundle) {
      this.collectBundleMetrics();
    }

    // Set up periodic reporting
    this.setupPeriodicReporting();
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    // Update runtime metrics before returning
    this.updateRuntimeMetrics();
    return { ...this.metrics };
  }

  /**
   * Record a custom performance metric
   */
  public recordMetric(name: string, value: number): void {
    this.metrics.custom[name] = value;
    console.log(`📊 Custom metric recorded: ${name} = ${value}ms`);
  }

  /**
   * Mark a performance point
   */
  public mark(name: string): void {
    if (performance.mark) {
      performance.mark(name);
      console.log(`📊 Performance mark: ${name}`);
    }
  }

  /**
   * Measure time between marks
   */
  public measure(name: string, startMark: string, endMark?: string): number {
    if (performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name, 'measure');
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          const duration = lastEntry?.duration ?? 0;
          console.log(`📊 Performance measure: ${name} = ${duration.toFixed(2)}ms`);
          return duration;
        }
      } catch (error) {
        console.warn(`⚠️ Performance measure failed for ${name}:`, error);
      }
    }
    return 0;
  }

  /**
   * Generate performance report
   */
  public generateReport(): PerformanceReport {
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
  public destroy(): void {
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    console.log('📊 Performance monitoring destroyed');
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private initializeMetrics(): PerformanceMetrics {
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

  private setupVitalsCollection(): void {
    // Largest Contentful Paint (LCP)
    this.observePerformanceObserver('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.vitals.lcp = lastEntry.startTime;
      console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
    });

    // First Input Delay (FID)
    this.observePerformanceObserver('first-input', (entries) => {
      const firstEntry = entries[0];
      if (firstEntry) {
        this.metrics.vitals.fid = firstEntry.processingStart - firstEntry.startTime;
        console.log(`📊 FID: ${this.metrics.vitals.fid.toFixed(2)}ms`);
      }
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observePerformanceObserver('layout-shift', (entries) => {
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.metrics.vitals.cls = clsValue;
      console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
    });

    // First Contentful Paint (FCP)
    this.observePerformanceObserver('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.vitals.fcp = fcpEntry.startTime;
        console.log(`📊 FCP: ${fcpEntry.startTime.toFixed(2)}ms`);
      }
    });

    // Time to First Byte (TTFB)
    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0];
        if (navEntry?.responseStart && navEntry?.requestStart) {
          this.metrics.vitals.ttfb = navEntry.responseStart - navEntry.requestStart;
          console.log(`📊 TTFB: ${this.metrics.vitals.ttfb.toFixed(2)}ms`);
        }
      }
    }
  }

  private observePerformanceObserver(type: string, callback: (entries: any[]) => void): void {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`⚠️ Failed to observe ${type}:`, error);
    }
  }

  private setupRuntimeCollection(): void {
    // Initial runtime metrics
    setTimeout(() => {
      this.updateRuntimeMetrics();
    }, 0);

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        this.metrics.runtime.memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
      }, 5000);
    }

    // Monitor DOM nodes
    const observer = new MutationObserver(() => {
      this.metrics.runtime.domNodes = document.querySelectorAll('*').length;
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer as any);
  }

  private updateRuntimeMetrics(): void {
    // Calculate initialization time
    this.metrics.runtime.initTime = performance.now() - this.startTime;

    // Time to interactive (approximate)
    if (performance.getEntriesByType) {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        const navEntry = entries[0];
        if (navEntry?.loadEventEnd && navEntry?.loadEventStart) {
          this.metrics.runtime.interactiveTime = navEntry.loadEventEnd - navEntry.loadEventStart;
        }
      }
    }
  }

  private collectBundleMetrics(): void {
    // Try to get bundle size from script tags
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    let moduleCount = 0;

    scripts.forEach(script => {
      if ((script as HTMLScriptElement).src?.includes('/assets/js/main.js')) {
        moduleCount++;
        // This would typically be fetched from the server
        // For now, we'll use an estimated value
        totalSize += 64000; // 64KB estimated
      }
    });

    this.metrics.bundle.size.raw = totalSize;
    this.metrics.bundle.modules = moduleCount;

    // Bundle load time
    if (performance.getEntriesByType) {
      const entries = performance.getEntriesByType('resource');
      const bundleEntry = entries.find(entry =>
        entry.name.includes('/assets/js/main.js')
      );

      if (bundleEntry && 'responseEnd' in bundleEntry && 'requestStart' in bundleEntry) {
        const bundleTiming = bundleEntry as any;
        this.metrics.bundle.loadTime = bundleTiming.responseEnd - bundleTiming.requestStart;
      }
    }

    console.log(`📊 Bundle metrics collected: ${totalSize} bytes, ${moduleCount} modules`);
  }

  private setupPeriodicReporting(): void {
    if (!this.config.reportingEndpoint) {
      return;
    }

    setInterval(() => {
      this.sendReport();
    }, this.config.reportInterval);
  }

  private sendReport(): void {
    if (!this.config.reportingEndpoint) {
      return;
    }

    const report = this.generateReport();

    // Send to analytics endpoint
    fetch(this.config.reportingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report)
    }).catch(error => {
      console.warn('⚠️ Failed to send performance report:', error);
    });
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100;

    // Deduct points for poor vitals
    if (metrics.vitals.lcp > 2500) score -= 20;
    if (metrics.vitals.fid > 100) score -= 15;
    if (metrics.vitals.cls > 0.1) score -= 15;
    if (metrics.vitals.fcp > 1800) score -= 15;
    if (metrics.vitals.ttfb > 800) score -= 10;

    // Deduct points for large bundle
    if (metrics.bundle.size.raw > 50000) score -= 10;

    // Deduct points for slow initialization
    if (metrics.runtime.initTime > 1000) score -= 10;

    return Math.max(0, score);
  }

  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.vitals.lcp > 2500) {
      recommendations.push('Optimize images and reduce server response time for better LCP');
    }

    if (metrics.vitals.fid > 100) {
      recommendations.push('Reduce JavaScript execution time and break up long tasks');
    }

    if (metrics.vitals.cls > 0.1) {
      recommendations.push('Ensure proper dimensions for images and avoid inserting content above existing content');
    }

    if (metrics.bundle.size.raw > 50000) {
      recommendations.push('Consider code splitting and tree shaking to reduce bundle size');
    }

    if (metrics.runtime.initTime > 1000) {
      recommendations.push('Optimize application initialization and load critical resources first');
    }

    if (metrics.runtime.memoryUsage > 50) {
      recommendations.push('Monitor for memory leaks and optimize memory usage');
    }

    return recommendations;
  }
}

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface PerformanceMonitorConfig {
  enabled?: boolean;
  collectVitals?: boolean;
  collectRuntime?: boolean;
  collectBundle?: boolean;
  reportingEndpoint?: string | null;
  reportInterval?: number;
}

export interface PerformanceReport {
  timestamp: number;
  url: string;
  userAgent: string;
  metrics: PerformanceMetrics;
  score: number;
  recommendations: string[];
}

// ============================================================================
// Default Instance
// ============================================================================

export const performanceMonitor = new PerformanceMonitor({
  enabled: process.env.NODE_ENV === 'production',
  collectVitals: true,
  collectRuntime: true,
  collectBundle: true,
  reportingEndpoint: null, // Configure as needed
  reportInterval: 30000
});

// ============================================================================
// Convenience Functions
// ============================================================================

export const initPerformanceMonitoring = (): void => {
  performanceMonitor.init();
};

export const getPerformanceMetrics = (): PerformanceMetrics => {
  return performanceMonitor.getMetrics();
};

export const recordPerformanceMetric = (name: string, value: number): void => {
  performanceMonitor.recordMetric(name, value);
};

export const generatePerformanceReport = (): PerformanceReport => {
  return performanceMonitor.generateReport();
};