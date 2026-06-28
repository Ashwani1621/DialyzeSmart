import { Plus, Search } from "lucide-react";

function DoctorToolbar({
    search,
    setSearch,
    setOpen,
    doctorCount,
}) {
    return (
        <div className="space-y-5">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-4xl font-bold">
                        Manage Doctors
                    </h1>

                    <p className="text-slate-500 mt-1">
                        {doctorCount} Doctors Registered
                    </p>

                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
                >
                    <Plus size={18} />

                    Add Doctor

                </button>

            </div>

            <div className="relative">

                <Search
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Doctor..."
                    className="w-full rounded-xl border bg-white py-3 pl-12 pr-5 outline-none"
                />

            </div>

        </div>
    );
}

export default DoctorToolbar;