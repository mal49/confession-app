import { Env } from '../index';
import { addCorsHeaders } from '../middleware/cors';

/**
 * Admin Routes
 * GET /api/admin/stats - Get submission stats
 * Other admin-specific operations
 */

export async function adminRoutes(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Get admin stats
  if (path === '/api/admin/stats' && method === 'GET') {
    return await getStats(request, env);
  }

  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: false, error: 'Not Found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  );
}

async function getStats(request: Request, env: Env): Promise<Response> {
  // TODO: Implement stats
  // - Count by status: pending, approved, rejected, posted

  return addCorsHeaders(
    new Response(
      JSON.stringify({
        success: true,
        stats: {
          pending: 0,
          approved: 0,
          rejected: 0,
          posted: 0,
          total: 0,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  );
}
