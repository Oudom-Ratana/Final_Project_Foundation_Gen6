import { Plus, Star } from "lucide-react";

export default function MovieLibraryHeader({ onAddCustom, onAddMovie }) {
  const handleAdd = onAddCustom || onAddMovie;

  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 px-6 py-6 md:px-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Movie Library
          </h1>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-sm font-semibold text-amber-700">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            TMDB Synced
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-full bg-[#b90101] px-6 py-2.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-sm transition hover:brightness-110 active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Movie & Schedule</span>
        </button>
      </div>
    </header>
  );
}
