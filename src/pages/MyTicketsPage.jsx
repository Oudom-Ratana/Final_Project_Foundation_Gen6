import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Loader2, Ticket, LogIn } from "lucide-react";
import { selectTheme } from "../redux/slices/uiSlice";
import { TICKETS_PER_PAGE } from "../data/ticketData";
import { useGetMyBookingsQuery, useGetCinemaMoviesQuery } from "../services/api/cinemaApi";
import TicketCard from "../components/tickets/TicketCard";
import TicketDetailModal from "../components/tickets/TicketDetailModal";
import AddSnacksModal from "../components/tickets/AddSnacksModal";
import { getSafePosterUrl } from "../utils/downloadTicketPdf";
import ScrollReveal from "../components/common/ScrollReveal";
import SEO from "../components/common/SEO";

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
  const [snackTicket, setSnackTicket] = useState(null);

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

  const token =
    useSelector((state) => state.auth?.accessToken || state.auth?.token) ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");

  const {
    data: apiBookingsData,
    isLoading: isBookingsLoading,
    isFetching: isBookingsFetching,
    refetch: refetchBookings,
  } = useGetMyBookingsQuery(
    { page: 0, size: 50 },
    { skip: !token, refetchOnMountOrArgChange: true },
  );

  const { data: cinemaMoviesData } = useGetCinemaMoviesQuery();
  const catalogMovies = useMemo(() => {
    if (Array.isArray(cinemaMoviesData)) return cinemaMoviesData;
    if (Array.isArray(cinemaMoviesData?.content)) return cinemaMoviesData.content;
    return [];
  }, [cinemaMoviesData]);

  const allTickets = useMemo(() => {
    if (!token || !apiBookingsData?.content || !Array.isArray(apiBookingsData.content)) {
      return [];
    }

    return apiBookingsData.content.map((booking) => {
      const showTimestamp = getShowtimeTimestamp(booking);

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

      const catalogMatch = catalogMovies.find(
        (m) =>
          m.title?.toLowerCase() === booking.movieTitle?.toLowerCase() ||
          (m.uuid && booking.movieUuid && m.uuid === booking.movieUuid),
      );

      const rawPoster =
        catalogMatch?.posterUrl ||
        catalogMatch?.poster_path ||
        booking.posterUrl ||
        booking.poster_path;
      const posterUrl = getSafePosterUrl(rawPoster);

      const durationStr = catalogMatch?.duration
        ? `${Math.floor(catalogMatch.duration / 60)}h ${catalogMatch.duration % 60}m`
        : "2h 15m";

      const genresList = catalogMatch?.genres || ["Action", "Adventure"];

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
          format: "2D",
          hall: booking.hallName || "Hall 2 - Standard",
          location: "FilmZone Cinema",
        },
        seats: seatLabels.length > 0 ? seatLabels : ["Standard"],
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
  }, [token, apiBookingsData, catalogMovies, currentTime]);

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

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 font-sans select-none">
        <ScrollReveal delay={0} duration={600} distance="translate-y-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161A20] border border-neutral-200 dark:border-white/10 shadow-2xl p-8 text-center space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-[#B90101]/10 text-[#B90101] flex items-center justify-center mx-auto shadow-inner">
              <Ticket className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                Log In to View Tickets
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-sm mx-auto">
                Please log in to your account to view your upcoming movie passes and booking history.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/login?redirect=/my-tickets"
                className="w-full py-3.5 px-6 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-sm uppercase tracking-wider transition active:scale-95 shadow-md border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans pb-16 pt-4 sm:pt-6 transition-colors duration-300 select-none">
      <SEO
        title="My Tickets & Movie Passes | FilmZone"
        description="View your active cinema bookings, showtimes, seats, and download digital tickets on FilmZone."
        url="/my-tickets"
      />
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal delay={0} duration={600} distance="translate-y-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-10">
            <button
              type="button"
              onClick={() => handleTabChange("upcoming")}
              className={`text-xl xs:text-2xl sm:text-3xl font-black transition-colors duration-200 cursor-pointer ${
                activeTab === "upcoming"
                  ? "text-[#B90101]"
                  : isDark
                    ? "text-neutral-500 hover:text-neutral-300"
                    : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Upcoming
            </button>

            <span
              className={`text-xl xs:text-2xl sm:text-3xl font-light select-none ${isDark ? "text-neutral-600" : "text-neutral-300"}`}
            >
              |
            </span>

            <button
              type="button"
              onClick={() => handleTabChange("history")}
              className={`text-xl xs:text-2xl sm:text-3xl font-black transition-colors duration-200 cursor-pointer ${
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

        <div className="space-y-4">
          {isBookingsLoading || isBookingsFetching ? (
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
                <TicketCard
                  ticket={ticket}
                  onViewTicket={setSelectedTicket}
                  onAddSnacks={setSnackTicket}
                />
              </ScrollReveal>
            ))
          )}
        </div>

        {!isBookingsLoading && !isBookingsFetching && totalPages > 1 && (
          <ScrollReveal delay={200} duration={600} distance="translate-y-4">
            <div className="flex items-center justify-center gap-2 mt-10 select-none">
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

            <p
              className={`text-center text-[13px] mt-3 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
            >
              Page {currentPage} of {totalPages} &nbsp;·&nbsp;{" "}
              {filteredTickets.length} tickets
            </p>
          </ScrollReveal>
        )}
      </div>

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {snackTicket && (
        <AddSnacksModal
          isOpen={Boolean(snackTicket)}
          ticket={snackTicket}
          onClose={() => setSnackTicket(null)}
          onOrderSuccess={() => {
            if (refetchBookings) refetchBookings();
          }}
        />
      )}
    </div>
  );
}
