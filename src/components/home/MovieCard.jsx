import { Star } from "lucide-react";
import { Link } from "react-router";

export default function MovieCard({ movie, basePath = "/movies" }) {
  if (!movie) return null;

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

  return (
    <div className="group flex flex-col space-y-3 font-sans cursor-pointer">
      {/* Poster Container with Mixed Corner Radius (Top-Left: 25px, Top-Right: 0px, Bottom-Left: 0px, Bottom-Right: 25px) */}
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

        {/* Gold Rating Badge (Top Right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#FFD700]/60 shadow-md">
          <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
          <span className="text-[14px] font-black text-[#FFD700] leading-none">
            {rating}
          </span>
        </div>
      </Link>

      {/* Title & Metadata */}
      <div className="space-y-1 px-0.5">
        <h3 className="font-black text-[20px] text-neutral-900 dark:text-white leading-tight line-clamp-1 group-hover:text-[#B90101] transition-colors">
          {title}
        </h3>
        <p className="text-[15px] text-neutral-500 dark:text-neutral-400 font-medium">
          {runtime} • {releaseYear}
        </p>
      </div>

      {/* Red Genre Pill Badge */}
      <div className="pt-0.5">
        <span
          className="inline-block px-4 py-1 rounded-full text-white font-black text-[12px] uppercase tracking-wider shadow-xs"
          style={{ backgroundColor: "#B90101" }}
        >
          {genreName.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
