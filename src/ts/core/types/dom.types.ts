/**
 * DOM-related type definitions
 *
 * This file contains all types related to DOM manipulation, events, and browser APIs.
 */

// ============================================================================
// DOM Element Types
// ============================================================================

/**
 * Generic element selector result type
 */
export type SelectorResult<T extends Element = Element> = T | null;

/**
 * Generic element query selector type
 */
export type QuerySelector<T extends Element = Element> = (selectors: string) => T | null;

/**
 * Generic element query selector all type
 */
export type QuerySelectorAll<T extends Element = Element> = (selectors: string) => NodeListOf<T>;

// ============================================================================
// Event Handler Types
// ============================================================================

/**
 * Synchronous event handler function
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Asynchronous event handler function
 */
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

/**
 * Event cleanup function
 */
export type EventCleanup = () => void;

/**
 * Event listener options
 */
export type EventListenerOptions = boolean | AddEventListenerOptions;

/**
 * Event listener registration result
 */
export type EventListenerRegistration = {
  element: Element;
  event: string;
  handler: EventHandler;
  cleanup: EventCleanup;
};

// ============================================================================
// DOM Utilities Types
// ============================================================================

/**
 * DOM element creation options
 */
export interface ElementCreationOptions {
  tagName?: string;
  className?: string;
  id?: string;
  attributes?: Record<string, string>;
  textContent?: string;
  innerHTML?: string;
  children?: Element[];
}

/**
 * DOM mutation configuration
 */
export interface DOMMutationConfig {
  attributes?: boolean;
  childList?: boolean;
  subtree?: boolean;
  characterData?: boolean;
  attributeFilter?: string[];
}

/**
 * CSS selector types
 */
export type CSSSelector = string;

/**
 * Element class name manipulation
 */
export type ClassNameManipulation = {
  add?: string | string[];
  remove?: string | string[];
  toggle?: string | string[];
  replace?: { old: string; new: string }[];
};

// ============================================================================
// Browser & Window Types
// ============================================================================

/**
 * Extended Window interface with custom properties
 */
export interface ExtendedWindow extends Window {
  // Custom cleanup functions
  _clickOutsideCleanup?: () => void;
  _escapeCleanup?: () => void;
  _resizeCleanup?: () => void;
  _scrollSpyCleanup?: () => void;

  // Jekyll environment
  jekyllEnvironment?: string;

  // Performance monitoring (additional methods)
  performance: Performance & {
    mark?: (name: string) => void;
    measure?: (name: string, startMark?: string, endMark?: string) => void;
  };
}

/**
 * Viewport dimensions
 */
export interface ViewportDimensions {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
}

/**
 * Element dimensions and position
 */
export interface ElementDimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  offsetWidth: number;
  offsetHeight: number;
}

// ============================================================================
// Animation Types
// ============================================================================

/**
 * Animation state types
 */
export type AnimationState = 'idle' | 'entering' | 'entered' | 'exiting' | 'exited';

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  fill?: 'none' | 'forwards' | 'backwards' | 'both';
}

/**
 * Transition configuration
 */
export interface TransitionConfig extends AnimationConfig {
  property?: string | string[];
}

/**
 * Keyframe definition
 */
export interface Keyframe {
  offset?: number;
  opacity?: number;
  transform?: string;
  [property: string]: string | number | undefined;
}

// ============================================================================
// Form and Input Types
// ============================================================================

/**
 * Form validation state
 */
export type ValidationState = 'valid' | 'invalid' | 'pending';

/**
 * Form field configuration
 */
export interface FormFieldConfig {
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Form data representation
 */
export type FormDataValue = string | number | boolean | string[] | undefined;

/**
 * Generic form data type
 */
export type FormDataRecord<T extends Record<string, FormDataValue> = Record<string, FormDataValue>> = {
  [K in keyof T]: T[K];
};

// ============================================================================
// Storage Types
// ============================================================================

/**
 * Storage item with TTL support
 */
export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  readonly length: number;
}

/**
 * Storage configuration options
 */
export interface StorageOptions {
  namespace?: string;
  ttl?: number;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
}

// ============================================================================
// Focus and Accessibility Types
// ============================================================================

/**
 * Focus management strategy
 */
export type FocusStrategy = 'first' | 'last' | 'trap' | 'restore';

/**
 * Focusable element selector
 */
export type FocusableSelector =
  | 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  | string;

/**
 * ARIA attribute types
 */
export interface ARIAAttributes {
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-selected'?: boolean;
  'aria-disabled'?: boolean;
  'aria-pressed'?: boolean;
  'aria-busy'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-relevant'?: string;
  'aria-dropeffect'?: string;
  'aria-dragged'?: boolean;
  'aria-grabbed'?: boolean;
  'aria-activedescendant'?: string;
  'aria-controls'?: string;
  'aria-flowto'?: string;
  'aria-owns'?: string;
  'aria-posinset'?: number;
  'aria-setsize'?: number;
  'aria-level'?: number;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
}

// ============================================================================
// Device and Browser Detection Types
// ============================================================================

/**
 * Device type classification
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Browser information
 */
export interface BrowserInfo {
  name: string;
  version: string;
  os: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Feature detection result
 */
export interface FeatureDetection {
  touch: boolean;
  webGL: boolean;
  webWorker: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  serviceWorker: boolean;
  pushNotifications: boolean;
  geolocation: boolean;
  camera: boolean;
  microphone: boolean;
}

/**
 * Screen orientation
 */
export type ScreenOrientation = 'portrait' | 'landscape';

/**
 * Viewport breakpoint configuration
 */
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

/**
 * Media query result
 */
export interface MediaQueryResult {
  matches: boolean;
  media: string;
  addListener: (listener: (ev: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (ev: MediaQueryListEvent) => void) => void;
  onchange: ((ev: MediaQueryListEvent) => void) | null;
}