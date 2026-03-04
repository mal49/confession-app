import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { healthCheck } from '@/api/client'
import { Feather, Lock, Sparkles, Heart, MessageCircle, Shield } from 'lucide-react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    setApiStatus('checking')
    const result = await healthCheck()
    setApiStatus(result.success ? 'connected' : 'error')
  }

  const scrollToForm = () => {
    document.getElementById('confession-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[400px] bg-amber-400/3 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Feather className="w-5 h-5 text-midnight-950" />
              </div>
              <span className="font-display text-xl font-semibold text-warm-white tracking-tight">
                Unveil
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-warm-gray font-body">API</span>
              <span className={`status-dot ${apiStatus === 'connected' ? 'status-connected' : apiStatus === 'error' ? 'status-error' : 'bg-amber-400'}`} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <div className={`mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-300 text-sm font-body">
              <Lock className="w-4 h-4" />
              Completely Anonymous
            </span>
          </div>

          {/* Main Headline */}
          <h1 className={`font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-warm-white leading-[1.1] mb-6 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Release Your
            <span className="block italic text-amber-400 glow-text">Inner Truth</span>
          </h1>

          {/* Subheadline */}
          <p className={`font-body text-lg md:text-xl text-warm-gray max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            A sacred space for unspoken thoughts. Share your confessions without fear, 
            judgment, or identity. What you release here, stays here.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button 
              onClick={scrollToForm}
              size="lg" 
              className="btn-primary px-8 py-6 text-lg rounded-xl h-auto"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Write a Confession
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="btn-secondary px-8 py-6 text-lg rounded-xl h-auto"
              onClick={() => window.open('/admin', '_self')}
            >
              Admin Access
            </Button>
          </div>

          {/* Stats */}
          <div className={`flex items-center justify-center gap-12 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-center">
              <div className="font-display text-3xl font-semibold text-amber-400">100%</div>
              <div className="text-sm text-warm-gray font-body">Anonymous</div>
            </div>
            <div className="w-px h-12 bg-amber-400/20" />
            <div className="text-center">
              <div className="font-display text-3xl font-semibold text-amber-400">0</div>
              <div className="text-sm text-warm-gray font-body">Judgments</div>
            </div>
            <div className="w-px h-12 bg-amber-400/20" />
            <div className="text-center">
              <div className="font-display text-3xl font-semibold text-amber-400">∞</div>
              <div className="text-sm text-warm-gray font-body">Freedom</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-amber-400/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-amber-400/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="divider-ornament mb-16">
            <span className="font-handwriting text-2xl text-amber-400/60">Why Unveil?</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Total Privacy',
                desc: 'No accounts, no emails, no tracking. Your identity remains completely hidden.'
              },
              {
                icon: Heart,
                title: 'Judgment Free',
                desc: 'A compassionate space where all confessions are received with understanding.'
              },
              {
                icon: MessageCircle,
                title: 'Shared Stories',
                desc: 'Approved confessions are shared to inspire and connect with others.'
              }
            ].map((feature) => (
              <Card key={feature.title} className="confession-card p-8 group">
                <CardContent className="p-0 relative">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center mb-6 group-hover:bg-amber-400/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-warm-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-body text-warm-gray leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Confession Form Section */}
      <section id="confession-form" className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-warm-white mb-4">
              Begin Your <span className="italic text-amber-400">Confession</span>
            </h2>
            <p className="font-body text-warm-gray text-lg">
              Write freely. Let your thoughts flow without restraint.
            </p>
          </div>

          <Card className="confession-card p-8 md:p-12 relative overflow-hidden">
            {/* Quote Mark */}
            <span className="quote-mark font-display">"</span>
            
            <CardContent className="p-0 relative z-10">
              <ConfessionFormPlaceholder />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-amber-400/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Feather className="w-5 h-5 text-amber-400" />
              <span className="font-display text-lg text-warm-white">Unveil</span>
            </div>
            
            <p className="font-body text-sm text-warm-gray text-center">
              A safe haven for the unspoken. Built with care.
            </p>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.open('/admin', '_self')}
                className="text-sm text-warm-gray hover:text-amber-400 transition-colors font-body"
              >
                Admin
              </button>
              <span className="text-amber-400/30">|</span>
              <span className="text-sm text-warm-gray font-body">
                Made anonymously
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Placeholder for the confession form (Phase 2)
function ConfessionFormPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="font-display text-sm text-amber-400/80 uppercase tracking-wider">
          Your Story
        </label>
        <textarea
          placeholder="I need to confess that..."
          className="confession-textarea w-full p-6 min-h-[280px]"
          disabled
        />
        <div className="flex justify-between text-sm">
          <span className="font-handwriting text-amber-400/60 text-lg">
            0 / 800 characters
          </span>
          <span className="text-warm-gray font-body">Min: 500</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-display text-sm text-amber-400/80 uppercase tracking-wider">
          Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['Relationship', 'Work', 'Secret', 'Regret', 'Other'].map((cat) => (
            <button
              key={cat}
              disabled
              className="px-4 py-3 rounded-xl border border-amber-400/20 text-warm-gray font-body text-sm hover:border-amber-400/40 transition-colors disabled:opacity-50"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button 
          size="lg" 
          className="btn-primary w-full py-6 text-lg rounded-xl h-auto opacity-50 cursor-not-allowed"
          disabled
        >
          <Lock className="w-5 h-5 mr-2" />
          Submit Anonymously
        </Button>
        <p className="text-center text-sm text-warm-gray mt-4 font-body">
          <span className="font-handwriting text-amber-400/60 text-base">Coming in Phase 2</span>
        </p>
      </div>
    </div>
  )
}

export default App
