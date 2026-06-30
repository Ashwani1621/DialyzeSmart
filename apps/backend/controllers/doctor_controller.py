from flask import jsonify

from services.doctor_dashboard_service import (
    get_doctor_patients,
    get_doctor_sessions,
    get_doctor_profile,
)


def fetch_doctor_profile(uid):

    try:

        data = get_doctor_profile(uid)

        return jsonify({
            "success": True,
            "data": data,
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500


def fetch_doctor_patients(uid):

    try:

        data = get_doctor_patients(uid)

        return jsonify({
            "success": True,
            "data": data,
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500


def fetch_doctor_sessions(uid):

    try:

        data = get_doctor_sessions(uid)

        return jsonify({
            "success": True,
            "data": data,
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500
