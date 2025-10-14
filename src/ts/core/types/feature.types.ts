/**
 * Feature-specific type definitions
 *
 * This file contains all types related to application features, configuration, and business logic.
 */

// ============================================================================
// Theme System Types
// ============================================================================

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme configuration
 */
export interface ThemeConfig {
  mode: ThemeMode;
  respectSystemPreference: boolean;
  transitionDuration: number;
  storageKey: string;
}

/**
 * Theme colors configuration
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

/**
 * Theme customization options
 */
export interface ThemeCustomization {
  colors?: Partial<ThemeColors>;
  fonts?: {
    primary: string;
    secondary: string;
    monospace: string;
  };
  sizes?: {
    fontSize: Record<string, string>;
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
  };
}

// ============================================================================
// Navigation System Types
// ============================================================================

/**
 * Navigation item structure
 */
export interface NavigationItem {
  id: string;
  text: string;
  url: string;
  active?: boolean;
  disabled?: boolean;
  icon?: string;
  badge?: string | number;
  children?: NavigationItem[];
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
}

/**
 * Navigation configuration
 */
export interface NavigationConfig {
  container: string | HTMLElement;
  items: NavigationItem[];
  mobileBreakpoint: number;
  animationDuration: number;
  closeOnOutsideClick: boolean;
  closeOnEscape: boolean;
  trapFocus: boolean;
}

/**
 * Mobile navigation state
 */
export type MobileNavigationState = 'closed' | 'opening' | 'open' | 'closing';

/**
 * Scroll spy configuration
 */
export interface ScrollSpyConfig {
  container: string | HTMLElement;
  targets: string[];
  offset: number;
  activeClass: string;
  smoothScroll: boolean;
  duration: number;
}

/**
 * Scroll spy target
 */
export interface ScrollSpyTarget {
  id: string;
  element: HTMLElement;
  offset: number;
  active: boolean;
}

// ============================================================================
// Copy Code System Types
// ============================================================================

/**
 * Copy code configuration
 */
export interface CopyCodeConfig {
  container: string | HTMLElement;
  button: {
    text: string;
    copiedText: string;
    timeout: number;
    className: string;
    activeClass: string;
  };
  target: 'pre' | 'code' | 'both';
  ignoreLanguages: string[];
  includeAttributes: string[];
}

/**
 * Code block metadata
 */
export interface CodeBlock {
  element: HTMLElement;
  language: string;
  filename?: string;
  lines: number;
  content: string;
  button?: HTMLElement;
}

/**
 * Copy code result
 */
export interface CopyResult {
  success: boolean;
  content: string;
  timestamp: number;
  error?: string;
}

// ============================================================================
// Table of Contents (TOC) Types
// ============================================================================

/**
 * TOC item structure
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
  children: TocItem[];
  active: boolean;
}

/**
 * TOC configuration
 */
export interface TocConfig {
  container: string | HTMLElement;
  source: string | HTMLElement;
  headings: string[];
  minLevel: number;
  maxLevel: number;
  className: string;
  itemClassName: string;
  activeClass: string;
  smoothScroll: boolean;
  offset: number;
  updateOnScroll: boolean;
}

/**
 * TOC generation result
 */
export interface TocResult {
  items: TocItem[];
  container: HTMLElement;
  totalItems: number;
  maxDepth: number;
}

/**
 * Heading extraction options
 */
export interface HeadingExtractionOptions {
  includeIds: boolean;
  generateIds: boolean;
  idPrefix: string;
  sanitizeText: boolean;
  maxLevel?: number;
  minLevel?: number;
}

// ============================================================================
// Search System Types
// ============================================================================

/**
 * Search record structure
 */
export interface SearchRecord {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  url: string;
  tags: string[];
  categories?: string[];
  type: 'post' | 'note' | 'project';
  date: Date;
  relevanceScore?: number;
}

/**
 * Search query configuration
 */
export interface SearchQuery {
  query: string;
  limit?: number;
  offset?: number;
  filters?: SearchFilters;
  sort?: SearchSortOption;
}

/**
 * Search filters
 */
export interface SearchFilters {
  type?: ('post' | 'note' | 'project')[];
  tags?: string[];
  categories?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Search sort options
 */
export type SearchSortOption = 'relevance' | 'date' | 'title' | 'updated';

/**
 * Search result
 */
export interface SearchResult {
  record: SearchRecord;
  score: number;
  matches: SearchMatch[];
}

/**
 * Search match highlighting
 */
export interface SearchMatch {
  field: string;
  value: string;
  indices: Array<[number, number]>;
}

/**
 * Search index configuration
 */
export interface SearchConfig {
  indexName: string;
  fields: string[];
  storeFields: string[];
  searchOptions: {
    fuzzy?: number;
    prefix?: boolean;
    threshold?: number;
    tokenize?: boolean;
  };
  excludePatterns: string[];
}

// ============================================================================
// Share System Types
// ============================================================================

/**
 * Share platform configuration
 */
export interface SharePlatform {
  name: string;
  baseUrl: string;
  parameters: Record<string, string>;
  popup?: {
    width: number;
    height: number;
  };
}

/**
 * Share configuration
 */
export interface ShareConfig {
  title: string;
  url: string;
  description?: string;
  image?: string;
  via?: string;
  hashtags?: string[];
  platforms: SharePlatform[];
}

/**
 * Share result
 */
export interface ShareResult {
  platform: string;
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Share analytics data
 */
export interface ShareAnalytics {
  platform: string;
  url: string;
  timestamp: Date;
  userAgent: string;
  referrer?: string;
}

// ============================================================================
// Analytics System Types
// ============================================================================

/**
 * Analytics event data
 */
export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: Date;
  url: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  provider: 'google' | 'plausible' | 'custom';
  trackingId?: string;
  apiEndpoint?: string;
  autoTrack: {
    pageViews: boolean;
    events: boolean;
    performance: boolean;
    errors: boolean;
  };
  privacy: {
    anonymizeIp: boolean;
    respectDoNotTrack: boolean;
    cookieConsent: boolean;
  };
  customDimensions?: Record<string, string>;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  bundleSize: number;
  initializationTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;
}

// ============================================================================
// Comment System Types
// ============================================================================

/**
 * Comment structure
 */
export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  author: {
    name: string;
    email?: string;
    website?: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  replies: Comment[];
  metadata?: {
    ip?: string;
    userAgent?: string;
    likes?: number;
    reports?: number;
  };
}

/**
 * Comment configuration
 */
export interface CommentConfig {
  provider: 'disqus' | 'utterances' | 'giscus' | 'custom';
  container: string | HTMLElement;
  options: Record<string, any>;
  moderation: {
    requireApproval: boolean;
    autoApprove: boolean;
    spamFilter: boolean;
  };
  features: {
    threading: boolean;
    reactions: boolean;
    editing: boolean;
    notifications: boolean;
  };
}

// ============================================================================
// Notification System Types
// ============================================================================

/**
 * Notification type
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * Notification configuration
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  icon?: string;
  closable?: boolean;
  timestamp: Date;
}

/**
 * Notification action
 */
export interface NotificationAction {
  label: string;
  action: () => void;
  primary?: boolean;
}

/**
 * Notification system configuration
 */
export interface NotificationConfig {
  container: string | HTMLElement;
  maxNotifications: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  animationDuration: number;
  defaultDuration: number;
}

// ============================================================================
// Feature Flag Types
// ============================================================================

/**
 * Feature flag configuration
 */
export interface FeatureFlags {
  searchEnabled: boolean;
  tocEnabled: boolean;
  copyCodeEnabled: boolean;
  shareButtonsEnabled: boolean;
  analyticsEnabled: boolean;
  commentsEnabled: boolean;
  notificationsEnabled: boolean;
  themeCustomizationEnabled: boolean;
  keyboardShortcutsEnabled: boolean;
}

/**
 * Feature flag with metadata
 */
export interface FeatureFlag {
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  conditions?: FeatureFlagCondition[];
  metadata?: Record<string, any>;
}

/**
 * Feature flag condition
 */
export interface FeatureFlagCondition {
  type: 'user_agent' | 'url' | 'time' | 'custom';
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex';
  value: string | number | boolean;
}

// ============================================================================
// Plugin System Types
// ============================================================================

/**
 * Plugin interface
 */
export interface Plugin {
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
  init: (context: PluginContext) => Promise<void> | void;
  destroy?: () => Promise<void> | void;
  config?: PluginConfig;
}

/**
 * Plugin context
 */
export interface PluginContext {
  config: SiteConfig;
  utils: PluginUtils;
  events: PluginEventEmitter;
  storage: PluginStorage;
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
  [key: string]: any;
}

/**
 * Plugin utilities
 */
export interface PluginUtils {
  dom: any; // Will be populated dynamically
  storage: any; // Will be populated dynamically
  events: any; // Will be populated dynamically
}

/**
 * Plugin event emitter
 */
export interface PluginEventEmitter {
  on: (event: string, handler: Function) => void;
  off: (event: string, handler: Function) => void;
  emit: (event: string, data?: any) => void;
}

/**
 * Plugin storage interface
 */
export interface PluginStorage {
  get: <T>(key: string) => T | undefined;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
}

// ============================================================================
// Site Configuration Types
// ============================================================================

/**
 * Complete site configuration
 */
export interface SiteConfig {
  theme: ThemeMode;
  environment: Environment;
  isPost: boolean;
  isHomePage: boolean;
  language: string;
  baseUrl: string;
  title: string;
  description: string;
  author: string;
  features: FeatureFlags;
  navigation: {
    items: NavigationItem[];
    mobile: boolean;
    search: boolean;
  };
  social: {
    email?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  performance: {
    bundleSize: number;
    buildTime: number;
  };
  seo: {
    titleTemplate: string;
    description: string;
    image: string;
    keywords: string[];
  };
}

/**
 * Environment type
 */
export type Environment = 'development' | 'production' | 'test';

// ============================================================================
// Legacy Application Configuration Types (for migration)
// ============================================================================

/**
 * Application configuration interface (legacy, for migration purposes)
 * @deprecated Use SiteConfig instead
 */
export interface AppConfig {
  theme: 'light' | 'dark' | 'system';
  searchEnabled: boolean;
  tocEnabled: boolean;
  copyCodeEnabled: boolean;
  shareButtonsEnabled: boolean;
  isPost: boolean;
  isHomePage: boolean;
  environment: 'development' | 'production';
}