import { useMemo } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { Ticket, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { selectTheme } from "../../redux/slices/uiSlice";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";
import { useGetEligibleBookingsQuery } from "../../services/api/cinemaApi";

export default function EligibleBookingBanner({ selectedBookingUuid, onSelectBooking }) {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data: eligibleBookings = [], isLoading } = useGetEligibleBookingsQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const selectedBooking = useMemo(() => {
    return eligibleBookings.find((b) => b.bookingUuid === selectedBookingUuid) ?? eligibleBookings[0] ?? null;
  }, [eligibleBookings, selectedBookingUuid]);

  if (!isAuthenticated) {
    return (
      <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md ${
        isDark ? "bg-white/5 border-white/10" : "bg-neutral-100 border-neutral-200"
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#B90101]/10 text-[#B90101] flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
              Have an upcoming movie ticket?
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Log in to link your ticket and pre-order popcorn & drinks for instant pickup!
            </p>
          </div>
        </div>
        <Link
          to="/login?redirect=/deals"
          className="px-5 py-2 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs uppercase tracking-wider transition shrink-0 shadow-md cursor-pointer"
        >
          Log In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border animate-pulse bg-neutral-200/50 dark:bg-neutral-800/40 border-neutral-300 dark:border-neutral-800">
        <div className="h-5 bg-neutral-300 dark:bg-neutral-700 rounded w-1/3 mb-2" />
        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2" />
      </div>
    );
  }

  if (eligibleBookings.length === 0) {
    return (
      <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md ${
        isDark ? "bg-white/5 border-white/10" : "bg-neutral-100 border-neutral-200"
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#B90101]/10 text-[#B90101] flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
              Pre-Order Snacks for Movie Pickup
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              You don't have an upcoming confirmed movie ticket right now. Book a movie first to pre-order snacks!
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="px-5 py-2 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs uppercase tracking-wider transition shrink-0 shadow-md cursor-pointer flex items-center gap-1.5"
        >
          <span>Browse Movies</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border space-y-3.5 backdrop-blur-md transition ${
      isDark ? "bg-gradient-to-r from-[#B90101]/10 to-neutral-900/60 border-white/15" : "bg-gradient-to-r from-[#B90101]/5 to-neutral-50 border-neutral-300"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B90101]">
          <Sparkles className="w-4 h-4" />
          <span>Active Movie Ticket Detected</span>
        </div>
        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
          {eligibleBookings.length} upcoming ticket{eligibleBookings.length > 1 ? "s" : ""} eligible
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-1">
            SELECT TICKET TO ATTACH SNACKS:
          </label>
          <select
            value={selectedBooking?.bookingUuid ?? ""}
            onChange={(e) => onSelectBooking(e.target.value)}
            className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition focus:outline-none focus:ring-2 focus:ring-[#B90101] ${
              isDark ? "bg-neutral-900 border-white/20 text-white" : "bg-white border-neutral-300 text-neutral-900"
            }`}
          >
            {eligibleBookings.map((b) => {
              const dateStr = b.startTime ? new Date(b.startTime).toLocaleDateString([], { month: "short", day: "numeric" }) : "";
              const timeStr = b.startTime ? new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
              const seatsStr = Array.isArray(b.seats) ? b.seats.join(", ") : "";
              return (
                <option key={b.bookingUuid} value={b.bookingUuid}>
                  {b.movieTitle} — {b.hallName} ({dateStr} {timeStr}) {seatsStr ? `[Seats: ${seatsStr}]` : ""}
                </option>
              );
            })}
          </select>
        </div>

        {selectedBooking && (
          <div className="sm:self-end flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ticket Linked</span>
          </div>
        )}
      </div>
    </div>
  );
}
