const accentMap = {
  temperature: 'from-coral-500 to-sunrise-500',
  humidity: 'from-monsoon-500 to-monsoon-700',
  rainfall: 'from-sky-500 to-monsoon-600',
  windSpeed: 'from-sunrise-400 to-sunrise-600',
}

export default function WeatherCard({ icon: Icon, label, value, unit, type = 'temperature', delay = 0 }) {
  return (
    <div
      className="glass light-glass rounded-2xl p-5 shadow-glass hover:-translate-y-1 transition-transform duration-300 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[type] || accentMap.temperature} shadow-glass`}
        >
          <Icon className="h-5 w-5 text-white" />
        </span>
        <span className="text-[11px] uppercase tracking-wider font-medium text-ink-700/40 dark:text-mist-200/40">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-3xl font-bold text-ink-900 dark:text-mist-50">
          {value}
        </span>
        <span className="text-sm text-ink-700/50 dark:text-mist-200/50">{unit}</span>
      </div>
    </div>
  )
}
