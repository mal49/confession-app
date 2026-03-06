import { Env } from '../index';
import { ApiError } from '../middleware/error-handler';
import { addCorsHeaders } from '../middleware/cors';
import { requireTurnstile } from '../middleware/turnstile';
import { requireRateLimit } from '../middleware/rate-limit';
import {
  requireCleanContent,
  sanitizeContent,
  ContentFilterResult,
  moderateForAutoPost,
} from '../middleware/content-filter';
import { verifyAdminAuth } from '../middleware/admin-auth';
import { postToThreads, ThreadsCredentials } from '../services/threads-api';
import type { Confession, ConfessionStatus } from '../../../shared/types';

/**
 * Confession Routes
 * POST /api/confession - Submit a new confession
 * GET /api/confession/pending - Get pending confessions (admin only)
 * POST /api/confession/:id/approve - Approve a confession (admin only)
 * POST /api/confession/:id/reject - Reject a confession (admin only)
 * PUT /api/confession/:id/edit - Edit a confession content (admin only)
 */

export async function confessionRoutes(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Submit new confession
  if (path === '/api/confession' && method === 'POST') {
    return await submitConfession(request, env);
  }

  // Get pending confessions (admin only)
  if (path === '/api/confession/pending' && method === 'GET') {
    return await getPendingConfessions(request, env);
  }

  // Approve confession (admin only)
  const approveMatch = path.match(/\/api\/confession\/(\d+)\/approve/);
  if (approveMatch && method === 'POST') {
    const id = parseInt(approveMatch[1], 10);
    return await approveConfession(request, env, id);
  }

  // Reject confession (admin only)
  const rejectMatch = path.match(/\/api\/confession\/(\d+)\/reject/);
  if (rejectMatch && method === 'POST') {
    const id = parseInt(rejectMatch[1], 10);
    return await rejectConfession(request, env, id);
  }

  // Edit confession (admin only)
  const editMatch = path.match(/\/api\/confession\/(\d+)\/edit/);
  if (editMatch && method === 'PUT') {
    const id = parseInt(editMatch[1], 10);
    return await editConfession(request, env, id);
  }

  throw new ApiError('Not Found', 404);
}

async function submitConfession(request: Request, env: Env): Promise<Response> {
  // Parse request body
  let body: { content?: string; contents?: string[]; turnstileToken?: string };
  try {
    body = await request.json();
  } catch {
    throw new ApiError('Invalid JSON in request body', 400);
  }

  const { content, contents, turnstileToken } = body;

  // Handle both single content and thread (multiple contents)
  let postContents: string[];
  if (contents && Array.isArray(contents) && contents.length > 0) {
    postContents = contents;
  } else if (content && typeof content === 'string') {
    postContents = [content];
  } else {
    throw new ApiError('Content is required', 400);
  }

  // Validate each post
  for (const postContent of postContents) {
    if (postContent.length === 0) {
      throw new ApiError('Content cannot be empty', 400);
    }
    if (postContent.length > 800) {
      throw new ApiError('Each post must not exceed 800 characters', 400);
    }
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
  
  // Sanitize all contents and combine for storage
  const sanitizedContents = postContents.map(c => sanitizeContent(c));
  const combinedContent = sanitizedContents.join('\n\n---\n\n');
  
  // Filter content (check combined content)
  let filterResult: ContentFilterResult;
  try {
    filterResult = requireCleanContent(combinedContent);
  } catch (filterError) {
    throw filterError;
  }

  // Auto-post moderation: decide if it's safe to auto-post this confession to Threads.
  const autoPostModeration = moderateForAutoPost(combinedContent);
  const threadCount = postContents.length;

  // If Threads is configured and the content is safe for auto-post,
  // try to post directly to Threads without storing the confession.
  if (
    env.THREADS_ACCESS_TOKEN &&
    env.THREADS_USER_ID &&
    autoPostModeration.isSafeForAutoPost
  ) {
    try {
      const credentials: ThreadsCredentials = {
        accessToken: env.THREADS_ACCESS_TOKEN,
        userId: env.THREADS_USER_ID,
      };

      const postResult = await postToThreads(sanitizedContents, credentials);

      if (postResult.success) {
        // Best-effort: update stats to count auto-posted confessions
        try {
          await env.DB.prepare(
            `INSERT OR IGNORE INTO stats (id, posted_count, rejected_count, total_submitted) VALUES (1, 0, 0, 0)`
          ).run();
          await env.DB.prepare(
            `UPDATE stats SET posted_count = posted_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1`
          ).run();
        } catch (statsError) {
          console.error('Failed to update posted stats for auto-posted confession:', statsError);
        }

        return addCorsHeaders(
          new Response(
            JSON.stringify({
              success: true,
              data: {
                status: 'posted' as ConfessionStatus,
                threadCount,
                autoPosted: true,
                permalink: postResult.permalink,
                message:
                  `Your confession${threadCount > 1 ? ` (${threadCount} posts)` : ''} ` +
                  'was posted to Threads.',
                needsReview: false,
                moderationFlags: [],
              },
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
          )
        );
      } else {
        console.error('Auto-post to Threads failed at submission time:', postResult.error);
      }
    } catch (threadsError) {
      console.error('Error while auto-posting to Threads at submission time:', threadsError);
    }
    // If auto-post fails for any reason, fall through to DB storage and manual review.
  }

  // For anything that cannot be auto-posted immediately (missing credentials,
  // auto-post moderation flags, or Threads errors), store the confession in the DB
  // for manual review in the admin dashboard.
  try {
    const result = await env.DB.prepare(
      `INSERT INTO confessions (content, ip_hash, turnstile_token, status)
       VALUES (?, ?, ?, ?)
       RETURNING id`
    )
      .bind(combinedContent, ipHash, turnstileToken, 'pending')
      .first<{ id: number }>();

    if (!result) {
      throw new ApiError('Failed to create confession', 500);
    }

    const needsReview = !autoPostModeration.isSafeForAutoPost;

    // Build a human-readable moderation reason when we decide not to auto-post.
    let moderationReason: string | undefined;
    const reasonParts: string[] = [];

    if (autoPostModeration.categories.selfHarm) {
      reasonParts.push('it talks about self-harm or wanting to hurt yourself');
    }
    if (autoPostModeration.categories.sexualContent) {
      reasonParts.push('it includes sensitive sexual content');
    }
    if (autoPostModeration.categories.pii) {
      reasonParts.push('it appears to contain personal contact or identifying information');
    }
    if (autoPostModeration.categories.profanity) {
      reasonParts.push('it includes strong language');
    }

    if (reasonParts.length > 0) {
      moderationReason =
        'We need to review this confession manually because ' +
        reasonParts.join('; ') +
        '.';
    }

    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            id: result.id,
            status: 'pending' as ConfessionStatus,
            threadCount,
            message: needsReview
              ? `Your confession${threadCount > 1 ? ` (${threadCount} posts)` : ''} was received and needs manual review before it can be posted.`
              : `Confession${threadCount > 1 ? ` (${threadCount} posts)` : ''} submitted successfully and is awaiting review.`,
            // Existing spam/suspicious flag from the base content filter
            flagged: filterResult.flagged,
            // New moderation metadata for auto-post gating
            needsReview,
            moderationFlags: needsReview ? autoPostModeration.flags : [],
            moderationReason,
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
  // Verify admin authentication
  verifyAdminAuth(request, env);

  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);

  // Validate pagination params
  const validatedLimit = Math.min(Math.max(limit, 1), 50); // Max 50 per page
  const validatedOffset = Math.max(offset, 0);

  try {
    // Get pending confessions sorted by oldest first
    const confessions = await env.DB.prepare(
      `SELECT id, content, status, created_at, updated_at, posted_at, posted_by, rejection_reason
       FROM confessions
       WHERE status = 'pending'
       ORDER BY created_at ASC
       LIMIT ? OFFSET ?`
    )
      .bind(validatedLimit, validatedOffset)
      .all<Confession>();

    // Get total count for pagination
    const countResult = await env.DB.prepare(
      `SELECT COUNT(*) as total FROM confessions WHERE status = 'pending'`
    ).first<{ total: number }>();

    const total = countResult?.total || 0;
    const hasMore = validatedOffset + (confessions.results?.length || 0) < total;

    // Enhance each confession with a short moderation summary based on
    // the same auto-post moderation rules used at submission time.
    const enhancedConfessions =
      confessions.results?.map((confession) => {
        const moderation = moderateForAutoPost(confession.content);

        if (!moderation.flags.length) {
          return confession;
        }

        const labels: string[] = [];
        if (moderation.categories.selfHarm) {
          labels.push('self-harm');
        }
        if (moderation.categories.sexualContent) {
          labels.push('sexual content');
        }
        if (moderation.categories.pii) {
          labels.push('PII');
        }
        if (moderation.categories.profanity) {
          labels.push('language');
        }

        const moderationSummary = labels.length
          ? `Flagged: ${labels.join(', ')}`
          : undefined;

        return {
          ...confession,
          moderationFlags: moderation.flags,
          moderationSummary,
        };
      }) || [];

    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            confessions: enhancedConfessions,
            total,
            hasMore,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
  } catch (error) {
    console.error('Database error:', error);
    throw new ApiError('Failed to fetch pending confessions', 500);
  }
}

async function approveConfession(request: Request, env: Env, id: number): Promise<Response> {
  // Verify admin authentication
  verifyAdminAuth(request, env);

  // Parse optional notes from request body
  let notes: string | undefined;
  let autoPost = true; // Default to auto-post
  try {
    const body = await request.json() as { notes?: string; autoPost?: boolean };
    notes = body.notes;
    if (typeof body.autoPost === 'boolean') {
      autoPost = body.autoPost;
    }
  } catch {
    // No body or invalid JSON is fine - notes are optional
  }

  try {
    // Check if confession exists and is pending
    const confession = await env.DB.prepare(
      `SELECT id, content, status FROM confessions WHERE id = ?`
    )
      .bind(id)
      .first<{ id: number; content: string; status: ConfessionStatus }>();

    if (!confession) {
      throw new ApiError('Confession not found', 404);
    }

    if (confession.status !== 'pending') {
      throw new ApiError(`Confession is already ${confession.status}`, 400);
    }

    // Auto-post to Threads if credentials are configured
    let postResult: { success: boolean; postId?: string; permalink?: string; error?: string; threadCount?: number } | null = null;
    
    if (autoPost && env.THREADS_ACCESS_TOKEN && env.THREADS_USER_ID) {
      const credentials: ThreadsCredentials = {
        accessToken: env.THREADS_ACCESS_TOKEN,
        userId: env.THREADS_USER_ID,
      };
      
      // Split combined content back into individual posts if it's a thread
      const contents = confession.content.includes('\n\n---\n\n') 
        ? confession.content.split('\n\n---\n\n')
        : [confession.content];
      
      // Post as thread (multiple posts if needed)
      postResult = await postToThreads(contents, credentials);
      
      if (postResult.success) {
        const threadInfo = postResult.threadCount && postResult.threadCount > 1 
          ? `(thread of ${postResult.threadCount} posts)` 
          : '';
        console.log(`Posted confession ${id} to Threads ${threadInfo}: ${postResult.permalink}`);
      } else {
        console.error(`Failed to post confession ${id} to Threads: ${postResult.error}`);
        // Continue with approval even if posting fails - admin can retry later
      }
    }

    const wasPosted = postResult?.success || false;
    const threadCount = postResult?.threadCount || 1;

    // Update stats - increment posted count if posted (ensure stats row exists first)
    if (postResult?.success) {
      try {
        await env.DB.prepare(
          `INSERT OR IGNORE INTO stats (id, posted_count, rejected_count, total_submitted) VALUES (1, 0, 0, 0)`
        ).run();
        await env.DB.prepare(
          `UPDATE stats SET posted_count = posted_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1`
        ).run();
      } catch (statsError) {
        console.error('Failed to update posted stats:', statsError);
        // Don't fail the approval if stats update fails
      }
    }

    // Log moderation action before deleting
    await logModerationAction(env, id, 'approved', notes);
    
    // Log posting action if successful
    if (postResult?.success && postResult.permalink) {
      await logModerationAction(env, id, 'posted', `Posted to Threads: ${postResult.permalink}`);
    }

    // Delete the confession from database
    await env.DB.prepare(`DELETE FROM confessions WHERE id = ?`).bind(id).run();

    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          message: wasPosted
            ? `Confession approved, posted to Threads${threadCount > 1 ? ` (${threadCount} posts)` : ''}, and deleted`
            : 'Confession approved and deleted',
          data: {
            id,
            status: wasPosted ? 'posted' : 'approved',
            action: 'approved',
            posted: wasPosted,
            postId: postResult?.postId,
            permalink: postResult?.permalink,
            postError: postResult?.error,
            threadCount: postResult?.threadCount || 1,
            deleted: true,
            timestamp: new Date().toISOString(),
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Database error:', error);
    throw new ApiError('Failed to approve confession', 500);
  }
}

async function rejectConfession(request: Request, env: Env, id: number): Promise<Response> {
  // Verify admin authentication
  verifyAdminAuth(request, env);

  // Parse optional reason from request body
  let reason: string | undefined;
  try {
    const body = await request.json() as { reason?: string; notes?: string };
    reason = body.reason || body.notes;
  } catch {
    // No body or invalid JSON is fine - reason is optional
  }

  try {
    // Check if confession exists and is pending
    const confession = await env.DB.prepare(
      `SELECT id, content, status FROM confessions WHERE id = ?`
    )
      .bind(id)
      .first<{ id: number; content: string; status: ConfessionStatus }>();

    if (!confession) {
      throw new ApiError('Confession not found', 404);
    }

    if (confession.status !== 'pending') {
      throw new ApiError(`Confession is already ${confession.status}`, 400);
    }

    // If no explicit reason was provided, derive one from moderation signals.
    if (!reason) {
      const moderation = moderateForAutoPost(confession.content);
      const parts: string[] = [];

      if (moderation.categories.selfHarm) {
        parts.push('contains self-harm related content');
      }
      if (moderation.categories.sexualContent) {
        parts.push('contains sensitive sexual content');
      }
      if (moderation.categories.pii) {
        parts.push('appears to contain personal or contact information');
      }
      if (moderation.categories.profanity) {
        parts.push('contains strong or inappropriate language');
      }

      if (parts.length > 0) {
        reason = `Auto-moderation: ${parts.join('; ')}.`;
      } else {
        reason = 'Rejected by admin.';
      }
    }

    // Update stats - increment rejected count (ensure stats row exists first)
    try {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO stats (id, posted_count, rejected_count, total_submitted) VALUES (1, 0, 0, 0)`
      ).run();
      await env.DB.prepare(
        `UPDATE stats SET rejected_count = rejected_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1`
      ).run();
    } catch (statsError) {
      console.error('Failed to update rejected stats:', statsError);
      // Don't fail the rejection if stats update fails
    }

    // Log moderation action before deleting
    await logModerationAction(env, id, 'rejected', reason);

    // Delete the confession from database
    await env.DB.prepare(`DELETE FROM confessions WHERE id = ?`).bind(id).run();

    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          message: 'Confession rejected and deleted',
          data: {
            id,
            status: 'rejected',
            action: 'rejected',
            rejectionReason: reason,
            deleted: true,
            timestamp: new Date().toISOString(),
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Database error:', error);
    throw new ApiError('Failed to reject confession', 500);
  }
}

async function editConfession(request: Request, env: Env, id: number): Promise<Response> {
  // Verify admin authentication
  verifyAdminAuth(request, env);

  // Parse request body
  let body: { content?: string };
  try {
    body = await request.json();
  } catch {
    throw new ApiError('Invalid JSON in request body', 400);
  }

  const { content } = body;

  // Validate content
  if (!content || typeof content !== 'string') {
    throw new ApiError('Content is required', 400);
  }

  if (content.length === 0) {
    throw new ApiError('Content cannot be empty', 400);
  }

  if (content.length > 800) {
    throw new ApiError('Content must not exceed 800 characters', 400);
  }

  // Sanitize content
  const sanitizedContent = sanitizeContent(content);

  try {
    // Check if confession exists
    const confession = await env.DB.prepare(
      `SELECT id, status FROM confessions WHERE id = ?`
    )
      .bind(id)
      .first<{ id: number; status: ConfessionStatus }>();

    if (!confession) {
      throw new ApiError('Confession not found', 404);
    }

    // Update confession content
    await env.DB.prepare(
      `UPDATE confessions 
       SET content = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
      .bind(sanitizedContent, id)
      .run();

    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          message: 'Confession updated',
          data: {
            id,
            status: confession.status,
            action: 'edited',
            timestamp: new Date().toISOString(),
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Database error:', error);
    throw new ApiError('Failed to update confession', 500);
  }
}

/**
 * Log moderation action to audit log
 */
async function logModerationAction(
  env: Env, 
  confessionId: number, 
  action: 'approved' | 'rejected' | 'posted',
  notes?: string
): Promise<void> {
  try {
    await env.DB.prepare(
      `INSERT INTO moderation_log (confession_id, action, notes)
       VALUES (?, ?, ?)`
    )
      .bind(confessionId, action, notes || null)
      .run();
  } catch (error) {
    // Log error but don't fail the main operation
    console.error('Failed to log moderation action:', error);
  }
}
