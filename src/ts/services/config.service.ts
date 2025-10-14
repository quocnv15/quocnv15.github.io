/**
 * Functional Configuration Service
 *
 * Replaces the singleton pattern with a functional approach that provides:
 * - Immutable configuration objects
 * - Functional API for configuration access
 * - Built-in caching with configurable TTL
 * - Easy testing with dependency injection
 * - Memory-efficient configuration management
 */

import type { SiteConfig, ThemeMode, Environment, FeatureFlags } from '../core/types';

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Configuration source types
 */
export type ConfigSource = 'script' | 'dom-inspection' | 'fallback';

/**
 * Configuration cache entry
 */
interface ConfigCacheEntry {
  config: SiteConfig;
  timestamp: number;
  source: ConfigSource;
  ttl: number;
}

/**
 * Configuration service options
 */
export interface ConfigServiceOptions {
  /** Cache time-to-live in milliseconds (0 = no caching) */
  cacheTTL?: number;
  /** Enable development logging */
  debug?: boolean;
  /** Custom selectors for DOM inspection */
  selectors?: typeof DEFAULT_SELECTORS;
}

/**
 * Configuration builder for creating custom configurations
 */
export interface ConfigBuilder {
  theme(theme: ThemeMode): ConfigBuilder;
  environment(env: Environment): ConfigBuilder;
  isPost(isPost: boolean): ConfigBuilder;
  isHomePage(isHomePage: boolean): ConfigBuilder;
  language(lang: string): ConfigBuilder;
  baseUrl(url: string): ConfigBuilder;
  features(features: Partial<FeatureFlags>): ConfigBuilder;
  build(): SiteConfig;
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_SELECTORS = {
  siteConfig: '#site-config',
  searchInput: '#search-input',
  preCode: 'pre code',
  shareLinks: '.share-links',
  comments: '.comments'
} as const;

const DEFAULT_FEATURES: FeatureFlags = {
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

const DEFAULT_CONFIG: Omit<SiteConfig, 'theme' | 'environment' | 'language' | 'baseUrl' | 'features'> = {
  isPost: false,
  isHomePage: false,
  title: '',
  description: '',
  author: '',
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
    titleTemplate: '',
    description: '',
    image: '',
    keywords: []
  }
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get current environment from various sources
 */
const getCurrentEnvironment = (): Environment => {
  // Check Node.js environment variable first
  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV as Environment;
  }

  // Fallback to Jekyll environment
  const jekyllEnv = (window as any).jekyllEnvironment;
  if (jekyllEnv) {
    return jekyllEnv === 'production' ? 'production' : 'development';
  }

  return 'development';
};

/**
 * Get base URL for the site
 */
const getBaseUrl = (): string => {
  // Check for base element
  const baseElement = document.querySelector('base');
  if (baseElement?.getAttribute('href')) {
    return baseElement.getAttribute('href')!;
  }

  // Try to get from site config script
  const siteConfigScript = document.querySelector<HTMLScriptElement>(DEFAULT_SELECTORS.siteConfig);
  if (siteConfigScript?.textContent) {
    try {
      const config = JSON.parse(siteConfigScript.textContent);
      if (config.baseUrl) {
        return config.baseUrl;
      }
    } catch {
      // Ignore parse errors
    }
  }

  return window.location.origin;
};

/**
 * Detect features from DOM
 */
const detectFeatures = (selectors: typeof DEFAULT_SELECTORS): FeatureFlags => ({
  searchEnabled: !!document.querySelector(selectors.searchInput),
  tocEnabled: document.body.classList.contains('post'),
  copyCodeEnabled: !!document.querySelector(selectors.preCode),
  shareButtonsEnabled: !!document.querySelector(selectors.shareLinks),
  analyticsEnabled: getCurrentEnvironment() === 'production',
  commentsEnabled: !!document.querySelector(selectors.comments),
  notificationsEnabled: false, // Could be detected later
  themeCustomizationEnabled: false, // Could be detected later
  keyboardShortcutsEnabled: false // Could be detected later
});

/**
 * Extract configuration from script tag
 */
const extractFromScript = (selectors: typeof DEFAULT_SELECTORS): Partial<SiteConfig> | null => {
  const script = document.querySelector<HTMLScriptElement>(selectors.siteConfig);

  if (!script?.textContent) {
    return null;
  }

  try {
    return JSON.parse(script.textContent);
  } catch (error) {
    console.warn('Failed to parse site config from script:', error);
    return null;
  }
};

/**
 * Create configuration from DOM inspection
 */
const createFromDOM = (selectors: typeof DEFAULT_SELECTORS): SiteConfig => {
  return {
    ...DEFAULT_CONFIG,
    theme: 'system' as ThemeMode,
    environment: getCurrentEnvironment(),
    isPost: document.body.classList.contains('post'),
    isHomePage: document.body.classList.contains('home'),
    language: document.documentElement.lang || 'en',
    baseUrl: getBaseUrl(),
    features: detectFeatures(selectors)
  };
};

/**
 * Enrich partial configuration with derived values
 */
const enrichConfig = (
  baseConfig: Partial<SiteConfig>,
  selectors: typeof DEFAULT_SELECTORS
): SiteConfig => {
  return {
    ...DEFAULT_CONFIG,
    theme: baseConfig.theme || 'system',
    environment: getCurrentEnvironment(),
    isPost: baseConfig.isPost ?? document.body.classList.contains('post'),
    isHomePage: baseConfig.isHomePage ?? document.body.classList.contains('home'),
    language: baseConfig.language || document.documentElement.lang || 'en',
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

// ============================================================================
// Configuration Cache
// ============================================================================

class ConfigCache {
  private cache = new Map<string, ConfigCacheEntry>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  get(key: string): SiteConfig | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.config;
  }

  set(key: string, config: SiteConfig, ttl?: number): void {
    this.cache.set(key, {
      config,
      timestamp: Date.now(),
      source: 'script' as ConfigSource, // Will be updated by caller
      ttl: ttl ?? this.defaultTTL
    });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  getStats(): {
    size: number;
    entries: Array<{
      key: string;
      age: number;
      source: ConfigSource;
      ttl: number;
    }>;
  } {
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
}

// ============================================================================
// Configuration Service Factory
// ============================================================================

/**
 * Create a configuration service instance
 */
export const createConfigService = (options: ConfigServiceOptions = {}) => {
  const {
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    debug = process.env.NODE_ENV === 'development',
    selectors = DEFAULT_SELECTORS
  } = options;

  const cache = new ConfigCache(cacheTTL);
  const cacheKey = 'site-config';

  /**
   * Get site configuration with caching
   */
  const getSiteConfig = (): SiteConfig => {
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      if (debug) {
        console.log('📋 Using cached configuration');
      }
      return cached;
    }

    // Try to extract from script
    const scriptConfig = extractFromScript(selectors);
    if (scriptConfig) {
      const config = enrichConfig(scriptConfig, selectors);
      cache.set(cacheKey, config);

      if (debug) {
        console.log('📋 Configuration loaded from script');
      }

      return config;
    }

    // Fallback to DOM inspection
    const domConfig = createFromDOM(selectors);
    cache.set(cacheKey, domConfig);

    if (debug) {
      console.log('📋 Configuration created from DOM inspection');
    }

    return domConfig;
  };

  /**
   * Get specific configuration value
   */
  const get = <K extends keyof SiteConfig>(key: K): SiteConfig[K] => {
    return getSiteConfig()[key];
  };

  /**
   * Get current theme mode
   */
  const getCurrentTheme = (): ThemeMode => {
    return get('theme');
  };

  /**
   * Get current environment
   */
  const getEnvironment = (): Environment => {
    return get('environment');
  };

  /**
   * Check if running in production
   */
  const isProduction = (): boolean => {
    return getEnvironment() === 'production';
  };

  /**
   * Check if a feature is enabled
   */
  const isFeatureEnabled = <K extends keyof FeatureFlags>(feature: K): boolean => {
    return get('features')[feature] || false;
  };

  /**
   * Get all feature flags
   */
  const getFeatures = (): FeatureFlags => {
    return get('features');
  };

  /**
   * Force refresh configuration from source
   */
  const refresh = (): SiteConfig => {
    cache.delete(cacheKey);
    return getSiteConfig();
  };

  /**
   * Reset configuration cache
   */
  const resetCache = (): void => {
    cache.clear();
    if (debug) {
      console.log('📋 Configuration cache cleared');
    }
  };

  /**
   * Get cache statistics
   */
  const getCacheStats = () => {
    return cache.getStats();
  };

  /**
   * Create a configuration builder
   */
  const createBuilder = (): ConfigBuilder => {
    let config: Partial<SiteConfig> = {};

    return {
      theme(theme: ThemeMode): ConfigBuilder {
        config.theme = theme;
        return this;
      },

      environment(env: Environment): ConfigBuilder {
        config.environment = env;
        return this;
      },

      isPost(isPost: boolean): ConfigBuilder {
        config.isPost = isPost;
        return this;
      },

      isHomePage(isHomePage: boolean): ConfigBuilder {
        config.isHomePage = isHomePage;
        return this;
      },

      language(lang: string): ConfigBuilder {
        config.language = lang;
        return this;
      },

      baseUrl(url: string): ConfigBuilder {
        config.baseUrl = url;
        return this;
      },

      features(features: Partial<FeatureFlags>): ConfigBuilder {
        config.features = { ...DEFAULT_FEATURES, ...features };
        return this;
      },

      build(): SiteConfig {
        return enrichConfig(config, selectors);
      }
    };
  };

  /**
   * Create a configuration override for testing
   */
  const createOverride = (override: Partial<SiteConfig>): SiteConfig => {
    return enrichConfig(override, selectors);
  };

  return {
    // Core methods
    getSiteConfig,
    get,
    getCurrentTheme,
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

// ============================================================================
// Default Service Instance
// ============================================================================

/**
 * Default configuration service instance
 * This can be used directly in most cases
 */
export const configService = createConfigService({
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  debug: process.env.NODE_ENV === 'development'
});

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Get site configuration (using default service)
 */
export const getSiteConfig = (): SiteConfig => configService.getSiteConfig();

/**
 * Get current theme mode
 */
export const getCurrentTheme = (): ThemeMode => configService.getCurrentTheme();

/**
 * Get current environment
 */
export const getEnvironment = (): Environment => configService.getEnvironment();

/**
 * Check if running in production
 */
export const isProduction = (): boolean => configService.isProduction();

/**
 * Check if a feature is enabled
 */
export const isFeatureEnabled = <K extends keyof FeatureFlags>(feature: K): boolean => {
  return configService.isFeatureEnabled(feature);
};

/**
 * Get all feature flags
 */
export const getFeatures = (): FeatureFlags => configService.getFeatures();

/**
 * Refresh configuration
 */
export const refreshConfig = (): SiteConfig => configService.refresh();

// ============================================================================
// Legacy Compatibility (deprecated)
// ============================================================================

/**
 * @deprecated Use createConfigService() or the default configService instead
 */
export class ConfigService {
  private static service = createConfigService();

  public static getInstance() {
    return ConfigService.service;
  }

  public getSiteConfig() {
    return ConfigService.service.getSiteConfig();
  }

  public isProduction() {
    return ConfigService.service.isProduction();
  }

  public isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return ConfigService.service.isFeatureEnabled(feature);
  }

  public getCurrentTheme(): ThemeMode {
    return ConfigService.service.getCurrentTheme();
  }

  public resetCache(): void {
    ConfigService.service.resetCache();
  }
}