import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { PANELS } from "../movieLibraryPanels";
import {
  useActiveMovies,
  addCatalogMovie,
  updateCatalogMovie,
  deleteCatalogMovie,
  resetTo100CatalogMovies,
  clearAllCatalogMovies,
} from "../../../utils/movieCatalogService";
import {
  useGetUpcomingMoviesQuery,
  useGetNowPlayingMoviesQuery,
  useGetTrendingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useDiscoverMoviesQuery,
  useSearchMoviesQuery,
  useGetMovieGenresQuery,
} from "../../../services/api/movieApi";
import {
  useGetTrendingTVQuery,
  useGetPopularTVQuery,
  useGetTopRatedTVQuery,
  useGetOnTheAirTVQuery,
  useDiscoverTVQuery,
  useSearchTVQuery,
  useGetTVGenresQuery,
} from "../../../services/api/tvApi";
import {
  useGetCinemaMoviesQuery,
  useImportMovieFromTmdbMutation,
  useDeleteMovieMutation,
  useUpdateMovieStatusMutation,
} from "../../../services/api/cinemaApi";

export function useMovieLibraryData() {
  // 1. Teacher's Backend Cinema Catalog Query & Mutations
  const {
    data: cinemaBackendData,
    isLoading: isBackendLoading,
    isFetching: isBackendFetching,
  } = useGetCinemaMoviesQuery({
    page: 0,
    size: 100,
  });

  const [importMovieFromTmdbMutation] = useImportMovieFromTmdbMutation();
  const [deleteMovieMutation] = useDeleteMovieMutation();
  const [updateMovieStatusMutation] = useUpdateMovieStatusMutation();

  // Managed Cinema Local Catalog (Fallback)
  const managedMovies = useActiveMovies();

  // 2. Active Panel & Category Navigation State
  const [activePanelId, setActivePanelId] = useState("MANAGED");
  const [activeGroupTab, setActiveGroupTab] = useState("MANAGED"); // 'MANAGED' | 'MOVIES' | 'TV'
  const [activeCatalogFilter, setActiveCatalogFilter] = useState("ALL"); // 'ALL' | 'LIVE' | 'UPCOMING'
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // TMDB Discover & Extra Filter States
  const [selectedGenreId, setSelectedGenreId] = useState("");
  const [selectedSortBy, setSelectedSortBy] = useState("popularity.desc");
  const [trendingTimeWindow, setTrendingTimeWindow] = useState("day"); // 'day' | 'week'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const activePanel = useMemo(
    () => PANELS.find((p) => p.id === activePanelId) || PANELS[0],
    [activePanelId],
  );

  // Fetch Genre Lists from TMDB
  const { data: movieGenresList = [] } = useGetMovieGenresQuery();
  const { data: tvGenresList = [] } = useGetTVGenresQuery();

  // Create unified Genre ID -> Genre Name Lookup Map
  const genreLookup = useMemo(() => {
    const map = {};
    movieGenresList.forEach((g) => {
      map[g.id] = g.name;
    });
    tvGenresList.forEach((g) => {
      map[g.id] = g.name;
    });
    return map;
  }, [movieGenresList, tvGenresList]);

  // Set of TMDB IDs already in the Cinema Database for quick lookup
  const catalogTmdbIdSet = useMemo(() => {
    const set = new Set();
    if (cinemaBackendData?.content) {
      cinemaBackendData.content.forEach((m) => {
        if (m.tmdbId) set.add(Number(m.tmdbId));
      });
    }
    return set;
  }, [cinemaBackendData]);

  // Query Triggers for each endpoint
  const hasSearch = searchQuery.trim().length > 0;
  const isMovieGroup = activePanel.mediaType === "movie";
  const isTvGroup = activePanel.mediaType === "tv";

  // TMDB Movie Queries
  const {
    data: upcomingData,
    isLoading: isUpcomingLoading,
    isFetching: isUpcomingFetching,
  } = useGetUpcomingMoviesQuery(currentPage, {
    skip: activePanelId !== "TMDB_UPCOMING" || hasSearch,
  });

  const {
    data: nowPlayingData,
    isLoading: isNowPlayingLoading,
    isFetching: isNowPlayingFetching,
  } = useGetNowPlayingMoviesQuery(currentPage, {
    skip: activePanelId !== "TMDB_NOW_PLAYING" || hasSearch,
  });

  const {
    data: trendingMoviesData,
    isLoading: isTrendingMoviesLoading,
    isFetching: isTrendingMoviesFetching,
  } = useGetTrendingMoviesQuery(trendingTimeWindow, {
    skip: activePanelId !== "TMDB_TRENDING_MOVIES" || hasSearch,
  });

  const {
    data: popularMoviesData,
    isLoading: isPopularMoviesLoading,
    isFetching: isPopularMoviesFetching,
  } = useGetPopularMoviesQuery(currentPage, {
    skip: activePanelId !== "TMDB_POPULAR_MOVIES" || hasSearch,
  });

  const {
    data: topRatedMoviesData,
    isLoading: isTopRatedMoviesLoading,
    isFetching: isTopRatedMoviesFetching,
  } = useGetTopRatedMoviesQuery(currentPage, {
    skip: activePanelId !== "TMDB_TOP_RATED_MOVIES" || hasSearch,
  });

  const {
    data: discoverMoviesData,
    isLoading: isDiscoverMoviesLoading,
    isFetching: isDiscoverMoviesFetching,
  } = useDiscoverMoviesQuery(
    {
      page: currentPage,
      with_genres: selectedGenreId || undefined,
      sort_by: selectedSortBy,
    },
    {
      skip: activePanelId !== "TMDB_DISCOVER_MOVIES" || hasSearch,
    },
  );

  // TMDB TV Queries
  const {
    data: trendingTvData,
    isLoading: isTrendingTvLoading,
    isFetching: isTrendingTvFetching,
  } = useGetTrendingTVQuery(trendingTimeWindow, {
    skip: activePanelId !== "TMDB_TRENDING_TV" || hasSearch,
  });

  const {
    data: popularTvData,
    isLoading: isPopularTvLoading,
    isFetching: isPopularTvFetching,
  } = useGetPopularTVQuery(currentPage, {
    skip: activePanelId !== "TMDB_POPULAR_TV" || hasSearch,
  });

  const {
    data: topRatedTvData,
    isLoading: isTopRatedTvLoading,
    isFetching: isTopRatedTvFetching,
  } = useGetTopRatedTVQuery(currentPage, {
    skip: activePanelId !== "TMDB_TOP_RATED_TV" || hasSearch,
  });

  const {
    data: onTheAirTvData,
    isLoading: isOnTheAirTvLoading,
    isFetching: isOnTheAirTvFetching,
  } = useGetOnTheAirTVQuery(currentPage, {
    skip: activePanelId !== "TMDB_ON_THE_AIR_TV" || hasSearch,
  });

  const {
    data: discoverTvData,
    isLoading: isDiscoverTvLoading,
    isFetching: isDiscoverTvFetching,
  } = useDiscoverTVQuery(
    {
      page: currentPage,
      with_genres: selectedGenreId || undefined,
      sort_by: selectedSortBy,
    },
    {
      skip: activePanelId !== "TMDB_DISCOVER_TV" || hasSearch,
    },
  );

  // TMDB Live Search Queries
  const {
    data: searchMoviesResult,
    isLoading: isSearchMoviesLoading,
    isFetching: isSearchMoviesFetching,
  } = useSearchMoviesQuery(
    { query: searchQuery.trim(), page: currentPage },
    { skip: !hasSearch || activePanel.group === "MANAGED" || !isMovieGroup },
  );

  const {
    data: searchTvResult,
    isLoading: isSearchTvLoading,
    isFetching: isSearchTvFetching,
  } = useSearchTVQuery(
    { query: searchQuery.trim(), page: currentPage },
    { skip: !hasSearch || activePanel.group === "MANAGED" || !isTvGroup },
  );

  // Determine Current Display List & Total Pages
  const { displayItems, totalPages, isLoading, isFetching } = useMemo(() => {
    // A. MANAGED CINEMA CATALOG PANEL
    if (activePanelId === "MANAGED") {
      const backendMovies = (cinemaBackendData?.content || []).map((m) => ({
        id: m.uuid,
        uuid: m.uuid,
        tmdbId: m.tmdbId,
        title: m.title,
        overview: m.overview,
        year: m.releaseDate ? m.releaseDate.slice(0, 4) : "2026",
        duration: m.runtimeMinutes
          ? `${Math.floor(m.runtimeMinutes / 60)}h ${m.runtimeMinutes % 60}m`
          : "2h 10m",
        genres: "Action, Drama",
        hall: "FilmZone VIP Hall",
        date: m.releaseDate || "Now Showing",
        status:
          m.status === "ACTIVE"
            ? "Live"
            : m.status === "COMING_SOON"
              ? "Upcoming"
              : m.status || "Live",
        poster_path:
          m.posterUrl ||
          "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        backdrop_path:
          m.backdropUrl ||
          "https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
        vote_average: 8.5,
        isBackendMovie: true,
      }));

      // Show ONLY movies from Teacher's database in Cinema Catalog
      let items = backendMovies;

      if (activeCatalogFilter === "LIVE") {
        items = items.filter((m) => m.status === "Live");
      } else if (activeCatalogFilter === "UPCOMING") {
        items = items.filter((m) => m.status === "Upcoming");
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        items = items.filter((m) => {
          const title = m.title?.toLowerCase() || "";
          const genres = m.genres?.toLowerCase() || "";
          const hall = m.hall?.toLowerCase() || "";
          return title.includes(q) || genres.includes(q) || hall.includes(q);
        });
      }

      const itemsPerPage = 10;
      const count = Math.ceil(items.length / itemsPerPage) || 1;
      const start = (currentPage - 1) * itemsPerPage;
      const paginated = items.slice(start, start + itemsPerPage);

      return {
        displayItems: paginated,
        totalPages: count,
        isLoading: isBackendLoading && backendMovies.length === 0,
        isFetching: isBackendFetching,
      };
    }

    // B. TMDB SEARCH ACTIVE
    if (hasSearch) {
      if (isMovieGroup) {
        const raw = searchMoviesResult?.results || [];
        const count = searchMoviesResult?.total_pages || 1;
        return {
          displayItems: raw,
          totalPages: Math.min(count, 500),
          isLoading: isSearchMoviesLoading,
          isFetching: isSearchMoviesFetching,
        };
      } else {
        const raw = searchTvResult?.results || [];
        const count = searchTvResult?.total_pages || 1;
        return {
          displayItems: raw,
          totalPages: Math.min(count, 500),
          isLoading: isSearchTvLoading,
          isFetching: isSearchTvFetching,
        };
      }
    }

    // C. TMDB SPECIFIC ENDPOINTS
    let rawList = [];
    let calcTotalPages = 20;
    let loading = false;
    let fetching = false;

    switch (activePanelId) {
      case "TMDB_UPCOMING":
        rawList = Array.isArray(upcomingData)
          ? upcomingData
          : upcomingData?.results || [];
        loading = isUpcomingLoading;
        fetching = isUpcomingFetching;
        break;
      case "TMDB_NOW_PLAYING":
        rawList = Array.isArray(nowPlayingData)
          ? nowPlayingData
          : nowPlayingData?.results || [];
        loading = isNowPlayingLoading;
        fetching = isNowPlayingFetching;
        break;
      case "TMDB_TRENDING_MOVIES":
        rawList = Array.isArray(trendingMoviesData)
          ? trendingMoviesData
          : trendingMoviesData?.results || [];
        loading = isTrendingMoviesLoading;
        fetching = isTrendingMoviesFetching;
        break;
      case "TMDB_POPULAR_MOVIES":
        rawList = Array.isArray(popularMoviesData)
          ? popularMoviesData
          : popularMoviesData?.results || [];
        loading = isPopularMoviesLoading;
        fetching = isPopularMoviesFetching;
        break;
      case "TMDB_TOP_RATED_MOVIES":
        rawList = Array.isArray(topRatedMoviesData)
          ? topRatedMoviesData
          : topRatedMoviesData?.results || [];
        loading = isTopRatedMoviesLoading;
        fetching = isTopRatedMoviesFetching;
        break;
      case "TMDB_DISCOVER_MOVIES":
        rawList = discoverMoviesData?.results || [];
        calcTotalPages = Math.min(discoverMoviesData?.total_pages || 20, 500);
        loading = isDiscoverMoviesLoading;
        fetching = isDiscoverMoviesFetching;
        break;
      case "TMDB_TRENDING_TV":
        rawList = Array.isArray(trendingTvData)
          ? trendingTvData
          : trendingTvData?.results || [];
        loading = isTrendingTvLoading;
        fetching = isTrendingTvFetching;
        break;
      case "TMDB_POPULAR_TV":
        rawList = Array.isArray(popularTvData)
          ? popularTvData
          : popularTvData?.results || [];
        loading = isPopularTvLoading;
        fetching = isPopularTvFetching;
        break;
      case "TMDB_TOP_RATED_TV":
        rawList = Array.isArray(topRatedTvData)
          ? topRatedTvData
          : topRatedTvData?.results || [];
        loading = isTopRatedTvLoading;
        fetching = isTopRatedTvFetching;
        break;
      case "TMDB_ON_THE_AIR_TV":
        rawList = Array.isArray(onTheAirTvData)
          ? onTheAirTvData
          : onTheAirTvData?.results || [];
        loading = isOnTheAirTvLoading;
        fetching = isOnTheAirTvFetching;
        break;
      case "TMDB_DISCOVER_TV":
        rawList = discoverTvData?.results || [];
        calcTotalPages = Math.min(discoverTvData?.total_pages || 20, 500);
        loading = isDiscoverTvLoading;
        fetching = isDiscoverTvFetching;
        break;
      default:
        rawList = [];
    }

    return {
      displayItems: rawList,
      totalPages: calcTotalPages,
      isLoading: loading,
      isFetching: fetching,
    };
  }, [
    activePanelId,
    cinemaBackendData,
    isBackendLoading,
    isBackendFetching,
    managedMovies,
    activeCatalogFilter,
    searchQuery,
    currentPage,
    hasSearch,
    isMovieGroup,
    searchMoviesResult,
    searchTvResult,
    upcomingData,
    nowPlayingData,
    trendingMoviesData,
    popularMoviesData,
    topRatedMoviesData,
    discoverMoviesData,
    trendingTvData,
    popularTvData,
    topRatedTvData,
    onTheAirTvData,
    discoverTvData,
    isUpcomingLoading,
    isUpcomingFetching,
    isNowPlayingLoading,
    isNowPlayingFetching,
    isTrendingMoviesLoading,
    isTrendingMoviesFetching,
    isPopularMoviesLoading,
    isPopularMoviesFetching,
    isTopRatedMoviesLoading,
    isTopRatedMoviesFetching,
    isDiscoverMoviesLoading,
    isDiscoverMoviesFetching,
    isTrendingTvLoading,
    isTrendingTvFetching,
    isPopularTvLoading,
    isPopularTvFetching,
    isTopRatedTvLoading,
    isTopRatedTvFetching,
    isOnTheAirTvLoading,
    isOnTheAirTvFetching,
    isDiscoverTvLoading,
    isDiscoverTvFetching,
    isSearchMoviesLoading,
    isSearchMoviesFetching,
    isSearchTvLoading,
    isSearchTvFetching,
  ]);

  // Handle Switching Panels
  const handleSelectPanel = (panelId) => {
    setActivePanelId(panelId);
    const target = PANELS.find((p) => p.id === panelId);
    if (target) {
      setActiveGroupTab(target.group);
    }
    setCurrentPage(1);
    setSearchQuery("");
  };

  // Helper to extract genre string
  const formatGenres = (item) => {
    if (item.genres && typeof item.genres === "string") return item.genres;
    if (
      item.genre_ids &&
      Array.isArray(item.genre_ids) &&
      item.genre_ids.length > 0
    ) {
      const names = item.genre_ids
        .map((id) => genreLookup[id])
        .filter(Boolean)
        .slice(0, 3);
      if (names.length > 0) return names.join(", ");
    }
    return "Action, Drama";
  };

  // Action Handlers
  const handleOpenAddCustom = () => {
    setEditingMovie(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    // Check if it's a backend UUID or in backend movies
    const backendMatch = cinemaBackendData?.content?.find(
      (m) => m.uuid === id || m.id === id || String(m.tmdbId) === String(id),
    );
    const uuidToDelete =
      backendMatch?.uuid ||
      (typeof id === "string" && id.includes("-") ? id : null);

    if (uuidToDelete) {
      try {
        await deleteMovieMutation(uuidToDelete).unwrap();
        toast.success("Movie deleted from Cinema database!");
      } catch (err) {
        console.warn("Backend delete error:", err);
      }
    }
    deleteCatalogMovie(id);
    toast.info("Movie removed from Cinema Catalog");
  };

  const handleRestore100Movies = () => {
    resetTo100CatalogMovies();
    setCurrentPage(1);
    toast.success("100 Offline TMDB Blockbusters restored!");
  };

  const handleClearAll = () => {
    if (managedMovies.length === 0) return;
    clearAllCatalogMovies();
    setCurrentPage(1);
    toast.warn("Cinema catalog cleared and reset");
  };

  // Quick One-Click Import from TMDB to Cinema Catalog & Database
  const handleQuickImportTmdb = async (item) => {
    const isTv = !!item.first_air_date || activePanel.mediaType === "tv";
    const releaseDate =
      item.release_date || item.first_air_date || "2026-09-20";
    const yearStr = releaseDate.slice(0, 4) || "2026";
    const genresStr = formatGenres(item);
    const isUpcoming =
      activePanelId === "TMDB_UPCOMING" || new Date(releaseDate) > new Date();

    const movieToImport = {
      id: item.id || Date.now(),
      tmdbId: item.id,
      title: item.title || item.name || "Untitled",
      year: yearStr,
      duration: isTv ? "45min/ep" : "2h 15min",
      genres: genresStr,
      hall: "FilmZone SenSok",
      date: "20-25/09/2026",
      status: isUpcoming ? "Upcoming" : "Live",
      poster_path: item.poster_path
        ? item.poster_path.startsWith("http")
          ? item.poster_path
          : `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      backdrop_path: item.backdrop_path
        ? item.backdrop_path.startsWith("http")
          ? item.backdrop_path
          : `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : "https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
      vote_average: item.vote_average
        ? Number(item.vote_average.toFixed(1))
        : 8.0,
      isFreeStream: true,
      media_type: isTv ? "tv" : "movie",
    };

    // If it has a TMDB ID and is a movie, import to Teacher's Cinema API (POST /movies/import/{tmdbId})
    if (item.id && !isTv) {
      try {
        await importMovieFromTmdbMutation(item.id).unwrap();
        toast.success(
          `"${item.title || item.name}" imported directly into Cinema database!`,
        );
      } catch (err) {
        console.warn("Backend import note:", err);
      }
    }

    addCatalogMovie(movieToImport);
    if (isTv || !item.id) {
      toast.success(`"${item.title || item.name}" added to Cinema Catalog!`);
    }
  };

  // Open MovieModal pre-filled with TMDB details
  const handleCustomizeTmdbSchedule = (item) => {
    const isTv = !!item.first_air_date || activePanel.mediaType === "tv";
    const releaseDate =
      item.release_date || item.first_air_date || "2026-08-25";
    const yearStr = releaseDate.slice(0, 4) || "2026";
    const genresStr = formatGenres(item);
    const isUpcoming =
      activePanelId === "TMDB_UPCOMING" || new Date(releaseDate) > new Date();

    setEditingMovie({
      id: item.id || Date.now(),
      tmdbId: item.id,
      title: item.title || item.name,
      year: yearStr,
      duration: isTv ? "45min" : "2h 25min",
      genres: genresStr,
      status: isUpcoming ? "Upcoming" : "Live",
      poster_path: item.poster_path
        ? item.poster_path.startsWith("http")
          ? item.poster_path
          : `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "",
    });
    setIsModalOpen(true);
  };

  const handleSaveMovie = (movieData) => {
    if (editingMovie && managedMovies.some((m) => m.id === editingMovie.id)) {
      updateCatalogMovie(movieData);
      toast.success(`Updated "${movieData.title}"`);
    } else {
      addCatalogMovie(movieData);
      toast.success(`Added "${movieData.title}" to Cinema Catalog!`);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    managedMovies: cinemaBackendData?.content || [],
    activePanelId,
    activeGroupTab,
    setActiveGroupTab,
    activeCatalogFilter,
    setActiveCatalogFilter,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    selectedGenreId,
    setSelectedGenreId,
    selectedSortBy,
    setSelectedSortBy,
    trendingTimeWindow,
    setTrendingTimeWindow,
    isModalOpen,
    setIsModalOpen,
    editingMovie,
    activePanel,
    movieGenresList,
    tvGenresList,
    catalogTmdbIdSet,
    displayItems,
    totalPages,
    isLoading,
    isFetching,
    handleSelectPanel,
    formatGenres,
    handleOpenAddCustom,
    handleOpenEdit,
    handleDelete,
    handleRestore100Movies,
    handleClearAll,
    handleQuickImportTmdb,
    handleCustomizeTmdbSchedule,
    handleSaveMovie,
    handlePageChange,
  };
}
