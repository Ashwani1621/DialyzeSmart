import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";

function Field({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-xs uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-medium">{value ?? "—"}</p>
    </div>
  );
}

function AdminProfile() {
  const { currentUser, userData, userRole } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">My Profile</h1>
          <p className="mt-2 text-slate-500">Your account details.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Name" value={userData?.name} />
          <Field label="Email" value={userData?.email || currentUser?.email} />
          <Field label="Phone" value={userData?.phone} />
          <Field label="Role" value={userRole} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminProfile;
