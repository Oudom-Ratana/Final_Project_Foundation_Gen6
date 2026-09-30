








import { Search } from "lucide-react";

export default function MovieLibraryFilters({
  activePanel,
  activePanelId,
  activeCatalogFilter,
  setActiveCatalogFilter,
  trendingTimeWindow,
  setTrendingTimeWindow,
  selectedGenreId,
  setSelectedGenreId,
  selectedSortBy,
  setSelectedSortBy,
  movieGenresList,
  tvGenresList,
  searchQuery,
  setSearchQuery,
  setCurrentPage,
}) {
  const isMovieGroup = activePanel.mediaType === "movie";

  return (
    <div className="bg-white border border-neutral-200 rounded-full p-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={
              activePanelId === "MANAGED"
                ? "Search in cinema catalog..."
                : `Search TMDB ${isMovieGroup ? "movies" : "TV shows"}...`
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/10 transition-all"
          />
        </div>

        {activePanelId === "MANAGED" && (
          <div className="flex items-center gap-1 p-1 bg-white border border-neutral-200 rounded-full shrink-0">
            {["ALL", "LIVE", "UPCOMING"].map((tab) => {
              const isActive = activeCatalogFilter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveCatalogFilter(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary-red text-white"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}

        {(activePanelId === "TMDB_TRENDING_MOVIES" ||
          activePanelId === "TMDB_TRENDING_TV") && (
          <div className="flex items-center gap-1 p-1 bg-white border border-neutral-200 rounded-full shrink-0">
            {[
              { key: "day", label: "Today" },
              { key: "week", label: "This Week" },
            ].map((item) => {
              const isActive = trendingTimeWindow === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setTrendingTimeWindow(item.key);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary-red text-white"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {(activePanelId === "TMDB_DISCOVER_MOVIES" ||
          activePanelId === "TMDB_DISCOVER_TV") && (
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedGenreId}
              onChange={(e) => {
                setSelectedGenreId(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-full px-4 py-2.5 focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/10 transition-all cursor-pointer"
            >
              <option value="">All Genres</option>

              {(isMovieGroup ? movieGenresList : tvGenresList).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSortBy}
              onChange={(e) => {
                setSelectedSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-full px-4 py-2.5 focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/10 transition-all cursor-pointer"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rating</option>
              <option value="primary_release_date.desc">
                Newest Release
              </option>
              <option value="revenue.desc">Top Box Office</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}