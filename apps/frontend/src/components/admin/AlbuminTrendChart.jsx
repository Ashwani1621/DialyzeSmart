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
  Legend,
} from "recharts";

export default function AlbuminTrendChart({ data }) {

  return (

    <Card className="shadow-md">

      <CardHeader>

        <CardTitle>

          Average Albumin Loss

        </CardTitle>

      </CardHeader>

      <CardContent>

        <ResponsiveContainer width="100%" height={320}>

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="5 5" />

            <XAxis dataKey="session" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line

              type="monotone"

              dataKey="albuminLoss"

              stroke="#7c3aed"

              strokeWidth={3}

              dot={{ r: 5 }}

            />

          </LineChart>

        </ResponsiveContainer>

      </CardContent>

    </Card>

  );

}