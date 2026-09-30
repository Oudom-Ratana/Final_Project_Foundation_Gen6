import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";
import SeatIcon from "./SeatIcon";
import {
  GOLD_PRICE,
  STANDARD_SINGLE_PRICE,
  STANDARD_COUPLE_PRICE,
} from "../../data/seatLayoutData";

export default function SeatPricingCards({
  hallType = "standard",
  price = null,
}) {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";

  const singlePrice =
    price != null
      ? parseFloat(price)
      : hallType === "gold"
        ? GOLD_PRICE
        : STANDARD_SINGLE_PRICE;

  const couplePrice =
    price != null ? parseFloat(price) * 2 : STANDARD_COUPLE_PRICE;

  const glassCardStyle = {
    backgroundColor: isDark
      ? "var(--primary-color-30)"
      : "white",
    borderColor: isDark
      ? "var(--border-dark-mode)"
      : "var(--border-light-mode)",
  };

  if (hallType === "gold") {
    return (
      <div className="flex items-center justify-center pt-2 select-none">
        <div
          className="w-40 sm:w-52 rounded-2xl sm:rounded-3xl border p-4 sm:p-6 text-center flex flex-col items-center justify-center space-y-2 sm:space-y-2.5 shadow-sm backdrop-blur-md"
          style={glassCardStyle}
        >
          <SeatIcon status="available" size={34} />
          <div>
            <h4 className="font-extrabold text-xs sm:text-base text-[#EAB308]">
              Gold Class
            </h4>
            <p className="font-black text-base sm:text-xl text-neutral-900 dark:text-white">
              ${singlePrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-8 pt-2 select-none w-full max-w-md mx-auto">
      <div
        className="flex-1 max-w-[155px] sm:max-w-none sm:w-48 rounded-2xl sm:rounded-3xl border p-3.5 sm:p-6 text-center flex flex-col items-center justify-center space-y-1.5 sm:space-y-2.5 shadow-sm backdrop-blur-md transition-all hover:scale-102"
        style={glassCardStyle}
      >
        <SeatIcon status="available" size={30} />
        <div>
          <h4 className="font-bold text-xs sm:text-base text-neutral-900 dark:text-white">
            Single Seat
          </h4>
          <p className="font-black text-base sm:text-xl text-neutral-900 dark:text-white">
            ${singlePrice.toFixed(2)}
          </p>
        </div>
      </div>

      <div
        className="flex-1 max-w-[155px] sm:max-w-none sm:w-48 rounded-2xl sm:rounded-3xl border p-3.5 sm:p-6 text-center flex flex-col items-center justify-center space-y-1.5 sm:space-y-2.5 shadow-sm backdrop-blur-md transition-all hover:scale-102"
        style={glassCardStyle}
      >
        <div className="flex items-center gap-1 justify-center">
          <SeatIcon status="available" size={26} />
          <SeatIcon status="available" size={26} />
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-base text-neutral-900 dark:text-white">
            Couple Seat
          </h4>
          <p className="font-black text-base sm:text-xl text-neutral-900 dark:text-white">
            ${couplePrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}