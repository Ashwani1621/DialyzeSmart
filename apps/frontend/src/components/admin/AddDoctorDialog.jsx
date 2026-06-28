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

import { createDoctor } from "../../services/doctorService";

function AddDoctorDialog({ open, setOpen, refreshDoctors }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      qualification: "",
      experience: "",
    });
  };

  const handleClose = () => {
    clearForm();
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.phone.trim() ||
      !formData.specialization.trim() ||
      !formData.qualification.trim() ||
      !formData.experience
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await createDoctor({
        ...formData,
        experience: Number(formData.experience),
      });

      await refreshDoctors();

      alert("Doctor created successfully!");

      handleClose();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to create doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent className="!max-w-5xl w-[92vw] rounded-3xl p-8">

        <DialogHeader>

          <DialogTitle className="text-3xl font-bold">
            Add New Doctor
          </DialogTitle>

          <DialogDescription className="text-base">
            Enter the doctor's information below.
          </DialogDescription>

        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8"
        >

          {/* Personal Information */}

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Doctor Name
                </label>

                <Input
                  name="name"
                  placeholder="Dr. John Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>

                <Input
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <Input
                  type="email"
                  name="email"
                  placeholder="doctor@dialyzesmart.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Temporary Password
                </label>

                <Input
                  type="password"
                  name="password"
                  placeholder="Temporary password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

            </div>

          </div>

          {/* Professional Information */}

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Professional Information
            </h3>

            <div className="grid grid-cols-3 gap-6">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Specialization
                </label>

                <Input
                  name="specialization"
                  placeholder="Nephrologist"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Qualification
                </label>

                <Input
                  name="qualification"
                  placeholder="MD, DM"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Experience (Years)
                </label>

                <Input
                  type="number"
                  name="experience"
                  placeholder="5"
                  value={formData.experience}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

            </div>

          </div>

          <div className="flex justify-end gap-4 border-t pt-6">

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="min-w-40"
            >
              {loading ? "Creating..." : "Create Doctor"}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}

export default AddDoctorDialog;