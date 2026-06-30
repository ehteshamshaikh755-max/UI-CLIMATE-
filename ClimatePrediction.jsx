import { useEffect, useState } from 'react'
import { Thermometer, Droplets, CloudRain, Wind, Sparkles, Info } from 'lucide-react'
import WeatherCard from '../components/WeatherCard'
import TrendChart from '../components/TrendChart'
import ErrorBanner from '../components/ErrorBanner'
import { ChartSkeleton } from '../components/Skeletons'
import { getStates, getForecast, postPredict } from '../utils/api'

export default function ClimatePrediction() {
  const [states, setStates] = useState([])
  const [state, setState] = useState('Maharashtra')
  const [date, setDate] = useState('2026-01-07')
  const [result, setResult] = useState(null)
  const [series, setSeries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getStates().then((r) => setStates(r.states)).catch(() => {})
  }, [])

  const runPrediction = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const [pred, fc] = await Promise.all([postPredict(state, date), getForecast(state)])
      setResult(pred)
      setSeries(fc.forecast)
    } catch (e) {
      setError(e?.response?.data?.error || 'Prediction failed. Please check your inputs and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold">Climate Prediction</h1>
        <p className="text-ink-700/60 dark:text-mist-200/60 mt-1">
          Select a state and date to view the forecast model's output.
        </p>
      </div>

      <div className="glass light-glass rounded-2xl p-6 shadow-glass grid sm:grid-cols-4 gap-4 items-end">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-ink-700/50 dark:text-mist-200/50 mb-1.5 block">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full bg-transparent border border-ink-700/10 dark:border-mist-200/10 rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
          >
            {states.map((s) => (
              <option key={s.name} value={s.name} className="text-ink-900">
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-ink-700/50 dark:text-mist-200/50 mb-1.5 block">Date</label>
          <input
            type="date"
            value={date}
            min="2026-01-01"
            max="2026-01-14"
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent border border-ink-700/10 dark:border-mist-200/10 rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
          />
        </div>
        <button
          onClick={runPrediction}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-monsoon-500 to-monsoon-700 px-5 py-2.5 text-sm font-semibold text-white shadow-glass hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? 'Predicting…' : 'Predict'}
        </button>
      </div>

      <ErrorBanner message={error} onRetry={runPrediction} />

      {result?.usedNearestAvailableDate && (
        <div className="flex items-center gap-2 text-xs text-sunrise-500 bg-sunrise-500/10 rounded-xl px-4 py-2.5">
          <Info className="h-4 w-4 shrink-0" />
          The forecast only covers {result.availableForecastRange.start} to {result.availableForecastRange.end}.
          Showing the nearest available date: {result.predictionDate}.
        </div>
      )}

      {result && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <WeatherCard icon={Thermometer} label="Temperature" value={result.predictions.temperature} unit="°C" type="temperature" delay={0} />
          <WeatherCard icon={CloudRain} label="Rainfall" value={result.predictions.rainfall} unit="mm" type="rainfall" delay={80} />
          <WeatherCard icon={Droplets} label="Humidity" value={result.predictions.humidity} unit="%" type="humidity" delay={160} />
          <WeatherCard icon={Wind} label="Wind Speed" value={result.predictions.windSpeed} unit="km/h" type="windSpeed" delay={240} />
        </div>
      )}

      <div className="glass light-glass rounded-2xl p-6 shadow-glass">
        <h3 className="font-display font-semibold mb-4">14-Day Forecast Curve — {state}</h3>
        {loading ? (
          <ChartSkeleton />
        ) : series.length ? (
          <TrendChart
            data={series}
            lines={[
              { key: 'temperature', label: 'Temperature (°C)', color: 'temperature' },
              { key: 'rainfall', label: 'Rainfall (mm)', color: 'rainfall' },
              { key: 'humidity', label: 'Humidity (%)', color: 'humidity' },
              { key: 'windSpeed', label: 'Wind Speed (km/h)', color: 'windSpeed' },
            ]}
          />
        ) : (
          <p className="text-sm text-ink-700/50 dark:text-mist-200/50 text-center py-12">
            Run a prediction to see the forecast curve.
          </p>
        )}
      </div>

      <p className="text-xs text-ink-700/40 dark:text-mist-200/40 text-center">
        Predictions are served from a precomputed digital-twin forecast dataset (14-day window, Jan 1–14, 2026).
      </p>
    </div>
  )
}
