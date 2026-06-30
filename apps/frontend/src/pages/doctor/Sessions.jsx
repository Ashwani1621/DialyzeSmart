import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SessionsTable from "../../components/common/SessionsTable";
import { getDoctorSessions } from "../../services/doctorService";

function DoctorSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const res = await getDoctorSessions(user.uid);
        if (res.success) setSessions(res.data || []);
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
          <h1 className="text-4xl font-bold">Patient Sessions</h1>
          <p className="mt-2 text-slate-500">
            Dialysis sessions across your assigned patients.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading sessions...</p>
        ) : (
          <SessionsTable sessions={sessions} showPatient />
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorSessions;
