import { Outlet } from "react-router";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen min-h-[100dvh] md:h-screen md:h-[100dvh] w-full max-w-full overflow-x-hidden md:overflow-hidden bg-[#f8f9fc] flex flex-col md:flex-row font-sans antialiased text-neutral-900">
      {/* Dedicated Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
