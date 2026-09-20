import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  Maximize2,
  Share2,
  Clock,
  Flame,
} from "lucide-react";
import { useGetUpcomingMoviesQuery } from "../../services/api/movieApi";
import ScrollReveal from "../common/ScrollReveal";

export default function ComingSoonSection() {
  const { data: upcomingData, isLoading } = useGetUpcomingMoviesQuery(1);

  const movies = (
    Array.isArray(upcomingData) ? upcomingData : upcomingData?.results || []
  )
    .filter((m) => Boolean(m.poster_path || m.backdrop_path))
    .slice(0, 10);

  const len = movies.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // IntersectionObserver: automatically start auto-switch whenever scrolled into view
  useEffect(() => {
    if (isLoading || !len) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoading, len]);

  const next = useCallback(() => {
    if (!len) return;
    setActiveIndex((prev) => (prev + 1) % len);
  }, [len]);

  const prev = useCallback(() => {
    if (!len) return;
    setActiveIndex((prev) => (prev - 1 + len) % len);
  }, [len]);

  // Autoplay every 3 seconds smoothly forever when in view
  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => {
    if (!len || !isInView) return;
    const timer = setInterval(() => {
      nextRef.current?.();
    }, 3000);
    return () => clearInterval(timer);
  }, [len, isInView]);

  if (isLoading || !len) {
    return (
      <section className="space-y-6 font-sans py-4">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-6 rounded-full inline-block bg-[#FFD700]" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            Coming Soon
          </h2>
        </div>
        <div className="h-[480px] w-full rounded-3xl bg-neutral-100 dark:bg-white/5 animate-pulse flex items-center justify-center text-neutral-400">
          Loading Upcoming Blockbusters...
        </div>
      </section>
    );
  }

  const activeMovie = movies[activeIndex];

  // Dynamic card sizing for responsive curved carousel
  const cardWidth = Math.min(340, Math.round(containerWidth * 0.7));
  const cardHeight = Math.round(cardWidth * 1.48);
  const spacing = Math.round(cardWidth * 0.58);

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return "Coming Soon";
    const parsed = new Date(dateStr);
    return !isNaN(parsed.getTime())
      ? parsed.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : dateStr;
  };

  return (
    <section
      className="space-y-8 font-sans select-none relative"
      ref={containerRef}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-1.5 h-6 rounded-full inline-block bg-[#FFD700]" />
            <p className="text-xs font-black uppercase tracking-widest text-[#EAB308]">
              Future Premieres
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            Upcoming Movies
          </h2>
        </div>

        {/* Counter Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 text-xs font-bold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
          <span>
            {activeIndex + 1} of {len} Upcoming
          </span>
        </div>
      </div>

      {/* 3D Curved Apple Vision Glassmorphic Stage */}
      <div
        className="relative w-full py-8 overflow-hidden rounded-[36px] bg-gradient-to-b from-neutral-100/70 via-neutral-100/30 to-neutral-200/40 dark:from-[#0B0F15]/90 dark:via-[#0E131C]/60 dark:to-[#080B10] border border-neutral-200/70 dark:border-white/10 shadow-xs dark:shadow-none backdrop-blur-xl flex flex-col items-center justify-center min-h-[580px] sm:min-h-[640px]"
        style={{ perspective: "1400px" }}
      >
        {/* Soft Ambient Spotlight Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[340px] bg-gradient-to-r from-[#B90101]/10 via-[#FFD700]/5 to-[#B90101]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Curved Cards Fan Track */}
        <div className="relative w-full h-[460px] sm:h-[500px] flex items-center justify-center">
          <AnimatePresence initial={false}>
            {movies.map((movie, idx) => {
              // Minimal signed distance for cyclic loop
              let diff = idx - activeIndex;
              if (diff > len / 2) diff -= len;
              if (diff < -len / 2) diff += len;

              const absDiff = Math.abs(diff);
              // Render up to 3 cards for seamless edge fade transitions (no sudden pop)
              if (absDiff > 3) return null;

              const isActive = diff === 0;
              const isEdgeBuffer = absDiff === 3;

              // 3D Spatial Geometry matching reference curved arc
              const rotateY = diff * -20; // Inward curve angle
              const translateX = diff * spacing;
              const translateZ = isEdgeBuffer
                ? -360
                : isActive
                  ? 120
                  : -absDiff * 130;
              const scale = isEdgeBuffer
                ? 0.76
                : isActive
                  ? 1.05
                  : 0.88 - absDiff * 0.05;
              const opacity = isEdgeBuffer
                ? 0
                : isActive
                  ? 1
                  : Math.max(0.35, 0.85 - absDiff * 0.22);
              const zIndex = 50 - absDiff * 10;

              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
                : movie.backdrop_path
                  ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
                  : "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80";

              return (
                <motion.div
                  key={movie.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`absolute rounded-[28px] overflow-hidden cursor-pointer will-change-transform ${
                    isActive
                      ? "ring-2 ring-white/60 dark:ring-white/40 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.14)]"
                      : "ring-1 ring-white/20 dark:ring-white/10 shadow-xs"
                  }`}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                    pointerEvents: isEdgeBuffer ? "none" : "auto",
                  }}
                  animate={{
                    x: translateX,
                    z: translateZ,
                    rotateY,
                    scale,
                    opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 28,
                    mass: 0.6,
                  }}
                >
                  {/* Poster Image */}
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />

                  {/* Glassmorphic Cinema Frosted Bottom Shading */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />

                  {/* Card Corner Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-20">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/15">
                      {formatReleaseDate(movie.release_date)}
                    </span>

                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#B90101] text-white shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Next Up
                      </span>
                    )}
                  </div>

                  {/* Card Content Bar (Clean: Title & Release Date) */}
                  <div className="absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col justify-end text-white">
                    <h3 className="text-lg sm:text-xl font-black tracking-tight line-clamp-1 drop-shadow-md">
                      {movie.title}
                    </h3>

                    <div className="mt-1 flex items-center">
                      <span
                        className={`text-[11px] flex items-center gap-1 ${
                          isActive
                            ? "font-bold text-[#FFD700]"
                            : "text-neutral-400"
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {formatReleaseDate(movie.release_date)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Floating Vision Pill Controller (Bottom Center) */}
        <div className="relative z-30 mt-4 sm:mt-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/60 dark:bg-black/80 backdrop-blur-xl border border-white/20 shadow-sm text-white">
            {/* Prev Button */}
            <button
              onClick={prev}
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/25 active:scale-90 transition text-white cursor-pointer"
              aria-label="Previous movie"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Thumbnail Circle of Active Movie */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 shrink-0 bg-neutral-800 relative">
              <img
                key={activeMovie?.id}
                src={
                  activeMovie?.poster_path
                    ? `https://image.tmdb.org/t/p/w185${activeMovie.poster_path}`
                    : "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80"
                }
                alt={activeMovie?.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Active Movie Mini Text */}
            <div className="text-left max-w-[140px] sm:max-w-[200px]">
              <p
                key={`title-${activeMovie?.id}`}
                className="text-xs font-black truncate leading-tight transition-all duration-300"
              >
                {activeMovie?.title}
              </p>
              <p
                key={`date-${activeMovie?.id}`}
                className="text-[10px] text-neutral-400 font-medium truncate"
              >
                {formatReleaseDate(activeMovie?.release_date)}
              </p>
            </div>

            {/* Next Button */}
            <button
              onClick={next}
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/25 active:scale-90 transition text-white cursor-pointer"
              aria-label="Next movie"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Pagination Bar & Dots (High Contrast & Clear in Light & Dark Mode) */}
        {/* <div className="flex items-center justify-center mt-3.5 z-30">
          <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/10 dark:bg-black/50 backdrop-blur-md border border-neutral-300/60 dark:border-white/10 shadow-xs">
            {movies.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === activeIndex
                    ? "w-8 h-2.5 bg-[#B90101] shadow-sm shadow-[#B90101]/40"
                    : "w-2 h-2 bg-neutral-400 dark:bg-neutral-500 hover:bg-neutral-600 dark:hover:bg-neutral-300"
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
