import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PrescriptionCard from "../../components/common/PrescriptionCard";
import { useAuth } from "../../hooks/useAuth";
import { getPatientPrescriptions } from "../../services/prescriptionService";

function PatientPrescription() {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      try {
        const res = await getPatientPrescriptions(currentUser.uid);
        if (res.success) setPrescriptions(res.data || []);
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
          <h1 className="text-4xl font-bold">My Prescriptions</h1>
          <p className="mt-2 text-slate-500">
            Prescriptions issued by your doctor.
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p className="rounded-2xl border bg-white p-8 text-center text-slate-500">
            No prescriptions yet.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {prescriptions.map((p) => (
              <PrescriptionCard key={p.id} prescription={p} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PatientPrescription;
