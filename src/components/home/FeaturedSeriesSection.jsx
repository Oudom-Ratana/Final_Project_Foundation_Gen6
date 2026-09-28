import { useGetCinemaMoviesQuery } from "../../services/api/cinemaApi";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import ScrollReveal from "../common/ScrollReveal";

export default function FeaturedSeriesSection() {
  // Query next batch of movies from Teacher's Cinema API (page 1, size 8)
  const { data: cinemaData, isLoading } = useGetCinemaMoviesQuery({
    page: 2,
    size: 8,
    sortBy: "createdAt",
    direction: "desc",
  });

  const { data: fallbackData } = useGetCinemaMoviesQuery(
    { page: 0, size: 8, sortBy: "createdAt", direction: "desc" },
    { skip: Boolean(cinemaData?.content?.length) },
  );

  const rawMovies = cinemaData?.content?.length
    ? cinemaData.content
    : fallbackData?.content || [];

  // Normalize Teacher's Cinema Movie fields to MovieCard format
  const moviesToDisplay = rawMovies.map((m) => ({
    id: m.uuid,
    uuid: m.uuid,
    title: m.title,
    poster_path: m.posterUrl,
    backdrop_path: m.backdropUrl,
    runtime: m.runtimeMinutes,
    release_date: m.releaseDate,
    overview: m.overview,
    vote_average: 0,
  }));

  return (
    <section className="space-y-6 font-sans">
      {/* Section Header */}
      <div className="flex items-center gap-2.5">
        <span
          className="w-1.5 h-6 rounded-full inline-block"
          style={{ backgroundColor: "#B90101" }}
        />
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
          Featured Movies
        </h2>
      </div>

      {/* 4-Column Responsive Grid (8 Cards or 8 Skeletons) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {isLoading && moviesToDisplay.length === 0
          ? Array.from({ length: 8 }).map((_, index) => (
              <MovieCardSkeleton key={`skeleton-featured-${index}`} />
            ))
          : moviesToDisplay.map((movie, index) => (
              <ScrollReveal
                key={movie.id || index}
                delay={(index % 4) * 80}
                duration={700}
                distance="translate-y-12"
              >
                <MovieCard basePath="/movies" movie={movie} />
              </ScrollReveal>
            ))}
      </div>
    </section>
  );
}
