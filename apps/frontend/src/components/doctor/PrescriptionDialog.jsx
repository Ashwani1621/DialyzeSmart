import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  createPrescription,
  updatePrescription,
} from "../../services/prescriptionService";

const emptyMed = { name: "", dosage: "", frequency: "" };

function PrescriptionDialog({
  open,
  setOpen,
  doctorId,
  patients = [],
  prescription = null,
  refresh,
}) {
  const isEdit = Boolean(prescription);

  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [medications, setMedications] = useState([{ ...emptyMed }]);
  const [dietNotes, setDietNotes] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (prescription) {
      setPatientId(prescription.patientId || "");
      setMedications(
        prescription.medications?.length
          ? prescription.medications
          : [{ ...emptyMed }],
      );
      setDietNotes(prescription.dietNotes || "");
      setGeneralNotes(prescription.generalNotes || "");
    } else {
      setPatientId("");
      setMedications([{ ...emptyMed }]);
      setDietNotes("");
      setGeneralNotes("");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [prescription, open]);

  const updateMed = (index, field, value) => {
    setMedications((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  };

  const addMed = () => setMedications((prev) => [...prev, { ...emptyMed }]);

  const removeMed = (index) =>
    setMedications((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && !patientId) {
      alert("Please select a patient.");
      return;
    }

    const meds = medications.filter((m) => m.name.trim());

    if (meds.length === 0) {
      alert("Add at least one medication.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        medications: meds,
        dietNotes,
        generalNotes,
        status: "active",
      };

      if (isEdit) {
        await updatePrescription(prescription.id, payload);
      } else {
        await createPrescription({ ...payload, doctorId, patientId });
      }

      await refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to save prescription.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && setOpen(false)}>
      <DialogContent className="!max-w-3xl w-[92vw] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEdit ? "Edit Prescription" : "New Prescription"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update medications and notes."
              : "Create a prescription for one of your patients."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {!isEdit && (
            <div>
              <label className="mb-2 block text-sm font-medium">Patient</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-xl border p-3"
              >
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.uid} value={p.uid}>
                    {p.patientName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Medications</label>
              <button
                type="button"
                onClick={addMed}
                className="flex items-center gap-1 text-sm text-blue-600"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="space-y-3">
              {medications.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Medicine name"
                    value={m.name}
                    onChange={(e) => updateMed(i, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Dosage"
                    value={m.dosage}
                    onChange={(e) => updateMed(i, "dosage", e.target.value)}
                  />
                  <Input
                    placeholder="Frequency"
                    value={m.frequency}
                    onChange={(e) => updateMed(i, "frequency", e.target.value)}
                  />
                  {medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMed(i)}
                      className="rounded-lg p-2 hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Diet Notes</label>
            <textarea
              rows={3}
              value={dietNotes}
              onChange={(e) => setDietNotes(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              General Notes
            </label>
            <textarea
              rows={3}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="flex justify-end gap-4 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-40">
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PrescriptionDialog;
