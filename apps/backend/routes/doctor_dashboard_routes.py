from flask import Blueprint

from controllers.doctor_dashboard_controller import (
    fetch_doctor_dashboard,
)

doctor_dashboard_bp = Blueprint(

    "doctor_dashboard",

    __name__

)

doctor_dashboard_bp.route(

    "/api/doctor/dashboard",

    methods=["GET"]

)(fetch_doctor_dashboard)