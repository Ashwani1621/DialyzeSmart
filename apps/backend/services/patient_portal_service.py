from firebase_admin import firestore

from config.firebase import db


# ---------------------------------
# PATIENT PROFILE (users + patients)
# ---------------------------------

def get_patient_profile(uid):

    user = db.collection("users").document(uid).get()
    patient = db.collection("patients").document(uid).get()

    if not user.exists or not patient.exists:
        raise Exception("Patient not found.")

    user_data = user.to_dict()
    patient_data = patient.to_dict()

    doctor_name = ""

    doctor_id = patient_data.get("doctorId")

    if doctor_id:

        doctor_user = db.collection("users").document(doctor_id).get()

        if doctor_user.exists:
            doctor_name = doctor_user.to_dict().get("name")

    return {

        "uid": uid,
        "patientName": patient_data.get("patientName"),
        "email": user_data.get("email"),
        "phone": user_data.get("phone"),
        "age": patient_data.get("age"),
        "gender": patient_data.get("gender"),
        "bloodGroup": patient_data.get("bloodGroup"),
        "height": patient_data.get("height"),
        "weight": patient_data.get("weight"),
        "diagnosis": patient_data.get("diagnosis"),
        "doctorId": doctor_id,
        "doctorName": doctor_name,
        "totalSessions": patient_data.get("totalSessions", 0),

    }


# ---------------------------------
# PATIENT DASHBOARD
# ---------------------------------

def get_patient_dashboard(uid):

    profile = get_patient_profile(uid)

    sessions = []

    docs = (
        db.collection("sessions")
        .where("patientId", "==", uid)
        .order_by(
            "sessionNumber",
            direction=firestore.Query.DESCENDING
        )
        .stream()
    )

    for doc in docs:

        session = doc.to_dict()
        session["sessionId"] = doc.id
        sessions.append(session)

    latest = sessions[0] if sessions else None

    # Albumin trend (oldest -> newest) for charting.
    albumin_trend = [
        {
            "session": s.get("sessionNumber"),
            "albuminLoss": s.get("albuminLoss", 0),
            "riskScore": s.get("riskScore", 0),
        }
        for s in reversed(sessions)
    ]

    return {

        "patientName": profile["patientName"],
        "doctorName": profile["doctorName"],
        "totalSessions": len(sessions),
        "currentRiskLevel": latest.get("riskLevel") if latest else None,
        "currentRiskScore": latest.get("riskScore") if latest else None,
        "latestSession": latest,
        "recentSessions": sessions[:5],
        "albuminTrend": albumin_trend,

    }
