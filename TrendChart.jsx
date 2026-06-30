import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = {
  temperature: '#FF6B5B',
  humidity: '#14B8A6',
  rainfall: '#3B9CFF',
  windSpeed: '#E8A857',
  historical: '#6FD9CC',
  predicted: '#F0BD72',
}

export default function TrendChart({ data, lines, height = 300, yLabel = '' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-700/10 dark:text-mist-200/10" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: 'currentColor' }}
          className="text-ink-700/50 dark:text-mist-200/50"
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'currentColor' }}
          className="text-ink-700/50 dark:text-mist-200/50"
          label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fontSize: 11, fill: 'currentColor' } : undefined}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(16, 26, 54, 0.9)',
            border: '1px solid rgba(111,217,204,0.2)',
            borderRadius: 12,
            fontSize: 12,
          }}
          labelStyle={{ color: '#6FD9CC' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.label}
            stroke={COLORS[l.color] || l.color || '#14B8A6'}
            strokeWidth={2}
            dot={false}
            strokeDasharray={l.dashed ? '5 5' : undefined}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
