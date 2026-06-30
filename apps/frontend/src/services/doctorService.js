import api from "./api";

export const getDoctors = async () => {
  const response = await api.get("/api/admin/doctors");
  return response.data;
};

export const createDoctor = async (doctor) => {
  const response = await api.post("/api/admin/doctors", doctor);
  return response.data;
};

export const updateDoctor = async (uid, data) => {
  const response = await api.put(
    `/api/admin/doctors/${uid}`,
    data
  );

  return response.data;
};

export const deleteDoctor = async (uid) => {
  const response = await api.delete(
    `/api/admin/doctors/${uid}`
  );

  return response.data;
};

export const changeDoctorStatus = async (uid, isActive) => {
  const response = await api.patch(
    `/api/admin/doctors/${uid}/status`,
    { isActive }
  );

  return response.data;
};


export const getDoctorDashboard = async (doctorId) => {
  const response = await api.get("/api/doctor/dashboard", {
    params: { doctorId },
  });

  return response.data;
};

export const getDoctorPatients = async (uid) => {
  const response = await api.get(`/api/doctor/${uid}/patients`);
  return response.data;
};

export const getDoctorSessions = async (uid) => {
  const response = await api.get(`/api/doctor/${uid}/sessions`);
  return response.data;
};

export const getDoctorProfile = async (uid) => {
  const response = await api.get(`/api/doctor/${uid}/profile`);
  return response.data;
};