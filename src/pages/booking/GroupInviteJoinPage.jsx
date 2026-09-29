import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import { Users, Film, Clock, Calendar, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetGroupInvitationQuery,
  useJoinGroupBookingMutation,
  useGetShowtimeByUuidQuery,
  useGetCinemaMovieByUuidQuery,
} from "../../services/api/cinemaApi";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";

export default function GroupInviteJoinPage() {
  const { inviteToken } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    data: invite,
    isLoading: isInviteLoading,
    isError: isInviteError,
    error: inviteError,
  } = useGetGroupInvitationQuery(inviteToken, {
    skip: !inviteToken || !isAuthenticated,
  });

  const [joinGroup, { isLoading: isJoining }] = useJoinGroupBookingMutation();

  // Fetch showtime & movie details if invite is loaded
  const showtimeUuid = invite?.showtimeUuid;
  const { data: showtime } = useGetShowtimeByUuidQuery(showtimeUuid, {
    skip: !showtimeUuid,
  });

  const movieUuid = showtime?.movieUuid;
  const { data: movie } = useGetCinemaMovieByUuidQuery(movieUuid, {
    skip: !movieUuid,
  });

  const handleJoin = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to join this group booking!");
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    try {
      const res = await joinGroup(inviteToken).unwrap();
      toast.success("Successfully joined the group!");
      const targetGroupUuid = invite?.uuid || res?.uuid;
      navigate(
        `/booking/seats?showtimeUuid=${showtimeUuid}&groupUuid=${targetGroupUuid}&type=group`
      );
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Failed to join group.";
      if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("member")) {
        toast.info("You are already a member of this group!");
        navigate(
          `/booking/seats?showtimeUuid=${showtimeUuid}&groupUuid=${invite?.uuid}&type=group`
        );
      } else {
        toast.error(msg);
      }
    }
  };

  // If user is not logged in, prompt them to login to view and join the group
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#12161C] border border-neutral-200/80 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#B90101]/10 dark:bg-[#FFD700]/10 text-[#B90101] dark:text-[#FFD700] flex items-center justify-center shadow-inner">
              <Users className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Group Booking Invitation
            </span>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
              Join Cinema Squad
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
              You&apos;ve been invited to join a cinema group booking! Please log in to your FilmZone account to view the movie session, pick your seat with your friends, and join the booking.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B90101] to-[#800000] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#B90101]/25 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <span>Log In to Accept Invitation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Don&apos;t have an account?{" "}
              <Link
                to={`/signup?redirect=${encodeURIComponent(window.location.pathname)}`}
                className="font-bold text-[#B90101] dark:text-[#FFD700] hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isInviteLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#B90101] dark:text-[#FFD700]" />
        <p className="text-neutral-600 dark:text-neutral-400 font-medium">
          Loading group invitation details...
        </p>
      </div>
    );
  }

  if (isInviteError || !invite) {
    const isAuthError = inviteError?.status === 401;
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase">
          {isAuthError ? "Session Expired" : "Invalid or Expired Invitation"}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
          {isAuthError
            ? "Your session has expired. Please log in again to view and join this group booking."
            : inviteError?.data?.message ||
              "This group booking link may have expired or is no longer open for new members."}
        </p>
        {isAuthError ? (
          <Link
            to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
            className="mt-4 px-6 py-2.5 rounded-xl bg-[#B90101] text-white font-bold text-sm hover:opacity-90 transition"
          >
            Log In Again
          </Link>
        ) : (
          <Link
            to="/"
            className="mt-4 px-6 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-sm hover:opacity-90 transition"
          >
            Back to Homepage
          </Link>
        )}
      </div>
    );
  }

  const isExpired = invite.status === "EXPIRED" || invite.status === "CANCELLED";
  const isLocked = invite.status === "LOCKED" || invite.status === "CONFIRMED";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#12161C] border border-neutral-200/80 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#B90101]/10 dark:bg-[#FFD700]/10 text-[#B90101] dark:text-[#FFD700] flex items-center justify-center shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Group Invitation
          </span>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            {invite.name || "Cinema Squad"}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            You have been invited to join this cinema group booking!
          </p>
        </div>

        {/* Movie & Showtime Card */}
        <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-white/5 p-4 flex gap-4 items-center">
          {movie?.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded-xl shadow-md shrink-0"
            />
          ) : (
            <div className="w-16 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl flex items-center justify-center shrink-0 text-neutral-400">
              <Film className="w-6 h-6" />
            </div>
          )}

          <div className="space-y-1 overflow-hidden">
            <h3 className="text-sm font-black text-neutral-900 dark:text-white truncate">
              {movie?.title || "Movie Session"}
            </h3>
            {showtime && (
              <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-[#B90101] dark:text-[#FFD700]" />
                  <span>{showtime.showDate || "Today"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-[#B90101] dark:text-[#FFD700]" />
                  <span>{showtime.startTime ? showtime.startTime.slice(0, 5) : "Showtime"}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status & Member Count info */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-white/5">
            <p className="text-[10px] uppercase font-bold text-neutral-400">Members</p>
            <p className="text-lg font-black text-neutral-900 dark:text-white">
              {invite.memberCount ?? 1}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-white/5">
            <p className="text-[10px] uppercase font-bold text-neutral-400">Status</p>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {invite.status}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {isExpired ? (
          <div className="p-3 rounded-xl bg-red-500/10 text-red-600 text-xs font-bold text-center">
            This group booking has expired.
          </div>
        ) : isLocked ? (
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 text-xs font-bold text-center">
            This group booking has been locked by the host for checkout.
          </div>
        ) : (
          <button
            type="button"
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B90101] to-[#800000] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#B90101]/25 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isJoining ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Joining Group...</span>
              </>
            ) : (
              <>
                <span>Join Group & Select Seat</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
