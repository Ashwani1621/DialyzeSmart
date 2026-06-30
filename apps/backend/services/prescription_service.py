from datetime import datetime, timezone

from google.cloud.firestore_v1 import SERVER_TIMESTAMP

from config.firebase import db


def _name_of(uid):
    if not uid:
        return ""
    doc = db.collection("users").document(uid).get()
    return doc.to_dict().get("name", "") if doc.exists else ""


# ---------------------------------
# CREATE PRESCRIPTION
# ---------------------------------

def create_prescription(data):

    doctor_id = data["doctorId"]
    patient_id = data["patientId"]

    ref = db.collection("prescriptions").document()

    ref.set({
        "doctorId": doctor_id,
        "patientId": patient_id,
        "medications": data.get("medications", []),
        "dietNotes": data.get("dietNotes", ""),
        "generalNotes": data.get("generalNotes", ""),
        "status": data.get("status", "active"),
        "createdAt": SERVER_TIMESTAMP,
    })

    return ref.id


# ---------------------------------
# LIST (joined with names)
# ---------------------------------

def _serialize(doc):
    p = doc.to_dict()
    p["id"] = doc.id
    p["doctorName"] = _name_of(p.get("doctorId"))
    p["patientName"] = _name_of(p.get("patientId"))
    return p


# Sort newest-first in Python so the query stays a single-field filter
# (avoids needing a composite Firestore index for filter + order_by).

def _newest_first(prescriptions):
    oldest = datetime.min.replace(tzinfo=timezone.utc)
    return sorted(
        prescriptions,
        key=lambda p: p.get("createdAt") or oldest,
        reverse=True,
    )


def get_prescriptions_by_doctor(doctor_uid):

    docs = (
        db.collection("prescriptions")
        .where("doctorId", "==", doctor_uid)
        .stream()
    )

    return _newest_first([_serialize(doc) for doc in docs])


def get_prescriptions_by_patient(patient_uid):

    docs = (
        db.collection("prescriptions")
        .where("patientId", "==", patient_uid)
        .stream()
    )

    return _newest_first([_serialize(doc) for doc in docs])


# ---------------------------------
# UPDATE / DELETE
# ---------------------------------

def update_prescription(prescription_id, data):

    ref = db.collection("prescriptions").document(prescription_id)

    if not ref.get().exists:
        raise Exception("Prescription not found.")

    ref.update({
        "medications": data.get("medications", []),
        "dietNotes": data.get("dietNotes", ""),
        "generalNotes": data.get("generalNotes", ""),
        "status": data.get("status", "active"),
    })

    return True


def delete_prescription(prescription_id):

    ref = db.collection("prescriptions").document(prescription_id)

    if not ref.get().exists:
        raise Exception("Prescription not found.")

    ref.delete()

    return True
