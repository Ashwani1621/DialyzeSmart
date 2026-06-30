from flask import Blueprint

from controllers.doctor_controller import (
    fetch_doctor_patients,
    fetch_doctor_sessions,
    fetch_doctor_profile,
)

doctor_bp = Blueprint("doctor", __name__)

doctor_bp.route(
    "/api/doctor/<uid>/patients",
    methods=["GET"]
)(fetch_doctor_patients)

doctor_bp.route(
    "/api/doctor/<uid>/sessions",
    methods=["GET"]
)(fetch_doctor_sessions)

doctor_bp.route(
    "/api/doctor/<uid>/profile",
    methods=["GET"]
)(fetch_doctor_profile)
