import { ApiError } from './error-handler';
import { Env } from '../index';

/**
 * Simple admin authentication middleware
 * Uses API key from request headers for MVP
 * In production, consider JWT or session-based auth
 */

/**
 * Verify admin API key from request headers
 * Expected header: X-API-Key
 */
export function verifyAdminAuth(request: Request, env: Env): void {
  const apiKey = request.headers.get('X-API-Key');
  
  if (!apiKey) {
    throw new ApiError('Unauthorized: API key required', 401);
  }
  
  if (apiKey !== env.ADMIN_API_KEY) {
    throw new ApiError('Unauthorized: Invalid API key', 401);
  }
}

/**
 * Check if request has valid admin auth without throwing
 * Returns true if authenticated, false otherwise
 */
export function isAdminAuthenticated(request: Request, env: Env): boolean {
  const apiKey = request.headers.get('X-API-Key');
  return apiKey === env.ADMIN_API_KEY;
}
