/**
 * Global type definitions for the Jekyll TypeScript frontend
 */

// Re-export from core types with selective imports to avoid conflicts
export type {
  LoadingState,
  UIState
} from '../core/types';

// Re-export from interfaces with selective imports to avoid conflicts
export type {
  AsyncEventHandler,
  ErrorInfo,
  EventHandler,
  LoadingState as InterfaceLoadingState,
  NavigationItem as InterfaceNavigationItem,
  PerformanceMetrics,
  SearchRecord,
  SearchResult,
  ShareConfig,
  SharePlatform,
  SiteConfig as InterfaceSiteConfig,
  StorageItem,
  ThemeMode as InterfaceThemeMode,
  TocItem as InterfaceTocItem,
  UIState as InterfaceUIState
} from '../interfaces/types';

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