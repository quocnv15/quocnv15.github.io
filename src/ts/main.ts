/**
 * Jekyll Blog TypeScript Frontend
 *
 * Architecture:
 * - Modular design with feature-based organization
 * - Type-safe DOM manipulation with null safety
 * - Performance optimized with lazy loading
 * - Error handling with graceful degradation
 */

// Feature modules (will be added in Phase 2)
// import { initTheme, type ThemeMode } from './modules/theme';
// import { initNavigation } from './modules/navigation';
// import { initCopyCode } from './modules/copy-code';
// import { initTOC } from './modules/toc';
// import { initSearch } from './modules/search';
// import { initShareButtons } from './modules/share';

// Utilities (will be added in Phase 2)
// import { ready } from './modules/utils/dom';
// import { initErrorHandling, initPerformanceMonitoring } from './modules/utils/errors';

/**
 * Application configuration interface
 */
interface AppConfig {
  theme: 'light' | 'dark' | 'system';
  searchEnabled: boolean;
  tocEnabled: boolean;
  copyCodeEnabled: boolean;
  shareButtonsEnabled: boolean;
  isPost: boolean;
  isHomePage: boolean;
  environment: 'development' | 'production';
}

/**
 * Get configuration from page data or environment
 */
const getAppConfig = (): AppConfig => {
  const script = document.querySelector<HTMLScriptElement>('#site-config');

  if (script?.textContent) {
    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      console.warn('Failed to parse site config:', error);
    }
  }

  // Fallback configuration based on DOM inspection
  return {
    theme: 'system',
    searchEnabled: !!document.querySelector('#search-input'),
    tocEnabled: document.body.classList.contains('post'),
    copyCodeEnabled: !!document.querySelector('pre code'),
    shareButtonsEnabled: !!document.querySelector('.share-links'),
    isPost: document.body.classList.contains('post'),
    isHomePage: document.body.classList.contains('home'),
    environment: (process.env.NODE_ENV as AppConfig['environment']) || 'development'
  };
};

/**
 * Initialize application with error handling
 */
const initializeApp = async (): Promise<void> => {
  const config = getAppConfig();

  try {
    // Initialize core infrastructure (Phase 2)
    // initErrorHandling();
    // initPerformanceMonitoring();

    console.log('🚀 Jekyll TypeScript Frontend Starting...');
    console.log('📊 Config:', config);

    // Initialize features based on configuration (Phase 2)
    // initTheme(config.theme);
    // initNavigation();

    // if (config.copyCodeEnabled) {
    //   await initCopyCode();
    // }

    // if (config.tocEnabled && config.isPost) {
    //   await initTOC();
    // }

    // if (config.searchEnabled) {
    //   await initSearch();
    // }

    // if (config.shareButtonsEnabled && config.isPost) {
    //   await initShareButtons();
    // }

    // Mark as ready
    document.body.classList.add('js-enabled');
    document.body.classList.remove('js-loading');

    console.log('✅ Jekyll TypeScript frontend initialized successfully (Phase 1 complete)');

  } catch (error) {
    console.error('❌ Failed to initialize app:', error);

    // Fallback behavior
    document.body.classList.add('js-fallback');
    document.body.classList.remove('js-loading');

    // Still enable basic functionality (Phase 2)
    // try {
    //   initTheme(config.theme);
    //   initNavigation();
    // } catch (fallbackError) {
    //   console.error('❌ Even fallback initialization failed:', fallbackError);
    // }
  }
};

/**
 * Application bootstrap
 */
const ready = (callback: () => void): void => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

ready(() => {
  document.body.classList.add('js-loading');
  initializeApp();
});

// Export for external use and testing
export { initializeApp, getAppConfig };
export type { AppConfig };