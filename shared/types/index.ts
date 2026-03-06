// ============================================
// SHARED TYPES - Anonymous Threads Confession
// Used by both Frontend and Worker
// ============================================

// Confession status
export type ConfessionStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'posted';

// Main confession interface
export interface Confession {
  id: number;
  content: string;
  status: ConfessionStatus;
  created_at: string;
  updated_at: string;
  posted_at?: string;
  posted_by?: string;
  rejection_reason?: string;
  // Optional moderation metadata for pending items
  moderationFlags?: string[];
  moderationSummary?: string;
}

// For creating a new confession (request)
export interface CreateConfessionRequest {
  content: string;
  turnstileToken: string;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Confession submission response
export interface ConfessionSubmitResponse {
  // Present when the confession is stored in the DB (pending / needs review)
  id?: number;
  status: ConfessionStatus;
  message: string;
  // Number of posts in the submitted thread (for multi-part confessions)
  threadCount?: number;
  // True when server-side filters flagged the confession for manual review
  needsReview?: boolean;
  // True when the confession was auto-posted directly to Threads
  autoPosted?: boolean;
  // Threads permalink when auto-posted
  permalink?: string;
  // Optional machine-readable moderation flags for why review is needed
  moderationFlags?: string[];
  // Human-readable explanation for moderation / review
  moderationReason?: string;
}

// Pending confessions list response
export interface PendingConfessionsResponse {
  confessions: Confession[];
  total: number;
  hasMore: boolean;
}

// Moderation action request
export interface ModerationActionRequest {
  notes?: string;
}

// Moderation action response
export interface ModerationActionResponse {
  id: number;
  status: ConfessionStatus;
  action: 'approved' | 'rejected';
  timestamp: string;
  // Auto-post to Threads fields
  posted?: boolean;
  postId?: string;
  permalink?: string;
  postError?: string;
  threadCount?: number; // Number of posts in the thread (if content was long)
  // Reason provided when a confession is rejected (auto-generated or admin-supplied)
  rejectionReason?: string;
}

// Admin stats response
export interface AdminStatsResponse {
  pending: number;
  approved: number;
  rejected: number;
  posted: number;
  total: number;
}

// Content validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Rate limit info
export interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  resetAt: string;
  retryAfter?: number;
}
