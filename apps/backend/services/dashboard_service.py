from datetime import datetime

from config.firebase import db


def get_dashboard_data():

    dashboard = {}

    # -----------------------------
    # TOTAL DOCTORS
    # -----------------------------

    doctors = list(
        db.collection("doctors").stream()
    )

    dashboard["totalDoctors"] = len(doctors)

    # -----------------------------
    # TOTAL PATIENTS
    # -----------------------------

    patients = []

    patient_docs = db.collection("patients").stream()

    for doc in patient_docs:

        data = doc.to_dict()

        if not data.get("isDeleted", False):

            data["uid"] = doc.id

            patients.append(data)

    dashboard["totalPatients"] = len(patients)

    # -----------------------------
    # TOTAL SESSIONS
    # -----------------------------

    sessions = []

    session_docs = db.collection("sessions").stream()

    for doc in session_docs:

        data = doc.to_dict()

        data["sessionId"] = doc.id

        sessions.append(data)

    dashboard["totalSessions"] = len(sessions)

    # -----------------------------
    # TODAY'S SESSIONS
    # -----------------------------

    today = datetime.now().strftime("%Y-%m-%d")

    dashboard["todaySessions"] = sum(
        1
        for s in sessions
        if s.get("sessionDate") == today
    )

    # -----------------------------
    # HIGH RISK SESSIONS
    # -----------------------------

    dashboard["highRiskPatients"] = sum(
        1
        for s in sessions
        if str(s.get("riskLevel", "")).lower() == "high"
    )

    # -----------------------------
    # RECENT PATIENTS
    # -----------------------------

    patients.sort(
        key=lambda x: str(
            x.get("createdAt", "")
        ),
        reverse=True,
    )

    dashboard["recentPatients"] = patients[:5]

    # -----------------------------
    # RECENT SESSIONS
    # -----------------------------

    sessions.sort(
        key=lambda x: (
            x.get("sessionDate", ""),
            x.get("sessionNumber", 0),
        ),
        reverse=True,
    )

    dashboard["recentSessions"] = sessions[:5]

    # -----------------------------
    # RISK DISTRIBUTION
    # -----------------------------

    high = 0
    medium = 0
    low = 0

    for s in sessions:

        risk = str(
            s.get("riskLevel", "")
        ).lower()

        if risk == "high":
            high += 1

        elif risk == "medium":
            medium += 1

        else:
            low += 1

    dashboard["riskDistribution"] = [

        {
            "name": "High",
            "value": high,
        },

        {
            "name": "Medium",
            "value": medium,
        },

        {
            "name": "Low",
            "value": low,
        },

    ]

    # -----------------------------
    # SESSION TREND
    # -----------------------------

    trend = {}

    for s in sessions:

        date = s.get("sessionDate")

        if not date:
            continue

        trend[date] = trend.get(date, 0) + 1

    dashboard["sessionTrend"] = [

        {
            "date": k,
            "sessions": v,
        }

        for k, v in sorted(trend.items())

    ]

    # -----------------------------
    # ALBUMIN TREND
    # -----------------------------

    albumin = {}

    count = {}

    for s in sessions:

        number = s.get("sessionNumber")

        if number is None:
            continue

        albumin[number] = (
            albumin.get(number, 0)
            + float(
                s.get("albuminLoss", 0)
            )
        )

        count[number] = (
            count.get(number, 0) + 1
        )

    dashboard["albuminTrend"] = [

        {

            "session": f"S{num}",

            "albuminLoss":
                round(
                    albumin[num]
                    / count[num],
                    2,
                ),

        }

        for num in sorted(albumin)

    ]

    return dashboard