/**
 * Form Validation Utilities
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

const MIN_CONTENT_LENGTH = 10
const MAX_CONTENT_LENGTH = 800

// Common spam patterns
const SPAM_PATTERNS = [
  /https?:\/\//i,  // URLs
  /www\./i,         // www links
  /\$\d+/i,        // Dollar amounts
  /earn money/i,
  /make money/i,
  /click here/i,
  /buy now/i,
  /limited time/i,
  /act now/i,
]

// Note: Profanity filtering is handled server-side via content-filter middleware
// Client-side filtering provides immediate feedback but is not comprehensive

export function validateConfessionContent(content: string): ValidationResult {
  const errors: ValidationError[] = []
  
  // Check for empty content
  if (!content || content.trim().length === 0) {
    errors.push({
      field: 'content',
      message: 'Please share your confession - the text area is empty',
    })
    return { valid: false, errors }
  }
  
  const trimmed = content.trim()
  
  // Check minimum length
  if (trimmed.length < MIN_CONTENT_LENGTH) {
    errors.push({
      field: 'content',
      message: `Your confession is too short. Please write at least ${MIN_CONTENT_LENGTH} characters to help us understand your story better.`,
    })
  }
  
  // Check maximum length
  if (trimmed.length > MAX_CONTENT_LENGTH) {
    errors.push({
      field: 'content',
      message: `Your confession is too long. Please keep it under ${MAX_CONTENT_LENGTH} characters (you have ${trimmed.length}).`,
    })
  }
  
  // Check for spam patterns
  const spamMatches = SPAM_PATTERNS.filter(pattern => pattern.test(trimmed))
  if (spamMatches.length > 0) {
    errors.push({
      field: 'content',
      message: 'Your confession appears to contain promotional content or links. Please remove any URLs or promotional text.',
    })
  }
  
  // Check for excessive repetition (possible spam)
  const words = trimmed.toLowerCase().split(/\s+/)
  const wordCounts: Record<string, number> = {}
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  })
  
  const maxRepeats = Math.max(...Object.values(wordCounts))
  if (maxRepeats > words.length * 0.3 && words.length > 10) {
    errors.push({
      field: 'content',
      message: 'Your confession contains too much repetition. Please vary your wording.',
    })
  }
  
  // Check for excessive capitalization (shouting)
  const capsRatio = (trimmed.match(/[A-Z]/g) || []).length / trimmed.length
  if (capsRatio > 0.5 && trimmed.length > 20) {
    errors.push({
      field: 'content',
      message: 'Please avoid excessive capitalization. It makes your confession harder to read.',
    })
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateTurnstile(token: string | null): ValidationResult {
  const errors: ValidationError[] = []
  
  if (!token) {
    errors.push({
      field: 'turnstile',
      message: 'Please complete the security verification',
    })
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

export function getCharacterCountStatus(count: number): {
  valid: boolean
  message: string
  color: string
  progress: number
} {
  if (count === 0) {
    return {
      valid: false,
      message: `${MIN_CONTENT_LENGTH} characters minimum`,
      color: 'text-[var(--text-muted)]',
      progress: 0,
    }
  }
  
  if (count < MIN_CONTENT_LENGTH) {
    const remaining = MIN_CONTENT_LENGTH - count
    return {
      valid: false,
      message: `${remaining} more characters needed`,
      color: 'text-amber-400',
      progress: (count / MIN_CONTENT_LENGTH) * 30,
    }
  }
  
  if (count > MAX_CONTENT_LENGTH) {
    const over = count - MAX_CONTENT_LENGTH
    return {
      valid: false,
      message: `${over} characters over limit`,
      color: 'text-red-400',
      progress: 100,
    }
  }
  
  if (count > MAX_CONTENT_LENGTH - 50) {
    const remaining = MAX_CONTENT_LENGTH - count
    return {
      valid: true,
      message: `${remaining} characters left`,
      color: 'text-amber-400',
      progress: (count / MAX_CONTENT_LENGTH) * 100,
    }
  }
  
  return {
    valid: true,
    message: `${MAX_CONTENT_LENGTH - count} characters left`,
    color: 'text-green-400',
    progress: (count / MAX_CONTENT_LENGTH) * 100,
  }
}
