import {
  Eye,
  Pencil,
  Shield,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DoctorTable({
  doctors = [],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onRevoke = () => {},
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow">

      <Table>

        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {doctors.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-slate-500"
              >
                No doctors found.
              </TableCell>
            </TableRow>
          ) : (
            (Array.isArray(doctors) ? doctors : []).map((doctor) => (
              <TableRow key={doctor.uid}>

                <TableCell>
                  <div>
                    <p className="font-semibold">
                      {doctor.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {doctor.phone}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  {doctor.email}
                </TableCell>

                <TableCell>
                  {doctor.specialization}
                </TableCell>

                <TableCell>
                  {doctor.experience} Years
                </TableCell>

                <TableCell>

                  {doctor.isActive ? (
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
                      onClick={() => onView(doctor)}
                      className="rounded-lg p-2 transition hover:bg-slate-100"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit(doctor)}
                      className="rounded-lg p-2 transition hover:bg-slate-100"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onRevoke(doctor)}
                      className="rounded-lg p-2 transition hover:bg-yellow-100"
                    >
                      <Shield size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(doctor)}
                      className="rounded-lg p-2 transition hover:bg-red-100"
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

export default DoctorTable;