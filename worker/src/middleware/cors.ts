/**
 * CORS Middleware
 * Handles CORS preflight requests and adds headers
 */

// In production, only allow specific origins
const PRODUCTION_ORIGINS = [
  'https://confession-app.pages.dev',
  'https://*.confession-app.pages.dev',
  'https://ceritaanon.xyz',
  'https://www.ceritaanon.xyz',
];

const DEVELOPMENT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8787',
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  
  const allowedOrigins = [...DEVELOPMENT_ORIGINS, ...PRODUCTION_ORIGINS];
  
  return allowedOrigins.some(allowed => {
    // Handle wildcards in production origins
    if (allowed.includes('*')) {
      const regex = new RegExp(allowed.replace('*', '.*'));
      return regex.test(origin);
    }
    return allowed === origin;
  });
}

export function corsMiddleware(request: Request): Response | null {
  const origin = request.headers.get('Origin');
  
  // Block requests from unauthorized origins
  if (!isAllowedOrigin(origin)) {
    return new Response('CORS policy violation', { status: 403 });
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    });
  }

  return null;
}

export function addCorsHeaders(response: Response, origin?: string): Response {
  const headers = new Headers(response.headers);
  
  // Only set CORS headers for allowed origins
  if (origin && isAllowedOrigin(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
