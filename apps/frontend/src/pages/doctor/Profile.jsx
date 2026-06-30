import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { getDoctorProfile } from "../../services/doctorService";

function Field({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-medium">{value ?? "—"}</p>
    </div>
  );
}

function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const res = await getDoctorProfile(user.uid);
        if (res.success) setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="mt-2 text-slate-500">Your professional details.</p>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading profile...</p>
        ) : !profile ? (
          <p className="text-slate-500">Profile not found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name" value={profile.name} />
            <Field label="Email" value={profile.email} />
            <Field label="Phone" value={profile.phone} />
            <Field label="Specialization" value={profile.specialization} />
            <Field label="Qualification" value={profile.qualification} />
            <Field label="Experience" value={`${profile.experience} years`} />
            <Field label="Assigned Patients" value={profile.assignedPatients} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorProfile;
