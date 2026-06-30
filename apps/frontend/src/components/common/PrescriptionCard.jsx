import { Pill, Pencil, Trash2 } from "lucide-react";

function PrescriptionCard({ prescription, onEdit, onDelete, showPatient }) {
  const meds = prescription.medications || [];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {showPatient
              ? prescription.patientName || "Patient"
              : `Dr. ${prescription.doctorName || ""}`}
          </h3>
          <span
            className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
              prescription.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {prescription.status || "active"}
          </span>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(prescription)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <Pencil size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(prescription)}
                className="rounded-lg p-2 hover:bg-red-100"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {meds.length === 0 ? (
          <p className="text-sm text-slate-500">No medications listed.</p>
        ) : (
          meds.map((m, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"
            >
              <Pill size={16} className="text-blue-600" />
              <span className="font-medium">{m.name}</span>
              <span className="text-slate-500">
                {m.dosage} {m.frequency && `· ${m.frequency}`}
              </span>
            </div>
          ))
        )}
      </div>

      {prescription.dietNotes && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase text-slate-400">
            Diet Notes
          </p>
          <p className="text-sm text-slate-600">{prescription.dietNotes}</p>
        </div>
      )}

      {prescription.generalNotes && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase text-slate-400">
            General Notes
          </p>
          <p className="text-sm text-slate-600">{prescription.generalNotes}</p>
        </div>
      )}
    </div>
  );
}

export default PrescriptionCard;
