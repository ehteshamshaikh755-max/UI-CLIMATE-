from flask import Blueprint, jsonify, request
import pandas as pd
from data_loader import get_data

states_bp = Blueprint("states_bp", __name__)


@states_bp.route("/api/states", methods=["GET"])
def list_states():
    data = get_data()
    hist = data["historical"]

    states_meta = []
    forecast_locations = data["forecast"][["State", "latitude", "longitude"]].drop_duplicates("State")
    loc_map = {r["State"]: (r["latitude"], r["longitude"]) for _, r in forecast_locations.iterrows()}

    for state in data["states"]:
        lat, lon = loc_map.get(state, (None, None))
        states_meta.append({"name": state, "latitude": lat, "longitude": lon})

    return jsonify({"count": len(states_meta), "states": states_meta})


@states_bp.route("/api/history/<state>", methods=["GET"])
def get_history(state):
    data = get_data()
    hist = data["historical"]

    if state not in data["states"]:
        return jsonify({"error": f"Unknown state '{state}'.", "availableStates": data["states"]}), 404

    start = request.args.get("start")
    end = request.args.get("end")
    limit_years = request.args.get("years", type=int)

    df = hist[hist["State"] == state].sort_values("Date")

    if start:
        df = df[df["Date"] >= pd.to_datetime(start)]
    if end:
        df = df[df["Date"] <= pd.to_datetime(end)]
    if limit_years and not (start or end):
        cutoff = df["Date"].max() - pd.DateOffset(years=limit_years)
        df = df[df["Date"] >= cutoff]

    records = [
        {
            "date": row["Date"].strftime("%Y-%m-%d"),
            "temperature": round(float(row["temperature"]), 2),
            "humidity": round(float(row["humidity"]), 2),
            "rainfall": round(float(row["rainfall"]), 2),
            "windSpeed": round(float(row["windSpeed"]), 2),
        }
        for _, row in df.iterrows()
    ]

    return jsonify({"state": state, "count": len(records), "data": records})


@states_bp.route("/api/history/<state>/summary", methods=["GET"])
def get_history_summary(state):
    data = get_data()
    hist = data["historical"]

    if state not in data["states"]:
        return jsonify({"error": f"Unknown state '{state}'."}), 404

    df = hist[hist["State"] == state]
    summary = {
        "state": state,
        "recordCount": int(len(df)),
        "dateRange": {
            "start": df["Date"].min().strftime("%Y-%m-%d"),
            "end": df["Date"].max().strftime("%Y-%m-%d"),
        },
        "averages": {
            "temperature": round(float(df["temperature"].mean()), 2),
            "humidity": round(float(df["humidity"].mean()), 2),
            "rainfall": round(float(df["rainfall"].mean()), 2),
            "windSpeed": round(float(df["windSpeed"].mean()), 2),
        },
        "extremes": {
            "maxTemperature": round(float(df["temperature"].max()), 2),
            "minTemperature": round(float(df["temperature"].min()), 2),
            "maxRainfall": round(float(df["rainfall"].max()), 2),
            "maxWindSpeed": round(float(df["windSpeed"].max()), 2),
        },
    }
    return jsonify(summary)
