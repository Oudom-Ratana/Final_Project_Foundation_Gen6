import { Link } from "react-router";
import { useGetTrendingMoviesQuery } from "../../services/api/movieApi";
import { MOCK_TRENDING_MOVIES } from "../../data/homeData";
import MovieCard from "./MovieCard";
import { ChevronRight } from "lucide-react";

export default function TrendingSection() {
  const { data: tmdbMovies, isLoading } = useGetTrendingMoviesQuery("day");

  
  const moviesToDisplay =
    tmdbMovies && tmdbMovies.length > 0
      ? tmdbMovies.slice(0, 8)
      : MOCK_TRENDING_MOVIES;

  return (
    <section className="space-y-6 font-sans">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="w-1.5 h-6 rounded-full inline-block"
            style={{ backgroundColor: "#B90101" }}
          />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            Trending Now
          </h2>
        </div>

        <Link
          to="/movies"
          className="flex items-center gap-1 text-[15px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-[#B90101] transition uppercase tracking-wider"
        >
          <span>Explore All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4-Column Responsive Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {moviesToDisplay.map((movie, index) => (
          <MovieCard key={movie.id || index} movie={movie} />
        ))}
      </div>

      {/* Big Centered "EXPLORE ALL TRENDING" Pill Button */}
      <div className="flex justify-center pt-4">
        <Link
          to="/movies"
          className="px-10 py-3.5 rounded-full bg-neutral-200 dark:bg-neutral-900/90 hover:bg-[#B90101] dark:hover:bg-[#B90101] text-neutral-900 dark:text-white hover:text-white border border-neutral-300 dark:border-white/15 font-black text-[16px] uppercase tracking-wider shadow-md transition active:scale-95"
        >
          Explore All Trending
        </Link>
      </div>
    </section>
  );
}
