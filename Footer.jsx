import { CloudRain, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-900/5 dark:border-monsoon-300/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-monsoon-500 to-monsoon-700">
            <CloudRain className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm text-ink-700/70 dark:text-mist-200/60">
            Monsoon — India Climate Intelligence
          </span>
        </div>
        <p className="text-xs text-ink-700/50 dark:text-mist-200/40 text-center">
          Historical data 2016–2025 · Forecasts are precomputed digital-twin outputs, not live model inference.
        </p>
        <a
          href="#"
          className="flex items-center gap-1.5 text-sm text-ink-700/70 dark:text-mist-200/60 hover:text-monsoon-500 transition-colors"
        >
          <Github className="h-4 w-4" /> Source
        </a>
      </div>
    </footer>
  )
}
