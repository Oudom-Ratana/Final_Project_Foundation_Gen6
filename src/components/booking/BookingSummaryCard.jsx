export default function BookingSummaryCard({
  movie = {},
  hallName = "",
  branch = "",
  hallType = "standard",
  date = "",
  time = "",
  selectedSeats = [],
  ticketsTotal = 0,
  concessions = [],
  glassCardStyle = {},
}) {
  const posterSrc = movie?.posterUrl ?? movie?.poster_path;

  return (
    <div
      className="w-full flex-1 rounded-2xl sm:rounded-3xl border p-4 sm:p-5 shadow-sm backdrop-blur-md flex flex-col justify-between space-y-3 sm:space-y-3.5"
      style={glassCardStyle}
    >
      <div className="flex items-center gap-3.5">
        {posterSrc ? (
          <img
            src={posterSrc}
            alt={movie.title ?? "Movie"}
            className="w-13 h-18 sm:w-14 sm:h-20 rounded-xl object-cover shadow-sm shrink-0"
          />
        ) : (
          <div className="w-13 h-18 sm:w-14 sm:h-20 rounded-xl bg-neutral-200 dark:bg-neutral-800 shrink-0 flex items-center justify-center text-xs font-bold text-neutral-400">
            FilmZone
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white leading-tight line-clamp-1">
            {movie.title ?? "Movie Booking"}
          </h3>
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mt-1">
            {hallName}
          </p>
        </div>
      </div>

      <div className="border-b border-dashed border-neutral-300 dark:border-(--border-dark-mode)" />

      <div className="space-y-2.5 text-xs sm:text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="font-bold text-neutral-400 dark:text-neutral-500 block text-xs">
              Cinema
            </span>
            <strong className="font-black text-neutral-900 dark:text-white text-xs sm:text-sm line-clamp-1">
              {branch}
            </strong>
          </div>
          <div>
            <span className="font-bold text-neutral-400 dark:text-neutral-500 block text-xs">
              Hall
            </span>
            <strong className="font-black text-neutral-900 dark:text-white text-xs sm:text-sm">
              {hallType.includes("gold") ? "Hall 4" : "Hall 3"}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="font-bold text-neutral-400 dark:text-neutral-500 block text-xs">
              Date
            </span>
            <strong className="font-black text-neutral-900 dark:text-white text-xs sm:text-sm">
              {date}
            </strong>
          </div>
          <div>
            <span className="font-bold text-neutral-400 dark:text-neutral-500 block text-xs">
              Time
            </span>
            <strong className="font-black text-neutral-900 dark:text-white text-xs sm:text-sm">
              {time}
            </strong>
          </div>
        </div>

        <div>
          <span className="font-bold text-neutral-400 dark:text-neutral-500 block text-xs">
            Seats
          </span>
          <strong className="font-black text-neutral-900 dark:text-white text-xs sm:text-sm">
            {selectedSeats.map((s) => s.id).join(", ")}
          </strong>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-extrabold text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm">
            Tickets x{selectedSeats.length}
          </span>
          <span className="font-black text-sm sm:text-base text-neutral-900 dark:text-white">
            ${ticketsTotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="border-b border-dashed border-neutral-300 dark:border-(--border-dark-mode)" />

      <div className="space-y-1.5">
        <h4 className="font-bold text-xs text-[#B90101] uppercase tracking-wider">
          Food & Drinks
        </h4>
        {concessions.length === 0 ? (
          <p className="text-xs text-neutral-400 italic">
            No food & drinks added yet
          </p>
        ) : (
          <div className="space-y-1.5 max-h-[85px] overflow-y-auto custom-scrollbar pr-1">
            {concessions.map((c) => (
              <div
                key={c.uuid ?? c.id}
                className="flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200"
              >
                <span className="line-clamp-1">
                  {c.name} x{c.quantity}
                </span>
                <span className="font-black text-neutral-900 dark:text-white shrink-0">
                  ${(c.price * c.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}