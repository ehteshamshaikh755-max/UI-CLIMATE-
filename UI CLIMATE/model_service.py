"""
model_service.py
------------------
Single point of integration for the prediction logic.

Currently: serves pre-computed forecast rows from forecast_data.xlsx
("State Weather Forecasts" sheet), produced by the user's offline
LSTM/XGBoost pipeline (digital twin).

TO PLUG IN A REAL TRAINED MODEL LATER:
    1. Place the .pkl / SavedModel folder in backend/models/
    2. Replace the body of `predict_for_state_date()` below with:
         - load model (cache it at module level so it's not reloaded per request)
         - build the feature vector the model expects (see your notebook's
           preprocessing pipeline for exact column order / scaling)
         - call model.predict(...)
         - return a dict shaped like the one below
    Everything else (Flask routes, frontend) stays unchanged because they only
    depend on this function's return shape.
"""

from datetime import datetime
import pandas as pd
from data_loader import get_data


class PredictionError(Exception):
    pass


def predict_for_state_date(state: str, date_str: str) -> dict:
    data = get_data()
    forecast = data["forecast"]

    if state not in data["states"]:
        raise PredictionError(f"Unknown state '{state}'.")

    try:
        target_date = pd.to_datetime(date_str)
    except Exception:
        raise PredictionError(f"Invalid date '{date_str}'. Use YYYY-MM-DD.")

    state_rows = forecast[forecast["State"] == state].sort_values("Date")
    if state_rows.empty:
        raise PredictionError(f"No forecast data available for '{state}'.")

    min_date, max_date = state_rows["Date"].min(), state_rows["Date"].max()

    # exact match
    row = state_rows[state_rows["Date"] == target_date]
    used_nearest = False

    if row.empty:
        # fall back to nearest available forecast date and flag it clearly
        state_rows = state_rows.copy()
        state_rows["diff"] = (state_rows["Date"] - target_date).abs()
        row = state_rows.sort_values("diff").head(1)
        used_nearest = True

    r = row.iloc[0]

    return {
        "state": state,
        "requestedDate": target_date.strftime("%Y-%m-%d"),
        "predictionDate": r["Date"].strftime("%Y-%m-%d"),
        "usedNearestAvailableDate": bool(used_nearest),
        "availableForecastRange": {
            "start": min_date.strftime("%Y-%m-%d"),
            "end": max_date.strftime("%Y-%m-%d"),
        },
        "predictions": {
            "temperature": round(float(r["temperature"]), 2),
            "humidity": round(float(r["humidity"]), 2),
            "rainfall": round(float(r["rainfall"]), 2),
            "windSpeed": round(float(r["windSpeed"]), 2),
        },
        "location": {
            "latitude": float(r["latitude"]),
            "longitude": float(r["longitude"]),
        },
        "modelInfo": {
            "source": "precomputed_digital_twin_forecast",
            "note": (
                "Served from forecast_data.xlsx. No live model inference is "
                "performed in this build; see model_service.py to wire in a "
                "trained LSTM/XGBoost model."
            ),
        },
    }


def get_forecast_series_for_state(state: str) -> list:
    data = get_data()
    forecast = data["forecast"]
    rows = forecast[forecast["State"] == state].sort_values("Date")
    return [
        {
            "date": d.strftime("%Y-%m-%d"),
            "temperature": round(float(t), 2),
            "humidity": round(float(h), 2),
            "rainfall": round(float(rf), 2),
            "windSpeed": round(float(w), 2),
        }
        for d, t, h, rf, w in zip(
            rows["Date"], rows["temperature"], rows["humidity"], rows["rainfall"], rows["windSpeed"]
        )
    ]


def get_national_risk_series() -> list:
    data = get_data()
    risk = data["risk"]
    return [
        {
            "date": row["Date"].strftime("%Y-%m-%d"),
            "floodRisk": float(row["Flood_Risk"]),
            "droughtRisk": float(row["Drought_Risk"]),
            "heatwaveRisk": float(row["Heatwave_Risk"]),
            "cycloneRisk": float(row["Cyclone_Risk"]),
        }
        for _, row in risk.iterrows()
    ]
