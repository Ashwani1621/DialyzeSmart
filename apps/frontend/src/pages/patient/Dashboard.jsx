import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Activity, HeartPulse, Stethoscope, ClipboardList } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import RiskBadge from "../../components/common/RiskBadge";
import { useAuth } from "../../hooks/useAuth";
import { getPatientDashboard } from "../../services/patientPortalService";

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-white p-6 shadow-sm">
      <div className={`rounded-xl p-3 text-white ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function PatientDashboard() {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      try {
        const res = await getPatientDashboard(currentUser.uid);
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[75vh] items-center justify-center text-2xl font-semibold">
          Loading Dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold">My Dashboard</h1>
          <p className="mt-2 text-slate-500">
            Welcome, {userData?.name || data?.patientName || "Patient"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <StatCard
            title="Total Sessions"
            value={data?.totalSessions ?? 0}
            icon={Activity}
            color="bg-blue-600"
          />
          <StatCard
            title="Assigned Doctor"
            value={data?.doctorName || "Not assigned"}
            icon={Stethoscope}
            color="bg-green-600"
          />
          <StatCard
            title="Current Risk Score"
            value={
              data?.currentRiskScore != null
                ? `${data.currentRiskScore}%`
                : "—"
            }
            icon={HeartPulse}
            color="bg-purple-600"
          />
          <StatCard
            title="Last Session"
            value={data?.latestSession?.sessionDate || "—"}
            icon={ClipboardList}
            color="bg-orange-500"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">

          <div className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2">
            <h2 className="mb-4 text-xl font-bold">Albumin Loss Trend</h2>

            {data?.albuminTrend?.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.albuminTrend}>
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
            ) : (
              <p className="py-12 text-center text-slate-500">
                No sessions recorded yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Latest Session</h2>

            {data?.latestSession ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium">
                    {data.latestSession.sessionDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk</span>
                  <RiskBadge level={data.latestSession.riskLevel} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Albumin Loss</span>
                  <span className="font-medium">
                    {data.latestSession.albuminLoss} g/dL
                  </span>
                </div>
                <div className="border-t pt-3 text-slate-600">
                  {data.latestSession.recommendation}
                </div>
              </div>
            ) : (
              <p className="py-12 text-center text-slate-500">
                No sessions recorded yet.
              </p>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;
