import { useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Play,
  FileText,
  Clock,
  Calendar,
  ShieldAlert,
  Heart,
  Edit3,
  Film,
  BookOpen,
  Clapperboard,
  Sparkles,
  Tv,
  X,
} from "lucide-react";
import {
  useGetMovieDetailsQuery,
  useGetMovieTrailersQuery,
} from "../services/api/movieApi";
import {
  useGetTVDetailsQuery,
  useGetTVTrailersQuery,
} from "../services/api/tvApi";
import StreamPlayerModal from "../components/stream/StreamPlayerModal";
import MovieDetailSkeleton from "../components/common/MovieDetailSkeleton";
import { formatMovieRuntime } from "../utils/formatRuntime";
import {
  addToFavourite,
  removeFromFavourite,
} from "../redux/slices/favouriteSlice";
import { selectIsAuthenticated } from "../redux/slices/authSlice";
import { useAddFavoriteMutation } from "../services/api/accountApi";

export default function StreamMovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const isExplicitTV = typeParam === "tv";

  // If explicitly TV series, skip movie details to prevent numeric ID collisions
  const {
    data: movieData,
    isLoading: isMovieLoading,
    isError: isMovieError,
  } = useGetMovieDetailsQuery(id, { skip: isExplicitTV });

  // Fetch TV details if explicitly TV or if movie details failed
  const {
    data: tvData,
    isLoading: isTVLoading,
    isFetching: isTVFetching,
    isError: isTVError,
  } = useGetTVDetailsQuery(id, {
    skip: !isExplicitTV && !isMovieError,
  });

  const { data: movieTrailers } = useGetMovieTrailersQuery(id, {
    skip: isExplicitTV,
  });
  const { data: tvTrailers } = useGetTVTrailersQuery(id, {
    skip: !isExplicitTV && !isMovieError,
  });

  const dispatch = useDispatch();
  const favouriteMovies = useSelector((state) => state.favourite.movies);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [addFavorite] = useAddFavoriteMutation();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const isFavourite = favouriteMovies.some((m) => String(m.id) === String(id));

  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerMode, setPlayerMode] = useState("full_movie"); // 'full_movie' | 'trailer'

  const data = isExplicitTV ? tvData : movieData || tvData;
  const isTV = Boolean(
    isExplicitTV || (tvData && !movieData) || data?.number_of_seasons,
  );

  const isInitialLoading = isExplicitTV
    ? isTVLoading || (!tvData && !isTVError)
    : isMovieLoading ||
      (!movieData && !isMovieError) ||
      (isMovieError && (isTVLoading || (!tvData && !isTVError)));

  const isActuallyError = isExplicitTV ? isTVError : isMovieError && isTVError;

  // While fetching data or if data is not yet ready, always render the loading skeleton!
  if (isInitialLoading || (!data && !isActuallyError)) {
    return <MovieDetailSkeleton />;
  }

  // Only show error screen if all queries have genuinely completed and returned an error
  if (isActuallyError || !data) {
    return (
      <div className="w-full py-20 text-center space-y-4 font-sans">
        <h2 className="text-3xl font-black text-[#B90101]">Movie Not Found</h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          The requested content could not be loaded. Please try again.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-full bg-[#B90101] text-white font-bold hover:brightness-110 active:scale-95 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Extract movie/TV metadata
  const title = data.title || data.name || "Untitled";
  const genres =
    data.genres?.map((g) => g.name).join(", ") || "Action, Adventure, Drama";

  const season1 =
    data.seasons?.find((s) => s.season_number === 1) || data.seasons?.[0];
  const season1EpisodeCount =
    season1?.episode_count || data.number_of_episodes || 8;
  const totalEpisodes = isTV ? Math.min(season1EpisodeCount, 24) : 1;

  const duration = isTV
    ? `${data.number_of_seasons || 1} Season${(data.number_of_seasons || 1) > 1 ? "s" : ""} • ${data.number_of_episodes || totalEpisodes} Ep`
    : data.runtime
      ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}min`
      : data.episode_run_time?.[0]
        ? `${data.episode_run_time[0]}min`
        : formatMovieRuntime(
            data.runtime,
            data.id,
            isTV,
            data.number_of_seasons,
          );

  const rawDate = data.release_date || data.first_air_date || "2026-07-30";
  const releaseDate = new Date(rawDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const classification = data.adult ? "R18+" : "NC15";
  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : data.poster_path
      ? `https://image.tmdb.org/t/p/original${data.poster_path}`
      : "";

  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : backdropUrl;

  const allVideos = [
    ...(movieTrailers || []),
    ...(tvTrailers || []),
    ...(data.videos?.results || []),
  ];

  const trailerKey =
    allVideos.find(
      (v) =>
        v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
    )?.key ||
    allVideos.find((v) => v.site === "YouTube" && v.type === "Trailer")?.key ||
    allVideos.find((v) => v.site === "YouTube")?.key;

  // Extract Cast & Crew (Writers, Producers, Directors)
  const crewList = data.credits?.crew || [];
  const castList = data.credits?.cast || [];

  const writer =
    crewList.find((c) => c.job === "Screenplay" || c.job === "Writer")?.name ||
    "George R. R. Martin";
  const producer =
    crewList.find((c) => c.job === "Producer" || c.job === "Executive Producer")
      ?.name || "D. B. Weiss";
  const creator =
    data.created_by?.[0]?.name ||
    crewList.find((c) => c.job === "Story" || c.job === "Creator")?.name ||
    "David Friedman";
  const director =
    crewList.find((c) => c.job === "Director")?.name || "Alan Taylor";
  const secondaryDirector =
    crewList.filter((c) => c.job === "Director")?.[1]?.name ||
    castList?.[0]?.name ||
    "Alex Graves";

  const crewCards = [
    { name: writer, role: "Writer", icon: Edit3 },
    { name: producer, role: "Producer", icon: Film },
    { name: creator, role: "Created by", icon: BookOpen },
    { name: director, role: "Director", icon: Clapperboard },
    { name: secondaryDirector, role: "Director", icon: Edit3 },
  ];

  const handleOpenTrailer = () => {
    setPlayerMode("trailer");
    setIsPlayerOpen(true);
  };

  const handleOpenFullMovie = (ep = selectedEpisode) => {
    setSelectedEpisode(ep);
    setPlayerMode("full_movie");
    setIsPlayerOpen(true);
  };

  // Build a standalone record so the Favourite page can render without refetching
  const favouritePayload = {
    id,
    title,
    posterUrl,
    duration,
    year: rawDate.slice(0, 4),
    genre: genres,
    description: data.overview || data.tagline || "",
    isTV,
  };

  const toggleFavourite = async () => {
    // Users must have an account before they can add to favourites
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    const nextFavState = !isFavourite;

    // 1. Instant local/optimistic update
    if (isFavourite) {
      dispatch(removeFromFavourite(id));
    } else {
      dispatch(addToFavourite(favouritePayload));
    }

    // 2. Sync to official TMDB Account Favorite API
    try {
      await addFavorite({
        mediaType: isTV ? "tv" : "movie",
        mediaId: id,
        favorite: nextFavState,
      }).unwrap();
    } catch (err) {
      console.warn("Failed to sync favorite with TMDB API:", err);
    }
  };

  return (
    <div className="relative w-full -mt-6 sm:-mt-8 pb-20 font-sans select-none">
      {/* 1. Full-Width + Full-Height Backdrop (absolute + page-contained; -bottom-12 covers main's pb-12 so it reaches the footer) */}
      <div className="absolute -top-24 -bottom-12 left-1/2 -translate-x-1/2 w-screen z-0 pointer-events-none overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center filter blur-xs opacity-25 dark:opacity-35 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F6F7F9] dark:from-[#080203] via-[#F6F7F9]/80 dark:via-black/70 to-transparent dark:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6F7F9] dark:from-black via-transparent to-[#F6F7F9] dark:to-black dark:hidden" />
      </div>

      <div className="relative z-10 space-y-12 pt-6">
        {/* 2. Top Navigation (Back Button) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#B90101] text-white flex items-center justify-center hover:brightness-110 active:scale-95 transition cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* 3. Main Detail Grid (Poster on Left + Metadata & Controls on Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Large Movie Poster Card */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
            <div className="relative aspect-[2/3] w-full max-w-[340px] rounded-[25px] overflow-hidden bg-neutral-900 border border-neutral-200/80 dark:border-white/15">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Title, Metadata, Action Buttons & Episode Picker */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">
              {title}
            </h1>

            {/* Metadata List with Red Outline Icons */}
            <div className="space-y-3 pt-1 text-sm sm:text-base font-semibold text-neutral-700 dark:text-neutral-200">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#B90101] shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">
                    Genre:
                  </strong>{" "}
                  {genres}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#B90101] shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">
                    Duration:
                  </strong>{" "}
                  {duration}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#B90101] shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">
                    Release:
                  </strong>{" "}
                  {releaseDate}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#B90101] shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">
                    Classification:
                  </strong>{" "}
                  {classification}
                </span>
              </div>

              {/* Clickable Favourite Button */}
              <button
                type="button"
                onClick={toggleFavourite}
                className="flex items-center gap-3 text-neutral-700 dark:text-neutral-200 hover:text-[#B90101] transition"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavourite
                      ? "fill-[#B90101] text-[#B90101]"
                      : "text-[#B90101]"
                  }`}
                />
                <span className="font-sans font-bold dark:text-white text-neutral-900">
                  Favourite
                </span>
              </button>
            </div>

            {/* Action Buttons: Watch Trailer & Full Movie */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              {/* Watch Trailer Button (White Pill if available, disabled notice if not) */}
              {trailerKey ? (
                <button
                  type="button"
                  onClick={handleOpenTrailer}
                  className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border bg-[var(--primary-color-5)] border-[var(--border-light-mode)] dark:bg-[var(--primary-color-30)] dark:border-[var(--border-dark-mode)] text-neutral-900 font-sans font-bold text-sm uppercase tracking-wider hover:brightness-105 hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-[var(--primary-red)]" />
                  <span className="text-[var(--primary-red)]">
                    Watch Trailer
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  title="Official trailer not available on TMDB for this title"
                  className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-neutral-300/60 dark:border-white/10 bg-neutral-100/60 dark:bg-white/5 text-neutral-400 dark:text-neutral-500 font-sans font-bold text-sm uppercase tracking-wider cursor-not-allowed opacity-60"
                >
                  <Film className="w-4 h-4" />
                  <span>Trailer Unavailable</span>
                </button>
              )}

              {/* Full Movie / Watch Series Button (Red Pill) */}
              <button
                type="button"
                onClick={() => handleOpenFullMovie(selectedEpisode)}
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-full text-white font-sans font-bold text-sm uppercase tracking-wider hover:brightness-110 hover:scale-105 active:scale-95 transition cursor-pointer"
                style={{ backgroundColor: "#B90101" }}
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {isTV ? `Watch Episode ${selectedEpisode}` : "Full Movie"}
                </span>
              </button>
            </div>

            {/* Episode Selector - STRICTLY ONLY rendered for TV Series / Multiple Episodes */}
            {isTV && totalEpisodes > 1 && (
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-400">
                  <Tv className="w-4 h-4 text-[#B90101]" />
                  <span className="uppercase tracking-wider">
                    Select Episode ({totalEpisodes} Available)
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 pb-2 select-none">
                  {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map(
                    (ep) => {
                      const isSelected = selectedEpisode === ep;
                      return (
                        <button
                          key={ep}
                          type="button"
                          onClick={() => {
                            setSelectedEpisode(ep);
                            handleOpenFullMovie(ep);
                          }}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                            isSelected
                              ? "bg-[#B90101] text-white"
                              : "bg-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)]"
                          }`}
                        >
                          <Play
                            className={`w-3 h-3 ${isSelected ? "fill-white" : "fill-current"}`}
                          />
                          <span>Ep {ep}</span>
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Bottom Row: 5 Glassmorphic Cast & Crew Cards */}
        <div className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {crewCards.map((crew, index) => {
              const IconComp = crew.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)] bg-[var(--primary-color-5)] dark:bg-[var(--primary-color-30)] backdrop-blur-md p-4 sm:p-5 text-center flex flex-col items-center justify-center gap-2 shadow-sm dark:shadow-xl hover:scale-105 transition-transform"
                >
                  {/* Red Circle Icon */}
                  <div className="w-10 h-10 rounded-full bg-[#B90101] flex items-center justify-center text-white shadow-md">
                    <IconComp className="w-5 h-5" />
                  </div>
                  {/* Name & Role */}
                  <div className="space-y-0.5">
                    <h4 className="font-black text-sm sm:text-base text-neutral-900 dark:text-white line-clamp-1">
                      {crew.name}
                    </h4>
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      {crew.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Stream Video Player Modal (VidSrc + TMDB YouTube Trailer) */}
      <StreamPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        tmdbId={id}
        mediaType={isTV ? "tv" : "movie"}
        title={title}
        trailerKey={trailerKey}
        initialMode={playerMode}
        season={1}
        episode={selectedEpisode}
        totalEpisodes={totalEpisodes}
        onEpisodeChange={(ep) => setSelectedEpisode(ep)}
      />

      {/* Login Required Popup - shown center of the page, can only be dismissed via the X */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#1A1F25] border border-neutral-200 dark:border-white/10 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLoginPrompt(false)}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[#B90101]/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#B90101]" />
              </div>
              <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                Login Required
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                You must have an account first before add to favourite
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
