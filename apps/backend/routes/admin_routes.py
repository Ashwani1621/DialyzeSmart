from flask import Blueprint
from controllers.admin_controller import add_doctor, fetch_doctors
from controllers.admin_controller import (
    add_doctor,
    fetch_doctors,
    edit_doctor,
    revoke_doctor,
    remove_doctor,
)
admin_bp = Blueprint("admin", __name__)

admin_bp.route(
    "/api/admin/doctors",
    methods=["POST"]
)(add_doctor)

admin_bp.route(
    "/api/admin/doctors",
    methods=["GET"]
)(fetch_doctors)
admin_bp.route(
    "/api/admin/doctors/<uid>",
    methods=["PUT"]
)(edit_doctor)

admin_bp.route(
    "/api/admin/doctors/<uid>/status",
    methods=["PATCH"]
)(revoke_doctor)

admin_bp.route(
    "/api/admin/doctors/<uid>",
    methods=["DELETE"]
)(remove_doctor)