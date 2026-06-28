import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { updateDoctor } from "../../services/doctorService";

function EditDoctorDialog({
  open,
  setOpen,
  doctor,
  refreshDoctors,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
  });

  const handleOpenChange = (isOpen) => {
    if (isOpen && doctor) {
      setFormData({
        name: doctor.name ?? "",
        phone: doctor.phone ?? "",
        specialization: doctor.specialization ?? "",
        qualification: doctor.qualification ?? "",
        experience: doctor.experience?.toString() ?? "",
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

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateDoctor(doctor.uid, {
        ...formData,
        experience: Number(formData.experience),
      });

      await refreshDoctors();

      alert("Doctor updated successfully.");

      setOpen(false);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to update doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>Edit Doctor</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSave}
          className="mt-6 space-y-5"
        >

          <Input
            name="name"
            placeholder="Doctor Name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            value={doctor.email}
            disabled
          />

          <Input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">

            <Input
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
            />

            <Input
              name="qualification"
              placeholder="Qualification"
              value={formData.qualification}
              onChange={handleChange}
            />

          </div>

          <Input
            type="number"
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3">

            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}

export default EditDoctorDialog;