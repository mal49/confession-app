import { confessionRoutes } from './routes/confession';
import { adminRoutes } from './routes/admin';
import { corsMiddleware, addCorsHeaders } from './middleware/cors';
import { addSecurityHeaders } from './middleware/security';
import { errorHandler } from './middleware/error-handler';

// Export the Worker entry point
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Apply CORS
      const corsResponse = corsMiddleware(request);
      if (corsResponse) return addSecurityHeaders(corsResponse);

      const url = new URL(request.url);
      const path = url.pathname;
      let response: Response;

      // Route handling
      if (path.startsWith('/api/confession')) {
        response = await confessionRoutes(request, env, ctx);
      } else if (path.startsWith('/api/admin')) {
        response = await adminRoutes(request, env, ctx);
      } else if (path === '/api/health') {
        response = new Response(
          JSON.stringify({ success: true, message: 'OK', timestamp: new Date().toISOString() }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // 404 for unknown routes
        response = new Response(
          JSON.stringify({ success: false, error: 'Not Found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Add CORS and security headers
      response = addCorsHeaders(response, request.headers.get('Origin') || undefined);
      response = addSecurityHeaders(response);
      
      return response;
    } catch (error) {
      return addSecurityHeaders(errorHandler(error));
    }
  },
};

// Environment interface
export interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
  ADMIN_API_KEY: string;
  TURNSTILE_SITE_KEY: string;
  // Threads API credentials (optional - auto-post if configured)
  THREADS_ACCESS_TOKEN?: string;
  THREADS_USER_ID?: string;
}
