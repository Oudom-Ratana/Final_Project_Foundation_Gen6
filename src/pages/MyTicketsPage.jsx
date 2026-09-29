import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { selectTheme } from "../redux/slices/uiSlice";
import { selectUserTickets } from "../redux/slices/ticketSlice";
import { TICKETS_PER_PAGE } from "../data/ticketData";
import { useGetMyBookingsQuery, useGetCinemaMoviesQuery } from "../services/api/cinemaApi";
import TicketCard from "../components/tickets/TicketCard";
import TicketDetailModal from "../components/tickets/TicketDetailModal";
import ScrollReveal from "../components/common/ScrollReveal";

// Helper to reliably parse showtime timestamp into milliseconds
function getShowtimeTimestamp(booking) {
  if (booking.startTime) {
    const d = new Date(booking.startTime);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  if (booking.showDate && booking.showTime) {
    const d = new Date(`${booking.showDate}T${booking.showTime}`);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  const dateStr = booking.showtime?.date || booking.date;
  const timeStr = booking.showtime?.time || booking.time;
  if (dateStr && timeStr) {
    const d = new Date(`${dateStr} ${timeStr}`);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  if (booking.createdAt) {
    const d = new Date(booking.createdAt);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return Date.now() + 3600000;
}

export default function MyTicketsPage() {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam === "history" ? "history" : "upcoming",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Real-time clock: checks current time every 30 seconds
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (tabParam === "history" || tabParam === "upcoming") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Auth token
  const token =
    useSelector((state) => state.auth?.accessToken || state.auth?.token) ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");

  // 1. Fetch live user bookings from Teacher's API
  const { data: apiBookingsData, isLoading: isBookingsLoading } =
    useGetMyBookingsQuery(
      { page: 0, size: 50 },
      { skip: !token, refetchOnMountOrArgChange: true },
    );

  // 2. Fetch cinema catalog to match real posters and metadata
  const { data: cinemaMoviesData } = useGetCinemaMoviesQuery();
  const catalogMovies = useMemo(() => {
    if (Array.isArray(cinemaMoviesData)) return cinemaMoviesData;
    if (Array.isArray(cinemaMoviesData?.content)) return cinemaMoviesData.content;
    return [];
  }, [cinemaMoviesData]);

  // 3. Newly confirmed session tickets from local storage
  const localUserTickets = useSelector(selectUserTickets) || [];

  // 4. Transform API bookings with real-time showtime check
  const apiTickets = useMemo(() => {
    if (!apiBookingsData?.content || !Array.isArray(apiBookingsData.content)) {
      return [];
    }

    return apiBookingsData.content.map((booking) => {
      const showTimestamp = getShowtimeTimestamp(booking);
      // REAL-TIME CHECK:
      // If showtime is in the future (> currentTime) and not cancelled -> UPCOMING
      // When clock hits showtime (e.g. 2:01 PM) -> moves to HISTORY
      // REAL-TIME SHOWTIME CHECK:
      // If showtime is in the future (> currentTime) and not cancelled -> ALWAYS UPCOMING!
      // Once clock passes showtime (e.g. 2:01 PM) -> smoothly moves to HISTORY!
      const isPast = showTimestamp <= currentTime;
      const isCancelled = booking.status === "CANCELLED";
      const isUpcoming = !isPast && !isCancelled;

      const showDateObj = new Date(showTimestamp);
      const formattedDate = !isNaN(showDateObj.getTime())
        ? showDateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Showtime";

      const formattedTime = !isNaN(showDateObj.getTime())
        ? showDateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "TBD";

      const seatLabels = Array.isArray(booking.seats)
        ? booking.seats
            .map((s) => s.seatLabel || s.label || s)
            .filter(Boolean)
        : [];

      const bookingRef = `FZ-${booking.uuid.slice(0, 8).toUpperCase()}`;

      // Match movie from catalog to get authentic poster, runtime, genres
      const catalogMatch = catalogMovies.find(
        (m) =>
          m.title?.toLowerCase() === booking.movieTitle?.toLowerCase() ||
          (m.uuid && booking.movieUuid && m.uuid === booking.movieUuid),
      );

      const localMatch = localUserTickets.find(
        (t) =>
          t.bookingUuid === booking.uuid ||
          t.id === booking.uuid ||
          t.id === bookingRef,
      );

      const posterUrl =
        catalogMatch?.posterUrl ||
        catalogMatch?.poster_path ||
        localMatch?.movie?.poster ||
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80";

      const durationStr =
        catalogMatch?.duration
          ? `${Math.floor(catalogMatch.duration / 60)}h ${catalogMatch.duration % 60}m`
          : localMatch?.movie?.duration || "2h 15m";

      const genresList =
        catalogMatch?.genres || localMatch?.movie?.genres || ["Action", "Adventure"];

      return {
        id: booking.uuid,
        bookingUuid: booking.uuid,
        showTimestamp,
        status: isUpcoming ? "upcoming" : "history",
        apiStatus: isPast ? (isCancelled ? "CANCELLED" : "COMPLETED") : (booking.status || "CONFIRMED"),
        movie: {
          title: booking.movieTitle || catalogMatch?.title || "Movie Ticket",
          poster: posterUrl,
          duration: durationStr,
          genres: genresList,
        },
        showtime: {
          date: formattedDate,
          time: formattedTime,
          format: localMatch?.showtime?.format || "2D",
          hall: booking.hallName || "Hall 2 - Standard",
          location: localMatch?.showtime?.location || "FilmZone SenSok",
        },
        seats: seatLabels.length > 0 ? seatLabels : localMatch?.seats || ["Standard"],
        pricePerSeat:
          booking.seats?.[0]?.unitPrice ||
          (booking.totalAmount && seatLabels.length
            ? booking.totalAmount / seatLabels.length
            : 0.01),
        totalSeats: seatLabels.length || 1,
        totalPrice: booking.totalAmount || 0.01,
        bookingRef,
        ticketQrToken: booking.ticketQrToken,
        viewUrl: `/booking/confirmed?bookingUuid=${booking.uuid}&movie=${encodeURIComponent(
          booking.movieTitle || "",
        )}&ref=${bookingRef}&time=${encodeURIComponent(
          formattedTime,
        )}&date=${encodeURIComponent(formattedDate)}&seats=${encodeURIComponent(
          seatLabels.join(","),
        )}&total=${booking.totalAmount}`,
      };
    });
  }, [apiBookingsData, catalogMovies, localUserTickets, currentTime]);

  // 5. Deduplicate and merge tickets
  const allTickets = useMemo(() => {
    // Re-evaluate local session tickets with real-time clock as well
    const formattedLocal = localUserTickets.map((t) => {
      const showTimestamp = getShowtimeTimestamp(t);
      const isPast = showTimestamp <= currentTime;
      return {
        ...t,
        showTimestamp,
        status: isPast ? "history" : "upcoming",
        apiStatus: isPast ? "COMPLETED" : "CONFIRMED",
      };
    });

    const seenKeys = new Set();
    const result = [];

    // Prioritize API tickets
    for (const t of apiTickets) {
      const key = `${t.movie.title}_${t.showtime.date}_${t.showtime.time}_${Array.isArray(t.seats) ? t.seats.join(',') : t.seats}`.toLowerCase();
      seenKeys.add(key);
      seenKeys.add(t.bookingUuid);
      seenKeys.add(t.id);
      result.push(t);
    }

    // Add unique local session tickets
    for (const lt of formattedLocal) {
      const key = `${lt.movie.title}_${lt.showtime.date}_${lt.showtime.time}_${Array.isArray(lt.seats) ? lt.seats.join(',') : lt.seats}`.toLowerCase();
      if (!seenKeys.has(key) && !seenKeys.has(lt.bookingUuid) && !seenKeys.has(lt.id)) {
        seenKeys.add(key);
        result.push(lt);
      }
    }

    return result;
  }, [apiTickets, localUserTickets, currentTime]);

  const filteredTickets = allTickets.filter((t) => {
    const status = (t.status || "").toLowerCase();
    if (activeTab === "history") {
      return status === "history" || status === "completed" || status === "cancelled";
    }
    return status === activeTab;
  });

  const totalPages = Math.ceil(filteredTickets.length / TICKETS_PER_PAGE);
  const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + TICKETS_PER_PAGE,
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    setSearchParams(newParams, { replace: true });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans pb-16 pt-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Tab Switcher ── */}
        <ScrollReveal delay={0} duration={600} distance="translate-y-4">
          <div className="flex items-center justify-center gap-4 mb-10">
            <button
              type="button"
              onClick={() => handleTabChange("upcoming")}
              className={`text-2xl sm:text-3xl font-black transition-colors duration-200 cursor-pointer ${
                activeTab === "upcoming"
                  ? "text-[#B90101]"
                  : isDark
                    ? "text-neutral-500 hover:text-neutral-300"
                    : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Upcoming
            </button>

            {/* Divider */}
            <span
              className={`text-2xl sm:text-3xl font-light select-none ${isDark ? "text-neutral-600" : "text-neutral-300"}`}
            >
              |
            </span>

            <button
              type="button"
              onClick={() => handleTabChange("history")}
              className={`text-2xl sm:text-3xl font-black transition-colors duration-200 cursor-pointer ${
                activeTab === "history"
                  ? "text-[#B90101]"
                  : isDark
                    ? "text-neutral-500 hover:text-neutral-300"
                    : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              History
            </button>
          </div>
        </ScrollReveal>

        {/* ── Ticket List ── */}
        <div className="space-y-4">
          {isBookingsLoading ? (
            <div className="text-center py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#B90101] animate-spin" />
              <p className="text-sm font-semibold text-neutral-500">Loading your tickets from cinema...</p>
            </div>
          ) : paginatedTickets.length === 0 ? (
            <ScrollReveal delay={100} duration={600} distance="translate-y-6">
              <div className="text-center py-20">
                <p
                  className={`text-lg font-semibold ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
                >
                  {activeTab === "upcoming"
                    ? "No upcoming tickets yet."
                    : "No ticket history yet."}
                </p>
                <p
                  className={`text-sm mt-1 ${isDark ? "text-neutral-600" : "text-neutral-400"}`}
                >
                  Book a movie to see your tickets here.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            paginatedTickets.map((ticket, index) => (
              <ScrollReveal
                key={ticket.id}
                delay={index * 80}
                duration={600}
                distance="translate-y-6"
              >
                <TicketCard ticket={ticket} onViewTicket={setSelectedTicket} />
              </ScrollReveal>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {!isBookingsLoading && totalPages > 1 && (
          <ScrollReveal delay={200} duration={600} distance="translate-y-4">
            <div className="flex items-center justify-center gap-2 mt-10 select-none">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-full text-[14px] font-bold border transition hover:scale-105 active:scale-95 ${
                      page === currentPage
                        ? "bg-[#B90101] border-[#B90101] text-white shadow-md"
                        : isDark
                          ? "border-white/20 text-white hover:bg-white/10"
                          : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                  isDark
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Page Info */}
            <p
              className={`text-center text-[13px] mt-3 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
            >
              Page {currentPage} of {totalPages} &nbsp;·&nbsp;{" "}
              {filteredTickets.length} tickets
            </p>
          </ScrollReveal>
        )}
      </div>

      {/* ── Ticket Detail Pop-up Modal ── */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
