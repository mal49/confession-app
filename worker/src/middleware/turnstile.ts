/**
 * Cloudflare Turnstile Verification
 * Validates CAPTCHA tokens to prevent spam
 */

import { ApiError } from './error-handler';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verify a Turnstile token with Cloudflare
 */
export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  clientIP?: string
): Promise<boolean> {
  if (!token) {
    throw new ApiError('CAPTCHA token is required', 400);
  }

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    throw new ApiError('Server configuration error', 500);
  }

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (clientIP) {
    formData.append('remoteip', clientIP);
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data: TurnstileVerifyResponse = await response.json();

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

/**
 * Middleware to enforce Turnstile verification
 */
export async function requireTurnstile(
  token: string | undefined,
  secretKey: string,
  clientIP?: string
): Promise<void> {
  if (!token) {
    throw new ApiError('CAPTCHA verification required. Please complete the challenge.', 403);
  }

  const isValid = await verifyTurnstileToken(token, secretKey, clientIP);
  
  if (!isValid) {
    throw new ApiError('CAPTCHA verification failed. Please try again.', 403);
  }
}
