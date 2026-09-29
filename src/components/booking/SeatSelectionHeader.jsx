import { ArrowLeft, User, Users } from "lucide-react";
import BookingStepper from "./BookingStepper";

export default function SeatSelectionHeader({
  onBack,
  movieTitle = "",
  branch = "",
  time = "",
  hallType = "standard",
  screenType = "2D",
  bookingType = "standard",
  onBookingTypeChange,
}) {
  return (
    <>
      {/* Top Navigation */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#B90101] dark:hover:text-[#B90101] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* 1. Top 4-Step Stepper */}
      <BookingStepper currentStep={2} />

      {/* 2. Sub-header: "Select Seat(s)" + Hall Format Pill */}
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-0.5">
          <h1 className="text-base sm:text-lg font-black text-[#B90101] tracking-tight">
            Select Seat(s)
          </h1>
          {movieTitle && (
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {movieTitle} • {branch} • {time}
            </p>
          )}
        </div>

        {/* Hall & Format Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300/80 dark:border-white/10 text-neutral-700 dark:text-neutral-300 font-bold text-xs bg-neutral-100 dark:bg-white/5 shadow-xs">
          <span className="tracking-wide">
            {hallType === "gold" ? "Gold Class VIP" : `${screenType} Standard`}
          </span>
        </div>
      </div>

      {/* Booking Type Switcher Bar (Standard vs Group) */}
      <div className="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-white dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] border border-neutral-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400">
            Booking Type:
          </span>
        </div>

        <div className="inline-flex p-1 rounded-full bg-neutral-100/50 border border-neutral-300 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] text-xs font-bold">
          <button
            type="button"
            onClick={() => onBookingTypeChange("standard")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              bookingType === "standard"
                ? "bg-[#B90101] text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Standard Booking</span>
          </button>
          <button
            type="button"
            onClick={() => onBookingTypeChange("group")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer ${
              bookingType === "group"
                ? "bg-[#B90101] text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group Booking</span>
          </button>
        </div>
      </div>
    </>
  );
}