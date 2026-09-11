import { Link, useLocation } from "react-router";
import { LayoutDashboard, Film, BarChart2, ArrowLeft } from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();

  const getNavItemClass = (path, isEnd = false) => {
    const isActive =
      path === "/admin"
        ? location.pathname === "/admin" ||
          location.pathname === "/admin/dashboard"
        : isEnd
          ? location.pathname === path
          : location.pathname.startsWith(path);

    return `flex items-center gap-3.5 px-6 py-3.5 text-[15px] font-bold transition-all duration-200 w-full ${
      isActive
        ? "bg-[#B90101] text-white shadow-sm"
        : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60"
    }`;
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-[#f4f5f8] border-r border-neutral-200 flex flex-col justify-between shrink-0 font-sans md:h-screen md:sticky md:top-0 z-30">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top Solid Red Header Banner (Edge to edge) */}
        <div className="bg-[#B90101] h-16 w-full flex items-center px-6 shadow-sm shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black italic text-white tracking-wider">
              FLIX<span className="text-amber-300">ZONE</span>
            </span>
            <span className="text-[11px] font-black uppercase bg-black/30 text-white px-2 py-0.5 rounded ml-1">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation Links - Full width to the edge like the red bar logo */}
        <nav className="py-6 space-y-1.5 flex-1 overflow-y-auto">
          <Link to="/admin" className={getNavItemClass("/admin", true)}>
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span>Dashboard</span>
          </Link>

          <Link to="/admin/movies" className={getNavItemClass("/admin/movies")}>
            <Film className="w-5 h-5 shrink-0" />
            <span>Movie Library</span>
          </Link>

          <Link
            to="/admin/analytics"
            className={getNavItemClass("/admin/analytics")}
          >
            <BarChart2 className="w-5 h-5 shrink-0" />
            <span>User Analytics</span>
          </Link>

          <div className="pt-6 px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-[#B90101] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Client Website</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom Admin User Profile Section (Stuck to bottom left of sidebar) */}
      <div className="p-6 border-t border-neutral-200/80 flex items-center gap-3 shrink-0 bg-[#f4f5f8] sticky bottom-0">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          alt="Ratana Oudom"
          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] font-extrabold text-neutral-900 leading-tight truncate">
            Admin User
          </span>
          <span className="text-xs font-semibold text-neutral-500 leading-tight truncate">
            Ratana Oudom
          </span>
        </div>
      </div>
    </aside>
  );
}
