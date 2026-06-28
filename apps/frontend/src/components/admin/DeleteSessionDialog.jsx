import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Trash2 } from "lucide-react";

import { deleteSession } from "../../services/patientService";

function DeleteSessionDialog({ open, setOpen, session, refreshSessions }) {
  if (!session) return null;

  const handleDelete = async () => {
    try {
      await deleteSession(session.sessionId);

      await refreshSessions();

      alert("Session deleted successfully.");

      setOpen(false);
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Unable to delete session.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Trash2 size={32} className="text-red-600" />
          </div>

          <DialogTitle className="text-center text-2xl">
            Delete Session
          </DialogTitle>

          <DialogDescription className="text-center">
            Are you sure you want to permanently delete
            <br />
            <strong>Session #{session.sessionNumber}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          This action cannot be undone.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={handleDelete}>
            Delete Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteSessionDialog;
