/**
 * State Management Debugging and Monitoring Tools
 *
 * Provides comprehensive debugging capabilities:
 * - Visual state inspector
 * - Action timeline and history
 * - Performance monitoring
 * - State diff visualization
 * - Error tracking and reporting
 * - Export/import functionality
 */

import { StateStore } from './state-manager';
import type { StateAction, StateMetrics } from './state-manager';

// ============================================================================
// Type Definitions
// ============================================================================

export interface DebugConfig {
  enabled: boolean;
  visualInspector?: boolean;
  actionTimeline?: boolean;
  performanceMonitoring?: boolean;
  errorTracking?: boolean;
  stateDiff?: boolean;
  exportImport?: boolean;
  maxHistorySize?: number;
  logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug';
}

export interface StateSnapshot {
  timestamp: number;
  state: any;
  action?: StateAction;
  metrics?: StateMetrics;
  performance?: {
    actionTime: number;
    renderTime: number;
    memoryUsage: number;
  };
}

export interface ActionTimeline {
  actions: StateAction[];
  snapshots: StateSnapshot[];
  errors: Array<{
    action: StateAction;
    error: Error;
    timestamp: number;
    stackTrace: string;
  }>;
}

export interface StateDiff {
  path: string[];
  oldValue: any;
  newValue: any;
  type: 'added' | 'removed' | 'modified' | 'moved';
}

export interface PerformanceReport {
  totalActions: number;
  averageActionTime: number;
  slowestActions: Array<{
    action: string;
    duration: number;
    timestamp: number;
  }>;
  memoryTrend: Array<{
    timestamp: number;
    usage: number;
  }>;
  errors: number;
}

// ============================================================================
// Visual State Inspector
// ============================================================================

export class StateInspector {
  private container: HTMLElement | null = null;
  private isVisible: boolean = false;
  private store: StateStore;
  private config: DebugConfig;

  constructor(store: StateStore, config: DebugConfig) {
    this.store = store;
    this.config = config;
    this.createInspector();
  }

  private createInspector(): void {
    if (!this.config.visualInspector) return;

    // Create inspector container
    this.container = document.createElement('div');
    this.container.id = 'state-inspector';
    this.container.innerHTML = `
      <div class="state-inspector-header">
        <h3>🗄️ State Inspector</h3>
        <div class="inspector-controls">
          <button id="inspector-toggle" title="Toggle Inspector">👁️</button>
          <button id="inspector-minimize" title="Minimize">➖</button>
          <button id="inspector-close" title="Close">✖️</button>
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

    // Add styles
    this.addStyles();

    // Setup event listeners
    this.setupEventListeners();

    // Add to DOM
    document.body.appendChild(this.container);

    // Initially hidden
    this.hide();
  }

  private addStyles(): void {
    const style = document.createElement('style');
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

  private setupEventListeners(): void {
    if (!this.container) return;

    // Tab switching
    this.container.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = (e.target as HTMLElement).dataset.tab;
        if (tabName) {
          this.switchTab(tabName);
        }
      });
    });

    // Control buttons
    const toggleBtn = this.container.querySelector('#inspector-toggle');
    const minimizeBtn = this.container.querySelector('#inspector-minimize');
    const closeBtn = this.container.querySelector('#inspector-close');

    toggleBtn?.addEventListener('click', () => this.toggle());
    minimizeBtn?.addEventListener('click', () => this.toggleMinimize());
    closeBtn?.addEventListener('click', () => this.hide());

    // Make header draggable
    const header = this.container.querySelector('.state-inspector-header');
    this.makeDraggable(header as HTMLElement, this.container);

    // Subscribe to state changes
    this.store.subscribe(() => this.updateStateView());
  }

  private switchTab(tabName: string): void {
    if (!this.container) return;

    // Update tab buttons
    this.container.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
      if ((tab as HTMLElement).dataset.tab === tabName) {
        tab.classList.add('active');
      }
    });

    // Update panels
    this.container.querySelectorAll('.panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = this.container.querySelector(`#${tabName}-panel`);
    activePanel?.classList.add('active');

    // Update panel content
    switch (tabName) {
      case 'state':
        this.updateStateView();
        break;
      case 'actions':
        this.updateActionsView();
        break;
      case 'performance':
        this.updatePerformanceView();
        break;
      case 'tools':
        this.updateToolsView();
        break;
    }
  }

  private updateStateView(): void {
    if (!this.container) return;

    const stateView = this.container.querySelector('.state-view') as HTMLElement;
    const state = this.store.getState();

    stateView.innerHTML = `
      <div class="state-json">${JSON.stringify(state, null, 2)}</div>
    `;
  }

  private updateActionsView(): void {
    if (!this.container) return;

    const actionsTimeline = this.container.querySelector('.actions-timeline') as HTMLElement;
    const debugInfo = this.store.getDebugInfo();

    actionsTimeline.innerHTML = debugInfo.map(info => `
      <div class="action-item ${info.stackTrace ? 'error' : ''}">
        <div class="action-type">${info.action.type}</div>
        <div class="action-payload">${JSON.stringify(info.action.payload)}</div>
        <div class="action-timestamp">
          ${new Date(info.timestamp).toLocaleTimeString()} (${info.duration.toFixed(2)}ms)
        </div>
      </div>
    `).reverse().join('');
  }

  private updatePerformanceView(): void {
    if (!this.container) return;

    const performanceMetrics = this.container.querySelector('.performance-metrics') as HTMLElement;
    const metrics = this.store.getMetrics();
    const debugInfo = this.store.getDebugInfo();

    // Calculate slowest actions
    const slowestActions = debugInfo
      .filter(info => info.duration > 5)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

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
          ${slowestActions.map(action => `
            <div style="margin-bottom: 5px; font-size: 11px;">
              ${action.action.type}: ${action.duration.toFixed(2)}ms
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  }

  private updateToolsView(): void {
    if (!this.container) return;

    const debugTools = this.container.querySelector('.debug-tools') as HTMLElement;

    debugTools.innerHTML = `
      <button class="tool-button" id="export-state">
        <div class="tool-name">📤 Export State</div>
        <div class="tool-description">Export current state to JSON</div>
      </button>
      <button class="tool-button" id="import-state">
        <div class="tool-name">📥 Import State</div>
        <div class="tool-description">Import state from JSON</div>
      </button>
      <button class="tool-button" id="create-backup">
        <div class="tool-name">💾 Create Backup</div>
        <div class="tool-description">Create state backup</div>
      </button>
      <button class="tool-button" id="clear-debug">
        <div class="tool-name">🧹 Clear Debug History</div>
        <div class="tool-description">Clear debugging history</div>
      </button>
      <button class="tool-button" id="reset-state">
        <div class="tool-name">🔄 Reset State</div>
        <div class="tool-description">Reset to initial state</div>
      </button>
    `;

    // Setup tool button listeners
    this.setupToolListeners();
  }

  private setupToolListeners(): void {
    if (!this.container) return;

    const exportBtn = this.container.querySelector('#export-state');
    const importBtn = this.container.querySelector('#import-state');
    const backupBtn = this.container.querySelector('#create-backup');
    const clearBtn = this.container.querySelector('#clear-debug');
    const resetBtn = this.container.querySelector('#reset-state');

    exportBtn?.addEventListener('click', () => this.exportState());
    importBtn?.addEventListener('click', () => this.importState());
    backupBtn?.addEventListener('click', () => this.createBackup());
    clearBtn?.addEventListener('click', () => this.clearDebugHistory());
    resetBtn?.addEventListener('click', () => this.resetState());
  }

  private makeDraggable(dragHandle: HTMLElement, element: HTMLElement): void {
    let isDragging = false;
    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;

    dragHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      initialX = e.clientX - element.offsetLeft;
      initialY = e.clientY - element.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      element.style.left = `${currentX}px`;
      element.style.top = `${currentY}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  private exportState(): void {
    const state = this.store.getState();
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `state-export-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  private importState(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const state = JSON.parse(e.target?.result as string);
          this.store.reset(state);
          alert('State imported successfully!');
        } catch (error) {
          alert('Failed to import state: Invalid JSON');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  private async createBackup(): Promise<void> {
    try {
      // This would integrate with the persistence manager
      const state = this.store.getState();
      const backupData = {
        timestamp: Date.now(),
        state,
        debugInfo: this.store.getDebugInfo(),
        metrics: this.store.getMetrics()
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `state-backup-${Date.now()}.json`;
      link.click();

      URL.revokeObjectURL(url);
      alert('Backup created successfully!');
    } catch (error) {
      alert('Failed to create backup');
    }
  }

  private clearDebugHistory(): void {
    this.store.clearDebugHistory();
    this.updateActionsView();
    alert('Debug history cleared!');
  }

  private resetState(): void {
    if (confirm('Are you sure you want to reset the state? This cannot be undone.')) {
      this.store.reset();
      alert('State reset successfully!');
    }
  }

  show(): void {
    if (this.container) {
      this.container.classList.remove('hidden');
      this.isVisible = true;
    }
  }

  hide(): void {
    if (this.container) {
      this.container.classList.add('hidden');
      this.isVisible = false;
    }
  }

  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  toggleMinimize(): void {
    if (this.container) {
      this.container.classList.toggle('minimized');
    }
  }

  destroy(): void {
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
  }
}

// ============================================================================
// Action Timeline
// ============================================================================

export class ActionTimeline {
  private _snapshots: StateSnapshot[] = [];
  private _errors: Array<{
    action: StateAction;
    error: Error;
    timestamp: number;
    stackTrace: string;
  }> = [];
  private maxSnapshots: number;

  constructor(maxSnapshots: number = 100) {
    this.maxSnapshots = maxSnapshots;
  }

  recordSnapshot(
    action: StateAction,
    state: any,
    metrics: StateMetrics,
    performance: { actionTime: number; renderTime: number; memoryUsage: number }
  ): void {
    const snapshot: StateSnapshot = {
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(state)), // Deep clone
      action: { ...action },
      metrics: { ...metrics },
      performance: { ...performance }
    };

    this._snapshots.push(snapshot);

    // Maintain max size
    if (this._snapshots.length > this.maxSnapshots) {
      this._snapshots = this._snapshots.slice(-this.maxSnapshots);
    }
  }

  recordError(action: StateAction, error: Error): void {
    this._errors.push({
      action: { ...action },
      error: { ...error },
      timestamp: Date.now(),
      stackTrace: error.stack || ''
    });
  }

  getTimeline(): {
    actions: StateAction[];
    snapshots: StateSnapshot[];
    errors: Array<{
      action: StateAction;
      error: Error;
      timestamp: number;
      stackTrace: string;
    }>;
  } {
    return {
      actions: this._snapshots.map(s => s.action!).filter(Boolean),
      snapshots: [...this._snapshots],
      errors: [...this._errors]
    };
  }

  getSnapshotsInRange(startTime: number, endTime: number): StateSnapshot[] {
    return this._snapshots.filter(s => s.timestamp >= startTime && s.timestamp <= endTime);
  }

  clear(): void {
    this._snapshots = [];
    this._errors = [];
  }

  export(): string {
    return JSON.stringify(this.getTimeline(), null, 2);
  }

  import(data: string): void {
    try {
      const timeline = JSON.parse(data) as any;
      this._snapshots = timeline.snapshots || [];
      this._errors = timeline.errors || [];
    } catch (error) {
      throw new Error('Invalid timeline data format');
    }
  }
}

// ============================================================================
// State Diff Calculator
// ============================================================================

export class StateDiffCalculator {
  static calculateDiff(oldState: any, newState: any, path: string[] = []): StateDiff[] {
    const diffs: StateDiff[] = [];

    // Handle null/undefined cases
    if (oldState === newState) {
      return diffs;
    }

    // Handle primitive values
    if (typeof oldState !== 'object' || oldState === null ||
        typeof newState !== 'object' || newState === null) {
      diffs.push({
        path,
        oldValue: oldState,
        newValue: newState,
        type: oldState === undefined ? 'added' :
              newState === undefined ? 'removed' : 'modified'
      });
      return diffs;
    }

    // Handle arrays
    if (Array.isArray(oldState) && Array.isArray(newState)) {
      const maxLength = Math.max(oldState.length, newState.length);

      for (let i = 0; i < maxLength; i++) {
        const oldItem = oldState[i];
        const newItem = newState[i];

        if (oldItem === undefined) {
          diffs.push({
            path: [...path, i.toString()],
            oldValue: undefined,
            newValue: newItem,
            type: 'added'
          });
        } else if (newItem === undefined) {
          diffs.push({
            path: [...path, i.toString()],
            oldValue: oldItem,
            newValue: undefined,
            type: 'removed'
          });
        } else {
          diffs.push(...this.calculateDiff(oldItem, newItem, [...path, i.toString()]));
        }
      }
      return diffs;
    }

    // Handle objects
    const allKeys = new Set([...Object.keys(oldState), ...Object.keys(newState)]);

    for (const key of allKeys) {
      const oldValue = oldState[key];
      const newValue = newState[key];

      if (oldValue === undefined) {
        diffs.push({
          path: [...path, key],
          oldValue: undefined,
          newValue,
          type: 'added'
        });
      } else if (newValue === undefined) {
        diffs.push({
          path: [...path, key],
          oldValue,
          newValue: undefined,
          type: 'removed'
        });
      } else {
        diffs.push(...this.calculateDiff(oldValue, newValue, [...path, key]));
      }
    }

    return diffs;
  }

  static formatDiffs(diffs: StateDiff[]): string {
    return diffs.map(diff => {
      const path = diff.path.join('.');
      const oldValue = JSON.stringify(diff.oldValue);
      const newValue = JSON.stringify(diff.newValue);
      const icon = diff.type === 'added' ? '➕' :
                  diff.type === 'removed' ? '➖' :
                  diff.type === 'modified' ? '🔄' : '↔️';

      return `${icon} ${path}: ${oldValue} → ${newValue}`;
    }).join('\n');
  }
}

// ============================================================================
// Performance Monitor
// ============================================================================

export class StatePerformanceMonitor {
  private actionTimes: Array<{ action: string; duration: number; timestamp: number }> = [];
  private memorySnapshots: Array<{ timestamp: number; usage: number }> = [];
  private errorCount: number = 0;

  recordAction(action: string, duration: number): void {
    this.actionTimes.push({ action, duration, timestamp: Date.now() });

    // Keep only last 1000 actions
    if (this.actionTimes.length > 1000) {
      this.actionTimes = this.actionTimes.slice(-1000);
    }
  }

  recordMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.memorySnapshots.push({
        timestamp: Date.now(),
        usage: memory.usedJSHeapSize
      });

      // Keep only last 100 snapshots
      if (this.memorySnapshots.length > 100) {
        this.memorySnapshots = this.memorySnapshots.slice(-100);
      }
    }
  }

  recordError(): void {
    this.errorCount++;
  }

  generateReport(): PerformanceReport {
    const totalActions = this.actionTimes.length;
    const averageActionTime = totalActions > 0
      ? this.actionTimes.reduce((sum, a) => sum + a.duration, 0) / totalActions
      : 0;

    const slowestActions = [...this.actionTimes]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
      .map(({ action, duration, timestamp }) => ({ action, duration, timestamp }));

    return {
      totalActions,
      averageActionTime,
      slowestActions,
      memoryTrend: this.memorySnapshots,
      errors: this.errorCount
    };
  }

  clear(): void {
    this.actionTimes = [];
    this.memorySnapshots = [];
    this.errorCount = 0;
  }
}

// ============================================================================
// Debug Manager
// ============================================================================

export class StateDebugManager {
  private inspector: StateInspector;
  private timeline: ActionTimeline;
  private performanceMonitor: StatePerformanceMonitor;
  private config: DebugConfig;

  constructor(store: StateStore, config: DebugConfig) {
    this.config = config;
    this.inspector = new StateInspector(store, config);
    this.timeline = new ActionTimeline(config.maxHistorySize || 100);
    this.performanceMonitor = new StatePerformanceMonitor();

    this.setupStoreMonitoring(store);
    this.setupGlobalAccess();
  }

  private setupStoreMonitoring(store: StateStore): void {
    if (!this.config.enabled) return;

    // Monitor state changes
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
              renderTime: 0, // Could be measured with requestAnimationFrame
              memoryUsage: metrics.memoryUsage
            }
          );

          if (this.config.performanceMonitoring) {
            this.performanceMonitor.recordAction(lastAction.action.type, lastAction.duration);
          }
        }
      }
    });

    // Monitor errors (would need to be integrated with store error handling)
    this.setupErrorMonitoring(store);
  }

  private setupErrorMonitoring(store: StateStore): void {
    if (!this.config.errorTracking) return;

    // Override store dispatch to catch errors
    const originalDispatch = store.dispatch.bind(store);
    store.dispatch = (...args: any[]) => {
      try {
        return originalDispatch(args[0], args[1], args[2]);
      } catch (error) {
        const action = args[0];
        this.timeline.recordError(action, error as Error);
        this.performanceMonitor.recordError();

        if (this.config.logLevel !== 'none') {
          console.error('State action error:', error);
        }

        throw error;
      }
    };
  }

  private setupGlobalAccess(): void {
    if (process.env.NODE_ENV === 'development') {
      (window as any).__STATE_DEBUG__ = {
        inspector: this.inspector,
        timeline: this.timeline,
        performanceMonitor: this.performanceMonitor,
        generateReport: () => this.performanceMonitor.generateReport(),
        exportTimeline: () => this.timeline.export(),
        clearHistory: () => this.clearAll()
      };

      console.group('🗄️ State Debug Tools Initialized');
      console.log('Access via window.__STATE_DEBUG__');
      console.log('Available methods:');
      console.log('  - inspector: Visual state inspector');
      console.log('  - timeline: Action timeline viewer');
      console.log('  - performanceMonitor: Performance metrics');
      console.log('  - generateReport(): Generate performance report');
      console.log('  - exportTimeline(): Export action timeline');
      console.log('  - clearHistory(): Clear all debug data');
      console.groupEnd();
    }
  }

  private clearAll(): void {
    this.timeline.clear();
    this.performanceMonitor.clear();
  }

  destroy(): void {
    this.inspector.destroy();
    this.clearAll();
  }
}

export default StateDebugManager;