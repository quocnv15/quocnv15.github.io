/**
 * Jekyll Blog TypeScript Frontend
 *
 * Architecture:
 * - Modular design with feature-based organization
 * - Type-safe DOM manipulation with null safety
 * - Performance optimized with lazy loading
 * - Error handling with graceful degradation
 */

// Feature modules
import { initTheme } from './modules/theme';
import type { AppConfig } from './core/types';

// Services
import { createConfigService } from './services/config.service';
import { initNavigation } from './modules/navigation';
import { initCopyCode } from './modules/copy-code';
import { initTOC } from './modules/toc';
// import { initSearch } from './modules/search';
// import { initShareButtons } from './modules/share';

// Core infrastructure
import { CleanupManager } from './core/cleanup-manager';
import { registerService, getService, serviceFactory } from './core/service-factory';
import { pluginSystem } from './core/plugin-system';
import { componentRegistry } from './components/component-registry';
import { performanceMonitor, initPerformanceMonitoring } from './core/performance-monitor';
import { appStateManager } from './core/app-state';

// Utilities
import { ready as domReady } from './modules/utils/dom';
// import { initErrorHandling, initPerformanceMonitoring } from './modules/utils/errors';

// AppConfig interface is now imported from @/core/types

/**
 * Load external CSS files
 */
const loadExternalCSS = (): void => {
  const cssFiles = [
    '/assets/css/theme.css',
    '/assets/css/components.css',
    '/assets/css/utilities.css'
  ];

  cssFiles.forEach(cssFile => {
    // Check if CSS file is already loaded
    const existingLink = document.querySelector(`link[href="${cssFile}"]`);
    if (existingLink) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssFile;
    link.media = 'screen';

    // Add error handling
    link.onerror = () => {
      console.warn(`⚠️ Failed to load CSS file: ${cssFile}`);
    };

    link.onload = () => {
      console.log(`✅ CSS file loaded: ${cssFile}`);
    };

    document.head.appendChild(link);
  });

  console.log('🎨 External CSS files loading initiated');
};

/**
 * Get configuration using the service factory
 */
const getAppConfig = (): AppConfig => {
  const configService = getService('config');
  const siteConfig = configService.getSiteConfig();

  // Convert SiteConfig to AppConfig for backward compatibility
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

/**
 * Initialize application with error handling
 */
const initializeApp = async (): Promise<void> => {
  const config = getAppConfig();

  // Mark initialization start
  performanceMonitor.mark('app-init-start');

  try {
    console.log('🚀 Jekyll TypeScript Frontend Starting...');
    console.log('📊 Config:', config);

    // Load external CSS files
    loadExternalCSS();

    // Initialize core infrastructure
    const cleanupManager = CleanupManager.getInstance({
      autoCleanupOnUnload: true,
      logCleanupActivity: process.env.NODE_ENV === 'development'
    });

    console.log('🧹 Cleanup manager initialized');

    // Register configuration service with factory
    registerService('config', createConfigService, true);

    // Register plugin system with factory
    registerService('plugins', () => pluginSystem, true);

    // Register component registry with factory
    registerService('components', () => componentRegistry, true);

    // Initialize configuration service
    const configService = getService('config');
    const siteConfig = configService.getSiteConfig();

    console.log('📋 Configuration service initialized with factory pattern');
    console.log('📊 Site config:', {
      theme: siteConfig.theme,
      environment: siteConfig.environment,
      features: siteConfig.features,
      isPost: siteConfig.isPost
    });

    // Initialize state management system
    console.log('🗄️ State management system initialized');

    // Make app state manager globally available
    if (typeof window !== 'undefined') {
      (window as any).__APP_STATE_MANAGER__ = appStateManager;
    }

    // Register state manager with service factory
    registerService('stateManager', () => appStateManager, true);

    console.log('📊 App state metrics:', appStateManager.getMetrics());

    // Initialize plugin system
    console.log('🔌 Plugin system initialized');
    console.log('📊 Plugin system stats:', pluginSystem.getStats());

    // Initialize component registry
    console.log('📋 Component registry initialized');
    console.log('📊 Component registry stats:', componentRegistry.getStats());

    // initErrorHandling();
    // initPerformanceMonitoring();

    // Initialize features based on configuration
    initTheme(config.theme);
    initNavigation();

    if (config.copyCodeEnabled) {
      await initCopyCode();
    }

    if (config.tocEnabled && config.isPost) {
      await initTOC();
    }

    if (config.searchEnabled) {
      // await initSearch();
      console.log('🔍 Search functionality not implemented yet');
    }

    if (config.shareButtonsEnabled && config.isPost) {
      // await initShareButtons();
      console.log('📤 Share buttons not implemented yet');
    }

    // Mark as ready
    document.body.classList.add('js-enabled');
    document.body.classList.remove('js-loading');

    // Mark initialization complete
    performanceMonitor.mark('app-init-end');
    const initTime = performanceMonitor.measure('app-init', 'app-init-start', 'app-init-end');
    performanceMonitor.recordMetric('app-initialization', initTime);

    // Initialize performance monitoring
    initPerformanceMonitoring();

    console.log('✅ Jekyll TypeScript frontend initialized successfully (Phase 2 complete)');
    console.log(`⚡ Initialization time: ${initTime.toFixed(2)}ms`);

    // Log statistics in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        const cleanupStats = cleanupManager.getStats();
        console.log('📊 Cleanup Manager Stats:', cleanupStats);

        const configStats = configService.getCacheStats();
        console.log('📊 Configuration Service Stats:', configStats);

        const serviceStats = serviceFactory.getStats();
        console.log('📊 Service Factory Stats:', serviceStats);

        const plugins = getService('plugins');
        const pluginStats = plugins.getStats();
        console.log('📊 Plugin System Stats:', pluginStats);

        const components = getService('components');
        const componentStats = components.getStats();
        console.log('📊 Component Registry Stats:', componentStats);
      }, 100);
    }

  } catch (error) {
    console.error('❌ Failed to initialize app:', error);

    // Fallback behavior
    document.body.classList.add('js-fallback');
    document.body.classList.remove('js-loading');

    // Still enable basic functionality
    try {
      initTheme(config.theme);
      initNavigation();
    } catch (fallbackError) {
      console.error('❌ Even fallback initialization failed:', fallbackError);
    }
  }
};

/**
 * Application bootstrap
 */
domReady(() => {
  document.body.classList.add('js-loading');
  initializeApp();
});

// Export for external use and testing
export { initializeApp, getAppConfig };
