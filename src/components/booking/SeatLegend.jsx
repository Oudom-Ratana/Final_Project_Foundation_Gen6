import { Check } from "lucide-react";

export default function SeatLegend() {
  return (
    <div className="flex items-center justify-center gap-8 sm:gap-14 pt-2 text-xs sm:text-sm font-bold select-none">
      {/* Available */}
      <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
        <span className="w-4 h-4 rounded-full border-2 border-neutral-400 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 stroke-[3] text-neutral-400" />
        </span>
        <span>Available</span>
      </div>

      {/* Selected */}
      <div className="flex items-center gap-2 text-[#EAB308]">
        <span className="w-4 h-4 rounded-full border-2 border-[#EAB308] flex items-center justify-center">
          <Check className="w-2.5 h-2.5 stroke-[3] text-[#EAB308]" />
        </span>
        <span>Selected</span>
      </div>

      {/* Reserved */}
      <div className="flex items-center gap-2 text-[#B90101]">
        <span className="w-4 h-4 rounded-full border-2 border-[#B90101] flex items-center justify-center">
          <Check className="w-2.5 h-2.5 stroke-[3] text-[#B90101]" />
        </span>
        <span>Reserved</span>
      </div>
    </div>
  );
}
