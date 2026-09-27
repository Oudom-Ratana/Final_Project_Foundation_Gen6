import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";
import { Users, Info, UserPlus } from "lucide-react";

const getFallbackSvg = (initials, bg = "#EAB308") =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${encodeURIComponent(
    bg
  )}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="38" fill="%23ffffff">${initials}</text></svg>`;

export default function GroupSeatLegend({
  mySeats = [],
  members = [],
  onOpenInviteModal,
}) {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";
  const currentUser = useSelector((state) => state.auth?.user);

  const mySeatLabel = mySeats.length > 0 ? mySeats.join(", ") : "Select a seat";

  const userInitials = (currentUser?.firstName?.[0] || currentUser?.name?.[0] || "U").toUpperCase();
  const userName = currentUser?.firstName
    ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
    : currentUser?.name || "You";
  const userAvatar = currentUser?.avatar || currentUser?.profileImage || currentUser?.imageUrl;

  // Filter out the current user to get friends
  const otherMembers = Array.isArray(members)
    ? members.filter(
        (m) =>
          m.userUuid !== currentUser?.uuid &&
          m.userUuid !== currentUser?.id &&
          m.uuid !== currentUser?.uuid
      )
    : [];

  const glassCardStyle = {
    backgroundColor: isDark
      ? "var(--primary-color-30)"
      : "var(--primary-color-5)",
    borderColor: isDark
      ? "var(--border-dark-mode)"
      : "var(--border-light-mode)",
  };

  return (
    <div className="w-full space-y-3 pt-2 select-none">
      <div className="flex flex-col md:flex-row items-stretch gap-4">
        {/* Left Card: Legend + Your Seat / Friends Seat */}
        <div
          className="flex-1 rounded-2xl sm:rounded-3xl border p-5 sm:p-6 space-y-4 shadow-sm backdrop-blur-md transition-all"
          style={glassCardStyle}
        >
          {/* Row 1: AVAILABLE / SELECTED / RESERVED Status Dots */}
          <div className="flex items-center justify-around text-xs sm:text-sm font-black tracking-wider">
            {/* Available */}
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <span className="w-4 h-4 rounded-full bg-[#B5B0B0] shadow-xs" />
              <span className="uppercase">AVAILABLE</span>
            </div>

            {/* Selected */}
            <div className="flex items-center gap-2 text-[#EAB308]">
              <span className="w-4 h-4 rounded-full bg-[#FFD700] shadow-xs" />
              <span className="uppercase">SELECTED</span>
            </div>

            {/* Reserved */}
            <div className="flex items-center gap-2 text-[#B90101]">
              <span className="w-4 h-4 rounded-full bg-[#B90101] shadow-xs" />
              <span className="uppercase">RESERVED</span>
            </div>
          </div>

          <div className="border-t border-neutral-300/60 dark:border-white/15 my-2" />

          {/* Row 2: YOUR SEAT / FRIENDS SEAT */}
          <div className="flex items-center justify-around pt-1">
            {/* YOUR SEAT */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full overflow-hidden border-[3px] shadow-md transition-transform hover:scale-105 flex items-center justify-center bg-amber-500/10 text-amber-500 font-bold"
                style={{ borderColor: "#FFD700" }}
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getFallbackSvg(userInitials, "#EAB308");
                    }}
                  />
                ) : (
                  <span className="text-base font-black">{userInitials}</span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                YOUR SEAT
              </span>
            </div>

            {/* FRIENDS SEAT */}
            <div className="flex flex-col items-center gap-2">
              {otherMembers.length > 0 ? (
                <div className="flex items-center -space-x-2.5">
                  {otherMembers.slice(0, 3).map((friend, idx) => {
                    const fInitial = (friend.firstName?.[0] || "F").toUpperCase();
                    return (
                      <div
                        key={friend.uuid || idx}
                        className="w-12 h-12 rounded-full overflow-hidden border-[3px] border-emerald-500 shadow-md relative z-10 transition-transform hover:scale-105 bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-black"
                      >
                        {friend.avatar ? (
                          <img
                            src={friend.avatar}
                            alt={friend.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{fInitial}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenInviteModal}
                  className="w-12 h-12 rounded-full border-2 border-dashed border-neutral-400 dark:border-neutral-600 flex items-center justify-center text-neutral-400 hover:text-[#B90101] dark:hover:text-[#FFD700] hover:border-[#B90101] dark:hover:border-[#FFD700] transition active:scale-95 cursor-pointer"
                  title="Invite Friends"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
              )}
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                {otherMembers.length > 0
                  ? `FRIENDS (${otherMembers.length})`
                  : "NO FRIENDS YET"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: LIVE PRESENCE */}
        <div
          className="w-full md:w-64 rounded-2xl sm:rounded-3xl border p-5 sm:p-6 shadow-sm backdrop-blur-md flex flex-col justify-between"
          style={glassCardStyle}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-black text-[#B90101] uppercase tracking-wider">
                  LIVE PRESENCE
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                {1 + otherMembers.length} {1 + otherMembers.length === 1 ? "Person" : "People"}
              </span>
            </div>

            <div className="space-y-3">
              {/* You */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden border-[2.5px] shadow-sm shrink-0 flex items-center justify-center bg-amber-500/10 text-amber-500 font-bold"
                  style={{ borderColor: "#FFD700" }}
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = getFallbackSvg(userInitials, "#EAB308");
                      }}
                    />
                  ) : (
                    <span className="text-xs font-black">{userInitials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {userName} (You)
                  </p>
                  <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                    Seat {mySeatLabel}
                  </p>
                </div>
              </div>

              {/* Real Friends List */}
              {otherMembers.length > 0 ? (
                otherMembers.map((member, idx) => {
                  const mName = member.firstName
                    ? `${member.firstName} ${member.lastName || ""}`.trim()
                    : `Squad Member ${idx + 1}`;
                  const mInit = (member.firstName?.[0] || "M").toUpperCase();
                  const isReady = member.status === "READY" || member.status === "CONFIRMED";

                  return (
                    <div key={member.uuid || idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-[2.5px] border-emerald-500 shadow-sm shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-600 font-bold">
                        {member.avatar ? (
                          <img src={member.avatar} alt={mName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-black">{mInit}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                          {mName}
                        </p>
                        <p
                          className={`text-[10px] font-black uppercase tracking-wider ${
                            isReady ? "text-emerald-500" : "text-amber-500"
                          }`}
                        >
                          {member.status || "SELECTING"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-dashed border-neutral-300 dark:border-white/10 text-center space-y-1.5 mt-2">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    No friends have joined yet.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenInviteModal}
                    className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#B90101] dark:text-[#FFD700] hover:underline cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite Friends</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Helper info pill */}
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs text-neutral-700 dark:text-neutral-300 backdrop-blur-md"
        style={glassCardStyle}
      >
        <Info className="w-4 h-4 text-[#B90101] shrink-0" />
        <p className="leading-snug">
          <strong className="text-neutral-900 dark:text-white">
            Group Booking:
          </strong>{" "}
          Share the invite link so friends can choose their seats. When everyone is ready, the host completes payment for the group.
        </p>
      </div>
    </div>
  );
}
