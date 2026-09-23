import { useEffect } from "react";
import { ArrowLeft, Ticket, QrCode } from "lucide-react";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";

export default function TicketDetailModal({ ticket, onClose }) {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!ticket) return null;

  const {
    movie = {},
    showtime = {},
    seats = [],
    pricePerSeat = 5.0,
    totalSeats,
    totalPrice = 5.0,
    concessions = [],
  } = ticket;

  const bookingRef =
    ticket.bookingRef ||
    (ticket.id?.startsWith("TKT-")
      ? `FZ-136${ticket.id.replace("TKT-", "").padStart(3, "0")}`
      : ticket.id || "FZ-136657");

  const seatIds = Array.isArray(seats) ? seats.join(", ") : seats || "G8";
  const seatCount = totalSeats || (Array.isArray(seats) ? seats.length : 1);
  const hallNumberOnly =
    (showtime.hall || "3").replace(/hall\s*/i, "").trim() || "3";
  const formatBadge = showtime.format || "SCREEN X";
  const hasConcessions = Array.isArray(concessions) && concessions.length > 0;
  const ticketCostOnly = Number(pricePerSeat * seatCount);

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 dark:bg-(--primary-color-30) backdrop-blur-md animate-fadeIn select-none overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Compact Modal Container with Glassmorphism */}
      <div
        className={`relative w-full max-w-[800px] max-h-[96vh] overflow-y-auto rounded-3xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-2xl border border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)] transition-all ${
          isDark ? "text-white" : "text-neutral-900"
        }`}
        style={{
          backgroundColor: isDark
            ? "var(--primary-color-30)"
            : "white",
          borderColor: isDark
            ? "var(--border-dark-mode)"
            : "var(--border-light-mode)",
        }}
      >
        {/* Top-Left Back Button */}
        <div className="mb-2 sm:mb-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#B90101] hover:bg-[#8B0101] text-white flex items-center justify-center shadow-md transition active:scale-95 cursor-pointer"
            aria-label="Back to tickets list"
            title="Back to tickets"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* ── Two Ticket Cards Side-by-Side (Matching Glassmorphism Styling) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 items-stretch justify-center max-w-[580px] mx-auto">
          {/* ──────────────── LEFT CARD: Movie Ticket ──────────────── */}
          <div
            className="w-full rounded-2xl border border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)] bg-[var(--primary-color-5)] dark:bg-[var(--primary-color-30)] backdrop-blur-md shadow-md overflow-hidden flex flex-col justify-between"
            style={{
              backgroundColor: isDark
                ? "var(--primary-color-30)"
                : "var(--primary-color-5)",
              borderColor: isDark
                ? "var(--border-dark-mode)"
                : "var(--border-light-mode)",
            }}
          >
            {/* Top Red Header */}
            <div className="bg-[#B90101] text-white py-2 text-center font-extrabold text-xs sm:text-sm tracking-wide shrink-0">
              Movie Ticket
            </div>

            {/* Card Body */}
            <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-2">
              <div>
                {/* Movie Poster & Title & Date/Time */}
                <div className="flex items-start gap-2.5">
                  <img
                    src={
                      movie.poster ||
                      movie.poster_path ||
                      "https://i.pinimg.com/736x/95/26/68/9526684fe11e38cf6bb6fbd48e37de6a.jpg"
                    }
                    alt={movie.title}
                    className="w-12 h-16 sm:w-14 sm:h-18 rounded-xl object-cover shadow-xs shrink-0 border border-neutral-200 dark:border-white/10"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="font-extrabold text-xs sm:text-sm text-neutral-900 dark:text-white leading-snug line-clamp-2">
                      {movie.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                      Date:{" "}
                      <span className="text-[#B90101] font-bold">
                        {showtime.date || "26 Aug 2026"}
                      </span>
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                      Time:{" "}
                      <span className="text-[#B90101] font-bold">
                        {showtime.time || "6:30 PM"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Perforated Ticket Tear Line with Notches */}
                <div className="relative flex items-center justify-center my-2">
                  <div
                    className="absolute -left-5 sm:-left-5.5 w-4 h-4 rounded-full border-r border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)]"
                    style={{
                      backgroundColor: isDark
                        ? "var(--primary-color-30)"
                        : "white",
                    }}
                  />
                  <div className="w-full border-b border-dashed border-neutral-300 dark:border-neutral-700" />
                  <div
                    className="absolute -right-5 sm:-right-5.5 w-4 h-4 rounded-full border-l border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)]"
                    style={{
                      backgroundColor: isDark
                        ? "var(--primary-color-30)"
                        : "white",
                    }}
                  />
                </div>

                {/* 2-Column Metadata Grid */}
                <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-[10px] sm:text-[11px]">
                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[9px]">
                      Format
                    </span>
                    <strong className="font-black text-neutral-900 dark:text-white text-xs truncate block">
                      {formatBadge}
                    </strong>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[9px]">
                      Hall
                    </span>
                    <strong className="font-black text-neutral-900 dark:text-white text-xs truncate block">
                      {showtime.hall || "Hall 3"}
                    </strong>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[9px]">
                      Location
                    </span>
                    <strong className="font-black text-neutral-900 dark:text-white text-xs truncate block">
                      {showtime.location || "FilmZone SenSok"}
                    </strong>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[9px]">
                      Seat
                    </span>
                    <strong className="font-black text-neutral-900 dark:text-white text-xs truncate block">
                      {seatIds}
                    </strong>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[9px]">
                      Price/Seat
                    </span>
                    <strong className="font-black text-neutral-900 dark:text-white text-xs">
                      ${Number(pricePerSeat).toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[9px]">
                      Total ({seatCount} {seatCount === 1 ? "Seat" : "Seats"})
                    </span>
                    <strong className="font-black text-[#B90101] text-xs">
                      $
                      {hasConcessions
                        ? ticketCostOnly.toFixed(2)
                        : Number(totalPrice).toFixed(2)}
                    </strong>
                  </div>
                </div>

                {/* Food & Drinks Breakdown (if present) */}
                {hasConcessions && (
                  <div className="pt-1.5 mt-1.5 border-t border-dashed border-neutral-200 dark:border-(--border-dark-mode) space-y-0.5 text-[10px]">
                    <span className="font-bold text-[#B90101] uppercase tracking-wider text-[9px] block">
                      Food & Drinks
                    </span>
                    {concessions.map((c, idx) => (
                      <div
                        key={c.id || idx}
                        className="flex items-center justify-between text-neutral-700 dark:text-neutral-300 font-semibold text-[10px]"
                      >
                        <span>
                          {c.name} x{c.quantity}
                        </span>
                        <span className="font-bold">
                          ${((c.price || 0) * (c.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-0.5 font-black text-neutral-900 dark:text-white text-[10px]">
                      <span>Total Paid</span>
                      <span className="text-[#B90101]">
                        ${Number(totalPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Barcode SVG */}
              <div className="flex flex-col items-center justify-center space-y-0.5 pt-0.5">
                <svg
                  className="h-6 sm:h-7 w-32 sm:w-36 text-neutral-900 dark:text-neutral-100"
                  viewBox="0 0 160 40"
                  fill="currentColor"
                >
                  <rect x="0" y="0" width="3" height="40" />
                  <rect x="5" y="0" width="1.5" height="40" />
                  <rect x="9" y="0" width="4" height="40" />
                  <rect x="16" y="0" width="2" height="40" />
                  <rect x="20" y="0" width="5" height="40" />
                  <rect x="28" y="0" width="2" height="40" />
                  <rect x="32" y="0" width="1" height="40" />
                  <rect x="35" y="0" width="4" height="40" />
                  <rect x="41" y="0" width="2" height="40" />
                  <rect x="45" y="0" width="5" height="40" />
                  <rect x="53" y="0" width="2" height="40" />
                  <rect x="57" y="0" width="3" height="40" />
                  <rect x="62" y="0" width="1.5" height="40" />
                  <rect x="65" y="0" width="5" height="40" />
                  <rect x="73" y="0" width="2" height="40" />
                  <rect x="77" y="0" width="4" height="40" />
                  <rect x="83" y="0" width="2" height="40" />
                  <rect x="87" y="0" width="1" height="40" />
                  <rect x="90" y="0" width="5" height="40" />
                  <rect x="97" y="0" width="3" height="40" />
                  <rect x="102" y="0" width="2" height="40" />
                  <rect x="106" y="0" width="4" height="40" />
                  <rect x="112" y="0" width="2" height="40" />
                  <rect x="116" y="0" width="5" height="40" />
                  <rect x="123" y="0" width="2" height="40" />
                  <rect x="127" y="0" width="1" height="40" />
                  <rect x="130" y="0" width="4" height="40" />
                  <rect x="136" y="0" width="3" height="40" />
                  <rect x="141" y="0" width="5" height="40" />
                  <rect x="148" y="0" width="2" height="40" />
                  <rect x="152" y="0" width="4" height="40" />
                  <rect x="158" y="0" width="2" height="40" />
                </svg>
                <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-neutral-500 uppercase">
                  BOOKING NO : {bookingRef}
                </span>
              </div>
            </div>

            {/* Bottom Red Footer */}
            <div className="bg-[#B90101] text-white py-1.5 sm:py-2 px-3 flex items-center justify-center gap-1.5 shrink-0">
              <div className="w-5 h-5 rounded-full bg-white text-[#B90101] flex items-center justify-center shrink-0 shadow-xs">
                <Ticket className="w-3 h-3 text-[#B90101]" />
              </div>
              <div className="flex flex-col leading-none text-left">
                <span className="font-black text-[10px] sm:text-[11px] tracking-wider uppercase">
                  FilmZone
                </span>
                <span className="text-[7px] sm:text-[8px] font-bold tracking-widest uppercase opacity-90">
                  Cinema
                </span>
              </div>
            </div>
          </div>

          {/* ──────────────── RIGHT CARD: QR Ticket Pass ──────────────── */}
          <div
            className="w-full rounded-2xl border border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)] bg-[var(--primary-color-5)] dark:bg-[var(--primary-color-30)] backdrop-blur-md shadow-md overflow-hidden flex flex-col justify-between"
            style={{
              backgroundColor: isDark
                ? "var(--primary-color-30)"
                : "var(--primary-color-5)",
              borderColor: isDark
                ? "var(--border-dark-mode)"
                : "var(--border-light-mode)",
            }}
          >
            {/* Top 3 Red Badges */}
            <div className="p-3 pb-1 shrink-0">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#B90101] text-white py-1 px-1 rounded-lg text-center shadow-xs">
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider opacity-85 block">
                    Hall
                  </span>
                  <strong className="text-xs sm:text-sm font-black block">
                    {hallNumberOnly}
                  </strong>
                </div>

                <div className="bg-[#B90101] text-white py-1 px-1 rounded-lg text-center shadow-xs">
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider opacity-85 block">
                    Format
                  </span>
                  <strong className="text-xs sm:text-sm font-black truncate block">
                    {formatBadge}
                  </strong>
                </div>

                <div className="bg-[#B90101] text-white py-1 px-1 rounded-lg text-center shadow-xs">
                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider opacity-85 block">
                    Seat
                  </span>
                  <strong className="text-xs sm:text-sm font-black truncate block">
                    {seatIds}
                  </strong>
                </div>
              </div>
            </div>

            {/* Perforated Ticket Tear Line with Notches */}
            <div className="relative flex items-center justify-center my-1.5 shrink-0">
              <div
                className="absolute -left-2 w-4 h-4 rounded-full border-r border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)]"
                style={{
                  backgroundColor: isDark
                    ? "var(--primary-color-30)"
                    : "rgba(255, 255, 255, 0.8)",
                }}
              />
              <div className="w-full border-b border-dashed border-neutral-300 dark:border-neutral-700" />
              <div
                className="absolute -right-2 w-4 h-4 rounded-full border-l border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)]"
                style={{
                  backgroundColor: isDark
                    ? "var(--primary-color-30)"
                    : "rgba(255, 255, 255, 0.8)",
                }}
              />
            </div>

            {/* Card Body: QR Code matching Booking Successful card */}
            <div className="p-3 pt-1 pb-3 flex flex-col items-center justify-center text-center space-y-2 flex-1">
              <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                Scan at the cinema entrance
              </span>

              {/* Scannable Lucide QR Code matching Booking Successful */}
              <div className="p-2 sm:p-2.5 bg-white rounded-2xl shadow-xs border border-[var(--border-light-mode)] text-neutral-900 flex items-center justify-center">
                <QrCode
                  className="w-24 h-24 sm:w-28 sm:h-28 text-neutral-900"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Bottom Red Footer */}
            <div className="bg-[#B90101] text-white py-1.5 sm:py-2 px-3 flex items-center justify-center gap-1.5 shrink-0">
              <div className="w-5 h-5 rounded-full bg-white text-[#B90101] flex items-center justify-center shrink-0 shadow-xs">
                <Ticket className="w-3 h-3 text-[#B90101]" />
              </div>
              <div className="flex flex-col leading-none text-left">
                <span className="font-black text-[10px] sm:text-[11px] tracking-wider uppercase">
                  FilmZone
                </span>
                <span className="text-[7px] sm:text-[8px] font-bold tracking-widest uppercase opacity-90">
                  Cinema
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Centered Download Button */}
        <div className="mt-3 sm:mt-3.5 flex justify-center">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="py-2 px-8 rounded-full bg-[#B90101] hover:bg-[#8B0101] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition active:scale-95 cursor-pointer"
          >
            Download Tickets [PDF]
          </button>
        </div>
      </div>
    </div>
  );
}
