import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CalendarDays } from "lucide-react";

export default function TodaySchedule({ sessions = [] }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays size={20} />
          Today's Dialysis Schedule
        </CardTitle>
      </CardHeader>

      <CardContent>
        {sessions.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No dialysis sessions scheduled today.
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="py-3 text-left">Patient</th>
                <th className="py-3 text-left">Shift</th>
                <th className="py-3 text-left">Machine</th>
                <th className="py-3 text-left">Duration</th>
                <th className="py-3 text-left">Risk</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session.sessionId}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="py-3">
                    {session.patientName}
                  </td>

                  <td>{session.shift}</td>

                  <td>{session.machineNo}</td>

                  <td>{session.duration} min</td>

                  <td>
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
        )}
      </CardContent>
    </Card>
  );
}