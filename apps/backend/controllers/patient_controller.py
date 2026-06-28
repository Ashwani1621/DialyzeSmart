from flask import request, jsonify

from services.patient_service import (
    create_patient,
    get_all_patients,
    update_patient,
    delete_patient,
    assign_doctor,
    create_session,
    get_sessions,
    update_session,
    delete_session,
)
def add_patient():

    try:

        uid = create_patient(request.json)

        return jsonify({
            "success": True,
            "uid": uid
        }),201

    except Exception as e:

        return jsonify({
            "success":False,
            "message":str(e)
        }),500
def fetch_patients():

    try:

        data = get_all_patients()

        return jsonify({
            "success":True,
            "data":data
        })

    except Exception as e:

        return jsonify({
            "success":False,
            "message":str(e)
        }),500
def edit_patient(uid):

    try:

        update_patient(uid,request.json)

        return jsonify({
            "success":True
        })

    except Exception as e:

        return jsonify({
            "success":False,
            "message":str(e)
        }),500
def remove_patient(uid):

    try:

        delete_patient(uid)

        return jsonify({
            "success":True
        })

    except Exception as e:

        return jsonify({
            "success":False,
            "message":str(e)
        }),500
def assign_patient_doctor(uid):

    try:

        assign_doctor(
            uid,
            request.json["doctorId"]
        )

        return jsonify({
            "success":True
        })

    except Exception as e:

        return jsonify({
            "success":False,
            "message":str(e)
        }),500
def add_session(uid):

    try:

        create_session(
            uid,
            request.json
        )

        return jsonify({
            "success":True
        }),201

    except Exception as e:

        return jsonify({
            "success":False,
            "message":str(e)
        }),500
def fetch_sessions(uid):

    try:

        sessions = get_sessions(uid)

        return jsonify({
            "success":True,
            "data":sessions
        })

    except Exception as e:

        return jsonify({
            "success":False,
            "message":str(e)
        }),500
def edit_session(session_id):

    try:

        update_session(
            session_id,
            request.json
        )

        return jsonify({
            "success": True
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


def remove_session(session_id):

    try:

        delete_session(session_id)

        return jsonify({
            "success": True
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500