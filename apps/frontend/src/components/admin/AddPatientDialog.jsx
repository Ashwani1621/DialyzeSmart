import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  createPatient,
} from "../../services/patientService";

import {
  getDoctors,
} from "../../services/doctorService";

function AddPatientDialog({
  open,
  setOpen,
  refreshPatients,
}) {

  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({

    patientName: "",

    email: "",

    password: "",

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

    doctorId: "",

  });

  useEffect(() => {

    async function loadDoctors() {

      try {

        const res = await getDoctors();

        setDoctors(res.data);

      } catch (err) {

        console.error(err);

      }

    }

    if (open) {

      loadDoctors();

    }

  }, [open]);

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

      await createPatient({

        ...formData,

        age: Number(formData.age),

        height: Number(formData.height),

        weight: Number(formData.weight),

        diabetes: Number(formData.diabetes),

        hypertension: Number(formData.hypertension),

        cardiovascular_disease: Number(formData.cardiovascular_disease),

      });

      await refreshPatients();

      setOpen(false);

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to create patient."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogContent className="!max-w-6xl rounded-3xl">

        <DialogHeader>

          <DialogTitle className="text-3xl">

            Add Patient

          </DialogTitle>

          <DialogDescription>

            Register a new dialysis patient.

          </DialogDescription>

        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-8"
        >

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-6">

              <Input
                name="patientName"
                placeholder="Patient Name"
                value={formData.patientName}
                onChange={handleChange}
              />

              <Input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              <Input
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="rounded-xl border p-3"
              >

                <option value="">
                  Select Gender
                </option>

                <option>
                  Male
                </option>

                <option>
                  Female
                </option>

              </select>

            </div>

          </div>

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Medical Information
            </h3>

            <div className="grid grid-cols-3 gap-6">

              <Input
                name="bloodGroup"
                placeholder="Blood Group"
                value={formData.bloodGroup}
                onChange={handleChange}
              />

              <Input
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleChange}
              />

              <Input
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
              />

            </div>

            <Input
              className="mt-6"
              name="diagnosis"
              placeholder="Diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
            />

          </div>

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Comorbidities
            </h3>

            <div className="grid grid-cols-3 gap-6">

              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Diabetes
                <select
                  name="diabetes"
                  value={formData.diabetes}
                  onChange={handleChange}
                  className="rounded-xl border p-3"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Hypertension
                <select
                  name="hypertension"
                  value={formData.hypertension}
                  onChange={handleChange}
                  className="rounded-xl border p-3"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Cardiovascular Disease
                <select
                  name="cardiovascular_disease"
                  value={formData.cardiovascular_disease}
                  onChange={handleChange}
                  className="rounded-xl border p-3"
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </label>

            </div>

          </div>

          <div>

            <h3 className="mb-5 text-lg font-semibold">
              Assign Doctor
            </h3>

            <select
              className="w-full rounded-xl border p-3"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
            >

              <option value="">
                Select Doctor
              </option>

              {doctors.map((doctor) => (

                <option
                  key={doctor.uid}
                  value={doctor.uid}
                >

                  {doctor.name}

                </option>

              ))}

            </select>

          </div>

          <div className="flex justify-end gap-4">

            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >

              Cancel

            </Button>

            <Button
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Creating..."
                : "Create Patient"}

            </Button>

          </div>

        </form>

      </DialogContent>

    </Dialog>

  );

}

export default AddPatientDialog;