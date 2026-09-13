import { useSearchParams, Link } from "react-router";
import { useSelector } from "react-redux";
import { CheckCircle2, QrCode } from "lucide-react";
import {
  selectSelectedSeats,
  selectBooking,
} from "../../redux/slices/bookingSlice";
import { useGetMovieDetailsQuery } from "../../services/api/movieApi";
import BookingStepper from "../../components/booking/BookingStepper";

export default function BookingConfirmedPage() {
  const [searchParams] = useSearchParams();

  // URL & Redux State
  const movieId =
    searchParams.get("movie") || searchParams.get("movieId") || "558449";
  const hallType = (searchParams.get("hall") || "standard").toLowerCase();
  const time = searchParams.get("time") || "6:30 PM";
  const branch = searchParams.get("branch") || "FilmZone SenSok";
  const date = searchParams.get("date") || "26 Aug 2026";
  const bookingRef =
    searchParams.get("ref") ||
    `125273HJ${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: movieData } = useGetMovieDetailsQuery(movieId, {
    skip: !movieId,
  });

  const booking = useSelector(selectBooking);
  const reduxSelectedSeats = useSelector(selectSelectedSeats);

  const selectedSeats =
    reduxSelectedSeats.length > 0
      ? reduxSelectedSeats
      : [
          { id: "D8", price: 4.0, row: "D", number: 8 },
          { id: "D9", price: 4.0, row: "D", number: 9 },
        ];

  const concessions = booking.concessions || [];

  const movie = movieData ||
    booking.movie || {
      title: "Spider-Man: Brand New Day",
      poster_path: null,
    };

  const isGold = hallType.includes("gold");
  const hallNumber = isGold ? "Hall 4" : "Hall 3";
  const formatBadge = isGold ? "GOLD" : "3D";
  const seatIds = selectedSeats.map((s) => s.id).join(", ");
  const pricePerSeat = selectedSeats[0]?.price || 4.0;

  const ticketsTotal = selectedSeats.reduce(
    (acc, s) => acc + (s.price || 4.0),
    0,
  );
  const concessionsTotal = concessions.reduce(
    (acc, c) => acc + c.price * c.quantity,
    0,
  );
  const totalPaid = ticketsTotal + concessionsTotal;

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen w-full pb-24 font-sans select-none overflow-x-hidden">
      {/* Deep Red Radial Glow Background for Dark Mode */}
      <div className="pointer-events-none absolute inset-0 -top-10 z-0 overflow-hidden">
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[750px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.22)_0%,rgba(8,2,3,0)_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 space-y-6 pt-2">
        {/* 1. Stepper Bar (Step 4: Confirmed) */}
        <BookingStepper currentStep={4} />

        {/* 2. Payment Success Notification Badge */}
        <div className="flex items-center justify-center gap-2.5 py-2 px-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs sm:text-sm w-fit mx-auto shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Payment Successful! Your booking is confirmed.</span>
        </div>

        {/* 3. Main Ticket Area: 2 Cards Side-by-Side matching Figma media_1789310597338.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch pt-2">
          {/* ──────────────── LEFT CARD: Booking Summary ──────────────── */}
          <div className="flex flex-col items-center h-full space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight text-center">
              Booking Summary
            </h2>

            {/* Ticket Card */}
            <div className="w-full max-w-sm rounded-[2rem] border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#161A20] shadow-xl overflow-hidden flex flex-col justify-between flex-1">
              {/* Top Red Header */}
              <div className="bg-[#B90101] text-white py-3.5 text-center font-extrabold text-base sm:text-lg tracking-wider shrink-0">
                Movie Ticket
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Movie Poster & Title & Date/Time */}
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                          : "https://i.pinimg.com/736x/95/26/68/9526684fe11e38cf6bb6fbd48e37de6a.jpg"
                      }
                      alt={movie.title}
                      className="w-18 h-24 rounded-2xl object-cover shadow-md shrink-0 border border-neutral-200 dark:border-white/10"
                    />
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-extrabold text-base text-neutral-900 dark:text-white leading-snug">
                        {movie.title}
                      </h3>
                      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                        Date:{" "}
                        <span className="text-[#B90101] font-bold">{date}</span>
                      </p>
                      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                        Time:{" "}
                        <span className="text-[#B90101] font-bold">{time}</span>
                      </p>
                    </div>
                  </div>

                  {/* Perforated Ticket Tear Line with Notches */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className="absolute -left-9 w-6 h-6 rounded-full bg-[#F6F7F9] dark:bg-[#0E1217] border-r border-neutral-200 dark:border-white/10" />
                    <div className="w-full border-b-2 border-dashed border-neutral-300 dark:border-neutral-700" />
                    <div className="absolute -right-9 w-6 h-6 rounded-full bg-[#F6F7F9] dark:bg-[#0E1217] border-l border-neutral-200 dark:border-white/10" />
                  </div>

                  {/* 2-Column Metadata Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
                    <div>
                      <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[11px]">
                        Format
                      </span>
                      <strong className="font-black text-neutral-900 dark:text-white text-sm">
                        {formatBadge}
                      </strong>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[11px]">
                        Hall
                      </span>
                      <strong className="font-black text-neutral-900 dark:text-white text-sm">
                        {hallNumber}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[11px]">
                        Location
                      </span>
                      <strong className="font-black text-neutral-900 dark:text-white text-sm truncate block">
                        {branch}
                      </strong>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[11px]">
                        Seat
                      </span>
                      <strong className="font-black text-neutral-900 dark:text-white text-sm">
                        {seatIds}
                      </strong>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[11px]">
                        Price/Seat
                      </span>
                      <strong className="font-black text-neutral-900 dark:text-white text-sm">
                        ${pricePerSeat.toFixed(2)}
                      </strong>
                    </div>
                    <div>
                      <span className="font-bold text-neutral-400 uppercase tracking-wider block text-[11px]">
                        Total ({selectedSeats.length} Seats)
                      </span>
                      <strong className="font-black text-[#B90101] text-sm">
                        ${ticketsTotal.toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {/* Food & Drinks breakdown (if selected) */}
                  {concessions.length > 0 && (
                    <div className="pt-3 border-t border-dashed border-neutral-200 dark:border-white/10 space-y-1.5 text-xs">
                      <span className="font-bold text-[#B90101] uppercase tracking-wider text-[11px] block">
                        Food & Drinks
                      </span>
                      {concessions.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between text-neutral-700 dark:text-neutral-300 font-semibold"
                        >
                          <span>
                            {c.name} x{c.quantity}
                          </span>
                          <span className="font-bold">
                            ${(c.price * c.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-1 font-black text-neutral-900 dark:text-white">
                        <span>Total Paid</span>
                        <span className="text-[#B90101]">
                          ${totalPaid.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Barcode SVG */}
                <div className="flex flex-col items-center justify-center space-y-1 pt-2">
                  <svg
                    className="h-10 w-44 text-neutral-900 dark:text-neutral-100"
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
                  <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                    BOOKING NO : {bookingRef}
                  </span>
                </div>
              </div>

              {/* Bottom Red Footer */}
              <div className="bg-[#B90101] text-white py-3 px-6 flex items-center justify-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-full bg-white text-[#B90101] flex items-center justify-center font-black text-xs shrink-0">
                  B
                </div>
                <span className="font-extrabold text-xs tracking-wider uppercase">
                  FilmZone Cinema
                </span>
              </div>
            </div>

            {/* Back To Home Button Container */}
            <div className="w-full max-w-sm pt-2 flex justify-center">
              <Link
                to="/"
                className="w-full max-w-xs py-3 px-8 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-sm text-center uppercase tracking-wider transition active:scale-95 shadow-md border border-white/20 block"
              >
                Back To Home
              </Link>
            </div>
          </div>

          {/* ──────────────── RIGHT CARD: Booking Successful ──────────────── */}
          <div className="flex flex-col items-center h-full space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight text-center">
              Booking successful
            </h2>

            {/* Ticket Card */}
            <div className="w-full max-w-sm rounded-[2rem] border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#161A20] shadow-xl overflow-hidden flex flex-col justify-between flex-1">
              {/* Top 3 Red Badges */}
              <div className="p-5 pb-3 shrink-0">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-[#B90101] text-white py-2 px-2 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 block">
                      Hall
                    </span>
                    <strong className="text-sm font-black block">
                      {isGold ? "4" : "3"}
                    </strong>
                  </div>

                  <div className="bg-[#B90101] text-white py-2 px-2 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 block">
                      Format
                    </span>
                    <strong className="text-sm font-black block">
                      {formatBadge}
                    </strong>
                  </div>

                  <div className="bg-[#B90101] text-white py-2 px-2 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-85 block">
                      Seat
                    </span>
                    <strong className="text-xs sm:text-sm font-black truncate block">
                      {seatIds}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Perforated Ticket Tear Line with Notches */}
              <div className="relative flex items-center justify-center my-2 shrink-0">
                <div className="absolute -left-3.5 w-6 h-6 rounded-full bg-[#F6F7F9] dark:bg-[#0E1217] border-r border-neutral-200 dark:border-white/10" />
                <div className="w-full border-b-2 border-dashed border-neutral-300 dark:border-neutral-700" />
                <div className="absolute -right-3.5 w-6 h-6 rounded-full bg-[#F6F7F9] dark:bg-[#0E1217] border-l border-neutral-200 dark:border-white/10" />
              </div>

              {/* Card Body: QR Code vertically centered */}
              <div className="p-6 pt-2 pb-6 flex flex-col items-center justify-center text-center space-y-4 flex-1">
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                  Scan at the cinema entrance
                </span>

                {/* Giant Centered Scannable QR Code */}
                <div className="p-4 bg-white rounded-3xl shadow-sm border border-neutral-200/80 text-neutral-900 flex items-center justify-center">
                  <QrCode className="w-48 h-48 sm:w-52 sm:h-52" />
                </div>
              </div>

              {/* Bottom Red Footer */}
              <div className="bg-[#B90101] text-white py-3 px-6 flex items-center justify-center gap-2 shrink-0">
                <div className="w-5 h-5 rounded-full bg-white text-[#B90101] flex items-center justify-center font-black text-xs shrink-0">
                  B
                </div>
                <span className="font-extrabold text-xs tracking-wider uppercase">
                  FilmZone Cinema
                </span>
              </div>
            </div>

            {/* Download Tickets [PDF] Button Container */}
            <div className="w-full max-w-sm pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full max-w-xs py-3 px-8 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-sm text-center uppercase tracking-wider transition active:scale-95 shadow-md border border-white/20 block"
              >
                Download Tickets [PDF]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
