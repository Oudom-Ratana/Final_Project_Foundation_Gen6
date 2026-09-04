import { Calendar } from "lucide-react";

export default function ComingSoonCard({ item }) {
  if (!item) return null;

  const title = item.title || item.name || "Coming Soon";
  const releaseDate = item.release_date || "2025";
  const bannerUrl =
    item.banner ||
    (item.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
      : "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80");

  return (
    <div className="group cursor-pointer space-y-3 bg-white dark:bg-black/40 p-4 rounded-3xl border border-neutral-200/80 dark:border-white/10 hover:border-[#B90101]/60 transition-all shadow-md dark:shadow-xl font-sans">
      {/* 16:9 Landscape Banner */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-neutral-200/50 dark:border-white/10 shadow-sm group-hover:shadow-lg transition-all">
        <img
          src={bannerUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-80"
          loading="lazy"
        />

        {/* Logo Text Center Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <span className="font-black text-white text-base sm:text-lg text-center uppercase tracking-wider drop-shadow-lg whitespace-pre-line leading-snug">
            {item.logoText || title}
          </span>
        </div>
      </div>

      {/* Title & Release Date */}
      <div className="space-y-1 px-1">
        <h4
          className="font-extrabold text-[17px] leading-snug group-hover:brightness-125 transition line-clamp-1"
          style={{ color: "#B90101" }}
        >
          {title}
        </h4>
        <div className="flex items-center gap-1.5 text-[14px] text-neutral-600 dark:text-neutral-400 font-semibold">
          <Calendar className="w-4 h-4" style={{ color: "#FFD700" }} />
          <span>{releaseDate}</span>
        </div>
      </div>
    </div>
  );
}
