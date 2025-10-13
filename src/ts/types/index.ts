/**
 * Global type definitions for the Jekyll TypeScript frontend
 */

// Re-export from interfaces
export * from '../interfaces/types';

// Additional global types
export interface Window {
  // Custom window properties
  _clickOutsideCleanup?: () => void;
  _escapeCleanup?: () => void;
  _resizeCleanup?: () => void;
  _scrollSpyCleanup?: () => void;
}

// Environment types
export type Environment = 'development' | 'production' | 'test';

// Device types
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Animation states
export type AnimationState = 'idle' | 'entering' | 'entered' | 'exiting' | 'exited';

// Feature flags
export interface FeatureFlags {
  searchEnabled: boolean;
  tocEnabled: boolean;
  copyCodeEnabled: boolean;
  shareButtonsEnabled: boolean;
  analyticsEnabled: boolean;
  commentsEnabled: boolean;
}

// Site configuration
export interface SiteConfig {
  theme: ThemeMode;
  environment: Environment;
  isPost: boolean;
  isHomePage: boolean;
  language: string;
  baseUrl: string;
  features: FeatureFlags;
}