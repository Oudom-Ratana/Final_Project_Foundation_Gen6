import { Link } from "react-router";
import { useGetPopularTVQuery } from "../../services/api/tvApi";
import { MOCK_FEATURED_SERIES } from "../../data/homeData";
import MovieCard from "./MovieCard";
import { ChevronRight } from "lucide-react";

export default function FeaturedSeriesSection() {
  const { data: tmdbTV, isLoading } = useGetPopularTVQuery(1);

  // Use TMDB TV series if available (first 8), otherwise fallback to mock series
  const seriesToDisplay =
    tmdbTV && tmdbTV.length > 0 ? tmdbTV.slice(0, 8) : MOCK_FEATURED_SERIES;

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
            Featured Series
          </h2>
        </div>

        <Link
          to="/stream"
          className="flex items-center gap-1 text-[15px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-[#B90101] transition uppercase tracking-wider"
        >
          <span>Explore All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4-Column Responsive Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {seriesToDisplay.map((item, index) => (
          <MovieCard key={item.id || index} movie={item} />
        ))}
      </div>
    </section>
  );
}
