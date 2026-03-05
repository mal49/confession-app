import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Feather,
  ArrowLeft,
  Cloud,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Shield,
  Eye,
  Clock,
  Ban,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      icon: Shield,
      iconBg: "bg-[#FFD93D]",
      question: "Is my confession really anonymous?",
      answer: "Absolutely! We don't ask for your name, email, or any personal information. Your IP address is hashed (one-way encrypted) for rate limiting only—we can't reverse it to identify you. We genuinely have no way of knowing who you are.",
    },
    {
      icon: Eye,
      iconBg: "bg-[#4A90E2]",
      question: "Who can see my confession?",
      answer: "First, your confession goes to our moderation queue where only our admin reviews it. If approved, it gets posted anonymously to our public Threads account. Your identity is never revealed at any stage.",
    },
    {
      icon: Clock,
      iconBg: "bg-[#9B59B6]",
      question: "How long does approval take?",
      answer: "We aim to review confessions within 24 hours. During busy periods, it might take a bit longer. Please be patient—we read every submission carefully to ensure it meets our community guidelines.",
    },
    {
      icon: MessageCircle,
      iconBg: "bg-[#FF7EB3]",
      question: "Can I write a long confession?",
      answer: "Yes! You can write up to 800 characters. If your confession is longer, our system can automatically split it into a thread (up to 10 posts). Each post in a thread has a 500 character limit.",
    },
    {
      icon: Ban,
      iconBg: "bg-[#FF6B6B]",
      question: "What kind of confessions are not allowed?",
      answer: "We don't allow hate speech, harassment, threats, explicit sexual content, or anything illegal. We also remove content that could identify specific individuals without their consent. Keep it respectful!",
    },
    {
      icon: Heart,
      iconBg: "bg-[#1DD1A1]",
      question: "Can I delete my confession after posting?",
      answer: "Since confessions are completely anonymous, we can't verify that you're the original author. However, if you see your confession on Threads and want it removed, contact us through DMs and we'll do our best to help.",
    },
  ];

  const quickTips = [
    "Be honest and authentic",
    "Avoid names and identifying details",
    "Keep it respectful",
    "No spam or promotions",
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
            <div className="w-10 h-10 rounded-full bg-[#4A90E2] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[3px_3px_0px_#2D3436] group-hover:shadow-[4px_4px_0px_#2D3436] group-hover:-translate-y-0.5 group-active:shadow-[1px_1px_0px_#2D3436] group-active:translate-y-0.5 transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A90E2]/20 border-[2px] border-[#4A90E2] mb-6">
              <HelpCircle className="w-4 h-4 text-[#4A90E2]" />
              <span className="font-body text-sm text-[#2D3436] font-medium">Got Questions?</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#2D3436] mb-4">
              Frequently Asked
              <span className="text-[#FF7EB3]"> Questions</span>
            </h1>

            <p className="font-body text-lg text-[#636E72] max-w-xl mx-auto">
              Everything you need to know about ceritaAnon. Can&apos;t find what you&apos;re looking for? 
              Reach out to us on Threads!
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white rounded-3xl border-[3px] border-[#2D3436] overflow-hidden transition-all duration-300",
                  openIndex === index ? "shadow-[6px_6px_0px_#2D3436]" : "shadow-[4px_4px_0px_#2D3436] hover:shadow-[6px_6px_0px_#2D3436]"
                )}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className={`w-12 h-12 rounded-2xl ${faq.iconBg} border-[3px] border-[#2D3436] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#2D3436]`}>
                    <faq.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="flex-1 font-display text-lg font-bold text-[#2D3436]">
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full border-[3px] border-[#2D3436] flex items-center justify-center transition-transform duration-300",
                    openIndex === index ? "bg-[#FFD93D] rotate-180" : "bg-white"
                  )}>
                    <ChevronDown className="w-4 h-4 text-[#2D3436]" />
                  </div>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    openIndex === index ? "max-h-96" : "max-h-0"
                  )}
                >
                  <div className="px-5 pb-5 pt-0">
                    <div className="pl-16">
                      <p className="font-body text-[#636E72] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tips Section */}
        <section className="px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#FEF7E8] rounded-3xl border-[3px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]">
                  <Feather className="w-6 h-6 text-[#2D3436]" />
                </div>
                <h2 className="font-display text-2xl font-bold text-[#2D3436]">
                  Quick Tips for Great Confessions
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {quickTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white rounded-2xl border-[2px] border-[#2D3436] p-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1DD1A1] border-[2px] border-[#2D3436] flex items-center justify-center font-display font-bold text-white text-sm">
                      {index + 1}
                    </div>
                    <span className="font-body text-[#2D3436] font-medium">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-r from-[#FF7EB3]/20 to-[#9B59B6]/20 rounded-3xl border-[3px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] p-8">
              <div className="w-16 h-16 rounded-full bg-[#FF7EB3] border-[3px] border-[#2D3436] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#2D3436]">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#2D3436] mb-3">
                Still Have Questions?
              </h2>
              <p className="font-body text-[#636E72] mb-6">
                Can&apos;t find the answer you&apos;re looking for? Reach out to us on our 
                Threads account and we&apos;ll get back to you as soon as possible.
              </p>
              <a
                href="https://threads.net"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-display font-bold text-white bg-[#4A90E2] border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] hover:shadow-[6px_6px_0px_#2D3436] hover:-translate-y-0.5 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Message us on Threads
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-[3px] border-[#2D3436] py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/ceritaAnonLogo.png"
                alt="ceritaAnon"
                className="w-12 h-12 object-contain"
              />
              <span className="font-display font-bold text-lg text-[#2D3436]">ceritaAnon</span>
            </a>
            
            <div className="flex items-center gap-6">
              <a href="/about" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                About
              </a>
              <a href="/faq" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                FAQ
              </a>
              <a href="/privacy" className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                Privacy
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

export default FAQPage;
