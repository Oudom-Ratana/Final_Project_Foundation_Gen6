import { useGetUpcomingMoviesQuery } from "../../services/api/movieApi";
import ComingSoonCard from "./ComingSoonCard";
import ComingSoonCardSkeleton from "./ComingSoonCardSkeleton";
import ScrollReveal from "../common/ScrollReveal";

export default function ComingSoonSection() {
  const { data: tmdbUpcoming, isLoading } = useGetUpcomingMoviesQuery(2);

  const upcomingToDisplay =
    tmdbUpcoming && tmdbUpcoming.length > 0 ? tmdbUpcoming.slice(0, 3) : [];

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

      {/* 3 Landscape Banners Grid (3 Cards or 3 Skeletons) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading || upcomingToDisplay.length === 0
          ? Array.from({ length: 3 }).map((_, index) => (
              <ComingSoonCardSkeleton key={`skeleton-coming-${index}`} />
            ))
          : upcomingToDisplay.map((item, index) => (
              <ScrollReveal
                key={item.id || index}
                delay={index * 120}
                duration={750}
                distance="translate-y-12"
              >
                <ComingSoonCard item={item} />
              </ScrollReveal>
            ))}
      </div>
    </section>
  );
}
