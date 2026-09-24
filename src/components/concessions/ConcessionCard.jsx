import { Link } from "react-router";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/slices/uiSlice";

const BADGE_STYLES = {
  COMBO: "bg-[#B90101] text-white",
  FOOD: "bg-[#FFD700] text-neutral-900",
  DRINK: "bg-blue-600 text-white",
};

export default function ConcessionCard({ item }) {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";
  const { uuid, name, category, price, imageUrl } = item;

  return (
    <Link
      to={`/deals/${uuid}`}
      preventScrollReset={true}
      className={`group block rounded-xl border transition-shadow duration-200 hover:shadow-lg ${
        isDark ? "border-white/10" : "border-neutral-200"
      }`}
      style={{
        backgroundColor: isDark
          ? "var(--primary-color-30)"
          : "var(--primary-color-5)",
      }}
    >
      {/* Wrapper is NOT overflow-hidden, so the badge can float past the
          image's top-left corner instead of getting clipped. */}
      <div className="relative">
        <div className="overflow-hidden rounded-t-xl aspect-[4/3]">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {category && (
          <span
            className={`absolute -top-2 -left-2 sm:-top-3 sm:-left-3 z-10 uppercase font-extrabold text-[10px] sm:text-xs tracking-wide px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-lg -rotate-6 origin-center ${
              BADGE_STYLES[category] || "bg-neutral-800 text-white"
            }`}
          >
            {category}
          </span>
        )}
      </div>

      <div className="p-4 flex items-center justify-between gap-3">
        <h3
          className={`font-extrabold text-sm sm:text-base tracking-wide leading-tight ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          {name}
        </h3>
        <span
          className={`shrink-0 font-black text-2xl sm:text-3xl tracking-tight drop-shadow-sm ${
            isDark ? "text-[#FFD700]" : "text-[#B90101]"
          }`}
        >
          ${Number(price).toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
