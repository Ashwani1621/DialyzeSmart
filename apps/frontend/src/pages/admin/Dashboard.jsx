import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DashboardStatCard from "../../components/admin/DashboardStatCard";
import AlertPanel from "../../components/admin/AlertPanel";
import RecentPatients from "../../components/admin/RecentPatients";
import RecentSessions from "../../components/admin/RecentSessions";
import RiskPieChart from "../../components/admin/RiskPieChart";
import AlbuminTrendChart from "../../components/admin/AlbuminTrendChart";
import SessionTrendChart from "../../components/admin/SessionTrendChart";

import { getDashboard } from "../../services/dashboardService";

import {
  Users,
  UserRound,
  Activity,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalDoctors: 0,

    totalPatients: 0,

    totalSessions: 0,

    highRiskPatients: 0,

    todaySessions: 0,

    recentPatients: [],

    recentSessions: [],

    riskDistribution: [],

    albuminTrend: [],

    sessionTrend: [],
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard();

      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await getDashboard();

        if (!cancelled) {
          setDashboard(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    const interval = setInterval(fetchDashboard, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <h2 className="text-3xl font-semibold">Loading Dashboard...</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>

            <p className="mt-2 text-slate-500">
              Live DialyzeSmart Hospital Analytics
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">Auto Refresh</p>

            <h3 className="font-semibold">Every 30 Seconds</h3>
          </div>
        </div>

        {/* STAT CARDS */}

        <div className="grid gap-6 lg:grid-cols-5">
          <DashboardStatCard
            title="Doctors"
            value={dashboard.totalDoctors}
            icon={Users}
            color="bg-blue-600"
          />

          <DashboardStatCard
            title="Patients"
            value={dashboard.totalPatients}
            icon={UserRound}
            color="bg-green-600"
          />

          <DashboardStatCard
            title="Sessions"
            value={dashboard.totalSessions}
            icon={Activity}
            color="bg-purple-600"
          />

          <DashboardStatCard
            title="High Risk"
            value={dashboard.highRiskPatients}
            icon={AlertTriangle}
            color="bg-red-600"
          />

          <DashboardStatCard
            title="Today's Sessions"
            value={dashboard.todaySessions}
            icon={CalendarDays}
            color="bg-orange-600"
          />
        </div>
        {/* =========================
            CHARTS
        ========================= */}

        <div className="grid gap-6 xl:grid-cols-3">
          <RiskPieChart data={dashboard.riskDistribution || []} />

          <AlbuminTrendChart data={dashboard.albuminTrend} />

          <SessionTrendChart data={dashboard.sessionTrend} />
        </div>

        {/* =========================
            ALERTS + RECENT PATIENTS
        ========================= */}

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <AlertPanel dashboard={dashboard} />
          </div>

          <div className="xl:col-span-2">
            <RecentPatients patients={dashboard.recentPatients || []} />
          </div>
        </div>

        {/* =========================
            RECENT SESSIONS
        ========================= */}

        <div className="rounded-2xl bg-white shadow-md">
          <div className="border-b px-6 py-5">
            <h2 className="text-2xl font-bold">Recent Dialysis Sessions</h2>

            <p className="mt-1 text-slate-500">
              Latest dialysis sessions performed.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-3 text-left">Session</th>

                  <th className="px-6 py-3 text-left">Patient</th>

                  <th className="px-6 py-3 text-left">Date</th>

                  <th className="px-6 py-3 text-left">Albumin Loss</th>

                  <th className="px-6 py-3 text-left">Risk</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentSessions.map((session) => (
                  <tr
                    key={session.sessionId}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-semibold">
                      #{session.sessionNumber}
                    </td>

                    <td className="px-6 py-4">
                      {session.patientName || session.patientId}
                    </td>

                    <td className="px-6 py-4">{session.sessionDate}</td>

                    <td className="px-6 py-4">{session.albuminLoss}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-white text-sm font-medium ${
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
