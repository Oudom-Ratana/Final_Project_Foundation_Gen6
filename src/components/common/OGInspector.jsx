import { useState, useEffect } from "react";
import {
  Share2,
  X,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Eye,
} from "lucide-react";

export default function OGInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState("telegram");

  const [meta, setMeta] = useState({
    title: "",
    description: "",
    image: "",
    url: "",
  });

  useEffect(() => {
    const updateMeta = () => {
      setMeta({
        title:
          document.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
          document.title ||
          "FilmZone - Cinema & Free Stream",
        description:
          document.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
          document.querySelector('meta[name="description"]')?.getAttribute("content") ||
          "Discover trending movies and TV series, and stream for free on FilmZone.",
        image:
          document.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
          "https://filmzone-foundation-gen6.vercel.app/og-image.jpg",
        url:
          document.querySelector('meta[property="og:url"]')?.getAttribute("content") ||
          window.location.href,
      });
    };

    updateMeta();
    const interval = setInterval(updateMeta, 1500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-40 p-2.5 sm:p-3 rounded-full bg-[#B90101] text-white shadow-xl hover:bg-[#9E0000] transition active:scale-95 cursor-pointer flex items-center gap-2 group border border-white/20 select-none text-xs font-black tracking-wide"
        title="Live Open Graph & Social Preview Inspector"
      >
        <Eye className="w-4 h-4 stroke-[2.5]" />
        <span className="hidden sm:inline">OG Preview</span>
      </button>

      {/* Inspector Modal / Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn select-none font-sans"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-[#151921] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#B90101]/10 text-[#B90101]">
                  <Share2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Open Graph Live Preview</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    Inspect how this page looks when shared on social media
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-white/10 hover:bg-[#B90101] hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Tabs */}
            <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-neutral-100 dark:border-white/5 overflow-x-auto shrink-0 bg-neutral-50/50 dark:bg-black/20">
              {[
                { id: "telegram", label: "Telegram" },
                { id: "twitter", label: "Twitter / X" },
                { id: "facebook", label: "Facebook" },
                { id: "discord", label: "Discord" },
                { id: "raw", label: "HTML Meta" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePlatform(p.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    activePlatform === p.id
                      ? "bg-[#B90101] text-white shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Content / Preview Area */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {activePlatform === "telegram" && (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Telegram Message Bubble Preview
                  </span>

                  <div className="max-w-md mx-auto rounded-2xl bg-[#2b5278]/15 dark:bg-[#182533] border border-[#2b5278]/30 dark:border-white/10 p-3 shadow-md space-y-2">
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold break-all">
                      {meta.url}
                    </p>

                    <div className="border-l-2 border-[#2b5278] pl-2.5 space-y-1.5">
                      <span className="text-[11px] font-extrabold text-[#2b5278] dark:text-[#5288c1] block">
                        FilmZone
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold leading-snug line-clamp-2">
                        {meta.title}
                      </h4>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
                        {meta.description}
                      </p>
                      <div className="rounded-xl overflow-hidden aspect-video bg-neutral-900 mt-2 border border-white/10">
                        <img
                          src={meta.image}
                          alt="Telegram Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://filmzone-foundation-gen6.vercel.app/og-image.jpg";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePlatform === "twitter" && (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Twitter / X Card Preview (Large Image)
                  </span>

                  <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-sm bg-black text-white">
                    <div className="aspect-video bg-neutral-900 relative">
                      <img
                        src={meta.image}
                        alt="Twitter Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 space-y-1">
                      <span className="text-[11px] font-medium text-neutral-400">
                        filmzone-foundation-gen6.vercel.app
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold line-clamp-1">{meta.title}</h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePlatform === "facebook" && (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Facebook & LinkedIn Link Preview
                  </span>

                  <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-sm bg-neutral-50 dark:bg-[#1a1f26]">
                    <div className="aspect-video bg-neutral-900">
                      <img
                        src={meta.image}
                        alt="Facebook Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                        FILMZONE-FOUNDATION-GEN6.VERCEL.APP
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold line-clamp-1">{meta.title}</h4>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePlatform === "discord" && (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Discord Embed Preview
                  </span>

                  <div className="max-w-md mx-auto rounded-lg bg-[#2b2d31] p-3 text-white border-l-4 border-[#B90101] shadow-sm space-y-2">
                    <span className="text-[10px] font-medium text-neutral-400 block">FilmZone</span>
                    <h4 className="text-xs sm:text-sm font-bold text-[#00a8fc] line-clamp-1">
                      {meta.title}
                    </h4>
                    <p className="text-[11px] text-neutral-300 line-clamp-3 leading-relaxed">
                      {meta.description}
                    </p>
                    <div className="rounded-md overflow-hidden aspect-video bg-neutral-900 border border-white/5">
                      <img
                        src={meta.image}
                        alt="Discord Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activePlatform === "raw" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Generated Meta Tags
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(`<!-- Open Graph -->
<meta property="og:title" content="${meta.title}" />
<meta property="og:description" content="${meta.description}" />
<meta property="og:image" content="${meta.image}" />
<meta property="og:url" content="${meta.url}" />
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${meta.title}" />
<meta name="twitter:description" content="${meta.description}" />
<meta name="twitter:image" content="${meta.image}" />`)
                      }
                      className="text-xs text-[#B90101] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied!" : "Copy Tags"}</span>
                    </button>
                  </div>

                  <pre className="p-3.5 rounded-2xl bg-neutral-900 text-neutral-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-white/10">
{`<!-- Primary Open Graph -->
<meta property="og:title" content="${meta.title}" />
<meta property="og:description" content="${meta.description}" />
<meta property="og:image" content="${meta.image}" />
<meta property="og:url" content="${meta.url}" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${meta.title}" />
<meta name="twitter:description" content="${meta.description}" />
<meta name="twitter:image" content="${meta.image}" />`}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer with Quick Test Link */}
            <div className="p-4 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate max-w-xs">
                Active URL: <span className="font-mono text-neutral-800 dark:text-neutral-200">{meta.url}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(`${meta.url}${meta.url.includes("?") ? "&" : "?"}v=${Date.now()}`)}
                  className="py-1.5 px-3 rounded-full text-xs font-bold bg-[#B90101]/10 text-[#B90101] hover:bg-[#B90101]/20 transition cursor-pointer flex items-center gap-1.5"
                  title="Copy URL with cache-busting timestamp to test fresh in Telegram or Facebook"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Cache-Busted URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
