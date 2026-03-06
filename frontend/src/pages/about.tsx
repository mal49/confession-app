import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Shield,
  Lock,
  Sparkles,
  Users,
  MessageCircle,
  Send,
  Eye,
} from "lucide-react";
import { ThreadsIcon } from "@/components/ui-custom/threads-icon";
import { AnimatedClouds } from "@/components/ui-custom/animated-clouds";
import { ScrollReveal } from "@/components/ui-custom/scroll-reveal";

function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Shield,
      iconBg: "bg-[#FFD93D]",
      title: "Anonymous First",
      description:
        "We never ask for your name, email, or any personal information. Your identity stays completely hidden.",
      color: "#FFD93D",
    },
    {
      icon: Heart,
      iconBg: "bg-[#FF7EB3]",
      title: "Judgment-Free Zone",
      description:
        "Share your thoughts without fear. Our community is built on empathy and understanding, not criticism.",
      color: "#FF7EB3",
    },
    {
      icon: Lock,
      iconBg: "bg-[#4A90E2]",
      title: "Secure & Private",
      description:
        "Your data is encrypted and protected. We hash IP addresses and never track or share your information.",
      color: "#4A90E2",
    },
    {
      icon: Eye,
      iconBg: "bg-[#9B59B6]",
      title: "Moderated Content",
      description:
        "Every confession is reviewed to ensure a safe, respectful environment for everyone.",
      color: "#9B59B6",
    },
  ];

  const stats = [
    { value: "100%", label: "Anonymous" },
    { value: "0", label: "Data Sold" },
    { value: "∞", label: "Safe Space" },
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
              className="w-10 h-10 rounded-full bg-[#FF7EB3] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[3px_3px_0px_#2D3436]"
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
        <section className="px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD93D]/20 border-[2px] border-[#FFD93D] mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}>
                <Sparkles className="w-4 h-4 text-[#FFD93D]" />
                <span className="font-body text-sm text-[#2D3436] font-medium">
                  Our Story
                </span>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-[#2D3436] mb-6">
                A Safe Space for
                <span className="relative inline-block ml-2">
                  <span className="text-[#FF7EB3]">Unspoken Words</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-3 bg-[#FFD93D]/50 -z-0 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  />
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="font-body text-lg md:text-xl text-[#636E72] max-w-2xl mx-auto mb-8">
                ceritaAnon was born from a simple idea: everyone deserves a
                place to share their thoughts freely, without judgment or fear.
                We&apos;re here to listen, one confession at a time.
              </p>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}>
                    <motion.div
                      className="font-display text-4xl md:text-5xl font-bold text-[#2D3436] mb-1"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}>
                      {stat.value}
                    </motion.div>
                    <div className="font-body text-sm text-[#636E72]">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-4 py-12 bg-white border-y-[3px] border-[#2D3436]">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <ScrollReveal direction="left">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2D3436] mb-4">
                    Our Mission
                  </h2>
                  <p className="font-body text-[#636E72] mb-4">
                    We believe in the power of sharing. Sometimes, the heaviest
                    burdens become lighter when spoken aloud—even to strangers.
                    ceritaAnon provides that outlet.
                  </p>
                  <p className="font-body text-[#636E72] mb-4">
                    Every confession is a story. Every story matters. By
                    creating a judgment-free space, we hope to foster empathy
                    and connection in a world that often feels disconnected.
                  </p>
                  <motion.div
                    className="flex items-center gap-3 mt-6"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}>
                    <motion.div
                      className="w-12 h-12 rounded-full bg-[#1DD1A1] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]"
                      whileHover={{ rotate: 10 }}>
                      <Send className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-display font-bold text-[#2D3436]">
                        Posted to Threads
                      </p>
                      <p className="font-body text-sm text-[#636E72]">
                        Approved confessions are shared anonymously
                      </p>
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <motion.div
                  className="bg-[#E8F4FD] rounded-3xl border-[3px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] p-8"
                  whileHover={{
                    y: -8,
                    boxShadow: "10px 10px 0px #2D3436",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#2D3436]"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}>
                    <MessageCircle className="w-8 h-8 text-[#2D3436]" />
                  </motion.div>
                  <p className="font-display text-xl font-bold text-[#2D3436] text-center mb-2">
                    &ldquo;Your voice matters&rdquo;
                  </p>
                  <p className="font-body text-[#636E72] text-center">
                    Whether it is a secret, a regret, or a random thought—share
                    it here. We are listening.
                  </p>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2D3436] mb-4">
                  What We Stand For
                </h2>
                <p className="font-body text-[#636E72] max-w-xl mx-auto">
                  Our core values guide everything we do, from how we build our
                  platform to how we treat every confession.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <ScrollReveal key={value.title} delay={index * 0.1}>
                  <motion.div
                    className="bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] p-6 h-full"
                    style={{ boxShadow: `4px 4px 0px ${value.color}` }}
                    whileHover={{
                      y: -8,
                      boxShadow: `8px 8px 0px ${value.color}`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}>
                    <div className="flex items-start gap-4">
                      <motion.div
                        className={`w-14 h-14 rounded-2xl ${value.iconBg} border-[3px] border-[#2D3436] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#2D3436]`}
                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                        transition={{ duration: 0.5 }}>
                        <value.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-[#2D3436] mb-2">
                          {value.title}
                        </h3>
                        <p className="font-body text-[#636E72]">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16 bg-[#E8F4FD]/30">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2D3436] text-center mb-12">
                How It Works
              </h2>
            </ScrollReveal>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Write Your Confession",
                  description:
                    "Share what is on your mind. No sign-up required, completely anonymous.",
                  color: "bg-[#FFD93D]",
                  hex: "#FFD93D",
                },
                {
                  step: "2",
                  title: "Submit for Review",
                  description:
                    "Your confession goes to our moderation queue to ensure it meets our community guidelines.",
                  color: "bg-[#FF7EB3]",
                  hex: "#FF7EB3",
                },
                {
                  step: "3",
                  title: "Get Posted",
                  description:
                    "Approved confessions are shared anonymously on our Threads account for the community to see.",
                  color: "bg-[#1DD1A1]",
                  hex: "#1DD1A1",
                },
              ].map((item, index) => (
                <ScrollReveal key={item.step} delay={index * 0.15}>
                  <motion.div
                    className="flex items-center gap-6 bg-white rounded-3xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] p-6"
                    style={{ boxShadow: `4px 4px 0px ${item.hex}` }}
                    whileHover={{
                      y: -4,
                      boxShadow: `8px 8px 0px ${item.hex}`,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}>
                    <motion.div
                      className={`w-14 h-14 rounded-2xl ${item.color} border-[3px] border-[#2D3436] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#2D3436]`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}>
                      <span className="font-display text-2xl font-bold text-white">
                        {item.step}
                      </span>
                    </motion.div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#2D3436] mb-1">
                        {item.title}
                      </h3>
                      <p className="font-body text-[#636E72]">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <motion.div
                className="bg-gradient-to-r from-[#FFD93D]/20 to-[#FF7EB3]/20 rounded-3xl border-[3px] border-[#2D3436] shadow-[6px_6px_0px_#2D3436] p-8 md:p-12"
                whileHover={{
                  y: -8,
                  boxShadow: "10px 10px 0px #2D3436",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <motion.div
                  className="w-16 h-16 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#2D3436]"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}>
                  <Users className="w-8 h-8 text-[#2D3436]" />
                </motion.div>
                <h2 className="font-display text-3xl font-bold text-[#2D3436] mb-4">
                  Ready to Share?
                </h2>
                <p className="font-body text-[#636E72] mb-6">
                  Join thousands of others who have found comfort in sharing
                  their unspoken words. Your confession is safe with us.
                </p>
                <motion.button
                  onClick={() => navigate("/")}
                  className="px-8 py-4 rounded-full font-display font-bold text-lg bg-[#FF7EB3] text-white border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436]"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "8px 8px 0px #2D3436",
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                    boxShadow: "2px 2px 0px #2D3436",
                    y: 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  Start Confessing
                </motion.button>
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

export default AboutPage;
