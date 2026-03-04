import { Env } from '../index';
import { ApiError } from '../middleware/error-handler';
import { addCorsHeaders } from '../middleware/cors';

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
  // TODO: Implement confession submission
  // - Validate request body
  // - Verify Turnstile token
  // - Check rate limiting
  // - Filter content
  // - Store in D1

  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: true, message: 'Confession submitted (placeholder)' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  );
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
