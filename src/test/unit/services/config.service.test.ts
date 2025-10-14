/**
 * ConfigService test suite
 * Tests for configuration management, singleton pattern, and fallback behavior
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfigService } from '../../../src/ts/services/config.service';
import type { SiteConfig, Environment } from '../../../src/ts/types';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.documentElement.lang = '';

    // Reset process environment
    delete (process as any).env.NODE_ENV;
    delete (window as any).jekyllEnvironment;

    // Reset singleton
    (ConfigService as any).instance = undefined;

    configService = ConfigService.getInstance();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ConfigService.getInstance();
      const instance2 = ConfigService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should create only one instance', () => {
      const spy = vi.spyOn(ConfigService.prototype as any, 'constructor');

      const instance1 = ConfigService.getInstance();
      const instance2 = ConfigService.getInstance();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(instance1).toBe(instance2);

      spy.mockRestore();
    });
  });

  describe('getSiteConfig', () => {
    it('should return cached config when available', () => {
      const mockConfig: SiteConfig = {
        theme: 'dark',
        environment: 'production',
        isPost: false,
        isHomePage: true,
        language: 'en',
        baseUrl: 'https://example.com',
        features: {
          searchEnabled: true,
          tocEnabled: false,
          copyCodeEnabled: true,
          shareButtonsEnabled: false,
          analyticsEnabled: true,
          commentsEnabled: false,
        },
      };

      // Set cache directly
      (configService as any).config = mockConfig;

      const result = configService.getSiteConfig();

      expect(result).toBe(mockConfig);
      expect(result).toEqual(mockConfig);
    });

    it('should parse config from script tag', () => {
      const script = document.createElement('script');
      script.id = 'site-config';
      script.type = 'application/json';
      script.textContent = JSON.stringify({
        theme: 'dark',
        features: {
          searchEnabled: true,
          analyticsEnabled: false,
        },
      });

      document.head.appendChild(script);

      const result = configService.getSiteConfig();

      expect(result.theme).toBe('dark');
      expect(result.features.searchEnabled).toBe(true);
      expect(result.features.analyticsEnabled).toBe(false);
      expect(result.environment).toBe('development'); // Default
    });

    it('should handle malformed JSON in script tag', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const script = document.createElement('script');
      script.id = 'site-config';
      script.type = 'application/json';
      script.textContent = '{ invalid json }';

      document.head.appendChild(script);

      const result = configService.getSiteConfig();

      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse site config:', expect.any(Error));
      expect(result.theme).toBe('system'); // Fallback value

      consoleSpy.mockRestore();
    });

    it('should create fallback config when no script tag found', () => {
      const result = configService.getSiteConfig();

      expect(result.theme).toBe('system');
      expect(result.environment).toBe('development');
      expect(result.language).toBe('en');
      expect(result.baseUrl).toBe(window.location.origin);
    });
  });

  describe('enrichConfig', () => {
    it('should enrich base config with derived values', () => {
      // Setup DOM
      document.body.classList.add('post');
      document.documentElement.lang = 'fr';

      const searchInput = document.createElement('input');
      searchInput.id = 'search-input';
      document.body.appendChild(searchInput);

      const codeBlock = document.createElement('pre');
      codeBlock.innerHTML = '<code>console.log("test");</code>';
      document.body.appendChild(codeBlock);

      const baseConfig = {
        theme: 'dark' as const,
        features: {
          searchEnabled: false, // Should be overridden by DOM detection
          analyticsEnabled: true,
        },
      };

      const result = (configService as any).enrichConfig(baseConfig);

      expect(result.theme).toBe('dark');
      expect(result.isPost).toBe(true);
      expect(result.isHomePage).toBe(false);
      expect(result.language).toBe('fr');
      expect(result.features.searchEnabled).toBe(true); // DOM detection
      expect(result.features.tocEnabled).toBe(true); // Post pages have TOC
      expect(result.features.copyCodeEnabled).toBe(true); // Code block detected
      expect(result.features.analyticsEnabled).toBe(true); // From base config
    });

    it('should use defaults for missing properties', () => {
      const baseConfig = {};

      const result = (configService as any).enrichConfig(baseConfig);

      expect(result.theme).toBe('system');
      expect(result.language).toBe('en');
      expect(result.features.searchEnabled).toBe(false);
      expect(result.features.analyticsEnabled).toBe(false); // Not production
    });
  });

  describe('createFallbackConfig', () => {
    it('should create comprehensive fallback config', () => {
      // Setup DOM with some elements
      document.body.classList.add('home');

      const shareLinks = document.createElement('div');
      shareLinks.className = 'share-links';
      document.body.appendChild(shareLinks);

      const result = (configService as any).createFallbackConfig();

      expect(result.theme).toBe('system');
      expect(result.isPost).toBe(false);
      expect(result.isHomePage).toBe(true);
      expect(result.language).toBe('en');
      expect(result.features.shareButtonsEnabled).toBe(true);
      expect(result.features.commentsEnabled).toBe(false);
    });
  });

  describe('getEnvironment', () => {
    it('should get environment from process.env.NODE_ENV', () => {
      (process as any).env.NODE_ENV = 'production';

      const result = (configService as any).getEnvironment();

      expect(result).toBe('production');
    });

    it('should get environment from Jekyll environment', () => {
      (window as any).jekyllEnvironment = 'production';

      const result = (configService as any).getEnvironment();

      expect(result).toBe('production');
    });

    it('should handle Jekyll development environment', () => {
      (window as any).jekyllEnvironment = 'development';

      const result = (configService as any).getEnvironment();

      expect(result).toBe('development');
    });

    it('should default to development when no environment specified', () => {
      const result = (configService as any).getEnvironment();

      expect(result).toBe('development');
    });

    it('should prioritize process.env over Jekyll environment', () => {
      (process as any).env.NODE_ENV = 'production';
      (window as any).jekyllEnvironment = 'development';

      const result = (configService as any).getEnvironment();

      expect(result).toBe('production');
    });
  });

  describe('getBaseUrl', () => {
    it('should get base URL from base element', () => {
      const base = document.createElement('base');
      base.setAttribute('href', 'https://example.com/blog/');
      document.head.appendChild(base);

      const result = (configService as any).getBaseUrl();

      expect(result).toBe('https://example.com/blog/');
    });

    it('should get base URL from site config script', () => {
      const script = document.createElement('script');
      script.id = 'site-config';
      script.textContent = JSON.stringify({ baseUrl: 'https://config.example.com' });
      document.head.appendChild(script);

      const result = (configService as any).getBaseUrl();

      expect(result).toBe('https://config.example.com');
    });

    it('should fallback to window.location.origin', () => {
      const result = (configService as any).getBaseUrl();

      expect(result).toBe(window.location.origin);
    });

    it('should handle malformed JSON in site config script', () => {
      const script = document.createElement('script');
      script.id = 'site-config';
      script.textContent = '{ invalid json }';
      document.head.appendChild(script);

      const result = (configService as any).getBaseUrl();

      expect(result).toBe(window.location.origin);
    });

    it('should handle empty href attribute', () => {
      const base = document.createElement('base');
      base.setAttribute('href', '');
      document.head.appendChild(base);

      const result = (configService as any).getBaseUrl();

      expect(result).toBe(window.location.origin);
    });
  });

  describe('isProduction', () => {
    it('should return true in production environment', () => {
      (process as any).env.NODE_ENV = 'production';

      expect(configService.isProduction()).toBe(true);
    });

    it('should return false in development environment', () => {
      (process as any).env.NODE_ENV = 'development';

      expect(configService.isProduction()).toBe(false);
    });

    it('should return false in test environment', () => {
      (process as any).env.NODE_ENV = 'test';

      expect(configService.isProduction()).toBe(false);
    });

    it('should use Jekyll environment when process.env unavailable', () => {
      (window as any).jekyllEnvironment = 'production';

      expect(configService.isProduction()).toBe(true);
    });
  });

  describe('isFeatureEnabled', () => {
    beforeEach(() => {
      // Mock a config with various feature flags
      (configService as any).config = {
        theme: 'system',
        environment: 'development',
        isPost: false,
        isHomePage: true,
        language: 'en',
        baseUrl: 'https://example.com',
        features: {
          searchEnabled: true,
          tocEnabled: false,
          copyCodeEnabled: true,
          shareButtonsEnabled: false,
          analyticsEnabled: false,
          commentsEnabled: true,
        },
      };
    });

    it('should return true for enabled features', () => {
      expect(configService.isFeatureEnabled('searchEnabled')).toBe(true);
      expect(configService.isFeatureEnabled('copyCodeEnabled')).toBe(true);
      expect(configService.isFeatureEnabled('commentsEnabled')).toBe(true);
    });

    it('should return false for disabled features', () => {
      expect(configService.isFeatureEnabled('tocEnabled')).toBe(false);
      expect(configService.isFeatureEnabled('shareButtonsEnabled')).toBe(false);
      expect(configService.isFeatureEnabled('analyticsEnabled')).toBe(false);
    });

    it('should return false for undefined features', () => {
      const config = (configService as any).config;
      delete config.features.undefinedFeature;

      expect(configService.isFeatureEnabled('undefinedFeature' as any)).toBe(false);
    });
  });

  describe('getCurrentTheme', () => {
    it('should return current theme from config', () => {
      (configService as any).config = {
        theme: 'dark',
        // ... other required properties
      };

      expect(configService.getCurrentTheme()).toBe('dark');
    });

    it('should fallback to system theme if not set', () => {
      (configService as any).config = {
        theme: 'system',
        // ... other required properties
      };

      expect(configService.getCurrentTheme()).toBe('system');
    });
  });

  describe('resetCache', () => {
    it('should clear cached configuration', () => {
      // Set some cached config
      (configService as any).config = { theme: 'dark' };

      configService.resetCache();

      expect((configService as any).config).toBeNull();
    });

    it('should regenerate config after reset', () => {
      // Set initial config
      const initialConfig = configService.getSiteConfig();

      // Reset cache
      configService.resetCache();

      // Get new config - should be regenerated
      const newConfig = configService.getSiteConfig();

      expect(newConfig).not.toBe(initialConfig); // Different object
      expect(newConfig).toEqual(initialConfig); // Same content
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete configuration workflow', () => {
      // Setup DOM with various elements
      document.body.classList.add('post');
      document.documentElement.lang = 'es';

      const searchInput = document.createElement('input');
      searchInput.id = 'search-input';
      document.body.appendChild(searchInput);

      const comments = document.createElement('div');
      comments.className = 'comments';
      document.body.appendChild(comments);

      // Set production environment
      (process as any).env.NODE_ENV = 'production';

      // Set base URL
      const base = document.createElement('base');
      base.setAttribute('href', 'https://blog.example.com/');
      document.head.appendChild(base);

      // Get configuration
      const config = configService.getSiteConfig();

      expect(config.theme).toBe('system'); // Default
      expect(config.environment).toBe('production');
      expect(config.isPost).toBe(true);
      expect(config.isHomePage).toBe(false);
      expect(config.language).toBe('es');
      expect(config.baseUrl).toBe('https://blog.example.com/');
      expect(config.features.searchEnabled).toBe(true);
      expect(config.features.tocEnabled).toBe(true); // Post pages have TOC
      expect(config.features.copyCodeEnabled).toBe(false); // No code blocks
      expect(config.features.shareButtonsEnabled).toBe(false); // No share links
      expect(config.features.analyticsEnabled).toBe(true); // Production
      expect(config.features.commentsEnabled).toBe(true);

      // Test feature checks
      expect(configService.isFeatureEnabled('searchEnabled')).toBe(true);
      expect(configService.isFeatureEnabled('analyticsEnabled')).toBe(true);
      expect(configService.isProduction()).toBe(true);
    });

    it('should handle configuration override via script tag', () => {
      // Create site config script
      const script = document.createElement('script');
      script.id = 'site-config';
      script.textContent = JSON.stringify({
        theme: 'light',
        features: {
          searchEnabled: false, // Override DOM detection
          analyticsEnabled: false, // Override production setting
          customFeature: true, // Custom feature
        },
      });

      document.head.appendChild(script);

      // Set production environment
      (process as any).env.NODE_ENV = 'production';

      const config = configService.getSiteConfig();

      expect(config.theme).toBe('light'); // From script
      expect(config.environment).toBe('production');
      expect(config.features.searchEnabled).toBe(false); // Override
      expect(config.features.analyticsEnabled).toBe(false); // Override
    });

    it('should handle multiple singleton instances correctly', () => {
      const instance1 = ConfigService.getInstance();
      const instance2 = ConfigService.getInstance();
      const instance3 = new (ConfigService as any)(); // Private constructor (should not be used)

      // Public instances should be the same
      expect(instance1).toBe(instance2);

      // Private constructor creates different instance (but shouldn't be used)
      expect(instance3).not.toBe(instance1);

      // But public getInstance should always return the same instance
      expect(ConfigService.getInstance()).toBe(instance1);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing DOM elements gracefully', () => {
      // Ensure no DOM elements exist
      document.head.innerHTML = '';
      document.body.innerHTML = '';

      expect(() => configService.getSiteConfig()).not.toThrow();
      expect(() => configService.isFeatureEnabled('searchEnabled')).not.toThrow();
    });

    it('should handle DOM query errors', () => {
      const originalQuerySelector = document.querySelector;
      document.querySelector = vi.fn().mockImplementation(() => {
        throw new Error('DOM error');
      });

      expect(() => configService.getSiteConfig()).toThrow('DOM error');

      // Restore
      document.querySelector = originalQuerySelector;
    });

    it('should handle invalid feature flag names', () => {
      (configService as any).config = {
        features: {},
      };

      // TypeScript should catch this, but test runtime behavior
      expect(configService.isFeatureEnabled('nonExistent' as any)).toBe(false);
    });
  });
});