import { useEffect, useMemo, useState, useCallback } from 'react'
import { Thermometer, Droplets, CloudRain, Wind, CalendarDays } from 'lucide-react'
import IndiaDotMap from '../components/IndiaDotMap'
import WeatherCard from '../components/WeatherCard'
import TrendChart from '../components/TrendChart'
import ErrorBanner from '../components/ErrorBanner'
import { CardSkeleton, ChartSkeleton } from '../components/Skeletons'
import { getStates, getHistory, getForecast } from '../utils/api'

const METRICS = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'rainfall', label: 'Rainfall' },
  { key: 'humidity', label: 'Humidity' },
  { key: 'windSpeed', label: 'Wind Speed' },
]

export default function Dashboard() {
  const [states, setStates] = useState([])
  const [selectedState, setSelectedState] = useState('Kerala')
  const [date, setDate] = useState('2026-01-05')
  const [history, setHistory] = useState([])
  const [forecast, setForecast] = useState([])
  const [mapMetric, setMapMetric] = useState('temperature')
  const [mapForecastAll, setMapForecastAll] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadStates = useCallback(async () => {
    try {
      const res = await getStates()
      setStates(res.states)
    } catch (e) {
      setError('Could not load the list of states. Is the backend running on port 5000?')
    }
  }, [])

  const loadStateData = useCallback(async (state) => {
    setLoading(true)
    setError(null)
    try {
      const [hist, fc] = await Promise.all([
        getHistory(state, { years: 2 }),
        getForecast(state),
      ])
      setHistory(hist.data)
      setForecast(fc.forecast)
    } catch (e) {
      setError(`Could not load data for ${state}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStates()
  }, [loadStates])

  useEffect(() => {
    if (selectedState) loadStateData(selectedState)
  }, [selectedState, loadStateData])

  // build map metric values from each state's nearest forecast row (lightweight: reuse current state's forecast list is not enough for all states,
  // so for the map we approximate using the same fetched forecast for selected state only as a highlight; for full all-state coloring we'd need a batch endpoint).
  useEffect(() => {
    if (forecast?.length) {
      const todayRow = forecast[0]
      setMapForecastAll((prev) => ({ ...prev, [selectedState]: todayRow?.[mapMetric] }))
    }
  }, [forecast, mapMetric, selectedState])

  const latestForecast = forecast?.[0]

  const combinedChartData = useMemo(() => {
    const histPart = history.map((h) => ({ date: h.date, historical: h[mapMetric] }))
    const fcPart = forecast.map((f) => ({ date: f.date, predicted: f[mapMetric] }))
    return [...histPart, ...fcPart]
  }, [history, forecast, mapMetric])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-ink-700/60 dark:text-mist-200/60 mt-1">
            Live snapshot and forecast for {selectedState}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="glass light-glass rounded-xl px-4 py-2.5 text-sm font-medium outline-none cursor-pointer"
          >
            {states.map((s) => (
              <option key={s.name} value={s.name} className="text-ink-900">
                {s.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 glass light-glass rounded-xl px-4 py-2.5">
            <CalendarDays className="h-4 w-4 text-monsoon-500" />
            <input
              type="date"
              value={date}
              min="2026-01-01"
              max="2026-01-14"
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none"
            />
          </div>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={() => loadStateData(selectedState)} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass light-glass rounded-2xl p-6 shadow-glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">India Map</h3>
            <select
              value={mapMetric}
              onChange={(e) => setMapMetric(e.target.value)}
              className="text-xs bg-transparent border border-ink-700/10 dark:border-mist-200/10 rounded-lg px-2 py-1 outline-none"
            >
              {METRICS.map((m) => (
                <option key={m.key} value={m.key} className="text-ink-900">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <IndiaDotMap
            states={states}
            selectedState={selectedState}
            onSelect={setSelectedState}
            metricValues={mapForecastAll}
            metricLabel={METRICS.find((m) => m.key === mapMetric)?.label}
          />
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            <>
              <WeatherCard icon={Thermometer} label="Temperature" value={latestForecast?.temperature ?? '–'} unit="°C" type="temperature" delay={0} />
              <WeatherCard icon={CloudRain} label="Rainfall" value={latestForecast?.rainfall ?? '–'} unit="mm" type="rainfall" delay={80} />
              <WeatherCard icon={Droplets} label="Humidity" value={latestForecast?.humidity ?? '–'} unit="%" type="humidity" delay={160} />
              <WeatherCard icon={Wind} label="Wind Speed" value={latestForecast?.windSpeed ?? '–'} unit="km/h" type="windSpeed" delay={240} />
            </>
          )}
        </div>
      </div>

      <div className="glass light-glass rounded-2xl p-6 shadow-glass">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Historical vs Forecast — {METRICS.find((m) => m.key === mapMetric)?.label}</h3>
        </div>
        {loading ? (
          <ChartSkeleton />
        ) : (
          <TrendChart
            data={combinedChartData}
            lines={[
              { key: 'historical', label: 'Historical (2yr)', color: 'historical' },
              { key: 'predicted', label: 'Forecast (14d)', color: 'predicted', dashed: true },
            ]}
          />
        )}
      </div>
    </div>
  )
}
