import { useState, useMemo } from "react";
import SeatIcon from "./SeatIcon";

const getFallbackSvg = (initials, bg) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="30" fill="${encodeURIComponent(bg)}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="%23ffffff">${initials}</text></svg>`;

const STANDARD_ROW_A_PAIRS = [
  [1, 2],
  [3, 4],
  [6, 7],
  [9, 10],
  [11, 12],
];

export default function DynamicSeatMap({
  seats = [],
  selectedSeats = [],
  onSeatClick,
  groupSeatAvatars = {},
  hallType = "standard",
}) {
  const [hoveredCoupleKey, setHoveredCoupleKey] = useState(null);

  const isGold = hallType === "gold";

  const { sortedRows, maxCols, seatsByRow, coupleGroups } = useMemo(() => {
    if (!Array.isArray(seats) || seats.length === 0) {
      return { sortedRows: [], maxCols: 0, seatsByRow: {}, coupleGroups: {} };
    }

    const rowMap = {};
    const groupMap = {};
    let max = 0;

    seats.forEach((seat) => {
      const row = seat.rowLabel ?? "A";
      if (!rowMap[row]) {
        rowMap[row] = [];
      }
      rowMap[row].push(seat);

      if (seat.seatNumber > max) {
        max = seat.seatNumber;
      }

      if (seat.groupUuid) {
        if (!groupMap[seat.groupUuid]) {
          groupMap[seat.groupUuid] = [];
        }
        groupMap[seat.groupUuid].push(seat);
      }
    });

    if (!isGold && max < 12) {
      max = 12;
    }

    Object.keys(rowMap).forEach((r) => {
      rowMap[r].sort((a, b) => a.seatNumber - b.seatNumber);
    });

    const sorted = Object.keys(rowMap).sort((a, b) => b.localeCompare(a));

    return {
      sortedRows: sorted,
      maxCols: max,
      seatsByRow: rowMap,
      coupleGroups: groupMap,
    };
  }, [seats, isGold]);

  const colGroups = useMemo(() => {
    if (isGold) {
      return [
        [1, 2],
        [3, 4],
        [5, 6],
      ];
    }
    if (maxCols >= 12) {
      return [
        [1, 2],
        [3, 4, 5, 6, 7, 8, 9, 10],
        [11, 12],
      ];
    }
    if (maxCols >= 10) {
      return [
        [1, 2],
        [3, 4, 5, 6, 7, 8],
        [9, 10],
      ];
    }
    return [Array.from({ length: maxCols }, (_, i) => i + 1)];
  }, [isGold, maxCols]);

  const isSelected = (seat) =>
    selectedSeats.some(
      (s) => s.seatUuid === seat.seatUuid || s.id === seat.seatLabel,
    );

  const isReserved = (seat) => seat.availability !== "AVAILABLE";

  const getCouplePartnerSeats = (seat, rowLetter, col) => {
    if (seat.groupUuid && coupleGroups[seat.groupUuid]?.length > 1) {
      return coupleGroups[seat.groupUuid];
    }

    if (rowLetter === "A") {
      const pairNumbers = STANDARD_ROW_A_PAIRS.find((p) => p.includes(col));
      if (pairNumbers) {
        const rowSeats = seatsByRow[rowLetter] ?? [];
        const partnerCol =
          pairNumbers[0] === col ? pairNumbers[1] : pairNumbers[0];
        const partnerSeat = findSeatForCol(rowSeats, rowLetter, partnerCol);
        if (partnerSeat) {
          return [seat, partnerSeat];
        }
      }
    }

    return [seat];
  };

  const findSeatForCol = (rowSeats, rowLetter, col) => {
    const direct = rowSeats.find((s) => s.seatNumber === col);
    if (direct) return direct;

    if (rowLetter === "A" && rowSeats.length === 10) {
      const coupleSlots = [1, 2, 3, 4, 6, 7, 9, 10, 11, 12];
      const slotIdx = coupleSlots.indexOf(col);
      if (slotIdx >= 0 && rowSeats[slotIdx]) {
        return rowSeats[slotIdx];
      }
    }

    return null;
  };

  const handleSeatClick = (seat, rowLetter, col) => {
    if (isReserved(seat)) return;

    const partnerSeats = getCouplePartnerSeats(seat, rowLetter, col);
    const isCouple = partnerSeats.length > 1;

    if (partnerSeats.some(isReserved)) return;

    const bothSelected = partnerSeats.every(isSelected);
    onSeatClick(partnerSeats, isCouple, !bothSelected);
  };

  if (sortedRows.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-500 dark:text-neutral-400 font-sans">
        <p className="text-sm font-semibold">
          No seat layout found for this hall.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2 sm:space-y-4 select-none overflow-x-auto py-1 sm:py-2">
      <div className="flex items-center justify-between gap-1 sm:gap-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 mx-auto">
        <span className="w-4 sm:w-8" />
        <div className="flex items-center gap-1.5 sm:gap-6">
          {colGroups.map((group, gIdx) => (
            <div
              key={gIdx}
              className={`flex items-center ${
                isGold ? "gap-1.5 sm:gap-4" : "gap-0.5 sm:gap-2"
              }`}
            >
              {group.map((col) => (
                <div
                  key={col}
                  className={`p-0 flex items-center justify-center text-center font-bold text-[10px] sm:text-xs text-neutral-700 dark:text-neutral-300 ${
                    isGold
                      ? "w-7 min-w-7 sm:w-10 sm:min-w-10"
                      : "w-[20px] min-w-[20px] sm:w-8 sm:min-w-8"
                  }`}
                >
                  <span>{col}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <span className="w-4 sm:w-8" />
      </div>

      <div className="space-y-1.5 sm:space-y-3.5 mx-auto">
        {sortedRows.map((rowLetter) => {
          const rowSeats = seatsByRow[rowLetter] ?? [];
          const isRowA = rowLetter === "A";

          return (
            <div
              key={rowLetter}
              className={`flex items-center justify-between gap-1 sm:gap-4 ${
                isRowA ? "pt-2 sm:pt-4" : ""
              }`}
            >
              <span className="w-4 sm:w-8 text-center font-black text-xs sm:text-base text-neutral-900 dark:text-neutral-100">
                {rowLetter}
              </span>

              <div className="flex items-center gap-1.5 sm:gap-6">
                {colGroups.map((group, gIdx) => (
                  <div
                    key={gIdx}
                    className={`flex items-center ${
                      isGold ? "gap-1.5 sm:gap-4" : "gap-0.5 sm:gap-2"
                    }`}
                  >
                    {group.map((col) => {
                      if (isRowA && (col === 5 || col === 8)) {
                        return (
                          <div
                            key={`spacer-${rowLetter}-${col}`}
                            className={`p-0 ${
                              isGold
                                ? "w-7 min-w-7 sm:w-10 sm:min-w-10"
                                : "w-[20px] min-w-[20px] sm:w-8 sm:min-w-8"
                            }`}
                            aria-hidden="true"
                          />
                        );
                      }

                      const seat = findSeatForCol(rowSeats, rowLetter, col);

                      if (!seat) {
                        return (
                          <div
                            key={`empty-${rowLetter}-${col}`}
                            className={`p-0 ${
                              isGold
                                ? "w-7 min-w-7 sm:w-10 sm:min-w-10"
                                : "w-[20px] min-w-[20px] sm:w-8 sm:min-w-8"
                            }`}
                            aria-hidden="true"
                          />
                        );
                      }

                      const seatId = seat.seatLabel;
                      const reserved = isReserved(seat);
                      const selected = isSelected(seat);

                      const couplePair = isRowA
                        ? STANDARD_ROW_A_PAIRS.find((p) => p.includes(col))
                        : null;
                      const coupleKey = couplePair
                        ? `A-${couplePair[0]}-${couplePair[1]}`
                        : seat.groupUuid
                          ? seat.groupUuid
                          : null;
                      const isCouple = Boolean(coupleKey);
                      const isCoupleHovered =
                        coupleKey && hoveredCoupleKey === coupleKey;

                      const avatarInfo = groupSeatAvatars[seatId];
                      const status = reserved
                        ? "reserved"
                        : selected
                          ? "selected"
                          : "available";

                      if (avatarInfo) {
                        return (
                          <button
                            key={seat.seatUuid ?? seatId}
                            type="button"
                            onClick={() => {
                              if (!avatarInfo.isLocked) {
                                handleSeatClick(seat, rowLetter, col);
                              }
                            }}
                            className={`p-0 rounded-lg transition-transform flex items-center justify-center ${
                              isGold
                                ? "w-7 min-w-7 sm:w-10 sm:min-w-10"
                                : "w-[20px] min-w-[20px] sm:w-8 sm:min-w-8"
                            } ${
                              avatarInfo.isLocked
                                ? "cursor-default opacity-95"
                                : "hover:scale-110 active:scale-95 cursor-pointer"
                            }`}
                            aria-label={`Seat ${seatId} (${avatarInfo.name})`}
                            title={`Seat ${seatId} • ${avatarInfo.name}`}
                          >
                            <div
                              className="w-[18px] h-[18px] sm:w-[28px] sm:h-[28px] mx-auto rounded-full overflow-hidden border sm:border-2 shadow-sm flex items-center justify-center bg-neutral-800"
                              style={{ borderColor: avatarInfo.color }}
                            >
                              <img
                                src={avatarInfo.avatar}
                                alt={avatarInfo.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = getFallbackSvg(
                                    avatarInfo.initials ?? "U",
                                    avatarInfo.color,
                                  );
                                }}
                              />
                            </div>
                          </button>
                        );
                      }

                      return (
                        <button
                          key={seat.seatUuid ?? seatId}
                          type="button"
                          onClick={() => handleSeatClick(seat, rowLetter, col)}
                          disabled={reserved}
                          onMouseEnter={() =>
                            coupleKey && setHoveredCoupleKey(coupleKey)
                          }
                          onMouseLeave={() => setHoveredCoupleKey(null)}
                          className={`relative p-0 rounded-lg transition-all flex items-center justify-center ${
                            isGold
                              ? "w-7 min-w-7 sm:w-10 sm:min-w-10"
                              : "w-[20px] min-w-[20px] sm:w-8 sm:min-w-8"
                          } ${
                            reserved
                              ? "cursor-not-allowed opacity-90"
                              : isCoupleHovered
                                ? "scale-110 active:scale-95 cursor-pointer"
                                : "hover:scale-110 active:scale-95 cursor-pointer"
                          }`}
                          aria-label={`Seat ${seatId} ${status}`}
                          title={
                            isCouple && couplePair
                              ? `Couple Seat Pair A${couplePair[0]}-A${couplePair[1]} (${status})`
                              : `Seat ${seatId} (${status})`
                          }
                        >
                          <SeatIcon
                            status={status}
                            className={
                              isGold
                                ? "w-6 h-6 sm:w-9 sm:h-9"
                                : "w-[18px] h-[18px] sm:w-[26px] sm:h-[26px]"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <span className="w-4 sm:w-8 text-center font-black text-xs sm:text-base text-neutral-900 dark:text-neutral-100">
                {rowLetter}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}