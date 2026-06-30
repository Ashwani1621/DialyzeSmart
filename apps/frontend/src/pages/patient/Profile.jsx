import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import { getPatientProfile } from "../../services/patientPortalService";

function Field({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-medium">{value ?? "—"}</p>
    </div>
  );
}

function PatientProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      try {
        const res = await getPatientProfile(currentUser.uid);
        if (res.success) setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="mt-2 text-slate-500">Your personal and medical details.</p>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading profile...</p>
        ) : !profile ? (
          <p className="text-slate-500">Profile not found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name" value={profile.patientName} />
            <Field label="Email" value={profile.email} />
            <Field label="Phone" value={profile.phone} />
            <Field label="Age" value={profile.age} />
            <Field label="Gender" value={profile.gender} />
            <Field label="Blood Group" value={profile.bloodGroup} />
            <Field label="Height" value={profile.height} />
            <Field label="Weight" value={profile.weight} />
            <Field label="Diagnosis" value={profile.diagnosis} />
            <Field label="Assigned Doctor" value={profile.doctorName} />
            <Field label="Total Sessions" value={profile.totalSessions} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PatientProfile;
