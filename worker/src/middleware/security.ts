/**
 * Security Headers Middleware
 * Adds security-related headers to all responses
 */

export function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://challenges.cloudflare.com https://confession-worker.ikhmalhanif60.workers.dev",
    "frame-src https://challenges.cloudflare.com",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
  
  headers.set('Content-Security-Policy', csp);
  
  // Prevent browsers from MIME-sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection (legacy, but still useful)
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');
  
  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  
  // Strict Transport Security (only in production)
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
