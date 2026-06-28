import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SessionTrendChart({ data }) {

  return (

    <Card className="shadow-md">

      <CardHeader>

        <CardTitle>

          Daily Dialysis Sessions

        </CardTitle>

      </CardHeader>

      <CardContent>

        <ResponsiveContainer width="100%" height={320}>

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="5 5" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line

              type="monotone"

              dataKey="sessions"

              stroke="#2563eb"

              strokeWidth={3}

              dot={{ r: 5 }}

            />

          </LineChart>

        </ResponsiveContainer>

      </CardContent>

    </Card>

  );

}