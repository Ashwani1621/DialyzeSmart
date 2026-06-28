import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function AlertPanel({ dashboard }) {

  const alerts = [];

  if (dashboard.highRiskPatients > 0)
    alerts.push(
      `${dashboard.highRiskPatients} High Risk Patients`
    );

  if (dashboard.todaySessions > 0)
    alerts.push(
      `${dashboard.todaySessions} Sessions Scheduled Today`
    );

  if (dashboard.totalDoctors === 0)
    alerts.push("No Doctors Available");

  return (
    <Card className="border-red-200 shadow-md">

      <CardContent className="p-6">

        <div className="flex items-center gap-3 mb-5">

          <AlertTriangle
            className="text-red-500"
            size={28}
          />

          <h2 className="text-xl font-bold">

            Hospital Alerts

          </h2>

        </div>

        {alerts.length === 0 ? (

          <p className="text-green-600 font-medium">
            No active alerts.
          </p>

        ) : (

          <div className="space-y-3">

            {alerts.map((alert, index) => (

              <div
                key={index}
                className="rounded-xl bg-red-50 border border-red-100 p-4"
              >
                {alert}
              </div>

            ))}

          </div>

        )}

      </CardContent>

    </Card>
  );
}