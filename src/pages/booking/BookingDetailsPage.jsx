import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Clock, CheckCircle2, Lock } from "lucide-react";
import {
  selectSelectedSeats,
  selectBooking,
  setSelectedSeats,
  setBookingConfirmation,
  setMovie,
  clearSeats,
  clearConcessions,
} from "../../redux/slices/bookingSlice";
import { selectTheme } from "../../redux/slices/uiSlice";
import {
  useCreateBookingMutation,
  useCreatePaymentMutation,
  useGetCinemaMovieByUuidQuery,
  useReleaseHoldMutation,
  useUpsertBookingConcessionOrderMutation,
  useRemoveBookingConcessionOrderMutation,
  useAttachMemberBookingMutation,
  useMarkMemberReadyMutation,
  useMarkMemberSelectingMutation,
  useLockGroupBookingMutation,
  useCreateGroupPaymentMutation,
  useGetGroupBookingByUuidQuery,
  useGetGroupMembersQuery,
} from "../../services/api/cinemaApi";
import BookingStepper from "../../components/booking/BookingStepper";
import PaymentKhqrModal from "../../components/booking/PaymentKhqrModal";
import BookingFoodDrinksSelector from "../../components/booking/BookingFoodDrinksSelector";
import BookingSummaryCard from "../../components/booking/BookingSummaryCard";
import BookingSquadLobbyCard from "../../components/booking/BookingSquadLobbyCard";

export default function BookingDetailsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  const glassCardStyle = {
    backgroundColor: isDark ? "var(--primary-color-30)" : "white",
    borderColor: isDark ? "var(--border-dark-mode)" : "var(--border-light-mode)",
  };

  const movieId = searchParams.get("movie") ?? searchParams.get("movieId");
  const hallType = (searchParams.get("hall") ?? "standard").toLowerCase();
  const time = searchParams.get("time") ?? "06:30 PM";
  const branch = searchParams.get("branch") ?? "FilmZone SenSok";
  const date = searchParams.get("date") ?? "Sat, 6 Sep";

  const booking = useSelector(selectBooking);
  const reduxMovie = booking?.movie;

  const isUuid = Boolean(movieId && movieId.includes("-"));
  const { data: cinemaMovie } = useGetCinemaMovieByUuidQuery(movieId, {
    skip: !movieId || !isUuid,
  });

  const normalizedCinemaMovie = useMemo(() => {
    if (!cinemaMovie) return null;
    return {
      id: cinemaMovie.uuid,
      uuid: cinemaMovie.uuid,
      title: cinemaMovie.title,
      posterUrl: cinemaMovie.posterUrl,
      poster_path: cinemaMovie.posterUrl,
      backdropUrl: cinemaMovie.backdropUrl,
      backdrop_path: cinemaMovie.backdropUrl,
      overview: cinemaMovie.overview,
      runtime: cinemaMovie.runtimeMinutes,
      releaseDate: cinemaMovie.releaseDate,
    };
  }, [cinemaMovie]);

  const movie = normalizedCinemaMovie ?? reduxMovie ?? {
    title: cinemaMovie?.title ?? "Movie Booking",
    posterUrl: cinemaMovie?.posterUrl ?? null,
  };

  useEffect(() => {
    if (normalizedCinemaMovie && reduxMovie?.uuid !== normalizedCinemaMovie.uuid) {
      dispatch(setMovie(normalizedCinemaMovie));
    }
  }, [normalizedCinemaMovie, reduxMovie, dispatch]);

  const reduxSelectedSeats = useSelector(selectSelectedSeats);
  const seatsParam = searchParams.get("seats");

  const selectedSeats = useMemo(() => {
    if (reduxSelectedSeats && reduxSelectedSeats.length > 0) {
      return reduxSelectedSeats;
    }
    if (seatsParam) {
      const seatIds = seatsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const seatPrice = hallType.includes("gold") ? 10.0 : 5.0;
      return seatIds.map((id) => {
        const row = id.charAt(0);
        const num = parseInt(id.slice(1), 10) || 1;
        return {
          id,
          row,
          number: num,
          type: hallType.includes("gold") ? "gold" : "single",
          price: seatPrice,
        };
      });
    }
    return [
      { id: "A1", price: 5.0, row: "A", number: 1 },
      { id: "A2", price: 5.0, row: "A", number: 2 },
    ];
  }, [reduxSelectedSeats, seatsParam, hallType]);

  useEffect(() => {
    if ((!reduxSelectedSeats || reduxSelectedSeats.length === 0) && selectedSeats.length > 0) {
      dispatch(setSelectedSeats(selectedSeats));
    }
  }, [reduxSelectedSeats, selectedSeats, dispatch]);

  const concessions = useMemo(() => booking.concessions ?? [], [booking.concessions]);
  const resolvedScreenType = searchParams.get("screenType") ?? searchParams.get("format") ?? (hallType.includes("gold") ? "GOLD" : "2D");
  const hallNumber = hallType.includes("gold") ? "Hall 4" : "Hall 3";
  const hallName = `${resolvedScreenType} ${hallNumber}`;

  const ticketsTotal = selectedSeats.reduce((acc, s) => acc + (s.price ?? 4.0), 0);
  const concessionsTotal = concessions.reduce((acc, c) => acc + c.price * c.quantity, 0);
  const totalPaid = ticketsTotal + concessionsTotal;

  const showtimeUuid = searchParams.get("showtimeUuid") ?? booking.showtime?.showtimeUuid;
  const holdId = searchParams.get("holdId") ?? location.state?.holdId ?? booking.showtime?.holdId;
  const initialExpiresIn = parseInt(searchParams.get("expiresIn"), 10) || location.state?.expiresInSeconds || 300;

  const [createBooking, { isLoading: isCreatingBooking }] = useCreateBookingMutation();
  const [releaseHold] = useReleaseHoldMutation();
  const [timeLeft, setTimeLeft] = useState(initialExpiresIn);
  const [hasExpired, setHasExpired] = useState(false);

  const handleExpiry = useCallback(() => {
    const paramBookingUuid = searchParams.get("bookingUuid");
    if (showtimeUuid && holdId && !paramBookingUuid) {
      releaseHold({ showtimeUuid, holdId }).unwrap().catch(() => {});
    }
    dispatch(clearSeats());
    dispatch(clearConcessions());
    toast.warn("Your 5-minute seat hold has expired. Please select your seats again.");
    const params = new URLSearchParams(searchParams);
    params.delete("holdId");
    params.delete("expiresIn");
    params.delete("seats");
    params.delete("seatUuids");
    params.delete("bookingUuid");
    params.delete("ref");
    navigate(`/booking/seats?${params.toString()}`, { replace: true });
  }, [searchParams, showtimeUuid, holdId, releaseHold, dispatch, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!hasExpired) {
        setHasExpired(true);
        handleExpiry();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, hasExpired, handleExpiry]);

  const handleBack = () => {
    const paramBookingUuid = searchParams.get("bookingUuid");
    if (showtimeUuid && holdId && !paramBookingUuid) {
      releaseHold({ showtimeUuid, holdId }).unwrap().catch(() => {});
    }
    dispatch(clearSeats());
    dispatch(clearConcessions());
    const params = new URLSearchParams(searchParams);
    params.delete("holdId");
    params.delete("expiresIn");
    params.delete("seats");
    params.delete("seatUuids");
    params.delete("bookingUuid");
    params.delete("ref");
    navigate(`/booking/seats?${params.toString()}`, { replace: true });
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const groupUuid = searchParams.get("groupUuid");
  const isGroupMode = (searchParams.get("type") || "").toLowerCase() === "group" || Boolean(groupUuid);
  const currentUser = useSelector((state) => state.auth?.user);

  const [upsertBookingConcessionOrder] = useUpsertBookingConcessionOrderMutation();
  const [removeBookingConcessionOrder] = useRemoveBookingConcessionOrderMutation();
  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();
  const [attachMemberBooking] = useAttachMemberBookingMutation();
  const [markMemberReady, { isLoading: isMarkingReady }] = useMarkMemberReadyMutation();
  const [markMemberSelecting, { isLoading: isMarkingSelecting }] = useMarkMemberSelectingMutation();
  const [lockGroupBooking, { isLoading: isLockingGroup }] = useLockGroupBookingMutation();
  const [createGroupPayment, { isLoading: isCreatingGroupPayment }] = useCreateGroupPaymentMutation();

  const { data: groupBooking } = useGetGroupBookingByUuidQuery(groupUuid, {
    skip: !groupUuid,
    pollingInterval: 2500,
  });

  const { data: groupMembers = [] } = useGetGroupMembersQuery(groupUuid, {
    skip: !groupUuid,
    pollingInterval: 2500,
  });

  const isHost = Boolean(
    groupBooking &&
    currentUser &&
    [currentUser.uuid, currentUser.id].filter(Boolean).includes(groupBooking.hostUuid)
  );

  const [isMyBookingAttached, setIsMyBookingAttached] = useState(false);
  const [squadPaymentAmount, setSquadPaymentAmount] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isGroupPaymentActive, setIsGroupPaymentActive] = useState(false);
  const [activePaymentUuid, setActivePaymentUuid] = useState(null);
  const [activeBookingUuid, setActiveBookingUuid] = useState(null);
  const [activeBookingRef, setActiveBookingRef] = useState(null);

  const myMember = useMemo(() => {
    if (!Array.isArray(groupMembers) || !currentUser) return null;
    const userIds = [currentUser.uuid, currentUser.id].filter(Boolean);
    return groupMembers.find(
      (m) => userIds.includes(m.userUuid) || userIds.includes(m.uuid)
    );
  }, [groupMembers, currentUser]);

  const isMyReady = myMember?.status === "READY" || isMyBookingAttached;
  const readyCount = groupBooking?.readyCount ?? groupMembers.filter((m) => m.status === "READY").length;
  const totalMemberCount = Math.max(groupBooking?.memberCount ?? 0, groupMembers.length, 1);
  const isSquadReady = totalMemberCount <= 1 || readyCount >= (totalMemberCount - 1);

  const squadTicketsTotal = isGroupMode && isHost
    ? (totalMemberCount * (selectedSeats[0]?.price ?? 4.0))
    : ticketsTotal;
  const displayTotal = isGroupMode && isHost
    ? (squadPaymentAmount ?? (squadTicketsTotal + concessionsTotal))
    : totalPaid;

  const isSubmitting = [
    isCreatingBooking,
    isCreatingPayment,
    isMarkingReady,
    isLockingGroup,
    isCreatingGroupPayment,
  ].some(Boolean);

  const handleEditSelection = async () => {
    if (isGroupMode && groupUuid) {
      try {
        await markMemberSelecting(groupUuid).unwrap();
        setIsMyBookingAttached(false);
        toast.info("Status changed to SELECTING. You can adjust your snacks.");
      } catch (err) {
        console.warn("Change selecting note:", err);
      }
    }
  };

  const navigateToConfirmed = useCallback((bookingRef, bUuid) => {
    dispatch(setBookingConfirmation(bookingRef));
    const params = new URLSearchParams(searchParams);
    params.set("ref", bookingRef);
    if (bUuid && bUuid !== "undefined" && bUuid !== "null") {
      params.set("bookingUuid", bUuid);
    } else {
      params.delete("bookingUuid");
    }
    params.set("screenType", resolvedScreenType);
    params.set("seats", selectedSeats.map((s) => s.id).join(","));
    if (concessions.length > 0) {
      params.set("concessions", encodeURIComponent(JSON.stringify(concessions)));
    }
    navigate(`/booking/confirmed?${params.toString()}`);
  }, [dispatch, searchParams, resolvedScreenType, selectedSeats, concessions, navigate]);

  useEffect(() => {
    if (isGroupMode && !isHost && groupBooking?.status === "CONFIRMED") {
      toast.success("Host has completed group payment! Your booking is confirmed.");
      const resolvedRef =
        activeBookingRef ??
        `FZ-${(groupBooking?.uuid ?? "").slice(0, 8).toUpperCase()}`;
      navigateToConfirmed(resolvedRef, activeBookingUuid);
    }
  }, [
    groupBooking?.status,
    groupBooking?.uuid,
    isGroupMode,
    isHost,
    activeBookingRef,
    activeBookingUuid,
    navigateToConfirmed,
  ]);

  const handleContinue = async () => {
    try {
      const paramBookingUuid = searchParams.get("bookingUuid");
      let bookingUuid = paramBookingUuid && paramBookingUuid.length > 10 ? paramBookingUuid : null;
      let bookingRef = searchParams.get("ref");

      if (!bookingUuid && showtimeUuid && holdId) {
        const res = await createBooking({ showtimeUuid, holdId }).unwrap();
        bookingUuid =
          res?.uuid ??
          res?.bookingUuid ??
          res?.data?.uuid ??
          res?.data?.bookingUuid;
        bookingRef =
          res?.bookingReference ??
          res?.reference ??
          res?.ticketQrToken?.slice(0, 8)?.toUpperCase() ??
          `FZ-${(bookingUuid ?? "").slice(0, 8).toUpperCase()}`;
      }

      if (!bookingRef && bookingUuid) {
        bookingRef = `FZ-${bookingUuid.slice(0, 8).toUpperCase()}`;
      }

      if (bookingUuid) {
        const validConcessionItems = concessions
          .filter((c) => {
            const cid = String(c.uuid ?? c.id ?? "");
            return cid.includes("-");
          })
          .map((c) => ({
            concessionItemUuid: c.uuid ?? c.id,
            quantity: c.quantity,
          }));

        if (validConcessionItems.length > 0) {
          try {
            await upsertBookingConcessionOrder({
              bookingUuid,
              items: validConcessionItems,
            }).unwrap();
          } catch (concessionErr) {
            console.warn("Concession order sync note:", concessionErr);
          }
        } else {
          try {
            await removeBookingConcessionOrder(bookingUuid).unwrap();
          } catch {
          }
        }

        if (isGroupMode && groupUuid) {
          if (!isMyBookingAttached) {
            try {
              await attachMemberBooking({ groupUuid, bookingUuid }).unwrap();
              setIsMyBookingAttached(true);
              toast.success("Booking attached to squad!");
            } catch (attachErr) {
              console.warn("Attach booking note:", attachErr);
            }
          }

          if (!isHost) {
            try {
              await markMemberReady(groupUuid).unwrap();
              toast.success("You are marked as READY! Waiting for the host to complete squad payment.");
            } catch (readyErr) {
              toast.info(readyErr?.data?.message ?? "Status updated to ready.");
            }
            return;
          }

          try {
            await lockGroupBooking(groupUuid).unwrap();
            toast.info("Group locked for payment.");

            const groupPayRes = await createGroupPayment(groupUuid).unwrap();
            const paymentUuid = groupPayRes?.uuid ?? groupPayRes?.paymentUuid;
            if (groupPayRes?.amount) {
              setSquadPaymentAmount(groupPayRes.amount);
            }

            setActivePaymentUuid(paymentUuid);
            setActiveBookingUuid(bookingUuid);
            setActiveBookingRef(bookingRef);
            setIsGroupPaymentActive(true);
            setIsPaymentModalOpen(true);
            return;
          } catch (groupPayErr) {
            toast.error(groupPayErr?.data?.message ?? "Failed to initiate group payment.");
            return;
          }
        }

        if (bookingUuid && bookingUuid !== "undefined") {
          try {
            const payRes = await createPayment(bookingUuid).unwrap();
            const paymentUuid =
              payRes?.uuid ??
              payRes?.paymentUuid ??
              payRes?.data?.uuid ??
              payRes?.data?.paymentUuid;
            if (paymentUuid && paymentUuid !== "undefined") {
              setActivePaymentUuid(paymentUuid);
              setActiveBookingUuid(bookingUuid);
              setActiveBookingRef(bookingRef);
              setIsGroupPaymentActive(false);
              setIsPaymentModalOpen(true);
              return;
            }
          } catch (payErr) {
            console.warn("Payment initiation note:", payErr);
            setActivePaymentUuid(null);
            setActiveBookingUuid(bookingUuid);
            setActiveBookingRef(bookingRef);
            setIsGroupPaymentActive(false);
            setIsPaymentModalOpen(true);
            return;
          }
        }
      } else {
        bookingRef = `FZ-${Math.floor(100000 + Math.random() * 900000)}`;
      }

      navigateToConfirmed(bookingRef, bookingUuid);
    } catch (err) {
      console.error("Failed to create booking:", err);
      const msg =
        err?.data?.message ??
        err?.data?.error ??
        "Failed to confirm booking. Your seat hold may have expired.";
      toast.error(msg);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-70px)] w-full font-sans select-none overflow-x-hidden py-1 sm:py-2 pb-3">
      <div className="pointer-events-none absolute inset-0 -top-10 z-0 overflow-hidden">
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[750px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.22)_0%,rgba(8,2,3,0)_70%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 space-y-2 sm:space-y-3">
        <BookingStepper currentStep={3} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight">
            Food & Drinks
          </h2>

          <div className="flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1 rounded-full border border-[#B90101] text-[#B90101] font-bold text-xs sm:text-sm bg-[#B90101]/5 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#B90101]" />
            <span className="tracking-wider">{formatTimer(timeLeft)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <BookingFoodDrinksSelector
            concessions={concessions}
            glassCardStyle={glassCardStyle}
          />

          <div className="lg:col-span-6 flex flex-col justify-between space-y-3 sm:space-y-3.5">
            <BookingSummaryCard
              movie={movie}
              hallName={hallName}
              branch={branch}
              hallType={hallType}
              date={date}
              time={time}
              selectedSeats={selectedSeats}
              ticketsTotal={ticketsTotal}
              concessions={concessions}
              glassCardStyle={glassCardStyle}
            />

            {isGroupMode && (
              <BookingSquadLobbyCard
                groupBooking={groupBooking}
                groupMembers={groupMembers}
                isHost={isHost}
                isMyReady={isMyReady}
                readyCount={readyCount}
                totalMemberCount={totalMemberCount}
                handleEditSelection={handleEditSelection}
                isMarkingSelecting={isMarkingSelecting}
                glassCardStyle={glassCardStyle}
              />
            )}

            <div
              className="w-full rounded-2xl sm:rounded-3xl border px-5 py-3 flex items-center justify-between shadow-sm backdrop-blur-md"
              style={glassCardStyle}
            >
              <span className="text-sm sm:text-base font-bold text-[#B90101]">
                {isGroupMode && isHost ? `Squad Total (${totalMemberCount} Members)` : "Total paid"}
              </span>
              <span className="text-lg sm:text-xl font-black text-[#B90101]">
                ${displayTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-3.5 pt-0.5">
              <button
                type="button"
                onClick={handleBack}
                disabled={isCreatingBooking}
                className="flex-1 py-2.5 px-5 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition active:scale-95 text-center shadow-md border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleContinue}
                disabled={isSubmitting || (!isHost && isGroupMode && isMyReady)}
                className={`flex-1 py-2.5 px-5 rounded-full bg-[#B90101] hover:bg-[#9E0000] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition active:scale-95 text-center shadow-md border border-white/20 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "opacity-75 cursor-wait"
                    : !isHost && isGroupMode && isMyReady
                      ? "opacity-90 cursor-default bg-emerald-600 hover:bg-emerald-600"
                      : "cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>PROCESSING...</span>
                  </>
                ) : isGroupMode && !isHost ? (
                  isMyReady ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I'M READY (WAITING)</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I'M READY</span>
                    </>
                  )
                ) : isGroupMode && isHost ? (
                  !isSquadReady ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>WAITING SQUAD ({readyCount}/{totalMemberCount})</span>
                    </>
                  ) : (
                    <span>LOCK SQUAD & PAY (${displayTotal.toFixed(2)})</span>
                  )
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <PaymentKhqrModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookingUuid={activeBookingUuid}
        paymentUuid={activePaymentUuid}
        bookingRef={activeBookingRef}
        amount={displayTotal}
        movieTitle={movie?.title ?? movie?.name}
        hallName={hallName}
        seats={selectedSeats.map((s) => s.id)}
        isGroupPayment={isGroupPaymentActive}
        onPaymentSuccess={() => {
          setIsPaymentModalOpen(false);
          navigateToConfirmed(activeBookingRef, activeBookingUuid);
        }}
      />
    </div>
  );
}