import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AlertTriangle } from "lucide-react";

export default function Alerts({
  dashboard,
}) {

  const alerts = [];

  if (dashboard.highRiskPatients > 0)
    alerts.push(
      `${dashboard.highRiskPatients} High Risk Patients`
    );

  if (dashboard.todaySessions > 0)
    alerts.push(
      `${dashboard.todaySessions} Sessions Today`
    );

  if (dashboard.assignedPatients === 0)
    alerts.push(
      "No Assigned Patients"
    );

  return (
    <Card className="shadow-md border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle
            className="text-red-500"
            size={22}
          />
          Alerts
        </CardTitle>
      </CardHeader>

      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-green-600 font-medium">
            No active alerts.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="rounded-lg border border-red-200 bg-red-50 p-3"
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