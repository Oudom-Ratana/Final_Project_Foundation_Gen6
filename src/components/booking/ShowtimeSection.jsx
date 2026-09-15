import { useState } from "react";
import { ChevronDown, Volume2, MessageCircleMore } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";
import { setMovie } from "../../redux/slices/bookingSlice";
import {
  LOCATIONS,
  DATES,
  BRANCH_SHOWTIMES,
} from "../../data/cinemaShowtimeData";

/**
 * ShowtimeSection
 * Displays Cinema Location selector, Date picker cards, and Branch Showtime listings.
 * Each branch shows all its halls grouped separately.
 * Uses glassmorphism styling (--primary-color-5 / --primary-color-30).
 */
export default function ShowtimeSection({
  movieId,
  isTV = false,
  movie = null,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDate, setSelectedDate] = useState(DATES[1]); // Default to Aug 26
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Glassmorphism design tokens from index.css
  const glassCardStyle = {
    backgroundColor: isDark
      ? "var(--primary-color-30)"
      : "var(--primary-color-5)",
    borderColor: isDark
      ? "var(--border-dark-mode)"
      : "var(--border-light-mode)",
  };

  const borderDividerStyle = {
    borderColor: isDark
      ? "var(--border-dark-mode)"
      : "var(--border-light-mode)",
  };

  const filteredBranches =
    selectedLocation === "All Locations"
      ? BRANCH_SHOWTIMES
      : BRANCH_SHOWTIMES.filter((b) => b.location === selectedLocation);

  const handleTimeClick = (branch, hall, time) => {
    const slotKey = `${hall.id}-${time}`;
    setSelectedTimeSlot(slotKey);

    if (movie) {
      dispatch(setMovie(movie));
    }

    // Navigate directly to seat selection — hall type decides the seat map
    const params = new URLSearchParams({
      movie: movieId || "",
      mediaType: isTV ? "tv" : "movie",
      hall: hall.goldClass ? "gold" : "standard",
      screenType: hall.screenType || (hall.goldClass ? "GOLD" : "2D"),
      time,
      branch: branch.branchName,
      date: `${selectedDate.month} ${selectedDate.day} ${selectedDate.weekday}`,
    });
    navigate(`/booking/seats?${params.toString()}`);
  };

  // Helper: render the screen type header for each hall group
  const renderHallHeader = (hall) => {
    if (hall.screenType === "GOLD") {
      return (
        <div className="flex items-center gap-3">
          {/* Gold Class Logo */}
          <div className="flex items-baseline gap-0.5">
            <span className="text-[11px] font-black uppercase text-[#FFB800] leading-none tracking-wider">
              GOLD
            </span>
            <span className="text-[8px] font-black uppercase text-[#FFB800] leading-none tracking-wider">
              CLASS
            </span>
          </div>
          {hall.audio && (
            <>
              <span className="text-neutral-400 dark:text-neutral-600">|</span>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                <MessageCircleMore className="w-3.5 h-3.5" />
                <span>{hall.audio}</span>
              </div>
            </>
          )}
          {hall.subtitle && (
            <>
              <span className="text-neutral-400 dark:text-neutral-600">|</span>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                <Volume2 className="w-3.5 h-3.5" />
                <span>{hall.subtitle}</span>
              </div>
            </>
          )}
        </div>
      );
    }

    // Regular / ScreenX hall
    const screenLabel =
      hall.screenType === "SCREEN X"
        ? { prefix: "SCREEN", accent: "X", size: "text-3xl sm:text-4xl" }
        : hall.screenType === "SCREEN 3D" || hall.screenType === "3D"
          ? { prefix: null, accent: "3D", size: "text-3xl sm:text-4xl" }
          : { prefix: null, accent: "2D", size: "text-3xl sm:text-4xl" };

    return (
      <div className="space-y-1.5">
        {/* Big screen type text */}
        <div className={`${screenLabel.size} font-black leading-none`}>
          {screenLabel.prefix ? (
            <span className="text-neutral-900 dark:text-white">
              {screenLabel.prefix}{" "}
              <span style={{ color: "#B90101" }}>{screenLabel.accent}</span>
            </span>
          ) : (
            <span className="text-neutral-900 dark:text-white">
              {screenLabel.accent}
            </span>
          )}
        </div>
        {/* Hall name + language tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            {hall.hallName}
          </span>
          {hall.audio && (
            <>
              <span className="text-neutral-300 dark:text-neutral-600">|</span>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                <MessageCircleMore className="w-3.5 h-3.5" />
                <span>{hall.audio}</span>
              </div>
            </>
          )}
          {hall.subtitle && (
            <>
              <span className="text-neutral-300 dark:text-neutral-600">|</span>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                <Volume2 className="w-3.5 h-3.5" />
                <span>{hall.subtitle}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="w-full space-y-8 font-sans select-none pt-4">
      {/* 1. Section Title: | Showtime */}
      <div className="flex items-center gap-3">
        <span
          className="w-1.5 h-7 rounded-full inline-block"
          style={{ backgroundColor: "#B90101" }}
        />
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
          Showtime
        </h2>
      </div>

      {/* 2. All Locations Dropdown Pill */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          className="w-full py-3.5 px-6 rounded-full border flex items-center justify-between font-bold text-base text-neutral-800 dark:text-neutral-100 transition shadow-xs backdrop-blur-md"
          style={glassCardStyle}
        >
          <span className="mx-auto pl-6 font-bold">{selectedLocation}</span>
          <ChevronDown
            className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
              isLocationDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isLocationDropdownOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 z-30 rounded-2xl border p-2 shadow-2xl space-y-1 backdrop-blur-md"
            style={glassCardStyle}
          >
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setSelectedLocation(loc);
                  setIsLocationDropdownOpen(false);
                }}
                className={`w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold transition ${
                  selectedLocation === loc
                    ? "bg-[#B90101] text-white"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-white/10"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Horizontal Date Selector Cards */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2">
        {DATES.slice(0, 3).map((d) => {
          const isSelected = selectedDate.id === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`relative min-w-[100px] sm:min-w-[110px] h-[75px] rounded-2xl border p-2.5 flex flex-col justify-between transition-all duration-200 backdrop-blur-md ${
                isSelected
                  ? "border-[#B90101] bg-[#B90101]/15 shadow-md scale-105"
                  : "shadow-xs hover:scale-[1.02]"
              }`}
              style={!isSelected ? glassCardStyle : undefined}
            >
              <div className="flex items-start justify-between w-full">
                <span
                  className={`text-xs font-bold ${
                    isSelected
                      ? "text-[#B90101]"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {d.month}
                </span>
                <span
                  className={`text-2xl font-black leading-none ${
                    isSelected
                      ? "text-[#B90101]"
                      : "text-neutral-900 dark:text-white"
                  }`}
                >
                  {d.day}
                </span>
              </div>
              <span
                className={`text-xs font-semibold text-left ${
                  isSelected
                    ? "text-[#B90101]"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {d.weekday}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Cinema Branch Cards — Each shows grouped halls */}
      <div className="space-y-4 sm:space-y-5">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="w-full rounded-2xl sm:rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow backdrop-blur-md"
            style={glassCardStyle}
          >
            {/* Branch Name Header */}
            <div
              className="flex items-center justify-between px-5 sm:px-6 py-4 border-b"
              style={borderDividerStyle}
            >
              <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                {branch.branchName}
              </h3>
            </div>

            {/* Hall Groups — one block per hall */}
            <div className="divide-y" style={borderDividerStyle}>
              {branch.halls.map((hall) => {
                const isGold = hall.goldClass;
                return (
                  <div
                    key={hall.id}
                    className="px-5 sm:px-6 py-4 sm:py-5 space-y-3"
                  >
                    {/* Hall Type Header (2D big / GOLD CLASS) */}
                    {renderHallHeader(hall)}

                    {/* Showtime Pill Buttons — glassmorphism style */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                      {hall.times.map((time) => {
                        const slotKey = `${hall.id}-${time}`;
                        const isActive = selectedTimeSlot === slotKey;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeClick(branch, hall, time)}
                            className="px-5 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-95 border"
                            style={
                              isActive
                                ? isGold
                                  ? {
                                      backgroundColor: "#FFB800",
                                      borderColor: "#FFB800",
                                      color: "#1a1a1a",
                                      transform: "scale(1.05)",
                                    }
                                  : {
                                      backgroundColor: "#B90101",
                                      borderColor: "#B90101",
                                      color: "#ffffff",
                                      transform: "scale(1.05)",
                                    }
                                : isGold
                                  ? {
                                      backgroundColor: isDark
                                        ? "var(--primary-color-30)"
                                        : "var(--primary-color-5)",
                                      borderColor: "#FFB800",
                                      color: "#FFB800",
                                    }
                                  : {
                                      backgroundColor: isDark
                                        ? "var(--primary-color-30)"
                                        : "var(--primary-color-5)",
                                      borderColor: isDark
                                        ? "var(--border-dark-mode)"
                                        : "var(--border-light-mode)",
                                      color: isDark ? "#ffffff" : "#171717",
                                    }
                            }
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
