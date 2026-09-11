import { useState } from "react";
import SeatIcon from "./SeatIcon";
import {
  STANDARD_ROWS,
  STANDARD_COL_GROUPS,
  STANDARD_COUPLE_PRICE,
  COUPLE_PAIRS,
} from "../../data/seatLayoutData";

export default function StandardHallSeatMap({
  isSeatReserved,
  isSeatSelected,
  onSeatClick,
}) {
  const [hoveredCouple, setHoveredCouple] = useState(null);

  return (
    <div className="min-w-[660px] max-w-3xl mx-auto space-y-3.5 sm:space-y-4 select-none">
      {/* Column Numbers Header: 1-2, 3-10, 11-12 (100% pixel-perfect alignment with seats) */}
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
        <span className="w-6" />
        <div className="flex items-center gap-3 sm:gap-5">
          {STANDARD_COL_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="flex items-center gap-1.5 sm:gap-2">
              {group.map((col) => (
                <div
                  key={col}
                  className="p-0.5 flex items-center justify-center text-center"
                  style={{ width: 34, minWidth: 34 }}
                >
                  <span>{col}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <span className="w-6" />
      </div>

      {/* Upper Rows: H down to B (12 seats per row) */}
      <div className="space-y-3.5 sm:space-y-4">
        {STANDARD_ROWS.filter((r) => r !== "A").map((rowLetter) => (
          <div
            key={rowLetter}
            className="flex items-center justify-between gap-2"
          >
            {/* Left Row Letter */}
            <span className="w-6 text-center font-bold text-sm sm:text-base text-neutral-800 dark:text-neutral-200">
              {rowLetter}
            </span>

            {/* Columns: Left (1-2), Center (3-10), Right (11-12) */}
            <div className="flex items-center gap-3 sm:gap-5">
              {STANDARD_COL_GROUPS.map((group, gIdx) => (
                <div key={gIdx} className="flex items-center gap-1.5 sm:gap-2">
                  {group.map((col) => {
                    const seatId = `${rowLetter}${col}`;
                    const isReserved = isSeatReserved(seatId);
                    const isSelected = isSeatSelected(seatId);
                    const status = isReserved
                      ? "reserved"
                      : isSelected
                        ? "selected"
                        : "available";

                    return (
                      <button
                        key={seatId}
                        type="button"
                        onClick={() => onSeatClick(rowLetter, col, false)}
                        disabled={isReserved}
                        className={`p-0.5 rounded-lg transition-transform ${
                          isReserved
                            ? "cursor-not-allowed opacity-95"
                            : "hover:scale-110 active:scale-95 cursor-pointer"
                        }`}
                        aria-label={`Seat ${seatId} ${status}`}
                      >
                        <SeatIcon status={status} size={30} />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Right Row Letter */}
            <span className="w-6 text-center font-bold text-sm sm:text-base text-neutral-800 dark:text-neutral-200">
              {rowLetter}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Row A: Couple Seats (Centered into the middle with equal spacing between pairs via justify-around) */}
      <div className="pt-6 sm:pt-8">
        <div className="flex items-center justify-between gap-2">
          {/* Left Row Letter */}
          <span className="w-6 text-center font-bold text-sm sm:text-base text-neutral-800 dark:text-neutral-200">
            A
          </span>

          {/* Centered with equal space between each couple pair (justify-around) */}
          <div className="flex-1 flex items-center justify-around px-1 sm:px-6">
            {COUPLE_PAIRS.map((pair, pIdx) => {
              const [col1, col2] = pair;
              const pairKey = `A-${col1}-${col2}`;
              const isPairHovered = hoveredCouple === pairKey;

              return (
                <div
                  key={pIdx}
                  className={`flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl transition-all duration-200 ${
                    isPairHovered
                      ? "scale-105 bg-amber-500/10 dark:bg-amber-400/10 shadow-sm"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredCouple(pairKey)}
                  onMouseLeave={() => setHoveredCouple(null)}
                >
                  {pair.map((col) => {
                    const seatId = `A${col}`;
                    const isReserved = isSeatReserved(seatId);
                    const isSelected = isSeatSelected(seatId);
                    const status = isReserved
                      ? "reserved"
                      : isSelected
                        ? "selected"
                        : "available";

                    return (
                      <button
                        key={seatId}
                        type="button"
                        onClick={() => onSeatClick("A", col, true)}
                        disabled={isReserved}
                        className={`p-0.5 rounded-lg transition-transform ${
                          isReserved
                            ? "cursor-not-allowed opacity-95"
                            : "cursor-pointer active:scale-95"
                        }`}
                        aria-label={`Couple Seat ${seatId} ${status}`}
                        title={`Couple Seat Pair A${col1}-A${col2} ($${STANDARD_COUPLE_PRICE.toFixed(2)})`}
                      >
                        <SeatIcon status={status} size={30} />
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Right Row Letter */}
          <span className="w-6 text-center font-bold text-sm sm:text-base text-neutral-800 dark:text-neutral-200">
            A
          </span>
        </div>
      </div>
    </div>
  );
}
