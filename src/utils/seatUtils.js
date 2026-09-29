// Clean extraction of seat labels from member or booking payload
export const extractSeatLabels = (target) => {
  if (!target) return [];
  if (Array.isArray(target)) {
    return target.flatMap(extractSeatLabels);
  }
  if (typeof target === "string") {
    return target.includes(",") ? target.split(",").map((s) => s.trim()) : [target];
  }
  if (Array.isArray(target.seats)) {
    return target.seats.flatMap(extractSeatLabels);
  }
  if (Array.isArray(target.seatLabels)) {
    return target.seatLabels.flatMap(extractSeatLabels);
  }
  if (Array.isArray(target.tickets)) {
    return target.tickets.flatMap((t) => extractSeatLabels(t.seatLabel ?? t.seat ?? t));
  }
  if (target.seatLabel) {
    return [target.seatLabel];
  }
  if (target.rowLabel && target.seatNumber) {
    return [`${target.rowLabel}${target.seatNumber}`];
  }
  return [];
};

// Builds avatar and presence mapping for group booking seat visualizer
export const buildGroupSeatAvatars = ({
  bookingType,
  selectedSeats = [],
  currentUser = null,
  activeGroupUuid = null,
  groupMembers = [],
  memberSeatsMap = {},
}) => {
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

  const currentUserId = currentUser?.uuid ?? currentUser?.id ?? "me";
  const palette = ["#10B981", "#6366F1", "#EC4899", "#F59E0B", "#3B82F6", "#8B5CF6", "#14B8A6"];

  // 1. Map squad members from server
  if (activeGroupUuid && Array.isArray(groupMembers) && groupMembers.length > 0) {
    groupMembers.forEach((member, index) => {
      const mUserUuid = member.userUuid ?? member.uuid;
      if (mUserUuid === currentUserId || member.uuid === currentUserId) return;

      const memberKey = member.uuid ?? member.userUuid;
      const memberSeats = memberSeatsMap[memberKey] ?? extractSeatLabels(member.seats ?? member.booking);

      if (Array.isArray(memberSeats) && memberSeats.length > 0) {
        const memberColor = palette[index % palette.length];
        const memberName = member.firstName
          ? `${member.firstName} ${member.lastName ?? ""}`.trim()
          : (member.name ?? `Friend ${index + 1}`);
        const memberInitial = (memberName[0] ?? "F").toUpperCase();
        const memberAvatar =
          member.avatarUrl ??
          member.avatar ??
          member.profileImage ??
          `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=${memberColor.replace("#", "")}&color=fff&size=128&bold=true`;

        memberSeats.forEach((seatId) => {
          map[seatId] = {
            avatar: memberAvatar,
            color: memberColor,
            name: memberName,
            initials: memberInitial,
            isLocked: true,
          };
        });
      }
    });
  }

  // 2. Map localStorage squad data for instant multi-tab sync
  if (activeGroupUuid) {
    try {
      const groupSeatsKey = `group_seats_${activeGroupUuid}`;
      const rawSquad = localStorage.getItem(groupSeatsKey);
      const squadData = rawSquad ? JSON.parse(rawSquad) : {};

      Object.entries(squadData).forEach(([uId, data], index) => {
        if (uId !== currentUserId && Array.isArray(data?.seats)) {
          const memberColor = palette[index % palette.length];
          const memberName = data.userName ?? `Friend ${index + 1}`;
          const memberInitial = (memberName[0] ?? "F").toUpperCase();
          const memberAvatar =
            data.avatar ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=${memberColor.replace("#", "")}&color=fff&size=128&bold=true`;

          data.seats.forEach((seatId) => {
            if (!map[seatId]) {
              map[seatId] = {
                avatar: memberAvatar,
                color: memberColor,
                name: memberName,
                initials: memberInitial,
                isLocked: true,
              };
            }
          });
        }
      });
    } catch {
      // Safe fallback
    }
  }

  // 3. Current user selected seats get the gold ring avatar
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
};