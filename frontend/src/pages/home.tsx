import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ConfessionFormThreads } from "@/components/ui-custom/confession-form-threads";
import { useToastContext } from "@/hooks/use-toast";
import { confessionApi } from "@/api/client";

import { Heart, Feather, Cloud, Menu, X } from "lucide-react";
import { ThreadsIcon } from "@/components/ui-custom/threads-icon";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Shield02Icon,
  SquareLock02Icon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";
import "@/App.css";

// Scroll-triggered reveal component
function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 60, x: 0 };
      case "down":
        return { y: -60, x: 0 };
      case "left":
        return { y: 0, x: 60 };
      case "right":
        return { y: 0, x: -60 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}>
      {children}
    </motion.div>
  );
}

// Redesigned feature card
function FeatureCard({
  icon,
  title,
  description,
  color,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}>
      {/* Background card with shadow */}
      <motion.div
        className="bg-white rounded-[28px] border-[3px] border-[#2D3436] p-6 md:p-8 h-full relative overflow-hidden flex flex-col items-center text-center"
        style={{
          boxShadow: `6px 6px 0px ${color}`,
        }}
        whileHover={{
          y: -8,
          boxShadow: `10px 10px 0px ${color}`,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}>
        {/* Decorative corner accent */}
        <div
          className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
          style={{ backgroundColor: color }}
        />

        {/* Icon container */}
        <motion.div
          className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-[3px] border-[#2D3436]"
          style={{ backgroundColor: color }}
          whileHover={{
            rotate: [0, -5, 5, 0],
            scale: 1.05,
          }}
          transition={{ duration: 0.5 }}>
          {icon}

          {/* Shine effect */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative">
          <h3 className="font-display font-bold text-xl text-[#2D3436] mb-3 tracking-tight">
            {title}
          </h3>
          <p className="font-body text-[#636E72] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-0 left-6 right-6 h-1 rounded-full opacity-30"
          style={{ backgroundColor: color }}
        />
      </motion.div>
    </motion.div>
  );
}

function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToastContext();
  const mainRef = useRef<HTMLDivElement>(null);

  // Global scroll progress for parallax
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Parallax transforms for different layers
  const cloudY1 = useTransform(smoothScrollProgress, [0, 1], [0, -150]);
  const cloudY2 = useTransform(smoothScrollProgress, [0, 1], [0, -100]);
  const cloudY3 = useTransform(smoothScrollProgress, [0, 1], [0, -200]);
  const cloudY4 = useTransform(smoothScrollProgress, [0, 1], [0, -120]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (contents: string[], turnstileToken: string) => {
    setIsSubmitting(true);

    try {
      const response = await confessionApi.submitThread({
        contents,
        turnstileToken,
      });

      if (response.success) {
        toast({
          title: "Confession Submitted!",
          description: (
            <a
              href="https://threads.net/@ceritaanon_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#2D3436] hover:text-[#4A90E2] transition-colors leading-tight"
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-black shrink-0">
                <img src="/threads-app-icon.svg" alt="" className="w-3.5 h-3.5" />
              </span>
              <span className="hover:underline">Follow @ceritaanon_ to see it posted</span>
            </a>
          ),
          variant: "success",
        });
        setShowForm(false);
      } else {
        toast({
          title: "Oops! Something went wrong",
          description: response.error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description:
          error instanceof Error
            ? error.message
            : "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-[#FFFBF5] relative overflow-x-hidden">
      {/* Decorative Clouds with Parallax */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-[#E8F4FD]"
          style={{ y: cloudY1 }}>
          <motion.div
            animate={{
              x: [0, 10, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}>
            <Cloud className="w-24 h-24" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute top-40 right-20 text-[#FDE8F0]"
          style={{ y: cloudY2 }}>
          <motion.div
            animate={{
              x: [0, -15, 0],
              y: [0, 8, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}>
            <Cloud className="w-32 h-32" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-20 text-[#FEF7E8]"
          style={{ y: cloudY3 }}>
          <motion.div
            animate={{
              x: [0, 8, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}>
            <Cloud className="w-20 h-20" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-10 text-[#F3E8FD]"
          style={{ y: cloudY4 }}>
          <motion.div
            animate={{
              x: [0, -8, 0],
              y: [0, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}>
            <Cloud className="w-16 h-16" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>

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

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {["About", "FAQ", "Privacy"].map((item, i) => (
              <motion.a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="font-display font-medium text-[#636E72] hover:text-[#2D3436] transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                whileHover={{ y: -2 }}>
                {item}
              </motion.a>
            ))}
          </div>

          {/* Hamburger Menu Button - Mobile */}
          <motion.button
            className="md:hidden w-10 h-10 rounded-xl bg-white border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436] flex items-center justify-center text-[#2D3436]"
            onClick={() => setMobileMenuOpen(true)}
            whileTap={{ scale: 0.95, boxShadow: "1px 1px 0px #2D3436" }}
            whileHover={{ y: -1 }}>
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#FFFBF5] z-50 md:hidden shadow-[-8px_0_30px_rgba(0,0,0,0.1)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b-[3px] border-[#2D3436]">
                <span className="font-display font-bold text-lg text-[#2D3436]">
                  Menu
                </span>
                <motion.button
                  className="w-10 h-10 rounded-xl bg-white border-[3px] border-[#2D3436] shadow-[3px_3px_0px_#2D3436] flex items-center justify-center text-[#2D3436]"
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.95, boxShadow: "1px 1px 0px #2D3436" }}
                  whileHover={{ y: -1 }}>
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Drawer Links */}
              <nav className="p-4">
                {["About", "FAQ", "Privacy"].map((item, i) => (
                  <motion.a
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="block font-display font-medium text-xl text-[#2D3436] py-4 px-4 rounded-2xl hover:bg-white border-[3px] border-transparent hover:border-[#2D3436] hover:shadow-[4px_4px_0px_#2D3436] transition-all mb-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.1 }}
                    onClick={() => setMobileMenuOpen(false)}>
                    {item}
                  </motion.a>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t-[3px] border-[#2D3436]">
                <a
                  href="/admin"
                  className="flex items-center gap-2 font-body text-sm text-[#636E72] hover:text-[#2D3436] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}>
                  <Feather className="w-4 h-4" />
                  Admin Access
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>
              <h1 className="font-display text-5xl md:text-7xl font-black text-[#2D3436] leading-[1.1] tracking-tight">
                <span className="relative inline-block">
                  <span className="relative z-10">Confess it.</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-4 bg-[#FFD93D] -z-0 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  />
                </span>
                <br />
                <span className="relative inline-block mt-2">
                  <motion.span
                    className="inline-block"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}>
                    No one will know it&apos;s
                  </motion.span>{" "}
                  <span className="relative inline-block">
                    <motion.span
                      className="inline-block text-[#4A90E2] drop-shadow-[4px_4px_0px_rgba(45,52,54,1)]"
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, -3, 3, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}>
                      You
                    </motion.span>
                    <motion.span
                      className="absolute -right-6 -top-4 text-3xl"
                      animate={{
                        rotate: [0, 20, -20, 0],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}>
                      ✨
                    </motion.span>
                  </span>
                  <span className="text-[#2D3436]">.</span>
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="font-body text-lg md:text-xl text-[#636E72] max-w-xl mx-auto mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}>
              Sometimes strangers on the internet understand you better than
              people in real life{" "}
            </motion.p>

            <AnimatePresence mode="wait">
              {showForm ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: -40, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.92 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}>
                  <ConfessionFormThreads
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                    isSubmitting={isSubmitting}
                  />
                </motion.div>
              ) : (
                <>
                  {/* Speech Bubble Input */}
                  <motion.div
                    className="max-w-2xl mx-auto relative"
                    initial={{ opacity: 0, y: 60 }}
                    animate={mounted ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.8,
                      delay: 0.2,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    onClick={() => setShowForm(true)}>
                    {/* Floating decorative bubbles */}
                    <motion.div
                      className="absolute -left-8 top-8 w-6 h-6 rounded-full bg-[#FFD93D] border-[2px] border-[#2D3436]"
                      animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute -right-6 top-16 w-4 h-4 rounded-full bg-[#FF7EB3] border-[2px] border-[#2D3436]"
                      animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    />
                    <motion.div
                      className="absolute right-20 -top-4 w-8 h-8 rounded-full bg-[#4A90E2]/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.02, rotate: [0, -1, 1, 0] }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}>
                      {/* Main Bubble */}
                      <div className="bg-white rounded-[40px] border-[4px] border-[#2D3436] shadow-[10px_10px_0px_#2D3436] p-6 md:p-8 cursor-pointer hover:shadow-[14px_14px_0px_#2D3436] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                        {/* Shine effect */}
                        <div className="absolute top-0 left-8 w-20 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex items-start gap-5">
                          {/* Cartoon Avatar */}
                          <motion.div
                            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FFA502] border-[4px] border-[#2D3436] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#2D3436]"
                            animate={{
                              rotate: [0, 8, -8, 0],
                              y: [0, -3, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}>
                            <span className="font-display font-bold text-2xl text-[#2D3436]">
                              ?
                            </span>
                            {/* Eyes */}
                            <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-[#2D3436] rounded-full" />
                            <div className="absolute top-4 right-3 w-1.5 h-1.5 bg-[#2D3436] rounded-full" />
                          </motion.div>

                          {/* Input Area */}
                          <div className="flex-1 text-left pt-2">
                            <p className="font-body text-[#B2BEC3] text-lg mb-4">
                              Write your secret here...{" "}
                              <motion.span
                                className="inline-block"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                }}>
                                |
                              </motion.span>
                            </p>

                            {/* Animated placeholder lines */}
                            <div className="space-y-3">
                              <motion.div
                                className="h-3 bg-gradient-to-r from-[#DFE6E9] to-[#E8F4FD] rounded-full w-3/4 border-[1px] border-[#DFE6E9]"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                style={{ originX: 0 }}
                              />
                              <motion.div
                                className="h-3 bg-gradient-to-r from-[#DFE6E9] to-[#FDE8F0] rounded-full w-1/2 border-[1px] border-[#DFE6E9]"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                                style={{ originX: 0 }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Post It Button */}
                        <div className="flex justify-end mt-6">
                          <motion.button
                            className="relative px-8 py-3 rounded-full font-display font-bold text-base bg-[#FF7EB3] text-white border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] group-hover:shadow-[6px_6px_0px_#2D3436] group-hover:-translate-y-1 transition-all flex items-center gap-2 overflow-hidden"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}>
                            <span className="relative z-10">Post It!</span>
                            <motion.div
                              className="relative z-10"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}>
                              <Heart className="w-5 h-5 fill-white" />
                            </motion.div>
                            {/* Button shine */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Speech Bubble Tail - Cartoon style */}
                      <div className="absolute -bottom-6 left-20 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[24px] border-t-[#2D3436]"></div>
                      <div className="absolute -bottom-[18px] left-[83px] w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[18px] border-t-white"></div>

                      {/* Small bubbles */}
                      <motion.div
                        className="absolute -bottom-10 left-28 w-4 h-4 rounded-full bg-white border-[3px] border-[#2D3436]"
                        animate={{ y: [0, -5, 0], opacity: [1, 0.7, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.3,
                        }}
                      />
                      <motion.div
                        className="absolute -bottom-12 left-36 w-3 h-3 rounded-full bg-white border-[2px] border-[#2D3436]"
                        animate={{ y: [0, -3, 0], opacity: [1, 0.6, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.6,
                        }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Why We're Different Section */}
                  <ScrollReveal delay={0.1}>
                    <div className="mt-32">
                      {/* Section Header */}
                      <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2D3436] mb-3">
                          Your Thoughts. No Judgement
                        </h2>
                        <p className="font-body text-[#636E72] max-w-md mx-auto">
                          Safe, secure, and absolutely adorable. Your secrets
                          are safe with us.
                        </p>
                      </motion.div>

                      {/* Feature Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <FeatureCard
                          icon={
                            <HugeiconsIcon
                              icon={Shield02Icon}
                              size={44}
                              color="#2D3436"
                              strokeWidth={2}
                            />
                          }
                          title="Always Protected"
                          description="No accounts, No tracking, No personal data. Just your thoughts, safely shared."
                          color="#FFD93D"
                          delay={0}
                        />
                        <FeatureCard
                          icon={
                            <HugeiconsIcon
                              icon={SquareLock02Icon}
                              size={44}
                              color="white"
                              strokeWidth={2}
                            />
                          }
                          title="Top Secret"
                          description="Stay anonymous your words may travel. Your Identity never does."
                          color="#4A90E2"
                          delay={0.15}
                        />
                        <FeatureCard
                          icon={
                            <HugeiconsIcon
                              icon={FavouriteIcon}
                              size={44}
                              color="white"
                              strokeWidth={2}
                            />
                          }
                          title="Safe Space"
                          description="Say what you've been holding in. Someone out there might feel the same."
                          color="#FF7EB3"
                          delay={0.3}
                        />
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Threads CTA Banner */}
                  <ScrollReveal delay={0.4}>
                    <section className="mt-16 md:mt-24 px-4">
                      <div className="max-w-3xl mx-auto">
                        <motion.div
                          className="bg-gradient-to-r from-[#4A90E2]/10 to-[#9B59B6]/10 rounded-3xl border-[3px] border-[#4A90E2] p-6 md:p-8"
                          style={{ boxShadow: "6px 6px 0px #4A90E2" }}
                          whileHover={{
                            y: -8,
                            boxShadow: "10px 10px 0px #4A90E2",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}>
                          <div className="flex flex-col sm:flex-row items-center gap-6">
                            <motion.div
                              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#4A90E2] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[4px_4px_0px_#2D3436]"
                              animate={{ rotate: [0, -5, 5, 0] }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}>
                              <ThreadsIcon size={40} className="text-white" />
                            </motion.div>

                            <div className="flex-1 text-center sm:text-left">
                              <h3 className="font-display text-xl md:text-2xl font-bold text-[#2D3436]">
                                Follow us on Threads!
                              </h3>
                              <p className="font-body text-[#636E72] mt-2">
                                See your confession posted anonymously. Join our
                                growing community!
                              </p>
                            </div>

                            <motion.a
                              href="https://threads.net/@ceritaanon_"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 rounded-full font-display font-bold text-base bg-[#4A90E2] text-white border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] flex items-center gap-2 whitespace-nowrap"
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
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                              }}>
                              <ThreadsIcon size={20} className="text-white" />
                              Follow @ceritaanon
                            </motion.a>
                          </div>
                        </motion.div>
                      </div>
                    </section>
                  </ScrollReveal>
                </>
              )}
            </AnimatePresence>
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

      {/* Floating Action Button (Mobile) */}
      <AnimatePresence>
        {!showForm && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#FF7EB3] text-white rounded-full border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] flex items-center justify-center hover:shadow-[6px_6px_0px_#2D3436] hover:-translate-y-1 transition-all active:shadow-[2px_2px_0px_#2D3436] active:translate-y-0 z-40 md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}>
            <Feather className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HomePage;
