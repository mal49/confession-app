import {
  Shield,
  ArrowLeft,
  Lock,
  Eye,
  Trash2,
  Server,
  Cloud,
  Heart,
  CheckCircle2,
  FileText,
  Key,
  UserX,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function PrivacyPage() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Eye,
      iconBg: "bg-[#4A90E2]",
      lightBg: "bg-[#4A90E2]/10",
      title: "Information We Collect",
      subtitle: "Minimal data, maximum privacy",
      points: [
        {
          title: "Confession Content",
          desc: "The text you submit (max 800 characters). This is the only content we store.",
          icon: FileText,
        },
        {
          title: "Hashed IP Address",
          desc: "Your IP is hashed with a salt for rate limiting. We cannot reverse this to identify you.",
          icon: Key,
        },
        {
          title: "CAPTCHA Token",
          desc: "Turnstile verification token to prevent spam bots.",
          icon: Shield,
        },
        {
          title: "Timestamps",
          desc: "When the confession was submitted and moderated.",
          icon: Clock,
        },
      ],
    },
    {
      icon: Lock,
      iconBg: "bg-[#FFD93D]",
      lightBg: "bg-[#FFD93D]/10",
      title: "How We Protect Your Data",
      subtitle: "Your privacy is our priority",
      points: [
        {
          title: "Anonymous by Design",
          desc: "No accounts, no emails, no phone numbers required. Ever.",
          icon: UserX,
        },
        {
          title: "IP Hashing",
          desc: "Your IP is one-way hashed - we can't identify you from it.",
          icon: Key,
        },
        {
          title: "HTTPS Encryption",
          desc: "All data is transmitted over secure, encrypted connections.",
          icon: Lock,
        },
        {
          title: "No Third-Party Tracking",
          desc: "We don't use Google Analytics or any similar trackers.",
          icon: Shield,
        },
      ],
    },
    {
      icon: Server,
      iconBg: "bg-[#9B59B6]",
      lightBg: "bg-[#9B59B6]/10",
      title: "Data Storage & Processing",
      subtitle: "Secure infrastructure",
      points: [
        {
          title: "Cloudflare Infrastructure",
          desc: "Data is stored on Cloudflare's D1 database with enterprise-grade security.",
          icon: Server,
        },
        {
          title: "Access Control",
          desc: "Only the site administrator can access confession content for moderation.",
          icon: Lock,
        },
        {
          title: "Content Moderation",
          desc: "All confessions are reviewed before being posted publicly to Threads.",
          icon: Eye,
        },
        {
          title: "Automatic Deletion",
          desc: "Rejected content is deleted immediately. Approved content may be posted anonymously.",
          icon: Trash2,
        },
      ],
    },
    {
      icon: Trash2,
      iconBg: "bg-[#FF6B6B]",
      lightBg: "bg-[#FF6B6B]/10",
      title: "Your Rights",
      subtitle: "You're in control",
      points: [
        {
          title: "Right to Anonymity",
          desc: "We never associate confessions with your identity. That's our promise.",
          icon: UserX,
        },
        {
          title: "No Data Sales",
          desc: "We never sell or share your data with third parties. Never have, never will.",
          icon: Shield,
        },
        {
          title: "Content Removal",
          desc: "Need a confession removed? Contact us and we'll help you out.",
          icon: Trash2,
        },
        {
          title: "Full Transparency",
          desc: "This privacy policy explains everything we do with your data. No hidden clauses.",
          icon: FileText,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] relative overflow-hidden">
      {/* Decorative Clouds */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-[#E8F4FD] animate-float">
          <Cloud className="w-24 h-24" strokeWidth={1.5} />
        </div>
        <div className="absolute top-40 right-20 text-[#FDE8F0] animate-float-delayed">
          <Cloud className="w-32 h-32" strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-40 left-20 text-[#FEF7E8] animate-float">
          <Cloud className="w-20 h-20" strokeWidth={1.5} />
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b-[3px] border-[#2D3436]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/ceritaAnonLogo.png"
              alt="ceritaAnon"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain -mr-2 sm:-mr-3 self-center"
            />
            <span className="font-display font-bold text-lg sm:text-xl text-[#2D3436] leading-none">ceritaAnon</span>
          </a>

          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 font-display font-bold text-[#2D3436]"
          >
            <span className="text-sm hidden sm:inline group-hover:-translate-x-1 transition-transform">Back</span>
            <div className="w-10 h-10 rounded-full bg-[#1DD1A1] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[3px_3px_0px_#2D3436] group-hover:shadow-[4px_4px_0px_#2D3436] group-hover:-translate-y-0.5 group-active:shadow-[1px_1px_0px_#2D3436] group-active:translate-y-0.5 transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 sm:pt-24 pb-8 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#2D3436]">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#2D3436]" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2D3436] mb-3">
              Privacy Policy
            </h1>
            <p className="font-body text-[#636E72] max-w-lg mx-auto text-base sm:text-lg">
              Your anonymity is our promise. Learn how we protect your privacy.
            </p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#1DD1A1]/10 border-[2px] border-[#1DD1A1]">
              <CheckCircle2 className="w-4 h-4 text-[#1DD1A1]" />
              <span className="font-body text-sm text-[#1DD1A1] font-medium">Last updated: March 2026</span>
            </div>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-gradient-to-r from-[#4A90E2]/10 to-[#1DD1A1]/10 rounded-3xl border-[3px] border-[#4A90E2] p-6 mb-8 shadow-[4px_4px_0px_#4A90E2]">
            <h2 className="font-display text-xl font-bold text-[#2D3436] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#4A90E2] border-[2px] border-[#2D3436] flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </span>
              TL;DR
            </h2>
            <ul className="space-y-2 font-body text-[#2D3436]">
              <li className="flex items-start gap-2">
                <span className="text-[#1DD1A1] mt-1">✓</span>
                <span>We don't ask for your name, email, or any personal info</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1DD1A1] mt-1">✓</span>
                <span>Your IP address is hashed - we can't identify you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1DD1A1] mt-1">✓</span>
                <span>We don't sell or share your data with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1DD1A1] mt-1">✓</span>
                <span>Confessions are moderated before posting</span>
              </li>
            </ul>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] sm:shadow-[6px_6px_0px_#2D3436] p-5 sm:p-6 hover:-translate-y-1 transition-transform"
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${section.iconBg} border-[3px] border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-[#2D3436]">
                      {section.title}
                    </h2>
                    <p className="font-body text-sm text-[#636E72]">{section.subtitle}</p>
                  </div>
                </div>

                {/* Points Grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {section.points.map((point) => (
                    <div
                      key={point.title}
                      className={`${section.lightBg} rounded-2xl p-4 border-[2px] border-transparent hover:border-[#2D3436] transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border-[2px] border-[#2D3436] flex items-center justify-center shrink-0">
                          <point.icon className="w-4 h-4 text-[#2D3436]" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-[#2D3436] text-sm sm:text-base mb-1">
                            {point.title}
                          </h3>
                          <p className="font-body text-[#636E72] text-sm leading-relaxed">
                            {point.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Section */}
          <section className="mt-8 bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] p-6">
            <h2 className="font-display text-xl font-bold text-[#2D3436] mb-4 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#FF7EB3] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]">
                <Heart className="w-5 h-5 text-white" />
              </div>
              Questions or Concerns?
            </h2>
            <p className="font-body text-[#636E72] mb-4">
              If you have any questions about this Privacy Policy or need to request content removal, 
              please reach out to us. We're here to help!
            </p>
            <a
              href="mailto:privacy@anonconfess.app"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display font-semibold text-white bg-[#4A90E2] border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436] hover:shadow-[5px_5px_0px_#2D3436] hover:-translate-y-0.5 transition-all"
            >
              privacy@anonconfess.app
            </a>
          </section>

          {/* Disclaimer */}
          <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-[#FFD93D]/10 border-[3px] border-[#FFD93D]">
            <p className="font-body text-sm sm:text-base text-[#2D3436]">
              <strong className="font-display">💡 Pro Tip:</strong> While we take every precaution to protect 
              your anonymity, please avoid including personally identifiable information in your confessions 
              (names, addresses, specific dates/locations that could identify you or others).
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-[3px] border-[#2D3436] py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <a href="/" className="font-display font-bold text-xl text-[#2D3436]">
              ceritaAnon
            </a>
            
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-6">
              <a href="/about" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                About
              </a>
              <a href="/faq" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                FAQ
              </a>
              <a href="/privacy" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                Privacy
              </a>
              <a href="/admin" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                Admin
              </a>
              <a
                href="https://www.buymeacoffee.com/ikhmalhanif"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors flex items-center gap-1">
                <span>☕</span> Buy me a coffee
              </a>
              <span className="font-body text-sm text-[#B2BEC3]">Made with 💕</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-[#DFE6E9] text-center">
            <p className="font-body text-xs text-[#B2BEC3]">
              A safe space for the unspoken. Built with care and lots of doodles.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPage;
