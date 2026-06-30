from flask import Blueprint

from controllers.prescription_controller import (
    add_prescription,
    fetch_doctor_prescriptions,
    fetch_patient_prescriptions,
    edit_prescription,
    remove_prescription,
)

prescription_bp = Blueprint("prescriptions", __name__)

prescription_bp.route(
    "/api/doctor/prescriptions",
    methods=["POST"]
)(add_prescription)

prescription_bp.route(
    "/api/doctor/<uid>/prescriptions",
    methods=["GET"]
)(fetch_doctor_prescriptions)

prescription_bp.route(
    "/api/patient/<uid>/prescriptions",
    methods=["GET"]
)(fetch_patient_prescriptions)

prescription_bp.route(
    "/api/prescriptions/<prescription_id>",
    methods=["PUT"]
)(edit_prescription)

prescription_bp.route(
    "/api/prescriptions/<prescription_id>",
    methods=["DELETE"]
)(remove_prescription)
