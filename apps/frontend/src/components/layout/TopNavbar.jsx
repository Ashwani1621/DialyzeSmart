import { Bell, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function TopNavbar() {
  const { userData } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">

      <div className="relative">

        <Search
          className="absolute left-3 top-3 text-slate-400"
          size={18}
        />

        <input
          placeholder="Search..."
          className="w-80 rounded-xl border bg-slate-50 py-2 pl-10 pr-4 outline-none focus:border-blue-600"
        />

      </div>

      <div className="flex items-center gap-6">

        <Bell className="cursor-pointer text-slate-600" />

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">

            {userData?.name?.charAt(0).toUpperCase()}

          </div>

          <div>

            <h2 className="font-semibold">
              {userData?.name}
            </h2>

            <p className="text-sm text-slate-500">
              {userData?.role}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default TopNavbar;