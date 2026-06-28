from datetime import datetime

from config.firebase import db


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