import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark'

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
    >
      {isDark ? <Sun size={18}/> : <Moon size={18}/>}
      <span className="text-sm">{isDark ? 'Light' : 'Dark'} mode</span>
    </button>
  )
}
