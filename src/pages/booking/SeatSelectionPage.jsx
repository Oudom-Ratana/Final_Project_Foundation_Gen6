import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Clock, ArrowLeft } from "lucide-react";
import {
  toggleSeat,
  selectSelectedSeats,
  setShowtime,
  setMovie,
} from "../../redux/slices/bookingSlice";
import { selectTheme } from "../../redux/slices/uiSlice";
import { useGetMovieDetailsQuery } from "../../services/api/movieApi";

// Modular Subcomponents & Data
import BookingStepper from "../../components/booking/BookingStepper";
import ScreenCurve from "../../components/booking/ScreenCurve";
import SeatLegend from "../../components/booking/SeatLegend";
import SeatPricingCards from "../../components/booking/SeatPricingCards";
import BookingCheckoutBar from "../../components/booking/BookingCheckoutBar";
import GoldClassSeatMap from "../../components/booking/GoldClassSeatMap";
import StandardHallSeatMap from "../../components/booking/StandardHallSeatMap";
import {
  GOLD_PRICE,
  STANDARD_SINGLE_PRICE,
  STANDARD_COUPLE_PRICE,
  DEFAULT_GOLD_RESERVED,
  DEFAULT_STANDARD_RESERVED,
  getCouplePair,
} from "../../data/seatLayoutData";

export default function SeatSelectionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Query Parameters
  const movieId =
    searchParams.get("movie") || searchParams.get("movieId") || "558449";
  const time = searchParams.get("time") || "03:00 PM";
  const branch = searchParams.get("branch") || "FilmZone SenSok";
  const date = searchParams.get("date") || "Aug 26 Tue";

  // Hall Mode: 'gold' vs 'standard' — determined solely by URL param set in ShowtimeSection
  const hallType = (
    searchParams.get("hall") ||
    searchParams.get("type") ||
    "standard"
  )
    .toLowerCase()
    .includes("gold")
    ? "gold"
    : "standard";

  // Fetch movie details
  const { data: movie } = useGetMovieDetailsQuery(movieId, { skip: !movieId });

  // Redux Selected Seats & Theme
  const selectedSeats = useSelector(selectSelectedSeats);
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  // 3-Minute Countdown Timer
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Seat Checks
  const isSeatSelected = (seatId) => selectedSeats.some((s) => s.id === seatId);

  const isSeatReserved = (seatId) => {
    if (hallType === "gold") return DEFAULT_GOLD_RESERVED.has(seatId);
    return DEFAULT_STANDARD_RESERVED.has(seatId);
  };

  // Interactive Click Handler
  const handleSeatClick = (row, colNumber, isCouple = false) => {
    if (isCouple) {
      const pair = getCouplePair(colNumber);
      if (!pair) return;
      const [col1, col2] = pair;
      const seatId1 = `${row}${col1}`;
      const seatId2 = `${row}${col2}`;

      // If either seat in the pair is reserved, cannot select
      if (isSeatReserved(seatId1) || isSeatReserved(seatId2)) return;

      const is1Selected = isSeatSelected(seatId1);
      const is2Selected = isSeatSelected(seatId2);
      const bothSelected = is1Selected && is2Selected;

      const seat1Obj = {
        id: seatId1,
        row,
        number: col1,
        type: "couple",
        price: STANDARD_COUPLE_PRICE / 2,
      };
      const seat2Obj = {
        id: seatId2,
        row,
        number: col2,
        type: "couple",
        price: STANDARD_COUPLE_PRICE / 2,
      };

      if (bothSelected) {
        // Deselect both
        dispatch(toggleSeat(seat1Obj));
        dispatch(toggleSeat(seat2Obj));
      } else {
        // Select both seats together
        if (!is1Selected) dispatch(toggleSeat(seat1Obj));
        if (!is2Selected) dispatch(toggleSeat(seat2Obj));
      }
      return;
    }

    // Normal single seat toggle
    const seatId = `${row}${colNumber}`;
    if (isSeatReserved(seatId)) return;

    const seatPrice = hallType === "gold" ? GOLD_PRICE : STANDARD_SINGLE_PRICE;

    dispatch(
      toggleSeat({
        id: seatId,
        row,
        number: colNumber,
        type: hallType === "gold" ? "gold" : "single",
        price: seatPrice,
      }),
    );
  };

  // Total price calculation
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((acc, seat) => acc + (seat.price || 0), 0);
  }, [selectedSeats]);

  // Proceed to Booking Details
  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    if (movie) {
      dispatch(setMovie(movie));
    }
    dispatch(
      setShowtime({
        time,
        branch,
        date,
        hall:
          hallType === "gold"
            ? "Hall 4 - Gold Class VIP"
            : "Hall 3 - Regular 2D",
        hallType,
      }),
    );
    const params = new URLSearchParams(searchParams);
    navigate(`/booking/details?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen w-full pb-28 font-sans select-none overflow-x-hidden">
      {/* Deep Red Radial Glow Background for Dark Mode */}
      <div className="pointer-events-none absolute inset-0 -top-10 z-0 overflow-hidden">
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[750px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.22)_0%,rgba(8,2,3,0)_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 space-y-8 pt-2">
        {/* Top Navigation */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#B90101] dark:hover:text-[#B90101] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* 1. Top 4-Step Stepper */}
        <BookingStepper currentStep={2} />

        {/* 2. Sub-header: "Select Seat(s)" + Live Countdown Timer */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <h1 className="text-base sm:text-lg font-black text-[#B90101] tracking-tight">
              Select Seat(s)
            </h1>
            {movie?.title && (
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {movie.title} • {branch} • {time}
              </p>
            )}
          </div>

          {/* Timer Pill */}
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#B90101] text-[#B90101] font-bold text-xs sm:text-sm bg-[#B90101]/5 shadow-xs">
            <Clock className="w-4 h-4 text-[#B90101]" />
            <span className="tracking-wider">{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* 3. Curved "Screen" Arc */}
        <ScreenCurve />

        {/* 4. Main Seating Pod */}
        <div
          className="w-full rounded-2xl sm:rounded-3xl border p-6 sm:p-10 shadow-sm overflow-x-auto backdrop-blur-md"
          style={{
            backgroundColor: isDark
              ? "var(--primary-color-30)"
              : "var(--primary-color-5)",
            borderColor: isDark
              ? "var(--border-dark-mode)"
              : "var(--border-light-mode)",
          }}
        >
          {hallType === "gold" ? (
            <GoldClassSeatMap
              isSeatReserved={isSeatReserved}
              isSeatSelected={isSeatSelected}
              onSeatClick={handleSeatClick}
            />
          ) : (
            <StandardHallSeatMap
              isSeatReserved={isSeatReserved}
              isSeatSelected={isSeatSelected}
              onSeatClick={handleSeatClick}
            />
          )}
        </div>

        {/* 5. Legend: Available, Selected, Reserved */}
        <SeatLegend />

        {/* 6. Pricing Cards */}
        <SeatPricingCards hallType={hallType} />

        {/* 7. Floating Checkout Bar */}
        <BookingCheckoutBar
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          onProceed={handleProceed}
        />
      </div>
    </div>
  );
}
