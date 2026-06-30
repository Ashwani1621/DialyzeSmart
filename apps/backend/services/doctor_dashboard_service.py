from datetime import datetime

from config.firebase import db


# ---------------------------------
# DOCTOR PROFILE (users + doctors)
# ---------------------------------

def get_doctor_profile(doctor_uid):

    user = db.collection("users").document(doctor_uid).get()
    doctor = db.collection("doctors").document(doctor_uid).get()

    if not user.exists or not doctor.exists:
        raise Exception("Doctor not found.")

    user_data = user.to_dict()
    doctor_data = doctor.to_dict()

    return {
        "uid": doctor_uid,
        "name": user_data.get("name"),
        "email": user_data.get("email"),
        "phone": user_data.get("phone"),
        "specialization": doctor_data.get("specialization"),
        "qualification": doctor_data.get("qualification"),
        "experience": doctor_data.get("experience"),
        "assignedPatients": doctor_data.get("assignedPatients", 0),
    }


# ---------------------------------
# DOCTOR'S ASSIGNED PATIENTS
# ---------------------------------

def get_doctor_patients(doctor_uid):

    patients = []

    docs = (
        db.collection("patients")
        .where("doctorId", "==", doctor_uid)
        .stream()
    )

    for doc in docs:

        patient = doc.to_dict()

        uid = patient.get("userId", doc.id)

        user = db.collection("users").document(uid).get()
        user_data = user.to_dict() if user.exists else {}

        patients.append({
            "uid": uid,
            "patientName": patient.get("patientName"),
            "email": user_data.get("email"),
            "phone": user_data.get("phone"),
            "age": patient.get("age"),
            "gender": patient.get("gender"),
            "bloodGroup": patient.get("bloodGroup"),
            "diagnosis": patient.get("diagnosis"),
            "totalSessions": patient.get("totalSessions", 0),
            "isActive": user_data.get("isActive", True),
        })

    return patients


# ---------------------------------
# SESSIONS ACROSS A DOCTOR'S PATIENTS
# ---------------------------------

def get_doctor_sessions(doctor_uid):

    patients = get_doctor_patients(doctor_uid)

    name_by_uid = {p["uid"]: p["patientName"] for p in patients}

    sessions = []

    for uid in name_by_uid:

        docs = (
            db.collection("sessions")
            .where("patientId", "==", uid)
            .stream()
        )

        for doc in docs:

            session = doc.to_dict()
            session["sessionId"] = doc.id
            session["patientName"] = name_by_uid[uid]
            sessions.append(session)

    sessions.sort(
        key=lambda s: s.get("sessionDate", ""),
        reverse=True
    )

    return sessions


def get_doctor_dashboard(doctor_uid):

    dashboard = {}

    # ------------------------
    # ASSIGNED PATIENTS
    # ------------------------

    patients = []

    patient_docs = (

        db.collection("patients")

        .where("doctorId", "==", doctor_uid)

        .stream()

    )

    for doc in patient_docs:

        patient = doc.to_dict()

        patient["uid"] = doc.id

        patients.append(patient)

    dashboard["assignedPatients"] = len(patients)

    dashboard["patients"] = patients

    # ------------------------
    # TODAY
    # ------------------------

    today = datetime.now().strftime("%Y-%m-%d")

    today_sessions = []

    high = 0

    total_risk = 0

    risk_count = 0

    risk = {

        "High": 0,

        "Medium": 0,

        "Low": 0,

    }

    for patient in patients:

        docs = (

            db.collection("sessions")

            .where("patientId", "==", patient["uid"])

            .stream()

        )

        for doc in docs:

            session = doc.to_dict()

            session["sessionId"] = doc.id

            session["patientName"] = patient["patientName"]

            # Today's schedule

            if session.get("sessionDate") == today:

                today_sessions.append(session)

            # Risk

            level = session.get("riskLevel", "Low")

            if level in risk:

                risk[level] += 1

            if level == "High":

                high += 1

            total_risk += float(

                session.get("riskScore", 0)

            )

            risk_count += 1

    dashboard["todaySessions"] = len(today_sessions)

    dashboard["todaySchedule"] = today_sessions

    dashboard["highRiskPatients"] = high

    dashboard["averageRisk"] = (

        round(total_risk / risk_count, 1)

        if risk_count

        else 0

    )

    dashboard["riskDistribution"] = [

        {

            "name": "High",

            "value": risk["High"],

        },

        {

            "name": "Medium",

            "value": risk["Medium"],

        },

        {

            "name": "Low",

            "value": risk["Low"],

        },

    ]

    return dashboard