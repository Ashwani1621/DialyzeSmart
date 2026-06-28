import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Activity,
  Gauge,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import EditSessionDialog from "./EditSessionDialog";
import DeleteSessionDialog from "./DeleteSessionDialog";

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2">
      <span className="font-medium text-slate-500">{label}</span>
      <span>{value ?? "-"}</span>
    </div>
  );
}

function SessionAccordion({ session, refreshSessions }) {
  const [expanded, setExpanded] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card className="mb-4">
        <CardContent className="p-0">
          {/* HEADER */}

          <div className="flex items-center justify-between p-5">
            <div>
              <h2 className="text-xl font-bold">
                Session #{session.sessionNumber}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {session.sessionDate}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setEditOpen(true)}
              >
                <Pencil size={18} />
              </Button>

              <Button
                size="icon"
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 size={18} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>
          </div>

          {/* BODY */}

          {expanded && (
            <div className="border-t p-6 space-y-8">
              {/* SESSION */}

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <Calendar size={20} />
                  Session Details
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Row label="Date" value={session.sessionDate} />

                    <Row label="Shift" value={session.shift} />

                    <Row label="Machine" value={session.machineNo} />

                    <Row label="Duration" value={session.duration} />

                    <Row label="Dialysis Type" value={session.dialysisType} />

                    <Row label="Access Type" value={session.accessType} />
                  </div>
                </div>
              </div>

              {/* MACHINE */}

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <Gauge size={20} />
                  Machine Parameters
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Row label="Blood Flow" value={session.bloodFlowRate} />

                    <Row
                      label="Dialysate Flow"
                      value={session.dialysateFlowRate}
                    />

                    <Row label="UF Goal" value={session.ufGoal} />

                    <Row label="UF Removed" value={session.ufVolume} />
                  </div>
                </div>
              </div>

              {/* VITALS */}

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                  <Activity size={20} />
                  Vital Signs
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Row label="Heart Rate" value={session.heartRate} />

                    <Row
                      label="Blood Pressure"
                      value={`${session.systolicBP}/${session.diastolicBP}`}
                    />

                    <Row label="SpO₂" value={session.spo2} />

                    <Row label="Temperature" value={session.temperature} />
                  </div>
                </div>
              </div>

              {/* LABS */}

              <div>
                <h3 className="mb-4 text-xl font-semibold">Lab Results</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Row label="Albumin Before" value={session.albuminBefore} />

                    <Row label="Albumin After" value={session.albuminAfter} />

                    <Row label="Albumin Loss" value={session.albuminLoss} />

                    <Row label="Hemoglobin" value={session.hemoglobin} />

                    <Row label="Potassium" value={session.potassium} />

                    <Row label="Creatinine" value={session.creatinine} />

                    <Row label="Urea" value={session.urea} />

                    <Row label="Kt/V" value={session.ktv} />
                  </div>
                </div>
              </div>

              {/* AI */}

              <div>
                <h3 className="mb-4 text-xl font-semibold">AI Prediction</h3>

                <Row
                  label="Predicted Albumin Loss"
                  value={session.predictedAlbuminLoss}
                />

                <Row label="Risk Score" value={session.riskScore} />

                <Row label="Risk Level" value={session.riskLevel} />

                <Row label="Recommendation" value={session.recommendation} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditSessionDialog
        open={editOpen}
        setOpen={setEditOpen}
        session={session}
        refreshSessions={refreshSessions}
      />

      <DeleteSessionDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        session={session}
        refreshSessions={refreshSessions}
      />
    </>
  );
}

export default SessionAccordion;
