import api from "./api";

export const getPatients = async () => {
  const response = await api.get("/api/admin/patients");
  return response.data;
};

export const createPatient = async (patient) => {
  const response = await api.post("/api/admin/patients", patient);
  return response.data;
};

export const updatePatient = async (uid, data) => {
  const response = await api.put(
    `/api/admin/patients/${uid}`,
    data
  );

  return response.data;
};

export const deletePatient = async (uid) => {
  const response = await api.delete(
    `/api/admin/patients/${uid}`
  );

  return response.data;
};

export const assignDoctor = async (uid, doctorId) => {
  const response = await api.patch(
    `/api/admin/patients/${uid}/doctor`,
    {
      doctorId,
    }
  );

  return response.data;
};

export const getPatientSessions = async (uid) => {
  const response = await api.get(
    `/api/admin/patients/${uid}/sessions`
  );

  return response.data;
};

export const addSession = async (patientId, sessionData) => {
  const response = await api.post(
    `/api/admin/patients/${patientId}/sessions`,
    sessionData
  );

  return response.data;
};

export const updateSession = async (sessionId, data) => {

  const response = await api.put(
    `/api/admin/sessions/${sessionId}`,
    data
  );

  return response.data;

};

export const deleteSession = async (sessionId) => {

  const response = await api.delete(
    `/api/admin/sessions/${sessionId}`
  );

  return response.data;

};