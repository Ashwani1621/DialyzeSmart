import api from "./api";

export const getPatientDashboard = async (uid) => {
  const response = await api.get(`/api/patient/${uid}/dashboard`);
  return response.data;
};

export const getPatientSessions = async (uid) => {
  const response = await api.get(`/api/patient/${uid}/sessions`);
  return response.data;
};

export const getPatientProfile = async (uid) => {
  const response = await api.get(`/api/patient/${uid}/profile`);
  return response.data;
};
