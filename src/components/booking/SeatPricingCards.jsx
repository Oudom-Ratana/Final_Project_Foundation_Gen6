import SeatIcon from "./SeatIcon";
import {
  GOLD_PRICE,
  STANDARD_SINGLE_PRICE,
  STANDARD_COUPLE_PRICE,
} from "../../data/seatLayoutData";

export default function SeatPricingCards({ hallType = "standard" }) {
  if (hallType === "gold") {
    return (
      <div className="flex items-center justify-center pt-4">
        <div className="w-40 sm:w-44 rounded-3xl border border-[var(--border-light-mode)] bg-[var(--primary-color-5)] dark:bg-[var(--primary-color-30)] dark:border-[var(--border-dark-mode)] p-5 text-center flex flex-col items-center justify-center space-y-2 shadow-md">
          <SeatIcon status="available" size={38} />
          <div>
            <h4 className="font-extrabold text-sm text-[#EAB308]">
              Gold Class
            </h4>
            <p className="font-black text-base sm:text-lg text-neutral-900 dark:text-white">
              ${GOLD_PRICE.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 pt-4">
      {/* Single Seat Card */}
      <div className="w-36 sm:w-40 rounded-3xl border border-[var(--border-light-mode)] bg-[var(--primary-color-5)] dark:bg-[var(--primary-color-30)] dark:border-[var(--border-dark-mode)] p-4 sm:p-5 text-center flex flex-col items-center justify-center space-y-1.5 shadow-md">
        <SeatIcon status="available" size={32} />
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
            Single Seat
          </h4>
          <p className="font-black text-sm sm:text-base text-neutral-900 dark:text-white">
            ${STANDARD_SINGLE_PRICE.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Couple Seat Card */}
      <div className="w-36 sm:w-40 rounded-3xl border border-[var(--border-light-mode)] bg-[var(--primary-color-5)] dark:bg-[var(--primary-color-30)] dark:border-[var(--border-dark-mode)] p-4 sm:p-5 text-center flex flex-col items-center justify-center space-y-1.5 shadow-md">
        <div className="flex items-center gap-1 justify-center">
          <SeatIcon status="available" size={26} />
          <SeatIcon status="available" size={26} />
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
            Couple Seat
          </h4>
          <p className="font-black text-sm sm:text-base text-neutral-900 dark:text-white">
            ${STANDARD_COUPLE_PRICE.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
