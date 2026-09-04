import { useGetUpcomingMoviesQuery } from "../../services/api/movieApi";
import { MOCK_COMING_SOON } from "../../data/homeData";
import ComingSoonCard from "./ComingSoonCard";

export default function ComingSoonSection() {
  const { data: tmdbUpcoming, isLoading } = useGetUpcomingMoviesQuery(1);

  // If TMDB upcoming data is available, map the first 3 items or use the curated mock banners
  const upcomingToDisplay =
    tmdbUpcoming && tmdbUpcoming.length >= 3
      ? tmdbUpcoming.slice(0, 3)
      : MOCK_COMING_SOON;

  return (
    <section className="space-y-6 font-sans">
      {/* Section Header */}
      <div className="flex items-center gap-2.5">
        <span
          className="w-1.5 h-6 rounded-full inline-block"
          style={{ backgroundColor: "#FFD700" }}
        />
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
          Coming Soon
        </h2>
      </div>

      {/* 3 Landscape Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {upcomingToDisplay.map((item, index) => (
          <ComingSoonCard key={item.id || index} item={item} />
        ))}
      </div>
    </section>
  );
}
