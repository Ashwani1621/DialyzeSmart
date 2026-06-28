from flask import jsonify

from services.doctor_dashboard_service import (
    get_doctor_dashboard,
)


def fetch_doctor_dashboard():
    try:
        doctor_uid = request.args.get("doctorId")

        if not doctor_uid:
            return jsonify({
                "success": False,
                "message": "doctorId is required"
            }), 400

        data = get_doctor_dashboard(doctor_uid)

        return jsonify({
            "success": True,
            "data": data
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500