import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Heart,
  Ticket,
  Star,
  CheckCircle2,
  Camera,
  LogIn,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  selectCurrentUser,
  updateUser as updateReduxUser,
  logout,
} from "../redux/slices/authSlice";
import {
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetMyFavoriteCountQuery,
  useLogoutApiMutation,
} from "../services/api/authApi";
import {
  useGetMyTicketsQuery,
  useUploadImageMutation,
} from "../services/api/cinemaApi";

// Helper to resolve full URL from relative backend path
const resolveAvatarUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  return `https://cinema-booking-api.eunglyzhia.com${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Authentication token
  const token =
    useSelector((state) => state.auth?.accessToken || state.auth?.token) ||
    sessionStorage.getItem("accessToken");

  // Redux cached user
  const cachedUser = useSelector(selectCurrentUser);

  // 1. RTK Query: Live current user profile
  const {
    data: liveUser,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  // 2. RTK Query: Stats from Teacher's API
  const { data: favoriteCountData } = useGetMyFavoriteCountQuery(undefined, {
    skip: !token,
  });
  const { data: ticketsData } = useGetMyTicketsQuery(
    { page: 0, size: 5 },
    { skip: !token },
  );

  // 3. RTK Query Mutations
  const [updateUserApi, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [uploadImageApi, { isLoading: isUploadingAvatar }] =
    useUploadImageMutation();
  const [deleteUserApi, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [logoutApi] = useLogoutApiMutation();

  // Consolidated user object
  const activeUser = liveUser || cachedUser || {};

  // Form states matching Teacher's UpdateUserRequest schema
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync server data & stored avatar into form fields
  useEffect(() => {
    if (activeUser && Object.keys(activeUser).length > 0) {
      const userUuid = activeUser.uuid || activeUser.id;
      setFirstName(activeUser.firstName || "");
      setLastName(activeUser.lastName || "");
      setUsername(activeUser.username || "");
      setEmail(activeUser.email || "");
      setPhone(activeUser.phone || "");

      // Check stored avatar by user UUID first, then user.avatar
      const storedAvatar = userUuid
        ? localStorage.getItem(`user_avatar_${userUuid}`)
        : null;
      const initialAvatar = storedAvatar || activeUser.avatar || "";
      if (initialAvatar) {
        setAvatarUrl(resolveAvatarUrl(initialAvatar));
      }
    }
  }, [
    activeUser.uuid,
    activeUser.id,
    activeUser.username,
    activeUser.email,
    activeUser.phone,
    activeUser.avatar,
  ]);

  // Points & Counts calculation
  const memberYear = activeUser.createdAt
    ? new Date(activeUser.createdAt).getFullYear()
    : "2026";
  const userPoints = activeUser.points ?? 0;
  const favCount = favoriteCountData?.count ?? 0;
  const bookedCount =
    ticketsData?.totalElements ?? ticketsData?.content?.length ?? 0;
  const earnedPoints = Math.round(userPoints / 20) || 0;

  // Booking history items from Teacher's API
  const displayBookings = (ticketsData?.content || [])
    .slice(0, 3)
    .map((ticket) => ({
      id: ticket.ticketUuid || ticket.id,
      title: ticket.movieTitle || "Cinema Movie",
      date: ticket.showDate
        ? `${ticket.showDate} ${ticket.showTime ? `• ${ticket.showTime}` : ""} (Seat ${ticket.seatLabel || "N/A"})`
        : "Upcoming Show",
    }));

  // Handle Save Profile Changes via RTK Query
  const handleSaveChange = async (e) => {
    e?.preventDefault();

    const targetUuid = activeUser.uuid || activeUser.id;
    if (!targetUuid) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    if (!username.trim() || username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long.");
      return;
    }

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };

      const result = await updateUserApi({
        uuid: targetUuid,
        userData: payload,
      }).unwrap();

      // Sync into Redux store so Navbar and Header reflect immediately
      const displayName =
        `${result.firstName || ""} ${result.lastName || ""}`.trim() ||
        result.username ||
        payload.username;

      dispatch(
        updateReduxUser({
          ...result,
          name: displayName,
          avatar: avatarUrl,
        }),
      );

      toast.success("Profile updated successfully!");
      refetchUser();
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errMsg =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to update profile. Please verify your data.";
      toast.error(errMsg);
    }
  };

  // Handle Avatar Upload via RTK Query (POST /api/v1/files/images)
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    // 1. Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    const formData = new FormData();
    formData.append("file", file);

    const userUuid = activeUser.uuid || activeUser.id;

    try {
      // 2. Upload to Teacher's Cinema API (POST /api/v1/files/images)
      const uploadRes = await uploadImageApi(formData).unwrap();
      const rawUrl = uploadRes?.url || uploadRes?.imageUrl;
      if (rawUrl) {
        // 3. Resolve Full URL (Prepend teacher domain if relative)
        const fullUrl = resolveAvatarUrl(rawUrl);
        setAvatarUrl(fullUrl);

        // 4. Persist per User in localStorage
        if (userUuid) {
          localStorage.setItem(`user_avatar_${userUuid}`, fullUrl);
        }

        // 5. Update Redux store so Navbar reflects the new avatar
        dispatch(updateReduxUser({ avatar: fullUrl }));
        toast.success("Avatar uploaded and saved successfully!");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      toast.error(err?.data?.message || "Failed to upload avatar image.");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    const refreshToken = (
      sessionStorage.getItem("refreshToken") ||
      localStorage.getItem("cinema_refresh_token") ||
      activeUser?.refreshToken ||
      ""
    ).trim();

    if (refreshToken) {
      try {
        await logoutApi({ refreshToken }).unwrap();
      } catch (err) {
        console.warn("Server logout response:", err);
      }
    }

    dispatch(logout());
    toast.info("Logged out successfully");
    navigate("/");
  };

  // Handle Delete Account via RTK Query
  const handleDeleteAccount = async () => {
    const targetUuid = activeUser.uuid || activeUser.id;
    if (!targetUuid) return;

    try {
      await deleteUserApi(targetUuid).unwrap();
      dispatch(logout());
      toast.warn("Account deleted successfully.");
      navigate("/");
    } catch (err) {
      console.error("Account deletion failed:", err);
      toast.error(err?.data?.message || "Could not delete account.");
    }
  };

  // State: Unauthenticated
  if (!token) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-[#B90101]/10 flex items-center justify-center">
          <User className="w-8 h-8 text-[#B90101]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          Sign In to View Profile
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
          Please sign in to your FilmZone account to view your cinema profile,
          manage account information, and view tickets.
        </p>
        <Link
          to="/login"
          className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-bold text-[14px] shadow-lg hover:brightness-110 active:scale-95 transition"
          style={{ backgroundColor: "#B90101" }}
        >
          <LogIn size={16} />
          <span>Sign In to Account</span>
        </Link>
      </div>
    );
  }

  // State: Loading User Profile
  if (isUserLoading && !activeUser.uuid && !activeUser.id) {
    return (
      <div className="w-full py-28 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-10 h-10 border-4 border-[#B90101] border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-500 dark:text-neutral-400 font-semibold text-sm">
          Loading profile from Cinema API...
        </p>
      </div>
    );
  }

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    username ||
    activeUser.name ||
    "Cinema Member";

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans">
      {/* 1. Page Header: Profile | Information */}
      <div className="mb-8 flex items-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          <span className="text-[#B90101] dark:text-white">Profile</span>
          <span className="text-[#B90101] mx-3 sm:mx-4 font-normal">|</span>
          <span className="text-[#B90101] dark:text-white">Information</span>
        </h1>
      </div>

      {/* 2. Main Profile Card */}
      <div className="relative rounded-[32px] border border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-[#1A1F25]/40 backdrop-blur-xl shadow-xl overflow-hidden p-6 sm:p-10 mb-8 transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Avatar, Name, Email, Points, Logout */}
          <div className="lg:col-span-4 flex flex-col items-center text-center relative">
            {/* Avatar Container with Upload Camera Overlay */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center border-4 border-white dark:border-neutral-700 shadow-md">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    onError={() => setAvatarUrl("")}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-neutral-400 dark:text-neutral-500" />
                )}
              </div>

              {/* Camera Upload Trigger */}
              <label
                htmlFor="avatar-upload-input"
                className="absolute bottom-1 right-1 p-2 rounded-full bg-[#B90101] text-white hover:brightness-110 active:scale-95 transition shadow-lg cursor-pointer"
                title="Change Avatar Photo"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
                <input
                  id="avatar-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* User Full Name */}
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-4 tracking-tight">
              {fullName}
            </h2>

            {/* Email with Verified Badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              <span>{email || "member@filmzone.com"}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B90101] shrink-0" />
            </div>

            {/* Member since */}
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mt-2">
              Member since {memberYear}
            </p>

            {/* Points Badge */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-500 dark:text-amber-400 mt-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{userPoints} Points</span>
            </div>

            {/* Left Column Bottom Action Buttons */}
            <div className="flex items-center gap-4 mt-8 pt-4 w-full justify-center">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs sm:text-sm font-bold text-[#B90101] hover:underline transition cursor-pointer"
              >
                Delete Account
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="text-xs sm:text-sm font-bold text-[#B90101] hover:underline transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Vertical Divider in Desktop View */}
          <div className="hidden lg:block absolute left-[36%] top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-[#B90101]/40 to-transparent" />

          {/* Right Column: Editable Profile Fields */}
          <div className="lg:col-span-8 lg:pl-6">
            <form onSubmit={handleSaveChange} className="space-y-4">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="w-full px-5 py-3 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#1A1F25]/60 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#B90101] transition shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full px-5 py-3 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#1A1F25]/60 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#B90101] transition shadow-inner"
                  />
                </div>
              </div>

              {/* Row 2: Username */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Username <span className="text-[#B90101]">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username (min 3 characters)"
                  required
                  minLength={3}
                  className="w-full px-5 py-3 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#1A1F25]/60 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#B90101] transition shadow-inner"
                />
              </div>

              {/* Row 3: Email Address */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-5 py-3 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#1A1F25]/60 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#B90101] transition shadow-inner"
                />
              </div>

              {/* Row 4: Phone Number */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012 345 678"
                  className="w-full px-5 py-3 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-[#1A1F25]/60 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#B90101] transition shadow-inner"
                />
              </div>

              {/* Save Change Button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-8 py-2.5 rounded-full border border-[#B90101] text-xs sm:text-sm font-bold text-[#B90101] hover:bg-[#B90101] hover:text-white transition shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to API...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: My Activity & Booking History Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
        {/* Card 1: My Activity (md:col-span-5) */}
        <div className="md:col-span-5 rounded-[28px] border border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-[#1A1F25]/40 backdrop-blur-xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              My Activity
            </h3>
            {/* Red Underline Indicator */}
            <div className="h-0.5 w-full bg-gradient-to-r from-[#B90101] via-[#B90101]/40 to-transparent mt-3 mb-6" />

            {/* 3 Columns Stats */}
            <div className="flex items-center justify-around py-4">
              {/* Column 1: Favourite */}
              <Link
                to="/favourite"
                className="flex flex-col items-center group cursor-pointer"
              >
                <Heart className="w-5 h-5 text-[#B90101] group-hover:scale-110 transition-transform" />
                <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1.5">
                  {favCount}
                </span>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Favourite
                </span>
              </Link>

              {/* Vertical Divider */}
              <div className="w-px h-10 bg-neutral-200 dark:bg-white/10" />

              {/* Column 2: Ticket Booked */}
              <Link
                to="/my-tickets"
                className="flex flex-col items-center group cursor-pointer"
              >
                <Ticket className="w-5 h-5 text-[#B90101] group-hover:scale-110 transition-transform" />
                <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1.5">
                  {bookedCount}
                </span>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Ticket Booked
                </span>
              </Link>

              {/* Vertical Divider */}
              <div className="w-px h-10 bg-neutral-200 dark:bg-white/10" />

              {/* Column 3: Point Earned */}
              <div className="flex flex-col items-center">
                <Star className="w-5 h-5 text-[#B90101] fill-[#B90101]" />
                <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-1.5">
                  {earnedPoints}
                </span>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Point Earned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Booking History (md:col-span-7) */}
        <div className="md:col-span-7 rounded-[28px] border border-neutral-200 dark:border-white/10 bg-white/90 dark:bg-[#1A1F25]/40 backdrop-blur-xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                Booking History
              </h3>
              <Link
                to="/my-tickets"
                className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-[#B90101] transition"
              >
                VIEW ALL
              </Link>
            </div>

            {/* Red Underline Indicator */}
            <div className="h-0.5 w-full bg-gradient-to-r from-[#B90101] via-[#B90101]/40 to-transparent mt-3 mb-4" />

            {/* Bookings List */}
            <div className="space-y-2.5">
              {displayBookings.length > 0 ? (
                displayBookings.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-black/20 hover:border-[#B90101]/40 transition"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {item.date}
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-[#B90101] shrink-0" />
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-neutral-400">
                  No cinema booking history found yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Delete Account?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Are you sure you want to delete your account? All your profile
              information and data will be permanently removed from the cinema
              database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-full text-xs font-bold text-neutral-500 hover:text-neutral-700 dark:hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-5 py-2 rounded-full bg-[#B90101] text-white text-xs font-bold hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
