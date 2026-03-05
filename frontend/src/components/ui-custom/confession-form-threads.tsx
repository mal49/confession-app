import { useState, useRef, useEffect } from 'react'
import Turnstile from 'react-turnstile'
import type { ConfessionCategory } from '@/../../shared/types'
import { 
  MoreHorizontal,
  ChevronDown,
  Loader2,
  Feather,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConfessionFormThreadsProps {
  onSubmit?: (content: string, category: ConfessionCategory, turnstileToken: string) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

const CATEGORY_OPTIONS: { value: ConfessionCategory; label: string; icon: string; color: string }[] = [
  { value: 'relationship', label: 'Relationship', icon: '💕', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { value: 'work', label: 'Work', icon: '💼', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'secret', label: 'Secret', icon: '🔮', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'regret', label: 'Regret', icon: '🌙', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { value: 'other', label: 'Other', icon: '✨', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
]

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

// Category badge component
function CategoryBadge({ 
  category, 
  onClick, 
  disabled = false 
}: { 
  category: ConfessionCategory; 
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cat = CATEGORY_OPTIONS.find(c => c.value === category)
  if (!cat) return null

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${cat.color} hover:opacity-80 disabled:opacity-50`}
    >
      <span>{cat.icon}</span>
      <span>{cat.label}</span>
    </button>
  )
}

export function ConfessionFormThreads({ onSubmit, onCancel, isSubmitting = false }: ConfessionFormThreadsProps) {
  const [content, setContent] = useState('')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ConfessionCategory | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileError, setTurnstileError] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const charCount = content.length
  const MIN_CHARS = 500
  const MAX_CHARS = 800
  const isValidLength = charCount >= MIN_CHARS && charCount <= MAX_CHARS
  const canSubmit = isValidLength && selectedCategory !== null && turnstileToken !== null && !isSubmitting

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.max(160, textarea.scrollHeight)}px`
    }
  }, [content])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async () => {
    if (!canSubmit || !selectedCategory || !turnstileToken) return
    await onSubmit?.(content, selectedCategory, turnstileToken)
  }

  const getCharacterStatus = () => {
    if (charCount === 0) return { color: 'text-[var(--text-muted)]', bg: 'bg-[var(--border-color)]' }
    if (charCount < MIN_CHARS) return { color: 'text-[var(--text-muted)]', bg: 'bg-[var(--border-color)]' }
    if (charCount > MAX_CHARS) return { color: 'text-red-400', bg: 'bg-red-500' }
    if (charCount > MAX_CHARS - 50) return { color: 'text-amber-400', bg: 'bg-amber-500' }
    return { color: 'text-green-400', bg: 'bg-green-500' }
  }

  const charStatus = getCharacterStatus()

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Main Card */}
      <div 
        className={`bg-[var(--bg-card)] rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 ${
          isFocused ? 'border-[var(--accent)]/50 shadow-[var(--accent)]/10' : 'border-[var(--border-color)]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Feather className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-[var(--text-primary)] font-semibold text-sm">Anonymous</h1>
              <p className="text-[var(--text-muted)] text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Your identity is protected</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 disabled:opacity-50"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5">
          {/* Category Selector */}
          <div className="mb-4" ref={dropdownRef}>
            {selectedCategory ? (
              <div className="flex items-center gap-2">
                <CategoryBadge 
                  category={selectedCategory} 
                  onClick={() => setShowCategoryDropdown(true)}
                  disabled={isSubmitting}
                />
                <button
                  onClick={() => setSelectedCategory(null)}
                  disabled={isSubmitting}
                  className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all duration-200 text-xs"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed transition-all duration-200 ${
                  showCategoryDropdown 
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' 
                    : 'border-[var(--border-hover)] text-[var(--text-muted)] hover:border-[var(--accent)]/50 hover:text-[var(--text-secondary)]'
                } disabled:opacity-50`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Select a category</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
            )}
            
            {/* Category Dropdown */}
            {showCategoryDropdown && (
              <div className="mt-2 p-2 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-xl animate-fade-in">
                <p className="px-3 py-2 text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
                  Choose a topic
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {CATEGORY_OPTIONS.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category.value)
                        setShowCategoryDropdown(false)
                      }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                        selectedCategory === category.value 
                          ? 'bg-[var(--accent)]/10 text-[var(--accent)]' 
                          : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                      {selectedCategory === category.value && (
                        <CheckCircle2 className="w-4 h-4 ml-auto text-[var(--accent)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What's weighing on your heart? This is a safe space to share your thoughts anonymously..."
              disabled={isSubmitting}
              className="w-full bg-transparent text-[var(--text-primary)] text-lg placeholder:text-[var(--text-placeholder)] resize-none outline-none min-h-[160px] font-normal leading-relaxed transition-colors duration-300 disabled:opacity-50"
              style={{ height: 'auto' }}
            />
          </div>

          {/* Character Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${charStatus.color}`}>
                {charCount === 0 ? 'Start typing...' : 
                 charCount < MIN_CHARS ? `${MIN_CHARS - charCount} more characters needed` :
                 charCount > MAX_CHARS ? `${charCount - MAX_CHARS} characters over limit` :
                 `${MAX_CHARS - charCount} characters remaining`}
              </span>
              <span className={`text-xs ${charStatus.color}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>
            <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${charStatus.bg}`}
                style={{ 
                  width: `${Math.min((charCount / MAX_CHARS) * 100, 100)}%`,
                  opacity: charCount > 0 ? 1 : 0.3
                }}
              />
            </div>
          </div>
        </div>

        {/* CAPTCHA Section */}
        <div className="px-5 py-4 bg-[var(--bg-secondary)]/30 border-y border-[var(--border-color)]">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Shield className="w-3.5 h-3.5" />
              <span>Security verification</span>
            </div>
            <div className="flex justify-center">
              <Turnstile
                sitekey={TURNSTILE_SITE_KEY}
                onVerify={(token) => {
                  setTurnstileToken(token)
                  setTurnstileError(false)
                }}
                onError={() => {
                  setTurnstileToken(null)
                  setTurnstileError(true)
                }}
                onExpire={() => {
                  setTurnstileToken(null)
                }}
                theme="auto"
              />
            </div>
            {turnstileError && (
              <div className="flex items-center gap-1.5 text-red-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Verification failed. Please try again.</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-5 py-4">
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  canSubmit 
                    ? 'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Feather className="w-4 h-4" />
                    <span>Post Confession</span>
                  </>
                )}
              </Button>
            </div>

            {/* Submission Requirements */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border-color)]">
            <div className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              selectedCategory ? 'text-green-400' : 'text-[var(--text-muted)]'
            }`}>
              {selectedCategory ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
              <span>Category</span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              isValidLength ? 'text-green-400' : 'text-[var(--text-muted)]'
            }`}>
              {isValidLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
              <span>{MIN_CHARS}-{MAX_CHARS} chars</span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${
              turnstileToken ? 'text-green-400' : 'text-[var(--text-muted)]'
            }`}>
              {turnstileToken ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
              <span>Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>3/hour limit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
        <Shield className="w-3.5 h-3.5" />
        <span>Your confession is anonymous and will be reviewed before posting</span>
      </div>
    </div>
  )
}

export default ConfessionFormThreads
