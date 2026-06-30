import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { getDoctorPatients } from "../../services/doctorService";

function MyPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const res = await getDoctorPatients(user.uid);
        if (res.success) setPatients(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = patients.filter((p) =>
    (p.patientName ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Patients</h1>
            <p className="mt-2 text-slate-500">
              {patients.length} assigned patient(s).
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients..."
            className="rounded-xl border px-4 py-2"
          />
        </div>

        {loading ? (
          <p className="text-slate-500">Loading patients...</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-white shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Sessions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-slate-500"
                    >
                      No patients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.uid}>
                      <TableCell className="font-semibold">
                        {p.patientName}
                      </TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.age}</TableCell>
                      <TableCell>{p.gender}</TableCell>
                      <TableCell>{p.diagnosis}</TableCell>
                      <TableCell>{p.totalSessions}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyPatients;
