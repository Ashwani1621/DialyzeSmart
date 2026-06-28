import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  User,
  Calendar,
  Droplets,
  Weight,
  Ruler,
  Phone,
  Mail,
  Stethoscope,
  UserRound,
  Activity,
} from "lucide-react";

function InfoCard({ icon: Icon, title, value }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-xl bg-blue-100 p-3">
          <Icon className="text-blue-600" size={22} />
        </div>

        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="font-semibold">{value || "-"}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function PatientProfileDialog({
  open,
  setOpen,
  patient,
}) {
  const navigate = useNavigate();

  if (!patient) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="!max-w-6xl w-[92vw] rounded-3xl">

        {/* HEADER */}

        <div className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-8 text-white">

          <h1 className="text-4xl font-bold">

            {patient.patientName}

          </h1>

          <p className="mt-2 text-blue-100">

            Assigned Doctor :

            {" "}

            {patient.doctorName || "Not Assigned"}

          </p>

        </div>

        {/* DETAILS */}

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          <InfoCard
            icon={UserRound}
            title="Gender"
            value={patient.gender}
          />

          <InfoCard
            icon={Calendar}
            title="Age"
            value={patient.age}
          />

          <InfoCard
            icon={Droplets}
            title="Blood Group"
            value={patient.bloodGroup}
          />

          <InfoCard
            icon={Weight}
            title="Weight"
            value={`${patient.weight} kg`}
          />

          <InfoCard
            icon={Ruler}
            title="Height"
            value={`${patient.height} cm`}
          />

          <InfoCard
            icon={Phone}
            title="Phone"
            value={patient.phone}
          />

          <InfoCard
            icon={Mail}
            title="Email"
            value={patient.email}
          />

          <InfoCard
            icon={Stethoscope}
            title="Diagnosis"
            value={patient.diagnosis}
          />

          <InfoCard
            icon={Activity}
            title="Status"
            value={
              patient.isActive
                ? "Active"
                : "Inactive"
            }
          />

        </div>

        {/* BUTTONS */}

        <div className="mt-10 flex justify-end gap-4">

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>

          <Button
            onClick={() => {

              setOpen(false);

              navigate(
                `/admin/patients/${patient.uid}/sessions`
              );

            }}
          >

            View Complete Dialysis History

          </Button>

        </div>

      </DialogContent>

    </Dialog>
  );
}

export default PatientProfileDialog;