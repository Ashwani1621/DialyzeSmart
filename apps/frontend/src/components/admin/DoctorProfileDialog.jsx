import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import {
  Mail,
  Phone,
  Stethoscope,
  GraduationCap,
  Briefcase,
  UserCircle,
  Users,
  Calendar,
  Building2,
  ShieldCheck,
} from "lucide-react";

function Card({ icon: Icon, title, value }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-3">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-500">{title}</p>

          <p className="mt-1 break-words text-lg font-semibold text-slate-800">
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}

function DoctorProfileDialog({
  open,
  setOpen,
  doctor,
}) {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-[92vw] w-[92vw] h-[88vh] p-0 overflow-hidden rounded-3xl">

        <div className="grid h-full grid-cols-12">

          {/* LEFT PANEL */}

          <div className="col-span-4 bg-gradient-to-b from-blue-700 via-cyan-600 to-indigo-700 text-white flex flex-col items-center justify-center p-10">

            <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white/20 border-4 border-white/30">

              <UserCircle size={160} />

            </div>

            <h1 className="mt-6 text-3xl font-bold text-center">
              {doctor.name}
            </h1>

            <p className="mt-2 text-lg text-blue-100">
              {doctor.specialization}
            </p>

            <span
              className={`mt-6 rounded-full px-5 py-2 text-sm font-semibold ${
                doctor.isActive
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {doctor.isActive ? "Active" : "Disabled"}
            </span>

            <div className="mt-10 w-full space-y-4">

            </div>

          </div>

          {/* RIGHT PANEL */}

          <div className="col-span-8 bg-slate-100 overflow-y-auto">

            <div className="border-b bg-white px-8 py-6">

              <h2 className="text-3xl font-bold">
                Doctor Details
              </h2>

              <p className="text-slate-500 mt-2">
                Complete profile and professional information.
              </p>

            </div>

            <div className="p-8">

              <div className="grid grid-cols-2 gap-6">

                <Card
                  icon={Mail}
                  title="Email Address"
                  value={doctor.email}
                />

                <Card
                  icon={Phone}
                  title="Phone Number"
                  value={doctor.phone}
                />

                <Card
                  icon={Stethoscope}
                  title="Specialization"
                  value={doctor.specialization}
                />

                <Card
                  icon={GraduationCap}
                  title="Qualification"
                  value={doctor.qualification}
                />

                <Card
                  icon={Briefcase}
                  title="Experience"
                  value={`${doctor.experience} Years`}
                />

                <Card
                  icon={ShieldCheck}
                  title="Account Status"
                  value={
                    doctor.isActive
                      ? "Active"
                      : "Disabled"
                  }
                />

                <Card
                  icon={Users}
                  title="Assigned Patients"
                  value={doctor.assignedPatients ?? 0}
                />

                <Card
                  icon={Calendar}
                  title="Completed Sessions"
                  value={doctor.completedSessions ?? 0}
                />

                <Card
                  icon={Building2}
                  title="Hospital"
                  value={doctor.hospital || "DialyzeSmart"}
                />

                <Card
                  icon={UserCircle}
                  title="Doctor ID"
                  value={doctor.uid}
                />

              </div>

            </div>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}

export default DoctorProfileDialog;