/**
 * Content Filter Middleware
 * Basic profanity and blocklist filtering for confessions
 * Multi-layer approach: pattern matching + blocklist
 */

import { ApiError } from './error-handler';

// Common profanity patterns (basic implementation)
// In production, consider using a more comprehensive library
const BLOCKED_PATTERNS = [
  // Hate speech patterns (regex)
  /\b(hate\s+(?:speech|crime))\b/gi,
  
  // Common spam patterns
  /\b(viagra|cialis|casino|lottery|winner\s+\$\d+)\b/gi,
  
  // Excessive repetition (more than 15 identical consecutive characters - allows expressive text)
  /(.)\1{15,}/,
  
  // All caps shouting (more than 80% caps in long words)
  /\b[A-Z]{10,}\b/,
];

// Blocked words/phrases (lowercase for comparison)
const BLOCKED_WORDS = new Set([
  // Common slurs and hate speech would go here
  // Using placeholder examples - customize for your needs
  'spam',
  'scam',
  'click here',
  'visit my profile',
  'follow me',
  'dm me',
  'message me',
  'check my bio',
  'link in bio',
]);

// Suspicious patterns that require review but don't auto-block
const SUSPICIOUS_PATTERNS = [
  /https?:\/\/\S+/gi,  // URLs (flag for review)
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,  // Credit card-like numbers
  /\b\d{3}-\d{2}-\d{4}\b/,  // SSN-like patterns
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,  // Email addresses
];

// Very lightweight keyword lists for higher-risk categories.
// These are intentionally conservative and can be expanded over time.
const SELF_HARM_KEYWORDS = [
  'kill myself',
  'killing myself',
  'end my life',
  'end it all',
  'suicidal',
  'suicide',
  'want to die',
  'wanna die',
  'hurt myself',
  'self harm',
  'self-harm',
];

const SEXUAL_CONTENT_KEYWORDS = [
  'sex',
  'nude',
  'nudes',
  'naked',
  'onlyfans',
  'porn',
  'pornhub',
  'xvideos',
  'deepthroat',
  'handjob',
  'blowjob',
  'doggy style',
  '69',
  'anal',
  'bdsm',
];

// Basic PII detection for auto-post gating (email + phone).
// These are intentionally simple and may have false positives/negatives.
const PII_PATTERNS = [
  // Email
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  // Phone numbers like +123..., (123) 456-7890, 123-456-7890, etc.
  /\b(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}\b/,
];

export interface ContentFilterResult {
  clean: boolean;
  flagged: boolean;
  reason?: string;
  category: 'clean' | 'spam' | 'profanity' | 'suspicious' | 'blocked';
}

export type AutoPostModerationFlag =
  | 'self_harm'
  | 'profanity'
  | 'pii'
  | 'sexual_content';

export interface AutoPostModerationResult {
  isSafeForAutoPost: boolean;
  flags: AutoPostModerationFlag[];
  categories: {
    selfHarm: boolean;
    profanity: boolean;
    pii: boolean;
    sexualContent: boolean;
  };
}

/**
 * Check if content contains blocked patterns
 */
function checkBlockedPatterns(content: string): { blocked: boolean; reason?: string } {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      return { blocked: true, reason: 'Content contains blocked patterns' };
    }
  }
  return { blocked: false };
}

/**
 * Check if content contains blocked words
 */
function checkBlockedWords(content: string): { blocked: boolean; reason?: string } {
  const lowerContent = content.toLowerCase();
  const words = lowerContent.split(/\s+/);
  
  for (const word of words) {
    if (BLOCKED_WORDS.has(word)) {
      return { blocked: true, reason: 'Content contains blocked words' };
    }
  }
  
  // Check for phrases
  for (const blockedPhrase of BLOCKED_WORDS) {
    if (blockedPhrase.includes(' ') && lowerContent.includes(blockedPhrase)) {
      return { blocked: true, reason: 'Content contains blocked phrases' };
    }
  }
  
  return { blocked: false };
}

/**
 * Check for suspicious patterns (requires manual review)
 */
function checkSuspiciousPatterns(content: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(content));
}

/**
 * Calculate content quality score
 * Returns true if content passes quality checks
 */
function checkQuality(content: string): { passed: boolean; reason?: string } {
  // Check for excessive repetition of words
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  if (words.length > 0) {
    const wordFreq = new Map<string, number>();
    for (const word of words) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
    
    const maxFreq = Math.max(...wordFreq.values());
    if (maxFreq > words.length * 0.5) {
      return { passed: false, reason: 'Content has excessive word repetition' };
    }
  }
  
  return { passed: true };
}

/**
 * Filter content and return result
 */
export function filterContent(content: string): ContentFilterResult {
  // Check blocked patterns first
  const patternCheck = checkBlockedPatterns(content);
  if (patternCheck.blocked) {
    return {
      clean: false,
      flagged: true,
      reason: patternCheck.reason,
      category: 'blocked',
    };
  }
  
  // Check blocked words
  const wordCheck = checkBlockedWords(content);
  if (wordCheck.blocked) {
    return {
      clean: false,
      flagged: true,
      reason: wordCheck.reason,
      category: 'profanity',
    };
  }
  
  // Quality check
  const qualityCheck = checkQuality(content);
  if (!qualityCheck.passed) {
    return {
      clean: false,
      flagged: true,
      reason: qualityCheck.reason,
      category: 'spam',
    };
  }
  
  // Check for suspicious patterns (flag but don't block)
  const hasSuspicious = checkSuspiciousPatterns(content);
  if (hasSuspicious) {
    return {
      clean: true,
      flagged: true,
      reason: 'Content contains suspicious patterns and requires manual review',
      category: 'suspicious',
    };
  }
  
  return {
    clean: true,
    flagged: false,
    category: 'clean',
  };
}

/**
 * Middleware to enforce content filtering
 * @param content - The confession content to filter
 * @throws ApiError if content is blocked
 * @returns ContentFilterResult
 */
export function requireCleanContent(content: string): ContentFilterResult {
  const result = filterContent(content);
  
  // Hard block for profanity and spam
  if (result.category === 'profanity' || result.category === 'blocked') {
    throw new ApiError(
      result.reason || 'Content violates our community guidelines',
      400,
      { category: result.category }
    );
  }
  
  // Hard block for low quality spam
  if (result.category === 'spam') {
    throw new ApiError(
      result.reason || 'Content does not meet quality standards',
      400,
      { category: result.category }
    );
  }
  
  return result;
}

/**
 * Sanitize content
 * Removes or replaces potentially harmful characters/patterns
 */
export function sanitizeContent(content: string): string {
  return content
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Remove control characters except newlines
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Lightweight moderation specifically for deciding if content
 * is safe to auto-post to Threads.
 *
 * It focuses on:
 * - Self-harm language
 * - Profanity / blocked words
 * - PII (emails / phone numbers)
 * - Sexual / NSFW content
 */
export function moderateForAutoPost(content: string): AutoPostModerationResult {
  const lower = content.toLowerCase();

  const flags: AutoPostModerationFlag[] = [];
  const categories = {
    selfHarm: false,
    profanity: false,
    pii: false,
    sexualContent: false,
  };

  // Self-harm detection (keyword based)
  if (SELF_HARM_KEYWORDS.some(keyword => lower.includes(keyword))) {
    categories.selfHarm = true;
    flags.push('self_harm');
  }

  // Sexual content detection (keyword based, intentionally conservative)
  if (SEXUAL_CONTENT_KEYWORDS.some(keyword => lower.includes(keyword))) {
    categories.sexualContent = true;
    flags.push('sexual_content');
  }

  // PII detection (email / phone)
  if (PII_PATTERNS.some(pattern => pattern.test(content))) {
    categories.pii = true;
    flags.push('pii');
  }

  // Reuse existing filter to detect profanity / blocked words.
  const baseFilter = filterContent(content);
  if (baseFilter.category === 'profanity' || baseFilter.category === 'blocked') {
    categories.profanity = true;
    if (!flags.includes('profanity')) {
      flags.push('profanity');
    }
  }

  return {
    isSafeForAutoPost: flags.length === 0,
    flags,
    categories,
  };
}
