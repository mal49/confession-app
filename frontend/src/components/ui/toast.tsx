import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ToasterToast } from "@/hooks/use-toast"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps extends ToasterToast {
  onDismiss?: () => void
}

export function Toast({ title, description, variant = "default", onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = React.useState(false)

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      onDismiss?.()
    }, 300)
  }

  // Cartoon style configurations
  const toastStyles: Record<ToastVariant, {
    bg: string
    border: string
    shadow: string
    iconBg: string
    iconColor: string
    progress: string
  }> = {
    default: {
      bg: "bg-white",
      border: "border-[#4A90E2]",
      shadow: "#4A90E2",
      iconBg: "bg-[#4A90E2]",
      iconColor: "text-white",
      progress: "bg-[#4A90E2]",
    },
    destructive: {
      bg: "bg-white",
      border: "border-[#FF6B6B]",
      shadow: "#FF6B6B",
      iconBg: "bg-[#FF6B6B]",
      iconColor: "text-white",
      progress: "bg-[#FF6B6B]",
    },
    success: {
      bg: "bg-white",
      border: "border-[#1DD1A1]",
      shadow: "#1DD1A1",
      iconBg: "bg-[#1DD1A1]",
      iconColor: "text-white",
      progress: "bg-[#1DD1A1]",
    },
  }

  const icons = {
    default: <Info className="w-5 h-5" />,
    destructive: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
  }

  const style = toastStyles[variant]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -3 }}
      animate={isExiting 
        ? { opacity: 0, y: 20, scale: 0.8, rotate: 3 } 
        : { opacity: 1, y: 0, scale: 1, rotate: 0 }
      }
      exit={{ opacity: 0, y: 20, scale: 0.8, rotate: 3 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.3 
      }}
      className={cn(
        "relative flex w-full items-start gap-3 rounded-3xl border-[3px] p-4 overflow-hidden",
        style.bg,
        style.border
      )}
      style={{ 
        boxShadow: `6px 6px 0px ${style.shadow}`,
      }}
      role="alert"
    >
      {/* Fun decorative corner accent */}
      <div 
        className={cn("absolute -top-3 -right-3 w-10 h-10 rounded-full opacity-20", style.iconBg)}
      />

      {/* Icon with cartoon style */}
      <motion.div 
        className={cn(
          "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border-[3px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436]",
          style.iconBg,
          style.iconColor
        )}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
      >
        {icons[variant]}
      </motion.div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        {title && (
          <h4 className="font-display font-bold text-base text-[#2D3436]">
            {title}
          </h4>
        )}
        {description && (
          <div className={cn(
            "font-body text-sm text-[#636E72] leading-relaxed",
            title && "mt-1"
          )}>
            {description}
          </div>
        )}
      </div>

      {/* Close button with cartoon style */}
      <motion.button
        onClick={handleDismiss}
        className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#FFFBF5] border-[2px] border-[#2D3436] shadow-[2px_2px_0px_#2D3436] flex items-center justify-center text-[#636E72] hover:text-[#2D3436] hover:bg-[#FFD93D] transition-colors"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9, boxShadow: "1px 1px 0px #2D3436", y: 1 }}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </motion.button>

      {/* Progress bar - cartoon style */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#DFE6E9]/50 overflow-hidden rounded-b-3xl">
        <motion.div 
          className={cn("h-full", style.progress)}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>

      {/* Decorative dots */}
      <div className="absolute bottom-3 left-3 flex gap-1">
        <motion.div 
          className={cn("w-2 h-2 rounded-full", style.iconBg)}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div 
          className={cn("w-2 h-2 rounded-full", style.iconBg)}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className={cn("w-2 h-2 rounded-full", style.iconBg)}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </motion.div>
  )
}

interface ToasterProps {
  toasts: ToasterToast[]
  onDismiss: (id: string) => void
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <motion.div 
            key={toast.id} 
            className="pointer-events-auto mb-3"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ 
              delay: index * 0.05,
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            <Toast {...toast} onDismiss={() => onDismiss(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
