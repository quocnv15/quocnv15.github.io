/**
 * State Management Integration Tests
 *
 * Tests the complete state management system integration:
 * - State manager creation and configuration
 * - Persistence and recovery
 * - Module integration
 * - Debug tools functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { appStateManager, AppStateManager, themeStateIntegration, navigationStateIntegration } from '../../core/app-state';
import { StateStore, createStore } from '../../core/state-manager';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => [])
  }
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true
});

// Mock DOM elements
document.body.innerHTML = `
  <html>
    <head></head>
    <body>
      <header class="site-header"></header>
      <nav class="site-nav">
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
      <button class="theme-toggle">Toggle Theme</button>
      <button class="nav-toggle">Menu</button>
      <main>
        <article>
          <h1>Test Article</h1>
          <p>This is a test article for state management integration.</p>
          <pre><code>console.log('Hello, world!');</code></pre>
        </article>
      </main>
    </body>
  </html>
`;

describe('State Management Integration', () => {
  let stateManager: AppStateManager;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    vi.clearAllMocks();

    // Create fresh state manager instance
    stateManager = new AppStateManager({
      persistence: {
        enabled: true,
        backend: 'localStorage',
        key: 'test-app-state',
        compression: false
      },
      debug: {
        enabled: true,
        visualInspector: false,
        actionTimeline: true,
        performanceMonitoring: true,
        errorTracking: true,
        stateDiff: true,
        exportImport: true,
        maxHistorySize: 50,
        logLevel: 'info'
      }
    });
  });

  afterEach(() => {
    stateManager.destroy();
  });

  describe('State Manager Creation', () => {
    it('should create state manager with initial state', () => {
      const initialState = stateManager.getState();

      expect(initialState).toBeDefined();
      expect(initialState.theme.mode).toBe('system');
      expect(initialState.navigation.isMobileMenuOpen).toBe(false);
      expect(initialState.ui.notifications).toEqual([]);
      expect(initialState.user.preferences.language).toBe('en');
      expect(initialState.app.isFirstVisit).toBe(true);
    });

    it('should provide correct type safety', () => {
      const state = stateManager.getState();

      // TypeScript should catch type errors
      expect(state.theme.mode).toMatch(/^(light|dark|system)$/);
      expect(typeof state.navigation.isMobileMenuOpen).toBe('boolean');
      expect(Array.isArray(state.ui.notifications)).toBe(true);
      expect(typeof state.user.preferences.language).toBe('string');
      expect(typeof state.app.version).toBe('string');
    });
  });

  describe('State Updates and Subscriptions', () => {
    it('should update theme state correctly', () => {
      const listener = vi.fn();
      stateManager.subscribe(listener);

      stateManager.setTheme('dark');

      const updatedState = stateManager.getState();
      expect(updatedState.theme.mode).toBe('dark');
      expect(listener).toHaveBeenCalled();
    });

    it('should update navigation state correctly', () => {
      stateManager.setMobileMenuOpen(true);

      const state = stateManager.getState();
      expect(state.navigation.isMobileMenuOpen).toBe(true);

      stateManager.toggleMobileMenu();
      expect(stateManager.getState().navigation.isMobileMenuOpen).toBe(false);
    });

    it('should handle UI notifications correctly', () => {
      const notificationId = stateManager.addNotification('info', 'Test notification', 5000);

      const state = stateManager.getState();
      expect(state.ui.notifications).toHaveLength(1);
      expect(state.ui.notifications[0].message).toBe('Test notification');
      expect(state.ui.notifications[0].type).toBe('info');

      stateManager.removeNotification(notificationId);
      expect(stateManager.getState().ui.notifications).toHaveLength(0);
    });

    it('should handle user preferences updates', () => {
      stateManager.updateUserPreferences({
        language: 'fr',
        animationsEnabled: false
      });

      const state = stateManager.getState();
      expect(state.user.preferences.language).toBe('fr');
      expect(state.user.preferences.animationsEnabled).toBe(false);
    });
  });

  describe('State Selectors', () => {
    it('should create reactive selectors', () => {
      const themeSelector = stateManager.select(state => state.theme);
      const themeMode = themeSelector.get();

      expect(themeMode.mode).toBe('system');

      stateManager.setTheme('dark');
      expect(themeSelector.get().mode).toBe('dark');
    });

    it('should handle complex selectors', () => {
      const userPrefsSelector = stateManager.select(state => state.user.preferences);
      const initialPrefs = userPrefsSelector.get();

      expect(initialPrefs.language).toBe('en');

      stateManager.updateUserPreferences({ language: 'es' });
      expect(userPrefsSelector.get().language).toBe('es');
    });
  });

  describe('Persistence', () => {
    it('should persist state to localStorage', async () => {
      stateManager.setTheme('dark');
      stateManager.updateUserPreferences({ language: 'fr' });

      // Wait for async persistence
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-app-state',
        expect.stringContaining('"dark"')
      );
    });

    it('should load persisted state on initialization', async () => {
      // Set up persisted state
      localStorageMock.setItem('test-app-state', JSON.stringify({
        theme: { mode: 'dark', systemPreference: 'light', isTransitioning: false },
        navigation: { isMobileMenuOpen: true, isMobile: false, activeSection: '', scrollPosition: 0 },
        ui: { isLoading: false, notifications: [], modals: [], sidebar: { isOpen: false, activeTab: 'main' } },
        user: {
          preferences: { language: 'fr', timezone: 'UTC', dateFormat: 'YYYY-MM-DD', animationsEnabled: false, reducedMotion: false },
          session: { startTime: Date.now(), pageViews: 1, timeOnPage: 0, lastActivity: Date.now() }
        },
        app: { version: '1.0.0', buildNumber: 'test', environment: 'test', isFirstVisit: false, hasSeenOnboarding: false, lastVisit: 0 }
      }));

      // Create new state manager instance
      const newStateManager = new AppStateManager({
        persistence: {
          enabled: true,
          backend: 'localStorage',
          key: 'test-app-state',
          compression: false
        }
      });

      // Wait for async load
      await new Promise(resolve => setTimeout(resolve, 0));

      const state = newStateManager.getState();
      expect(state.theme.mode).toBe('dark');
      expect(state.navigation.isMobileMenuOpen).toBe(true);
      expect(state.user.preferences.language).toBe('fr');
      expect(state.app.isFirstVisit).toBe(false);

      newStateManager.destroy();
    });
  });

  describe('Debug Tools', () => {
    it('should record action history', () => {
      stateManager.setTheme('light');
      stateManager.setTheme('dark');
      stateManager.toggleMobileMenu();

      const debugInfo = stateManager.getDebugInfo();
      expect(debugInfo.length).toBeGreaterThan(0);
      expect(debugInfo[debugInfo.length - 1].action.type).toBe('TOGGLE_MOBILE_MENU');
    });

    it('should provide performance metrics', () => {
      // Perform several actions
      for (let i = 0; i < 5; i++) {
        stateManager.setTheme(i % 2 === 0 ? 'light' : 'dark');
      }

      const metrics = stateManager.getMetrics();
      expect(metrics.totalActions).toBeGreaterThan(0);
      expect(metrics.averageActionTime).toBeGreaterThanOrEqual(0);
      expect(metrics.totalSubscribers).toBeGreaterThanOrEqual(0);
    });

    it('should export and import state', () => {
      // Set some state
      stateManager.setTheme('dark');
      stateManager.updateUserPreferences({ language: 'fr' });

      // Export state
      const exportedState = stateManager.exportState();
      expect(exportedState).toContain('"dark"');
      expect(exportedState).toContain('"fr"');

      // Reset and import
      stateManager.setTheme('light');
      stateManager.updateUserPreferences({ language: 'en' });

      stateManager.importState(exportedState);

      const state = stateManager.getState();
      expect(state.theme.mode).toBe('dark');
      expect(state.user.preferences.language).toBe('fr');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid state imports gracefully', () => {
      expect(() => {
        stateManager.importState('invalid json');
      }).toThrow('Failed to import state');
    });

    it('should continue working after persistence errors', () => {
      // Mock localStorage to throw error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded');
      });

      // Should not throw
      expect(() => {
        stateManager.setTheme('dark');
      }).not.toThrow();

      const state = stateManager.getState();
      expect(state.theme.mode).toBe('dark');
    });
  });

  describe('Module Integration', () => {
    it('should integrate with theme state integration', () => {
      const themeState = themeStateIntegration.getTheme();
      expect(themeState.mode).toBe('system');

      themeStateIntegration.setTheme('dark');
      expect(themeStateIntegration.getTheme().mode).toBe('dark');
      expect(stateManager.getState().theme.mode).toBe('dark');
    });

    it('should integrate with navigation state integration', () => {
      const navState = navigationStateIntegration.getNavigation();
      expect(navState.isMobileMenuOpen).toBe(false);

      navigationStateIntegration.toggleMobileMenu();
      expect(navigationStateIntegration.getNavigation().isMobileMenuOpen).toBe(true);
      expect(stateManager.getState().navigation.isMobileMenuOpen).toBe(true);
    });

    it('should subscribe to state changes through integrations', () => {
      const listener = vi.fn();
      themeStateIntegration.subscribeToTheme(listener);

      themeStateIntegration.setTheme('light');
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        mode: 'light'
      }));
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources properly', () => {
      const listener = vi.fn();
      const subscription = stateManager.subscribe(listener);

      // Verify subscription works
      stateManager.setTheme('dark');
      expect(listener).toHaveBeenCalled();

      // Cleanup
      subscription();
      stateManager.setTheme('light');

      // Listener should not be called after cleanup
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should destroy state manager completely', () => {
      stateManager.destroy();

      // Should throw errors after destruction
      expect(() => {
        stateManager.getState();
      }).toThrow();
    });
  });
});

describe('State Store Isolation', () => {
  it('should maintain separate state instances', () => {
    const store1 = createStore('test1', {
      initialState: { value: 'initial1' }
    });

    const store2 = createStore('test2', {
      initialState: { value: 'initial2' }
    });

    expect(store1.getState().value).toBe('initial1');
    expect(store2.getState().value).toBe('initial2');

    store1.dispatch('SET_STATE', 'changed1');
    expect(store1.getState().value).toBe('changed1');
    expect(store2.getState().value).toBe('initial2'); // Should remain unchanged

    store1.destroy();
    store2.destroy();
  });

  it('should handle store name conflicts', () => {
    const store1 = createStore('conflict-test', {
      initialState: { value: 'first' }
    });

    expect(() => {
      createStore('conflict-test', {
        initialState: { value: 'second' }
      });
    }).toThrow('State store \'conflict-test\' already exists');

    store1.destroy();
  });
});

describe('Performance Characteristics', () => {
  it('should handle rapid state updates efficiently', () => {
    const startTime = performance.now();

    // Perform 1000 state updates
    for (let i = 0; i < 1000; i++) {
      stateManager.setTheme(i % 2 === 0 ? 'light' : 'dark');
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time (adjust threshold as needed)
    expect(duration).toBeLessThan(1000); // 1 second

    const metrics = stateManager.getMetrics();
    expect(metrics.totalActions).toBe(1000);
    expect(metrics.averageActionTime).toBeLessThan(10); // Average should be under 10ms
  });

  it('should handle large subscriber counts efficiently', () => {
    const listeners = Array(100).fill(null).map(() => vi.fn());

    // Subscribe many listeners
    const subscriptions = listeners.map(listener =>
      stateManager.subscribe(listener)
    );

    // Single state update
    stateManager.setTheme('dark');

    // All listeners should be called
    listeners.forEach(listener => {
      expect(listener).toHaveBeenCalled();
    });

    // Cleanup subscriptions
    subscriptions.forEach(unsubscribe => unsubscribe());

    const metrics = stateManager.getMetrics();
    expect(metrics.totalSubscribers).toBe(0);
  });
});