import Sidebar from "../Sidebar";
import Header from "../Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen font-sans bg-gray-50 text-slate-900">
      <Sidebar />
      <div className="flex flex-col min-h-screen transition-all duration-300 lg:pl-64">
        <div className="sticky top-0 z-30 w-full">
          <Header />
        </div>

        <main className="flex-1 p-4 mt-14 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
