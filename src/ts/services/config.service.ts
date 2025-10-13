/**
 * Configuration service for managing site settings
 */

import { SELECTORS, STORAGE_KEYS } from '../constants';
import type { SiteConfig, ThemeMode, Environment, FeatureFlags } from '../types';

export class ConfigService {
  private static instance: ConfigService;
  private config: SiteConfig | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Get site configuration from script tag or fallback
   */
  public getSiteConfig(): SiteConfig {
    if (this.config) {
      return this.config;
    }

    const script = document.querySelector<HTMLScriptElement>(SELECTORS.SITE_CONFIG);

    if (script?.textContent) {
      try {
        const parsedConfig = JSON.parse(script.textContent);
        this.config = this.enrichConfig(parsedConfig);
        return this.config;
      } catch (error) {
        console.warn('Failed to parse site config:', error);
      }
    }

    // Fallback configuration based on DOM inspection
    this.config = this.createFallbackConfig();
    return this.config;
  }

  /**
   * Enrich configuration with derived values
   */
  private enrichConfig(baseConfig: Partial<SiteConfig>): SiteConfig {
    return {
      theme: baseConfig.theme || 'system',
      environment: this.getEnvironment(),
      isPost: document.body.classList.contains('post'),
      isHomePage: document.body.classList.contains('home'),
      language: document.documentElement.lang || 'en',
      baseUrl: this.getBaseUrl(),
      features: {
        searchEnabled: !!document.querySelector('#search-input'),
        tocEnabled: document.body.classList.contains('post'),
        copyCodeEnabled: !!document.querySelector('pre code'),
        shareButtonsEnabled: !!document.querySelector('.share-links'),
        analyticsEnabled: this.isProduction(),
        commentsEnabled: !!document.querySelector('.comments'),
        ...baseConfig.features,
      },
    };
  }

  /**
   * Create fallback configuration
   */
  private createFallbackConfig(): SiteConfig {
    return {
      theme: 'system',
      environment: this.getEnvironment(),
      isPost: document.body.classList.contains('post'),
      isHomePage: document.body.classList.contains('home'),
      language: document.documentElement.lang || 'en',
      baseUrl: this.getBaseUrl(),
      features: {
        searchEnabled: !!document.querySelector('#search-input'),
        tocEnabled: document.body.classList.contains('post'),
        copyCodeEnabled: !!document.querySelector('pre code'),
        shareButtonsEnabled: !!document.querySelector('.share-links'),
        analyticsEnabled: this.isProduction(),
        commentsEnabled: !!document.querySelector('.comments'),
      },
    };
  }

  /**
   * Get current environment
   */
  private getEnvironment(): Environment {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
      return process.env.NODE_ENV as Environment;
    }

    // Fallback to Jekyll environment
    const jekyllEnv = (window as any).jekyllEnvironment;
    if (jekyllEnv) {
      return jekyllEnv === 'production' ? 'production' : 'development';
    }

    return 'development';
  }

  /**
   * Get base URL for the site
   */
  private getBaseUrl(): string {
    const baseElement = document.querySelector('base');
    if (baseElement?.getAttribute('href')) {
      return baseElement.getAttribute('href')!;
    }

    // Try to get from Jekyll config
    const siteConfigScript = document.querySelector<HTMLScriptElement>('#site-config');
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
  }

  /**
   * Check if running in production
   */
  public isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }

  /**
   * Check if a feature is enabled
   */
  public isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    const config = this.getSiteConfig();
    return config.features[feature] || false;
  }

  /**
   * Get current theme mode
   */
  public getCurrentTheme(): ThemeMode {
    const config = this.getSiteConfig();
    return config.theme;
  }

  /**
   * Reset cached configuration
   */
  public resetCache(): void {
    this.config = null;
  }
}