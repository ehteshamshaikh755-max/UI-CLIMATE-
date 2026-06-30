import { NavLink } from 'react-router-dom'
import { CloudRain, Sun, Moon, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/predict', label: 'Climate Prediction' },
  { to: '/states', label: 'State Analysis' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-monsoon-500 bg-monsoon-500/10'
        : 'text-ink-700/70 dark:text-mist-200/70 hover:text-monsoon-500 hover:bg-monsoon-500/5'
    }`

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-mist-50/70 dark:bg-ink-950/70 border-b border-ink-900/5 dark:border-monsoon-300/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-monsoon-500 to-monsoon-700 shadow-glass">
            <CloudRain className="h-5 w-5 text-white" />
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-ink-900 dark:text-mist-50">
            Monsoon
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="h-9 w-9 flex items-center justify-center rounded-lg glass dark:glass text-ink-700 dark:text-sunrise-400 hover:scale-105 active:scale-95 transition-transform"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg glass text-ink-700 dark:text-mist-200"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-1 animate-fade-up">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
