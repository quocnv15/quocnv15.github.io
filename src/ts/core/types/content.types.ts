/**
 * Content-related type definitions
 *
 * This file contains all types related to content management, posts, and data structures.
 */

// ============================================================================
// Base Content Types
// ============================================================================

/**
 * Base post interface with common properties
 */
export interface BasePost {
  id: string;
  title: string;
  date: Date;
  url: string;
  content: string;
  excerpt?: string;
  author: string;
  layout: PostLayout;
  tags: string[];
  categories?: string[];
  readingTime?: number;
  wordCount?: number;
  lastModified?: Date;
  published: boolean;
}

/**
 * Post layout types
 */
export type PostLayout = 'post' | 'note' | 'project';

/**
 * Blog post specific properties
 */
export interface BlogPost extends BasePost {
  layout: 'post';
  categories: string[];
  series?: string;
  featured?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  relatedPosts?: string[];
  codeExamples?: boolean;
  downloads?: DownloadItem[];
}

/**
 * Note specific properties
 */
export interface Note extends BasePost {
  layout: 'note';
  noteType: NoteType;
  sourceUrl?: string;
  sourceType?: SourceType;
  sourceMetadata?: SourceMetadata;
  keyTakeaways?: string[];
  actionItems?: string[];
  rating?: number; // 1-5 stars
  completionStatus?: CompletionStatus;
  personalNotes?: string;
}

/**
 * Project specific properties
 */
export interface Project extends BasePost {
  layout: 'project';
  projectType: ProjectType;
  status: ProjectStatus;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  screenshots?: string[];
  features?: string[];
  changelog?: ChangelogEntry[];
}

// ============================================================================
// Note Types
// ============================================================================

/**
 * Note type classification
 */
export type NoteType =
  | 'video-notes'
  | 'article-notes'
  | 'book-notes'
  | 'podcast-notes'
  | 'course-notes'
  | 'case-study'
  | 'insights'
  | 'curation'
  | 'notes';

/**
 * Source type for notes
 */
export type SourceType = 'video' | 'article' | 'book' | 'podcast' | 'course';

/**
 * Source metadata for different content types
 */
export interface SourceMetadata {
  // Video metadata
  duration?: string;
  platform?: VideoPlatform;
  videoId?: string;
  channel?: string;

  // Article metadata
  publication?: string;
  author?: string;
  publishedDate?: Date;

  // Book metadata
  isbn?: string;
  pages?: number;
  publisher?: string;

  // Podcast metadata
  episode?: number;
  season?: number;
  podcastName?: string;

  // Course metadata
  coursePlatform?: string;
  instructor?: string;
  modules?: number;
}

/**
 * Video platform types
 */
export type VideoPlatform = 'youtube' | 'vimeo' | 'coursera' | 'udemy' | 'pluralsight';

/**
 * Completion status for notes
 */
export type CompletionStatus = 'not-started' | 'in-progress' | 'completed';

// ============================================================================
// Project Types
// ============================================================================

/**
 * Project type classification
 */
export type ProjectType =
  | 'mobile-app'
  | 'web-app'
  | 'sdk'
  | 'library'
  | 'tool'
  'framework';

/**
 * Project status
 */
export type ProjectStatus = 'planning' | 'in-development' | 'completed' | 'archived' | 'maintenance';

/**
 * Download item for posts
 */
export interface DownloadItem {
  name: string;
  url: string;
  type: DownloadType;
  size?: string;
  description?: string;
}

/**
 * Download type
 */
export type DownloadType = 'source' | 'pdf' | 'demo' | 'executable' | 'documentation';

/**
 * Changelog entry
 */
export interface ChangelogEntry {
  version: string;
  date: Date;
  changes: string[];
  type: 'feature' | 'fix' | 'improvement' | 'breaking';
}

// ============================================================================
// Unified Content Types
// ============================================================================

/**
 * Unified post type that can be any post layout
 */
export type UnifiedPost = BlogPost | Note | Project;

/**
 * Type guards for unified posts
 */
export const PostTypeGuards = {
  /**
   * Check if post is a blog post
   */
  isBlogPost: (post: UnifiedPost): post is BlogPost => {
    return post.layout === 'post';
  },

  /**
   * Check if post is a note
   */
  isNote: (post: UnifiedPost): post is Note => {
    return post.layout === 'note';
  },

  /**
   * Check if post is a project
   */
  isProject: (post: UnifiedPost): post is Project => {
    return post.layout === 'project';
  }
} as const;

// ============================================================================
// Content Collections
// ============================================================================

/**
 * Post collection with metadata
 */
export interface PostCollection {
  posts: UnifiedPost[];
  totalCount: number;
  filters: ActiveFilters;
  pagination?: PaginationInfo;
  sorting?: SortingInfo;
}

/**
 * Active filters for content
 */
export interface ActiveFilters {
  type?: PostLayout[];
  tags?: string[];
  categories?: string[];
  noteTypes?: NoteType[];
  projectTypes?: ProjectType[];
  projectStatuses?: ProjectStatus[];
  dateRange?: DateRange;
  search?: string;
  featured?: boolean;
  difficulty?: BlogPost['difficulty'];
  completionStatus?: CompletionStatus;
}

/**
 * Date range filter
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Sorting information
 */
export interface SortingInfo {
  field: SortField;
  direction: 'asc' | 'desc';
}

/**
 * Sortable fields
 */
export type SortField = 'date' | 'title' | 'readingTime' | 'wordCount' | 'lastModified';

// ============================================================================
// Content Processing Types
// ============================================================================

/**
 * Content processor interface
 */
export interface ContentProcessor {
  extractExcerpt(content: string, maxLength?: number): string;
  calculateReadingTime(content: string): number;
  calculateWordCount(content: string): number;
  extractHeadings(content: string, options?: HeadingExtractionOptions): Heading[];
  extractLinks(content: string): Link[];
  extractImages(content: string): Image[];
  extractCodeBlocks(content: string): CodeBlock[];
  extractTables(content: string): Table[];
  sanitizeHtml(content: string): string;
  formatContent(content: string, format: ContentFormat): string;
}

/**
 * Content format types
 */
export type ContentFormat = 'html' | 'markdown' | 'text';

/**
 * Heading extraction options
 */
export interface HeadingExtractionOptions {
  includeIds?: boolean;
  generateIds?: boolean;
  idPrefix?: string;
  sanitizeText?: boolean;
  maxLevel?: number;
  minLevel?: number;
}

/**
 * Heading structure
 */
export interface Heading {
  level: number;
  text: string;
  id: string;
  element?: HTMLElement;
  children?: Heading[];
}

/**
 * Link structure
 */
export interface Link {
  url: string;
  text: string;
  title?: string;
  external: boolean;
  nofollow?: boolean;
  sponsored?: boolean;
}

/**
 * Image structure
 */
export interface Image {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  format?: string;
}

/**
 * Code block structure
 */
export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
  lineNumbers?: boolean;
  highlightLines?: number[];
  copyable?: boolean;
}

/**
 * Table structure
 */
export interface Table {
  headers: string[];
  rows: string[][];
  caption?: string;
  sortable?: boolean;
  filterable?: boolean;
}

// ============================================================================
// Search and Indexing Types
// ============================================================================

/**
 * Search index for content
 */
export interface SearchIndex {
  posts: SearchIndexItem[];
  metadata: SearchIndexMetadata;
}

/**
 * Search index item
 */
export interface SearchIndexItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  categories?: string[];
  noteType?: NoteType;
  projectType?: ProjectType;
  url: string;
  date: Date;
  type: PostLayout;
  relevanceScore?: number;
}

/**
 * Search index metadata
 */
export interface SearchIndexMetadata {
  lastUpdated: Date;
  totalPosts: number;
  version: string;
  buildTime: number;
}

/**
 * Search result with pagination
 */
export interface SearchResults {
  posts: UnifiedPost[];
  totalCount: number;
  query: string;
  searchTime: number;
  pagination: PaginationInfo;
  suggestions?: string[];
  facets?: SearchFacets;
}

/**
 * Search facets for filtering
 */
export interface SearchFacets {
  types: Array<{ type: PostLayout; count: number }>;
  tags: Array<{ tag: string; count: number }>;
  categories: Array<{ category: string; count: number }>;
  authors: Array<{ author: string; count: number }>;
}

// ============================================================================
// Analytics and Metrics Types
// ============================================================================

/**
 * Post-specific metrics
 */
export interface PostMetrics {
  id: string;
  views: number;
  readTime: number;
  bounceRate: number;
  engagementScore: number;
  shareCount: number;
  commentCount: number;
  likeCount: number;
  bookmarkCount: number;
  lastAccessed: Date;
  popularTags: Array<{
    tag: string;
    count: number;
  }>;
  readingProgress?: {
    started: number;
    completed: number;
    averageCompletion: number;
  };
}

/**
 * Content analytics summary
 */
export interface ContentAnalytics {
  totalPosts: number;
  totalViews: number;
  totalReads: number;
  averageReadTime: number;
  bounceRate: number;
  mostPopular: UnifiedPost[];
  recentActivity: ContentActivity[];
  tagPerformance: TagPerformance[];
  authorPerformance: AuthorPerformance[];
  typeDistribution: Array<{
    type: PostLayout;
    count: number;
    views: number;
  }>;
}

/**
 * Content activity event
 */
export interface ContentActivity {
  postId: string;
  action: ContentAction;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Content action types
 */
export type ContentAction =
  | 'view'
  | 'read'
  | 'share'
  | 'comment'
  | 'like'
  | 'bookmark'
  | 'download'
  | 'copy'
  | 'search';

/**
 * Tag performance metrics
 */
export interface TagPerformance {
  tag: string;
  count: number;
  views: number;
  averageReadTime: number;
  engagement: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Author performance metrics
 */
export interface AuthorPerformance {
  author: string;
  postCount: number;
  totalViews: number;
  averageReadTime: number;
  engagementScore: number;
}

// ============================================================================
// Content Management Types
// ============================================================================

/**
 * Content validation result
 */
export interface ContentValidation {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  severity: 'warning';
}

/**
 * Validation suggestion
 */
export interface ValidationSuggestion {
  field: string;
  message: string;
  action: string;
  severity: 'info';
}

/**
 * Content publishing workflow
 */
export interface PublishingWorkflow {
  status: PublishingStatus;
  scheduledDate?: Date;
  reviewedBy?: string;
  approvedBy?: string;
  notes?: string;
  checklist: PublishingChecklist;
}

/**
 * Publishing status
 */
export type PublishingStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

/**
 * Publishing checklist
 */
export interface PublishingChecklist {
  contentReviewed: boolean;
  seoOptimized: boolean;
  imagesOptimized: boolean;
  linksChecked: boolean;
  categoriesSet: boolean;
  tagsAdded: boolean;
  excerptWritten: boolean;
  featuredImageSet: boolean;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: ResponseMetadata;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  timestamp: Date;
  requestId: string;
  version: string;
  processingTime: number;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
  filters?: ActiveFilters;
  sorting?: SortingInfo;
}

/**
 * Content sync event
 */
export interface ContentSyncEvent {
  type: SyncEventType;
  postId: string;
  timestamp: Date;
  changes?: Partial<UnifiedPost>;
  metadata?: Record<string, any>;
}

/**
 * Sync event type
 */
export type SyncEventType = 'created' | 'updated' | 'deleted' | 'published' | 'archived';

// ============================================================================
// Content Templates Types
// ============================================================================

/**
 * Content template structure
 */
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  layout: PostLayout;
  frontMatter: Record<string, any>;
  contentTemplate: string;
  variables: TemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Template variable definition
 */
export interface TemplateVariable {
  name: string;
  type: TemplateVariableType;
  description: string;
  required: boolean;
  defaultValue?: any;
  options?: any[];
  validation?: TemplateValidation;
}

/**
 * Template variable type
 */
export type TemplateVariableType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';

/**
 * Template validation rule
 */
export interface TemplateValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean | string;
}