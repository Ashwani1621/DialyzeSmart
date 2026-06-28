import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecentSessions({ sessions = [] }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Recent Dialysis Sessions</CardTitle>
      </CardHeader>

      <CardContent>
        {sessions.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No recent dialysis sessions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left">Session</th>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Albumin Loss</th>
                  <th className="px-4 py-3 text-left">Risk</th>
                </tr>
              </thead>

              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.sessionId}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-semibold">
                      #{session.sessionNumber}
                    </td>

                    <td className="px-4 py-3">
                      {session.patientName || session.patientId}
                    </td>

                    <td className="px-4 py-3">
                      {session.sessionDate}
                    </td>

                    <td className="px-4 py-3">
                      {session.albuminLoss ?? "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                          session.riskLevel === "High"
                            ? "bg-red-500"
                            : session.riskLevel === "Medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {session.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}