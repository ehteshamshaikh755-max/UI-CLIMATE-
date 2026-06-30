import { useEffect, useState, useCallback } from 'react'
import { Thermometer, Droplets, CloudRain, Wind, TrendingUp, TrendingDown } from 'lucide-react'
import TrendChart from '../components/TrendChart'
import ErrorBanner from '../components/ErrorBanner'
import { ChartSkeleton, CardSkeleton } from '../components/Skeletons'
import { getStates, getHistory, getHistorySummary } from '../utils/api'

const RANGE_OPTIONS = [
  { label: '1 Year', years: 1 },
  { label: '5 Years', years: 5 },
  { label: '10 Years', years: 10 },
]

export default function StateAnalysis() {
  const [states, setStates] = useState([])
  const [state, setState] = useState('Rajasthan')
  const [years, setYears] = useState(5)
  const [history, setHistory] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getStates().then((r) => setStates(r.states)).catch(() => {})
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [hist, summ] = await Promise.all([
        getHistory(state, { years }),
        getHistorySummary(state),
      ])
      setHistory(hist.data)
      setSummary(summ)
    } catch (e) {
      setError(`Could not load analysis for ${state}.`)
    } finally {
      setLoading(false)
    }
  }, [state, years])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold">State Analysis</h1>
          <p className="text-ink-700/60 dark:text-mist-200/60 mt-1">
            Decade-level climate trends, state by state.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="glass light-glass rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
          >
            {states.map((s) => (
              <option key={s.name} value={s.name} className="text-ink-900">
                {s.name}
              </option>
            ))}
          </select>
          <div className="flex glass light-glass rounded-xl p-1">
            {RANGE_OPTIONS.map((r) => (
              <button
                key={r.years}
                onClick={() => setYears(r.years)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  years === r.years
                    ? 'bg-monsoon-500 text-white'
                    : 'text-ink-700/60 dark:text-mist-200/60 hover:bg-monsoon-500/10'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      {loading ? (
        <div className="grid sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : summary ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon={Thermometer}
            label="Avg Temperature"
            value={`${summary.averages.temperature}°C`}
            sub={`Range: ${summary.extremes.minTemperature}–${summary.extremes.maxTemperature}°C`}
          />
          <SummaryCard
            icon={CloudRain}
            label="Avg Rainfall"
            value={`${summary.averages.rainfall} mm`}
            sub={`Peak: ${summary.extremes.maxRainfall} mm`}
          />
          <SummaryCard
            icon={Droplets}
            label="Avg Humidity"
            value={`${summary.averages.humidity}%`}
          />
          <SummaryCard
            icon={Wind}
            label="Avg Wind Speed"
            value={`${summary.averages.windSpeed} km/h`}
            sub={`Peak: ${summary.extremes.maxWindSpeed} km/h`}
          />
        </div>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartBlock title="Temperature Trend" loading={loading} data={history} dataKey="temperature" color="temperature" unit="°C" />
        <ChartBlock title="Rainfall Trend" loading={loading} data={history} dataKey="rainfall" color="rainfall" unit="mm" />
        <ChartBlock title="Humidity Trend" loading={loading} data={history} dataKey="humidity" color="humidity" unit="%" />
        <ChartBlock title="Wind Speed Trend" loading={loading} data={history} dataKey="windSpeed" color="windSpeed" unit="km/h" />
      </div>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="glass light-glass rounded-2xl p-5 shadow-glass animate-fade-up">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-monsoon-500/10 text-monsoon-500 mb-3">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-[11px] uppercase tracking-wider text-ink-700/40 dark:text-mist-200/40">{label}</p>
      <p className="font-display text-2xl font-bold mt-0.5">{value}</p>
      {sub && <p className="text-xs text-ink-700/40 dark:text-mist-200/40 mt-1">{sub}</p>}
    </div>
  )
}

function ChartBlock({ title, loading, data, dataKey, color, unit }) {
  return (
    <div className="glass light-glass rounded-2xl p-6 shadow-glass">
      <h3 className="font-display font-semibold mb-4">{title}</h3>
      {loading ? (
        <ChartSkeleton height={240} />
      ) : (
        <TrendChart
          data={data}
          height={240}
          yLabel={unit}
          lines={[{ key: dataKey, label: title, color }]}
        />
      )}
    </div>
  )
}
