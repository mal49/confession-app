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

  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

// Custom error class with status code
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}
