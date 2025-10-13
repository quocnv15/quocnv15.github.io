/**
 * Unified Post Data Types
 *
 * Comprehensive type definitions for all content types in the Jekyll blog
 * including blog posts, notes, projects, and curated content.
 */

// ============================================================================
// Core Post Types
// ============================================================================

export interface BasePost {
  id: string;
  title: string;
  date: Date;
  url: string;
  content: string;
  excerpt?: string;
  author: string;
  layout: 'post' | 'note' | 'project';
  tags: string[];
  categories?: string[];
  readingTime?: number;
  wordCount?: number;
  lastModified?: Date;
}

export interface BlogPost extends BasePost {
  layout: 'post';
  categories: string[];
  series?: string;
  featured?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  relatedPosts?: string[];
  codeExamples?: boolean;
  downloads?: Array<{
    name: string;
    url: string;
    type: 'source' | 'pdf' | 'demo';
  }>;
}

export interface Note extends BasePost {
  layout: 'note';
  noteType: NoteType;
  sourceUrl?: string;
  sourceType?: 'video' | 'article' | 'book' | 'podcast' | 'course';
  sourceMetadata?: SourceMetadata;
  keyTakeaways?: string[];
  actionItems?: string[];
  rating?: number; // 1-5 stars
  completionStatus?: 'not-started' | 'in-progress' | 'completed';
  personalNotes?: string;
}

export interface Project extends BasePost {
  layout: 'project';
  projectType: 'mobile-app' | 'web-app' | 'sdk' | 'library' | 'tool';
  status: 'planning' | 'in-development' | 'completed' | 'archived';
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  screenshots?: string[];
  features?: string[];
  changelog?: Array<{
    version: string;
    date: Date;
    changes: string[];
  }>;
}

// ============================================================================
// Note Types
// ============================================================================

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

export interface SourceMetadata {
  // Video metadata
  duration?: string;
  platform?: 'youtube' | 'vimeo' | 'coursera' | 'udemy';
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
  platform?: string;
  instructor?: string;
  duration?: string;
  modules?: number;
}

// ============================================================================
// Unified Content Type
// ============================================================================

export type UnifiedPost = BlogPost | Note | Project;

export function isBlogPost(post: UnifiedPost): post is BlogPost {
  return post.layout === 'post';
}

export function isNote(post: UnifiedPost): post is Note {
  return post.layout === 'note';
}

export function isProject(post: UnifiedPost): post is Project {
  return post.layout === 'project';
}

// ============================================================================
// Collections and Filters
// ============================================================================

export interface PostCollection {
  posts: UnifiedPost[];
  totalCount: number;
  filters: ActiveFilters;
  pagination?: PaginationInfo;
}

export interface ActiveFilters {
  type?: ('post' | 'note' | 'project')[];
  tags?: string[];
  categories?: string[];
  noteTypes?: NoteType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  featured?: boolean;
  difficulty?: BlogPost['difficulty'];
  status?: Project['status'];
  completionStatus?: Note['completionStatus'];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================================================
// Search and Indexing
// ============================================================================

export interface SearchIndex {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    categories?: string[];
    noteType?: NoteType;
    url: string;
    date: Date;
    relevanceScore?: number;
  }>;
  metadata: {
    lastUpdated: Date;
    totalPosts: number;
    version: string;
  };
}

export interface SearchResult {
  posts: UnifiedPost[];
  totalCount: number;
  query: string;
  searchTime: number;
  suggestions?: string[];
}

// ============================================================================
// Content Processing
// ============================================================================

export interface ContentProcessor {
  extractExcerpt(content: string, maxLength?: number): string;
  calculateReadingTime(content: string): number;
  calculateWordCount(content: string): number;
  extractHeadings(content: string): Heading[];
  extractLinks(content: string): Link[];
  extractImages(content: string): Image[];
  extractCodeBlocks(content: string): CodeBlock[];
}

export interface Heading {
  level: number;
  text: string;
  id: string;
  children?: Heading[];
}

export interface Link {
  url: string;
  text: string;
  title?: string;
  external: boolean;
}

export interface Image {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

// ============================================================================
// Analytics and Metrics
// ============================================================================

export interface PostMetrics {
  id: string;
  views: number;
  readTime: number;
  bounceRate: number;
  engagementScore: number;
  shareCount: number;
  commentCount: number;
  lastAccessed: Date;
  popularTags: Array<{
    tag: string;
    count: number;
  }>;
}

export interface ContentAnalytics {
  totalPosts: number;
  totalViews: number;
  averageReadTime: number;
  mostPopular: UnifiedPost[];
  recentActivity: Array<{
    postId: string;
    action: 'view' | 'share' | 'comment';
    timestamp: Date;
  }>;
  tagPerformance: Array<{
    tag: string;
    count: number;
    views: number;
  }>;
}

// ============================================================================
// Site Configuration
// ============================================================================

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  url: string;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  features: {
    search: boolean;
    darkMode: boolean;
    analytics: boolean;
    comments: boolean;
    sharing: boolean;
    toc: boolean;
    copyCode: boolean;
  };
  social: {
    email?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  content: {
    postsPerPage: number;
    excerptLength: number;
    dateFormat: string;
    defaultTags: string[];
  };
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
  filters: ActiveFilters;
}

// ============================================================================
// Event Types
// ============================================================================

export interface PostEvent {
  type: 'view' | 'share' | 'bookmark' | 'comment' | 'like';
  postId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SyncEvent {
  type: 'created' | 'updated' | 'deleted';
  postId: string;
  timestamp: Date;
  changes?: Partial<UnifiedPost>;
}