import api from "./api";

export const getPatientSessions = async (patientId) => {
  const response = await api.get(`/api/admin/patients/${patientId}/sessions`);

  return response.data;
};

export const createSession = async (patientId, data) => {
  const response = await api.post(
    `/api/admin/patients/${patientId}/sessions`,

    data,
  );

  return response.data;
};
