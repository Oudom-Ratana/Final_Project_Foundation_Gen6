import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Play,
  Film,
  Clapperboard,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import filmZoneLogo from "../../assets/logo/FilmZoneLogo.png";

/**
 * Multi-Server Streaming Engine
 * Automatically fails over silently from Server 1 -> Server 2 -> Server 3 -> Server 4
 * without requiring the user to manually click any server buttons.
 */
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
    id: "vidsrc_cc",
    name: "Server 2",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${ep}`
        : `https://vidsrc.cc/v2/embed/movie/${id}`,
  },
  {
    id: "multiembed",
    name: "Server 3",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${ep}`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
  {
    id: "autoembed",
    name: "Server 4",
    getUrl: (id, isTV, s, ep) =>
      isTV
        ? `https://player.autoembed.cc/embed/tv/${id}/${s}/${ep}`
        : `https://player.autoembed.cc/embed/movie/${id}`,
  },
];

export default function StreamPlayerModal({
  isOpen,
  onClose,
  tmdbId,
  mediaType = "movie", // 'movie' | 'tv'
  title = "Movie Player",
  trailerKey,
  initialMode = "full_movie", // 'full_movie' | 'trailer'
  season = 1,
  episode = 1,
  totalEpisodes = 8,
  onEpisodeChange,
}) {
  const [activeMode, setActiveMode] = useState(initialMode);
  const [currentSeason, setCurrentSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);

  // Auto-failover state (Zero manual server buttons)
  const [serverIndex, setServerIndex] = useState(0);
  const [isLoadingStream, setIsLoadingStream] = useState(true);
  const [hasAllServersFailed, setHasAllServersFailed] = useState(false);
  const failoverTimeoutRef = useRef(null);

  const isTV = mediaType === "tv";

  // Silent automatic failover to next server
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

  // Reset states when movie, episode, mode or modal changes
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

  // Listen for cross-origin postMessage errors from stream providers
  useEffect(() => {
    const handleMessage = (e) => {
      if (!e.data) return;
      const dataStr =
        typeof e.data === "string" ? e.data : JSON.stringify(e.data);
      if (
        dataStr.includes("error") ||
        dataStr.includes("not_found") ||
        dataStr.includes("PLAYER_ERROR") ||
        dataStr.includes("MEDIA_NOT_FOUND")
      ) {
        tryNextServer();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [tryNextServer]);

  // Safety auto-failover timer: If an iframe hangs or fails to complete within 6s, silently switch
  useEffect(() => {
    if (!isOpen || activeMode !== "full_movie" || hasAllServersFailed) return;

    clearTimeout(failoverTimeoutRef.current);
    failoverTimeoutRef.current = setTimeout(() => {
      if (isLoadingStream) {
        tryNextServer();
      }
    }, 6500);

    return () => clearTimeout(failoverTimeoutRef.current);
  }, [
    isOpen,
    activeMode,
    serverIndex,
    isLoadingStream,
    hasAllServersFailed,
    tryNextServer,
  ]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !tmdbId) return null;

  // Active video URL resolution
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
      {/* 1. Modal Top Bar */}
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

        {/* Controls: Mode Switcher (Full Movie / Trailer) & Close */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mode Switcher Pills */}
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

          {/* Close Button */}
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

      {/* 2. Fullscreen Video Player Viewport */}
      <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden">
        {/* A. Stream Unavailable Fallback Card (When all servers return empty) */}
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
          /* B. Trailer Not Found Fallback Card */
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
          /* C. Active Working Video Player */
          <>
            {isLoadingStream && activeMode === "full_movie" && (
              <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20 pointer-events-none transition-opacity duration-300">
                <div className="w-10 h-10 border-3 border-[#B90101] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs sm:text-sm font-bold text-neutral-300 tracking-wide">
                  Connecting to high-speed stream...
                </p>
              </div>
            )}

            {/* FilmZone Branding Badge (Always visible watermark) */}
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

      {/* 3. TV Series Episode Navigator (if TV Show & Full Movie mode) */}
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
