from flask import Blueprint, jsonify, request
from model_service import (
    predict_for_state_date,
    get_forecast_series_for_state,
    get_national_risk_series,
    PredictionError,
)
from data_loader import get_data

predict_bp = Blueprint("predict_bp", __name__)


@predict_bp.route("/api/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    state = payload.get("state")
    date_str = payload.get("date")

    if not state or not date_str:
        return jsonify({"error": "Both 'state' and 'date' fields are required."}), 400

    try:
        result = predict_for_state_date(state, date_str)
        return jsonify(result)
    except PredictionError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal prediction error.", "details": str(e)}), 500


@predict_bp.route("/api/forecast/<state>", methods=["GET"])
def forecast_series(state):
    data = get_data()
    if state not in data["states"]:
        return jsonify({"error": f"Unknown state '{state}'."}), 404
    series = get_forecast_series_for_state(state)
    return jsonify({"state": state, "count": len(series), "forecast": series})


@predict_bp.route("/api/risk-forecast", methods=["GET"])
def risk_forecast():
    series = get_national_risk_series()
    return jsonify({"count": len(series), "data": series})
