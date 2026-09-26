import { useState, useEffect } from "react";
import { Link } from "react-router";
import { X, ArrowRight, Info, Sparkles, Utensils } from "lucide-react";
import popcornImg from "../../assets/loader/popcorn-bucket1.png";
import ScrollReveal from "../common/ScrollReveal";
import { useGetAllConcessionsQuery } from "../../services/api/cinemaApi";
import { FALLBACK_CONCESSIONS } from "../../data/concessionsData";

// Helper to resolve full image URL from Teacher's API
const resolveImageUrl = (url) => {
  if (!url || typeof url !== "string") return popcornImg;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  return `https://cinema-booking-api.eunglyzhia.com${url.startsWith("/") ? "" : "/"}${url}`;
};

// Category badge styling helper
const getCategoryBadge = (category) => {
  const cat = (category || "").toUpperCase();
  switch (cat) {
    case "COMBO":
      return {
        label: "BESTSELLER COMBO",
        className: "bg-red-500 text-white",
      };
    case "FOOD":
      return {
        label: "SAVORY CRUNCH",
        className: "bg-amber-500 text-white",
      };
    case "DRINK":
      return {
        label: "REFRESHMENT",
        className: "bg-blue-600 text-white",
      };
    default:
      return {
        label: cat || "CONCESSION",
        className: "bg-purple-600 text-white",
      };
  }
};

export default function PopcornBarSection() {
  const { data: apiData, isLoading } = useGetAllConcessionsQuery();
  const [selectedItem, setSelectedItem] = useState(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    if (selectedItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem]);

  // Use Teacher's API data if available, otherwise fallback
  const concessions =
    apiData && apiData.length > 0 ? apiData : FALLBACK_CONCESSIONS;

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
            FilmZone Popcorn & Snack Bar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
            Freshly popped kernels, delicious treats, and ice-cold refreshments
            available at our cinema counters. Click any item for full details.
          </p>
        </div>

        <Link
          to="/deals"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#B90101] dark:text-red-400 hover:bg-red-500/10 transition-colors self-start sm:self-auto"
        >
          View Full Menu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-neutral-100 dark:bg-[#12161C] border border-neutral-200/80 dark:border-white/10 p-5 min-h-[280px] animate-pulse flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <div className="w-20 h-5 bg-neutral-300 dark:bg-white/10 rounded-full" />
                <div className="w-12 h-5 bg-neutral-300 dark:bg-white/10 rounded-md" />
              </div>
              <div className="w-24 h-24 mx-auto bg-neutral-300 dark:bg-white/10 rounded-full my-6" />
              <div className="w-3/4 h-5 bg-neutral-300 dark:bg-white/10 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        /* Concession Cards Grid (No rating, No description on card face) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {concessions.map((item, idx) => {
            const badge = getCategoryBadge(item.category);
            const imageSrc = resolveImageUrl(item.imageUrl);
            const formattedPrice =
              typeof item.price === "number"
                ? `$${item.price.toFixed(2)}`
                : item.price || "$0.00";

            return (
              <ScrollReveal
                key={item.uuid || item.id || idx}
                delay={idx * 80}
                duration={600}
                distance="translate-y-8"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedItem(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedItem(item);
                    }
                  }}
                  className="group relative rounded-3xl bg-white dark:bg-[#12161C] border border-neutral-200/80 dark:border-white/10 hover:border-[#B90101]/60 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[300px] overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B90101]"
                >
                  {/* Visual Background Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                  {/* Top: Badge & Price */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-sm font-black text-[#B90101] dark:text-[#FFD700]">
                        {formattedPrice}
                      </span>
                    </div>

                    {/* Popcorn / Snack Image Center */}
                    <div className="w-full h-32 flex items-center justify-center py-2">
                      <img
                        src={imageSrc}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = popcornImg;
                        }}
                        className="h-28 w-auto max-w-[85%] object-contain drop-shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300"
                      />
                    </div>

                    {/* Title (No rating, No description) */}
                    <div>
                      <h3 className="text-lg font-black text-neutral-900 dark:text-white leading-snug group-hover:text-[#B90101] transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom: Quick Details Affordance */}
                  <div className="relative z-10 pt-4 mt-2 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs text-neutral-400 group-hover:text-[#B90101] font-bold transition-colors">
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      View Details
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {/* Pop-up Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#12161C] border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Area */}
            <div className="relative w-full h-56 bg-gradient-to-b from-amber-500/15 via-red-500/5 to-transparent flex items-center justify-center p-6">
              <img
                src={resolveImageUrl(selectedItem.imageUrl)}
                alt={selectedItem.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = popcornImg;
                }}
                className="max-h-44 w-auto max-w-[80%] object-contain drop-shadow-2xl"
              />
            </div>

            {/* Modal Content Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    getCategoryBadge(selectedItem.category).className
                  }`}
                >
                  {getCategoryBadge(selectedItem.category).label}
                </span>

                <span className="text-2xl font-black text-[#B90101] dark:text-[#FFD700]">
                  {typeof selectedItem.price === "number"
                    ? `$${selectedItem.price.toFixed(2)}`
                    : selectedItem.price || "$0.00"}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-neutral-900 dark:text-white leading-tight">
                  {selectedItem.name}
                </h3>
              </div>

              {/* Full Description inside the Pop-up Modal */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/5">
                <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">
                  Item Description
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {selectedItem.description ||
                    "Freshly prepared cinema concession item crafted for the best movie-watching experience."}
                </p>
              </div>

              {/* Additional Cinema Info */}
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Available at all FilmZone cinema counter locations</span>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center gap-3">
                <Link
                  to="/deals"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#B90101] hover:bg-[#900000] text-white font-bold text-center text-sm uppercase tracking-wide transition-colors shadow-lg shadow-red-900/20"
                >
                  Explore Cinema Deals
                </Link>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="py-3 px-5 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300 font-bold text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
