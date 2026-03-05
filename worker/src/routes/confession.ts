import { Env } from '../index';
import { ApiError } from '../middleware/error-handler';
import { addCorsHeaders } from '../middleware/cors';
import { requireTurnstile } from '../middleware/turnstile';
import { requireRateLimit, getRateLimitStatus } from '../middleware/rate-limit';
import { requireCleanContent, sanitizeContent, filterContent, ContentFilterResult } from '../middleware/content-filter';

/**
 * Confession Routes
 * POST /api/confession - Submit a new confession
 * GET /api/confession/pending - Get pending confessions (admin only)
 * POST /api/confession/:id/approve - Approve a confession (admin only)
 * POST /api/confession/:id/reject - Reject a confession (admin only)
 */

export async function confessionRoutes(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Submit new confession
  if (path === '/api/confession' && method === 'POST') {
    return await submitConfession(request, env);
  }

  // Get pending confessions
  if (path === '/api/confession/pending' && method === 'GET') {
    return await getPendingConfessions(request, env);
  }

  // Approve confession
  const approveMatch = path.match(/\/api\/confession\/(\d+)\/approve/);
  if (approveMatch && method === 'POST') {
    const id = parseInt(approveMatch[1], 10);
    return await approveConfession(request, env, id);
  }

  // Reject confession
  const rejectMatch = path.match(/\/api\/confession\/(\d+)\/reject/);
  if (rejectMatch && method === 'POST') {
    const id = parseInt(rejectMatch[1], 10);
    return await rejectConfession(request, env, id);
  }

  throw new ApiError('Not Found', 404);
}

async function submitConfession(request: Request, env: Env): Promise<Response> {
  // Parse request body
  let body: { content?: string; category?: string; turnstileToken?: string };
  try {
    body = await request.json();
  } catch {
    throw new ApiError('Invalid JSON in request body', 400);
  }

  const { content, category, turnstileToken } = body;

  // Validate required fields
  if (!content || typeof content !== 'string') {
    throw new ApiError('Content is required', 400);
  }

  if (!category || typeof category !== 'string') {
    throw new ApiError('Category is required', 400);
  }

  // Validate content length (500-800 characters)
  if (content.length < 500 || content.length > 800) {
    throw new ApiError('Content must be between 500 and 800 characters', 400);
  }

  // Verify Turnstile token
  const clientIP = request.headers.get('CF-Connecting-IP') || undefined;
  await requireTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, clientIP);

  // Hash IP for rate limiting and storage
  const ipHash = clientIP 
    ? await hashIP(clientIP) 
    : null;

  // Check rate limiting (3 per hour)
  requireRateLimit(ipHash, { maxRequests: 3, windowMinutes: 60 });
  
  // Sanitize content
  const sanitizedContent = sanitizeContent(content);
  
  // Filter content
  let filterResult: ContentFilterResult;
  try {
    filterResult = requireCleanContent(sanitizedContent);
  } catch (filterError) {
    // Content was rejected by filter
    throw filterError;
  }

  try {
    // Determine status based on content filter result
    const initialStatus = filterResult.flagged ? 'pending' : 'pending';
    
    const result = await env.DB.prepare(
      `INSERT INTO confessions (content, category, ip_hash, turnstile_token, status)
       VALUES (?, ?, ?, ?, ?)
       RETURNING id`
    )
      .bind(sanitizedContent, category, ipHash, turnstileToken, initialStatus)
      .first<{ id: number }>();

    if (!result) {
      throw new ApiError('Failed to create confession', 500);
    }

    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            id: result.id,
            status: initialStatus,
            message: filterResult.flagged 
              ? 'Confession submitted and is awaiting manual review.'
              : 'Confession submitted successfully and is awaiting review.',
            flagged: filterResult.flagged,
          },
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      )
    );
  } catch (error) {
    console.error('Database error:', error);
    throw new ApiError('Failed to save confession', 500);
  }
}

/**
 * Hash an IP address for rate limiting (privacy-preserving)
 */
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'confession-app-salt'); // Add salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getPendingConfessions(request: Request, env: Env): Promise<Response> {
  // TODO: Implement fetching pending confessions
  // - Verify admin auth
  // - Query D1 for pending confessions
  // - Return paginated results

  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: true, confessions: [], total: 0, hasMore: false }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  );
}

async function approveConfession(request: Request, env: Env, id: number): Promise<Response> {
  // TODO: Implement approval
  // - Verify admin auth
  // - Update confession status to 'approved'
  // - Log moderation action

  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: true, message: 'Confession approved', id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  );
}

async function rejectConfession(request: Request, env: Env, id: number): Promise<Response> {
  // TODO: Implement rejection
  // - Verify admin auth
  // - Update confession status to 'rejected'
  // - Log moderation action

  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: true, message: 'Confession rejected', id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  );
}
