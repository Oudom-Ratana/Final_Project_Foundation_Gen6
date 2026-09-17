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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Main Player (8 columns on lg) */}
          <div className="lg:col-span-8 bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
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
            <div className="p-5 sm:p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#B90101] text-white">
                      {selectedTrailer.release}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-800 text-neutral-300">
                      {selectedTrailer.rating}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {selectedTrailer.genre}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {selectedTrailer.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#FFD700] font-semibold">
                    {selectedTrailer.subtitle}
                  </p>
                </div>

                <Link
                  to="/movies"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B90101] hover:bg-[#8F0101] text-white text-xs font-black uppercase tracking-wider transition shadow-md shadow-[#B90101]/25 hover:scale-105 active:scale-95"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Book Tickets Now</span>
                </Link>
              </div>

              <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                {selectedTrailer.description}
              </p>
            </div>
          </div>

          {/* Right / Playlist Sidebar (4 columns on lg) */}
          <div className="lg:col-span-4 bg-neutral-900/60 dark:bg-neutral-900/80 backdrop-blur-md rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B90101]" />
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 dark:text-white">
                  Trending Playlist
                </h4>
              </div>
              <span className="text-[11px] font-bold text-neutral-500">
                {TRAILERS.length} Videos
              </span>
            </div>

            {/* Playlist Cards */}
            <div className="space-y-2.5">
              {TRAILERS.map((trailer) => {
                const isActive = trailer.id === selectedTrailer.id;
                const thumbUrl = `https://img.youtube.com/vi/${trailer.id}/mqdefault.jpg`;

                return (
                  <button
                    key={trailer.id}
                    onClick={() => setSelectedTrailer(trailer)}
                    type="button"
                    className={`w-full text-left p-2.5 rounded-2xl transition-all duration-200 flex items-center gap-3 group cursor-pointer ${
                      isActive
                        ? "bg-[#B90101]/10 border-2 border-[#B90101] shadow-md shadow-[#B90101]/15"
                        : "bg-neutral-100 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-transparent"
                    }`}
                  >
                    {/* Thumbnail with overlay */}
                    <div className="relative w-24 h-15 rounded-xl overflow-hidden shrink-0 bg-neutral-950">
                      <img
                        src={thumbUrl}
                        alt={trailer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition ${
                          isActive
                            ? "bg-[#B90101]/40"
                            : "bg-black/40 group-hover:bg-black/20"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isActive
                              ? "bg-white text-[#B90101]"
                              : "bg-white/90 text-neutral-900"
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold line-clamp-1 ${
                          isActive
                            ? "text-[#B90101] dark:text-[#FFD700]"
                            : "text-neutral-800 dark:text-neutral-200 group-hover:text-[#B90101]"
                        }`}
                      >
                        {trailer.title}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                        {trailer.genre}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {trailer.duration}
                        </span>
                        <span>•</span>
                        <span>{trailer.release}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
