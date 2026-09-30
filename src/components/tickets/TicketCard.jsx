import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";

export default function TicketCard({ ticket, onViewTicket }) {
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  const {
    movie,
    showtime,
    seats,
    pricePerSeat,
    totalSeats,
    totalPrice,
    status,
  } = ticket;
  const isUpcoming = status === "upcoming";

  const handleViewTicket = () => {
    if (onViewTicket) {
      onViewTicket(ticket);
      return;
    }
    if (ticket.viewUrl) {
      navigate(ticket.viewUrl);
    } else {
      const params = new URLSearchParams({
        movie: ticket.movieId || "558449",
        ref: ticket.id || "TKT-001",
        time: ticket.showtime?.time || "6:30 PM",
        date: ticket.showtime?.date || "26 Aug 2026",
        branch: ticket.showtime?.location || "FilmZone SenSok",
        hall: (ticket.showtime?.format || "").toLowerCase().includes("gold")
          ? "gold"
          : "standard",
      });
      navigate(`/booking/confirmed?${params.toString()}`);
    }
  };

  return (
    <div
      className="flex gap-4 sm:gap-5 rounded-2xl p-4 sm:p-5 border border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)] bg-white dark:bg-[var(--primary-color-30)] backdrop-blur-md transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: isDark
          ? "var(--primary-color-30)"
          : "white",
        borderColor: isDark
          ? "var(--border-dark-mode)"
          : "var(--border-light-mode)",
      }}
    >
      <div className="shrink-0 w-[110px] sm:w-[145px] rounded-xl overflow-hidden aspect-[3/4] bg-neutral-900">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-black text-lg sm:text-xl leading-tight ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {movie.title}
          </h3>

          {isUpcoming ? (
            <span
              className="shrink-0 text-[13px] font-bold whitespace-nowrap text-amber-500"
            >
              • Upcoming
            </span>
          ) : ticket.apiStatus === "CANCELLED" ? (
            <span className="shrink-0 text-[13px] font-black uppercase tracking-wide text-neutral-400 whitespace-nowrap">
              Cancelled
            </span>
          ) : ticket.apiStatus === "EXPIRED" ? (
            <span className="shrink-0 text-[13px] font-black uppercase tracking-wide text-neutral-400 whitespace-nowrap">
              Expired
            </span>
          ) : (
            <span className="shrink-0 text-[13px] font-black uppercase tracking-wide text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
              Completed
            </span>
          )}
        </div>

        <p
          className="text-[13px] sm:text-[14px] font-semibold"
          style={{ color: "#B90101" }}
        >
          {movie.duration} &bull; {showtime.date} &bull; {showtime.time}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="px-3 py-0.5 rounded-full text-white text-[11px] font-black uppercase tracking-wider"
              style={{ backgroundColor: "#B90101" }}
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between gap-4 mt-2">
          <div className="grid grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-3 flex-1">
            <div>
              <p
                className={`text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
              >
                FORMAT
              </p>
              <p
                className={`text-[14px] sm:text-[15px] font-black mt-0.5 ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                {showtime.format}
              </p>
            </div>

            <div>
              <p
                className={`text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
              >
                HALL
              </p>
              <p
                className={`text-[14px] sm:text-[15px] font-black mt-0.5 ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                {showtime.hall}
              </p>
            </div>

            <div>
              <p
                className={`text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
              >
                LOCATION
              </p>
              <p
                className={`text-[14px] sm:text-[15px] font-black mt-0.5 ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                {showtime.location}
              </p>
            </div>

            <div>
              <p
                className={`text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
              >
                SEAT
              </p>
              <p
                className={`text-[14px] sm:text-[15px] font-black mt-0.5 ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                {seats.join(", ")}
              </p>
            </div>

            <div>
              <p
                className={`text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
              >
                PRICE/SEAT
              </p>
              <p
                className={`text-[14px] sm:text-[15px] font-black mt-0.5 ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                ${pricePerSeat.toFixed(2)}
              </p>
            </div>

            <div>
              <p
                className={`text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
              >
                TOTAL ({totalSeats} {totalSeats === 1 ? "SEAT" : "SEATS"})
              </p>
              <p
                className={`text-[14px] sm:text-[15px] font-black mt-0.5 ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                ${totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleViewTicket}
            className="shrink-0 pb-0.5 text-[14px] font-black text-[#B90101] hover:opacity-80 active:scale-95 transition cursor-pointer"
          >
            View Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
