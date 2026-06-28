import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  UserCheck,
  Stethoscope,
} from "lucide-react";

import { getDoctors } from "../../services/doctorService";
import { assignDoctor } from "../../services/patientService";

function AssignDoctorDialog({
  open,
  setOpen,
  patient,
  refreshPatients,
}) {
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);

  const [doctorId, setDoctorId] = useState("");

  useEffect(() => {

  if (!open || !patient) return;

  const initialize = async () => {

    try {

      const res = await getDoctors();

      setDoctors(Array.isArray(res.data) ? res.data : []);

      setDoctorId(patient.doctorId ?? "");

    } catch (err) {

      console.error(err);

    }

  };

  initialize();

}, [open, patient]);
  const handleAssign = async () => {

    if (!doctorId) {

      alert("Please select a doctor.");

      return;

    }

    try {

      setLoading(true);

      await assignDoctor(patient.uid, doctorId);

      await refreshPatients();

      alert("Doctor assigned successfully.");

      setOpen(false);

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to assign doctor."
      );

    } finally {

      setLoading(false);

    }

  };

  if (!patient) return null;

  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogContent className="max-w-2xl rounded-3xl">

        <DialogHeader>

          <DialogTitle className="flex items-center gap-3 text-3xl">

            <UserCheck className="text-blue-600" />

            Assign Doctor

          </DialogTitle>

          <DialogDescription>

            Assign or change the doctor responsible for this patient.

          </DialogDescription>

        </DialogHeader>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">

          <h2 className="text-xl font-semibold">

            {patient.patientName}

          </h2>

          <p className="mt-2 text-slate-500">

            Current Doctor :
            {" "}
            <span className="font-medium">

              {patient.doctorName || "Not Assigned"}

            </span>

          </p>

        </div>

        <div className="mt-8">

          <label className="mb-2 block font-medium">

            Select Doctor

          </label>

          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full rounded-xl border p-4"
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
                {" • "}
                {doctor.specialization}

              </option>

            ))}

          </select>

        </div>

        {doctorId && (

          <div className="mt-6 rounded-xl border bg-blue-50 p-4">

            <div className="flex items-center gap-2">

              <Stethoscope
                size={20}
                className="text-blue-600"
              />

              <span className="font-medium">

                New Doctor Selected

              </span>

            </div>

            <p className="mt-2 text-slate-600">

              {
                doctors.find(
                  (d) => d.uid === doctorId
                )?.name
              }

            </p>

          </div>

        )}

        <div className="mt-8 flex justify-end gap-4">

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >

            Cancel

          </Button>

          <Button
            disabled={loading}
            onClick={handleAssign}
          >

            {loading
              ? "Assigning..."
              : "Assign Doctor"}

          </Button>

        </div>

      </DialogContent>

    </Dialog>

  );

}

export default AssignDoctorDialog;