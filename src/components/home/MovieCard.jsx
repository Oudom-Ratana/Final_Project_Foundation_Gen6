import { useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, Heart, X } from "lucide-react";
import { Link } from "react-router";
import { useGetMovieRuntimeQuery } from "../../services/api/movieApi";
import {
  useToggleFavoriteMutation,
  useGetMyFavoritesQuery,
} from "../../services/api/authApi";
import {
  addToFavourite,
  removeFromFavourite,
} from "../../redux/slices/favouriteSlice";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";
import { formatMovieRuntime } from "../../utils/formatRuntime";

export default function MovieCard({ movie, basePath = "/movies" }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const favouriteMovies = useSelector((state) => state.favourite?.movies || []);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Teacher API mutation for toggling favorite
  const [toggleFavoriteApi, { isLoading: isTogglingFavorite }] =
    useToggleFavoriteMutation();

  // Fetch current user's favorites from Teacher API (auto-cached & tag-invalidated)
  const { data: teacherFavorites } = useGetMyFavoritesQuery(
    { page: 0, size: 50 },
    { skip: !isAuthenticated, refetchOnMountOrArgChange: true },
  );

  const isTV = Boolean(
    movie?.media_type === "tv" ||
    movie?.first_air_date ||
    (movie?.name && !movie?.title),
  );

  const { data: fetchedRuntime } = useGetMovieRuntimeQuery(movie?.id, {
    skip: !movie?.id || isTV || Boolean(movie?.runtime),
  });

  if (!movie) return null;

  const targetUrl = movie.id
    ? `${basePath}/${movie.id}${isTV ? "?type=tv" : ""}`
    : "#";

  const title = movie.title || movie.name || "Untitled";
  const rating = (movie.vote_average || 8.5).toFixed(1);
  const releaseYear = (
    movie.release_date ||
    movie.first_air_date ||
    "2026"
  ).slice(0, 4);

  const rawRuntime = movie.runtime || fetchedRuntime;
  const runtime = formatMovieRuntime(
    rawRuntime,
    movie.id,
    isTV,
    movie.number_of_seasons,
  );

  // Handle genre resolution
  let genreName = "ACTION";
  if (movie.genre) {
    genreName = movie.genre;
  } else if (movie.genres && movie.genres.length > 0) {
    genreName = movie.genres[0].name || movie.genres[0];
  } else if (movie.genre_ids && movie.genre_ids.length > 0) {
    const genreMap = {
      28: "ACTION",
      12: "ADVENTURE",
      16: "ANIMATION",
      35: "COMEDY",
      80: "CRIME",
      18: "DRAMA",
      14: "FANTASY",
      27: "HORROR",
      878: "SCI-FI",
      10759: "ACTION",
      10765: "FANTASY",
    };
    genreName = genreMap[movie.genre_ids[0]] || "ACTION";
  }

  // Handle poster path (TMDB vs full URL)
  const posterUrl = movie.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80";

  const overviewText =
    movie.overview ||
    "Experience the thrilling adventures, captivating story, and cinematic brilliance of this blockbuster release.";

  // Determine favorite state from Redux state or Teacher API
  const movieUuid = movie.uuid || movie.id;
  const isFavourite =
    favouriteMovies.some(
      (m) =>
        String(m.id) === String(movieUuid) ||
        (m.uuid && String(m.uuid) === String(movieUuid)),
    ) ||
    Boolean(
      teacherFavorites?.content?.some(
        (f) =>
          String(f.movieUuid) === String(movieUuid) ||
          String(f.uuid) === String(movieUuid),
      ),
    );

  // Handle Favorite Toggle via Teacher API
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    // 1. Optimistic update in Redux store
    if (isFavourite) {
      dispatch(removeFromFavourite(movieUuid));
    } else {
      dispatch(
        addToFavourite({
          id: movieUuid,
          uuid: movieUuid,
          title,
          posterUrl,
          duration: runtime,
          year: releaseYear,
          genre: genreName,
          description: overviewText,
          isTV,
        }),
      );
    }

    // 2. Sync to Teacher's Cinema Favorite API: PATCH /api/v1/users/me/favorites/{movieUuid}
    try {
      if (
        movieUuid &&
        typeof movieUuid === "string" &&
        movieUuid.includes("-")
      ) {
        await toggleFavoriteApi(movieUuid).unwrap();
      }
    } catch (err) {
      console.warn("Teacher API favorite toggle response:", err);
    }
  };

  return (
    <div className="group flex flex-col space-y-3 font-sans cursor-pointer">
      {/* Poster Container with Top-Right Favorite Button */}
      <div className="relative">
        {/* Poster Container with Mixed Corner Radius and Dark Blur Hover Overlay */}
        <Link
          to={targetUrl}
          className="relative aspect-[291/386] w-full overflow-hidden block shadow-md dark:shadow-2xl bg-neutral-900 border border-neutral-200/80 dark:border-white/10 transition-all duration-300 rounded-tl-[25px] rounded-br-[25px] rounded-tr-none rounded-bl-none"
          style={{
            borderTopLeftRadius: "25px",
            borderBottomRightRadius: "25px",
            borderTopRightRadius: "0px",
            borderBottomLeftRadius: "0px",
          }}
        >
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
            loading="lazy"
          />

          {/* Dark Blur Hover Overlay with Description Pop-up (Active for both Light & Dark modes) */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center p-4 sm:p-5 text-center">
            <div className="transform translate-y-3 mx-auto group-hover:translate-y-0 transition-transform duration-300 space-y-2">
              <span
                className="inline-flex items-center justify-center px-4 py-1 rounded-full text-white font-black text-[12px] sm:text-[13px] uppercase tracking-wider shadow-md border border-white/20"
                style={{ backgroundColor: "#B90101" }}
              >
                {genreName.toUpperCase()}
              </span>
              <p className="text-white text-xs sm:text-[18px] leading-7 line-clamp-4 font-light drop-shadow">
                {overviewText}
              </p>
              <span className="inline-flex items-center text-[16px] font-bold text-neutral-300 group-hover:text-accent-gold pt-1">
                {basePath === "/stream" ? "Stream Now →" : "Booking Now →"}
              </span>
            </div>
          </div>
        </Link>

        {/* Favorite Heart Button: Positioned on the Card Top Right */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
          className="absolute top-2.5 right-2.5 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 hover:scale-110 shadow-lg"
          aria-label={
            isFavourite
              ? `Remove ${title} from favourites`
              : `Add ${title} to favourites`
          }
          title={
            isFavourite
              ? `Remove ${title} from favourites`
              : `Add ${title} to favourites`
          }
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavourite
                ? "fill-[#B90101] text-[#B90101]"
                : "text-white hover:text-[#B90101]"
            }`}
          />
        </button>
      </div>

      {/* Title & Metadata */}
      <div className="space-y-1 px-0.5 pt-0.5">
        <Link to={targetUrl}>
          <h3 className="font-black text-[21px] sm:text-[22px] text-neutral-900 dark:text-white leading-tight line-clamp-1 group-hover:text-[#B90101] transition-colors">
            {title}
          </h3>
        </Link>

        {/* Time and Rating Row */}
        <div className="flex items-center justify-between pt-0.5">
          <p className="text-[18px] text-neutral-500 dark:text-neutral-400 font-semibold tracking-tight">
            {runtime} • {releaseYear}
          </p>

          {/* Right Side: Rating */}
          <div className="flex items-center gap-1 text-[#C8961E]">
            <Star className="w-4 h-4 fill-[#C8961E] text-[#C8961E]" />
            <span className="text-[18px] font-black leading-none">
              {rating}
            </span>
          </div>
        </div>
      </div>

      {/* Login Required Popup */}
      {showLoginPrompt &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-[#B90101]/10 text-[#B90101] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 fill-[#B90101]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Account Required
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Please sign in or create an account to save movies to your
                  favourites.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  className="flex-1 py-2 rounded-xl bg-[#B90101] hover:bg-[#a00101] text-white font-semibold text-sm transition-colors text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white font-semibold text-sm transition-colors text-center"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
