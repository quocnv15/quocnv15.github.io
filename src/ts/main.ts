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
import { initTheme, type ThemeMode } from './modules/theme';
import { initNavigation } from './modules/navigation';
import { initCopyCode } from './modules/copy-code';
import { initTOC } from './modules/toc';
// import { initSearch } from './modules/search';
// import { initShareButtons } from './modules/share';

// Utilities
import { ready as domReady } from './modules/utils/dom';
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
    console.log('🚀 Jekyll TypeScript Frontend Starting...');
    console.log('📊 Config:', config);

    // Initialize core infrastructure
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

    console.log('✅ Jekyll TypeScript frontend initialized successfully (Phase 2 complete)');

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
export type { AppConfig };