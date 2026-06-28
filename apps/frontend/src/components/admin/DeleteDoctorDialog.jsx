import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

import { deleteDoctor } from "../../services/doctorService";

function DeleteDoctorDialog({
  open,
  setOpen,
  doctor,
  refreshDoctors,
}) {
  if (!doctor) return null;

  const handleDelete = async () => {
    try {
      await deleteDoctor(doctor.uid);

      await refreshDoctors();

      alert("Doctor deleted successfully.");

      setOpen(false);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to delete doctor."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="max-w-md">

        <DialogHeader>

          <div className="flex justify-center mb-4">

            <div className="rounded-full bg-red-100 p-4">

              <TriangleAlert
                className="text-red-600"
                size={40}
              />

            </div>

          </div>

          <DialogTitle className="text-center text-2xl">
            Delete Doctor
          </DialogTitle>

          <DialogDescription className="text-center mt-3">

            Are you sure you want to delete

            <span className="font-semibold">
              {" "}
              {doctor.name}
            </span>

            ?

            <br />

            This action will revoke the doctor's access.

          </DialogDescription>

        </DialogHeader>

        <div className="flex justify-end gap-3 mt-8">

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}

export default DeleteDoctorDialog;