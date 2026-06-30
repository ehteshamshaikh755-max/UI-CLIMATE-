import { Database, Cpu, LayoutGrid, GitBranch } from 'lucide-react'

const stack = [
  {
    icon: LayoutGrid,
    title: 'Frontend',
    items: ['React 18 + Vite', 'Tailwind CSS', 'Recharts', 'React Router'],
  },
  {
    icon: Cpu,
    title: 'Backend',
    items: ['Flask REST API', 'Pandas data layer', 'Blueprint-based routes', 'CORS enabled'],
  },
  {
    icon: Database,
    title: 'Data',
    items: [
      '102,284 daily records, 2016–2025, 28 states',
      '14-day digital-twin forecast (392 records)',
      'National risk indices: flood, drought, heatwave, cyclone',
    ],
  },
]

export default function About() {
  return (
    <div className="space-y-10 max-w-4xl">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold">About this project</h1>
        <p className="text-ink-700/60 dark:text-mist-200/60 mt-2 leading-relaxed">
          Monsoon is a climate intelligence dashboard for India, built on ten years
          of state-level historical weather data and a 14-day forecast dataset.
          It's designed to make a large, messy climate dataset legible at a glance —
          per state, per metric, over time.
        </p>
      </div>

      <div className="rounded-2xl border border-sunrise-500/30 bg-sunrise-500/10 px-5 py-4 text-sm text-sunrise-600 dark:text-sunrise-300">
        <strong className="font-semibold">On the prediction model:</strong> this build
        serves precomputed forecast values from a digital-twin dataset rather than
        running a live LSTM/XGBoost model. The backend's <code className="font-mono text-xs">model_service.py</code> is
        structured as a drop-in point — wiring in a trained model only requires
        replacing one function, with no changes needed elsewhere.
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {stack.map((s) => (
          <div key={s.title} className="glass light-glass rounded-2xl p-6 shadow-glass">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-monsoon-500/10 text-monsoon-500 mb-4">
              <s.icon className="h-4 w-4" />
            </span>
            <h3 className="font-display font-semibold mb-3">{s.title}</h3>
            <ul className="space-y-1.5 text-sm text-ink-700/60 dark:text-mist-200/60">
              {s.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-monsoon-500">·</span> {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="glass light-glass rounded-2xl p-6 shadow-glass">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="h-4 w-4 text-monsoon-500" />
          <h3 className="font-display font-semibold">Project structure</h3>
        </div>
        <pre className="text-xs font-mono text-ink-700/70 dark:text-mist-200/70 overflow-x-auto leading-relaxed">
{`climate-dashboard/
├── frontend/        React + Vite + Tailwind UI
├── backend/         Flask REST API
│   ├── app.py
│   ├── data_loader.py
│   ├── model_service.py
│   ├── routes/
│   └── data/        Excel datasets
├── README.md
└── requirements.txt`}
        </pre>
      </div>
    </div>
  )
}
