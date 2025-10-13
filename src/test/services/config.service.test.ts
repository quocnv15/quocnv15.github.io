/**
 * Tests for ConfigService
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ConfigService } from '../../services/config.service';
import type { SiteConfig } from '../../types';

describe('ConfigService', () => {
  let configService: ConfigService;

  beforeEach(() => {
    // Clear any existing config
    ConfigService.getInstance().resetCache();
    configService = ConfigService.getInstance();

    // Reset DOM
    document.head.innerHTML = '';
    document.body.className = '';
    document.documentElement.lang = 'en';
  });

  afterEach(() => {
    configService.resetCache();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ConfigService.getInstance();
      const instance2 = ConfigService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getSiteConfig', () => {
    it('should return fallback configuration when no script is found', () => {
      const config = configService.getSiteConfig();

      expect(config).toMatchObject({
        theme: 'system',
        environment: 'development',
        isPost: false,
        isHomePage: false,
        language: 'en',
        baseUrl: expect.any(String),
        features: {
          searchEnabled: false,
          tocEnabled: false,
          copyCodeEnabled: false,
          shareButtonsEnabled: false,
          analyticsEnabled: false,
          commentsEnabled: false,
        },
      });
    });

    it('should parse configuration from script tag', () => {
      const testConfig = {
        theme: 'dark' as const,
        features: {
          searchEnabled: true,
          copyCodeEnabled: true,
        },
      };

      const script = document.createElement('script');
      script.id = 'site-config';
      script.type = 'application/json';
      script.textContent = JSON.stringify(testConfig);
      document.head.appendChild(script);

      const config = configService.getSiteConfig();

      expect(config.theme).toBe('dark');
      expect(config.features.searchEnabled).toBe(true);
      expect(config.features.copyCodeEnabled).toBe(true);
    });

    it('should handle invalid JSON gracefully', () => {
      const script = document.createElement('script');
      script.id = 'site-config';
      script.type = 'application/json';
      script.textContent = 'invalid json';
      document.head.appendChild(script);

      // Should not throw and should return fallback config
      expect(() => configService.getSiteConfig()).not.toThrow();
    });

    it('should detect post pages correctly', () => {
      document.body.classList.add('post');
      const config = configService.getSiteConfig();
      expect(config.isPost).toBe(true);
      expect(config.features.tocEnabled).toBe(true);
    });

    it('should detect home pages correctly', () => {
      document.body.classList.add('home');
      const config = configService.getSiteConfig();
      expect(config.isHomePage).toBe(true);
    });

    it('should detect features from DOM elements', () => {
      // Add search input
      const searchInput = document.createElement('input');
      searchInput.id = 'search-input';
      document.body.appendChild(searchInput);

      // Add code block
      const codeBlock = document.createElement('pre');
      const code = document.createElement('code');
      codeBlock.appendChild(code);
      document.body.appendChild(codeBlock);

      // Add share links
      const shareLinks = document.createElement('div');
      shareLinks.className = 'share-links';
      document.body.appendChild(shareLinks);

      const config = configService.getSiteConfig();

      expect(config.features.searchEnabled).toBe(true);
      expect(config.features.copyCodeEnabled).toBe(true);
      expect(config.features.shareButtonsEnabled).toBe(true);
    });
  });

  describe('isProduction', () => {
    it('should return false in development', () => {
      expect(configService.isProduction()).toBe(false);
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return false for unknown features', () => {
      expect(configService.isFeatureEnabled('unknown' as any)).toBe(false);
    });

    it('should return correct feature status', () => {
      document.body.classList.add('post');
      const config = configService.getSiteConfig();

      expect(configService.isFeatureEnabled('tocEnabled')).toBe(true);
      expect(configService.isFeatureEnabled('searchEnabled')).toBe(false);
    });
  });

  describe('getCurrentTheme', () => {
    it('should return system theme by default', () => {
      expect(configService.getCurrentTheme()).toBe('system');
    });

    it('should return stored theme', () => {
      const script = document.createElement('script');
      script.id = 'site-config';
      script.type = 'application/json';
      script.textContent = JSON.stringify({ theme: 'dark' });
      document.head.appendChild(script);

      expect(configService.getCurrentTheme()).toBe('dark');
    });
  });

  describe('resetCache', () => {
    it('should clear cached configuration', () => {
      const config1 = configService.getSiteConfig();
      configService.resetCache();
      const config2 = configService.getSiteConfig();

      expect(config1).not.toBe(config2);
      expect(config1).toEqual(config2);
    });
  });
});