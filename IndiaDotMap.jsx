import { useMemo } from 'react'

// India's approximate bounding box for an equirectangular projection.
const LAT_MIN = 6.0
const LAT_MAX = 36.0
const LON_MIN = 67.5
const LON_MAX = 98.0

function project(lat, lon, width, height, padding = 24) {
  const x = padding + ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * (width - padding * 2)
  const y = padding + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (height - padding * 2)
  return { x, y }
}

/**
 * Renders all 28 states as positioned dots based on real latitude/longitude
 * from the dataset. Dot color encodes the selected metric's relative intensity
 * for that state's current forecast value.
 */
export default function IndiaDotMap({ states, selectedState, onSelect, metricValues = {}, metricLabel = '' }) {
  const width = 360
  const height = 420

  const values = Object.values(metricValues).filter((v) => typeof v === 'number')
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 1

  const colorFor = (val) => {
    if (typeof val !== 'number' || max === min) return '#14B8A6'
    const t = (val - min) / (max - min)
    // interpolate teal -> amber -> coral
    if (t < 0.5) {
      return interpolateColor('#14B8A6', '#F0BD72', t / 0.5)
    }
    return interpolateColor('#F0BD72', '#FF6B5B', (t - 0.5) / 0.5)
  }

  const points = useMemo(
    () =>
      (states || [])
        .filter((s) => s.latitude && s.longitude)
        .map((s) => ({ ...s, ...project(s.latitude, s.longitude, width, height) })),
    [states]
  )

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={width} height={height} fill="url(#mapGlow)" rx="24" />

        {points.map((p) => {
          const isActive = p.name === selectedState
          const val = metricValues[p.name]
          const fill = colorFor(val)
          return (
            <g
              key={p.name}
              transform={`translate(${p.x}, ${p.y})`}
              className="cursor-pointer group"
              onClick={() => onSelect?.(p.name)}
            >
              {isActive && (
                <circle r="11" fill={fill} opacity="0.25" className="animate-pulse" />
              )}
              <circle
                r={isActive ? 6 : 4}
                fill={fill}
                stroke={isActive ? '#fff' : 'transparent'}
                strokeWidth="1.5"
                className="transition-all duration-300 group-hover:r-[6px]"
              />
              <title>{`${p.name}${typeof val === 'number' ? `: ${val.toFixed(1)} ${metricLabel}` : ''}`}</title>
            </g>
          )
        })}
      </svg>
      <p className="mt-2 text-center text-[11px] text-ink-700/40 dark:text-mist-200/40">
        Dots positioned by real state coordinates · click a state to select it
      </p>
    </div>
  )
}

function interpolateColor(c1, c2, t) {
  const a = hexToRgb(c1)
  const b = hexToRgb(c2)
  const r = Math.round(a.r + (b.r - a.r) * t)
  const g = Math.round(a.g + (b.g - a.g) * t)
  const bl = Math.round(a.b + (b.b - a.b) * t)
  return `rgb(${r}, ${g}, ${bl})`
}

function hexToRgb(hex) {
  const v = hex.replace('#', '')
  return {
    r: parseInt(v.substring(0, 2), 16),
    g: parseInt(v.substring(2, 4), 16),
    b: parseInt(v.substring(4, 6), 16),
  }
}
