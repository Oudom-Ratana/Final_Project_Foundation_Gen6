import { Film, Plus, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
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
  return (
    <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <table className="w-full table-fixed text-left border-collapse">
          <thead>
            <tr className="bg-[#b90101] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider">
              <th className="py-3 px-3 sm:px-4 w-[28%] md:w-[30%]">
                TITLE & MEDIA
              </th>
              <th className="py-3 px-3 sm:px-4 w-[16%] md:w-[14%] whitespace-nowrap">
                RELEASE / AIR
              </th>
              <th className="py-3 px-3 sm:px-4 w-[13%] md:w-[12%] whitespace-nowrap">
                RATING
              </th>
              <th className="py-3 px-3 sm:px-4 w-[17%] md:w-[18%]">GENRES</th>
              <th className="py-3 px-3 sm:px-4 w-[13%] text-center whitespace-nowrap">
                STATUS
              </th>
              <th className="py-3 px-3 sm:px-4 w-[13%] text-center whitespace-nowrap">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm font-semibold text-neutral-800">
            {isLoading
              ? // Loading Skeleton Rows
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-12 bg-neutral-200 rounded-lg shrink-0" />
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="w-28 h-3.5 bg-neutral-200 rounded" />
                          <div className="w-16 h-2.5 bg-neutral-200 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="w-16 h-3.5 bg-neutral-200 rounded" />
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="w-12 h-3.5 bg-neutral-200 rounded" />
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="w-20 h-3.5 bg-neutral-200 rounded" />
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <div className="w-16 h-5 bg-neutral-200 rounded-full mx-auto" />
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <div className="w-20 h-7 bg-neutral-200 rounded-full mx-auto" />
                    </td>
                  </tr>
                ))
              : items.map((item) => {
                  const isInCatalog =
                    catalogTmdbIdSet.has(Number(item.id)) ||
                    catalogTmdbIdSet.has(Number(item.tmdbId));

                  return (
                    <MovieLibraryRow
                      key={item.id || Math.random()}
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
                })}
          </tbody>
        </table>

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 text-[#b90101] flex items-center justify-center mx-auto shadow-sm">
              <Film className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                No items found in {activePanel.label}
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                Try adjusting your search keyword, genre filter, or switch to
                another TMDB category.
              </p>
            </div>

            {activePanelId === "MANAGED" && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={onAddCustom}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b90101] text-white font-extrabold text-xs shadow-md transition hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Movie</span>
                </button>

                <button
                  onClick={onRestore100}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-neutral-300 hover:border-[#b90101] text-neutral-700 hover:text-[#b90101] font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Load 100 Offline TMDB Backup</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50/50">
          <span className="text-xs font-semibold text-neutral-500">
            Showing page{" "}
            <span className="font-bold text-neutral-800">{currentPage}</span> of{" "}
            <span className="font-bold text-neutral-800">{totalPages}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (currentPage > 3 && totalPages > 5) {
                  pageNum = Math.min(currentPage - 2 + i, totalPages - (4 - i));
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#b90101] text-white shadow-xs"
                        : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
