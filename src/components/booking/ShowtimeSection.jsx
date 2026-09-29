import { useState, useMemo } from "react";
import { Volume2, MessageCircleMore, CalendarX } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";
import { setMovie } from "../../redux/slices/bookingSlice";
import {
  useGetAllShowtimesQuery,
  useGetAllHallsQuery,
  useGetCinemaMoviesQuery,
} from "../../services/api/cinemaApi";

// Generate today + next 2 days (3 days total) dynamically
function generateDates(count = 3) {
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
      id: `${yyyy}-${mm}-${dd}`, // e.g. "2026-09-23" — used to match showDate
      month: months[d.getMonth()],
      day: String(d.getDate()),
      weekday: days[d.getDay()],
    });
  }
  return result;
}

const DYNAMIC_DATES = generateDates(3);

/**
 * ShowtimeSection
 * Displays 3-day Date picker cards (centered) and Live Showtimes strictly from Teacher's API.
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

  // 1. Live Showtimes, Halls, and Cinema Movies from Teacher's API
  const { data: apiShowtimes = [], isLoading: isShowtimesLoading } =
    useGetAllShowtimesQuery();
  const { data: apiHalls = [] } = useGetAllHallsQuery();
  const { data: cinemaMoviesData } = useGetCinemaMoviesQuery({
    page: 0,
    size: 100,
  });

  const [selectedDate, setSelectedDate] = useState(DYNAMIC_DATES[0]); // Default to today
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Match current movie in cinema backend catalog (if opened via TMDB ID or title)
  const cinemaMovie = useMemo(() => {
    const list = cinemaMoviesData?.content || [];
    return list.find(
      (m) =>
        m.uuid === movieId ||
        String(m.id) === String(movieId) ||
        String(m.tmdbId) === String(movieId) ||
        (m.title &&
          movie?.title &&
          m.title.toLowerCase() === movie.title.toLowerCase()) ||
        (m.title &&
          movie?.name &&
          m.title.toLowerCase() === movie.name.toLowerCase()),
    );
  }, [cinemaMoviesData, movieId, movie]);

  // Filter showtimes matching current movie & selected date
  const matchedApiShowtimes = useMemo(() => {
    if (!Array.isArray(apiShowtimes) || apiShowtimes.length === 0) return [];

    return apiShowtimes.filter((st) => {
      // 1. Match by movie UUID, cinemaMovie UUID, or title
      const targetTitle = (movie?.title || movie?.name || "")
        .toLowerCase()
        .trim();
      const stTitle = (st.movieTitle || "").toLowerCase().trim();

      const movieMatch =
        (st.movieUuid &&
          movieId &&
          (st.movieUuid === movieId ||
            String(st.movieUuid) === String(movieId))) ||
        (cinemaMovie && st.movieUuid === cinemaMovie.uuid) ||
        (targetTitle &&
          stTitle &&
          (stTitle === targetTitle ||
            stTitle.includes(targetTitle) ||
            targetTitle.includes(stTitle)));

      if (!movieMatch) return false;

      // 2. Match by selected date — compare YYYY-MM-DD prefix of startTime or showDate
      const stDate =
        st.showDate || (st.startTime ? st.startTime.slice(0, 10) : "");
      if (stDate && selectedDate?.id) {
        return stDate === selectedDate.id;
      }

      return !stDate; // fallback if no date attached
    });
  }, [apiShowtimes, movieId, movie, cinemaMovie, selectedDate]);

  // Group matched API showtimes by hall
  const liveHalls = useMemo(() => {
    if (matchedApiShowtimes.length === 0) return [];
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

      // Format time to 12-hour AM/PM
      let timeStr = "02:00 PM";
      if (st.showTime) {
        const parts = st.showTime.split(":");
        if (parts.length >= 2) {
          let h = parseInt(parts[0], 10);
          const m = parts[1];
          const ampm = h >= 12 ? "PM" : "AM";
          h = h % 12 || 12;
          timeStr = `${String(h).padStart(2, "0")}:${m} ${ampm}`;
        } else {
          timeStr = st.showTime;
        }
      } else if (st.startTime) {
        const timePart = st.startTime.includes("T")
          ? st.startTime.split("T")[1].slice(0, 5)
          : "";
        if (timePart) {
          const parts = timePart.split(":");
          let h = parseInt(parts[0], 10);
          const m = parts[1];
          const ampm = h >= 12 ? "PM" : "AM";
          h = h % 12 || 12;
          timeStr = `${String(h).padStart(2, "0")}:${m} ${ampm}`;
        } else {
          try {
            const d = new Date(st.startTime);
            timeStr = d.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch (e) {
            console.warn("Time parse error:", e);
          }
        }
      }

      map[hId].slots.push({
        uuid: st.uuid,
        time: timeStr,
        price: st.basePrice || 5.0,
        raw: st,
      });
    });

    // Sort time slots chronologically within each hall
    const hallsArray = Object.values(map);
    hallsArray.forEach((hall) => {
      hall.slots.sort((a, b) => {
        const timeA = a.raw?.startTime || a.raw?.showTime || a.time;
        const timeB = b.raw?.startTime || b.raw?.showTime || b.time;
        return timeA.localeCompare(timeB);
      });
    });

    return hallsArray;
  }, [matchedApiShowtimes, apiHalls]);

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

  const handleTimeClick = (hall, slot) => {
    const slotKey = `${hall.id}-${slot.time}`;
    setSelectedTimeSlot(slotKey);

    if (movie) {
      dispatch(setMovie(movie));
    }

    const params = new URLSearchParams({
      movie: movieId || slot.raw?.movieUuid || "",
      mediaType: isTV ? "tv" : "movie",
      hall: hall.goldClass ? "gold" : "standard",
      screenType: hall.screenType || (hall.goldClass ? "GOLD" : "2D"),
      time: slot.time,
      branch: "FilmZone Cinema",
      date: selectedDate.id, // e.g. "2026-09-23"
    });

    if (slot.uuid) {
      params.set("showtimeUuid", slot.uuid);
    }
    if (hall.id) {
      params.set("hallUuid", hall.id);
    }
    if (slot.price) {
      params.set("price", String(slot.price));
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

    // Regular / ScreenX / 3D hall
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

      {/* 2. Horizontal Date Selector Cards — strictly 3 days from today, centered */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2 scrollbar-hide pb-3">
        {DYNAMIC_DATES.map((d) => {
          const isSelected = selectedDate.id === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`relative shrink-0 min-w-[100px] sm:min-w-[110px] h-[80px] rounded-2xl border p-2.5 flex flex-col justify-between transition-all duration-200 backdrop-blur-md cursor-pointer ${
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

      {/* 3. Real-time Showtimes Container strictly from Teacher's API */}
      <div className="space-y-4 sm:space-y-5">
        {isShowtimesLoading ? (
          /* Loading State */
          <div
            className="w-full rounded-2xl sm:rounded-3xl border p-12 flex flex-col items-center justify-center gap-3 backdrop-blur-md"
            style={glassCardStyle}
          >
            <div className="w-8 h-8 rounded-full border-2 border-[#B90101] border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
              Loading real-time showtimes...
            </p>
          </div>
        ) : liveHalls && liveHalls.length > 0 ? (
          /* Live Showtimes from Teacher's Database */
          <div
            className="w-full rounded-2xl sm:rounded-3xl border border-[#B90101]/40 overflow-hidden shadow-md backdrop-blur-md"
            style={glassCardStyle}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 sm:px-6 py-4 border-b bg-[#B90101]/10"
              style={borderDividerStyle}
            >
              <div className="flex items-center gap-3">
                <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                  FilmZone Cinema
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#B90101] text-white">
                  Live Schedule
                </span>
              </div>
            </div>

            {/* Halls List */}
            <div className="divide-y" style={borderDividerStyle}>
              {liveHalls.map((hall) => {
                const isGold = hall.goldClass;
                return (
                  <div
                    key={hall.id}
                    className="px-5 sm:px-6 py-4 sm:py-5 space-y-3"
                  >
                    {renderHallHeader(hall)}

                    {/* Showtime Pill Buttons */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
                      {hall.slots.map((slot) => {
                        const slotKey = `${hall.id}-${slot.time}`;
                        const isActive = selectedTimeSlot === slotKey;
                        return (
                          <button
                            key={slot.uuid || slot.time}
                            type="button"
                            onClick={() => handleTimeClick(hall, slot)}
                            className="px-5 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-95 border cursor-pointer flex items-center gap-2"
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
                            <span className="text-[10px] opacity-75">
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
        ) : (
          /* Clean Empty State when no showtimes are scheduled */
          <div
            className="w-full rounded-2xl sm:rounded-3xl border p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-3 backdrop-blur-md"
            style={glassCardStyle}
          >
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-400">
              <CalendarX className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-200">
              No Showtimes Scheduled
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
              There are currently no showtimes scheduled for this date. Please
              select another date above or check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
