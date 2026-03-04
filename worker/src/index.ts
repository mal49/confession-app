import { confessionRoutes } from './routes/confession';
import { adminRoutes } from './routes/admin';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/error-handler';

// Export the Worker entry point
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Apply CORS
      const corsResponse = corsMiddleware(request);
      if (corsResponse) return corsResponse;

      const url = new URL(request.url);
      const path = url.pathname;

      // Route handling
      if (path.startsWith('/api/confession')) {
        return await confessionRoutes(request, env, ctx);
      }
      
      if (path.startsWith('/api/admin')) {
        return await adminRoutes(request, env, ctx);
      }

      // Health check endpoint
      if (path === '/api/health') {
        return new Response(
          JSON.stringify({ success: true, message: 'OK', timestamp: new Date().toISOString() }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // 404 for unknown routes
      return new Response(
        JSON.stringify({ success: false, error: 'Not Found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return errorHandler(error);
    }
  },
};

// Environment interface
export interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
  ADMIN_API_KEY: string;
  TURNSTILE_SITE_KEY: string;
}
