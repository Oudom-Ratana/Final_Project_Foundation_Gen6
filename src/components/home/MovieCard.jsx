import { Star, Heart } from "lucide-react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWatchlist,
  selectWatchlist,
} from "../../redux/slices/watchlistSlice";

export default function MovieCard({ movie, basePath = "/movies" }) {
  const dispatch = useDispatch();
  const watchlist = useSelector(selectWatchlist);

  if (!movie) return null;

  const isFavorite = movie.id
    ? watchlist.some((item) => item.id === movie.id)
    : false;

  const title = movie.title || movie.name || "Untitled";
  const rating = (movie.vote_average || 8.5).toFixed(1);
  const releaseYear = (
    movie.release_date ||
    movie.first_air_date ||
    "2026"
  ).slice(0, 4);
  const runtime = movie.runtime || "2h 12m";

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

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWatchlist(movie));
  };

  return (
    <div className="group flex flex-col space-y-3 font-sans cursor-pointer">
      {/* Poster Container with Mixed Corner Radius and Dark Blur Hover Overlay */}
      <Link
        to={movie.id ? `${basePath}/${movie.id}` : "#"}
        className="relative aspect-[291/386] w-full overflow-hidden shadow-md dark:shadow-2xl bg-neutral-900 border border-neutral-200/80 dark:border-white/10 transition-all duration-300 rounded-tl-[25px] rounded-br-[25px] rounded-tr-none rounded-bl-none"
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
        <div className="absolute  inset-0 bg-black/75 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center p-4 sm:p-5 text-center">
          <div className="transform translate-y-3 mx-auto group-hover:translate-y-0 transition-transform duration-300 space-y-2">
            <span
              className="inline-flex items-center justify-center px-4 py-1 rounded-full text-white font-black text-[12px] sm:text-[13px] uppercase tracking-wider shadow-md border border-white/20"
              style={{ backgroundColor: "#B90101" }}
            >
              {genreName.toUpperCase()}
            </span>
            <p className="text-white text-xs sm:text-[18px] leading-relaxed line-clamp-4 font-normal drop-shadow">
              {overviewText}
            </p>
            <span className="inline-flex items-center text-[16px] font-bold text-neutral-300 group-hover:text-accent-gold pt-1">
              Booking Now →
            </span>
          </div>
        </div>
      </Link>

      {/* Title & Metadata */}
      <div className="space-y-1 px-0.5">
        <Link to={movie.id ? `${basePath}/${movie.id}` : "#"}>
          <h3 className="font-black text-[20px] text-neutral-900 dark:text-white leading-tight line-clamp-1 group-hover:text-[#B90101] transition-colors">
            {title}
          </h3>
        </Link>

        {/* Time and Rating Row with Favorite Heart Button */}
        <div className="flex items-center justify-between pt-0.5">
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400 font-medium">
            {runtime} • {releaseYear}
          </p>

          {/* Right Side: Rating + Favorite Heart Button */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 text-[#FFD700]">
              <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
              <span className="text-[14px] font-black leading-none">
                {rating}
              </span>
            </div>

            {/* Favorite Heart Button */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              className="p-1 rounded-full hover:bg-neutral-200/60 dark:hover:bg-white/10 transition cursor-pointer active:scale-90"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorite
                    ? "fill-[#B90101] text-[#B90101]"
                    : "text-neutral-400 hover:text-[#B90101]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Red Genre Pill Badge - Commented out for now as requested */}
      {/*
      <div className="pt-0.5">
        <span
          className="inline-block px-4 py-1 rounded-full text-white font-black text-[12px] uppercase tracking-wider shadow-xs"
          style={{ backgroundColor: "#B90101" }}
        >
          {genreName.toUpperCase()}
        </span>
      </div>
      */}
    </div>
  );
}
