"""
data_loader.py
----------------
Loads and caches the Excel datasets used by the Climate Dashboard API.

Two source files are used:

1. historical_climate_data.xlsx
   Sheet "State Historical Weather": daily Temperature / Humidity / Rainfall /
   Wind Speed for all 28 Indian states, 2016-01-01 to 2025-12-31.

2. forecast_data.xlsx
   Sheet "State Weather Forecasts": a 14-day (2026-01-01 to 2026-01-14) per-state
   forecast for Temperature / Humidity / Rainfall / WindSpeed + lat/long.
   Sheet "National Risk Forecasts": national-level Flood/Drought/Heatwave/Cyclone
   risk indices for the same 14-day window.

NOTE ON THE PREDICTION MODEL
-----------------------------
No trained model artifact (.pkl / TensorFlow SavedModel) or notebook was supplied
for this build. Per project decision, the `/predict` endpoint serves the
pre-computed forecast values from `forecast_data.xlsx` (the "LSTM" digital-twin
output) rather than running live inference. The API layer is intentionally
structured so a real model can be dropped in later -- see `model_service.py`
for the single function that would need to change.
"""

import os
import threading
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HISTORICAL_PATH = os.path.join(BASE_DIR, "data", "historical_climate_data.xlsx")
FORECAST_PATH = os.path.join(BASE_DIR, "data", "forecast_data.xlsx")

_lock = threading.Lock()
_cache = {}


def _load_historical():
    df = pd.read_excel(HISTORICAL_PATH, sheet_name="State Historical Weather")
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.rename(
        columns={
            "Temperature (°C)": "temperature",
            "Humidity (%)": "humidity",
            "Rainfall (mm)": "rainfall",
            "Wind Speed (km/h)": "windSpeed",
        }
    )
    return df


def _load_forecast():
    df = pd.read_excel(FORECAST_PATH, sheet_name="State Weather Forecasts")
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.rename(
        columns={
            "Temperature": "temperature",
            "Humidity": "humidity",
            "Rainfall": "rainfall",
            "WindSpeed": "windSpeed",
            "Latitude": "latitude",
            "Longitude": "longitude",
        }
    )
    return df


def _load_national_risk():
    df = pd.read_excel(FORECAST_PATH, sheet_name="National Risk Forecasts")
    df["Date"] = pd.to_datetime(df["Date"])
    return df


def get_data():
    """Thread-safe lazy-loaded singleton access to all dataframes."""
    with _lock:
        if not _cache:
            _cache["historical"] = _load_historical()
            _cache["forecast"] = _load_forecast()
            _cache["risk"] = _load_national_risk()
            _cache["states"] = sorted(_cache["historical"]["State"].unique().tolist())
        return _cache


def reload_data():
    """Force a reload from disk (useful if Excel files are updated)."""
    with _lock:
        _cache.clear()
    return get_data()
