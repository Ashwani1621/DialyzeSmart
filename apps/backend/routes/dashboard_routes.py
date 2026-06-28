from flask import Blueprint

from controllers.dashboard_controller import (
    fetch_dashboard,
)

dashboard_bp = Blueprint(
    "dashboard",
    __name__,
)

dashboard_bp.route(

    "/api/admin/dashboard",

    methods=["GET"],

)(fetch_dashboard)