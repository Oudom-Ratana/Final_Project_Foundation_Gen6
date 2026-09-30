import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Play,
  Film,
  Clapperboard,
  AlertCircle,
  RotateCcw,
  Server,
} from "lucide-react";
import filmZoneLogo from "../../assets/logo/FilmZoneLogo.png";

const STREAM_SERVERS = [
  {
    id: "vidlink",
    name: "Server 1",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://vidlink.pro/tv/${id}/${s}/${ep}?primaryColor=b90101`
        : `https://vidlink.pro/movie/${id}?primaryColor=b90101`,
  },
  {
    id: "vidsrc_to",
    name: "Server 2",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://vidsrc.to/embed/tv/${id}/${s}/${ep}`
        : `https://vidsrc.to/embed/movie/${id}`,
  },
  {
    id: "vidsrc_me",
    name: "Server 3",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${ep}`
        : `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    id: "multiembed",
    name: "Server 4",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${ep}`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
  {
    id: "smashystream",
    name: "Server 5",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${s}&episode=${ep}`
        : `https://embed.smashystream.com/playere.php?tmdb=${id}`,
  },
  {
    id: "autoembed",
    name: "Server 6",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://autoembed.co/tv/tmdb/${id}-${s}-${ep}`
        : `https://autoembed.co/movie/tmdb/${id}`,
  },
  {
    id: "twoembed",
    name: "Server 7",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${ep}`
        : `https://www.2embed.cc/embed/${id}`,
  },
];

export default function StreamPlayerModal({
  isOpen,
  onClose,
  tmdbId,
  mediaType = "movie", 
  title = "Movie Player",
  trailerKey,
  initialMode = "full_movie", 
  season = 1,
  episode = 1,
  totalEpisodes = 8,
  onEpisodeChange,
}) {
  const [activeMode, setActiveMode] = useState(initialMode);
  const [currentSeason, setCurrentSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);

  const [serverIndex, setServerIndex] = useState(0);
  const [isLoadingStream, setIsLoadingStream] = useState(true);
  const [hasAllServersFailed, setHasAllServersFailed] = useState(false);
  const failoverTimeoutRef = useRef(null);

  const isTV = mediaType === "tv";

  const tryNextServer = useCallback(() => {
    setServerIndex((prev) => {
      if (prev < STREAM_SERVERS.length - 1) {
        setIsLoadingStream(true);
        return prev + 1;
      } else {
        setHasAllServersFailed(true);
        setIsLoadingStream(false);
        return prev;
      }
    });
  }, []);

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  }, [season, episode]);

  useEffect(() => {
    if (isOpen) {
      setServerIndex(0);
      setHasAllServersFailed(false);
      setIsLoadingStream(true);
    }
  }, [isOpen, tmdbId, currentSeason, currentEpisode, activeMode]);

  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data) return;
      try {
        const dataStr =
          typeof e.data === "string" ? e.data : JSON.stringify(e.data);
        if (
          dataStr.includes("PLAYER_ERROR") ||
          dataStr.includes("MEDIA_NOT_FOUND") ||
          dataStr.includes('"type":"not_found"')
        ) {
          tryNextServer();
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [tryNextServer]);

  const handleServerSelect = (index) => {
    setServerIndex(index);
    setHasAllServersFailed(false);
    setIsLoadingStream(true);
  };

  useEffect(() => {
    if (!isOpen || activeMode !== "full_movie" || hasAllServersFailed) return;

    clearTimeout(failoverTimeoutRef.current);
    failoverTimeoutRef.current = setTimeout(() => {
      if (isLoadingStream) {
        tryNextServer();
      }
    }, 10000);

    return () => clearTimeout(failoverTimeoutRef.current);
  }, [
    isOpen,
    activeMode,
    serverIndex,
    isLoadingStream,
    hasAllServersFailed,
    tryNextServer,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      const originalOpen = window.open;
      window.open = () => null;

      const handleBeforeUnload = (e) => {
        e.preventDefault();
        return (e.returnValue = "");
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.open = originalOpen;
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !tmdbId) return null;

  const currentServer = STREAM_SERVERS[serverIndex] || STREAM_SERVERS[0];
  const fullMovieUrl = currentServer.getUrl(
    tmdbId,
    isTV,
    currentSeason,
    currentEpisode,
  );

  const youtubeUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`
    : null;

  const currentStreamSrc = activeMode === "trailer" ? youtubeUrl : fullMovieUrl;

  const handleEpisodeSelect = (ep) => {
    setCurrentEpisode(ep);
    setServerIndex(0);
    setHasAllServersFailed(false);
    setIsLoadingStream(true);
    if (onEpisodeChange) onEpisodeChange(ep);
  };

  const handleManualRetry = () => {
    setServerIndex(0);
    setHasAllServersFailed(false);
    setIsLoadingStream(true);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] w-screen h-screen bg-black flex flex-col animate-fadeIn select-none">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-neutral-950">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={filmZoneLogo}
            alt="FilmZone"
            className="h-6 sm:h-7 w-auto object-contain shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-black text-white truncate">
              {title}
            </h3>
            {mediaType === "tv" && activeMode === "full_movie" && (
              <p className="text-xs sm:text-sm font-semibold text-[#FFD700]">
                Season {currentSeason} • Episode {currentEpisode}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
          {activeMode === "full_movie" && (
            <div className="hidden sm:flex items-center p-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-bold gap-1">
              <span className="text-[11px] font-extrabold text-neutral-400 pl-2 pr-1 uppercase tracking-wider flex items-center gap-1">
                <Server className="w-3 h-3 text-[#B90101]" />
                Server:
              </span>
              {STREAM_SERVERS.map((srv, idx) => {
                const isSelected = serverIndex === idx;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => handleServerSelect(idx)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#B90101] text-white shadow-xs"
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center p-1 rounded-full bg-neutral-900 border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMode("full_movie")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeMode === "full_movie"
                  ? "bg-[#B90101] text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{mediaType === "tv" ? "Watch Series" : "Full Movie"}</span>
            </button>

            {trailerKey && (
              <button
                type="button"
                onClick={() => setActiveMode("trailer")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeMode === "trailer"
                    ? "bg-[#B90101] text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Trailer</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-[#B90101] border border-white/15 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            aria-label="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
        {activeMode === "full_movie" && hasAllServersFailed ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-gradient-to-b from-neutral-900 to-neutral-950 text-white animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#B90101]/15 border border-[#B90101]/30 flex items-center justify-center mb-4 text-[#B90101]">
              <Clapperboard className="w-8 h-8" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
              Stream Currently Unavailable
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
              We searched across all streaming servers, but &quot;{title}
              &quot; has not been released for digital streaming yet.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {trailerKey && (
                <button
                  type="button"
                  onClick={() => setActiveMode("trailer")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B90101] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition cursor-pointer"
                >
                  <Film className="w-4 h-4" />
                  <span>Watch Official Trailer</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleManualRetry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider border border-white/10 active:scale-95 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Stream</span>
              </button>
            </div>
          </div>
        ) : activeMode === "trailer" && !youtubeUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-gradient-to-b from-neutral-900 to-neutral-950 text-white animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
              Trailer Not Available
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
              An official YouTube trailer has not been uploaded to TMDB for
              &quot;{title}&quot; yet.
            </p>
            <button
              type="button"
              onClick={() => setActiveMode("full_movie")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B90101] text-white text-xs sm:text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Switch to Full Movie</span>
            </button>
          </div>
        ) : (
          <>
            {isLoadingStream && activeMode === "full_movie" && (
              <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20 pointer-events-none transition-opacity duration-300">
                <div className="w-10 h-10 border-3 border-[#B90101] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs sm:text-sm font-bold text-neutral-300 tracking-wide">
                  Connecting to high-speed stream...
                </p>
              </div>
            )}

            {activeMode === "full_movie" && (
              <div className="absolute top-4 right-6 z-30 pointer-events-none flex items-center px-3 py-1.5 rounded-lg bg-black/95 border border-white/20 select-none shadow-lg">
                <img
                  src={filmZoneLogo}
                  alt="FilmZone"
                  className="h-6 w-auto object-contain"
                />
              </div>
            )}

            <iframe
              key={currentStreamSrc}
              src={currentStreamSrc}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setIsLoadingStream(false)}
              onError={tryNextServer}
            />
          </>
        )}
      </div>

      {activeMode === "full_movie" && (
        <div className="sm:hidden shrink-0 px-4 py-2 bg-neutral-950 border-t border-white/10 flex items-center justify-between gap-2 overflow-x-auto select-none">
          <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Server className="w-3 h-3 text-[#B90101]" />
            Server:
          </span>
          <div className="flex items-center gap-1.5">
            {STREAM_SERVERS.map((srv, idx) => {
              const isSelected = serverIndex === idx;
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => handleServerSelect(idx)}
                  className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#B90101] text-white shadow-xs"
                      : "bg-neutral-900 text-neutral-400 hover:text-white border border-white/10"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mediaType === "tv" &&
        activeMode === "full_movie" &&
        totalEpisodes > 1 && (
          <div className="shrink-0 px-4 sm:px-6 py-3 bg-neutral-950 border-t border-white/10 flex items-center gap-3 overflow-x-auto select-none">
            <span className="text-xs font-black text-neutral-400 uppercase tracking-wider shrink-0">
              Episodes:
            </span>
            <div className="flex items-center gap-2 p-1">
              {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map(
                (epNum) => {
                  const isActive = epNum === currentEpisode;
                  return (
                    <button
                      key={epNum}
                      type="button"
                      onClick={() => handleEpisodeSelect(epNum)}
                      className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#B90101] text-white"
                          : "bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/10"
                      }`}
                    >
                      {epNum}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        )}
    </div>,
    document.body,
  );
}
