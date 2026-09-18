import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Ticket, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetTrendingMoviesQuery } from "../../services/api/movieApi";
import SpidermanLoader from "../common/SpidermanLoader";
import HeroMiniSlider from "./HeroMiniSlider";

export default function HomeHero() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch trending movies directly from TMDB API
  const { data: tmdbMovies, isLoading } = useGetTrendingMoviesQuery("day");

  // Build slides strictly from live TMDB data
  const slides =
    tmdbMovies && tmdbMovies.length > 0
      ? tmdbMovies
          .filter((m) => m.backdrop_path || m.poster_path)
          .slice(0, 7)
          .map((m, idx) => {
            const words = (m.title || m.name || "").split(" ");
            const mid = Math.ceil(words.length / 2);
            const line1 = words.slice(0, mid).join(" ") || "TRENDING";
            const line2 = words.slice(mid).join(" ") || "NOW";

            return {
              id: m.id,
              title: m.title || m.name,
              displayTitleLine1: line1.toUpperCase(),
              displayTitleLine2: line2.toUpperCase(),
              brandTitle: (m.title || m.name || "CINEMA").toUpperCase(),
              brandSubtitle: "NOW STREAMING IN CINEMAS",
              studioBadge: idx % 2 === 0 ? "MARVEL STUDIOS" : "BLOCKBUSTER HIT",
              overview:
                m.overview ||
                "Experience the pulse-pounding action and cinematic thrill of the season in ultra-high definition.",
              backdrop_path: m.backdrop_path
                ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
                : `https://image.tmdb.org/t/p/original${m.poster_path}`,
              poster_path: m.poster_path
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                : m.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${m.backdrop_path}`
                  : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80",
              vote_average: m.vote_average ? m.vote_average.toFixed(1) : "8.8",
              genre: "ACTION / CINEMA",
              release_date: m.release_date
                ? m.release_date.substring(0, 4)
                : "2026",
            };
          })
      : [];

  const totalSlides = slides.length;

  // Auto slide strictly every 4.0 seconds (4000ms)
  useEffect(() => {
    if (totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => clearInterval(interval);
  }, [totalSlides, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  // 1. FilmZone Themed Loading State
  if (isLoading || totalSlides === 0) {
    return (
      <section className="relative w-full min-h-[620px] sm:min-h-[700px] lg:min-h-[760px] overflow-hidden bg-neutral-950 font-sans flex flex-col items-center justify-center pt-20 pb-8 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <SpidermanLoader size="lg" text="LOADING..." />
      </section>
    );
  }

  const activeMovie = slides[currentIndex] || slides[0];

  return (
    <section className="relative w-full min-h-[680px] sm:min-h-[720px] lg:min-h-[840px] overflow-hidden select-none font-sans flex flex-col justify-between">
      {/* 1. Full-Width Background Slides Layer with Smooth Cross-Fade */}
      <div className="absolute inset-0 z-0 bg-black">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
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
                src={slide.backdrop_path}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-90"
              />
              {/* Cinematic Vignette Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40 lg:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/80" />
            </div>
          );
        })}
      </div>

      {/* 2. Left & Right Navigation Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:text-white hover:border-[#B90101] hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer"
        style={{ backgroundColor: "rgba(26, 31, 37, 0.40)" }}
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:text-white hover:border-[#B90101] hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer"
        style={{ backgroundColor: "rgba(26, 31, 37, 0.40)" }}
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 3. Middle Content Area (Headline, Overview, Action Buttons + Mini 3D Slider on Right) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-2 sm:px-5">
          {/* Left Side: Dynamic Headline, Description & Action Buttons (7 cols) */}
          <div
            key={`content-${activeMovie.id || currentIndex}`}
            className="lg:col-span-7 space-y-4 max-w-2xl transition-all duration-700"
          >
            {/* Split Colored Dynamic Headline */}
            <div className="overflow-hidden">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none drop-shadow-md truncate">
                {activeMovie.displayTitleLine1}
              </h1>
              <h2
                className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none mt-1 sm:mt-2 drop-shadow-md truncate"
                style={{ color: "#B90101" }}
              >
                {activeMovie.displayTitleLine2}
              </h2>
            </div>

            {/* Description */}
            <p className="text-neutral-200 font-sans text-sm sm:text-base lg:text-[18px] leading-relaxed max-w-lg line-clamp-3 drop-shadow">
              {activeMovie.overview}
            </p>

            {/* Buttons: BOOK TICKETS & WATCH TRAILER */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={`/movies/${activeMovie.id}`}
                className="flex items-center justify-center gap-2.5 h-[50px] sm:h-[54px] px-7 sm:px-8 rounded-[30px] text-white font-black text-sm sm:text-[17px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#B90101]/30"
                style={{
                  backgroundColor: "#B90101",
                  borderRadius: "30px",
                }}
              >
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                <span>Book Tickets</span>
              </Link>

              {/* Watch Trailer Button */}
              <Link
                to={`/movies/${activeMovie.id}`}
                className="flex items-center justify-center gap-3 h-[50px] sm:h-[54px] min-w-[180px] sm:min-w-[210px] px-6 sm:px-7 rounded-[30px] border text-white font-bold text-sm sm:text-[17px] uppercase tracking-wider transition hover:bg-white/20 active:scale-95 shadow-md group select-none"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.10)",
                  borderColor: "rgba(255, 255, 255, 0.20)",
                  borderRadius: "30px",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[2px] border-white flex items-center justify-center pl-0.5 group-hover:scale-105 transition">
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                </div>
                <span>Watch Trailer</span>
              </Link>
            </div>
          </div>

          {/* Right Side: Mini 3D Fanned Card Slider (Shifted a bit left & further down) */}
          {/* <div className="lg:col-span-5 flex justify-center lg:justify-end mt-8 lg:mt-0 lg:-translate-x-12 lg:translate-y-16">
            <HeroMiniSlider
              slides={slides}
              currentIndex={currentIndex}
              onSelectIndex={setCurrentIndex}
            />
          </div> */}
        </div>
      </div>

      {/* 4. Bottom Slide Pagination Dots */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 flex items-center justify-center gap-2 sm:gap-2.5">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            onClick={() => setCurrentIndex(dotIndex)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              dotIndex === currentIndex
                ? "w-7 sm:w-8 h-2.5 sm:h-3 bg-[#B90101] shadow-[0_0_12px_rgba(185,1,1,0.8)]"
                : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${dotIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
