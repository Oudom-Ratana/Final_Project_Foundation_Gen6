import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Clock, Calendar, Globe, Film, ArrowLeft, Play } from "lucide-react";
import { useGetCinemaMovieByUuidQuery } from "../services/api/cinemaApi";
import { useGetMovieTrailersQuery } from "../services/api/movieApi";
import ShowtimeSection from "../components/booking/ShowtimeSection";
import MovieDetailSkeleton from "../components/common/MovieDetailSkeleton";

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const {
    data: movie,
    isLoading: isCinemaLoading,
    isError: isCinemaError,
    error: cinemaError,
  } = useGetCinemaMovieByUuidQuery(id, { skip: !id });

  const tmdbId = movie?.tmdbId;
  const { data: trailersData } = useGetMovieTrailersQuery(tmdbId, {
    skip: !tmdbId,
  });

  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  const trailerKey =
    trailersData?.find(
      (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    )?.key || trailersData?.find((v) => v.site === "YouTube")?.key;

  if (isCinemaLoading) {
    return <MovieDetailSkeleton />;
  }

  if (isCinemaError || !movie) {
    return (
      <div className="w-full py-20 text-center space-y-4 font-sans">
        <h2 className="text-3xl font-black text-[#B90101]">Movie Not Found</h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          {cinemaError?.data?.message ||
            "The requested movie could not be loaded from the cinema booking system."}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B90101] text-white font-bold hover:brightness-110 active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  const title = movie.title || movie.originalTitle || "Untitled Movie";
  const overview =
    movie.overview ||
    "Experience this movie on the big screen with premium sound and visuals at FilmZone.";

  const runtimeText = movie.runtimeMinutes
    ? `${Math.floor(movie.runtimeMinutes / 60)}h ${movie.runtimeMinutes % 60}m (${movie.runtimeMinutes} min)`
    : "Runtime unavailable";

  const releaseDateText = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Now Showing";

  const language = (movie.language || "English").toUpperCase();
  const status = movie.status || "ACTIVE";
  const backdropUrl = movie.backdropUrl || movie.posterUrl || "";
  const posterUrl = movie.posterUrl || backdropUrl || "/placeholder-poster.png";

  return (
    <div className="relative w-full pb-24 font-sans select-none space-y-12">
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800/80 shadow-2xl min-h-[460px] md:min-h-[500px]">
        {backdropUrl && (
          <div
            className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-[1500ms] ease-out ${
              isPlayingTrailer ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover object-center opacity-40 sm:opacity-50 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40" />
          </div>
        )}

        <div
          className={`absolute inset-0 z-20 bg-black transition-opacity duration-[1500ms] ease-out ${
            isPlayingTrailer
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {isPlayingTrailer && (
            <>
              <button
                type="button"
                onClick={() => setIsPlayingTrailer(false)}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#B90101] text-white flex items-center justify-center shadow-2xl hover:brightness-110 active:scale-95 transition cursor-pointer border border-white/20"
                aria-label="Stop trailer and return"
                title="Stop trailer and return"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {trailerKey ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`}
                  title={`${title} Official Trailer`}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full min-h-[460px] flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <p className="text-white text-lg font-bold">
                    No official trailer found for ${title}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsPlayingTrailer(false)}
                    className="px-6 py-2.5 rounded-full bg-[#B90101] text-white font-bold text-sm hover:brightness-110 active:scale-95 transition cursor-pointer"
                  >
                    Return to Movie Details
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div
          className={`relative z-10 p-6 sm:p-10 lg:p-12 transition-all duration-[1500ms] ease-out ${
            isPlayingTrailer
              ? "opacity-0 -translate-y-4 scale-95 pointer-events-none"
              : "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
              <div className="relative aspect-[2/3] w-full max-w-[280px] sm:max-w-[320px] rounded-[25px] overflow-hidden shadow-2xl bg-neutral-900 border border-white/10">
                <img
                  src={posterUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8 space-y-5 pt-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#B90101]/20 text-[#B90101] border border-[#B90101]/30">
                  <Film className="w-3.5 h-3.5" />
                  <span>{status === "ACTIVE" ? "Now Showing" : status}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {title}
              </h1>

              <div className="space-y-2.5 pt-1 text-sm sm:text-base text-neutral-300 font-medium">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#B90101] shrink-0" />
                  <span>
                    Duration:{" "}
                    <span className="text-white font-semibold">{runtimeText}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#B90101] shrink-0" />
                  <span>
                    Release Date:{" "}
                    <span className="text-white font-semibold">{releaseDateText}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#B90101] shrink-0" />
                  <span>
                    Language:{" "}
                    <span className="text-white font-semibold">{language}</span>
                  </span>
                </div>
              </div>

              {trailerKey && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPlayingTrailer(true)}
                    className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-red-950/60 hover:brightness-110 active:scale-95 transition cursor-pointer"
                    style={{ backgroundColor: "#B90101" }}
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                    <span>Watch Trailer</span>
                  </button>
                </div>
              )}

              <div className="pt-3 space-y-2">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-400">
                  Storyline
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl">
                  {overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <ShowtimeSection
          movieId={movie.uuid || id}
          isTV={false}
          movie={movie}
        />
      </div>
    </div>
  );
}
