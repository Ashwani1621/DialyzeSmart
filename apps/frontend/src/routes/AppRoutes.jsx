import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

import AdminDashboard from "../pages/admin/Dashboard";
import Doctors from "../pages/admin/Doctors";
import Patients from "../pages/admin/Patients";
import PatientSessions from "../pages/admin/PatientSessions";
import Reports from "../pages/admin/Reports";
import AdminProfile from "../pages/admin/Profile";

import DoctorDashboard from "../pages/doctor/Dashboard";
import MyPatients from "../pages/doctor/MyPatients";
import DoctorSessions from "../pages/doctor/Sessions";
import DoctorPrescription from "../pages/doctor/Prescription";
import DoctorProfile from "../pages/doctor/Profile";

import PatientDashboard from "../pages/patient/Dashboard";
import MySessions from "../pages/patient/Sessions";
import PatientPrescription from "../pages/patient/Prescription";
import MyProfile from "../pages/patient/Profile";

import Unauthorized from "../pages/shared/Unauthorized";
import NotFound from "../pages/shared/NotFound";

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

        <Route
          path="/admin/reports"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <Reports />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminProfile />
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

        <Route
          path="/doctor/patients"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="doctor">
                <MyPatients />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/sessions"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="doctor">
                <DoctorSessions />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/prescriptions"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="doctor">
                <DoctorPrescription />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/profile"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="doctor">
                <DoctorProfile />
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

        <Route
          path="/patient/sessions"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="patient">
                <MySessions />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/patient/prescriptions"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="patient">
                <PatientPrescription />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/patient/profile"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="patient">
                <MyProfile />
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
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;