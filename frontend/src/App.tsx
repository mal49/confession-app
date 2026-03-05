import { useState, useEffect } from 'react'
import { ConfessionFormThreads } from '@/components/ui-custom/confession-form-threads'
import { ThemeToggle } from '@/components/ui-custom/theme-toggle'
import { ToastProvider, useToastContext } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toast'
import { confessionApi } from '@/api/client'
import type { ConfessionCategory } from '../../shared/types'
import { 
  Heart, 
  Shield, 
  Lock,
  Sparkles,
  Feather
} from 'lucide-react'
import './App.css'

// Inner component that has access to toast context
function AppContent() {
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toasts, dismiss, toast } = useToastContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (content: string, category: ConfessionCategory, turnstileToken: string) => {
    setIsSubmitting(true)
    
    try {
      const response = await confessionApi.submit({
        content,
        category,
        turnstileToken,
      })

      if (response.success) {
        toast({
          title: 'Confession Submitted',
          description: response.data?.message || 'Your confession is awaiting review.',
          variant: 'success',
        })
        setShowForm(false)
      } else {
        toast({
          title: 'Submission Failed',
          description: response.error || 'Something went wrong. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Network error. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] transition-colors duration-300">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Feather className="w-4 h-4 text-black" />
            </div>
            <span className="font-semibold text-[var(--text-primary)] transition-colors duration-300">Unveil</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs transition-colors duration-300">
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Anonymous</span>
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-14 pb-8 min-h-screen flex flex-col">
        {/* Hero / Form Section */}
        <section className="px-4 py-6 flex-1 flex items-center justify-center">
          <div 
            className={`w-full transition-all duration-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {showForm ? (
              <ConfessionFormThreads 
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div className="w-full max-w-xl mx-auto">
                {/* Welcome Card */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6 mb-6 transition-colors duration-300">
                  <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2 transition-colors duration-300">
                    Share your truth
                  </h1>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 transition-colors duration-300">
                    A safe space for your unspoken thoughts. No judgment, no identity, just release.
                  </p>
                  
                  {/* Quick Start Button */}
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--border-hover)] rounded-xl border border-[var(--border-color)] transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center group-hover:bg-[var(--bg-hover)] transition-colors duration-300">
                      <span className="text-[var(--text-muted)] text-lg">?</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[var(--text-primary)] text-sm font-medium transition-colors duration-300">What&apos;s on your mind?</p>
                      <p className="text-[var(--text-muted)] text-xs transition-colors duration-300">Tap to share anonymously</p>
                    </div>
                    <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Shield, label: 'Anonymous', desc: 'No accounts needed' },
                    { icon: Lock, label: 'Private', desc: 'Your data is safe' },
                    { icon: Heart, label: 'Judgment-free', desc: 'Share freely' }
                  ].map((feature) => (
                    <div 
                      key={feature.label}
                      className="text-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] transition-colors duration-300"
                    >
                      <feature.icon className="w-5 h-5 text-[var(--text-muted)] mx-auto mb-2" />
                      <p className="text-[var(--text-primary)] text-xs font-medium transition-colors duration-300">{feature.label}</p>
                      <p className="text-[var(--text-muted)] text-[10px] transition-colors duration-300">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Action Button (Mobile) */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover)] text-[var(--button-primary-text)] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 z-40"
        >
          <Feather className="w-6 h-6" />
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-6 px-4 transition-colors duration-300">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-[var(--text-secondary)] text-sm transition-colors duration-300">Unveil</span>
          </div>
          <p className="text-[var(--text-muted)] text-xs text-center transition-colors duration-300">
            A safe space for the unspoken. Built with care.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => window.open('/admin', '_self')}
              className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] text-xs transition-colors duration-300"
            >
              Admin
            </button>
            <span className="text-[var(--border-hover)]">·</span>
            <span className="text-[var(--text-muted)] text-xs transition-colors duration-300">Made anonymously</span>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

// Main App component with providers
function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App
