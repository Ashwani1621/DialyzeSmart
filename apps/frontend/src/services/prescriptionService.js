import api from "./api";

export const createPrescription = async (data) => {
  const response = await api.post("/api/doctor/prescriptions", data);
  return response.data;
};

export const getDoctorPrescriptions = async (uid) => {
  const response = await api.get(`/api/doctor/${uid}/prescriptions`);
  return response.data;
};

export const getPatientPrescriptions = async (uid) => {
  const response = await api.get(`/api/patient/${uid}/prescriptions`);
  return response.data;
};

export const updatePrescription = async (id, data) => {
  const response = await api.put(`/api/prescriptions/${id}`, data);
  return response.data;
};

export const deletePrescription = async (id) => {
  const response = await api.delete(`/api/prescriptions/${id}`);
  return response.data;
};
