import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

import AdminDashboard from "../pages/admin/Dashboard";
import Doctors from "../pages/admin/Doctors";
import Patients from "../pages/admin/Patients";
import PatientSessions from "../pages/admin/PatientSessions";

import DoctorDashboard from "../pages/doctor/Dashboard";
import PatientDashboard from "../pages/patient/Dashboard";

import Unauthorized from "../pages/shared/Unauthorized";

import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <Doctors />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/patients"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <Patients />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* NEW PATIENT SESSION PAGE */}

        <Route
          path="/admin/patients/:patientId/sessions"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <PatientSessions />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* ================= DOCTOR ================= */}

        <Route
          path="/doctor/dashboard"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="doctor">
                <DoctorDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* ================= PATIENT ================= */}

        <Route
          path="/patient/dashboard"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="patient">
                <PatientDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* ================= COMMON ================= */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* 404 */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;