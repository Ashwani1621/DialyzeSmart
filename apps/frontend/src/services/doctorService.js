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


export const getDoctorDashboard = async (doctorId) => {
  const response = await api.get("/api/doctor/dashboard", {
    params: { doctorId },
  });

  return response.data;
};