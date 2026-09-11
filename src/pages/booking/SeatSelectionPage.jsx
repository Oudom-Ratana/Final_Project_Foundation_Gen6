import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Clock, ArrowLeft, Sparkles, Layers } from "lucide-react";
import {
  toggleSeat,
  clearSeats,
  selectSelectedSeats,
  setShowtime,
  setMovie,
} from "../../redux/slices/bookingSlice";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Query Parameters
  const movieId = searchParams.get("movie") || searchParams.get("movieId") || "558449";
  const initialHall = (searchParams.get("hall") || searchParams.get("type") || "standard").toLowerCase();
  const time = searchParams.get("time") || "03:00 PM";
  const branch = searchParams.get("branch") || "FilmZone SenSok";
  const date = searchParams.get("date") || "Aug 26 Tue";

  // Hall Mode: 'gold' vs 'standard'
  const isGoldClass = initialHall.includes("gold");
  const [hallType, setHallType] = useState(isGoldClass ? "gold" : "standard");

  useEffect(() => {
    setHallType(isGoldClass ? "gold" : "standard");
  }, [isGoldClass]);

  // Fetch movie details
  const { data: movie } = useGetMovieDetailsQuery(movieId, { skip: !movieId });

  // Redux Selected Seats
  const selectedSeats = useSelector(selectSelectedSeats);

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
      })
    );
  };

  // Total price calculation
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((acc, seat) => acc + (seat.price || 0), 0);
  }, [selectedSeats]);

  // Hall Switcher
  const handleSwitchHall = (newType) => {
    setHallType(newType);
    dispatch(clearSeats());
    const newParams = new URLSearchParams(searchParams);
    newParams.set("hall", newType);
    setSearchParams(newParams);
  };

  // Proceed to Booking Details
  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    if (movie) {
      dispatch(setMovie(movie));
      dispatch(
        setShowtime({
          time,
          branch,
          date,
          hall: hallType === "gold" ? "Hall 4 - Gold Class VIP" : "Hall 1 - Standard 2D",
          hallType,
        })
      );
    }
    alert(
      `Proceeding to Booking Details for seats: ${selectedSeats.map((s) => s.id).join(", ")} | Total: $${totalPrice.toFixed(2)}`
    );
  };

  return (
    <div className="relative min-h-screen w-full pb-28 font-sans select-none overflow-x-hidden">
      {/* Deep Red Radial Glow Background for Dark Mode */}
      <div className="pointer-events-none absolute inset-0 -top-10 z-0 overflow-hidden">
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[750px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.22)_0%,rgba(8,2,3,0)_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 space-y-8 pt-2">
        {/* Top Navigation & Hall Switcher */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#B90101] dark:hover:text-[#B90101] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Hall Switcher Pills */}
          <div className="flex items-center p-1 rounded-full bg-neutral-200 dark:bg-white/10 border border-neutral-300 dark:border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleSwitchHall("standard")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                hallType === "standard"
                  ? "bg-[#B90101] text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Standard Hall</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchHall("gold")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                hallType === "gold"
                  ? "bg-[#B90101] text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gold Class VIP</span>
            </button>
          </div>
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
        <div className="w-full rounded-[2rem] sm:rounded-[2.5rem] border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#12080A]/90 backdrop-blur-md p-5 sm:p-10 shadow-xl overflow-x-auto">
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
