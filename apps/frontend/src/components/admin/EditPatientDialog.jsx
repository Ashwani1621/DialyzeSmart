import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { updatePatient } from "../../services/patientService";

function EditPatientDialog({ open, setOpen, patient, refreshPatients }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    diagnosis: "",
    height: "",
    weight: "",
    diabetes: "0",
    hypertension: "0",
    cardiovascular_disease: "0",
  });

  const handleOpenChange = (isOpen) => {
    if (isOpen && patient) {
      setFormData({
        patientName: patient.patientName ?? "",
        phone: patient.phone ?? "",
        age: patient.age ?? "",
        gender: patient.gender ?? "",
        bloodGroup: patient.bloodGroup ?? "",
        diagnosis: patient.diagnosis ?? "",
        height: patient.height ?? "",
        weight: patient.weight ?? "",
        diabetes: String(patient.diabetes ?? 0),
        hypertension: String(patient.hypertension ?? 0),
        cardiovascular_disease: String(patient.cardiovascular_disease ?? 0),
      });
    }

    setOpen(isOpen);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updatePatient(patient.uid, {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        diabetes: Number(formData.diabetes),
        hypertension: Number(formData.hypertension),
        cardiovascular_disease: Number(formData.cardiovascular_disease),
      });

      await refreshPatients();

      alert("Patient updated successfully.");

      setOpen(false);
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to update patient.");
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="!max-w-5xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl">Edit Patient</DialogTitle>

          <DialogDescription>Update patient information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          <div>
            <h2 className="mb-5 text-lg font-semibold">Personal Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Patient Name
                </label>

                <Input
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Age</label>

                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Gender</label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-lg font-semibold">Medical Information</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Blood Group
                </label>

                <Input
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Height (cm)
                </label>

                <Input
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Weight (kg)
                </label>

                <Input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium">
                Diagnosis
              </label>

              <Input
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <h2 className="mb-5 text-lg font-semibold">Comorbidities</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Diabetes
                </label>

                <select
                  name="diabetes"
                  value={formData.diabetes}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Hypertension
                </label>

                <select
                  name="hypertension"
                  value={formData.hypertension}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Cardiovascular Disease
                </label>

                <select
                  name="cardiovascular_disease"
                  value={formData.cardiovascular_disease}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditPatientDialog;
