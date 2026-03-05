/**
 * Global Error Handler
 * Formats errors into consistent API responses
 */

export function errorHandler(error: unknown): Response {
  console.error('Worker Error:', error);

  const message = error instanceof Error ? error.message : 'Internal Server Error';
  const status = (error instanceof Error && 'status' in error) 
    ? (error as Error & { status: number }).status 
    : 500;
  
  // Include additional error data if available
  const errorData = (error instanceof Error && 'data' in error)
    ? (error as Error & { data: Record<string, unknown> }).data
    : undefined;

  const responseBody: Record<string, unknown> = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  };
  
  if (errorData) {
    responseBody.data = errorData;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
  
  // Add Retry-After header for rate limit errors
  if (status === 429 && errorData?.retryAfter && typeof errorData.retryAfter === 'number') {
    headers['Retry-After'] = String(errorData.retryAfter * 60); // Convert minutes to seconds
  }

  return new Response(
    JSON.stringify(responseBody),
    { status, headers }
  );
}

// Custom error class with status code and optional data
export class ApiError extends Error {
  status: number;
  data?: Record<string, unknown>;

  constructor(message: string, status: number = 500, data?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
    this.data = data;
  }
}
