import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Clock } from "lucide-react";
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
import { selectIsAuthenticated } from "../../redux/slices/authSlice";
import {
  cinemaApi,
  useGetShowtimeSeatsQuery,
  useHoldSeatsMutation,
  useCreateBookingMutation,
  useCreateGroupBookingMutation,
  useGetGroupBookingByUuidQuery,
  useGetGroupMembersQuery,
  useAttachMemberBookingMutation,
  useGetCinemaMovieByUuidQuery,
  useGetShowtimeByUuidQuery,
} from "../../services/api/cinemaApi";

import { extractSeatLabels, buildGroupSeatAvatars } from "../../utils/seatUtils";
import SeatSelectionHeader from "../../components/booking/SeatSelectionHeader";
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

  const movieId = searchParams.get("movie") ?? searchParams.get("movieId") ?? "558449";
  const time = searchParams.get("time") ?? "03:00 PM";
  const branch = searchParams.get("branch") ?? "FilmZone SenSok";
  const date = searchParams.get("date") ?? "Aug 26 Tue";
  const showtimeUuid = searchParams.get("showtimeUuid");

  const hallParam = (
    searchParams.get("hall") ??
    searchParams.get("hallType") ??
    searchParams.get("screenType") ??
    "standard"
  ).toLowerCase();
  const isGoldHall = hallParam.includes("gold") || hallParam.includes("vip");
  const hallType = isGoldHall ? "gold" : "standard";

  const bookingType = (searchParams.get("type") ?? "standard").toLowerCase() === "group" ? "group" : "standard";
  const rawScreenType = searchParams.get("screenType") ?? searchParams.get("format");
  const screenType = rawScreenType ?? (hallType === "gold" ? "GOLD" : "2D");

  const booking = useSelector(selectBooking);
  const reduxMovie = booking?.movie;

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

  const selectedSeats = useSelector(selectSelectedSeats);
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const rawPrice = searchParams.get("price");
  const ticketPrice = rawPrice
    ? parseFloat(rawPrice)
    : showtimeDetails?.basePrice != null
      ? Number(showtimeDetails.basePrice)
      : hallType === "gold"
        ? GOLD_PRICE
        : STANDARD_SINGLE_PRICE;

  const [holdSeats, { isLoading: isHolding }] = useHoldSeatsMutation();
  const [createBooking] = useCreateBookingMutation();
  const [attachMemberBooking] = useAttachMemberBookingMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector((state) => state.auth?.user);

  const groupUuidParam = searchParams.get("groupUuid");
  const [createGroupBooking, { isLoading: isCreatingGroup }] = useCreateGroupBookingMutation();
  const [currentGroup, setCurrentGroup] = useState(null);

  const activeGroupUuid = groupUuidParam ?? currentGroup?.uuid;

  const { data: groupBookingData } = useGetGroupBookingByUuidQuery(activeGroupUuid, {
    skip: !activeGroupUuid,
    pollingInterval: 3000,
  });

  const { data: groupMembers = [] } = useGetGroupMembersQuery(activeGroupUuid, {
    skip: !activeGroupUuid,
    pollingInterval: 3000,
  });

  const [memberSeatsMap, setMemberSeatsMap] = useState({});

  useEffect(() => {
    if (!activeGroupUuid || !Array.isArray(groupMembers) || groupMembers.length === 0) return;

    let isMounted = true;

    groupMembers.forEach((member) => {
      const memberKey = member.uuid ?? member.userUuid;
      const directSeats = extractSeatLabels(member.seats ?? member.seatLabels ?? member.booking);

      if (directSeats.length > 0) {
        setMemberSeatsMap((prev) => {
          if (JSON.stringify(prev[memberKey]) === JSON.stringify(directSeats)) return prev;
          return { ...prev, [memberKey]: directSeats };
        });
        return;
      }

      const bUuid = member.bookingUuid ?? member.booking?.uuid;
      if (bUuid) {
        dispatch(cinemaApi.endpoints.getBookingByUuid.initiate(bUuid))
          .unwrap()
          .then((bData) => {
            if (!isMounted || !bData) return;
            const bSeats = extractSeatLabels(bData);
            if (bSeats.length > 0) {
              setMemberSeatsMap((prev) => {
                if (JSON.stringify(prev[memberKey]) === JSON.stringify(bSeats)) return prev;
                return { ...prev, [memberKey]: bSeats };
              });
            }
          })
          .catch(() => {});
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeGroupUuid, groupMembers, dispatch]);

  const {
    data: apiSeats = [],
    isLoading: isSeatsLoading,
    isError: isSeatsError,
    refetch: refetchSeats,
  } = useGetShowtimeSeatsQuery(showtimeUuid, {
    skip: !showtimeUuid,
    pollingInterval: 3000,
  });

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

  useEffect(() => {
    dispatch(clearSeats());
  }, [movieId, time, date, hallType, bookingType, showtimeUuid, dispatch]);

  const groupSeatAvatars = useMemo(() => {
    return buildGroupSeatAvatars({
      bookingType,
      selectedSeats,
      currentUser,
      activeGroupUuid,
      groupMembers,
      memberSeatsMap,
    });
  }, [bookingType, selectedSeats, currentUser, activeGroupUuid, groupMembers, memberSeatsMap]);

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

  const handleCreateSquad = async (customName) => {
    if (!showtimeUuid) return;
    try {
      const groupName = customName?.trim()
        ? customName.trim()
        : movie?.title
          ? `${movie.title} Squad`
          : "FilmZone Squad";
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

  const handleSeatClick = (seatsToToggle, isCouple) => {
    seatsToToggle.forEach((seat) => {
      const seatId = seat.seatLabel;

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

  const isGroupDiscount = bookingType === "group" && selectedSeats.length >= 4;
  const rawTotalPrice = useMemo(() => {
    return selectedSeats.reduce((acc, seat) => acc + (seat.price ?? 0), 0);
  }, [selectedSeats]);
  const totalPrice = isGroupDiscount ? rawTotalPrice * 0.9 : rawTotalPrice;

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

      let bookingUuid = null;
      let bookingRef = null;

      if (activeGroupUuid && showtimeUuid && holdId) {
        try {
          const bookingRes = await createBooking({ showtimeUuid, holdId }).unwrap();
          bookingUuid =
            bookingRes?.uuid ??
            bookingRes?.bookingUuid ??
            bookingRes?.data?.uuid ??
            bookingRes?.data?.bookingUuid;
          bookingRef =
            bookingRes?.bookingReference ??
            bookingRes?.reference ??
            bookingRes?.ticketQrToken?.slice(0, 8)?.toUpperCase() ??
            (bookingUuid ? `FZ-${bookingUuid.slice(0, 8).toUpperCase()}` : null);

          if (bookingUuid) {
            try {
              await attachMemberBooking({
                groupUuid: activeGroupUuid,
                bookingUuid,
              }).unwrap();
            } catch (bookingErr) {
              console.warn("Group booking creation/attachment note:", bookingErr);
            }
          }
        } catch (bookingErr) {
          console.warn("Booking creation note:", bookingErr);
        }
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
          bookingUuid,
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
      if (bookingUuid) {
        params.set("bookingUuid", bookingUuid);
      }
      if (bookingRef) {
        params.set("ref", bookingRef);
      }
      if (activeGroupUuid) {
        params.set("groupUuid", activeGroupUuid);
        try {
          const groupSeatsKey = `group_seats_${activeGroupUuid}`;
          const rawSquad = localStorage.getItem(groupSeatsKey);
          const currentSquad = rawSquad ? JSON.parse(rawSquad) : {};
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
        }
      }

      if (movieUuid) {
        params.set("movie", movieUuid);
      }
      navigate(`/booking/details?${params.toString()}`);
    } catch (err) {
      console.error("Seat hold error:", err);
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
      <div className="pointer-events-none absolute inset-0 -top-10 z-0 overflow-hidden">
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[750px] bg-[radial-gradient(circle_at_center,rgba(185,1,1,0.22)_0%,rgba(8,2,3,0)_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-6 space-y-6 sm:space-y-8 pt-2">
        <SeatSelectionHeader
          onBack={handleBackToMovie}
          movieTitle={movie?.title}
          branch={branch}
          time={time}
          hallType={hallType}
          screenType={screenType}
          bookingType={bookingType}
          onBookingTypeChange={handleBookingTypeChange}
        />

        <ScreenCurve />

        <div
          className="w-full rounded-2xl sm:rounded-3xl border px-2 py-4 sm:p-10 shadow-sm overflow-x-auto backdrop-blur-md min-h-[300px] sm:min-h-[350px] flex items-center justify-center"
          style={{
            backgroundColor: isDark ? "var(--primary-color-30)" : "white",
            borderColor: isDark ? "var(--border-dark-mode)" : "var(--border-light-mode)",
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

        <SeatPricingCards hallType={hallType} price={ticketPrice} />

        {bookingType === "group" ? (
          <GroupSeatLegend
            mySeats={selectedSeats.map((s) => s.id)}
            members={groupMembers}
            onOpenInviteModal={() => setIsGroupModalOpen(true)}
          />
        ) : (
          <SeatLegend />
        )}

        <BookingCheckoutBar
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          isGroupDiscount={isGroupDiscount}
          isGroupMode={bookingType === "group"}
          isLoading={isHolding}
          onProceed={handleProceed}
        />

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