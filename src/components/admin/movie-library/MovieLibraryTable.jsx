// import { Film, Plus, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
// import MovieLibraryRow from "./MovieLibraryRow";

// export default function MovieLibraryTable({
//   items,
//   isLoading,
//   activePanel,
//   activePanelId,
//   catalogTmdbIdSet,
//   formatGenres,
//   onEdit,
//   onDelete,
//   onQuickImport,
//   onCustomizeSchedule,
//   onAddCustom,
//   onRestore100,
//   totalPages,
//   currentPage,
//   onPageChange,
// }) {
//   const isManaged = activePanelId === "MANAGED";

//   return (
//     <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[920px] xl:min-w-0 table-fixed text-left border-collapse">
//           <thead>
//             <tr className="bg-[#b90101] text-white text-[18px] font-black uppercase tracking-wider">
//               <th
//                 className={`py-3.5 px-4 ${isManaged ? "w-[28%]" : "w-[32%]"}`}
//               >
//                 TITLE & MEDIA
//               </th>
//               <th
//                 className={`py-3.5 px-4 ${isManaged ? "w-[22%]" : "w-[18%]"} whitespace-nowrap`}
//               >
//                 {isManaged ? "SCHEDULE DATE" : "RELEASE DATE"}
//               </th>
//               <th
//                 className={`py-3.5 px-3 sm:px-4 ${isManaged ? "w-[12%]" : "w-[14%]"} whitespace-nowrap`}
//               >
//                 RATING
//               </th>
//               <th
//                 className={`py-3.5 px-4 ${isManaged ? "w-[16%]" : "w-[18%]"}`}
//               >
//                 GENRES
//               </th>
//               {isManaged && (
//                 <th className="py-3.5 px-4 w-[10%] text-center whitespace-nowrap">
//                   STATUS
//                 </th>
//               )}
//               <th
//                 className={`py-3.5 px-4 ${isManaged ? "w-[12%]" : "w-[18%]"} text-center whitespace-nowrap`}
//               >
//                 ACTIONS
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-neutral-100 text-[18px] font-semibold text-neutral-800">
//             {isLoading
//               ? // Loading Skeleton Rows
//                 Array.from({ length: 6 }).map((_, i) => (
//                   <tr key={i} className="animate-pulse">
//                     <td className="py-3.5 px-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-14 bg-neutral-200 rounded-lg shrink-0" />
//                         <div className="space-y-2 flex-1 min-w-0">
//                           <div className="w-32 h-4 bg-neutral-200 rounded" />
//                           <div className="w-20 h-3 bg-neutral-200 rounded" />
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-3.5 px-4">
//                       <div className="w-24 h-4 bg-neutral-200 rounded" />
//                     </td>
//                     <td className="py-3.5 px-4">
//                       <div className="w-16 h-4 bg-neutral-200 rounded" />
//                     </td>
//                     <td className="py-3.5 px-4">
//                       <div className="w-24 h-4 bg-neutral-200 rounded" />
//                     </td>
//                     {isManaged && (
//                       <td className="py-3.5 px-4 text-center">
//                         <div className="w-16 h-6 bg-neutral-200 rounded-full mx-auto" />
//                       </td>
//                     )}
//                     <td className="py-3.5 px-4 text-center">
//                       <div className="w-24 h-8 bg-neutral-200 rounded-full mx-auto" />
//                     </td>
//                   </tr>
//                 ))
//               : items.map((item) => {
//                   const isInCatalog =
//                     catalogTmdbIdSet.has(Number(item.id)) ||
//                     catalogTmdbIdSet.has(Number(item.tmdbId));

//                   return (
//                     <MovieLibraryRow
//                       key={item.id || Math.random()}
//                       item={item}
//                       activePanel={activePanel}
//                       activePanelId={activePanelId}
//                       isInCatalog={isInCatalog}
//                       genresStr={formatGenres(item)}
//                       onEdit={onEdit}
//                       onDelete={onDelete}
//                       onQuickImport={onQuickImport}
//                       onCustomizeSchedule={onCustomizeSchedule}
//                     />
//                   );
//                 })}
//           </tbody>
//         </table>

//         {/* Empty State */}
//         {!isLoading && items.length === 0 && (
//           <div className="p-16 text-center space-y-4">
//             <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 text-[#b90101] flex items-center justify-center mx-auto shadow-sm">
//               <Film className="w-8 h-8" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-neutral-900">
//                 No items found in {activePanel.label}
//               </h3>
//               <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
//                 Try adjusting your search keyword, genre filter, or switch to
//                 another TMDB category.
//               </p>
//             </div>

//             {activePanelId === "MANAGED" && (
//               <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
//                 <button
//                   onClick={onAddCustom}
//                   className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b90101] text-white font-extrabold text-xs shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Add Custom Movie</span>
//                 </button>

//                 <button
//                   onClick={onRestore100}
//                   className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-neutral-300 hover:border-[#b90101] text-neutral-700 hover:text-[#b90101] font-bold text-xs shadow-xs transition cursor-pointer"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   <span>Load 100 Offline TMDB Backup</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Pagination Footer */}
//       {totalPages > 1 && (
//         <div className="p-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50/50">
//           <span className="text-xs font-semibold text-neutral-500">
//             Showing page{" "}
//             <span className="font-bold text-neutral-800">{currentPage}</span> of{" "}
//             <span className="font-bold text-neutral-800">{totalPages}</span>
//           </span>

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               disabled={currentPage === 1}
//               onClick={() => onPageChange(currentPage - 1)}
//               className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>

//             <div className="flex items-center gap-1">
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum = i + 1;
//                 if (currentPage > 3 && totalPages > 5) {
//                   pageNum = Math.min(currentPage - 2 + i, totalPages - (4 - i));
//                 }
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => onPageChange(pageNum)}
//                     className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
//                       currentPage === pageNum
//                         ? "bg-[#b90101] text-white shadow-xs"
//                         : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               type="button"
//               disabled={currentPage === totalPages}
//               onClick={() => onPageChange(currentPage + 1)}
//               className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import {
  Film,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MovieLibraryRow from "./MovieLibraryRow";

export default function MovieLibraryTable({
  items,
  isLoading,
  activePanel,
  activePanelId,
  catalogTmdbIdSet,
  formatGenres,
  onEdit,
  onDelete,
  onQuickImport,
  onCustomizeSchedule,
  onAddCustom,
  onRestore100,
  totalPages,
  currentPage,
  onPageChange,
}) {
  const isManaged = activePanelId === "MANAGED";

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th
                className={`py-4 px-6 ${
                  isManaged ? "w-[28%]" : "w-[32%]"
                }`}
              >
                Title &amp; Media
              </th>

              <th
                className={`py-4 px-6 ${
                  isManaged ? "w-[22%]" : "w-[18%]"
                } whitespace-nowrap`}
              >
                {isManaged ? "Schedule Date" : "Release Date"}
              </th>

              <th
                className={`py-4 px-6 ${
                  isManaged ? "w-[12%]" : "w-[14%]"
                } whitespace-nowrap`}
              >
                Rating
              </th>

              <th
                className={`py-4 px-6 ${
                  isManaged ? "w-[16%]" : "w-[18%]"
                }`}
              >
                Genres
              </th>

              {isManaged && (
                <th className="py-4 px-6 w-[10%] text-center whitespace-nowrap">
                  Status
                </th>
              )}

              <th
                className={`py-4 px-6 ${
                  isManaged ? "w-[12%]" : "w-[18%]"
                } text-right whitespace-nowrap`}
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-16 bg-slate-200 rounded-lg shrink-0" />

                      <div className="space-y-2">
                        <div className="w-36 h-4 bg-slate-200 rounded" />
                        <div className="w-24 h-3 bg-slate-200 rounded" />
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                  </td>

                  <td className="py-4 px-6">
                    <div className="w-14 h-4 bg-slate-200 rounded" />
                  </td>

                  <td className="py-4 px-6">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                  </td>

                  {isManaged && (
                    <td className="py-4 px-6 text-center">
                      <div className="w-16 h-6 bg-slate-200 rounded-full mx-auto" />
                    </td>
                  )}

                  <td className="py-4 px-6">
                    <div className="w-24 h-8 bg-slate-200 rounded-full ml-auto" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={isManaged ? 6 : 5}
                  className="py-16 px-6 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-[#b90101] flex items-center justify-center mb-4">
                      <Film className="w-7 h-7" />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      No movies found
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      No movies match your current search or filter criteria.
                    </p>

                    {activePanelId === "MANAGED" && (
                      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
                        <button
                          onClick={onAddCustom}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#b90101] text-white text-xs font-bold shadow-sm hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Add Custom Movie
                        </button>

                        <button
                          onClick={onRestore100}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:border-red-200 hover:text-[#b90101] hover:bg-red-50/30 transition cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Load TMDB Backup
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isInCatalog =
                  catalogTmdbIdSet.has(Number(item.id)) ||
                  catalogTmdbIdSet.has(Number(item.tmdbId));

                return (
                  <MovieLibraryRow
                    key={item.id}
                    item={item}
                    activePanel={activePanel}
                    activePanelId={activePanelId}
                    isInCatalog={isInCatalog}
                    genresStr={formatGenres(item)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onQuickImport={onQuickImport}
                    onCustomizeSchedule={onCustomizeSchedule}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-medium text-slate-500">
            Page{" "}
            <span className="font-bold text-slate-800">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800">
              {totalPages}
            </span>
          </span>

          <div className="flex items-center gap-1.5">
            {/* Previous */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, totalPages) },
                (_, i) => {
                  let pageNum = i + 1;

                  if (currentPage > 3 && totalPages > 5) {
                    pageNum = Math.min(
                      currentPage - 2 + i,
                      totalPages - (4 - i)
                    );
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => onPageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-[#b90101] text-white shadow-sm"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
