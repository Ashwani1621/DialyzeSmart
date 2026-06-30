import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import RiskBadge from "./RiskBadge";

function SessionsTable({ sessions = [], showPatient = false }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Date</TableHead>
            {showPatient && <TableHead>Patient</TableHead>}
            <TableHead>Duration</TableHead>
            <TableHead>Albumin Loss</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Risk</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sessions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showPatient ? 7 : 6}
                className="py-8 text-center text-slate-500"
              >
                No sessions found.
              </TableCell>
            </TableRow>
          ) : (
            sessions.map((s) => (
              <TableRow key={s.sessionId}>
                <TableCell>{s.sessionNumber}</TableCell>
                <TableCell>{s.sessionDate}</TableCell>
                {showPatient && <TableCell>{s.patientName}</TableCell>}
                <TableCell>{s.duration}</TableCell>
                <TableCell>{s.albuminLoss} g/dL</TableCell>
                <TableCell>{s.riskScore}%</TableCell>
                <TableCell>
                  <RiskBadge level={s.riskLevel} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default SessionsTable;
