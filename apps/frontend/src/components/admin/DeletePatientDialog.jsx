import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Trash2, AlertTriangle } from "lucide-react";

import { deletePatient } from "../../services/patientService";

function DeletePatientDialog({
  open,
  setOpen,
  patient,
  refreshPatients,
}) {

  if (!patient) return null;

  const handleDelete = async () => {

    try {

      await deletePatient(patient.uid);

      await refreshPatients();

      alert("Patient deleted successfully.");

      setOpen(false);

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Unable to delete patient."
      );

    }

  };

  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogContent className="max-w-lg rounded-3xl">

        <DialogHeader>

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

            <AlertTriangle
              size={40}
              className="text-red-600"
            />

          </div>

          <DialogTitle className="mt-4 text-center text-3xl">

            Delete Patient

          </DialogTitle>

          <DialogDescription className="text-center text-base">

            This action cannot be undone.

          </DialogDescription>

        </DialogHeader>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">

          <p className="text-center text-lg">

            Are you sure you want to delete

          </p>

          <h2 className="mt-2 text-center text-2xl font-bold">

            {patient.patientName}

          </h2>

          <p className="mt-4 text-center text-slate-600">

            All future access will be revoked.
            Historical dialysis records will remain available.

          </p>

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >

            Cancel

          </Button>

          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >

            <Trash2 className="mr-2 h-4 w-4"/>

            Delete Patient

          </Button>

        </div>

      </DialogContent>

    </Dialog>

  );

}

export default DeletePatientDialog;