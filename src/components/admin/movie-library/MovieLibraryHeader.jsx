// import { Plus, RefreshCw, Eraser } from "lucide-react";

// export default function MovieLibraryHeader({
//   activePanelId,
//   managedMoviesCount,
//   onRestore100,
//   onClearAll,
//   onAddCustom,
// }) {
//   return (
//     <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
//       <div>
//         <div className="relative inline-block pb-2">
//           <h1 className="text-3xl sm:text-4xl font-black text-[#b90101] tracking-tight">
//             Movie Library & TMDB Hub
//           </h1>
//           <div className="absolute bottom-0 left-0 w-36 h-1 bg-[#b90101] rounded-full" />
//         </div>
//         <p className="text-xs sm:text-sm text-neutral-500 font-semibold mt-2">
//           Explore and import all TMDB endpoints live (Upcoming, Trending,
//           Popular, Top Rated & TV Shows) into your Cinema Schedule.
//         </p>
//       </div>

//       {/* Action Controls */}
//       <div className="flex flex-wrap items-center gap-2.5">
//         {activePanelId === "MANAGED" && (
//           <>
//             <button
//               onClick={onRestore100}
//               className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-neutral-300 hover:border-[#b90101] text-neutral-700 hover:text-[#b90101] font-bold text-xs shadow-xs transition cursor-pointer"
//               title="Load 100 Offline TMDB Blockbuster Movies backup"
//             >
//               <RefreshCw className="w-3.5 h-3.5" />
//               <span className="hidden sm:inline">Restore 100 Backup</span>
//             </button>

//             {managedMoviesCount > 0 && (
//               <button
//                 onClick={onClearAll}
//                 className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white border border-neutral-300 hover:border-red-600 text-neutral-600 hover:text-red-600 font-bold text-xs shadow-xs transition cursor-pointer"
//                 title="Clear all active movies"
//               >
//                 <Eraser className="w-3.5 h-3.5" />
//                 <span className="hidden md:inline">Reset</span>
//               </button>
//             )}
//           </>
//         )}

//         <button
//           onClick={onAddCustom}
//           className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b90101] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition active:scale-95 cursor-pointer"
//         >
//           <Plus className="w-4 h-4" />
//           <span>+ Add Custom Movie</span>
//         </button>
//       </div>
//     </div>
//   );
// }

import { MoreVertical, Plus, Star } from "lucide-react";

export default function MovieLibraryHeader({ onAddMovie }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 px-6 py-6 md:px-8 ">
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
        {/* <p className="mt-1 text-slate-500">
          Manage your cinema showtimes, currently showing movies, and upcoming
          releases.
        </p> */}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="More options"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onAddMovie}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-5 w-5" />
          Add Movie
        </button>
      </div>
    </header>
  );
}

