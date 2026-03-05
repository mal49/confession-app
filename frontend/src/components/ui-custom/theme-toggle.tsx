import { useTheme } from '@/hooks/use-theme'
import { Sun, Moon } from 'lucide-react'

const THEMES = ['light', 'dark'] as const

type Theme = typeof THEMES[number]

const THEME_CONFIG: Record<Theme, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: 'Light' },
  dark: { icon: Moon, label: 'Dark' },
}

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme()

  // Prevent hydration mismatch by rendering placeholder until mounted
  if (!mounted) {
    return (
      <button
        className="p-2.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] opacity-50 cursor-not-allowed transition-colors duration-200"
        disabled
        aria-label="Loading theme"
      >
        <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
      </button>
    )
  }

  const currentTheme = theme
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
  const { icon: Icon } = THEME_CONFIG[currentTheme]

  const handleClick = () => {
    setTheme(nextTheme)
  }

  return (
    <button
      onClick={handleClick}
      className="p-2.5 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label={`Switch to ${THEME_CONFIG[nextTheme].label} mode`}
      title={`${THEME_CONFIG[currentTheme].label} mode - click to switch`}
    >
      <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
    </button>
  )
}

export default ThemeToggle
