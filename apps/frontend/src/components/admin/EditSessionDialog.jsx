import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { updateSession } from "../../services/patientService";

const getInitialData = (session) => ({
  sessionDate: session?.sessionDate || "",
  shift: session?.shift || "",
  machineNo: session?.machineNo || "",
  duration: session?.duration || "",
  dialysisType: session?.dialysisType || "",
  accessType: session?.accessType || "",

  bloodFlowRate: session?.bloodFlowRate || "",
  dialysateFlowRate: session?.dialysateFlowRate || "",
  ufGoal: session?.ufGoal || "",
  ufVolume: session?.ufVolume || "",

  heartRate: session?.heartRate || "",
  systolicBP: session?.systolicBP || "",
  diastolicBP: session?.diastolicBP || "",
  spo2: session?.spo2 || "",
  temperature: session?.temperature || "",

  albuminBefore: session?.albuminBefore || "",
  albuminAfter: session?.albuminAfter || "",
  hemoglobin: session?.hemoglobin || "",
  potassium: session?.potassium || "",
  phosphorus: session?.phosphorus ?? "",
  crp: session?.crp ?? "",
  creatinine: session?.creatinine || "",
  urea: session?.urea || "",
  ktv: session?.ktv || "",
});

function EditSessionDialog({

  open,

  setOpen,

  session,

  refreshSessions,

}) {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() =>
    getInitialData(session)
  );

  if (!session) return null;

  const handleOpenChange = (value) => {

    if (value) {

      setFormData(getInitialData(session));

    }

    setOpen(value);

  };

  const handleChange = (e) => {

    setFormData((prev) => ({

      ...prev,

      [e.target.name]: e.target.value,

    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      // albuminLoss is computed and stored server-side (single source of truth).
      await updateSession(session.sessionId, formData);

      await refreshSessions();

      alert("Session Updated Successfully");

      setOpen(false);

    }

    catch (err) {

      console.error(err);

      alert("Unable to update session.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <Dialog

      open={open}

      onOpenChange={handleOpenChange}

    >

      <DialogContent className="!w-[96vw] !max-w-[96vw] h-[94vh] overflow-y-auto rounded-2xl">

        <DialogHeader>

          <DialogTitle className="text-3xl font-bold">

            Edit Dialysis Session

          </DialogTitle>

          <p className="text-slate-500">

            Session #{session.sessionNumber}

          </p>

        </DialogHeader>

        <form

          onSubmit={handleSubmit}

          className="mt-6 space-y-8"
        >
            {/* =========================
    SESSION DETAILS
========================= */}

<div className="rounded-2xl border bg-slate-50 p-6">

  <h2 className="mb-6 text-2xl font-semibold">
    Session Details
  </h2>

  <div className="grid grid-cols-4 gap-5">

    <div>
      <label className="mb-2 block text-sm font-medium">
        Session Date
      </label>

      <Input
        type="date"
        name="sessionDate"
        value={formData.sessionDate}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium">
        Shift
      </label>

      <Input
        name="shift"
        placeholder="Morning / Evening"
        value={formData.shift}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium">
        Machine Number
      </label>

      <Input
        name="machineNo"
        placeholder="Machine No."
        value={formData.machineNo}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium">
        Duration
      </label>

      <Input
        name="duration"
        placeholder="240 mins"
        value={formData.duration}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium">
        Dialysis Type
      </label>

      <Input
        name="dialysisType"
        placeholder="Hemodialysis"
        value={formData.dialysisType}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium">
        Access Type
      </label>

      <Input
        name="accessType"
        placeholder="AV Fistula"
        value={formData.accessType}
        onChange={handleChange}
      />
    </div>

  </div>

</div>

{/* =========================
    MACHINE PARAMETERS
========================= */}

<div className="rounded-2xl border bg-slate-50 p-6">

  <h2 className="mb-6 text-2xl font-semibold">
    Machine Parameters
  </h2>

  <div className="grid grid-cols-4 gap-5">

    <div>

      <label className="mb-2 block text-sm font-medium">
        Blood Flow Rate
      </label>

      <Input
        name="bloodFlowRate"
        placeholder="300"
        value={formData.bloodFlowRate}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Dialysate Flow Rate
      </label>

      <Input
        name="dialysateFlowRate"
        placeholder="500"
        value={formData.dialysateFlowRate}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        UF Goal
      </label>

      <Input
        name="ufGoal"
        placeholder="2000"
        value={formData.ufGoal}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        UF Removed
      </label>

      <Input
        name="ufVolume"
        placeholder="1900"
        value={formData.ufVolume}
        onChange={handleChange}
      />

    </div>

  </div>

</div>
{/* =========================
    VITAL SIGNS
========================= */}

<div className="rounded-2xl border bg-slate-50 p-6">

  <h2 className="mb-6 text-2xl font-semibold">
    Vital Signs
  </h2>

  <div className="grid grid-cols-5 gap-5">

    <div>

      <label className="mb-2 block text-sm font-medium">
        Heart Rate (bpm)
      </label>

      <Input
        name="heartRate"
        value={formData.heartRate}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Systolic BP
      </label>

      <Input
        name="systolicBP"
        value={formData.systolicBP}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Diastolic BP
      </label>

      <Input
        name="diastolicBP"
        value={formData.diastolicBP}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        SpO₂ (%)
      </label>

      <Input
        name="spo2"
        value={formData.spo2}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Temperature (°C)
      </label>

      <Input
        name="temperature"
        value={formData.temperature}
        onChange={handleChange}
      />

    </div>

  </div>

</div>

{/* =========================
    LABORATORY RESULTS
========================= */}

<div className="rounded-2xl border bg-slate-50 p-6">

  <h2 className="mb-6 text-2xl font-semibold">
    Laboratory Results
  </h2>

  <div className="grid grid-cols-4 gap-5">

    <div>

      <label className="mb-2 block text-sm font-medium">
        Albumin Before
      </label>

      <Input
        name="albuminBefore"
        value={formData.albuminBefore}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Albumin After
      </label>

      <Input
        name="albuminAfter"
        value={formData.albuminAfter}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Hemoglobin
      </label>

      <Input
        name="hemoglobin"
        value={formData.hemoglobin}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Potassium
      </label>

      <Input
        name="potassium"
        value={formData.potassium}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Phosphorus (mg/dL)
      </label>

      <Input
        name="phosphorus"
        value={formData.phosphorus}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        CRP (mg/L)
      </label>

      <Input
        name="crp"
        value={formData.crp}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Creatinine
      </label>

      <Input
        name="creatinine"
        value={formData.creatinine}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Urea
      </label>

      <Input
        name="urea"
        value={formData.urea}
        onChange={handleChange}
      />

    </div>

    <div>

      <label className="mb-2 block text-sm font-medium">
        Kt/V
      </label>

      <Input
        name="ktv"
        value={formData.ktv}
        onChange={handleChange}
      />

    </div>

    <div className="rounded-xl bg-blue-50 p-4 flex flex-col justify-center">

      <p className="text-sm text-slate-500">
        Calculated Albumin Loss
      </p>

      <h2 className="mt-2 text-2xl font-bold text-blue-700">

        {(
          Number(formData.albuminBefore || 0) -
          Number(formData.albuminAfter || 0)
        ).toFixed(2)} g/dL

      </h2>

    </div>

  </div>

</div>

{/* =========================
    AI RISK ASSESSMENT
========================= */}

<div className="rounded-2xl border bg-slate-50 p-6">

  <h2 className="mb-2 text-2xl font-semibold">
    AI Risk Assessment
  </h2>

  <p className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
    Risk score, risk level and recommendation are recomputed automatically
    from the recorded lab and machine values when the session is saved.
  </p>

</div>
{/* =========================
    ACTION BUTTONS
========================= */}

<div className="sticky bottom-0 mt-8 border-t bg-white px-2 py-5">

  <div className="flex justify-end gap-4">

    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={() => setOpen(false)}
    >
      Cancel
    </Button>

    <Button
      type="submit"
      size="lg"
      disabled={loading}
      className="min-w-[180px]"
    >
      {loading ? "Saving..." : "Save Changes"}
    </Button>

  </div>

</div>

</form>

</DialogContent>

</Dialog>

);

}

export default EditSessionDialog;