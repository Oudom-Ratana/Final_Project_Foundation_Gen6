import { useMemo } from "react";
import { Link } from "react-router";
import { Star, Ticket, Calendar, Clock } from "lucide-react";
import { CardStack } from "../ui/card-stack";
import { useActiveMovies } from "../../utils/movieCatalogService";
import { useGetNowPlayingMoviesQuery } from "../../services/api/movieApi";

export default function MovieCardStack({
  title = "Spotlight Premiere Showcase",
  subtitle = "Swipe or click through our featured blockbusters in interactive 3D fanned view",
  maxMovies = 7,
}) {
  const managedMovies = useActiveMovies();
  const { data: tmdbMovies } = useGetNowPlayingMoviesQuery(1);

  // Prepare movie items for the card stack
  const movieItems = useMemo(() => {
    // If managedMovies has fewer items, supplement with TMDB movies so stack always has 7 cards
    let sourceList = [];
    if (managedMovies && managedMovies.length > 0) {
      sourceList = [...managedMovies];
      if (
        sourceList.length < maxMovies &&
        tmdbMovies &&
        tmdbMovies.length > 0
      ) {
        const existingIds = new Set(sourceList.map((m) => m.id || m.tmdbId));
        const extraMovies = tmdbMovies.filter(
          (m) => !existingIds.has(m.id || m.tmdbId),
        );
        sourceList = [...sourceList, ...extraMovies];
      }
    } else {
      sourceList = tmdbMovies || [];
    }

    if (!sourceList.length) return [];

    return sourceList.slice(0, maxMovies).map((movie, index) => {
      // Robust backdrop and poster resolution
      const backdrop = movie.backdrop_path
        ? movie.backdrop_path.startsWith("http")
          ? movie.backdrop_path
          : `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : movie.poster_path
          ? movie.poster_path.startsWith("http")
            ? movie.poster_path
            : `https://image.tmdb.org/t/p/w780${movie.poster_path}`
          : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80";

      const poster = movie.poster_path
        ? movie.poster_path.startsWith("http")
          ? movie.poster_path
          : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : backdrop;

      // Robust full genre resolution (handles "Anime, Action", ["Anime"], or genre_ids)
      let genreName = "BLOCKBUSTER";
      if (movie.genreLabel) {
        genreName = movie.genreLabel;
      } else if (typeof movie.genre === "string") {
        genreName = movie.genre.split(",")[0].trim();
      } else if (typeof movie.genres === "string") {
        genreName = movie.genres.split(",")[0].trim();
      } else if (Array.isArray(movie.genres) && movie.genres.length > 0) {
        genreName =
          typeof movie.genres[0] === "string"
            ? movie.genres[0]
            : movie.genres[0]?.name || "BLOCKBUSTER";
      }

      return {
        id: movie.id || index,
        title: movie.title || movie.name || "Untitled Movie",
        description:
          movie.overview ||
          "Experience stunning visuals and immersive sound in FilmZone auditoriums.",
        imageSrc: backdrop,
        posterSrc: poster,
        href: `/movies/${movie.id}`,
        rating: (movie.vote_average || 8.6).toFixed(1),
        genre: String(genreName).toUpperCase(),
        release: (movie.year || movie.release_date || "2026").slice(0, 4),
        runtime:
          movie.duration ||
          (movie.runtime ? `${movie.runtime} min` : "120 min"),
      };
    });
  }, [managedMovies, tmdbMovies, maxMovies]);

  if (!movieItems.length) return null;

  return (
    <section className="w-full font-sans py-6">
      {/* Header Container (Aligned to max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-1.5 h-6 rounded-full inline-block bg-[#B90101]" />
              <p className="text-xs font-black uppercase tracking-widest text-[#B90101]">
                Interactive 3D Stage
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 3D Fan Stack - Frameless Full Width (No bottom cutoff) */}
      <div className="w-full pb-8">
        <CardStack
          items={movieItems}
          initialIndex={Math.floor(movieItems.length / 2)}
          cardWidth={580}
          cardHeight={350}
          overlap={0.46}
          spreadDeg={42}
          depthPx={140}
          tiltXDeg={8}
          autoAdvance={true}
          intervalMs={3000}
          pauseOnHover
          showDots={false}
          renderCard={(movie, { active }) => (
            <div className="relative h-full w-full bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
              {/* Movie Backdrop Artwork */}
              <img
                src={movie.imageSrc}
                alt={movie.title}
                className={`h-full w-full object-cover transition-transform duration-700 ${
                  active ? "scale-105" : "scale-100 filter brightness-95"
                }`}
                onError={(e) => {
                  if (movie.posterSrc && e.target.src !== movie.posterSrc) {
                    e.target.src = movie.posterSrc;
                  } else {
                    e.target.src =
                      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80";
                  }
                }}
                draggable={false}
              />

              {/* Bottom Cinema Gradient (No harsh side blackout) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Top Meta Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#B90101] text-white shadow-md">
                  {movie.genre}
                </span>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FFD700]">
                  <Star className="w-3.5 h-3.5 fill-[#FFD700]" />
                  <span className="text-xs font-black">{movie.rating}</span>
                </div>
              </div>

              {/* Bottom Content Bar */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 flex flex-col justify-end">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight line-clamp-1 drop-shadow-md">
                  {movie.title}
                </h3>

                <p className="text-xs text-neutral-300 line-clamp-2 mt-1.5 leading-relaxed drop-shadow">
                  {movie.description}
                </p>

                {/* Footer with Showtimes CTA */}
                <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-400" />
                      {movie.release}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {movie.runtime}
                    </span>
                  </div>

                  <Link
                    to={movie.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B90101] hover:bg-[#8F0101] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#B90101]/30 hover:scale-105 active:scale-95 transition"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Book Seats</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
}
