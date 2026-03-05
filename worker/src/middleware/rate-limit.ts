/**
 * Rate Limiting Middleware
 * IP-based rate limiting for confession submissions
 * Configurable window: 3 submissions per hour per IP
 */

import { ApiError } from './error-handler';

interface RateLimitConfig {
  maxRequests: number;      // Maximum requests allowed
  windowMinutes: number;    // Time window in minutes
}

interface RateLimitEntry {
  count: number;
  firstRequest: number;     // Timestamp of first request in window
}

// In-memory store for rate limiting (resets on Worker restart)
// For production with multiple Worker instances, consider using D1 or Cache API
const rateLimitStore = new Map<string, RateLimitEntry>();

// Default config: 3 submissions per hour
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 3,
  windowMinutes: 60,
};

/**
 * Check if a request should be rate limited
 * @param identifier - IP hash or other unique identifier
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining info
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; retryAfter?: number } {
  const now = Date.now();
  const windowMs = config.windowMinutes * 60 * 1000;
  
  const entry = rateLimitStore.get(identifier);
  
  if (!entry) {
    // First request from this identifier
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
    });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }
  
  // Check if window has expired
  if (now - entry.firstRequest > windowMs) {
    // Reset window
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
    });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }
  
  // Within active window
  if (entry.count >= config.maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.firstRequest + windowMs - now) / 1000 / 60);
    return { allowed: false, remaining: 0, retryAfter };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);
  
  return { allowed: true, remaining: config.maxRequests - entry.count };
}

/**
 * Middleware to enforce rate limiting on a request
 * @param ipHash - Hashed IP address
 * @param customConfig - Optional custom rate limit config
 * @throws ApiError if rate limit is exceeded
 */
export function requireRateLimit(
  ipHash: string | null,
  customConfig?: RateLimitConfig
): void {
  if (!ipHash) {
    // If we can't identify the user, we can't rate limit
    // But we should log this for monitoring
    console.warn('Rate limiting skipped: no IP hash available');
    return;
  }
  
  const result = checkRateLimit(ipHash, customConfig);
  
  if (!result.allowed) {
    throw new ApiError(
      `Rate limit exceeded. Please try again in ${result.retryAfter} minute(s).`,
      429,
      { retryAfter: result.retryAfter }
    );
  }
}

/**
 * Get rate limit status for an identifier
 * Useful for showing remaining submissions to the user
 */
export function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { remaining: number; resetAt: Date } {
  const now = Date.now();
  const windowMs = config.windowMinutes * 60 * 1000;
  
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || (now - entry.firstRequest > windowMs)) {
    // No active window or window expired
    return {
      remaining: config.maxRequests,
      resetAt: new Date(now + windowMs),
    };
  }
  
  return {
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: new Date(entry.firstRequest + windowMs),
  };
}

// Extend ApiError to support additional data
declare module './error-handler' {
  interface ApiError {
    data?: Record<string, unknown>;
  }
}
