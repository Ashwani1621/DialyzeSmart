from flask import Blueprint

from controllers.patient_portal_controller import (
    fetch_patient_dashboard,
    fetch_patient_sessions,
    fetch_patient_profile,
)

patient_portal_bp = Blueprint("patient_portal", __name__)

patient_portal_bp.route(
    "/api/patient/<uid>/dashboard",
    methods=["GET"]
)(fetch_patient_dashboard)

patient_portal_bp.route(
    "/api/patient/<uid>/sessions",
    methods=["GET"]
)(fetch_patient_sessions)

patient_portal_bp.route(
    "/api/patient/<uid>/profile",
    methods=["GET"]
)(fetch_patient_profile)
