import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Film,
  MapPin,
  Calendar,
  Sparkles,
  Ticket,
  ChevronRight,
} from "lucide-react";
import { useActiveMovies } from "../../utils/movieCatalogService";
import { useGetNowPlayingMoviesQuery } from "../../services/api/movieApi";
import { AVAILABLE_BRANCHES } from "../../utils/hallConfigs";

export default function QuickBookingBar() {
  const navigate = useNavigate();

  // 1. Data sources: Cinema Catalog + fallback to TMDB Now Playing
  const managedMovies = useActiveMovies();
  const { data: tmdbMovies } = useGetNowPlayingMoviesQuery(1);

  // Available movies for booking
  const availableMovies = useMemo(() => {
    if (managedMovies && managedMovies.length > 0) {
      return managedMovies.slice(0, 12);
    }
    return (tmdbMovies || []).slice(0, 12);
  }, [managedMovies, tmdbMovies]);

  // Selected State
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(
    AVAILABLE_BRANCHES[0] || "FilmZone SenSok",
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("all");

  // Dynamic Date Options (Today, Tomorrow, and next 5 days)
  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      let label = "";
      if (i === 0)
        label =
          "Today, " +
          d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      else if (i === 1)
        label =
          "Tomorrow, " +
          d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      else
        label = d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      dates.push({ value: iso, label });
    }
    return dates;
  }, []);

  // Set default selections once loaded
  const currentMovie =
    availableMovies.find((m) => String(m.id) === String(selectedMovieId)) ||
    availableMovies[0];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const targetId = selectedMovieId || (currentMovie ? currentMovie.id : "1");
    navigate(`/movies/${targetId}`);
  };

  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12">
      <div className="bg-white/95 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] backdrop-blur-2xl rounded-3xl border border-neutral-200/80 shadow-2xl shadow-black/20 p-4 sm:p-6 transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Header pill */}
          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-center pr-2">
            <div className="w-10 h-10 rounded-2xl bg-[#B90101]/10 text-[#B90101] flex items-center justify-center border border-[#B90101]/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-[#B90101]">
                Quick Booking
              </p>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white leading-tight">
                Find Showtimes
              </h3>
            </div>
          </div>

          {/* Booking Selectors Grid */}
          <form
            onSubmit={handleBookingSubmit}
            className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 flex-1"
          >
            {/* 1. Select Movie */}
            <div className="relative flex items-center bg-neutral-100/80 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] rounded-2xl px-3.5 py-2.5 border border-neutral-200/70 hover:border-[#B90101]/60 transition">
              <Film className="w-4 h-4 text-[#B90101] mr-2.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Movie
                </label>
                <select
                  value={
                    selectedMovieId || (currentMovie ? currentMovie.id : "")
                  }
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-neutral-900 dark:text-white focus:outline-none cursor-pointer truncate"
                >
                  {availableMovies.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                      className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    >
                      {m.title || m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Select Cinema Branch */}
            <div className="relative flex items-center bg-neutral-100/80 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] rounded-2xl px-3.5 py-2.5 border border-neutral-200/70  hover:border-[#B90101]/60 transition">
              <MapPin className="w-4 h-4 text-[#B90101] mr-2.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Cinema Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-neutral-900 dark:text-white focus:outline-none cursor-pointer truncate"
                >
                  {AVAILABLE_BRANCHES.map((branch) => (
                    <option
                      key={branch}
                      value={branch}
                      className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white"
                    >
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Select Date */}
            <div className="relative flex items-center bg-neutral-100/80 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] rounded-2xl px-3.5 py-2.5 border border-neutral-200/70 hover:border-[#B90101]/60 transition">
              <Calendar className="w-4 h-4 text-[#B90101] mr-2.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Date
                </label>
                <select
                  value={selectedDate || dateOptions[0]?.value}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-neutral-900 dark:text-white focus:outline-none cursor-pointer truncate"
                >
                  {dateOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-white dark:bg-[var(--primary-color-30)] text-neutral-900 dark:text-white"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Experience Format & Book Button */}
            <button
              type="submit"
              className="w-full h-full min-h-[50px] rounded-2xl bg-[#B90101] hover:brightness-110 active:scale-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#B90101]/30 transition cursor-pointer"
            >
              <span>Find Showtimes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
