import {
  Star,
  Check,
  Pencil,
  Trash2,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

export default function MovieLibraryRow({
  item,
  activePanel,
  activePanelId,
  isInCatalog,
  genresStr,
  onEdit,
  onDelete,
  onQuickImport,
  onCustomizeSchedule,
}) {
  const isManagedItem = activePanelId === "MANAGED";
  const title = item.title || item.name || "Untitled";
  const releaseDate =
    item.release_date || item.first_air_date || item.date || "2026-09-20";
  const yearStr = (item.year || releaseDate).slice(0, 4);

  const posterUrl = item.poster_path
    ? item.poster_path.startsWith("http")
      ? item.poster_path
      : `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg";

  const ratingVal = item.vote_average
    ? Number(item.vote_average.toFixed(1))
    : 8.0;

  return (
    <tr className="hover:bg-neutral-50/80 transition-colors">
      {/* Column 1: Poster & Title */}
      <td className="py-3 px-3 sm:px-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={posterUrl}
            alt={title}
            className="w-10 h-14 object-cover rounded-lg shadow-xs border border-neutral-200 shrink-0"
            loading="lazy"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span
              className="font-extrabold text-neutral-900 text-[18px] leading-snug truncate block"
              title={title}
            >
              {title}
            </span>
            <div className="flex items-center gap-1.5 text-[14px] text-neutral-500 font-medium mt-0.5 truncate">
              <span>{yearStr}</span>
              <span>&bull;</span>
              <span className="uppercase text-[12px] font-black px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700">
                {item.media_type || activePanel.mediaType || "Movie"}
              </span>
              {item.original_language && (
                <span className="uppercase text-[12px] font-bold text-neutral-400">
                  [{item.original_language}]
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Column 2: Date / Schedule */}
      <td className="py-3 px-3 sm:px-4 font-medium text-neutral-700 whitespace-nowrap">
        {isManagedItem ? (
          <div>
            <span className="font-bold text-neutral-900 text-[18px] block">
              {item.date || "20-25/09/2026"}
            </span>
            <span className="text-[14px] text-neutral-500 block truncate">
              {item.hall || "FilmZone SenSok"}
            </span>
          </div>
        ) : (
          <div>
            <span className="font-bold text-neutral-900 text-[18px] block">
              {releaseDate}
            </span>
            <span className="text-[14px] text-neutral-400 block truncate">
              TMDB Release
            </span>
          </div>
        )}
      </td>

      {/* Column 3: Rating */}
      <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-black text-[18px] shadow-xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{ratingVal}</span>
          </div>
          {item.vote_count && (
            <span className="text-[14px] text-neutral-400 font-semibold">
              ({item.vote_count.toLocaleString()})
            </span>
          )}
        </div>
      </td>

      {/* Column 4: Genres */}
      <td
        className="py-3 px-3 sm:px-4 font-medium text-[18px] text-neutral-700 truncate"
        title={genresStr}
      >
        {genresStr}
      </td>

      {/* Column 5: Cinema Status (Managed Catalog only) */}
      {isManagedItem && (
        <td className="py-3 px-2 sm:px-3 text-center whitespace-nowrap">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[15px] font-bold border ${
              item.status === "Live"
                ? "text-[#b90101] border-red-300 bg-red-50/50"
                : "text-amber-600 border-amber-300 bg-amber-50/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.status === "Live" ? "bg-[#b90101]" : "bg-amber-500"
              }`}
            />
            <span>{item.status || "Live"}</span>
          </span>
        </td>
      )}

      {/* Column 6 (or Column 5 in TMDB): Action Buttons */}
      <td className="py-3 px-2 sm:px-3 text-center whitespace-nowrap">
        {isManagedItem ? (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="w-8 h-8 rounded-full bg-[#b90101] hover:brightness-110 text-white flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer"
              title="Edit movie schedule & halls"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-red-600 hover:text-white text-neutral-700 flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer"
              title="Delete movie instantly"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {isInCatalog ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[13px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 shadow-xs">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>In Cinema</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onQuickImport(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#b90101] hover:brightness-110 text-white text-[13px] font-bold shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                title="1-Click Quick Add to Cinema Schedule"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>Add to Cinema</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onCustomizeSchedule(item)}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center border border-neutral-200 shadow-xs transition active:scale-95 cursor-pointer shrink-0"
              title="Customize Showtimes, Dates & Halls"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
