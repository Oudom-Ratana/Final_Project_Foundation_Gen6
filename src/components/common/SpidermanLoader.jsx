import React from "react";
import filmZoneLogo from "../../assets/logo/FilmZoneLogo.png";

export default function SpidermanLoader({
  fullScreen = false,
  size = "md", // 'sm' | 'md' | 'lg'
  text = "LOADING FILM ZONE...",
}) {
  const sizeMap = {
    sm: { container: "w-28 h-28", logo: "w-20", text: "text-xs" },
    md: {
      container: "w-44 h-44",
      logo: "w-28 sm:w-32",
      text: "text-sm sm:text-base",
    },
    lg: { container: "w-60 h-60", logo: "w-40 sm:w-48", text: "text-lg" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6 select-none font-sans">
      {/* 1. Outer Container with Spider-Web & Glow Aura */}
      <div
        className={`relative ${currentSize.container} flex items-center justify-center`}
      >
        {/* Pulsing Red & Blue Web Aura */}
        <div className="absolute inset-0 rounded-full bg-radial from-red-600/30 via-red-950/20 to-transparent animate-ping duration-1000 opacity-60" />
        <div className="absolute -inset-2 rounded-full bg-radial from-blue-600/20 via-transparent to-transparent animate-pulse" />

        {/* Rotating Holographic Web Radar Ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite] opacity-70"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Web concentric circles */}
          <circle
            cx="100"
            cy="100"
            r="30"
            stroke="#B90101"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.6"
          />
          <circle
            cx="100"
            cy="100"
            r="55"
            stroke="#B90101"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.7"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="#B90101"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            opacity="0.8"
          />
          <circle
            cx="100"
            cy="100"
            r="95"
            stroke="#00D2FF"
            strokeWidth="1"
            strokeDasharray="8 8"
            opacity="0.5"
          />

          {/* Web radial spokes */}
          <line
            x1="100"
            y1="5"
            x2="100"
            y2="195"
            stroke="#B90101"
            strokeWidth="1.2"
            opacity="0.5"
          />
          <line
            x1="5"
            y1="100"
            x2="195"
            y2="100"
            stroke="#B90101"
            strokeWidth="1.2"
            opacity="0.5"
          />
          <line
            x1="33"
            y1="33"
            x2="167"
            y2="167"
            stroke="#B90101"
            strokeWidth="1"
            opacity="0.4"
          />
          <line
            x1="33"
            y1="167"
            x2="167"
            y2="33"
            stroke="#B90101"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>

        {/* Counter-spinning Web Particle Dots */}
        <svg
          className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] animate-[spin_4s_linear_infinite_reverse] opacity-80"
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="10"
            r="3"
            fill="#CCFF00"
            className="animate-pulse"
          />
          <circle cx="150" cy="80" r="2.5" fill="#FFD700" />
          <circle
            cx="80"
            cy="150"
            r="3"
            fill="#CCFF00"
            className="animate-pulse"
          />
          <circle cx="10" cy="80" r="2.5" fill="#FFD700" />
        </svg>

        {/* 2. FilmZone Logo in Center */}
        <div
          className={`relative z-10 flex items-center justify-center p-2 ${currentSize.logo}`}
        >
          <img
            src={filmZoneLogo}
            alt="FilmZone Logo"
            className="w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(185,1,1,0.8)] animate-pulse filter brightness-105"
          />
        </div>
      </div>

      {/* 3. FilmZone Styled Loading Text */}
      <div className="flex flex-col items-center text-center gap-1.5">
        <div className="flex items-center gap-2">
          {/* FilmZone Tag Badge */}
          <span className="px-2 py-0.5 rounded bg-[#B90101] text-white text-[10px] font-black uppercase tracking-widest shadow-md">
            FILMZONE
          </span>
          <p
            className={`font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-500 animate-pulse ${currentSize.text}`}
          >
            {text}
          </p>
        </div>

        {/* Speed Spider Web Bar */}
        <div className="w-36 sm:w-48 h-1.5 bg-neutral-800 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#B90101] via-[#CCFF00] to-[#B90101] w-1/3 rounded-full animate-[shimmer_1.5s_infinite_linear]"
            style={{
              animation: "spideySlide 1.6s ease-in-out infinite alternate",
            }}
          />
        </div>
      </div>

      {/* Inline Keyframe Style for Custom Shimmer */}
      <style>{`
        @keyframes spideySlide {
          0% { transform: translateX(-60%); }
          100% { transform: translateX(180%); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}
