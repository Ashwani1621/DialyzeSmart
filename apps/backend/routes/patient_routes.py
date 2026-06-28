from flask import Blueprint

from controllers.patient_controller import (
    add_patient,
    fetch_patients,
    edit_patient,
    remove_patient,
    assign_patient_doctor,
    add_session,
    fetch_sessions,
    edit_session,
    remove_session
)

patient_bp = Blueprint("patients", __name__)

patient_bp.route(
    "/api/admin/patients",
    methods=["POST"]
)(add_patient)

patient_bp.route(
    "/api/admin/patients",
    methods=["GET"]
)(fetch_patients)

patient_bp.route(
    "/api/admin/patients/<uid>",
    methods=["PUT"]
)(edit_patient)

patient_bp.route(
    "/api/admin/patients/<uid>",
    methods=["DELETE"]
)(remove_patient)

patient_bp.route(
    "/api/admin/patients/<uid>/doctor",
    methods=["PATCH"]
)(assign_patient_doctor)

patient_bp.route(
    "/api/admin/patients/<uid>/sessions",
    methods=["POST"]
)(add_session)

patient_bp.route(
    "/api/admin/patients/<uid>/sessions",
    methods=["GET"]
)(fetch_sessions)
patient_bp.route(
    "/api/admin/sessions/<session_id>",
    methods=["PUT"]
)(edit_session)

patient_bp.route(
    "/api/admin/sessions/<session_id>",
    methods=["DELETE"]
)(remove_session)