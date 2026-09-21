import { useState, useEffect } from "react";
import {
  X,
  Search,
  Loader2,
  Plus,
  Calendar,
  Layers,
  Film,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  Building2,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useLazySearchMoviesQuery,
  useGetNowPlayingMoviesQuery,
} from "../../services/api/movieApi";
import {
  useGetCinemaMoviesQuery,
  useGetAllHallsQuery,
  useCreateHallMutation,
  useCreateSeatsBulkMutation,
  useCreateShowtimeMutation,
  useImportMovieFromTmdbMutation,
} from "../../services/api/cinemaApi";

// 4 Auto-Generated Cinema Hall Presets matching the 2 hall types (Standard: 94 seats, VIP: 36 seats)
const AUTO_HALL_PRESETS = [
  {
    name: "Hall 1 - Screen X",
    hallType: "STANDARD",
    capacity: 94,
    description:
      "Standard cinema hall with 94 seats and Screen X panoramic multi-projection",
  },
  {
    name: "Hall 2 - Screen 2D",
    hallType: "STANDARD",
    capacity: 94,
    description: "Standard digital 2D screening hall with 94 comfortable seats",
  },
  {
    name: "Hall 3 - Screen 3D",
    hallType: "STANDARD",
    capacity: 94,
    description:
      "Standard digital 3D screening hall with 94 seats and RealD 3D",
  },
  {
    name: "VIP Hall",
    hallType: "VIP",
    capacity: 36,
    description: "Luxury VIP hall with 36 premium leather recliner seats",
  },
];

export default function MovieModal({ isOpen, onClose, editingMovie = null }) {
  // Tabs: 'import' | 'schedule' | 'halls'
  const [activeTab, setActiveTab] = useState("import");

  // Queries & Mutations from Teacher's API
  const { data: cinemaMoviesData, refetch: refetchCinemaMovies } =
    useGetCinemaMoviesQuery({ page: 0, size: 100 });
  const { data: halls = [], refetch: refetchHalls } = useGetAllHallsQuery();
  const [importMovieFromTmdb, { isLoading: isImporting }] =
    useImportMovieFromTmdbMutation();
  const [createShowtime, { isLoading: isCreatingShowtime }] =
    useCreateShowtimeMutation();
  const [createHall, { isLoading: isCreatingHall }] = useCreateHallMutation();
  const [createSeatsBulk] = useCreateSeatsBulkMutation();

  // Fallback / Initial Now Playing movies when search query is empty
  const { data: nowPlayingMovies = [] } = useGetNowPlayingMoviesQuery(1, {
    skip: !isOpen,
  });

  // TMDB Live Real-Time Search
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerSearch, { data: searchResults, isFetching: isSearching }] =
    useLazySearchMoviesQuery();

  // Schedule Showtime Form State
  const [selectedMovieUuid, setSelectedMovieUuid] = useState("");
  const [selectedHallUuid, setSelectedHallUuid] = useState("");
  const [showDate, setShowDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [showTime, setShowTime] = useState("14:30:00");
  const [basePrice, setBasePrice] = useState(4.5);

  // New Hall Form State
  const [hallName, setHallName] = useState("Hall 1 - Screen X");
  const [hallType, setHallType] = useState("STANDARD");
  const [hallCapacity, setHallCapacity] = useState(94);
  const [hallDescription, setHallDescription] = useState(
    "Standard cinema hall with 94 seats",
  );

  // Cinema DB movies list
  const cinemaMovies = cinemaMoviesData?.content || [];

  // 1. Real-Time Search as User Types (Debounced 300ms - No Enter Needed!)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const timer = setTimeout(() => {
      triggerSearch({ query: trimmed, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, triggerSearch]);

  // When modal opens or editingMovie changes
  useEffect(() => {
    if (editingMovie) {
      setActiveTab("schedule");
      setSelectedMovieUuid(editingMovie.uuid || editingMovie.id || "");
    } else {
      setActiveTab("import");
    }
  }, [editingMovie, isOpen]);

  // Set default hall when halls load
  useEffect(() => {
    if (halls.length > 0 && !selectedHallUuid) {
      setSelectedHallUuid(halls[0].uuid);
    }
  }, [halls, selectedHallUuid]);

  // Set default movie for schedule tab if none selected
  useEffect(() => {
    if (cinemaMovies.length > 0 && !selectedMovieUuid) {
      setSelectedMovieUuid(cinemaMovies[0].uuid);
    }
  }, [cinemaMovies, selectedMovieUuid]);

  if (!isOpen) return null;

  // Immediate search submit handler
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    triggerSearch({ query: searchQuery.trim(), page: 1 });
  };

  // Handle Importing Movie from TMDB to Teacher DB
  const handleImport = async (movie) => {
    try {
      await importMovieFromTmdb(movie.id).unwrap();
      toast.success(`"${movie.title}" imported to Cinema Database!`);
      refetchCinemaMovies();
      setSelectedMovieUuid(movie.id);
      setActiveTab("schedule");
    } catch (err) {
      const errorMsg =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to import movie. Please check if already imported.";
      toast.error(errorMsg);
    }
  };

  // Handle Creating Showtime
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMovieUuid) {
      toast.error("Please select a movie.");
      return;
    }
    if (!selectedHallUuid) {
      toast.error(
        "Please select a cinema hall. Create one first if none exist.",
      );
      return;
    }

    // Format showTime to HH:mm:ss if user entered HH:mm
    let formattedTime = showTime;
    if (formattedTime.length === 5) {
      formattedTime = `${formattedTime}:00`;
    }

    const payload = {
      movieUuid: selectedMovieUuid,
      hallUuid: selectedHallUuid,
      showDate,
      showTime: formattedTime,
      basePrice: parseFloat(basePrice) || 4.5,
    };

    try {
      await createShowtime(payload).unwrap();
      toast.success("Showtime scheduled successfully in Teacher Database!");
      onClose();
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to schedule showtime. Please check inputs.";
      toast.error(msg);
    }
  };

  // Helper to bulk generate seats for a single hall
  const generateSeatsForHall = async (hallUuid, capacity, type = hallType) => {
    const isVip = type === "VIP" || capacity <= 36;
    if (isVip) {
      // VIP Hall: 6 Rows (F down to A) with 6 seats each = 36 Seats
      const rowLabels = ["F", "E", "D", "C", "B", "A"];
      const rowsPayload = rowLabels.map((label) => ({
        rowLabel: label,
        numberOfSeats: 6,
        seatType: "VIP",
      }));
      await createSeatsBulk({
        hallUuid,
        rows: rowsPayload,
      }).unwrap();
    } else {
      // Standard Hall: 7 Upper Rows (H down to B) with 12 seats (84 seats) + Row A with 10 seats = 94 Seats
      const rowLabels = ["H", "G", "F", "E", "D", "C", "B", "A"];
      const rowsPayload = rowLabels.map((label) => ({
        rowLabel: label,
        numberOfSeats: label === "A" ? 10 : 12,
        seatType: "STANDARD",
      }));
      await createSeatsBulk({
        hallUuid,
        rows: rowsPayload,
      }).unwrap();
    }
  };

  // Handle Single Hall Creation & Seat Bulk Generation
  const handleCreateHall = async (e) => {
    e?.preventDefault();
    if (!hallName.trim()) {
      toast.error("Please enter a hall name.");
      return;
    }

    try {
      const capacityNum =
        parseInt(hallCapacity, 10) || (hallType === "VIP" ? 36 : 96);
      const newHall = await createHall({
        name: hallName.trim(),
        description: hallDescription.trim(),
        capacity: capacityNum,
        hallType,
      }).unwrap();

      toast.success(`Hall "${newHall.name}" created!`);

      try {
        await generateSeatsForHall(newHall.uuid, capacityNum, hallType);
        toast.success(`Generated ${capacityNum} seats for ${newHall.name}!`);
      } catch (seatErr) {
        console.warn("Seat generation info:", seatErr);
      }

      refetchHalls();
      setSelectedHallUuid(newHall.uuid);
      setActiveTab("schedule");
    } catch (err) {
      const msg =
        err?.data?.message || err?.data?.error || "Failed to create hall.";
      toast.error(msg);
    }
  };

  // Determine movies to display in Tab 1
  const moviesToDisplay = searchQuery.trim()
    ? searchResults?.results || []
    : (Array.isArray(nowPlayingMovies) ? nowPlayingMovies : []).slice(0, 10);

  const selectedMovieObj = cinemaMovies.find(
    (m) =>
      m.uuid === selectedMovieUuid ||
      String(m.tmdbId) === String(selectedMovieUuid),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#b90101] text-white shadow-xs">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                Cinema Operations & Scheduler
              </h2>
              <p className="text-xs font-semibold text-neutral-500">
                Connected live to Teacher Database & TMDB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-neutral-100 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("import")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-colors border-b-2 cursor-pointer ${
              activeTab === "import"
                ? "border-[#b90101] text-[#b90101] bg-red-50/50"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>1. Real-Time Search & Import</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-colors border-b-2 cursor-pointer ${
              activeTab === "schedule"
                ? "border-[#b90101] text-[#b90101] bg-red-50/50"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>2. Schedule Showtime</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("halls")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-t-xl transition-colors border-b-2 cursor-pointer ${
              activeTab === "halls"
                ? "border-[#b90101] text-[#b90101] bg-red-50/50"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Cinema Halls ({halls.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: REAL-TIME SEARCH & IMPORT FROM TMDB */}
          {activeTab === "import" && (
            <div className="space-y-6">
              {/* Real-time Search Input (No Enter Needed!) */}
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type movie name to search live (e.g. Spider, Avatar, Dune)..."
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-[#b90101] focus:ring-2 focus:ring-red-100 text-sm font-semibold text-neutral-800 transition"
                    autoFocus
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b90101] animate-spin" />
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-6 py-3 rounded-2xl bg-[#b90101] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Search</span>
                </button>
              </form>

              {/* Search Results / Now Playing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    {searchQuery.trim() && (
                      <>
                        <Search className="w-3.5 h-3.5 text-[#b90101]" />
                        <span>
                          Live Search Results for "{searchQuery}" (
                          {moviesToDisplay.length})
                        </span>
                      </>
                    )}
                  </h3>
                  {isSearching && (
                    <span className="text-[11px] font-bold text-[#b90101] flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Searching live...
                    </span>
                  )}
                </div>

                {isSearching && moviesToDisplay.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-neutral-400 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#b90101]" />
                    <span className="text-sm font-semibold">
                      Searching TMDB live as you type...
                    </span>
                  </div>
                )}

                {!isSearching &&
                  searchQuery.trim() &&
                  moviesToDisplay.length === 0 && (
                    <div className="py-12 text-center text-neutral-400 font-semibold text-sm">
                      No movies found for "{searchQuery}". Try typing another
                      keyword.
                    </div>
                  )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {moviesToDisplay.map((movie) => {
                    const isAlreadyImported = cinemaMovies.some(
                      (m) =>
                        String(m.tmdbId) === String(movie.id) ||
                        m.title?.toLowerCase() === movie.title?.toLowerCase(),
                    );
                    const poster = movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg";

                    return (
                      <div
                        key={movie.id}
                        className="flex gap-3 p-3 rounded-2xl border border-neutral-200 hover:border-neutral-300 bg-white shadow-2xs hover:shadow-xs transition"
                      >
                        <img
                          src={poster}
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded-xl shrink-0 border border-neutral-100"
                          loading="lazy"
                        />
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <h4 className="text-sm font-extrabold text-neutral-900 truncate">
                              {movie.title}
                            </h4>
                            <p className="text-xs font-semibold text-neutral-400 mt-0.5">
                              {movie.release_date?.slice(0, 4) || "N/A"} &bull;
                              Rating: {movie.vote_average?.toFixed(1) || "N/A"}
                            </p>
                            <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                              {movie.overview || "No overview available."}
                            </p>
                          </div>

                          <div className="pt-2">
                            {isAlreadyImported ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMovieUuid(movie.id);
                                  setActiveTab("schedule");
                                }}
                                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>In Database &bull; Schedule</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleImport(movie)}
                                disabled={isImporting}
                                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#b90101] hover:brightness-110 text-white text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-60"
                              >
                                {isImporting ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5" />
                                )}
                                <span>Import to Database</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE SHOWTIME (POST /showtimes) */}
          {activeTab === "schedule" && (
            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              {/* Selected Movie Preview Banner */}
              {selectedMovieObj && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <img
                    src={
                      selectedMovieObj.posterUrl ||
                      "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"
                    }
                    alt={selectedMovieObj.title}
                    className="w-12 h-18 object-cover rounded-xl shrink-0 border border-neutral-200"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      Target Movie
                    </span>
                    <h3 className="text-base font-extrabold text-neutral-900 mt-1">
                      {selectedMovieObj.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-semibold">
                      Runtime: {selectedMovieObj.runtimeMinutes || 120} min
                      &bull; Release:{" "}
                      {selectedMovieObj.releaseDate || "Now Showing"}
                    </p>
                  </div>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Select Movie */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#b90101]" />
                    <span>Select Cinema Movie (Live DB)</span>
                  </label>
                  <select
                    value={selectedMovieUuid}
                    onChange={(e) => setSelectedMovieUuid(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-[#b90101] text-sm font-semibold text-neutral-800 transition cursor-pointer"
                    required
                  >
                    {cinemaMovies.map((m) => (
                      <option key={m.uuid} value={m.uuid}>
                        {m.title} ({m.releaseDate?.slice(0, 4) || "Live"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Select Cinema Hall */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#b90101]" />
                      <span>Select Cinema Hall</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab("halls")}
                      className="text-[11px] font-bold text-[#b90101] hover:underline cursor-pointer"
                    >
                      + Manage Halls
                    </button>
                  </div>

                  {halls.length === 0 ? (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                        No halls in database yet.
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("halls")}
                        className="px-3 py-1.5 rounded-xl bg-[#b90101] hover:brightness-110 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        + Create Hall
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedHallUuid}
                      onChange={(e) => setSelectedHallUuid(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-[#b90101] text-sm font-semibold text-neutral-800 transition cursor-pointer"
                      required
                    >
                      {halls.map((h) => (
                        <option key={h.uuid} value={h.uuid}>
                          {h.name} &bull; {h.hallType} ({h.capacity || 50}{" "}
                          Seats)
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 3. Screening Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#b90101]" />
                    <span>Screening Date (showDate)</span>
                  </label>
                  <input
                    type="date"
                    value={showDate}
                    onChange={(e) => setShowDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-[#b90101] text-sm font-semibold text-neutral-800 transition"
                    required
                  />
                </div>

                {/* 4. Screening Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#b90101]" />
                    <span>Screening Time (showTime)</span>
                  </label>
                  <input
                    type="time"
                    step="1"
                    value={showTime}
                    onChange={(e) => setShowTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-[#b90101] text-sm font-semibold text-neutral-800 transition"
                    required
                  />
                </div>

                {/* 5. Base Ticket Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#b90101]" />
                    <span>Base Ticket Price (USD)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-neutral-400">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.01"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-[#b90101] text-sm font-semibold text-neutral-800 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingShowtime || halls.length === 0}
                  className="px-8 py-3 rounded-full bg-[#b90101] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-md transition active:scale-95 cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {isCreatingShowtime ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Create Showtime (POST /showtimes)</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: MANAGE & CREATE CINEMA HALLS */}
          {activeTab === "halls" && (
            <div className="space-y-8">
              {/* Form to Register Hall */}
              <form
                onSubmit={handleCreateHall}
                className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-neutral-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#b90101]" />
                    <span>Register New Cinema Hall</span>
                  </h3>
                </div>

                {/* 4 Auto-Presets Dropdown Selector */}
                <div className="p-3.5 rounded-2xl bg-white border border-red-200 shadow-2xs">
                  <select
                    onChange={(e) => {
                      const selected = AUTO_HALL_PRESETS.find(
                        (p) => p.name === e.target.value,
                      );
                      if (selected) {
                        setHallName(selected.name);
                        setHallType(selected.hallType);
                        setHallCapacity(selected.capacity);
                        setHallDescription(selected.description);
                        toast.info(
                          `Auto-filled details for "${selected.name}"!`,
                        );
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-red-50/50 border border-red-300 text-xs font-extrabold text-neutral-800 focus:outline-none focus:border-[#b90101] cursor-pointer"
                  >
                    <option value="">
                      -- Select 1 of 4 Auto Presets to Fill Form --
                    </option>
                    {AUTO_HALL_PRESETS.map((preset) => (
                      <option key={preset.name} value={preset.name}>
                        {preset.name} (
                        {preset.hallType === "VIP"
                          ? "VIP hall"
                          : "Standard hall"}{" "}
                        &bull; {preset.capacity} Seats)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600">
                      Hall Name
                    </label>
                    <input
                      type="text"
                      list="hall-name-presets"
                      value={hallName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHallName(val);
                        if (val.toLowerCase().includes("vip")) {
                          setHallType("VIP");
                          setHallCapacity(36);
                        } else if (
                          val.includes("Hall 1") ||
                          val.includes("Hall 2") ||
                          val.includes("Hall 3")
                        ) {
                          setHallType("STANDARD");
                          setHallCapacity(96);
                        }
                      }}
                      placeholder="e.g. Hall 1 - Screen X"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#b90101]"
                      required
                    />
                    <datalist id="hall-name-presets">
                      <option value="Hall 1 - Screen X" />
                      <option value="Hall 2 - Screen 2D" />
                      <option value="Hall 3 - Screen 3D" />
                      <option value="VIP Hall" />
                    </datalist>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600">
                      Hall Type
                    </label>
                    <select
                      value={hallType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setHallType(newType);
                        if (newType === "VIP") {
                          setHallCapacity(36);
                          if (!hallName || hallName.startsWith("Hall")) {
                            setHallName("VIP Hall");
                          }
                        } else {
                          setHallCapacity(94);
                          if (!hallName || hallName === "VIP Hall") {
                            setHallName("Hall 1 - Screen X");
                          }
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#b90101] cursor-pointer"
                    >
                      <option value="STANDARD">Standard hall</option>
                      <option value="VIP">VIP hall</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600">
                      Seat Capacity
                    </label>
                    <select
                      value={hallCapacity}
                      onChange={(e) => {
                        const cap = parseInt(e.target.value, 10);
                        setHallCapacity(cap);
                        if (cap === 36) {
                          setHallType("VIP");
                          if (!hallName || hallName.startsWith("Hall")) {
                            setHallName("VIP Hall");
                          }
                        } else {
                          setHallType("STANDARD");
                          if (!hallName || hallName === "VIP Hall") {
                            setHallName("Hall 1 - Screen X");
                          }
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-semibold focus:outline-none focus:border-[#b90101] cursor-pointer"
                    >
                      <option value={94}>94 Seats (Standard hall)</option>
                      <option value={36}>36 Seats (VIP hall)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isCreatingHall}
                    className="px-6 py-2.5 rounded-full bg-[#b90101] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    {isCreatingHall ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>Create Hall & Seats</span>
                  </button>
                </div>
              </form>

              {/* Existing Halls Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-500">
                  Existing Cinema Halls in Database ({halls.length})
                </h4>

                {halls.length === 0 ? (
                  <div className="py-8 text-center text-neutral-400 font-semibold text-sm">
                    No halls registered yet. Use the auto-presets above to add
                    halls!
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                    {halls.map((h) => (
                      <div
                        key={h.uuid}
                        className="flex items-center justify-between p-4 hover:bg-neutral-50/80 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-700">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-sm font-extrabold text-neutral-900">
                              {h.name}
                            </h5>
                            <p className="text-xs text-neutral-500 font-semibold">
                              Type: {h.hallType} &bull; Capacity:{" "}
                              {h.capacity || 50} seats
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              h.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {h.status || "ACTIVE"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
