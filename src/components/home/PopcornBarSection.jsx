import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import popcornImg from "../../assets/loader/popcorn-bucket1.png";
import ScrollReveal from "../common/ScrollReveal";
import { useGetAllConcessionsQuery } from "../../services/api/cinemaApi";

const CATEGORY_COLORS = {
  FOOD: "bg-amber-500 text-white",
  DRINK: "bg-blue-600 text-white",
  SNACK: "bg-red-500 text-white",
  COMBO: "bg-purple-600 text-white",
};

export default function PopcornBarSection() {
  const { data: concessions = [], isLoading } = useGetAllConcessionsQuery();

  // Take the first 4 items from the teacher's API
  const items = concessions.slice(0, 4);

  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-1.5 h-6 rounded-full inline-block bg-[#FFD700]" />
            <p className="text-xs font-black uppercase tracking-widest text-[#EAB308]">
              Fresh Cinema Concessions
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            FilmZone Drinks & Snack Bar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
            Freshly popped kernels, melted cheeses, and ice-cold refreshments
            delivered right to your cinema seat.
          </p>
        </div>

        <Link
          to="/deals"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#B90101] dark:text-[#FFD700] hover:underline"
        >
          <span>View All Snacks & Drinks</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid: items-stretch ensures all cards in a row have identical height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-neutral-100 dark:bg-[#12161C] border border-neutral-200/80 dark:border-white/10 p-4 sm:p-5 animate-pulse flex flex-col justify-between h-full space-y-3"
            >
              <div className="w-full aspect-[16/10] bg-neutral-200 dark:bg-white/10 rounded-2xl" />
              <div className="space-y-2 flex-1 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-2/3 bg-neutral-200 dark:bg-white/10 rounded" />
                  <div className="h-5 w-14 bg-neutral-200 dark:bg-white/10 rounded" />
                </div>
                <div className="h-8 w-full bg-neutral-200 dark:bg-white/10 rounded" />
              </div>
            </div>
          ))
        ) : items.length > 0 ? (
          items.map((item, idx) => {
            const tagColor =
              CATEGORY_COLORS[item.category?.toUpperCase()] ||
              "bg-red-500 text-white";

            return (
              <ScrollReveal
                key={item.uuid || idx}
                delay={idx * 100}
                duration={650}
                distance="translate-y-8"
                className="h-full"
              >
                <Link
                  to={`/deals/${item.uuid}`}
                  className="group relative rounded-3xl bg-white dark:bg-[#12161C] border border-neutral-200/80 dark:border-white/10 hover:border-[#B90101]/60 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between overflow-hidden block hover:-translate-y-1"
                >
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                  {/* Top: Image Container with Floating Badge */}
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800/60 shadow-inner mb-3 shrink-0">
                    <img
                      src={item.imageUrl || popcornImg}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = popcornImg;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-100"
                      loading="lazy"
                    />

                    {/* Category Pill Tag floating in top-left */}
                    {item.category && (
                      <span
                        className={`absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${tagColor}`}
                      >
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Bottom: Title, Price & Uniform Description Box */}
                  <div className="flex-1 flex flex-col justify-between space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white leading-tight capitalize group-hover:text-[#B90101] dark:group-hover:text-[#FFD700] transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      {item.price !== undefined && (
                        <span className="text-base sm:text-lg font-black text-[#B90101] dark:text-[#FFD700] shrink-0">
                          ${typeof item.price === "number" ? item.price.toFixed(2) : Number(item.price || 0).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {/* Uniform 2-line height box (min-h-[34px]) so 1-line vs 2-line descriptions have the exact same height */}
                    <div className="min-h-[34px] flex items-start">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {item.description || "\u00A0"}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })
        ) : null}
      </div>
    </section>
  );
}