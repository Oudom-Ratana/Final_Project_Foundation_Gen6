import { useState } from "react";
import { Link } from "react-router";
import {
  Play,
  Film,
  Clock,
  Calendar,
  Sparkles,
  Volume2,
  ExternalLink,
} from "lucide-react";
import ScrollReveal from "../common/ScrollReveal";

const TRAILERS = [
  {
    id: "d9MyW72ELq0",
    title: "Avatar: The Way of Water",
    subtitle: "Return to Pandora in IMAX 3D",
    genre: "Sci-Fi / Adventure",
    duration: "2 min 28s",
    release: "Now Showing",
    rating: "PG-13",
    description:
      "Set more than a decade after the events of the first film, experience the breathtaking underwater world of Pandora with cutting-edge 3D laser projection.",
  },
  {
    id: "cqGjhVJWtEg",
    title: "Spider-Man: Across the Spider-Verse",
    subtitle: "Miles Morales in the Multiverse",
    genre: "Animation / Action",
    duration: "2 min 39s",
    release: "Popular",
    rating: "PG",
    description:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
  },
  {
    id: "73_1biulkYk",
    title: "Deadpool & Wolverine",
    subtitle: "Marvel Studios Summer Hit",
    genre: "Action / Comedy",
    duration: "2 min 38s",
    release: "Blockbuster",
    rating: "R-18",
    description:
      "Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy.",
  },
  {
    id: "Way9Dexny3w",
    title: "Dune: Part Two",
    subtitle: "The Epic Journey Continues",
    genre: "Sci-Fi / Drama",
    duration: "3 min 02s",
    release: "Award Winner",
    rating: "PG-13",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family in Dolby Atmos sound.",
  },
];

export default function TrailerSpotlightSection() {
  const [selectedTrailer, setSelectedTrailer] = useState(TRAILERS[0]);

  return (
    <section className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-1.5 h-6 rounded-full inline-block bg-[#B90101]" />
            <p className="text-xs font-black uppercase tracking-widest text-[#B90101]">
              High Definition Teasers
            </p>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
            Official Trailer Spotlight
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-xl">
            Watch high-definition blockbusters trailers, teaser trailers, and
            behind-the-scenes clips before picking your seats.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <Volume2 className="w-4 h-4 text-[#B90101]" />
          <span>Best experienced with headphones or surround sound</span>
        </div>
      </div>

      {/* Main Video Theater & Playlist Container */}
      <ScrollReveal duration={700} distance="translate-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left / Main Player (8 columns on lg) */}
          <div className="lg:col-span-8 flex flex-col rounded-3xl overflow-hidden bg-white dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] border border-neutral-200/90 shadow-xs dark:shadow-none transition-all duration-300">
            {/* 16:9 Video Frame */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                key={selectedTrailer.id}
                src={`https://www.youtube-nocookie.com/embed/${selectedTrailer.id}?autoplay=0&rel=0`}
                title={selectedTrailer.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Info Bar */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#B90101] text-white">
                      {selectedTrailer.release}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-neutral-100 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)]text-neutral-800 dark:text-neutral-200 border border-neutral-200 ">
                      {selectedTrailer.rating}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      {selectedTrailer.genre}
                    </span>
                  </div>

                  <Link
                    to="/movies"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#B90101] hover:bg-[#8F0101] text-white text-xs font-black uppercase tracking-wider transition shadow-xs hover:shadow-sm hover:scale-105 active:scale-95"
                  >
                    <Film className="w-4 h-4" />
                    <span>Book Tickets</span>
                  </Link>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                  {selectedTrailer.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#B90101] dark:text-[#FFD700] mt-0.5">
                  {selectedTrailer.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
                  {selectedTrailer.description}
                </p>
              </div>

              {/* Bottom Specs Bar */}
              <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] flex items-center gap-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B90101]" />
                  {selectedTrailer.duration}
                </span>
                <span>•</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-bold">
                  4K Ultra HD
                </span>
                <span>•</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-bold">
                  Dolby Atmos
                </span>
              </div>
            </div>
          </div>

          {/* Right / Playlist Sidebar (4 columns on lg) */}
          <div className="lg:col-span-4 rounded-3xl p-5 sm:p-6 bg-white dark:border-(--border-dark-mode) dark:bg-[var(--primary-color-30)] border border-neutral-200/90 shadow-xs dark:shadow-none flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-(--border-dark-mode)">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#B90101]/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#B90101]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                      Featured Trailers
                    </h4>
                    <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                      Select to play preview
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 dark:bg-[var(--primary-color-30)] text-neutral-600 dark:text-neutral-300">
                  {TRAILERS.length} Clips
                </span>
              </div>

              {/* Playlist Cards */}
              <div className="space-y-3">
                {TRAILERS.map((trailer) => {
                  const isActive = trailer.id === selectedTrailer.id;
                  const thumbUrl = `https://img.youtube.com/vi/${trailer.id}/mqdefault.jpg`;

                  return (
                    <button
                      key={trailer.id}
                      onClick={() => setSelectedTrailer(trailer)}
                      type="button"
                      className={`w-full text-left p-3 rounded-2xl transition-all duration-300 flex items-center gap-3.5 group cursor-pointer relative overflow-hidden border ${
                        isActive
                          ? "bg-neutral-100 dark:bg-white/[0.08] border-[#B90101] shadow-xs"
                          : "bg-neutral-50 dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-white/[0.06] border-neutral-200/70 dark:border-white/5 shadow-none"
                      }`}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B90101]" />
                      )}

                      {/* Thumbnail with overlay */}
                      <div className="relative w-24 h-15 rounded-xl overflow-hidden shrink-0 bg-black">
                        <img
                          src={thumbUrl}
                          alt={trailer.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${
                            isActive
                              ? "bg-[#B90101]/40"
                              : "bg-black/40 group-hover:bg-black/20"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                              isActive
                                ? "bg-white text-[#B90101] shadow-xs"
                                : "bg-white/90 text-neutral-900"
                            }`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Metadata with high-contrast text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#B90101] dark:text-[#FFD700]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B90101] animate-ping" />
                              Playing
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs font-bold line-clamp-1 transition-colors duration-200 ${
                            isActive
                              ? "text-neutral-950 dark:text-white font-black"
                              : "text-neutral-800 dark:text-neutral-200 group-hover:text-[#B90101]"
                          }`}
                        >
                          {trailer.title}
                        </p>

                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                          {trailer.genre}
                        </p>

                        <div className="flex items-center gap-2 mt-1 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-neutral-400" />
                            {trailer.duration}
                          </span>
                          <span>•</span>
                          <span className="text-neutral-600 dark:text-neutral-300">
                            {trailer.release}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Audio Tip footer */}
            <div className="mt-5 pt-3 border-t border-neutral-100 dark:bg-[var(--primary-color-30)] flex items-center gap-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              <Volume2 className="w-3.5 h-3.5 text-[#B90101] shrink-0" />
              <span>Full audio surround supported</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
