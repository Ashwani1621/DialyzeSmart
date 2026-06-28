import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function PatientToolbar({
  search,
  setSearch,
  setOpen,
  patientCount,
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Manage Patients
          </h1>

          <p className="mt-2 text-slate-500">
            Total Patients : {patientCount}
          </p>

        </div>

        <Button
          className="rounded-xl px-6 py-6"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />

          Add Patient
        </Button>

      </div>

      <div className="relative mt-6">

        <Search
          className="absolute left-4 top-3 text-slate-400"
          size={20}
        />

        <Input
          className="h-12 pl-12"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

    </div>
  );
}

export default PatientToolbar;