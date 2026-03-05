import * as React from "react"
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

  const icons = {
    default: <Info className="w-5 h-5" />,
    destructive: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
  }

  const iconColors: Record<ToastVariant, string> = {
    default: "text-blue-500",
    destructive: "text-red-500",
    success: "text-green-500",
  }

  const bgColors: Record<ToastVariant, string> = {
    default: "bg-[var(--bg-card)] border-[var(--border-color)]",
    destructive: "bg-red-950/80 border-red-800",
    success: "bg-green-950/80 border-green-800",
  }

  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-300",
        bgColors[variant],
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      )}
      role="alert"
    >
      <div className={cn("flex-shrink-0 mt-0.5", iconColors[variant])}>
        {icons[variant]}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
            {title}
          </h4>
        )}
        {description && (
          <p className={cn(
            "text-sm text-[var(--text-secondary)]",
            title && "mt-1"
          )}>
            {description}
          </p>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--border-color)] rounded-b-xl overflow-hidden">
        <div 
          className={cn(
            "h-full animate-progress",
            variant === "destructive" ? "bg-red-500" : 
            variant === "success" ? "bg-green-500" : "bg-blue-500"
          )}
        />
      </div>
    </div>
  )
}

interface ToasterProps {
  toasts: ToasterToast[]
  onDismiss: (id: string) => void
}

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full p-4 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onDismiss={() => onDismiss(toast.id)} />
        </div>
      ))}
    </div>
  )
}
