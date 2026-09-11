import { Check } from "lucide-react";

export default function BookingStepper({ currentStep = 2 }) {
  return (
    <div className="w-full rounded-full border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-sm">
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
        {/* Step 1: Showtime (Completed) */}
        <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#B90101] text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
          </span>
          <span className="hidden xs:inline sm:inline">Show time</span>
        </div>

        {/* Red connecting line */}
        <div className="flex-1 mx-2 sm:mx-4 h-0.5 bg-[#B90101]" />

        {/* Step 2: Choose seat (Active) */}
        <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#B90101] text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
          </span>
          <span>Choose seat</span>
        </div>

        {/* Grey connecting line */}
        <div className="flex-1 mx-2 sm:mx-4 h-0.5 bg-neutral-300 dark:bg-white/20" />

        {/* Step 3: Booking Details */}
        <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500">
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-neutral-300 dark:border-white/20 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[2] opacity-40" />
          </span>
          <span className="hidden sm:inline">Booking Details</span>
        </div>

        {/* Grey connecting line */}
        <div className="flex-1 mx-2 sm:mx-4 h-0.5 bg-neutral-300 dark:bg-white/20" />

        {/* Step 4: Confirmed */}
        <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500">
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-neutral-300 dark:border-white/20 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[2] opacity-40" />
          </span>
          <span className="hidden md:inline">Confirmed</span>
        </div>
      </div>
    </div>
  );
}
