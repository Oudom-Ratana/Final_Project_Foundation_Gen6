import { ChevronRight } from "lucide-react";

export default function BookingCheckoutBar({ selectedSeats = [], totalPrice = 0, onProceed }) {
  if (selectedSeats.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40 rounded-full border border-neutral-300 dark:border-white/20 bg-white/95 dark:bg-[#14181E]/95 backdrop-blur-md px-5 py-3 shadow-2xl flex items-center justify-between animate-slideUp">
      <div className="space-y-0.5 min-w-0 pr-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-neutral-400">
            {selectedSeats.length} {selectedSeats.length === 1 ? "Seat" : "Seats"}:
          </span>
          <span className="font-black text-sm sm:text-base text-[#B90101] truncate">
            {selectedSeats.map((s) => s.id).join(", ")}
          </span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Total:{" "}
          <strong className="text-sm font-black text-neutral-900 dark:text-white">
            ${totalPrice.toFixed(2)}
          </strong>
        </p>
      </div>

      <button
        type="button"
        onClick={onProceed}
        className="px-6 py-2.5 rounded-full bg-[#B90101] hover:bg-[#A00101] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-red-950/40 active:scale-95 transition flex items-center gap-2 shrink-0"
      >
        <span>Booking Details</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
