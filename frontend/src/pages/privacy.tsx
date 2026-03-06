import { motion } from "framer-motion";
import {
  Shield,
  ArrowLeft,
  Lock,
  Eye,
  Trash2,
  Server,
  Heart,
  CheckCircle2,
  FileText,
  Key,
  UserX,
  Clock,
} from "lucide-react";
import { ThreadsIcon } from "@/components/ui-custom/threads-icon";
import { useNavigate } from "react-router-dom";
import { AnimatedClouds } from "@/components/ui-custom/animated-clouds";
import { ScrollReveal } from "@/components/ui-custom/scroll-reveal";

function PrivacyPage() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Eye,
      iconBg: "bg-[#4A90E2]",
      hex: "#4A90E2",
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
      hex: "#FFD93D",
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
      hex: "#9B59B6",
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
      hex: "#FF6B6B",
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
              className="w-10 h-10 rounded-full bg-[#1DD1A1] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[3px_3px_0px_#2D3436]"
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
      <main className="pt-20 sm:pt-24 pb-8 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <ScrollReveal>
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#2D3436]"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}>
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#2D3436]" />
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2D3436] mb-3">
                Privacy Policy
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="font-body text-[#636E72] max-w-lg mx-auto text-base sm:text-lg">
                Your anonymity is our promise. Learn how we protect your
                privacy.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <motion.div
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#1DD1A1]/10 border-[2px] border-[#1DD1A1]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}>
                <CheckCircle2 className="w-4 h-4 text-[#1DD1A1]" />
                <span className="font-body text-sm text-[#1DD1A1] font-medium">
                  Last updated: March 2026
                </span>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Quick Summary Card */}
          <ScrollReveal>
            <motion.div
              className="bg-gradient-to-r from-[#4A90E2]/10 to-[#1DD1A1]/10 rounded-3xl border-[3px] border-[#4A90E2] p-6 mb-8"
              style={{ boxShadow: "4px 4px 0px #4A90E2" }}
              whileHover={{
                y: -8,
                boxShadow: "8px 8px 0px #4A90E2",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <h2 className="font-display text-xl font-bold text-[#2D3436] mb-3 flex items-center gap-2">
                <motion.span
                  className="w-8 h-8 rounded-lg bg-[#4A90E2] border-[2px] border-[#2D3436] flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <Heart className="w-4 h-4 text-white" />
                </motion.span>
                TL;DR
              </h2>
              <ul className="space-y-2 font-body text-[#2D3436]">
                {[
                  "We don't ask for your name, email, or any personal info",
                  "Your IP address is hashed - we can't identify you",
                  "We don't sell or share your data with anyone",
                  "Confessions are moderated before posting",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}>
                    <span className="text-[#1DD1A1] mt-1">✓</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </ScrollReveal>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <ScrollReveal key={section.title} delay={sectionIndex * 0.1}>
                <motion.section
                  className="bg-white rounded-3xl border-[3px] border-[#2D3436] p-5 sm:p-6"
                  style={{ boxShadow: `4px 4px 0px ${section.hex}` }}
                  whileHover={{
                    y: -8,
                    boxShadow: `8px 8px 0px ${section.hex}`,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className={`w-12 h-12 rounded-2xl ${section.iconBg} border-[3px] border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]`}
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                      transition={{ duration: 0.5 }}>
                      <section.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="font-display text-lg sm:text-xl font-bold text-[#2D3436]">
                        {section.title}
                      </h2>
                      <p className="font-body text-sm text-[#636E72]">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Points Grid */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {section.points.map((point, pointIndex) => (
                      <motion.div
                        key={point.title}
                        className={`${section.lightBg} rounded-2xl p-4 border-[2px] border-transparent hover:border-[#2D3436] transition-colors`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: pointIndex * 0.1 }}
                        whileHover={{ x: 4 }}>
                        <div className="flex items-start gap-3">
                          <motion.div
                            className="w-8 h-8 rounded-lg bg-white border-[2px] border-[#2D3436] flex items-center justify-center shrink-0"
                            whileHover={{ scale: 1.1, rotate: 5 }}>
                            <point.icon className="w-4 h-4 text-[#2D3436]" />
                          </motion.div>
                          <div>
                            <h3 className="font-display font-bold text-[#2D3436] text-sm sm:text-base mb-1">
                              {point.title}
                            </h3>
                            <p className="font-body text-[#636E72] text-sm leading-relaxed">
                              {point.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </ScrollReveal>
            ))}
          </div>

          {/* Contact Section */}
          <ScrollReveal>
            <motion.section
              className="mt-8 bg-white rounded-3xl border-[3px] border-[#2D3436] p-6"
              style={{ boxShadow: "6px 6px 0px #FF7EB3" }}
              whileHover={{
                y: -8,
                boxShadow: "10px 10px 0px #FF7EB3",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <h2 className="font-display text-xl font-bold text-[#2D3436] mb-4 flex items-center gap-2">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-[#FF7EB3] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]"
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}>
                  <Heart className="w-5 h-5 text-white" />
                </motion.div>
                Questions or Concerns?
              </h2>
              <p className="font-body text-[#636E72] mb-4">
                If you have any questions about this Privacy Policy or need to
                request content removal, please reach out to us. We&apos;re here
                to help!
              </p>
              <motion.a
                href="mailto:mail@ceritaanon.xyz"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-display font-semibold text-white bg-[#4A90E2] border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436]"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "5px 5px 0px #2D3436",
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                  boxShadow: "1px 1px 0px #2D3436",
                  y: 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                mail@ceritaanon.xyz
              </motion.a>
            </motion.section>
          </ScrollReveal>

          {/* Disclaimer */}
          <ScrollReveal>
            <motion.div
              className="mt-8 p-5 sm:p-6 rounded-3xl bg-[#FFD93D]/10 border-[3px] border-[#FFD93D]"
              style={{ boxShadow: "4px 4px 0px #FFD93D" }}
              whileHover={{
                y: -4,
                boxShadow: "6px 6px 0px #FFD93D",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <p className="font-body text-sm sm:text-base text-[#2D3436]">
                <strong className="font-display">💡 Pro Tip:</strong> While we
                take every precaution to protect your anonymity, please avoid
                including personally identifiable information in your
                confessions (names, addresses, specific dates/locations that
                could identify you or others).
              </p>
            </motion.div>
          </ScrollReveal>
        </div>
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

export default PrivacyPage;
