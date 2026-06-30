import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SessionsTable from "../../components/common/SessionsTable";
import { useAuth } from "../../hooks/useAuth";
import { getPatientSessions } from "../../services/patientPortalService";

function PatientSessions() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      try {
        const res = await getPatientSessions(currentUser.uid);
        if (res.success) setSessions(res.data || []);
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
          <h1 className="text-4xl font-bold">My Sessions</h1>
          <p className="mt-2 text-slate-500">
            Your dialysis session history.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading sessions...</p>
        ) : (
          <SessionsTable sessions={sessions} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default PatientSessions;
