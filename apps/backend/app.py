from flask import Flask
from flask_cors import CORS

from routes.admin_routes import admin_bp
from routes.patient_routes import patient_bp
from routes.dashboard_routes import dashboard_bp
from routes.doctor_dashboard_routes import (
    doctor_dashboard_bp
)

app = Flask(__name__)
CORS(app)

app.register_blueprint(admin_bp)
app.register_blueprint(patient_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(
    doctor_dashboard_bp
)

@app.route("/")
def home():
    return {
        "message": "DialyzeSmart Flask API"
    }


if __name__ == "__main__":
    app.run(debug=True)