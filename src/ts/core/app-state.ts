/**
 * Application State Management Integration
 *
 * Integrates the state management system with existing modules:
 * - Theme state management
 * - Navigation state management
 * - UI state management
 * - User preferences
 * - Application settings
 */

import { createStore, StateStore, StateConfig } from './state-manager';
import { StatePersistenceManager, PersistenceConfig } from './state-persistence';
import { StateDebugManager, DebugConfig } from './state-debug-tools';
import type { ThemeMode } from '../types';

// ============================================================================
// Type Definitions
// ============================================================================

export interface AppState {
  theme: {
    mode: ThemeMode;
    systemPreference: ThemeMode;
    isTransitioning: boolean;
  };
  navigation: {
    isMobileMenuOpen: boolean;
    isMobile: boolean;
    activeSection: string;
    scrollPosition: number;
  };
  ui: {
    isLoading: boolean;
    notifications: Array<{
      id: string;
      type: 'info' | 'success' | 'warning' | 'error';
      message: string;
      timestamp: number;
      autoHide?: number;
    }>;
    modals: Array<{
      id: string;
      isOpen: boolean;
      title?: string;
      content?: any;
    }>;
    sidebar: {
      isOpen: boolean;
      activeTab: string;
    };
  };
  user: {
    preferences: {
      language: string;
      timezone: string;
      dateFormat: string;
      animationsEnabled: boolean;
      reducedMotion: boolean;
    };
    session: {
      startTime: number;
      pageViews: number;
      timeOnPage: number;
      lastActivity: number;
    };
  };
  app: {
    version: string;
    buildNumber: string;
    environment: 'development' | 'production' | 'test';
    isFirstVisit: boolean;
    hasSeenOnboarding: boolean;
    lastVisit: number;
  };
}

export interface AppAction {
  type: string;
  payload?: any;
  meta?: {
    persist?: boolean;
    analytics?: boolean;
    undoable?: boolean;
  };
}

// ============================================================================
// Initial State
// ============================================================================

const getInitialState = (): AppState => ({
  theme: {
    mode: 'system',
    systemPreference: 'light',
    isTransitioning: false
  },
  navigation: {
    isMobileMenuOpen: false,
    isMobile: false,
    activeSection: '',
    scrollPosition: 0
  },
  ui: {
    isLoading: false,
    notifications: [],
    modals: [],
    sidebar: {
      isOpen: false,
      activeTab: 'main'
    }
  },
  user: {
    preferences: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
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
    version: '1.0.0',
    buildNumber: process.env.BUILD_NUMBER || 'dev',
    environment: (process.env.NODE_ENV as any) || 'development',
    isFirstVisit: !localStorage.getItem('app-visited'),
    hasSeenOnboarding: false,
    lastVisit: 0
  }
});

// ============================================================================
// Reducers
// ============================================================================

const themeReducers = {
  SET_THEME: (state: AppState['theme'], action: AppAction): AppState['theme'] => {
    const newMode = action.payload as ThemeMode;
    return {
      ...state,
      mode: newMode,
      isTransitioning: true
    };
  },
  SET_SYSTEM_THEME: (state: AppState['theme'], action: AppAction): AppState['theme'] => {
    return {
      ...state,
      systemPreference: action.payload as ThemeMode
    };
  },
  THEME_TRANSITION_END: (state: AppState['theme']): AppState['theme'] => {
    return {
      ...state,
      isTransitioning: false
    };
  }
};

const navigationReducers = {
  TOGGLE_MOBILE_MENU: (state: AppState['navigation']): AppState['navigation'] => {
    return {
      ...state,
      isMobileMenuOpen: !state.isMobileMenuOpen
    };
  },
  SET_MOBILE_MENU_OPEN: (state: AppState['navigation'], action: AppAction): AppState['navigation'] => {
    return {
      ...state,
      isMobileMenuOpen: action.payload as boolean
    };
  },
  SET_MOBILE: (state: AppState['navigation'], action: AppAction): AppState['navigation'] => {
    return {
      ...state,
      isMobile: action.payload as boolean
    };
  },
  SET_ACTIVE_SECTION: (state: AppState['navigation'], action: AppAction): AppState['navigation'] => {
    return {
      ...state,
      activeSection: action.payload as string
    };
  },
  SET_SCROLL_POSITION: (state: AppState['navigation'], action: AppAction): AppState['navigation'] => {
    return {
      ...state,
      scrollPosition: action.payload as number
    };
  }
};

const uiReducers = {
  SET_LOADING: (state: AppState['ui'], action: AppAction): AppState['ui'] => {
    return {
      ...state,
      isLoading: action.payload as boolean
    };
  },
  ADD_NOTIFICATION: (state: AppState['ui'], action: AppAction): AppState['ui'] => {
    const notification = action.payload;
    return {
      ...state,
      notifications: [...state.notifications, notification]
    };
  },
  REMOVE_NOTIFICATION: (state: AppState['ui'], action: AppAction): AppState['ui'] => {
    const id = action.payload as string;
    return {
      ...state,
      notifications: state.notifications.filter(n => n.id !== id)
    };
  },
  CLEAR_NOTIFICATIONS: (state: AppState['ui']): AppState['ui'] => {
    return {
      ...state,
      notifications: []
    };
  },
  OPEN_MODAL: (state: AppState['ui'], action: AppAction): AppState['ui'] => {
    const { id, title, content } = action.payload;
    const existingModalIndex = state.modals.findIndex(m => m.id === id);

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
  CLOSE_MODAL: (state: AppState['ui'], action: AppAction): AppState['ui'] => {
    const id = action.payload as string;
    return {
      ...state,
      modals: state.modals.map(modal =>
        modal.id === id ? { ...modal, isOpen: false } : modal
      )
    };
  },
  TOGGLE_SIDEBAR: (state: AppState['ui']): AppState['ui'] => {
    return {
      ...state,
      sidebar: {
        ...state.sidebar,
        isOpen: !state.sidebar.isOpen
      }
    };
  },
  SET_SIDEBAR_TAB: (state: AppState['ui'], action: AppAction): AppState['ui'] => {
    return {
      ...state,
      sidebar: {
        ...state.sidebar,
        activeTab: action.payload as string
      }
    };
  }
};

const userReducers = {
  UPDATE_PREFERENCES: (state: AppState['user'], action: AppAction): AppState['user'] => {
    return {
      ...state,
      preferences: {
        ...state.preferences,
        ...action.payload
      }
    };
  },
  UPDATE_SESSION: (state: AppState['user'], action: AppAction): AppState['user'] => {
    return {
      ...state,
      session: {
        ...state.session,
        ...action.payload,
        lastActivity: Date.now()
      }
    };
  },
  INCREMENT_PAGE_VIEWS: (state: AppState['user']): AppState['user'] => {
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

const appReducers = {
  SET_ONBOARDING_COMPLETE: (state: AppState['app']): AppState['app'] => {
    return {
      ...state,
      hasSeenOnboarding: true
    };
  },
  UPDATE_LAST_VISIT: (state: AppState['app']): AppState['app'] => {
    return {
      ...state,
      lastVisit: Date.now()
    };
  },
  MARK_VISITED: (state: AppState['app']): AppState['app'] => {
    return {
      ...state,
      isFirstVisit: false
    };
  }
};

// ============================================================================
// App State Manager
// ============================================================================

export class AppStateManager {
  private store: StateStore<AppState>;
  private debugManager?: StateDebugManager;
  private persistenceManager?: StatePersistenceManager;

  constructor(config?: {
    persistence?: PersistenceConfig;
    debug?: DebugConfig;
  }) {
    // Create persistence config
    const persistenceConfig: PersistenceConfig = {
      backend: 'localStorage',
      key: 'app-state',
      version: 1,
      compression: true,
      encryption: {
        enabled: false
      },
      migration: {
        currentVersion: 1,
        migrate: (data: any, fromVersion: number, toVersion: number) => {
          // Handle future migrations here
          return data;
        }
      },
      backup: {
        enabled: true,
        interval: 30, // minutes
        maxBackups: 5
      },
      cleanup: {
        enabled: true,
        maxAge: 7, // days
        maxQuota: 80 // percentage
      },
      ...config?.persistence
    };

    // Create debug config
    const debugConfig: DebugConfig = {
      enabled: process.env.NODE_ENV === 'development',
      visualInspector: true,
      actionTimeline: true,
      performanceMonitoring: true,
      errorTracking: true,
      stateDiff: true,
      exportImport: true,
      maxHistorySize: 100,
      logLevel: 'info',
      ...config?.debug
    };

    // Combine all reducers
    const allReducers = {
      ...themeReducers,
      ...navigationReducers,
      ...uiReducers,
      ...userReducers,
      ...appReducers
    };

    // Create state store
    this.store = createStore('app', {
      initialState: getInitialState(),
      reducers: allReducers,
      config: {
        persistence: {
          enabled: !!config?.persistence,
          ...persistenceConfig
        },
        debug: debugConfig
      }
    });

    // Setup persistence
    if (config?.persistence) {
      this.persistenceManager = new StatePersistenceManager(persistenceConfig);
      this.setupPersistence();
    }

    // Setup debugging
    if (config?.debug?.enabled) {
      this.debugManager = new StateDebugManager(this.store, debugConfig);
    }

    // Initialize session tracking
    this.initializeSessionTracking();

    console.log('🗄️ App State Manager initialized');
  }

  private setupPersistence(): void {
    if (!this.persistenceManager) return;

    // Save state when it changes
    this.store.subscribe(async (state) => {
      try {
        await this.persistenceManager!.save(state);
      } catch (error) {
        console.error('Failed to persist state:', error);
      }
    });

    // Load persisted state on initialization
    this.loadPersistedState();
  }

  private async loadPersistedState(): Promise<void> {
    if (!this.persistenceManager) return;

    try {
      const persistedState = await this.persistenceManager.load();
      if (persistedState) {
        this.store.reset(persistedState);
        console.log('🗄️ Persisted state loaded');
      }
    } catch (error) {
      console.error('Failed to load persisted state:', error);
    }
  }

  private initializeSessionTracking(): void {
    // Update session activity
    const updateActivity = () => {
      this.dispatch('UPDATE_SESSION', {
        timeOnPage: Date.now() - this.getState().user.session.startTime
      });
    };

    // Track activity every 30 seconds
    setInterval(updateActivity, 30000);

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateActivity();
      } else {
        this.dispatch('INCREMENT_PAGE_VIEWS');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mark as visited
    if (this.getState().app.isFirstVisit) {
      this.dispatch('MARK_VISITED');
      localStorage.setItem('app-visited', 'true');
    }
  }

  // Public API
  dispatch(action: string | AppAction, payload?: any, meta?: AppAction['meta']): void {
    if (typeof action === 'string') {
      this.store.dispatch({
        type: action,
        payload,
        meta,
        timestamp: Date.now()
      });
    } else {
      this.store.dispatch(action);
    }
  }

  getState(): AppState {
    return this.store.getState();
  }

  subscribe(listener: (state: AppState) => void): () => void {
    return this.store.subscribe(listener);
  }

  select<R>(selector: (state: AppState) => R) {
    return this.store.select(selector);
  }

  // Convenience methods for common actions
  setTheme(mode: ThemeMode): void {
    this.dispatch('SET_THEME', mode);
  }

  toggleMobileMenu(): void {
    this.dispatch('TOGGLE_MOBILE_MENU');
  }

  setMobileMenuOpen(open: boolean): void {
    this.dispatch('SET_MOBILE_MENU_OPEN', open);
  }

  addNotification(type: 'info' | 'success' | 'warning' | 'error', message: string, autoHide?: number): void {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
      autoHide
    };
    this.dispatch('ADD_NOTIFICATION', notification);

    // Auto-hide notification if specified
    if (autoHide) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, autoHide);
    }
  }

  removeNotification(id: string): void {
    this.dispatch('REMOVE_NOTIFICATION', id);
  }

  setLoading(loading: boolean): void {
    this.dispatch('SET_LOADING', loading);
  }

  openModal(id: string, title?: string, content?: any): void {
    this.dispatch('OPEN_MODAL', { id, title, content });
  }

  closeModal(id: string): void {
    this.dispatch('CLOSE_MODAL', id);
  }

  updateUserPreferences(preferences: Partial<AppState['user']['preferences']>): void {
    this.dispatch('UPDATE_PREFERENCES', preferences);
  }

  // Get specific state slices
  getThemeState(): AppState['theme'] {
    return this.getState().theme;
  }

  getNavigationState(): AppState['navigation'] {
    return this.getState().navigation;
  }

  getUIState(): AppState['ui'] {
    return this.getState().ui;
  }

  getUserState(): AppState['user'] {
    return this.getState().user;
  }

  getAppState(): AppState['app'] {
    return this.getState().app;
  }

  // Debug and development methods
  getDebugInfo() {
    return this.store.getDebugInfo();
  }

  getMetrics() {
    return this.store.getMetrics();
  }

  exportState(): string {
    return JSON.stringify(this.getState(), null, 2);
  }

  importState(stateJson: string): void {
    try {
      const state = JSON.parse(stateJson);
      this.store.reset(state);
      console.log('🗄️ State imported successfully');
    } catch (error) {
      console.error('Failed to import state:', error);
      throw error;
    }
  }

  async createBackup(): Promise<string> {
    if (!this.persistenceManager) {
      throw new Error('Persistence not configured');
    }

    const backupInfo = await this.persistenceManager.createBackup();
    return backupInfo.id;
  }

  async restoreBackup(backupId: string): Promise<void> {
    if (!this.persistenceManager) {
      throw new Error('Persistence not configured');
    }

    await this.persistenceManager.restoreBackup(backupId);
  }

  destroy(): void {
    this.debugManager?.destroy();
    this.store.destroy();
  }
}

// ============================================================================
// Global Instance
// ============================================================================

export const appStateManager = new AppStateManager({
  persistence: {
    enabled: true,
    backend: 'localStorage',
    compression: true
  },
  debug: {
    enabled: process.env.NODE_ENV === 'development',
    visualInspector: true,
    actionTimeline: true
  }
});

// ============================================================================
// Module Integration
// ============================================================================

/**
 * Theme module integration
 */
export const themeStateIntegration = {
  setTheme: (mode: ThemeMode) => appStateManager.setTheme(mode),
  getTheme: () => appStateManager.getThemeState(),
  subscribeToTheme: (callback: (theme: AppState['theme']) => void) =>
    appStateManager.select(state => state.theme).subscribe(callback)
};

/**
 * Navigation module integration
 */
export const navigationStateIntegration = {
  toggleMobileMenu: () => appStateManager.toggleMobileMenu(),
  setMobileMenuOpen: (open: boolean) => appStateManager.setMobileMenuOpen(open),
  getNavigation: () => appStateManager.getNavigationState(),
  subscribeToNavigation: (callback: (nav: AppState['navigation']) => void) =>
    appStateManager.select(state => state.navigation).subscribe(callback)
};

/**
 * UI module integration
 */
export const uiStateIntegration = {
  setLoading: (loading: boolean) => appStateManager.setLoading(loading),
  addNotification: (type: 'info' | 'success' | 'warning' | 'error', message: string, autoHide?: number) =>
    appStateManager.addNotification(type, message, autoHide),
  removeNotification: (id: string) => appStateManager.removeNotification(id),
  openModal: (id: string, title?: string, content?: any) => appStateManager.openModal(id, title, content),
  closeModal: (id: string) => appStateManager.closeModal(id),
  getUI: () => appStateManager.getUIState(),
  subscribeToUI: (callback: (ui: AppState['ui']) => void) =>
    appStateManager.select(state => state.ui).subscribe(callback)
};

/**
 * User preferences integration
 */
export const userStateIntegration = {
  updatePreferences: (preferences: Partial<AppState['user']['preferences']>) =>
    appStateManager.updateUserPreferences(preferences),
  getUser: () => appStateManager.getUserState(),
  subscribeToUser: (callback: (user: AppState['user']) => void) =>
    appStateManager.select(state => state.user).subscribe(callback)
};

export default appStateManager;