import { AlertTriangle } from 'lucide-react'

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-coral-500/30 bg-coral-500/10 px-4 py-3 text-sm text-coral-500 animate-fade-up">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 rounded-lg bg-coral-500/15 px-3 py-1 font-medium hover:bg-coral-500/25 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
