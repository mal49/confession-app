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
  id: number;
  status: ConfessionStatus;
  message: string;
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
