import { useState, useRef, useEffect } from "react";
import Turnstile from "react-turnstile";
import {
  Loader2,
  Feather,
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
    // Focus previous post or next available
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
    <div className="w-full max-w-xl mx-auto">
      {/* Main Card - Threads Style */}
      <div className="relative">
        <div className="bg-white rounded-[32px] border-[3px] border-[#2D3436] shadow-[8px_8px_0px_#2D3436] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b-[3px] border-[#2D3436]">
            <div>
              <h1 className="font-display font-bold text-[#2D3436] text-lg">
                New Confession
              </h1>
              <p className="font-body text-xs text-[#636E72]">
                Posting to ceritaAnon
              </p>
            </div>

            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-9 h-9 rounded-full bg-[#F0F0F0] border-[2px] border-[#2D3436] flex items-center justify-center text-[#636E72] hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] transition-all disabled:opacity-50">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Posts - Threads Style with vertical line */}
          <div className="max-h-[55vh] overflow-y-auto">
            {posts.map((post, index) => {
              const charStatus = getCharStatus(post.content.length);
              const isLast = index === posts.length - 1;

              return (
                <div
                  key={post.id}
                  className={cn(
                    "relative px-5 py-4",
                    !isLast && "border-b-[2px] border-dashed border-[#E0E0E0]",
                  )}>
                  {/* Threads-style layout with avatar column */}
                  <div className="flex gap-4">
                    {/* Avatar Column with connecting line */}
                    <div className="flex flex-col items-center">
                      {/* Avatar */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full bg-[#FFD93D] border-[3px] border-[#2D3436] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#2D3436]",
                          index > 0 && "bg-[#9B59B6]",
                        )}>
                        {index === 0 ? (
                          <Feather className="w-5 h-5 text-[#2D3436]" />
                        ) : (
                          <span className="font-display font-bold text-white text-sm">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Connecting line for threads */}
                      {!isLast && (
                        <div className="w-[3px] flex-1 bg-[#E0E0E0] my-2 rounded-full" />
                      )}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      {/* Header row with name and badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-display font-bold text-[#2D3436]">
                          Anonymous
                        </span>
                        {index === 0 && posts.length > 1 && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4A90E2]/10 text-[#4A90E2] font-display text-[10px] border border-[#4A90E2]/30">
                            <Sparkles className="w-3 h-3" />
                            Main
                          </span>
                        )}
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
                        className="w-full bg-transparent font-body text-[#2D3436] text-lg placeholder:text-[#B2BEC3] resize-none outline-none min-h-[60px] disabled:opacity-50 leading-relaxed"
                      />

                      {/* Validation error */}
                      {showValidation && !charStatus.valid && (
                        <p className="font-body text-xs text-[#FF6B6B] mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {post.content.length < MIN_CHARS
                            ? `Need ${MIN_CHARS - post.content.length} more chars`
                            : `${post.content.length - MAX_CHARS} chars over limit`}
                        </p>
                      )}
                    </div>

                    {/* Right side - char count & delete */}
                    <div className="flex flex-col items-end gap-2">
                      {/* Character counter circle */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-[2px] font-display font-bold text-xs",
                          charStatus.bgColor,
                          charStatus.color,
                          "border-[#2D3436]",
                        )}>
                        {post.content.length > 0 ? (
                          post.content.length > MAX_CHARS ? (
                            <span className="text-[10px]">
                              -{post.content.length - MAX_CHARS}
                            </span>
                          ) : (
                            <span>{post.content.length}</span>
                          )
                        ) : (
                          <span className="text-[10px]">0</span>
                        )}
                      </div>

                      {/* Delete button for additional posts */}
                      {posts.length > 1 && (
                        <button
                          onClick={() => removePost(post.id)}
                          disabled={isSubmitting}
                          className="w-8 h-8 rounded-full bg-[#F0F0F0] border-[2px] border-[#2D3436] flex items-center justify-center text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] transition-all disabled:opacity-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add to Thread Button */}
            {posts.length < 10 && (
              <div className="px-5 py-3 border-t-[2px] border-dashed border-[#E0E0E0]">
                <button
                  onClick={addNewPost}
                  disabled={isSubmitting}
                  className="flex items-center gap-3 text-[#9B59B6] hover:text-[#7B3F98] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-[#9B59B6]/10 border-[2px] border-[#9B59B6] flex items-center justify-center group-hover:bg-[#9B59B6] group-hover:text-white transition-all">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="font-display font-semibold text-sm">
                    Add to thread {posts.length > 1 && `(${posts.length}/10)`}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#E8F4FD] to-[#FDE8F0] border-t-[3px] border-[#2D3436]">
            <div className="flex items-center justify-between gap-4">
              {/* Left info */}
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-display text-xs text-[#636E72] bg-white/80 px-3 py-1.5 rounded-full border-[2px] border-[#2D3436]">
                  <Clock className="w-3.5 h-3.5" />
                  3/hr
                </span>
                <span className="font-display text-xs text-[#636E72] bg-white/80 px-3 py-1.5 rounded-full border-[2px] border-[#2D3436]">
                  {MAX_CHARS} max
                </span>
              </div>

              {/* Post Button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className={cn(
                  "px-6 py-2.5 rounded-full font-display font-bold text-sm transition-all duration-200 flex items-center gap-2 border-[3px] border-[#2D3436]",
                  canSubmit()
                    ? "bg-[#FF7EB3] text-white shadow-[4px_4px_0px_#2D3436] hover:shadow-[5px_5px_0px_#2D3436] hover:-translate-y-0.5 active:shadow-[2px_2px_0px_#2D3436] active:translate-y-0"
                    : "bg-[#DFE6E9] text-[#B2BEC3] cursor-not-allowed",
                )}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{posts.length > 1 ? "Post Thread" : "Post"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-5 left-16 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] border-t-[#2D3436]"></div>
        <div className="absolute -bottom-[14px] left-[67px] w-0 h-0 border-l-[17px] border-l-transparent border-r-[17px] border-r-transparent border-t-[17px] border-t-white"></div>
      </div>

      {/* CAPTCHA Section - Moved outside card */}
      <div className="mt-6 mx-4">
        <div className="bg-white rounded-2xl border-[3px] border-[#2D3436] shadow-[4px_4px_0px_#2D3436] p-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#FFD93D] border-[2px] border-[#2D3436] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#2D3436]" />
            </div>
            <span className="font-display font-bold text-sm text-[#2D3436]">
              Verify you&apos;re human
            </span>
          </div>
          <div className="scale-90 origin-center">
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
            <p className="text-center font-body text-xs text-[#FF6B6B] mt-1">
              Verification failed. Please try again.
            </p>
          )}
        </div>
      </div>

      {/* Privacy Note */}
      <div className="mt-8 flex items-center justify-center gap-2 font-body text-xs text-[#636E72]">
        <div className="w-6 h-6 rounded-full bg-[#1DD1A1]/20 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1DD1A1]" />
        </div>
        <span>
          Your confession is anonymous and will be reviewed before posting
        </span>
      </div>
    </div>
  );
}

export default ConfessionFormThreads;
