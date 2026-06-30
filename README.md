# Monsoon — India Climate Intelligence Dashboard

A full-stack climate dashboard for India: a decade of historical weather data
(2016–2025, 28 states) and a 14-day digital-twin forecast, presented through a
React + Tailwind UI backed by a Flask REST API.

> **Note on the prediction model:** this build serves precomputed forecast
> values from `backend/data/forecast_data.xlsx` rather than running a live
> trained model (no `.pkl`/TensorFlow artifact or notebook was available at
> build time). `backend/model_service.py` is the single integration point —
> see the comment at the top of that file for how to wire in a real trained
> LSTM/XGBoost model without touching routes or the frontend.

## Project structure

```
climate-dashboard/
├── frontend/                  React + Vite + Tailwind UI
│   ├── src/
│   │   ├── pages/              Home, Dashboard, ClimatePrediction, StateAnalysis, About
│   │   ├── components/         Navbar, Footer, IndiaDotMap, WeatherCard, TrendChart, etc.
│   │   ├── context/             ThemeContext (dark/light mode)
│   │   └── utils/api.js        Axios client for the backend
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/                    Flask REST API
│   ├── app.py                  App entrypoint
│   ├── data_loader.py          Excel loading + caching
│   ├── model_service.py        Prediction logic (drop-in point for a real model)
│   ├── routes/
│   │   ├── states_routes.py    /api/states, /api/history/*
│   │   └── predict_routes.py   /api/predict, /api/forecast/*, /api/risk-forecast
│   ├── data/
│   │   ├── historical_climate_data.xlsx
│   │   └── forecast_data.xlsx
│   └── requirements.txt
├── requirements.txt             Points to backend/requirements.txt
└── README.md
```

## Requirements

- Node.js 18+ and npm
- Python 3.10+
- pip

## Installation & running locally

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The API starts on `http://localhost:5000`. Confirm it's healthy:

```bash
curl http://localhost:5000/api/health
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` and proxies `/api/*` requests to
the Flask server on port 5000 (configured in `vite.config.js`).

### 3. Production build

```bash
cd frontend
npm run build      # outputs static files to frontend/dist
npm run preview    # serve the production build locally
```

For the backend in production, use gunicorn instead of the Flask dev server:

```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API documentation

All endpoints return JSON. Base URL: `http://localhost:5000`.

### `GET /api/health`
Health check + dataset stats.
```json
{ "status": "ok", "statesLoaded": 28, "historicalRecords": 102284, "forecastRecords": 392 }
```

### `GET /api/states`
List all states with coordinates (used to plot the map).
```json
{ "count": 28, "states": [{ "name": "Kerala", "latitude": 10.85, "longitude": 76.27 }, ...] }
```

### `GET /api/history/<state>?years=5&start=YYYY-MM-DD&end=YYYY-MM-DD`
Daily historical records for a state. `years` limits to the last N years from
the most recent record; `start`/`end` take precedence if provided.
```json
{ "state": "Kerala", "count": 1826, "data": [{ "date": "2024-01-01", "temperature": 26.1, "humidity": 78.2, "rainfall": 2.1, "windSpeed": 11.4 }, ...] }
```

### `GET /api/history/<state>/summary`
Aggregate statistics (averages + extremes) over the full 10-year history.
```json
{
  "state": "Kerala",
  "recordCount": 3653,
  "dateRange": { "start": "2016-01-01", "end": "2025-12-31" },
  "averages": { "temperature": 27.1, "humidity": 74.3, "rainfall": 6.8, "windSpeed": 12.1 },
  "extremes": { "maxTemperature": 34.2, "minTemperature": 19.8, "maxRainfall": 142.5, "maxWindSpeed": 38.0 }
}
```

### `POST /api/predict`
Request body:
```json
{ "state": "Kerala", "date": "2026-01-05" }
```
Response:
```json
{
  "state": "Kerala",
  "requestedDate": "2026-01-05",
  "predictionDate": "2026-01-05",
  "usedNearestAvailableDate": false,
  "availableForecastRange": { "start": "2026-01-01", "end": "2026-01-14" },
  "predictions": { "temperature": 26.52, "humidity": 76.27, "rainfall": 10.63, "windSpeed": 14.14 },
  "location": { "latitude": 10.8505, "longitude": 76.2711 },
  "modelInfo": { "source": "precomputed_digital_twin_forecast", "note": "..." }
}
```
Returns `400` if `state` is unknown or `date` is unparseable.

### `GET /api/forecast/<state>`
Full 14-day forecast series for a state (used for chart rendering).

### `GET /api/risk-forecast`
National-level 14-day Flood/Drought/Heatwave/Cyclone risk indices.

## Frontend pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page, hero, feature highlights |
| Dashboard | `/dashboard` | India map, state/date selectors, live weather cards, historical-vs-forecast chart |
| Climate Prediction | `/predict` | Prediction form + 14-day forecast curve for all four metrics |
| State Analysis | `/states` | Deep dive per state: 1/5/10-year trend charts + summary stats |
| About | `/about` | Stack, data sources, project structure |

## Design notes

- Theme: dark-mode-first "monsoon" palette (deep ink-blue background, teal +
  amber accents), with a light mode toggle persisted to `localStorage`.
- The India map is a custom SVG built from the actual latitude/longitude
  values in the dataset (equirectangular projection) rather than a static
  map image — dot color encodes the selected metric's relative intensity.
- Charts use Recharts; loading states use skeleton placeholders; all API
  calls are wrapped in try/catch with a dismissible error banner + retry.

## Git setup

This project is not yet a git repository. To initialize it and push to your
GitHub repo:

```bash
cd climate-dashboard
git init
git add .
git commit -m "Initial commit: Monsoon climate dashboard"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

Replace `<YOUR_GITHUB_REPO_URL>` with your repository's URL, e.g.
`https://github.com/<your-username>/<repo-name>.git`.

> I don't have the ability to run git commands or push to GitHub from this
> environment — the commands above are ready to run as-is on your machine.
> If you're using Claude Code (which has real file/git/network access), it
> can run these for you directly.

## Known limitations

- Predictions are precomputed (Jan 1–14, 2026 window) rather than live model
  inference — see the note at the top of this file and in `model_service.py`.
- The India map plots state dots by coordinate rather than rendering full
  state boundary polygons (no GeoJSON asset was available in this build
  environment, which has no network access).
- History endpoints can return up to ~3,650 points per state for a 10-year
  range; the frontend renders this directly via Recharts without
  downsampling, which is fine for local use but worth optimizing before
  scaling to many concurrent users.
