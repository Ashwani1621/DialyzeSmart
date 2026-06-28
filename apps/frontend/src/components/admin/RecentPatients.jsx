import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentPatients({ patients = [] }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>

      <CardContent>
        {patients.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No recent patients</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Name</th>

                <th className="py-2 text-left">Doctor</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr key={patient.uid} className="border-b">
                  <td className="py-3">{patient.patientName}</td>

                  <td className="py-3">{patient.doctorName || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
