import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Clock, ArrowLeft, User, Users } from "lucide-react";
import {
  toggleSeat,
  clearSeats,
  setSelectedSeats,
  clearConcessions,
  selectSelectedSeats,
  setShowtime,
  setMovie,
  selectBooking,
} from "../../redux/slices/bookingSlice";
import { selectTheme } from "../../redux/slices/uiSlice";
import {
  useGetShowtimeSeatsQuery,
  useHoldSeatsMutation,
  useCreateGroupBookingMutation,
  useGetGroupBookingByUuidQuery,
  useGetGroupMembersQuery,
  useGetCinemaMovieByUuidQuery,
  useGetShowtimeByUuidQuery,
} from "../../services/api/cinemaApi";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";

// Modular Subcomponents & Data
import BookingStepper from "../../components/booking/BookingStepper";
import ScreenCurve from "../../components/booking/ScreenCurve";
import SeatLegend from "../../components/booking/SeatLegend";
import SeatPricingCards from "../../components/booking/SeatPricingCards";
import BookingCheckoutBar from "../../components/booking/BookingCheckoutBar";
import DynamicSeatMap from "../../components/booking/DynamicSeatMap";
import GroupBookingLinkModal from "../../components/booking/GroupBookingLinkModal";
import GroupSeatLegend from "../../components/booking/GroupSeatLegend";
import { GOLD_PRICE, STANDARD_SINGLE_PRICE } from "../../data/seatLayoutData";

export default function SeatSelectionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Query Parameters
  const movieId = searchParams.get("movie") ?? searchParams.get("movieId") ?? "558449";
  const time = searchParams.get("time") ?? "03:00 PM";
  const branch = searchParams.get("branch") ?? "FilmZone SenSok";
  const date = searchParams.get("date") ?? "Aug 26 Tue";
  const showtimeUuid = searchParams.get("showtimeUuid");

  // Hall Mode: 'gold' (VIP hall) vs 'standard' (Standard hall)
  const hallParam = (
    searchParams.get("hall") ??
    searchParams.get("hallType") ??
    searchParams.get("screenType") ??
    "standard"
  ).toLowerCase();
  const isGoldHall = hallParam.includes("gold") || hallParam.includes("vip");
  const hallType = isGoldHall ? "gold" : "standard";

  // Booking Mode: 'standard' vs 'group'
  const bookingType = (searchParams.get("type") ?? "standard").toLowerCase() === "group" ? "group" : "standard";
  const rawScreenType = searchParams.get("screenType") ?? searchParams.get("format");
  const screenType = rawScreenType ?? (hallType === "gold" ? "GOLD" : "2D");

  const booking = useSelector(selectBooking);
  const reduxMovie = booking?.movie;
  
  // Fetch showtime to resolve movie UUID from Teacher API
  const { data: showtimeDetails } = useGetShowtimeByUuidQuery(showtimeUuid, {
    skip: !showtimeUuid,
  });

  const movieUuid = showtimeDetails?.movieUuid ?? (movieId?.includes("-") ? movieId : null) ?? reduxMovie?.uuid;
  const { data: cinemaMovie } = useGetCinemaMovieByUuidQuery(movieUuid, { skip: !movieUuid });
  const movie = cinemaMovie ?? reduxMovie;

  useEffect(() => {
    if (cinemaMovie) {
      dispatch(setMovie(cinemaMovie));
    }
  }, [cinemaMovie, dispatch]);

  // Redux Selected Seats & Theme
  const selectedSeats = useSelector(selectSelectedSeats);
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    const rawPrice = searchParams.get("price");
  const ticketPrice = rawPrice
    ? parseFloat(rawPrice)
    : hallType === "gold"
      ? GOLD_PRICE
      : STANDARD_SINGLE_PRICE;

  const [holdSeats, { isLoading: isHolding }] = useHoldSeatsMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector((state) => state.auth?.user);

  const groupUuidParam = searchParams.get("groupUuid");
  const [createGroupBooking, { isLoading: isCreatingGroup }] = useCreateGroupBookingMutation();
  const [currentGroup, setCurrentGroup] = useState(null);

  const activeGroupUuid = groupUuidParam ?? currentGroup?.uuid;

  // Poll live group details & members every 3 seconds if activeGroupUuid exists
  const { data: groupBookingData } = useGetGroupBookingByUuidQuery(activeGroupUuid, {
    skip: !activeGroupUuid,
    pollingInterval: 3000,
  });

  const { data: groupMembers = [] } = useGetGroupMembersQuery(activeGroupUuid, {
    skip: !activeGroupUuid,
    pollingInterval: 3000,
  });

  // Real-time seat availability from Teacher API
  const {
    data: apiSeats = [],
    isLoading: isSeatsLoading,
    isError: isSeatsError,
    refetch: refetchSeats,
  } = useGetShowtimeSeatsQuery(showtimeUuid, {
    skip: !showtimeUuid,
    pollingInterval: 3000,
  });

  // Auto-detect if any locally selected seat was taken by another customer and remove it cleanly
  useEffect(() => {
    if (apiSeats.length > 0 && selectedSeats.length > 0) {
      const conflicting = selectedSeats.filter((s) => {
        const serverSeat = apiSeats.find(
          (as) =>
            (s.seatUuid && as.uuid === s.seatUuid) ||
            (as.seatNumber === s.number && as.rowLabel === s.row)
        );
        return (
          serverSeat &&
          (["HELD", "RESERVED"].includes(serverSeat.status) || Boolean(serverSeat.isHeld) || Boolean(serverSeat.isReserved))
        );
      });

      if (conflicting.length > 0) {
        const validSeats = selectedSeats.filter((s) => !conflicting.includes(s));
        dispatch(setSelectedSeats(validSeats));
        toast.warn(
          "A seat you selected was just taken by another customer. The seat map has updated."
        );
      }
    }
  }, [apiSeats, selectedSeats, dispatch]);

  // Clear selected seats whenever showtime or hall changes
  useEffect(() => {
    dispatch(clearSeats());
  }, [movieId, time, date, hallType, bookingType, showtimeUuid, dispatch]);

  // Group seat avatars: shows live presence members on the map
  const groupSeatAvatars = useMemo(() => {
    if (bookingType !== "group") return {};

    const map = {};

    const userName = currentUser?.firstName
      ? `${currentUser.firstName} ${currentUser.lastName ?? ""}`.trim()
      : (currentUser?.name ?? "You");
    const userInitials = (userName[0] ?? "U").toUpperCase();
    const storedUserAvatar = currentUser?.uuid
      ? localStorage.getItem(`user_avatar_${currentUser.uuid}`)
      : null;
    const userAvatar =
      currentUser?.avatar ??
      storedUserAvatar ??
      currentUser?.profileImage ??
      currentUser?.imageUrl ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=FFD700&color=000&bold=true`;

    // 1. Map teammates' held seats from active squad
    if (activeGroupUuid) {
      try {
        const groupSeatsKey = `group_seats_${activeGroupUuid}`;
        const squadData = JSON.parse(localStorage.getItem(groupSeatsKey) || "{}");
        const currentUserId = currentUser?.uuid ?? currentUser?.id ?? "me";
        const palette = ["#10B981", "#6366F1", "#EC4899", "#F59E0B", "#3B82F6", "#8B5CF6", "#14B8A6"];

        Object.entries(squadData).forEach(([uId, data], index) => {
          if (uId !== currentUserId && Array.isArray(data?.seats)) {
            const memberColor = palette[index % palette.length];
            const memberName = data.userName ?? `Friend ${index + 1}`;
            const memberInitial = (memberName[0] ?? "F").toUpperCase();
            const memberAvatar =
              data.avatar ??
              `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=${memberColor.replace("#", "")}&color=fff&size=128&bold=true`;

            data.seats.forEach((seatId) => {
              map[seatId] = {
                avatar: memberAvatar,
                color: memberColor,
                name: memberName,
                initials: memberInitial,
                isLocked: true, // Teammates cannot override or click another member's seat
              };
            });
          }
        });
      } catch {
        // Safe fallback
      }
    }

    // 2. Current user's selected seats get the gold ring avatar
    selectedSeats.forEach((seat) => {
      map[seat.id] = {
        avatar: userAvatar,
        color: "#FFD700",
        name: userName,
        initials: userInitials,
        isLocked: false,
      };
    });

    return map;
  }, [bookingType, selectedSeats, currentUser, activeGroupUuid]);

  // Switch Booking Type (Standard vs Group)
  const handleBookingTypeChange = async (newType) => {
    if (newType === "group") {
      if (!isAuthenticated) {
        toast.info("Please log in to start a Group Booking!");
        navigate(
          `/login?redirect=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`
        );
        return;
      }
      setIsGroupModalOpen(true);
      return;
    }

    if (newType === bookingType) return;
    const params = new URLSearchParams(searchParams);
    params.set("type", newType);
    params.set("screenType", screenType);
    navigate(`/booking/seats?${params.toString()}`, { replace: true });
  };

  // Callback when Host confirms squad name in GroupBookingLinkModal
  const handleCreateSquad = async (customName) => {
    if (!showtimeUuid) return;
    try {
      const groupName = customName || (movie?.title ? `${movie.title} Squad` : "FilmZone Squad");
      const res = await createGroupBooking({
        showtimeUuid,
        name: groupName,
      }).unwrap();

      setCurrentGroup(res);
      const params = new URLSearchParams(searchParams);
      params.set("type", "group");
      params.set("groupUuid", res.uuid);
      params.set("screenType", screenType);
      navigate(`/booking/seats?${params.toString()}`, { replace: true });
      toast.success(`Squad "${groupName}" created! Share the link with friends.`);
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to create group booking.");
    }
  };

  // Interactive Click Handler for Dynamic Seat Map
  const handleSeatClick = (seatsToToggle, isCouple) => {
    seatsToToggle.forEach((seat) => {
      const seatId = seat.seatLabel;

      // Seat selection in group mode

      dispatch(
        toggleSeat({
          id: seatId,
          seatUuid: seat.seatUuid,
          row: seat.rowLabel,
          number: seat.seatNumber,
          type: isCouple ? "couple" : hallType === "gold" ? "gold" : "single",
          price: ticketPrice,
        }),
      );
    });
  };

  // Each user chooses their own seat and pays for their own seat!
  const isGroupDiscount = bookingType === "group" && selectedSeats.length >= 4;
  const rawTotalPrice = useMemo(() => {
    return selectedSeats.reduce((acc, seat) => acc + (seat.price ?? 0), 0);
  }, [selectedSeats]);
  const totalPrice = isGroupDiscount ? rawTotalPrice * 0.9 : rawTotalPrice;

  // Proceed to Booking Details (hold seats with Teacher API)
  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      toast.warn("Please select at least one seat.");
      return;
    }

    if (!isAuthenticated) {
      toast.info("Please log in to hold your seats and continue booking.");
      navigate("/login", {
        state: { from: `/booking/seats?${searchParams.toString()}` },
      });
      return;
    }

    const seatUuids = selectedSeats.map((s) => s.seatUuid).filter(Boolean);

    try {
      let holdId = null;
      let expiresInSeconds = 300;

      if (showtimeUuid && seatUuids.length > 0) {
        const holdRes = await holdSeats({
          showtimeUuid,
          seatUuids,
        }).unwrap();

        holdId = holdRes.holdId;
        expiresInSeconds = holdRes.expiresInSeconds ?? 300;
      }

      if (movie) {
        dispatch(setMovie(movie));
      }
      dispatch(clearConcessions());
      dispatch(
        setShowtime({
          time,
          branch,
          date,
          screenType,
          hall:
            hallType === "gold"
              ? "Hall 4 - Gold Class VIP"
              : `Hall 3 - ${screenType}`,
          hallType,
          bookingType,
          showtimeUuid,
          holdId,
        }),
      );

      const params = new URLSearchParams(searchParams);
      params.set("type", bookingType);
      params.set("hall", hallType);
      params.set("screenType", screenType);
            params.set("seats", selectedSeats.map((s) => s.id).join(","));
      params.set("seatUuids", seatUuids.join(","));
      params.set("price", String(ticketPrice));
      if (holdId) {
        params.set("holdId", holdId);
        params.set("expiresIn", String(expiresInSeconds));
      }
      if (activeGroupUuid) {
        params.set("groupUuid", activeGroupUuid);
        try {
          const groupSeatsKey = `group_seats_${activeGroupUuid}`;
          const currentSquad = JSON.parse(localStorage.getItem(groupSeatsKey) || "{}");
          const myUserUuid = currentUser?.uuid ?? currentUser?.id ?? "me";
          currentSquad[myUserUuid] = {
            seats: selectedSeats.map((s) => s.id),
            userName: currentUser?.firstName
              ? `${currentUser.firstName} ${currentUser.lastName ?? ""}`.trim()
              : (currentUser?.name ?? "Friend"),
            avatar:
              currentUser?.avatar ??
              currentUser?.profileImage ??
              localStorage.getItem(`user_avatar_${currentUser?.uuid}`) ??
              null,
            updatedAt: Date.now(),
          };
          localStorage.setItem(groupSeatsKey, JSON.stringify(currentSquad));
        } catch {
          // Ignore local storage error
        }
      }

      if (movieUuid) {
        params.set("movie", movieUuid);
      }
      navigate(`/booking/details?${params.toString()}`);
    } catch (err) {
      console.error("Seat hold error:", err);
      // Immediately refetch latest seats from server and clear conflicting local seats
      refetchSeats();
      dispatch(clearSeats());
      const msg =
        err?.data?.message ??
        err?.data?.error ??
        "Those seats were just held by another customer. The seat map has been refreshed — please select a new seat.";
      toast.error(msg);
    }
  };

  const handleBackToMovie = () => {
    dispatch(clearSeats());
    if (movieId) {
      navigate(movieUuid ? `/movies/${movieUuid}` : -1);
    } else {
      navigate(-1);
    }
  };

  if (!showtimeUuid) {
    return (
      <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4 font-sans select-none">
        <div className="w-16 h-16 rounded-full bg-[#B90101]/10 flex items-center justify-center text-[#B90101] mb-2 border border-[#B90101]/20">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          No Showtime Selected
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
          Please select a valid showtime from the movie details page before
          choosing your seats.
        </p>
        <button
          type="button"
          onClick={handleBackToMovie}
          className="mt-4 px-6 py-2.5 rounded-full bg-[#B90101] text-white font-bold text-sm hover:brightness-110 active:scale-95 transition cursor-pointer"
        >
          Go Back to Movie
        </button>
      </div>
    );
  }

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
            onClick={handleBackToMovie}
            className="flex items-center gap-2 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#B90101] dark:hover:text-[#B90101] transition cursor-pointer"
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

          {/* Hall & Format Pill */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300/80 dark:border-white/10 text-neutral-700 dark:text-neutral-300 font-bold text-xs bg-neutral-100 dark:bg-white/5 shadow-xs">
            <span className="tracking-wide">
              {hallType === "gold"
                ? "Gold Class VIP"
                : `${screenType} Standard`}
            </span>
          </div>
        </div>

        {/* Booking Type Switcher Bar (Standard Booking vs Group Booking) */}
        <div className="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] border border-neutral-200/80  shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400">
              Booking Type:
            </span>
          </div>

          <div className="inline-flex p-1 rounded-full bg-neutral-100/50 border border-neutral-300 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] text-xs font-bold">
            <button
              type="button"
              onClick={() => handleBookingTypeChange("standard")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                bookingType === "standard"
                  ? "bg-[#B90101] text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Standard Booking</span>
            </button>
            <button
              type="button"
              onClick={() => handleBookingTypeChange("group")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                bookingType === "group"
                  ? "bg-[#B90101] text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Group Booking</span>
            </button>
          </div>
        </div>

        {/* 3. Curved "Screen" Arc */}
        <ScreenCurve />

        {/* 4. Main Seating Pod */}
        <div
          className="w-full rounded-2xl sm:rounded-3xl border p-6 sm:p-10 shadow-sm overflow-x-auto backdrop-blur-md min-h-[350px] flex items-center justify-center"
          style={{
            backgroundColor: isDark
              ? "var(--primary-color-30)"
              : "white",
            borderColor: isDark
              ? "var(--border-dark-mode)"
              : "var(--border-light-mode)",
          }}
        >
          {isSeatsLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#B90101] border-t-transparent animate-spin" />
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                Loading live seat availability...
              </p>
            </div>
          ) : isSeatsError ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-sm font-bold text-red-500">
                Failed to load seats for this showtime.
              </p>
              <button
                type="button"
                onClick={() => refetchSeats()}
                className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#B90101] text-white hover:brightness-110 cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <DynamicSeatMap
              seats={apiSeats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
              groupSeatAvatars={groupSeatAvatars}
              hallType={hallType}
            />
          )}
        </div>

        {/* 5. Pricing Cards (Always shown in both Standard and Group Booking modes) */}
        <SeatPricingCards hallType={hallType} price={ticketPrice} />

        {/* 6. Legend: Standard or Group Legend with Live Presence */}
        {bookingType === "group" ? (
          <GroupSeatLegend mySeats={selectedSeats.map((s) => s.id)} members={groupMembers} onOpenInviteModal={() => setIsGroupModalOpen(true)} />
        ) : (
          <SeatLegend />
        )}

        {/* 7. Floating Checkout Bar (Charges only for current user's chosen seats) */}
        <BookingCheckoutBar
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          isGroupDiscount={isGroupDiscount}
          isGroupMode={bookingType === "group"}
          isLoading={isHolding}
          onProceed={handleProceed}
        />

        {/* 8. Group Booking Link Modal Popup */}
        <GroupBookingLinkModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          onContinue={() => setIsGroupModalOpen(false)}
          onCreateGroup={handleCreateSquad}
          groupCode={groupBookingData?.inviteToken ?? currentGroup?.inviteToken ?? ""}
          inviteToken={groupBookingData?.inviteToken ?? currentGroup?.inviteToken ?? ""}
          groupName={groupBookingData?.name ?? currentGroup?.name ?? ""}
          defaultGroupName={movie?.title ? `${movie.title} Squad` : "FilmZone Squad"}
          isLoading={isCreatingGroup}
        />
      </div>
    </div>
  );
}
