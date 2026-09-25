import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { selectTheme } from "../../redux/slices/uiSlice";
import { useGetAllConcessionsQuery } from "../../services/api/cinemaApi";
import ScrollReveal from "../common/ScrollReveal";

export default function ConcessionHero() {
  const theme = useSelector(selectTheme);
  const isDark = theme === "dark";
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: apiData, isLoading } = useGetAllConcessionsQuery();

  // ONLY real items from the backend API
  const slides = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];

    return apiData.map((item) => ({
      id: item.uuid,
      badge: item.category || "FOOD",
      title: (item.name || "").toUpperCase(),
      description:
        item.description || "Cinema snack available at FilmZone.",
      image: item.imageUrl,
      offerTag: `$${Number(item.price || 0).toFixed(2)}`,
    }));
  }, [apiData]);

  const totalSlides = slides.length;

  // Auto slide strictly every 4 seconds (4000ms)
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const handlePrev = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  if (isLoading) {
    return (
      <div className="w-full h-72 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B90101] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (totalSlides === 0) {
    return null;
  }

  const activePromo = slides[currentIndex] || slides[0] || {};
  const { badge = "DEAL", title = "", description = "" } = activePromo;
  const titleLines = (title || "").split(" ");

  const badgeClass =
    badge === "DRINK"
      ? "bg-blue-600 border-blue-400 text-white"
      : badge === "COMBO"
        ? "bg-[#B90101] border-[#FFD700] text-white"
        : "bg-[#FFD700] border-[#B90101] text-[#B90101]";

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* Left: copy (synchronized with active promo slide) */}
        <ScrollReveal delay={100} duration={700} distance="translate-y-8">
          <div
            key={`copy-${activePromo.id || currentIndex}`}
            className="transition-all duration-500"
          >
            <span
              className={`inline-block italic font-bold text-xs uppercase tracking-wide px-4 py-1.5 rounded-full border-2 ${badgeClass}`}
            >
              {badge}
            </span>

            <h1
              className={`mt-5 font-black italic leading-[0.95] tracking-tight text-5xl sm:text-6xl ${
                isDark ? "text-[#FFD700]" : "text-[#B90101]"
              }`}
            >
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div
              className={`mt-6 max-w-md rounded-2xl border-l-4 px-4 py-3.5 ${
                isDark
                  ? "bg-white/5 border-[#B90101] text-[#FFD700]"
                  : "bg-neutral-200/70 border-[#B90101] text-neutral-700"
              }`}
            >
              <p className="text-[15px] leading-relaxed">{description}</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Right: promo banner carousel */}
        <ScrollReveal delay={250} duration={750} distance="translate-y-10">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border border-neutral-200/60 dark:border-white/10 group select-none">
            {/* Background Slides with Cross-Fade */}
            <div className="absolute inset-0 bg-black">
              {slides.map((slide, index) => {
                const isActive = index === currentIndex;
                return (
                  <div
                    key={slide.id || index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      isActive
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-105 pointer-events-none z-0"
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Bottom Tag / Title overlay on image */}
                    {slide.offerTag && (
                      <div className="absolute bottom-5 left-5 z-20">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#B90101] text-white font-black italic text-xs tracking-wider uppercase shadow-md">
                          {slide.offerTag}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Left Chevron Button */}
            {totalSlides > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:border-[#B90101] hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer"
                style={{ backgroundColor: "rgba(26, 31, 37, 0.50)" }}
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Right Chevron Button */}
            {totalSlides > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:border-[#B90101] hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer"
                style={{ backgroundColor: "rgba(26, 31, 37, 0.50)" }}
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Bottom-right slide pagination dots */}
            {totalSlides > 1 && (
              <div className="absolute bottom-5 right-5 z-30 flex items-center gap-1.5">
                {slides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx)}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      dotIdx === currentIndex
                        ? "w-6 bg-[#B90101] shadow-[0_0_8px_#B90101]"
                        : "w-2 bg-white/40 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
