import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
];

export default function RiskPieChart({ data = [] }) {

  return (

    <Card className="shadow-md">

      <CardHeader>

        <CardTitle>

          Risk Distribution

        </CardTitle>

      </CardHeader>

      <CardContent>

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie

              data={data}

              dataKey="value"

              nameKey="name"

              outerRadius={110}

              label

            >

              {(data || []).map((entry, index) => (

                <Cell

                  key={index}

                  fill={COLORS[index % COLORS.length]}

                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </CardContent>

    </Card>

  );

}