import {
  Eye,
  Pencil,
  Trash2,
  UserRoundPlus,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function PatientTable({
  patients = [],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onAssign = () => {},
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow">

      <Table>

        <TableHeader>

          <TableRow>

            <TableHead>Patient</TableHead>

            <TableHead>Age</TableHead>

            <TableHead>Gender</TableHead>

            <TableHead>Blood Group</TableHead>

            <TableHead>Assigned Doctor</TableHead>

            <TableHead>Status</TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>

          </TableRow>

        </TableHeader>

        <TableBody>

          {patients.length === 0 ? (

            <TableRow>

              <TableCell
                colSpan={7}
                className="py-10 text-center text-slate-500"
              >
                No patients found.
              </TableCell>

            </TableRow>

          ) : (

            patients.map((patient) => (

              <TableRow key={patient.uid}>

                <TableCell>

                  <div>

                    <h2 className="font-semibold">
                      {patient.patientName}
                    </h2>

                    <p className="text-xs text-slate-500">
                      {patient.email}
                    </p>

                  </div>

                </TableCell>

                <TableCell>{patient.age}</TableCell>

                <TableCell>{patient.gender}</TableCell>

                <TableCell>{patient.bloodGroup}</TableCell>

                <TableCell>
                  {patient.doctorName || "Not Assigned"}
                </TableCell>

                <TableCell>

                  {patient.isActive ? (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                      Active
                    </span>

                  ) : (

                    <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">
                      Disabled
                    </span>

                  )}

                </TableCell>

                <TableCell>

                  <div className="flex justify-end gap-2">

                    <button
                      onClick={() => onView(patient)}
                      className="rounded-lg p-2 hover:bg-slate-100"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit(patient)}
                      className="rounded-lg p-2 hover:bg-slate-100"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onAssign(patient)}
                      className="rounded-lg p-2 hover:bg-cyan-100"
                    >
                      <UserRoundPlus size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(patient)}
                      className="rounded-lg p-2 hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </TableCell>

              </TableRow>

            ))

          )}

        </TableBody>

      </Table>

    </div>
  );
}

export default PatientTable;