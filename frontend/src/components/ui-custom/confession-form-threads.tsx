import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Turnstile from "react-turnstile";
import {
  Loader2,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfessionFormThreadsProps {
  onSubmit?: (
    contents: string[],
    turnstileToken: string,
  ) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
const MAX_CHARS = 500;
const MIN_CHARS = 10;

interface ThreadPost {
  id: number;
  content: string;
}

function getCharStatus(length: number) {
  const valid = length >= MIN_CHARS && length <= MAX_CHARS;
  let color = "text-[#636E72]";
  let bgColor = "bg-[#F0F0F0]";

  if (length > MAX_CHARS) {
    color = "text-[#FF6B6B]";
    bgColor = "bg-[#FF6B6B]/10";
  } else if (length >= MIN_CHARS) {
    color = "text-[#1DD1A1]";
    bgColor = "bg-[#1DD1A1]/10";
  } else if (length > 0) {
    color = "text-[#FFD93D]";
    bgColor = "bg-[#FFD93D]/10";
  }

  return { valid, color, bgColor };
}

export function ConfessionFormThreads({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ConfessionFormThreadsProps) {
  const [posts, setPosts] = useState<ThreadPost[]>([{ id: 1, content: "" }]);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const textareaRefs = useRef<Map<number, HTMLTextAreaElement>>(new Map());

  // Auto-resize textarea
  useEffect(() => {
    posts.forEach((post) => {
      const textarea = textareaRefs.current.get(post.id);
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
      }
    });
  }, [posts]);

  const addNewPost = () => {
    if (posts.length >= 10) return;
    const newId = Math.max(...posts.map((p) => p.id), 0) + 1;
    setPosts([...posts, { id: newId, content: "" }]);
    setTimeout(() => {
      textareaRefs.current.get(newId)?.focus();
    }, 50);
  };

  const removePost = (id: number) => {
    if (posts.length === 1) return;
    const newPosts = posts.filter((p) => p.id !== id);
    setPosts(newPosts);
  };

  const updatePostContent = (id: number, content: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, content } : p)));
  };

  const canSubmit = () => {
    const allValid = posts.every((post) => {
      const status = getCharStatus(post.content.length);
      return status.valid;
    });
    return (
      allValid && turnstileToken !== null && !isSubmitting && posts.length > 0
    );
  };

  const handleSubmit = async () => {
    setShowValidation(true);

    const allValid = posts.every((post) => {
      const status = getCharStatus(post.content.length);
      return status.valid;
    });

    if (!allValid || !turnstileToken) return;

    const contents = posts
      .map((p) => p.content.trim())
      .filter((c) => c.length > 0);
    await onSubmit?.(contents, turnstileToken);
  };

  return (
    <div className="w-full max-w-xl mx-auto relative">
      {/* Floating decorative bubbles */}
      <motion.div
        className="absolute -left-10 top-20 w-8 h-8 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436]"
        animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-8 top-40 w-6 h-6 rounded-full bg-[#FF7EB3] border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436]"
        animate={{ y: [0, -12, 0], scale: [1, 1.2, 1] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute -left-6 bottom-40 w-5 h-5 rounded-full bg-[#4A90E2] border-[2px] border-[#2D3436]"
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Card - Cartoon Style */}
      <div className="relative">
        <motion.div
          className="bg-white rounded-[40px] border-[4px] border-[#2D3436] shadow-[10px_10px_0px_#2D3436] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b-[4px] border-[#2D3436] bg-gradient-to-r from-[#FFD93D]/20 via-white to-[#FF7EB3]/20">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center shadow-[2px_2px_0px_#2D3436]"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}>
                <span className="text-lg">📝</span>
              </motion.div>
              <div>
                <h1 className="font-display font-black text-[#2D3436] text-xl">
                  New Confession
                </h1>
                <p className="font-body text-xs text-[#636E72]">
                  Posting to ceritaAnon
                </p>
              </div>
            </div>

            <motion.button
              onClick={onCancel}
              disabled={isSubmitting}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-[#F0F0F0] border-[3px] border-[#2D3436] flex items-center justify-center text-[#636E72] hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] transition-all disabled:opacity-50 shadow-[2px_2px_0px_#2D3436] hover:shadow-[3px_3px_0px_#2D3436]">
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Posts - Twitter/X Style Thread */}
          <div className="max-h-[55vh] overflow-y-auto pt-4">
            <AnimatePresence mode="popLayout">
              {posts.map((post, index) => {
                const charStatus = getCharStatus(post.content.length);
                const isLast = index === posts.length - 1;
                const hasMorePosts = posts.length < 10;

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="relative px-4">
                    <div className="flex gap-3">
                      {/* Connecting line column */}
                      <div className="flex flex-col items-center">
                        {/* Connecting line - show if not last or if last but can add more */}
                        {(index < posts.length - 1 ||
                          (isLast && hasMorePosts)) && (
                          <div className="w-[2px] flex-1 bg-[#2D3436]/20 my-1 min-h-[20px]" />
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={cn(
                          "flex-1 pb-4",
                          !isLast && "border-b border-[#E0E0E0]",
                        )}>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-[#2D3436]">
                              Anonymous
                            </span>
                            {index === 0 && posts.length > 1 && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFD93D] text-[#2D3436] font-display text-xs border-[1px] border-[#2D3436]">
                                <Sparkles className="w-3 h-3" />
                                Main
                              </span>
                            )}
                          </div>

                          {/* Char counter & Delete */}
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-xs font-display font-medium",
                                charStatus.color,
                              )}>
                              {post.content.length}/{MAX_CHARS}
                            </span>
                            {posts.length > 1 && (
                              <motion.button
                                onClick={() => removePost(post.id)}
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 p-1 rounded transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Textarea */}
                        <textarea
                          ref={(el) => {
                            if (el) textareaRefs.current.set(post.id, el);
                          }}
                          value={post.content}
                          onChange={(e) =>
                            updatePostContent(post.id, e.target.value)
                          }
                          disabled={isSubmitting}
                          placeholder={
                            index === 0
                              ? "What's on your mind?"
                              : "Continue your story..."
                          }
                          className="w-full bg-transparent font-body text-[#2D3436] text-base placeholder:text-[#B2BEC3] resize-none outline-none min-h-[60px] disabled:opacity-50 leading-relaxed"
                        />

                        {/* Validation error */}
                        {showValidation && !charStatus.valid && (
                          <motion.p
                            className="font-body text-xs text-[#FF6B6B] mt-2 flex items-center gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}>
                            <AlertCircle className="w-3 h-3" />
                            {post.content.length < MIN_CHARS
                              ? `Need ${MIN_CHARS - post.content.length} more chars`
                              : `${post.content.length - MAX_CHARS} chars over limit`}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Add to Thread */}
            {posts.length < 10 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-3">
                <motion.button
                  onClick={addNewPost}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 text-[#9B59B6] hover:text-[#7B3F98] transition-colors group">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-[#9B59B6]/20 border-[2px] border-[#9B59B6] flex items-center justify-center group-hover:bg-[#9B59B6] group-hover:text-white transition-all shadow-[2px_2px_0px_#2D3436]"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <Plus className="w-4 h-4" />
                  </motion.div>
                  <span className="font-body text-sm font-medium">
                    Add to thread ({posts.length}/10)
                  </span>
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Bottom Action Bar - Cartoon Style */}
          <div className="px-6 py-5 bg-gradient-to-r from-[#E8F4FD] via-[#FEF7E8] to-[#FDE8F0] border-t-[4px] border-[#2D3436]">
            <div className="flex items-center justify-between gap-4">
              {/* Left info */}
              <div className="flex items-center gap-3">
                <motion.span
                  className="flex items-center gap-1.5 font-display text-xs text-[#636E72] bg-white px-4 py-2 rounded-full border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436]"
                  whileHover={{ y: -2 }}>
                  <Clock className="w-3.5 h-3.5" />
                  3/hr
                </motion.span>
                <motion.span
                  className="font-display text-xs text-[#636E72] bg-white px-4 py-2 rounded-full border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436]"
                  whileHover={{ y: -2 }}>
                  {MAX_CHARS} max
                </motion.span>
              </div>

              {/* Post Button - Cartoon */}
              <motion.button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                whileHover={canSubmit() ? { scale: 1.05, y: -2 } : {}}
                whileTap={canSubmit() ? { scale: 0.95 } : {}}
                className={cn(
                  "px-8 py-3 rounded-full font-display font-black text-base transition-all duration-200 flex items-center gap-2 border-[3px] border-[#2D3436]",
                  canSubmit()
                    ? "bg-[#FF7EB3] text-white shadow-[4px_4px_0px_#2D3436] hover:shadow-[6px_6px_0px_#2D3436]"
                    : "bg-[#DFE6E9] text-[#B2BEC3] cursor-not-allowed",
                )}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={canSubmit() ? { x: [0, 3, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}>
                      <Send className="w-5 h-5" />
                    </motion.div>
                    <span>{posts.length > 1 ? "Post Thread" : "Post"}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Verification Section */}
      <motion.div
        className="mt-10 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <div className="bg-white rounded-2xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] p-4">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-[#636E72]" />
            <span className="font-display font-medium text-sm text-[#2D3436]">
              Verification
            </span>
            {turnstileToken && (
              <span className="ml-auto flex items-center gap-1 text-xs font-medium text-[#1DD1A1]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>

          <div className="flex justify-center py-2 bg-[#F8F9FA] rounded-xl">
            <Turnstile
              sitekey={TURNSTILE_SITE_KEY}
              onVerify={(token) => {
                setTurnstileToken(token);
                setTurnstileError(false);
              }}
              onError={() => {
                setTurnstileToken(null);
                setTurnstileError(true);
              }}
              onExpire={() => setTurnstileToken(null)}
              theme="light"
            />
          </div>

          {turnstileError && (
            <motion.p
              className="text-center font-body text-xs text-[#FF6B6B] mt-2 flex items-center justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}>
              <AlertCircle className="w-3.5 h-3.5" />
              Verification failed. Please try again.
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Privacy Note */}
      <motion.div
        className="mt-4 px-4 pb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <p className="font-body text-xs text-[#636E72] flex items-center justify-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1DD1A1]/10 text-[#1DD1A1]">
            <CheckCircle2 className="w-3 h-3" />
          </span>
          Your confession is anonymous and will be reviewed before posting
        </p>
      </motion.div>
    </div>
  );
}

export default ConfessionFormThreads;
