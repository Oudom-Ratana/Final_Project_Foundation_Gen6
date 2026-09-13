import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";
import SeatIcon from "./SeatIcon";
import {
  GOLD_PRICE,
  STANDARD_SINGLE_PRICE,
  STANDARD_COUPLE_PRICE,
} from "../../data/seatLayoutData";

export default function SeatPricingCards({ hallType = "standard" }) {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  const glassCardStyle = {
    backgroundColor: isDark
      ? "var(--primary-color-30)"
      : "var(--primary-color-5)",
    borderColor: isDark
      ? "var(--border-dark-mode)"
      : "var(--border-light-mode)",
  };

  if (hallType === "gold") {
    return (
      <div className="flex items-center justify-center pt-4 select-none">
        <div
          className="w-40 sm:w-44 rounded-2xl sm:rounded-3xl border p-5 text-center flex flex-col items-center justify-center space-y-2 shadow-sm backdrop-blur-md"
          style={glassCardStyle}
        >
          <SeatIcon status="available" size={36} />
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-[#EAB308]">
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
    <div className="flex items-center justify-center gap-4 sm:gap-6 pt-4 select-none">
      {/* Single Seat Card */}
      <div
        className="w-36 sm:w-40 rounded-2xl sm:rounded-3xl border p-4 sm:p-5 text-center flex flex-col items-center justify-center space-y-2 shadow-sm backdrop-blur-md"
        style={glassCardStyle}
      >
        <SeatIcon status="available" size={30} />
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
      <div
        className="w-36 sm:w-40 rounded-2xl sm:rounded-3xl border p-4 sm:p-5 text-center flex flex-col items-center justify-center space-y-2 shadow-sm backdrop-blur-md"
        style={glassCardStyle}
      >
        <div className="flex items-center gap-1.5 justify-center">
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
