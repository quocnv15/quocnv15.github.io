/**
 * Centralized Type System
 *
 * This is the main entry point for all type definitions in the Jekyll TypeScript frontend.
 * All types should be imported from this file to ensure consistency and avoid duplication.
 *
 * @example
 * ```typescript
 * // Import specific types
 * import type { ThemeMode, SiteConfig, NavigationItem } from '@/core/types';
 *
 * // Import all types (not recommended for large files)
 * import type * as Types from '@/core/types';
 * ```
 */

// ============================================================================
// Core Type Categories
// ============================================================================

// DOM and browser-related types
export * from './dom.types';

// Feature-specific types
export * from './feature.types';

// Content and data types
export * from './content.types';

// ============================================================================
// Common Utility Types
// ============================================================================

/**
 * Deep partial type - makes all nested properties optional
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Required fields type - makes specific fields required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Optional fields type - makes specific fields optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Value of type T or array of T
 */
export type MaybeArray<T> = T | T[];

/**
 * String or number type
 */
export type StringOrNumber = string | number;

/**
 * JSON serializable value
 */
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

/**
 * JSON object
 */
export interface JSONObject {
  [key: string]: JSONValue;
}

/**
 * JSON array
 */
export interface JSONArray extends Array<JSONValue> {}

/**
 * Constructor type
 */
export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Abstract constructor type
 */
export type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;

/**
 * Function type with parameters and return type
 */
export type Func<T extends any[] = any[], R = void> = (...args: T) => R;

/**
 * Async function type
 */
export type AsyncFunc<T extends any[] = any[], R = void> = (...args: T) => Promise<R>;

/**
 * Event emitter interface
 */
export interface EventEmitter {
  on(event: string | symbol, listener: (...args: any[]) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;
  off(event: string | symbol, listener: (...args: any[]) => void): this;
  emit(event: string | symbol, ...args: any[]): boolean;
}

/**
 * Disposable interface for cleanup
 */
export interface Disposable {
  dispose(): void;
}

/**
 * Async disposable interface
 */
export interface AsyncDisposable {
  dispose(): Promise<void>;
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * Loading state type
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * UI state type
 */
export type UIState = 'loading' | 'ready' | 'error' | 'offline';

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * State mutation type
 */
export type StateMutation<T, P extends any[] = any[]> = (state: T, ...payload: P) => T | void;

/**
 * State getter type
 */
export type StateGetter<T, R = T> = (state: T) => R;

/**
 * State action type
 */
export type StateAction<P extends any[] = any[]> = (...payload: P) => void;

// ============================================================================
// Performance and Monitoring Types
// ============================================================================

/**
 * Performance marker
 */
export interface PerformanceMarker {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

/**
 * Error information for logging
 */
export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
  context?: Record<string, any>;
}

/**
 * Log level types
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Log entry structure
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: ErrorInfo;
}

/**
 * Metrics collection
 */
export interface Metrics {
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histograms: Record<string, number[]>;
  timers: Record<string, number>;
}

// ============================================================================
// Configuration and Settings Types
// ============================================================================

/**
 * Base configuration interface
 */
export interface BaseConfig {
  environment: Environment;
  debug: boolean;
  version: string;
  buildTime: Date;
}

/**
 * Environment type
 */
export type Environment = 'development' | 'production' | 'test';

/**
 * Feature toggle configuration
 */
export interface FeatureToggle {
  enabled: boolean;
  rolloutPercentage?: number;
  conditions?: FeatureCondition[];
}

/**
 * Feature condition
 */
export interface FeatureCondition {
  type: 'user_agent' | 'url' | 'time' | 'custom';
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex';
  value: string | number | boolean;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items
  strategy: 'lru' | 'fifo' | 'lfu';
}

// ============================================================================
// HTTP and API Types
// ============================================================================

/**
 * HTTP methods
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * HTTP status codes
 */
export type HTTPStatusCode =
  | 200 | 201 | 202 | 204 // Success
  | 400 | 401 | 403 | 404 | 422 | 429 // Client errors
  | 500 | 502 | 503 | 504; // Server errors

/**
 * HTTP headers
 */
export interface HTTPHeaders {
  [key: string]: string;
}

/**
 * HTTP request configuration
 */
export interface HTTPRequest {
  url: string;
  method: HTTPMethod;
  headers?: HTTPHeaders;
  body?: string | FormData | URLSearchParams;
  timeout?: number;
  cache?: RequestCache;
  credentials?: RequestCredentials;
}

/**
 * HTTP response
 */
export interface HTTPResponse<T = any> {
  status: HTTPStatusCode;
  statusText: string;
  headers: HTTPHeaders;
  data: T;
  ok: boolean;
  redirected: boolean;
  url: string;
}

/**
 * API error response
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
}

// ============================================================================
// Validation and Schema Types
// ============================================================================

/**
 * Validation rule
 */
export interface ValidationRule<T = any> {
  validate: (value: T) => boolean | string;
  message?: string;
}

/**
 * Validation schema
 */
export interface ValidationSchema<T = any> {
  [key: string]: ValidationRule<T> | ValidationSchema<T>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  value: any;
  rule: string;
}

/**
 * Schema definition
 */
export interface Schema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'null';
  required?: string[];
  properties?: Record<string, Schema>;
  items?: Schema;
  enum?: any[];
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// ============================================================================
// Re-exports for backward compatibility
// ============================================================================

// Re-export commonly used types from legacy files for migration
export type { SiteConfig, ThemeMode, NavigationItem, TocItem, CodeBlock, HeadingExtractionOptions } from './feature.types';
export type { UnifiedPost } from './content.types';

// Legacy exports that will be deprecated
export { PostTypeGuards } from './content.types';

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Type guard utilities
 */
export const TypeGuards = {
  /**
   * Check if value is defined (not null or undefined)
   */
  isDefined: <T>(value: T | undefined | null): value is T => {
    return value !== undefined && value !== null;
  },

  /**
   * Check if value is a string
   */
  isString: (value: any): value is string => {
    return typeof value === 'string';
  },

  /**
   * Check if value is a number
   */
  isNumber: (value: any): value is number => {
    return typeof value === 'number' && !isNaN(value);
  },

  /**
   * Check if value is a boolean
   */
  isBoolean: (value: any): value is boolean => {
    return typeof value === 'boolean';
  },

  /**
   * Check if value is an object
   */
  isObject: (value: any): value is object => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  },

  /**
   * Check if value is an array
   */
  isArray: <T = any>(value: any): value is T[] => {
    return Array.isArray(value);
  },

  /**
   * Check if value is a function
   */
  isFunction: (value: any): value is Function => {
    return typeof value === 'function';
  },

  /**
   * Check if value is a Date
   */
  isDate: (value: any): value is Date => {
    return value instanceof Date && !isNaN(value.getTime());
  },

  /**
   * Check if value is a valid URL
   */
  isURL: (value: any): value is URL => {
    return value instanceof URL;
  },

  /**
   * Check if value is an Element
   */
  isElement: (value: any): value is Element => {
    return value instanceof Element;
  },

  /**
   * Check if value is an Event
   */
  isEvent: (value: any): value is Event => {
    return value instanceof Event;
  }
} as const;

/**
 * Type assertion utilities
 */
export const TypeAssertions = {
  /**
   * Assert that value is defined
   */
  assertDefined: <T>(value: T | undefined | null, message?: string): asserts value is T => {
    if (value === undefined || value === null) {
      throw new Error(message || `Expected value to be defined, got ${value}`);
    }
  },

  /**
   * Assert that value is a string
   */
  assertString: (value: any, message?: string): asserts value is string => {
    if (typeof value !== 'string') {
      throw new Error(message || `Expected string, got ${typeof value}`);
    }
  },

  /**
   * Assert that value is a number
   */
  assertNumber: (value: any, message?: string): asserts value is number => {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error(message || `Expected number, got ${typeof value}`);
    }
  },

  /**
   * Assert that value is an object
   */
  assertObject: (value: any, message?: string): asserts value is object => {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(message || `Expected object, got ${typeof value}`);
    }
  }
} as const;

/**
 * Type conversion utilities
 */
export const TypeConversions = {
  /**
   * Convert value to string safely
   */
  toString: (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    return String(value);
  },

  /**
   * Convert value to number safely
   */
  toNumber: (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  },

  /**
   * Convert value to boolean safely
   */
  toBoolean: (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() !== 'false';
    if (typeof value === 'number') return value !== 0;
    return Boolean(value);
  }
} as const;

// ============================================================================
// Default Exports
// ============================================================================

/**
 * Default export with commonly used types
 */
export default {
  // DOM types
  ...require('./dom.types'),

  // Feature types
  ...require('./feature.types'),

  // Content types
  ...require('./content.types'),

  // Utilities
  TypeGuards,
  TypeAssertions,
  TypeConversions
};