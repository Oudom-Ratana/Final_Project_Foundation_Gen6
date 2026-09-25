import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
  ArrowLeft,
  Film,
  LayoutDashboard,
  LineChart,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { logout } from "../../redux/slices/authSlice";
import { useLogoutApiMutation } from "../../services/api/authApi";
import { toast } from "react-toastify";

const MIN_WIDTH = 200;
const MAX_WIDTH = 380;
const DEFAULT_WIDTH = 256;
const COLLAPSED_WIDTH = 72;

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutApiMutation();

  const handleLogout = async () => {
    const refreshToken = (
      sessionStorage.getItem("refreshToken") ||
      localStorage.getItem("cinema_refresh_token") ||
      ""
    ).trim();

    if (refreshToken) {
      try {
        await logoutApi({ refreshToken }).unwrap();
      } catch (err) {
        console.warn("Server logout response:", err);
      }
    }

    dispatch(logout());
    toast.info("Logged out successfully");
    navigate("/login");
  };

  // Load persisted state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [width, setWidth] = useState(() => {
    try {
      const saved = Number(localStorage.getItem("admin_sidebar_width"));
      return saved >= MIN_WIDTH && saved <= MAX_WIDTH ? saved : DEFAULT_WIDTH;
    } catch {
      return DEFAULT_WIDTH;
    }
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartWidthRef = useRef(width);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("admin_sidebar_collapsed", String(isCollapsed));
    } catch {
      // ignore storage errors
    }
  }, [isCollapsed]);

  useEffect(() => {
    if (!isCollapsed) {
      try {
        localStorage.setItem("admin_sidebar_width", String(width));
      } catch {
        // ignore storage errors
      }
    }
  }, [width, isCollapsed]);

  // Drag-to-resize handlers
  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);
      dragStartXRef.current = e.clientX;
      dragStartWidthRef.current = isCollapsed ? COLLAPSED_WIDTH : width;
    },
    [isCollapsed, width],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStartXRef.current;
      const newWidth = dragStartWidthRef.current + deltaX;

      // If dragged smaller than halfway between collapsed and min, snap collapsed
      if (newWidth < MIN_WIDTH - 40) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
        setWidth(clamped);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Prevent text selection during drag
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const isDashboard =
    location.pathname === "/admin" || location.pathname === "/admin/dashboard";
  const isMovies = location.pathname.startsWith("/admin/movies");
  const isAnalytics = location.pathname.startsWith("/admin/analytics");

  const currentWidth = isCollapsed ? COLLAPSED_WIDTH : width;

  return (
    <aside
      style={{ width: `${currentWidth}px` }}
      className={`relative bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen select-none z-30 ${
        isDragging ? "" : "transition-[width] duration-300 ease-in-out"
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top Header: Logo + Toggle Button */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between shrink-0 overflow-hidden">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 bg-[#E50914] rounded-full flex items-center justify-center text-white font-black text-lg tracking-wider shadow-xs shrink-0">
              F
            </div>

            {!isCollapsed && (
              <div className="flex items-center gap-2 min-w-0 animate-fadeIn">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 truncate">
                  FILM<span className="text-[#E50914]">ZONE</span>
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 tracking-wide uppercase shrink-0">
                  Admin
                </span>
              </div>
            )}
          </Link>

          {/* Collapse/Expand button in header */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapse}
              title="Collapse sidebar"
              className="w-8 h-8 rounded-full border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-400 hover:text-[#E50914] flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Floating Expand Toggle when collapsed */}
        {isCollapsed && (
          <div className="px-3 pt-3 flex justify-center">
            <button
              type="button"
              onClick={toggleCollapse}
              title="Expand sidebar"
              className="w-9 h-9 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-[#E50914] flex items-center justify-center transition cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="px-3 py-5 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden">
          {/* Dashboard */}
          <Link
            to="/admin"
            title={isCollapsed ? "Dashboard" : undefined}
            className={`group flex items-center ${
              isCollapsed
                ? "justify-center px-0 py-2.5"
                : "justify-between px-4 py-2.5"
            } text-sm rounded-2xl transition-all ${
              isDashboard
                ? "font-semibold text-[#E50914] bg-red-50/80 border border-red-200/50 shadow-xs"
                : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <LayoutDashboard
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isDashboard
                    ? "text-[#E50914]"
                    : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              {!isCollapsed && <span className="truncate">Dashboard</span>}
            </div>
            {!isCollapsed && isDashboard && (
              <span className="w-2 h-2 rounded-full bg-[#E50914] shrink-0" />
            )}
          </Link>

          {/* Movie Library */}
          <Link
            to="/admin/movies"
            title={isCollapsed ? "Movie Library" : undefined}
            className={`group flex items-center ${
              isCollapsed
                ? "justify-center px-0 py-2.5"
                : "justify-between px-4 py-2.5"
            } text-sm rounded-2xl transition-all ${
              isMovies
                ? "font-semibold text-[#E50914] bg-red-50/80 border border-red-200/50 shadow-xs"
                : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Film
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isMovies
                    ? "text-[#E50914]"
                    : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              {!isCollapsed && <span className="truncate">Movie Library</span>}
            </div>
            {!isCollapsed && isMovies && (
              <span className="w-2 h-2 rounded-full bg-[#E50914] shrink-0" />
            )}
          </Link>

          {/* User Analytics */}
          <Link
            to="/admin/analytics"
            title={isCollapsed ? "User Analytics" : undefined}
            className={`group flex items-center ${
              isCollapsed
                ? "justify-center px-0 py-2.5"
                : "justify-between px-4 py-2.5"
            } text-sm rounded-2xl transition-all ${
              isAnalytics
                ? "font-semibold text-[#E50914] bg-red-50/80 border border-red-200/50 shadow-xs"
                : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <LineChart
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isAnalytics
                    ? "text-[#E50914]"
                    : "text-slate-400 group-hover:text-slate-700"
                }`}
              />
              {!isCollapsed && <span className="truncate">User Analytics</span>}
            </div>
            {!isCollapsed && isAnalytics && (
              <span className="w-2 h-2 rounded-full bg-[#E50914] shrink-0" />
            )}
          </Link>
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-slate-100 space-y-2.5 shrink-0 overflow-hidden">
        {/* Back to Website */}
        <Link
          to="/"
          title={isCollapsed ? "Back to Website" : undefined}
          className={`flex items-center ${
            isCollapsed ? "justify-center p-2.5" : "gap-2 px-3 py-2"
          } text-xs font-semibold text-slate-500 hover:text-[#E50914] rounded-2xl hover:bg-red-50/60 transition-colors`}
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 shrink-0" />
          {!isCollapsed && <span className="truncate">Back to Website</span>}
        </Link>

        {/* Admin Profile */}
        <div
          className={`rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center ${
            isCollapsed ? "justify-center p-1.5" : "justify-between p-2"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
              alt="Ratana Oudom"
              title="Ratana Oudom (Administrator)"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white border border-slate-200 shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                  Ratana Oudom
                </p>
                <p className="text-[10px] font-medium text-slate-400 truncate leading-tight mt-0.5">
                  Administrator
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="text-slate-400 hover:text-[#E50914] w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Draggable Resize Handle (Right Border) ── */}
      <div
        onMouseDown={handleMouseDown}
        title="Drag to resize sidebar"
        className={`absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize group z-40 transition-colors ${
          isDragging ? "bg-[#E50914]" : "hover:bg-[#E50914]/40"
        }`}
      >
        {/* Visual grab indicator line on hover or dragging */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 right-[-2px] w-1 h-8 rounded-full transition-all ${
            isDragging
              ? "bg-[#E50914] scale-125"
              : "bg-slate-300 group-hover:bg-[#E50914] opacity-0 group-hover:opacity-100"
          }`}
        />
      </div>
    </aside>
  );
}
