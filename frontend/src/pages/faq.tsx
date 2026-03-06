import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Feather,
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Shield,
  Eye,
  Clock,
  Ban,
  Heart,
} from "lucide-react";
import { ThreadsIcon } from "@/components/ui-custom/threads-icon";
import { AnimatedClouds } from "@/components/ui-custom/animated-clouds";
import { ScrollReveal } from "@/components/ui-custom/scroll-reveal";
import { cn } from "@/lib/utils";

function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      icon: Shield,
      iconBg: "bg-[#FFD93D]",
      hex: "#FFD93D",
      question: "Is my confession really anonymous?",
      answer:
        "Absolutely! We don't ask for your name, email, or any personal information. Your IP address is hashed (one-way encrypted) for rate limiting only—we can't reverse it to identify you. We genuinely have no way of knowing who you are.",
    },
    {
      icon: Eye,
      iconBg: "bg-[#4A90E2]",
      hex: "#4A90E2",
      question: "Who can see my confession?",
      answer:
        "First, your confession goes to our moderation queue where only our admin reviews it. If approved, it gets posted anonymously to our public Threads account. Your identity is never revealed at any stage.",
    },
    {
      icon: Clock,
      iconBg: "bg-[#9B59B6]",
      hex: "#9B59B6",
      question: "How long does approval take?",
      answer:
        "We aim to review confessions within 24 hours. During busy periods, it might take a bit longer. Please be patient—we read every submission carefully to ensure it meets our community guidelines.",
    },
    {
      icon: MessageCircle,
      iconBg: "bg-[#FF7EB3]",
      hex: "#FF7EB3",
      question: "Can I write a long confession?",
      answer:
        "Yes! You can write up to 800 characters. If your confession is longer, our system can automatically split it into a thread (up to 10 posts). Each post in a thread has a 500 character limit.",
    },
    {
      icon: Ban,
      iconBg: "bg-[#FF6B6B]",
      hex: "#FF6B6B",
      question: "What kind of confessions are not allowed?",
      answer:
        "We don't allow hate speech, harassment, threats, explicit sexual content, or anything illegal. We also remove content that could identify specific individuals without their consent. Keep it respectful!",
    },
    {
      icon: Heart,
      iconBg: "bg-[#1DD1A1]",
      hex: "#1DD1A1",
      question: "Can I delete my confession after posting?",
      answer:
        "Since confessions are completely anonymous, we can't verify that you're the original author. However, if you see your confession on Threads and want it removed, contact us through DMs and we'll do our best to help.",
    },
  ];

  const quickTips = [
    "Be honest and authentic",
    "Avoid names and identifying details",
    "Keep it respectful",
    "No spam or promotions",
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] relative overflow-x-hidden">
      {/* Animated Decorative Clouds with Parallax */}
      <AnimatedClouds />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-[#FFFBF5]/90 backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}>
            <img
              src="/ceritaAnonLogo.png"
              alt="ceritaAnon"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain -mr-2 sm:-mr-3 self-center"
            />
            <span className="font-display font-bold text-lg sm:text-xl text-[#2D3436] leading-none">
              ceritaAnon
            </span>
          </motion.a>

          {/* Back Button */}
          <motion.button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 font-display font-bold text-[#2D3436]"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}>
            <span className="text-sm hidden sm:inline">Back</span>
            <motion.div
              className="w-10 h-10 rounded-full bg-[#4A90E2] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[3px_3px_0px_#2D3436]"
              whileHover={{
                boxShadow: "4px 4px 0px #2D3436",
                y: -2,
              }}
              whileTap={{
                boxShadow: "1px 1px 0px #2D3436",
                y: 0,
              }}>
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A90E2]/20 border-[2px] border-[#4A90E2] mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}>
                <HelpCircle className="w-4 h-4 text-[#4A90E2]" />
                <span className="font-body text-sm text-[#2D3436] font-medium">
                  Got Questions?
                </span>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-[#2D3436] mb-4">
                Frequently Asked
                <span className="relative inline-block ml-2">
                  <span className="text-[#FF7EB3]">Questions</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-3 bg-[#4A90E2]/30 -z-0 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  />
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="font-body text-lg text-[#636E72] max-w-xl mx-auto">
                Everything you need to know about ceritaAnon. Can&apos;t find
                what you&apos;re looking for? Reach out to us on Threads!
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.05}>
                <motion.div
                  className={cn(
                    "bg-white rounded-3xl border-[3px] border-[#2D3436] overflow-hidden transition-all duration-300",
                    openIndex === index
                      ? "shadow-[6px_6px_0px_#2D3436]"
                      : "shadow-[4px_4px_0px_#2D3436] hover:shadow-[6px_6px_0px_#2D3436]",
                  )}
                  style={{
                    boxShadow:
                      openIndex === index
                        ? `6px 6px 0px ${faq.hex}`
                        : `4px 4px 0px ${faq.hex}`,
                  }}
                  whileHover={{ y: openIndex === index ? 0 : -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full flex items-center gap-4 p-5 text-left">
                    <motion.div
                      className={`w-12 h-12 rounded-2xl ${faq.iconBg} border-[3px] border-[#2D3436] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#2D3436]`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                      transition={{ duration: 0.5 }}>
                      <faq.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="flex-1 font-display text-lg font-bold text-[#2D3436]">
                      {faq.question}
                    </span>
                    <motion.div
                      className={cn(
                        "w-8 h-8 rounded-full border-[3px] border-[#2D3436] flex items-center justify-center transition-colors duration-300",
                        openIndex === index ? "bg-[#FFD93D]" : "bg-white",
                      )}
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}>
                      <ChevronDown className="w-4 h-4 text-[#2D3436]" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <div className="px-5 pb-5 pt-0">
                          <div className="pl-16">
                            <p className="font-body text-[#636E72] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Quick Tips Section */}
        <section className="px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <motion.div
                className="bg-[#FEF7E8] rounded-3xl border-[3px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] p-8"
                style={{ boxShadow: "6px 6px 0px #FFD93D" }}
                whileHover={{
                  y: -8,
                  boxShadow: "10px 10px 0px #FFD93D",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}>
                    <Feather className="w-6 h-6 text-[#2D3436]" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-[#2D3436]">
                    Quick Tips for Great Confessions
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {quickTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 bg-white rounded-2xl border-[2px] border-[#2D3436] p-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}>
                      <motion.div
                        className="w-8 h-8 rounded-full bg-[#1DD1A1] border-[2px] border-[#2D3436] flex items-center justify-center font-display font-bold text-white text-sm"
                        whileHover={{ scale: 1.1, rotate: 10 }}>
                        {index + 1}
                      </motion.div>
                      <span className="font-body text-[#2D3436] font-medium">
                        {tip}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <motion.div
                className="bg-gradient-to-r from-[#FF7EB3]/20 to-[#9B59B6]/20 rounded-3xl border-[3px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] p-8"
                style={{ boxShadow: "6px 6px 0px #FF7EB3" }}
                whileHover={{
                  y: -8,
                  boxShadow: "10px 10px 0px #FF7EB3",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <motion.div
                  className="w-16 h-16 rounded-full bg-[#FF7EB3] border-[3px] border-[#2D3436] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#2D3436]"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}>
                  <MessageCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="font-display text-2xl font-bold text-[#2D3436] mb-3">
                  Still Have Questions?
                </h2>
                <p className="font-body text-[#636E72] mb-6">
                  Can&apos;t find the answer you&apos;re looking for? Reach out
                  to us on our Threads account and we&apos;ll get back to you as
                  soon as possible.
                </p>
                <motion.a
                  href="https://threads.net/@ceritaanon_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-display font-bold text-white bg-[#4A90E2] border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436]"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "6px 6px 0px #2D3436",
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                    boxShadow: "2px 2px 0px #2D3436",
                    y: 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <MessageCircle className="w-5 h-5" />
                  Message us on Threads
                </motion.a>
              </motion.div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-[3px] border-[#2D3436] py-6 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            {/* Logo */}
            <a
              href="/"
              className="font-display font-bold text-lg text-[#2D3436] hover:text-[#4A90E2] transition-colors">
              ceritaAnon
            </a>

            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-1">
              <a
                href="/about"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                About
              </a>
              <a
                href="/faq"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                FAQ
              </a>
              <a
                href="/privacy"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                Privacy
              </a>
              <a
                href="/admin"
                className="font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors">
                Admin
              </a>
              <span className="hidden sm:inline text-[#DFE6E9] mx-1">|</span>
              <span className="inline-flex items-center gap-3">
                <a
                  href="https://threads.net/@ceritaanon_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-[#636E72] hover:text-[#4A90E2] transition-colors inline-flex items-center gap-1.5 group whitespace-nowrap">
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <ThreadsIcon size={14} />
                  </span>
                  <span>Threads</span>
                </a>
                <a
                  href="https://www.buymeacoffee.com/ikhmalhanif"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-[#636E72] hover:text-[#FF7EB3] transition-colors inline-flex items-center gap-1 whitespace-nowrap">
                  <span>☕</span>
                  <span>Support</span>
                </a>
              </span>
            </nav>

            {/* Made with love */}
            <span className="font-body text-xs text-[#B2BEC3]">
              Made with 💕
            </span>
          </motion.div>

          <motion.p
            className="mt-4 pt-4 border-t border-[#DFE6E9] text-center font-body text-xs text-[#B2BEC3]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}>
            A safe space for the unspoken. Built with care and lots of doodles.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}

export default FAQPage;
