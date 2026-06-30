from flask import request, jsonify

from services.prescription_service import (
    create_prescription,
    get_prescriptions_by_doctor,
    get_prescriptions_by_patient,
    update_prescription,
    delete_prescription,
)


def add_prescription():

    try:

        prescription_id = create_prescription(request.json)

        return jsonify({
            "success": True,
            "id": prescription_id,
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500


def fetch_doctor_prescriptions(uid):

    try:

        data = get_prescriptions_by_doctor(uid)

        return jsonify({
            "success": True,
            "data": data,
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500


def fetch_patient_prescriptions(uid):

    try:

        data = get_prescriptions_by_patient(uid)

        return jsonify({
            "success": True,
            "data": data,
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500


def edit_prescription(prescription_id):

    try:

        update_prescription(prescription_id, request.json)

        return jsonify({"success": True})

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500


def remove_prescription(prescription_id):

    try:

        delete_prescription(prescription_id)

        return jsonify({"success": True})

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e),
        }), 500
