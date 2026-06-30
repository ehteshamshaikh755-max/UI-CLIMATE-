"""
app.py
-------
Climate Dashboard API entrypoint.

Run:
    pip install -r requirements.txt
    python app.py

Server starts on http://localhost:5000
"""

from flask import Flask, jsonify
from flask_cors import CORS

from data_loader import get_data, reload_data
from routes.states_routes import states_bp
from routes.predict_routes import predict_bp


def create_app():
    app = Flask(__name__)
    CORS(app)  # allow the Vite dev server / deployed frontend to call the API

    app.register_blueprint(states_bp)
    app.register_blueprint(predict_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        data = get_data()
        return jsonify(
            {
                "status": "ok",
                "statesLoaded": len(data["states"]),
                "historicalRecords": int(len(data["historical"])),
                "forecastRecords": int(len(data["forecast"])),
            }
        )

    @app.route("/api/reload", methods=["POST"])
    def reload_endpoint():
        reload_data()
        return jsonify({"status": "reloaded"})

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    # preload data on boot so the first request isn't slow
    get_data()
    app.run(debug=True, host="0.0.0.0", port=5000)
