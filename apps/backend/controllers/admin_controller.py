from flask import request, jsonify
from services.doctor_service import create_doctor, get_all_doctors
from services.doctor_service import (
    create_doctor,
    get_all_doctors,
    update_doctor,
    change_doctor_status,
    delete_doctor
)

def add_doctor():
    try:
        data = request.json

        uid = create_doctor(data)

        return jsonify({
            "success": True,
            "message": "Doctor created successfully.",
            "data": {
                "uid": uid
            }
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


def fetch_doctors():
    try:
        doctors = get_all_doctors()

        return jsonify({
            "success": True,
            "data": doctors
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
        
def edit_doctor(uid):
    try:
        data = request.json

        update_doctor(uid, data)

        return jsonify({
            "success": True,
            "message": "Doctor updated successfully."
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


def revoke_doctor(uid):
    try:
        data = request.json

        change_doctor_status(uid, data["isActive"])

        return jsonify({
            "success": True,
            "message": "Doctor status updated."
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


def remove_doctor(uid):
    try:
        delete_doctor(uid)

        return jsonify({
            "success": True,
            "message": "Doctor deleted."
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500