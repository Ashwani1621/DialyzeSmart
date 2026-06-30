import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { auth } from "../../firebase/firebase";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import PrescriptionCard from "../../components/common/PrescriptionCard";
import PrescriptionDialog from "../../components/doctor/PrescriptionDialog";

import { getDoctorPatients } from "../../services/doctorService";
import {
  getDoctorPrescriptions,
  deletePrescription,
} from "../../services/prescriptionService";

function DoctorPrescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const doctorId = auth.currentUser?.uid;

  const load = async () => {
    if (!doctorId) return;
    try {
      const [pres, pats] = await Promise.all([
        getDoctorPrescriptions(doctorId),
        getDoctorPatients(doctorId),
      ]);
      if (pres.success) setPrescriptions(pres.data || []);
      if (pats.success) setPatients(pats.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (prescription) => {
    if (!confirm("Delete this prescription?")) return;
    try {
      await deletePrescription(prescription.id);
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (prescription) => {
    setEditing(prescription);
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Prescriptions</h1>
            <p className="mt-2 text-slate-500">
              Manage prescriptions for your patients.
            </p>
          </div>

          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus size={18} /> New Prescription
          </Button>
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
              <PrescriptionCard
                key={p.id}
                prescription={p}
                showPatient
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <PrescriptionDialog
        open={open}
        setOpen={setOpen}
        doctorId={doctorId}
        patients={patients}
        prescription={editing}
        refresh={load}
      />
    </DashboardLayout>
  );
}

export default DoctorPrescription;
