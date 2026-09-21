import { Plus } from "lucide-react";

export default function MovieLibraryHeader({ onAddCustom }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
      <div>
        <div className="relative inline-block pb-2">
          <h1 className="text-3xl sm:text-4xl font-black text-[#b90101] tracking-tight">
            Movie Library & TMDB Hub
          </h1>
          <div className="absolute bottom-0 left-0 w-36 h-1 bg-[#b90101] rounded-full" />
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={onAddCustom}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b90101] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Import & Schedule Movie</span>
        </button>
      </div>
    </div>
  );
}
