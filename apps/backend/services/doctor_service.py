from firebase_admin import auth
from google.cloud.firestore_v1 import SERVER_TIMESTAMP
from config.firebase import db


def create_doctor(data):
    # Create Firebase Authentication user
    user = auth.create_user(
        email=data["email"],
        password=data["password"]
    )

    uid = user.uid

    # Store common user information
    db.collection("users").document(uid).set({
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "role": "doctor",
        "isActive": True,
        "createdAt": SERVER_TIMESTAMP
    })

    # Store doctor-specific information
    db.collection("doctors").document(uid).set({
        "userId": uid,
        "specialization": data["specialization"],
        "qualification": data["qualification"],
        "experience": data["experience"],
        "assignedPatients": 0,
        "createdAt": SERVER_TIMESTAMP
    })

    return uid


def get_all_doctors():
    doctors = []

    docs = db.collection("doctors").stream()

    for doc in docs:
        doctor = doc.to_dict()

        uid = doctor["userId"]

        user = db.collection("users").document(uid).get()

        if user.exists:
            user_data = user.to_dict()

            doctors.append({
                "uid": uid,
                "name": user_data.get("name"),
                "email": user_data.get("email"),
                "phone": user_data.get("phone"),
                "isActive": user_data.get("isActive"),
                "specialization": doctor.get("specialization"),
                "qualification": doctor.get("qualification"),
                "experience": doctor.get("experience"),
            })

    return doctors

def update_doctor(uid, data):
    # Update common user information
    db.collection("users").document(uid).update({
        "name": data["name"],
        "phone": data["phone"]
    })

    # Update doctor-specific information
    db.collection("doctors").document(uid).update({
        "specialization": data["specialization"],
        "qualification": data["qualification"],
        "experience": data["experience"]
    })

    return True


def change_doctor_status(uid, is_active):
    db.collection("users").document(uid).update({
        "isActive": is_active
    })

    return True


def delete_doctor(uid):
    """
    Hard delete:
    - Unassign the doctor's patients
    - Remove the doctor's prescriptions
    - Delete the doctor + user documents and the Auth account
    """

    # Unassign patients so they don't point at a deleted doctor

    for patient in db.collection("patients").where(
        "doctorId", "==", uid
    ).stream():

        patient.reference.update({"doctorId": ""})

    # Hard delete the doctor's prescriptions

    for prescription in db.collection("prescriptions").where(
        "doctorId", "==", uid
    ).stream():

        prescription.reference.delete()

    # Hard delete the doctor + user documents

    db.collection("doctors").document(uid).delete()

    db.collection("users").document(uid).delete()

    # Remove the Firebase Auth account

    try:

        auth.delete_user(uid)

    except auth.UserNotFoundError:

        pass

    return True