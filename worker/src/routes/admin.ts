import { Env } from '../index';
import { addCorsHeaders } from '../middleware/cors';
import { verifyAdminAuth } from '../middleware/admin-auth';
import { ApiError } from '../middleware/error-handler';
import { validateThreadsCredentials, postToThreads } from '../services/threads-api';

/**
 * Admin Routes
 * GET /api/admin/stats - Get submission stats
 * GET /api/admin/threads-status - Check Threads configuration
 * POST /api/admin/test-threads - Test Threads posting
 */

export async function adminRoutes(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Get admin stats
  if (path === '/api/admin/stats' && method === 'GET') {
    return await getStats(request, env);
  }

  // Check Threads configuration status
  if (path === '/api/admin/threads-status' && method === 'GET') {
    return await getThreadsStatus(request, env);
  }

  // Test Threads posting (posts a test message)
  if (path === '/api/admin/test-threads' && method === 'POST') {
    return await testThreadsPosting(request, env);
  }

  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: false, error: 'Not Found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  );
}

async function getStats(request: Request, env: Env): Promise<Response> {
  // Verify admin authentication
  verifyAdminAuth(request, env);

  try {
    // Get pending count from confessions table
    const pendingResult = await env.DB.prepare(
      `SELECT COUNT(*) as pending FROM confessions WHERE status = 'pending'`
    ).first<{ pending: number }>();

    // Get posted/rejected counts from stats table (handle if table doesn't exist yet)
    let posted = 0;
    let rejected = 0;
    try {
      const statsResult = await env.DB.prepare(
        `SELECT posted_count, rejected_count FROM stats WHERE id = 1`
      ).first<{ posted_count: number; rejected_count: number }>();
      posted = statsResult?.posted_count || 0;
      rejected = statsResult?.rejected_count || 0;
    } catch (statsError) {
      // Stats table might not exist yet, use defaults
      console.log('Stats table not ready yet, using defaults');
    }

    const pending = pendingResult?.pending || 0;
    
    // Calculate totals (approved is now same as posted since we delete after approval)
    const approved = posted; // Approved = posted (we only track posted)
    const total = pending + approved + rejected;

    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            pending,
            approved,
            rejected,
            posted,
            total,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
  } catch (error) {
    console.error('Database error:', error);
    throw new ApiError('Failed to fetch stats', 500);
  }
}

async function getThreadsStatus(request: Request, env: Env): Promise<Response> {
  // Verify admin authentication
  verifyAdminAuth(request, env);

  const hasCredentials = !!(env.THREADS_ACCESS_TOKEN && env.THREADS_USER_ID);

  if (!hasCredentials) {
    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            configured: false,
            message: 'Threads API credentials not configured. Set THREADS_ACCESS_TOKEN and THREADS_USER_ID environment variables.',
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
  }

  // Validate credentials (we already checked they exist above)
  const validation = await validateThreadsCredentials({
    accessToken: env.THREADS_ACCESS_TOKEN!,
    userId: env.THREADS_USER_ID!,
  });

  return addCorsHeaders(
    new Response(
      JSON.stringify({
        success: true,
        data: {
          configured: true,
          valid: validation.valid,
          error: validation.error,
          message: validation.valid 
            ? 'Threads API is configured and credentials are valid.'
            : 'Threads API credentials are invalid.',
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  );
}

async function testThreadsPosting(request: Request, env: Env): Promise<Response> {
  // Verify admin authentication
  verifyAdminAuth(request, env);

  if (!env.THREADS_ACCESS_TOKEN || !env.THREADS_USER_ID) {
    throw new ApiError('Threads API credentials not configured', 400);
  }

  const testMessage = '🧪 Test post from Confession App - This is a test of the auto-posting feature.';

  const result = await postToThreads([testMessage], {
    accessToken: env.THREADS_ACCESS_TOKEN,
    userId: env.THREADS_USER_ID,
  });

  if (!result.success) {
    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: false,
          error: result.error,
          message: 'Failed to post test message to Threads.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    );
  }

  return addCorsHeaders(
    new Response(
      JSON.stringify({
        success: true,
        data: {
          postId: result.postId,
          permalink: result.permalink,
          message: 'Test post successful! Check your Threads account.',
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  );
}
