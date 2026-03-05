/**
 * Environment Variable Validation
 * Ensures all required env vars are present at runtime
 */

export interface EnvConfig {
  API_URL: string
  TURNSTILE_SITE_KEY: string
  ADMIN_API_KEY: string
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = import.meta.env[name]
  
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  
  return value || defaultValue!
}

export const env: EnvConfig = {
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:8787'),
  TURNSTILE_SITE_KEY: getEnvVar('VITE_TURNSTILE_SITE_KEY', '1x00000000000000000000AA'),
  ADMIN_API_KEY: getEnvVar('VITE_ADMIN_API_KEY', ''),
}

/**
 * Validate all required environment variables
 * Call this early in app initialization
 */
export function validateEnv(): void {
  const required = [
    'VITE_API_URL',
    'VITE_TURNSTILE_SITE_KEY',
  ]
  
  const missing: string[] = []
  
  for (const name of required) {
    if (!import.meta.env[name]) {
      missing.push(name)
    }
  }
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    
    if (import.meta.env.DEV) {
      throw new Error(
        `Missing required environment variables:\n${missing.join('\n')}\n\n` +
        `Please check your .env.local file and ensure all required variables are set.`
      )
    }
  }
}

export default env
