import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <TopNavbar />

        <main className="flex-1 overflow-y-auto p-8">

          {children}

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;