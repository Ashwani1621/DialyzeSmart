from firebase_admin import auth
from google.cloud.firestore_v1 import SERVER_TIMESTAMP
from firebase_admin import firestore
from config.firebase import db


# -----------------------------
# CREATE PATIENT
# -----------------------------

def create_patient(data):

    user = auth.create_user(
        email=data["email"],
        password=data["password"]
    )

    uid = user.uid

    # Users collection
    db.collection("users").document(uid).set({

        "name": data["patientName"],
        "email": data["email"],
        "phone": data["phone"],

        "role": "patient",

        "isActive": True,

        "createdAt": SERVER_TIMESTAMP

    })

    # Patients collection
    db.collection("patients").document(uid).set({

        "userId": uid,

        "patientName": data["patientName"],

        "age": data["age"],

        "gender": data["gender"],

        "bloodGroup": data["bloodGroup"],

        "height": data["height"],

        "weight": data["weight"],

        "diagnosis": data["diagnosis"],

        "doctorId": "",
        
        "totalSessions": 0,

        "createdAt": SERVER_TIMESTAMP

    })

    return uid


# -----------------------------
# GET ALL PATIENTS
# -----------------------------

def get_all_patients():

    patients = []

    docs = db.collection("patients").stream()

    for doc in docs:

        patient = doc.to_dict()

        uid = patient["userId"]

        user = db.collection("users").document(uid).get()

        if not user.exists:
            continue

        user_data = user.to_dict()

        doctor_name = ""

        doctor_id = patient.get("doctorId")

        if doctor_id:

            doctor_user = db.collection("users").document(doctor_id).get()

            if doctor_user.exists:
                doctor_name = doctor_user.to_dict().get("name")

        patients.append({

            "uid": uid,

            "patientName": patient.get("patientName"),

            "email": user_data.get("email"),

            "phone": user_data.get("phone"),

            "age": patient.get("age"),

            "gender": patient.get("gender"),

            "bloodGroup": patient.get("bloodGroup"),

            "height": patient.get("height"),

            "weight": patient.get("weight"),

            "diagnosis": patient.get("diagnosis"),

            "doctorId": doctor_id,

            "doctorName": doctor_name,

            "isActive": user_data.get("isActive", True)

        })

    return patients


# ---------------------------------
# UPDATE PATIENT
# ---------------------------------

def update_patient(uid, data):

    db.collection("users").document(uid).update({

        "name": data["patientName"],
        "phone": data["phone"]

    })

    db.collection("patients").document(uid).update({

        "patientName": data["patientName"],
        "age": data["age"],
        "gender": data["gender"],
        "bloodGroup": data["bloodGroup"],
        "height": data["height"],
        "weight": data["weight"],
        "diagnosis": data["diagnosis"]

    })

    return True


# ---------------------------------
# DELETE PATIENT (SOFT DELETE)
# ---------------------------------

def delete_patient(uid):

    patient_doc = db.collection("patients").document(uid).get()

    if patient_doc.exists:

        patient = patient_doc.to_dict()

        doctor_id = patient.get("doctorId")

        if doctor_id:

            doctor_ref = db.collection("doctors").document(doctor_id)

            doctor = doctor_ref.get()

            if doctor.exists:

                count = doctor.to_dict().get(
                    "assignedPatients",
                    0
                )

                doctor_ref.update({

                    "assignedPatients": max(0, count - 1)

                })

    db.collection("users").document(uid).update({

        "isActive": False,
        "isDeleted": True,
        "deletedAt": SERVER_TIMESTAMP

    })

    db.collection("patients").document(uid).update({

        "isDeleted": True

    })

    return True


# ---------------------------------
# ASSIGN / CHANGE DOCTOR
# ---------------------------------

def assign_doctor(patient_uid, doctor_uid):

    patient_ref = db.collection("patients").document(patient_uid)

    patient = patient_ref.get()

    if not patient.exists:

        raise Exception("Patient not found.")

    patient_data = patient.to_dict()

    old_doctor = patient_data.get("doctorId")

    # Remove patient count from old doctor

    if old_doctor and old_doctor != doctor_uid:

        old_ref = db.collection("doctors").document(old_doctor)

        old_doc = old_ref.get()

        if old_doc.exists:

            count = old_doc.to_dict().get(
                "assignedPatients",
                0
            )

            old_ref.update({

                "assignedPatients": max(0, count - 1)

            })

    # Add patient count to new doctor

    new_ref = db.collection("doctors").document(doctor_uid)

    new_doc = new_ref.get()

    if not new_doc.exists:

        raise Exception("Doctor not found.")

    count = new_doc.to_dict().get(
        "assignedPatients",
        0
    )

    new_ref.update({

        "assignedPatients": count + 1

    })

    # Update patient

    patient_ref.update({

        "doctorId": doctor_uid

    })

    return True

@firestore.transactional
def get_next_session_number(transaction, patient_ref):

    snapshot = patient_ref.get(transaction=transaction)

    total = snapshot.get("totalSessions") or 0

    total += 1

    transaction.update(patient_ref, {
        "totalSessions": total
    })

    return total


# ---------------------------------
# CREATE DIALYSIS SESSION
# ---------------------------------

def create_session(patient_uid, data):

    patient_ref = db.collection("patients").document(patient_uid)

    patient = patient_ref.get()

    if not patient.exists:
        raise Exception("Patient not found.")

    transaction = db.transaction()

    session_number = get_next_session_number(
        transaction,
        patient_ref
    )

    session_ref = db.collection("sessions").document()

    session_ref.set({

        "patientId": patient_uid,

        "sessionNumber": session_number,

        "sessionDate": data["sessionDate"],

        "shift": data["shift"],

        "machineNo": data["machineNo"],

        "duration": data["duration"],

        "dialysisType": data["dialysisType"],

        "accessType": data["accessType"],

        # Machine Parameters

        "bloodFlowRate": data["bloodFlowRate"],

        "dialysateFlowRate": data["dialysateFlowRate"],

        "ufGoal": data["ufGoal"],

        "ufVolume": data["ufVolume"],

        # Vitals

        "heartRate": data["heartRate"],

        "systolicBP": data["systolicBP"],

        "diastolicBP": data["diastolicBP"],

        "spo2": data["spo2"],

        "temperature": data["temperature"],

        # Labs

        "albuminBefore": data["albuminBefore"],

        "albuminAfter": data["albuminAfter"],

        "albuminLoss":
            data["albuminBefore"] -
            data["albuminAfter"],

        "hemoglobin": data["hemoglobin"],

        "potassium": data["potassium"],

        "creatinine": data["creatinine"],

        "urea": data["urea"],

        "ktv": data["ktv"],

        # AI

        "predictedAlbuminLoss":
            data["predictedAlbuminLoss"],

        "riskScore": data["riskScore"],

        "riskLevel": data["riskLevel"],

        "recommendation":
            data["recommendation"],

        "createdAt": SERVER_TIMESTAMP

    })

    return session_ref.id


# ---------------------------------
# GET ALL SESSIONS OF PATIENT
# ---------------------------------

def get_sessions(patient_uid):

    sessions = []

    docs = (
        db.collection("sessions")
        .where("patientId", "==", patient_uid)
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

    return sessions
# ---------------------------------
# UPDATE SESSION
# ---------------------------------

def update_session(session_id, data):

    session_ref = db.collection("sessions").document(session_id)

    if not session_ref.get().exists:
        raise Exception("Session not found.")

    albumin_before = float(data.get("albuminBefore", 0))
    albumin_after = float(data.get("albuminAfter", 0))

    session_ref.update({

        # Session

        "sessionDate": data["sessionDate"],
        "shift": data["shift"],
        "machineNo": data["machineNo"],
        "duration": data["duration"],
        "dialysisType": data["dialysisType"],
        "accessType": data["accessType"],

        # Machine

        "bloodFlowRate": float(data["bloodFlowRate"]),
        "dialysateFlowRate": float(data["dialysateFlowRate"]),
        "ufGoal": float(data["ufGoal"]),
        "ufVolume": float(data["ufVolume"]),

        # Vitals

        "heartRate": float(data["heartRate"]),
        "systolicBP": float(data["systolicBP"]),
        "diastolicBP": float(data["diastolicBP"]),
        "spo2": float(data["spo2"]),
        "temperature": float(data["temperature"]),

        # Labs

        "albuminBefore": albumin_before,
        "albuminAfter": albumin_after,
        "albuminLoss": albumin_before - albumin_after,

        "hemoglobin": float(data["hemoglobin"]),
        "potassium": float(data["potassium"]),
        "creatinine": float(data["creatinine"]),
        "urea": float(data["urea"]),
        "ktv": float(data["ktv"]),

        # AI

        "predictedAlbuminLoss": float(data["predictedAlbuminLoss"]),
        "riskScore": float(data["riskScore"]),
        "riskLevel": data["riskLevel"],
        "recommendation": data["recommendation"],

    })

    return True


# ---------------------------------
# DELETE SESSION
# ---------------------------------

def delete_session(session_id):

    session_ref = db.collection("sessions").document(session_id)

    session_doc = session_ref.get()

    if not session_doc.exists:
        raise Exception("Session not found.")

    session = session_doc.to_dict()

    patient_id = session["patientId"]

    session_ref.delete()

    patient_ref = db.collection("patients").document(patient_id)

    patient_doc = patient_ref.get()

    if patient_doc.exists:

        total = patient_doc.to_dict().get("totalSessions", 0)

        patient_ref.update({

            "totalSessions": max(total - 1, 0)

        })

    return True