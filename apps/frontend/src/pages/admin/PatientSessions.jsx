import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SessionAccordion from "../../components/admin/SessionAccordion";
import AddSessionDialog from "../../components/admin/AddSessionDialog";

import { getPatients, getPatientSessions } from "../../services/patientService";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  ArrowLeft,
  Plus,
  Activity,
  Heart,
  Gauge,
  UserRound,
} from "lucide-react";

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

function StatCard({ title, value, icon: Icon }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className="rounded-xl bg-blue-100 p-4">
          <Icon className="text-blue-600" size={28} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PatientSessions() {
  const { patientId } = useParams();

  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const [sessions, setSessions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const patientRes = await getPatients();

      const patientList = Array.isArray(patientRes.data) ? patientRes.data : [];

      const foundPatient = patientList.find((p) => p.uid === patientId);

      setPatient(foundPatient || null);

      const sessionRes = await getPatientSessions(patientId);

      const sessionList = Array.isArray(sessionRes.data) ? sessionRes.data : [];

      setSessions(sessionList);
    } catch (err) {
      console.error(err);

      setPatient(null);

      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        setLoading(true);

        const patientRes = await getPatients();

        const patientList = Array.isArray(patientRes.data)
          ? patientRes.data
          : [];

        const foundPatient = patientList.find((p) => p.uid === patientId);

        const sessionRes = await getPatientSessions(patientId);

        const sessionList = Array.isArray(sessionRes.data)
          ? sessionRes.data
          : [];

        if (!ignore) {
          setPatient(foundPatient || null);
          setSessions(sessionList);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [patientId]);
  const graphData = useMemo(() => {
    return [...sessions]

      .sort((a, b) => a.sessionNumber - b.sessionNumber)

      .map((s) => ({
        session: `S${s.sessionNumber}`,

        heartRate: Number(s.heartRate),

        systolic: Number(s.systolicBP),

        diastolic: Number(s.diastolicBP),

        spo2: Number(s.spo2),

        albuminBefore: Number(s.albuminBefore),

        albuminAfter: Number(s.albuminAfter),

        albuminLoss: Number(s.albuminLoss),

        bloodFlow: Number(s.bloodFlowRate),

        dialysate: Number(s.dialysateFlowRate),

        uf: Number(s.ufVolume),

        ktv: Number(s.ktv),
      }));
  }, [sessions]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <h2 className="text-2xl font-semibold">Loading Patient...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <h2 className="text-2xl font-semibold">Patient Not Found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <h1 className="mt-4 text-4xl font-bold">{patient.patientName}</h1>

            <p className="mt-2 text-slate-500">
              Assigned Doctor : {patient.doctorName || "Not Assigned"}
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Session
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <StatCard title="Sessions" value={sessions.length} icon={Activity} />

          <StatCard title="Age" value={patient.age} icon={UserRound} />

          <StatCard
            title="Weight"
            value={`${patient.weight} kg`}
            icon={Heart}
          />

          <StatCard
            title="Blood Group"
            value={patient.bloodGroup}
            icon={Gauge}
          />
        </div>
        {/* =========================
            VITAL SIGN TREND
        ========================= */}

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
              Vital Sign Trend
            </h2>

            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" />

                <XAxis dataKey="session" tick={{ fontSize: 13 }} />

                <YAxis tick={{ fontSize: 13 }} />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 15px rgba(0,0,0,.15)",
                  }}
                />

                <Legend verticalAlign="top" height={45} />

                <Line
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />

                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic BP"
                  stroke="#dc2626"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />

                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic BP"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />

                <Line
                  type="monotone"
                  dataKey="spo2"
                  name="SpO₂"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* =========================
            ALBUMIN TREND
        ========================= */}

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
              Albumin Trend
            </h2>

            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" />

                <XAxis dataKey="session" tick={{ fontSize: 13 }} />

                <YAxis tick={{ fontSize: 13 }} />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 15px rgba(0,0,0,.15)",
                  }}
                />

                <Legend verticalAlign="top" height={45} />

                <Line
                  type="monotone"
                  dataKey="albuminBefore"
                  name="Albumin Before"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="albuminAfter"
                  name="Albumin After"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="albuminLoss"
                  name="Albumin Loss"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* =========================
            MACHINE PARAMETERS
        ========================= */}

        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-800">
              Machine Parameter Trend
            </h2>

            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="5 5" stroke="#e2e8f0" />

                <XAxis dataKey="session" tick={{ fontSize: 13 }} />

                <YAxis tick={{ fontSize: 13 }} />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "0 4px 15px rgba(0,0,0,.15)",
                  }}
                />

                <Legend verticalAlign="top" height={45} />

                <Line
                  type="monotone"
                  dataKey="bloodFlow"
                  name="Blood Flow Rate"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="dialysate"
                  name="Dialysate Flow"
                  stroke="#9333ea"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="ktv"
                  name="Kt/V"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="uf"
                  name="UF Volume"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* =========================
            SESSION HISTORY
        ========================= */}

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Dialysis Session History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View, edit and manage every dialysis session for this patient.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                  {sessions.length} Session{sessions.length !== 1 && "s"}
                </span>

                <Button onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Session
                </Button>
              </div>
            </div>

            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 py-20">
                <Activity size={55} className="mb-5 text-slate-400" />

                <h3 className="text-2xl font-semibold">No Dialysis Sessions</h3>

                <p className="mt-2 text-slate-500">
                  This patient has no dialysis sessions yet.
                </p>

                <Button className="mt-6" onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Session
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {[...sessions]

                  .sort((a, b) => b.sessionNumber - a.sessionNumber)

                  .map((session) => (
                    <SessionAccordion
                      key={session.sessionId}
                      session={session}
                      refreshSessions={loadData}
                    />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AddSessionDialog
          open={open}
          setOpen={setOpen}
          patient={patient}
          refreshPatient={loadData}
        />
      </div>
    </DashboardLayout>
  );
}
