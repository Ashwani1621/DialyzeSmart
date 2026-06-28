import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DoctorStatCard from "../../components/doctor/DoctorStatCard";
import AssignedPatients from "../../components/doctor/AssignedPatients";
import TodaySchedule from "../../components/doctor/TodaySchedule";
import RiskChart from "../../components/doctor/RiskChart";
import Alerts from "../../components/doctor/Alerts";

import { getDoctorDashboard } from "../../services/doctorService";

import {
  Users,
  Activity,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    assignedPatients: 0,
    todaySessions: 0,
    highRiskPatients: 0,
    averageRisk: 0,
    patients: [],
    todaySchedule: [],
    riskDistribution: [],
  });

  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) {
          setDoctorName(user.displayName || "Doctor");
        }

        const res = await getDoctorDashboard(user.uid);

        if (mounted && res.success) {
          setDashboard({
            assignedPatients: res.data.assignedPatients || 0,
            todaySessions: res.data.todaySessions || 0,
            highRiskPatients: res.data.highRiskPatients || 0,
            averageRisk: res.data.averageRisk || 0,
            patients: res.data.patients || [],
            todaySchedule: res.data.todaySchedule || [],
            riskDistribution: res.data.riskDistribution || [],
          });
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    const interval = setInterval(loadDashboard, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[75vh] items-center justify-center">
          <h2 className="text-3xl font-bold">
            Loading Dashboard...
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              Doctor Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Welcome, {doctorName}
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-slate-500">
              Auto Refresh
            </p>

            <p className="font-semibold">
              Every 30 Seconds
            </p>

          </div>

        </div>

        {/* STAT CARDS */}

        <div className="grid gap-6 lg:grid-cols-4">

          <DoctorStatCard
            title="Assigned Patients"
            value={dashboard.assignedPatients}
            icon={Users}
            color="bg-blue-600"
          />

          <DoctorStatCard
            title="Today's Sessions"
            value={dashboard.todaySessions}
            icon={Activity}
            color="bg-green-600"
          />

          <DoctorStatCard
            title="High Risk"
            value={dashboard.highRiskPatients}
            icon={AlertTriangle}
            color="bg-red-600"
          />

          <DoctorStatCard
            title="Average Risk"
            value={`${dashboard.averageRisk}%`}
            icon={HeartPulse}
            color="bg-purple-600"
          />

        </div>

        {/* TODAY'S SCHEDULE + ALERTS */}

        <div className="grid gap-6 xl:grid-cols-3">

          <div className="xl:col-span-2">

            <TodaySchedule
              sessions={dashboard.todaySchedule}
            />

          </div>

          <Alerts
            dashboard={dashboard}
          />

        </div>

        {/* PATIENTS + RISK CHART */}

        <div className="grid gap-6 xl:grid-cols-3">

          <div className="xl:col-span-2">

            <AssignedPatients
              patients={dashboard.patients}
            />

          </div>

          <RiskChart
            data={dashboard.riskDistribution}
          />

        </div>

      </div>
    </DashboardLayout>
  );
}