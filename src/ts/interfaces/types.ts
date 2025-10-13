/**
 * Core type definitions for Jekyll blog TypeScript frontend
 */

// Theme Management
export type ThemeMode = 'light' | 'dark' | 'system';

// UI State Management
export type UIState = 'loading' | 'ready' | 'error';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Post-related Types
export interface PostMeta {
  title: string;
  url: string;
  date: string;
  tags: string[];
  excerpt?: string;
  readTime?: number;
  category?: string;
  author?: string;
}

// Table of Contents Types
export interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

// Search-related Types
export interface SearchRecord {
  id: string;
  title: string;
  content: string;
  url: string;
  tags: string[];
  category: string;
  date: string;
}

export interface SearchResult {
  record: SearchRecord;
  score: number;
  matches: string[];
}

// Configuration Types
export interface SiteConfig {
  theme: ThemeMode;
  searchEnabled: boolean;
  tocEnabled: boolean;
  copyCodeEnabled: boolean;
  shareButtonsEnabled: boolean;
  isPost: boolean;
  isHomePage: boolean;
  environment: 'development' | 'production';
}

// Event Handler Types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Performance Monitoring Types
export interface PerformanceMetrics {
  bundleSize: number;
  initializationTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
}

// Error Handling Types
export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

// Storage Types
export interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

// Navigation Types
export interface NavigationItem {
  text: string;
  url: string;
  active?: boolean;
  children?: NavigationItem[];
}

// Share Types
export interface ShareConfig {
  title: string;
  url: string;
  description?: string;
  image?: string;
}

export type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'email' | 'reddit';

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;