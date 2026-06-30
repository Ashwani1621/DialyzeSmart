import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { getDashboard } from "../../services/dashboardService";

const RISK_COLORS = {
  High: "#dc2626",
  Medium: "#f59e0b",
  Low: "#16a34a",
};

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDashboard();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-500">Loading reports...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Reports</h1>
          <p className="mt-2 text-slate-500">
            Aggregate analytics across the platform.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <Stat label="Total Doctors" value={data?.totalDoctors ?? 0} />
          <Stat label="Total Patients" value={data?.totalPatients ?? 0} />
          <Stat label="Total Sessions" value={data?.totalSessions ?? 0} />
          <Stat
            label="High Risk Sessions"
            value={data?.highRiskPatients ?? 0}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard title="Risk Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.riskDistribution || []}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {(data?.riskDistribution || []).map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={RISK_COLORS[entry.name] || "#64748b"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Average Albumin Loss per Session">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.albuminTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="albuminLoss"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Sessions Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.sessionTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#16a34a"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
