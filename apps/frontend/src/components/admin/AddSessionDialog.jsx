import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { addSession } from "../../services/patientService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function AddSessionDialog({
  open,
  setOpen,
  patient,
  refreshPatient,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    sessionDate: "",
    shift: "",
    machineNo: "",

    duration: "",
    dialysisType: "",
    accessType: "",

    bloodFlowRate: "",
    dialysateFlowRate: "",
    ufGoal: "",
    ufVolume: "",
    transmembranePressure: "",
    membraneFlux: "",

    heartRate: "",
    systolicBP: "",
    diastolicBP: "",
    spo2: "",
    temperature: "",

    albuminBefore: "",
    albuminAfter: "",
    hemoglobin: "",
    potassium: "",
    phosphorus: "",
    crp: "",
    creatinine: "",
    urea: "",
    ktv: "",

    proteinIntake: "",
    calorieIntake: "",
  });

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

    const payload = {

      ...formData,

      duration: Number(formData.duration),

      bloodFlowRate: Number(formData.bloodFlowRate),

      dialysateFlowRate: Number(formData.dialysateFlowRate),

      ufGoal: Number(formData.ufGoal),

      ufVolume: Number(formData.ufVolume),

      transmembranePressure:
        formData.transmembranePressure === ""
          ? null
          : Number(formData.transmembranePressure),

      membraneFlux:
        formData.membraneFlux === "" ? null : Number(formData.membraneFlux),

      heartRate: Number(formData.heartRate),

      systolicBP: Number(formData.systolicBP),

      diastolicBP: Number(formData.diastolicBP),

      spo2: Number(formData.spo2),

      temperature: Number(formData.temperature),

      albuminBefore: Number(formData.albuminBefore),

      albuminAfter: Number(formData.albuminAfter),

      hemoglobin: Number(formData.hemoglobin),

      potassium: Number(formData.potassium),

      phosphorus: formData.phosphorus === "" ? null : Number(formData.phosphorus),

      crp: formData.crp === "" ? null : Number(formData.crp),

      creatinine: Number(formData.creatinine),

      urea: Number(formData.urea),

      ktv: Number(formData.ktv),

      proteinIntake:
        formData.proteinIntake === "" ? null : Number(formData.proteinIntake),

      calorieIntake:
        formData.calorieIntake === "" ? null : Number(formData.calorieIntake),

    };

    await addSession(patient.uid, payload);

    alert("Dialysis session added successfully.");

    await refreshPatient();

    setOpen(false);

  } catch (err) {

    console.error(err);

    alert(
      err.response?.data?.message ||
      "Failed to add session."
    );

  } finally {

    setLoading(false);

  }

};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-7xl w-[96vw] max-h-[95vh] overflow-y-auto rounded-3xl">

        <DialogHeader>

          <DialogTitle className="text-3xl font-bold">
            Add Dialysis Session
          </DialogTitle>

          <DialogDescription>
            Patient : {patient?.patientName}
          </DialogDescription>

        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-10 mt-6"
        >

          {/* SESSION INFORMATION */}

          <div>

            <h2 className="mb-6 text-xl font-bold">
              Session Information
            </h2>

            <div className="grid grid-cols-4 gap-6">

              <div>

                <label>Date</label>

                <Input
                  type="date"
                  name="sessionDate"
                  value={formData.sessionDate}
                  onChange={handleChange}
                />

              </div>

              <div>

                <label>Shift</label>

                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">Select</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>

              </div>

              <div>

                <label>Machine Number</label>

                <Input
                  name="machineNo"
                  value={formData.machineNo}
                  onChange={handleChange}
                />

              </div>

              <div>

                <label>Duration (Minutes)</label>

                <Input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

          {/* DIALYSIS */}

          <div>

            <h2 className="mb-6 text-xl font-bold">
              Dialysis Information
            </h2>

            <div className="grid grid-cols-2 gap-6">

              <div>

                <label>Dialysis Type</label>

                <select
                  name="dialysisType"
                  value={formData.dialysisType}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >

                  <option value="">Select</option>

                  <option>Hemodialysis</option>

                  <option>Hemodiafiltration</option>

                </select>

              </div>

              <div>

                <label>Access Type</label>

                <select
                  name="accessType"
                  value={formData.accessType}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-3"
                >

                  <option value="">Select</option>

                  <option>AV Fistula</option>

                  <option>AV Graft</option>

                  <option>Catheter</option>

                </select>

              </div>

            </div>

          </div>

          {/* MACHINE PARAMETERS */}

          <div>

            <h2 className="mb-6 text-xl font-bold">
              Machine Parameters
            </h2>

            <div className="grid grid-cols-4 gap-6">

              <div>

                <label>Blood Flow Rate</label>

                <Input
                  name="bloodFlowRate"
                  placeholder="mL/min"
                  value={formData.bloodFlowRate}
                  onChange={handleChange}
                />

              </div>

              <div>

                <label>Dialysate Flow Rate</label>

                <Input
                  name="dialysateFlowRate"
                  placeholder="mL/min"
                  value={formData.dialysateFlowRate}
                  onChange={handleChange}
                />

              </div>

              <div>

                <label>UF Goal</label>

                <Input
                  name="ufGoal"
                  placeholder="Litres"
                  value={formData.ufGoal}
                  onChange={handleChange}
                />

              </div>

              <div>

                <label>UF Removed</label>

                <Input
                  name="ufVolume"
                  placeholder="Litres"
                  value={formData.ufVolume}
                  onChange={handleChange}
                />

              </div>

              <div>

                <label>Transmembrane Pressure (mmHg)</label>

                <Input
                  name="transmembranePressure"
                  placeholder="mmHg"
                  value={formData.transmembranePressure}
                  onChange={handleChange}
                />

              </div>

              <div>

                <label>Membrane Flux / KUf (mL/hr/mmHg)</label>

                <Input
                  name="membraneFlux"
                  placeholder="mL/hr/mmHg"
                  value={formData.membraneFlux}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

          {/* VITAL SIGNS */}

          <div>

            <h2 className="mb-6 text-xl font-bold">
              Vital Signs
            </h2>

            <div className="grid grid-cols-5 gap-6">

              <div>
                <label>Heart Rate (bpm)</label>

                <Input
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Systolic BP</label>

                <Input
                  name="systolicBP"
                  value={formData.systolicBP}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Diastolic BP</label>

                <Input
                  name="diastolicBP"
                  value={formData.diastolicBP}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>SpO₂ (%)</label>

                <Input
                  name="spo2"
                  value={formData.spo2}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Temperature (°C)</label>

                <Input
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                />
              </div>

            </div>

          </div>

          {/* LAB RESULTS */}

          <div>

            <h2 className="mb-6 text-xl font-bold">
              Laboratory Results
            </h2>

            <div className="grid grid-cols-4 gap-6">

              <div>
                <label>Albumin Before</label>

                <Input
                  name="albuminBefore"
                  value={formData.albuminBefore}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Albumin After</label>

                <Input
                  name="albuminAfter"
                  value={formData.albuminAfter}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Hemoglobin</label>

                <Input
                  name="hemoglobin"
                  value={formData.hemoglobin}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Potassium</label>

                <Input
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Phosphorus (mg/dL)</label>

                <Input
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>CRP (mg/L)</label>

                <Input
                  name="crp"
                  value={formData.crp}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Creatinine</label>

                <Input
                  name="creatinine"
                  value={formData.creatinine}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Urea</label>

                <Input
                  name="urea"
                  value={formData.urea}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Kt/V</label>

                <Input
                  name="ktv"
                  value={formData.ktv}
                  onChange={handleChange}
                />
              </div>

            </div>

          </div>

          {/* NUTRITIONAL INTAKE */}

          <div>

            <h2 className="mb-6 text-xl font-bold">
              Nutritional Intake
            </h2>

            <div className="grid grid-cols-4 gap-6">

              <div>
                <label>Protein Intake (g)</label>

                <Input
                  name="proteinIntake"
                  placeholder="g/day"
                  value={formData.proteinIntake}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Calorie Intake (kcal)</label>

                <Input
                  name="calorieIntake"
                  placeholder="kcal/day"
                  value={formData.calorieIntake}
                  onChange={handleChange}
                />
              </div>

            </div>

          </div>

          {/* AI RISK ASSESSMENT */}

          <div>

            <h2 className="mb-2 text-xl font-bold">
              AI Risk Assessment
            </h2>

            <p className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
              Risk score, risk level and recommendation are computed
              automatically from the recorded lab and machine values above
              when the session is saved.
            </p>

          </div>

          <div className="flex justify-end gap-4 border-t pt-6">

            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Session"}
            </Button>

          </div>

        </form>

      </DialogContent>

    </Dialog>
  );

}

export default AddSessionDialog;