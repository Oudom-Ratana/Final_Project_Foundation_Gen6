import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle2, Ticket, Download, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { downloadTicketPdf, getSafePosterUrl, DEFAULT_POSTER_FALLBACK } from "../../utils/downloadTicketPdf";
import {
  selectSelectedSeats,
  selectBooking,
} from "../../redux/slices/bookingSlice";
import { addTicket } from "../../redux/slices/ticketSlice";
import { useGetMovieDetailsQuery } from "../../services/api/movieApi";
import { useGetTVDetailsQuery } from "../../services/api/tvApi";
import {
  useGetBookingQrCodeQuery,
  useGetBookingByUuidQuery,
  useGetCinemaMovieByUuidQuery,
  useGetShowtimeByUuidQuery,
} from "../../services/api/cinemaApi";
import BookingStepper from "../../components/booking/BookingStepper";
import { BRANCH_SHOWTIMES } from "../../data/cinemaShowtimeData";
import SEO from "../../components/common/SEO";

export default function BookingConfirmedPage() {
  const [searchParams] = useSearchParams();

  const movieId =
    searchParams.get("movie") || searchParams.get("movieId") || "558449";
  const hallType = (searchParams.get("hall") || "standard").toLowerCase();
  const time = searchParams.get("time") || "6:30 PM";
  const branch = searchParams.get("branch") || "FilmZone SenSok";
  const date = searchParams.get("date") || "26 Aug 2026";
  const rawBookingUuid = searchParams.get("bookingUuid");
  const bookingUuid =
    rawBookingUuid &&
    rawBookingUuid !== "undefined" &&
    rawBookingUuid !== "null" &&
    rawBookingUuid.length > 10
      ? rawBookingUuid
      : null;

  const { data: bookingData } = useGetBookingByUuidQuery(bookingUuid, {
    skip: !bookingUuid,
  });
  const isConfirmed = bookingData?.status === "CONFIRMED";

  const {
    data: ticketQrBlob,
    isLoading: isTicketQrLoading,
    isError: isTicketQrError,
  } = useGetBookingQrCodeQuery(bookingUuid, {
    skip: !bookingUuid || !isConfirmed,
  });
  const bookingRef =
    searchParams.get("ref") ||
    `125273HJ${Math.floor(1000 + Math.random() * 9000)}`;

  const booking = useSelector(selectBooking);
  const reduxMovie = booking?.movie;
  const isTV =
    searchParams.get("mediaType") === "tv" ||
    Boolean(
      reduxMovie?.first_air_date || (reduxMovie?.name && !reduxMovie?.title),
    );

  const isUuid = Boolean(movieId && movieId.includes("-"));
  const { data: cinemaMovie } = useGetCinemaMovieByUuidQuery(movieId, {
    skip: !movieId || !isUuid,
  });

  const isCurrentReduxMovie =
    reduxMovie &&
    (reduxMovie.uuid === movieId ||
      String(reduxMovie.id) === String(movieId) ||
      (cinemaMovie && reduxMovie.uuid === cinemaMovie.uuid));

  const { data: movieData } = useGetMovieDetailsQuery(movieId, {
    skip: !movieId || isTV || isUuid || Boolean(isCurrentReduxMovie),
  });
  const { data: tvData } = useGetTVDetailsQuery(movieId, {
    skip: !movieId || !isTV || isUuid || Boolean(isCurrentReduxMovie),
  });

  const reduxSelectedSeats = useSelector(selectSelectedSeats);

  const isGold = hallType.includes("gold");
  const hallNumber = isGold ? "Hall 4" : "Hall 3";
  const seatsParam = searchParams.get("seats");
  const concessionsParam = searchParams.get("concessions");

  const selectedSeats = useMemo(() => {
    if (reduxSelectedSeats && reduxSelectedSeats.length > 0) {
      return reduxSelectedSeats;
    }
    if (seatsParam) {
      const seatIds = seatsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const seatPrice = isGold ? 10.0 : 5.0;
      return seatIds.map((id) => {
        const row = id.charAt(0);
        const num = parseInt(id.slice(1), 10) || 1;
        return {
          id,
          row,
          number: num,
          type: isGold ? "gold" : "single",
          price: seatPrice,
        };
      });
    }
    return [
      { id: "A1", price: 5.0, row: "A", number: 1 },
      { id: "A2", price: 5.0, row: "A", number: 2 },
    ];
  }, [reduxSelectedSeats, seatsParam, isGold]);

  const concessions = useMemo(() => {
    if (booking.concessions && booking.concessions.length > 0) {
      return booking.concessions;
    }
    if (concessionsParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(concessionsParam));
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse concessions param", e);
      }
    }
    return [];
  }, [booking.concessions, concessionsParam]);

  const normalizedCinemaMovie = cinemaMovie
    ? {
        id: cinemaMovie.uuid,
        uuid: cinemaMovie.uuid,
        title: cinemaMovie.title,
        poster_path: cinemaMovie.posterUrl,
        backdrop_path: cinemaMovie.backdropUrl,
        overview: cinemaMovie.overview,
        runtime: cinemaMovie.runtimeMinutes,
        release_date: cinemaMovie.releaseDate,
      }
    : null;

  const movie = (isCurrentReduxMovie ? reduxMovie : null) ||
    normalizedCinemaMovie ||
    (isTV ? tvData : movieData || tvData) ||
    reduxMovie || {
      title: cinemaMovie?.title || "Movie Booking",
      poster_path: cinemaMovie?.posterUrl || null,
    };

  const rawScreenType =
    searchParams.get("screenType") || searchParams.get("format");

  const formatBadge = useMemo(() => {
    if (rawScreenType) return rawScreenType;
    if (booking.showtime?.screenType) return booking.showtime.screenType;

    const branchData = BRANCH_SHOWTIMES.find(
      (b) =>
        b.branchName.toLowerCase() === branch.toLowerCase() ||
        b.location.toLowerCase() === branch.toLowerCase(),
    );
    if (branchData) {
      for (const hall of branchData.halls) {
        if (hall.times.includes(time)) {
          return hall.screenType;
        }
      }
    }
    return isGold ? "GOLD" : "2D";
  }, [rawScreenType, booking.showtime, branch, time, isGold]);

    const showtimeUuidForMovie =
    searchParams.get("showtimeUuid") || booking.showtime?.showtimeUuid;
  const { data: showtimeForMovie } = useGetShowtimeByUuidQuery(showtimeUuidForMovie, {
    skip: !showtimeUuidForMovie,
  });

  const effectiveMovieUuid =
    (movieId && movieId.includes("-") ? movieId : null) ||
    showtimeForMovie?.movieUuid ||
    cinemaMovie?.uuid ||
    (reduxMovie?.uuid || (reduxMovie?.id && String(reduxMovie.id).includes("-") ? reduxMovie.id : null));

  const { data: directCinemaMovie } = useGetCinemaMovieByUuidQuery(effectiveMovieUuid, {
    skip: !effectiveMovieUuid,
  });

  const resolvedMovie = directCinemaMovie || cinemaMovie || movie;
  const movieTitle = resolvedMovie?.title || movie?.title || "Movie Booking";

  const rawPoster =
    resolvedMovie?.posterUrl ||
    resolvedMovie?.poster_path ||
    movie?.posterUrl ||
    movie?.poster_path ||
    reduxMovie?.posterUrl ||
    reduxMovie?.poster_path;

  const posterSrc = rawPoster
    ? rawPoster.startsWith("http")
      ? rawPoster
      : `https://image.tmdb.org/t/p/w500${rawPoster}`
    : resolvedMovie?.backdropUrl ||
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80";

  const seatIds = selectedSeats.map((s) => s.id).join(", ");
  const pricePerSeat = selectedSeats[0]?.price || (isGold ? 10.0 : 5.0);

  const ticketsTotal = selectedSeats.reduce(
    (acc, s) => acc + (s.price || (isGold ? 10.0 : 5.0)),
    0,
  );
  const concessionsTotal = concessions.reduce(
    (acc, c) => acc + (c.price || 0) * (c.quantity || 0),
    0,
  );
  const totalPaid = ticketsTotal + concessionsTotal;
  const displayTotal =
    bookingData?.totalPrice ??
    bookingData?.totalAmount ??
    (searchParams.get('total') ? Number(searchParams.get('total')) : null) ??
    (searchParams.get('amount') ? Number(searchParams.get('amount')) : null) ??
    totalPaid;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!bookingRef) return;

    const runtimeMinutes = movie?.runtime || 135;
    const durationStr = `${Math.floor(runtimeMinutes / 60)}h ${runtimeMinutes % 60}m`;

    const genreList = movie?.genres
      ? Array.isArray(movie.genres) && typeof movie.genres[0] === "object"
        ? movie.genres.map((g) => g.name)
        : movie.genres
      : ["Action", "Adventure"];

    const posterUrl = posterSrc;

    const viewUrl = `/booking/confirmed?movie=${movieId}&hall=${hallType}&screenType=${encodeURIComponent(formatBadge)}&time=${encodeURIComponent(time)}&date=${encodeURIComponent(date)}&branch=${encodeURIComponent(branch)}&ref=${bookingRef}`;

    const newTicket = {
      id: bookingRef,
      status: "upcoming",
      movieId,
      movie: {
        title: movie?.title || "Movie Ticket",
        poster: posterUrl,
        duration: durationStr,
        genres: genreList,
      },
      showtime: {
        date,
        time,
        format: formatBadge,
        hall: hallNumber,
        location: branch,
      },
      seats: selectedSeats.map((s) => s.id),
      pricePerSeat,
      totalSeats: selectedSeats.length,
      totalPrice: totalPaid,
      concessions,
      bookingRef,
      viewUrl,
      createdAt: new Date().toISOString(),
    };

    dispatch(addTicket(newTicket));
  }, [
    bookingRef,
    movie,
    movieId,
    hallType,
    time,
    date,
    branch,
    formatBadge,
    hallNumber,
    selectedSeats,
    pricePerSeat,
    totalPaid,
    concessions,
    dispatch,
    posterSrc,
  ]);

  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!ticketRef.current) return;
    try {
      setIsDownloading(true);
      await downloadTicketPdf(ticketRef.current, bookingRef);
      toast.success("Ticket PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF download failed:", err);
      toast.error("Failed to download ticket. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full pb-24 font-sans select-none overflow-x-hidden">
      <SEO
        title="Booking Confirmed | FilmZone"
        description="Your cinema tickets are confirmed! Download your ticket pass and enjoy your movie."
        url="/booking/confirmed"
      />
      <div className="pointer-events-none absolute inset-0 -top-10 z-0 overflow-hidden">
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[750px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.22)_0%,rgba(8,2,3,0)_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 space-y-6 pt-2">
        <BookingStepper currentStep={4} />

        <div className="flex items-center justify-center gap-2.5 py-2 px-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs sm:text-sm w-fit mx-auto shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Payment Successful! Your booking is confirmed.</span>
        </div>

        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-center max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              Booking Summary
            </h2>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight hidden md:block">
              Booking Successful
            </h2>
          </div>

          <div
            ref={ticketRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch justify-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center h-full">
              <div className="w-full max-w-sm rounded-[2rem] border border-neutral-200 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] bg-white shadow-xl overflow-hidden flex flex-col justify-between flex-1">
              <div className="bg-[#B90101] text-white py-3.5 text-center font-extrabold text-base sm:text-lg tracking-wider shrink-0">
                Movie Ticket
              </div>

              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={getSafePosterUrl(posterSrc)}
                      alt={movieTitle}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_POSTER_FALLBACK;
                      }}
                      className="w-18 h-24 rounded-2xl object-cover shadow-md shrink-0 border border-neutral-200 dark:border-(--border-dark-mode)"
                    />
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-extrabold text-base text-neutral-900 dark:text-white leading-snug">
                        {movieTitle}
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

                  <div className="relative flex items-center justify-center my-4">
                    <div className="absolute -left-9 w-6 h-6 rounded-full bg-[#F6F7F9] dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] border-r border-neutral-200 " />
                    <div className="w-full border-b-2 border-dashed border-neutral-300 dark:border-neutral-700" />
                    <div className="absolute -right-9 w-6 h-6 rounded-full bg-[#F6F7F9] dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] border-l border-neutral-200 " />
                  </div>

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

                  {concessions.length > 0 && (
                    <div className="pt-3 border-t border-dashed border-neutral-200 dark:border-(--border-dark-mode) space-y-1.5 text-xs">
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

              <div className="bg-[#B90101] text-white py-3 px-6 flex items-center justify-center gap-2.5 shrink-0">
                <div className="w-6 h-6 rounded-full bg-white text-[#B90101] flex items-center justify-center shrink-0 shadow-xs">
                  <Ticket className="w-3.5 h-3.5 text-[#B90101]" />
                </div>
                <div className="flex flex-col leading-none text-left">
                  <span className="font-black text-xs tracking-wider uppercase">
                    FilmZone
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase opacity-90">
                    Cinema
                  </span>
                </div>
              </div>
            </div>
            </div>

            <div className="flex justify-center h-full">
              <div className="w-full max-w-sm rounded-[2rem] border border-neutral-200 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] bg-white  shadow-xl overflow-hidden flex flex-col justify-between flex-1">
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

              <div className="relative flex items-center justify-center my-2 shrink-0">
                <div className="absolute -left-3.5 w-6 h-6 rounded-full bg-white dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] border-r border-neutral-200 " />
                <div className="w-full border-b-2 border-dashed border-neutral-300 dark:border-neutral-700" />
                <div className="absolute -right-3.5 w-6 h-6 rounded-full bg-white dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] border-l border-neutral-200 " />
              </div>

              <div className="p-6 pt-2 pb-6 flex flex-col items-center justify-center text-center space-y-4 flex-1">
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                  Scan at the cinema entrance
                </span>

                <div className="p-4 bg-white rounded-3xl shadow-sm border border-neutral-200/80 text-neutral-900 flex items-center justify-center min-h-[210px] min-w-[210px]">
                  {isTicketQrLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-2 text-neutral-400">
                      <div className="w-8 h-8 rounded-full border-3 border-[#B90101] border-t-transparent animate-spin" />
                      <span className="text-xs font-bold">Loading Pass...</span>
                    </div>
                  ) : ticketQrBlob && !isTicketQrError ? (
                    <img
                      src={ticketQrBlob}
                      alt={`Ticket QR for ${bookingRef}`}
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                    />
                  ) : (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                        `FILMZONE-PASS:${bookingRef}`,
                      )}`}
                      alt={`Ticket QR for ${bookingRef}`}
                      className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="bg-[#B90101] text-white py-3 px-6 flex items-center justify-between shrink-0">
                <span className="text-xs font-extrabold uppercase tracking-wider text-white/90">
                  Total Amount
                </span>
                <span className="text-base sm:text-lg font-black tracking-wide text-white">
                  ${(Number(displayTotal) || 0).toFixed(2)}
                </span>
              </div>
            </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/my-tickets"
              className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-full bg-neutral-800 hover:bg-neutral-900 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white font-extrabold text-sm text-center uppercase tracking-wider transition active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Go to My Tickets</span>
            </Link>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full sm:w-auto min-w-[240px] py-3.5 px-8 rounded-full bg-[#B90101] hover:bg-[#9E0000] disabled:opacity-75 disabled:cursor-not-allowed text-white font-extrabold text-sm text-center uppercase tracking-wider transition active:scale-95 shadow-md border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Tickets [PDF]</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
