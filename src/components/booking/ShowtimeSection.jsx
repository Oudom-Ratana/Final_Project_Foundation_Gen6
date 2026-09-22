import { useState, useMemo } from "react";
import { ChevronDown, Volume2, MessageCircleMore } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";
import { setMovie } from "../../redux/slices/bookingSlice";
import { LOCATIONS, BRANCH_SHOWTIMES } from "../../data/cinemaShowtimeData";
import {
  useGetAllShowtimesQuery,
  useGetAllHallsQuery,
} from "../../services/api/cinemaApi";

// Generate today + next 6 days dynamically so date cards are always current
function generateDates(count = 7) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const result = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    result.push({
      id: `${yyyy}-${mm}-${dd}`, // e.g. "2026-09-22" — used to match startTime
      month: months[d.getMonth()],
      day: String(d.getDate()),
      weekday: days[d.getDay()],
    });
  }
  return result;
}

const DYNAMIC_DATES = generateDates(7);

/**
 * ShowtimeSection
 * Displays Cinema Location selector, Date picker cards, and Branch Showtime listings.
 * Integrates live showtimes from Teacher's Cinema API with fallback to offline data.
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

  // 1. Live Showtimes + Halls from Teacher's API
  const { data: apiShowtimes = [], isLoading: isShowtimesLoading } =
    useGetAllShowtimesQuery();
  const { data: apiHalls = [] } = useGetAllHallsQuery();

  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDate, setSelectedDate] = useState(DYNAMIC_DATES[0]); // Default to today
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Filter showtimes matching current movie (by movieUuid or title)
  const matchedApiShowtimes = useMemo(() => {
    if (!Array.isArray(apiShowtimes) || apiShowtimes.length === 0) return [];
    return apiShowtimes.filter((st) => {
      // 1. Match by movie UUID or title
      const movieMatch =
        (st.movieUuid && movieId && st.movieUuid === movieId) ||
        (st.movieTitle &&
          movie?.title &&
          st.movieTitle.toLowerCase() === movie.title.toLowerCase());

      if (!movieMatch) return false;

      // 2. Match by selected date — compare YYYY-MM-DD prefix of startTime
      if (st.startTime && selectedDate?.id) {
        const showtimeDate = st.startTime.slice(0, 10); // "2026-09-23"
        return showtimeDate === selectedDate.id;
      }

      return true; // no startTime → include it anyway
    });
  }, [apiShowtimes, movieId, movie, selectedDate]);

  // Group matched API showtimes by hall
  const liveHalls = useMemo(() => {
    if (matchedApiShowtimes.length === 0) return null;
    const map = {};
    matchedApiShowtimes.forEach((st) => {
      const hId = st.hallUuid || st.hallName || "Main Hall";
      const hallMeta = apiHalls.find(
        (h) => h.uuid === st.hallUuid || h.name === st.hallName,
      );
      const hallTypeStr = (
        hallMeta?.hallType ||
        st.hallType ||
        ""
      ).toUpperCase();
      const hallNameStr = st.hallName || hallMeta?.name || "Hall 1";
      const isGold =
        hallTypeStr === "VIP" ||
        hallNameStr.toLowerCase().includes("vip") ||
        hallNameStr.toLowerCase().includes("gold");

      let screenType = "2D";
      if (isGold) {
        screenType = "GOLD";
      } else if (
        hallNameStr.toLowerCase().includes("screen x") ||
        hallNameStr.toLowerCase().includes("screenx")
      ) {
        screenType = "SCREEN X";
      } else if (hallNameStr.toLowerCase().includes("3d")) {
        screenType = "3D";
      }

      if (!map[hId]) {
        map[hId] = {
          id: hId,
          screenType,
          goldClass: isGold,
          hallName: hallNameStr,
          audio: "Dolby Atmos 7.1",
          subtitle: "Khmer / English",
          slots: [],
        };
      }
      let timeStr = "02:00 PM";
      if (st.startTime) {
        try {
          const d = new Date(st.startTime);
          timeStr = d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch (e) {
          console.warn("Time parse error:", e);
        }
      } else if (st.showTime) {
        timeStr = st.showTime;
      }
      map[hId].slots.push({
        uuid: st.uuid,
        time: timeStr,
        price: st.basePrice || 5.0,
        raw: st,
      });
    });
    return Object.values(map);
  }, [matchedApiShowtimes]);

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

  const handleTimeClick = (branch, hall, time, showtimeObj = null) => {
    const slotKey = `${hall.id}-${time}`;
    setSelectedTimeSlot(slotKey);

    if (movie) {
      dispatch(setMovie(movie));
    }

    const params = new URLSearchParams({
      movie: movieId || showtimeObj?.movieUuid || "",
      mediaType: isTV ? "tv" : "movie",
      hall: hall.goldClass ? "gold" : "standard",
      screenType: hall.screenType || (hall.goldClass ? "GOLD" : "2D"),
      time,
      branch: branch?.branchName || "FilmZone Major Cinema",
      date: selectedDate.id, // e.g. "2026-09-23"
    });

    if (showtimeObj?.uuid) {
      params.set("showtimeUuid", showtimeObj.uuid);
    }
    if (showtimeObj?.hallUuid || hall.id) {
      params.set("hallUuid", showtimeObj?.hallUuid || hall.id);
    }
    if (showtimeObj?.basePrice || showtimeObj?.price) {
      params.set("price", String(showtimeObj.basePrice || showtimeObj.price));
    }

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

      {/* 3. Horizontal Date Selector Cards — today + next 6 days */}
      <div className="flex items-center justify-start gap-3 sm:gap-4 overflow-x-auto py-2 scrollbar-hide pb-3">
        {DYNAMIC_DATES.map((d, idx) => {
          const isSelected = selectedDate.id === d.id;
          const isToday = idx === 0;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`relative shrink-0 min-w-[100px] sm:min-w-[110px] h-[80px] rounded-2xl border p-2.5 flex flex-col justify-between transition-all duration-200 backdrop-blur-md ${
                isSelected
                  ? "border-[#B90101] bg-[#B90101]/15 shadow-md scale-105"
                  : "shadow-xs hover:scale-[1.02]"
              }`}
              style={!isSelected ? glassCardStyle : undefined}
            >
              {isToday && (
                <span className="absolute top-1 right-2 text-[9px] font-extrabold uppercase tracking-widest text-[#B90101]">
                  Today
                </span>
              )}
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
        {/* Live Backend Showtimes from Teacher's Database */}
        {liveHalls && liveHalls.length > 0 && (
          <div
            className="w-full rounded-2xl sm:rounded-3xl border border-[#B90101]/40 overflow-hidden shadow-md backdrop-blur-md"
            style={glassCardStyle}
          >
            <div
              className="flex items-center justify-between px-5 sm:px-6 py-4 border-b bg-[#B90101]/10"
              style={borderDividerStyle}
            >
              <div className="flex items-center gap-3">
                <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                  FilmZone Cinema (Live Schedule)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#B90101] text-white">
                  Teacher API Live
                </span>
              </div>
            </div>

            <div className="divide-y" style={borderDividerStyle}>
              {liveHalls.map((hall) => {
                const isGold = hall.goldClass;
                return (
                  <div
                    key={hall.id}
                    className="px-5 sm:px-6 py-4 sm:py-5 space-y-3"
                  >
                    {renderHallHeader(hall)}

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                      {hall.slots.map((slot) => {
                        const slotKey = `${hall.id}-${slot.time}`;
                        const isActive = selectedTimeSlot === slotKey;
                        return (
                          <button
                            key={slot.uuid || slot.time}
                            type="button"
                            onClick={() =>
                              handleTimeClick(
                                { branchName: "FilmZone Cinema" },
                                hall,
                                slot.time,
                                slot.raw,
                              )
                            }
                            className="px-5 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-95 border cursor-pointer"
                            style={
                              isActive
                                ? {
                                    backgroundColor: isGold
                                      ? "#FFB800"
                                      : "#B90101",
                                    borderColor: isGold ? "#FFB800" : "#B90101",
                                    color: isGold ? "#1a1a1a" : "#ffffff",
                                    transform: "scale(1.05)",
                                  }
                                : {
                                    backgroundColor: isDark
                                      ? "var(--primary-color-30)"
                                      : "var(--primary-color-5)",
                                    borderColor: isGold
                                      ? "#FFB800"
                                      : isDark
                                        ? "var(--border-dark-mode)"
                                        : "var(--border-light-mode)",
                                    color: isGold
                                      ? "#FFB800"
                                      : isDark
                                        ? "#ffffff"
                                        : "#171717",
                                  }
                            }
                          >
                            <span>{slot.time}</span>
                            <span className="ml-2 text-[10px] opacity-75">
                              ${slot.price.toFixed(2)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
