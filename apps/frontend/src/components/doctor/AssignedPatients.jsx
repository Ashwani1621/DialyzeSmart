import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";

export default function AssignedPatients({
  patients = [],
}) {

  const navigate = useNavigate();

  return (

    <Card className="shadow-md">

      <CardHeader>

        <CardTitle>

          Assigned Patients

        </CardTitle>

      </CardHeader>

      <CardContent>

        {patients.length === 0 ? (

          <div className="py-10 text-center text-slate-500">

            No Assigned Patients

          </div>

        ) : (

          <table className="w-full">

            <thead className="border-b">

              <tr>

                <th className="py-3 text-left">

                  Patient

                </th>

                <th className="py-3 text-left">

                  Age

                </th>

                <th className="py-3 text-left">

                  Sessions

                </th>

                <th className="py-3 text-left">

                  Action

                </th>

              </tr>

            </thead>

            <tbody>

              {patients.map((patient) => (

                <tr
                  key={patient.uid}
                  className="border-b"
                >

                  <td className="py-4">

                    {patient.patientName}

                  </td>

                  <td>

                    {patient.age}

                  </td>

                  <td>

                    {patient.totalSessions}

                  </td>

                  <td>

                    <Button

                      size="sm"

                      onClick={() =>
                        navigate(
                          `/doctor/patient/${patient.uid}`
                        )
                      }

                    >

                      View

                    </Button>

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