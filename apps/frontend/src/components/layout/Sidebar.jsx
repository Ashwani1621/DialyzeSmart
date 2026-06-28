import { NavLink, useNavigate } from "react-router-dom";
import { SIDEBAR_MENU } from "../../constants/sidebarMenu";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../services/authService";

function Sidebar() {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const menu = SIDEBAR_MENU[userRole];

  if (!menu) return null;

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-white shadow-sm">

      {/* Logo */}

      <div className="border-b p-6">
        <h1 className="text-2xl font-bold text-blue-600">
          DialyzeSmart
        </h1>

        <p className="text-sm text-slate-500">
          Smart Dialysis Platform
        </p>
      </div>

      {/* Main */}

      <div className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-3 text-xs font-semibold uppercase text-slate-400">
          Main
        </p>

        <div className="space-y-2">

          {menu.main.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={20} />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="my-8 border-t"></div>

        <p className="mb-3 text-xs font-semibold uppercase text-slate-400">
          Account
        </p>

        <div className="space-y-2">

          {menu.account.map((item) => {

            const Icon = item.icon;

            if (item.title === "Logout") {
              return (
                <button
                  key={item.title}
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Icon size={20} />

                  {item.title}
                </button>
              );
            }

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={20} />

                {item.title}
              </NavLink>
            );
          })}
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;