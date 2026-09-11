import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
} from "lucide-react";
import { useGetTrendingMoviesQuery } from "../../services/api/movieApi";

export default function StreamHero({ onSearch }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch trending movies for featured streaming banner
  const { data: trendingMovies, isLoading } = useGetTrendingMoviesQuery("day");

  const bannerSlides =
    trendingMovies && trendingMovies.length > 0
      ? trendingMovies.slice(0, 5)
      : [];

  const totalSlides = bannerSlides.length;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);
    return () => clearInterval(timer);
  }, [totalSlides, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm.trim());
    } else if (searchTerm.trim()) {
      navigate(`/stream?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (isLoading || totalSlides === 0) {
    return (
      <div className="w-full space-y-6">
        <div className="relative w-full aspect-[21/9] sm:min-h-[360px] md:min-h-[420px] rounded-3xl bg-neutral-900/80 animate-pulse border border-neutral-200/50 dark:border-white/10" />
      </div>
    );
  }

  const activeMovie = bannerSlides[currentIndex];

  return (
    <div className="w-full space-y-6 font-sans">
      {/* 1. Main Featured Banner Container with Rounded Corners */}
      <div className="relative w-full aspect-[21/9] min-h-[320px] sm:min-h-[380px] md:min-h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 dark:border-white/10 select-none flex flex-col justify-between p-6 sm:p-8">
        {/* Background Images with Cross-Fade */}
        <div className="absolute inset-0 z-0 bg-black">
          {bannerSlides.map((slide, index) => {
            const isActive = index === currentIndex;
            const bgUrl = slide.backdrop_path
              ? `https://image.tmdb.org/t/p/original${slide.backdrop_path}`
              : `https://image.tmdb.org/t/p/original${slide.poster_path}`;

            return (
              <div
                key={slide.id || index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  isActive
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-105 pointer-events-none z-0"
                }`}
              >
                <img
                  src={bgUrl}
                  alt={slide.title || slide.name}
                  className="w-full h-full object-cover object-center filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
              </div>
            );
          })}
        </div>

        {/* 2. Top Floating Search Bar */}
        <div className="relative z-20 flex justify-center w-full">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Movies..."
                className="w-full pl-5 pr-12 py-2.5 sm:py-3 rounded-full border backdrop-blur-md text-[15px] text-white placeholder-white/70 focus:outline-none focus:border-[#B90101] transition shadow-inner"
                style={{
                  backgroundColor: "rgba(26, 31, 37, 0.35)",
                  borderColor: "rgba(255, 255, 255, 0.25)",
                }}
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* 3. Left & Right Navigation Chevrons */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:text-white hover:border-[#B90101] hover:scale-110 active:scale-95 transition-all shadow-xl"
          style={{ backgroundColor: "rgba(26, 31, 37, 0.45)" }}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:text-white hover:border-[#B90101] hover:scale-110 active:scale-95 transition-all shadow-xl"
          style={{ backgroundColor: "rgba(26, 31, 37, 0.45)" }}
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 4. Bottom Slide Indicator / Title Preview */}
        <div className="relative z-20 flex items-center justify-between gap-4">
          <Link
            to={`/stream/${activeMovie.id}`}
            className="group/title flex items-center gap-2 max-w-lg truncate"
          >
            <span className="text-lg sm:text-2xl font-black text-white drop-shadow group-hover/title:text-[#B90101] transition-colors truncate">
              {activeMovie.title || activeMovie.name}
            </span>
            <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{activeMovie.vote_average?.toFixed(1)}</span>
            </div>
          </Link>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {bannerSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  dotIdx === currentIndex
                    ? "w-6 bg-[#B90101]"
                    : "w-2 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Centered "Favourite Movies →" Button (Figma Spec) */}
      <div className="flex justify-center">
        <Link
          to="/stream?filter=favourite"
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-white font-bold text-[14px] shadow-lg hover:brightness-110 active:scale-95 transition"
          style={{ backgroundColor: "#B90101" }}
        >
          <span>Favourite Movies</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
