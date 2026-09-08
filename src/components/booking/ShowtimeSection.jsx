import { useState } from "react";
import { ChevronDown, MessageSquare, Volume2 } from "lucide-react";
import {
  LOCATIONS,
  DATES,
  BRANCH_SHOWTIMES,
} from "../../data/cinemaShowtimeData";

/**
 * ShowtimeSection
 * Displays Cinema Location selector, Date picker cards, and Branch Showtime listings
 */
export default function ShowtimeSection({ onSelectShowtime }) {
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDate, setSelectedDate] = useState(DATES[1]); // Default to Aug 26
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const filteredBranches =
    selectedLocation === "All Locations"
      ? BRANCH_SHOWTIMES
      : BRANCH_SHOWTIMES.filter((b) => b.location === selectedLocation);

  const handleTimeClick = (branch, time) => {
    const slotKey = `${branch.id}-${time}`;
    setSelectedTimeSlot(slotKey);
    if (onSelectShowtime) {
      onSelectShowtime({
        branchId: branch.id,
        branchName: branch.branchName,
        hall: branch.hall,
        date: `${selectedDate.month} ${selectedDate.day} ${selectedDate.weekday}`,
        time: time,
        screenType: branch.screenType || branch.hall,
        subtitle: branch.subtitle,
        audio: branch.audio,
      });
    }
  };

  return (
    <section className="w-full space-y-8 font-sans select-none pt-4">
      {/* 1. Section Title: | Showtime */}
      <div className="flex items-center gap-3">
        <span
          className="w-1.5 h-7 rounded-full inline-block"
          style={{ backgroundColor: "#B90101" }}
        />
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
          Showtime
        </h2>
      </div>

      {/* 2. All Locations Dropdown Pill */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          className="w-full py-3.5 px-6 rounded-full border border-neutral-300 dark:border-white/20 bg-white dark:bg-[#14181E] flex items-center justify-between text-neutral-800 dark:text-neutral-100 font-bold text-base hover:border-[#B90101] transition shadow-xs"
        >
          <span className="mx-auto pl-6 font-bold">{selectedLocation}</span>
          <ChevronDown
            className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
              isLocationDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isLocationDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-2xl bg-white dark:bg-[#1A1F25] border border-neutral-200 dark:border-white/15 p-2 shadow-2xl space-y-1">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setSelectedLocation(loc);
                  setIsLocationDropdownOpen(false);
                }}
                className={`w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold transition ${
                  selectedLocation === loc
                    ? "bg-[#B90101] text-white"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Horizontal Date Selector Cards */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2">
        {DATES.slice(0, 3).map((d) => {
          const isSelected = selectedDate.id === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`relative min-w-[100px] sm:min-w-[110px] h-[75px] rounded-2xl border p-2.5 flex flex-col justify-between transition-all duration-200 ${
                isSelected
                  ? "border-neutral-400 dark:border-white/40 bg-neutral-200/90 dark:bg-white/15 shadow-md scale-105"
                  : "border-neutral-300 dark:border-white/15 bg-white dark:bg-neutral-900/60 hover:border-neutral-400 dark:hover:border-white/30"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                  {d.month}
                </span>
                <span className="text-2xl font-black text-neutral-900 dark:text-white leading-none">
                  {d.day}
                </span>
              </div>
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 text-left">
                {d.weekday}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Cinema Branch & Hall Showtime Cards List (Exact Match to Design) */}
      <div className="space-y-4 sm:space-y-5">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            className="w-full rounded-2xl sm:rounded-3xl border border-neutral-200/90 dark:border-white/10 bg-white dark:bg-[#14181E] p-5 sm:p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Top Row: Branch Name • Hall & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {branch.branchName}
                </h3>
                {branch.hall && (
                  <span className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    • {branch.hall}
                  </span>
                )}
              </div>

              {/* Right Badges: GOLD CLASS + 3D REALD + KH + EN + SCREEN Format */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                {/* Gold Class Amber Text */}
                {branch.goldClass && (
                  <span className="text-[11px] sm:text-xs font-black tracking-wider text-[#FFB800] uppercase">
                    GOLD CLASS
                  </span>
                )}

                {/* 3D RealD Cyan Badge */}
                {branch.realD3D && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black tracking-wider text-white bg-[#009EDC]">
                    3D REALD
                  </span>
                )}

                {/* KH Badge */}
                {branch.subtitle && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black text-white bg-[#B90101]">
                    {branch.subtitle}
                  </span>
                )}

                {/* EN Badge */}
                {branch.audio && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black text-white bg-[#B90101]">
                    {branch.audio}
                  </span>
                )}

                {/* Screen Format Badge */}
                {branch.screenType && (
                  <span className="text-xs font-black tracking-tight text-neutral-800 dark:text-neutral-200 uppercase">
                    {branch.screenType === "SCREEN X" ? (
                      <>
                        SCREEN <span className="text-[#B90101]">X</span>
                      </>
                    ) : branch.screenType === "SCREEN 2D" ? (
                      <>
                        SCREEN <span className="text-[#B90101]">2D</span>
                      </>
                    ) : (
                      branch.screenType
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Subtle Divider Line */}
            <div className="border-t border-neutral-100 dark:border-white/5" />

            {/* Bottom Row: Red Showtime Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              {branch.times.map((time) => {
                const isSelected = selectedTimeSlot === `${branch.id}-${time}`;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleTimeClick(branch, time)}
                    className={`px-6 sm:px-7 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 ${
                      isSelected
                        ? "bg-[#8E0000] text-white ring-2 ring-[#B90101] ring-offset-2 scale-105"
                        : "bg-[#B90101] hover:bg-[#A00101] text-white shadow-red-950/20 hover:brightness-110"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
