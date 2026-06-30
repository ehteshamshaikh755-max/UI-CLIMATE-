import { Link } from 'react-router-dom'
import { ArrowRight, CloudRain, Thermometer, Wind, Droplets, MapPinned, History } from 'lucide-react'

const features = [
  {
    icon: MapPinned,
    title: '28 states, mapped',
    body: 'Every Indian state plotted by its real coordinates — pick one and see its climate story.',
  },
  {
    icon: History,
    title: 'A decade of history',
    body: '102,000+ daily records from 2016 to 2025 power every historical trend line on this site.',
  },
  {
    icon: CloudRain,
    title: '14-day forecasts',
    body: 'Digital-twin forecasts for temperature, humidity, rainfall, and wind — state by state.',
  },
]

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="pt-10 pb-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium glass light-glass text-monsoon-600 dark:text-monsoon-300">
            <span className="h-1.5 w-1.5 rounded-full bg-monsoon-500 animate-pulse" />
            10 years of climate data · 28 states
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight">
            Read India's weather
            <span className="block bg-gradient-to-r from-monsoon-500 via-monsoon-400 to-sunrise-400 bg-clip-text text-transparent">
              before it arrives.
            </span>
          </h1>
          <p className="text-ink-700/60 dark:text-mist-200/60 text-lg max-w-md">
            Monsoon turns a decade of state-level climate records and a 14-day
            forecast model into something you can actually look at — trends,
            predictions, and risk, side by side.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-monsoon-500 to-monsoon-700 px-5 py-3 text-sm font-semibold text-white shadow-glass hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 rounded-xl glass light-glass px-5 py-3 text-sm font-semibold text-ink-900 dark:text-mist-50 hover:-translate-y-0.5 transition-all"
            >
              Run a Prediction
            </Link>
          </div>
        </div>

        <div className="relative animate-float-slow">
          <div className="absolute inset-0 bg-gradient-to-br from-monsoon-500/20 to-sunrise-400/10 blur-3xl rounded-full" />
          <div className="relative grid grid-cols-2 gap-4">
            <StatPreview icon={Thermometer} label="Avg Temp" value="27.4°C" accent="from-coral-500 to-sunrise-500" />
            <StatPreview icon={Droplets} label="Humidity" value="68%" accent="from-monsoon-500 to-monsoon-700" />
            <StatPreview icon={CloudRain} label="Rainfall" value="4.2mm" accent="from-sky-500 to-monsoon-600" />
            <StatPreview icon={Wind} label="Wind Speed" value="12.8 km/h" accent="from-sunrise-400 to-sunrise-600" />
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="glass light-glass rounded-2xl p-6 shadow-glass animate-fade-up"
            style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-monsoon-500/10 text-monsoon-500 mb-4">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="font-display font-semibold text-lg mb-1.5">{f.title}</h3>
            <p className="text-sm text-ink-700/60 dark:text-mist-200/60">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

function StatPreview({ icon: Icon, label, value, accent }) {
  return (
    <div className="glass light-glass rounded-2xl p-5 shadow-glass">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} mb-3`}>
        <Icon className="h-4 w-4 text-white" />
      </span>
      <p className="text-[11px] uppercase tracking-wider text-ink-700/40 dark:text-mist-200/40">{label}</p>
      <p className="font-display text-2xl font-bold mt-0.5">{value}</p>
    </div>
  )
}
