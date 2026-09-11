import SeatIcon from "./SeatIcon";
import { GOLD_ROWS, GOLD_COL_GROUPS } from "../../data/seatLayoutData";

export default function GoldClassSeatMap({
  isSeatReserved,
  isSeatSelected,
  onSeatClick,
}) {
  return (
    <div className="min-w-[480px] max-w-xl mx-auto space-y-4 sm:space-y-5 select-none">
      {/* Column Numbers Header: 1-2, 3-4, 5-6 (100% pixel-perfect alignment with seats) */}
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
        <span className="w-6" />
        <div className="flex items-center gap-4 sm:gap-6">
          {GOLD_COL_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="flex items-center gap-2 sm:gap-3">
              {group.map((col) => (
                <div
                  key={col}
                  className="p-1 flex items-center justify-center text-center"
                  style={{ width: 44, minWidth: 44 }}
                >
                  <span>{col}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <span className="w-6" />
      </div>

      {/* Rows F down to A */}
      {GOLD_ROWS.map((rowLetter) => (
        <div
          key={rowLetter}
          className="flex items-center justify-between gap-2"
        >
          {/* Left Row Letter */}
          <span className="w-6 text-center font-bold text-sm sm:text-base text-neutral-800 dark:text-neutral-200">
            {rowLetter}
          </span>

          {/* 3 Blocks of 2 VIP Recliners */}
          <div className="flex items-center gap-4 sm:gap-6">
            {GOLD_COL_GROUPS.map((group, gIdx) => (
              <div key={gIdx} className="flex items-center gap-2 sm:gap-3">
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
                      className={`p-1 rounded-xl transition-transform ${
                        isReserved
                          ? "cursor-not-allowed opacity-95"
                          : "hover:scale-110 active:scale-95 cursor-pointer"
                      }`}
                      aria-label={`Seat ${seatId} ${status}`}
                    >
                      <SeatIcon status={status} size={36} />
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
  );
}
