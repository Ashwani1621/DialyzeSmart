from flask import jsonify

from services.patient_portal_service import (
    get_patient_dashboard,
    get_patient_profile,
)
from services.patient_service import get_sessions


def fetch_patient_dashboard(uid):

    try:

        data = get_patient_dashboard(uid)

        return jsonify({
            "success": True,
            "data": data,
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500


def fetch_patient_sessions(uid):

    try:

        data = get_sessions(uid)

        return jsonify({
            "success": True,
            "data": data,
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500


def fetch_patient_profile(uid):

    try:

        data = get_patient_profile(uid)

        return jsonify({
            "success": True,
            "data": data,
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500
