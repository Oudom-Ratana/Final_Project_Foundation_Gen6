import React, { useMemo } from "react";
import filmZoneLogo from "../../assets/logo/FilmZoneLogo.png";

// Popcorn piece SVG with buttery golden/creamy movie theater styling
const PopcornKernel = ({ className = "", style = {} }) => (
  <svg
    viewBox="0 0 32 32"
    className={`absolute pointer-events-none drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] ${className}`}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="popcornGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#FEF08A" />
        <stop offset="75%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
    </defs>
    {/* Fluffy popped popcorn lobes */}
    <path
      d="M16 5C13.2 5 11 7.2 10.6 9.8C8.8 10.2 7.4 11.8 7.4 13.8C7.4 14.4 7.5 15 7.8 15.5C6.3 16.3 5.3 17.9 5.3 19.8C5.3 22.4 7.4 24.5 10 24.5C10.6 24.5 11.2 24.4 11.7 24.1C12.8 25.5 14.4 26.5 16.3 26.5C18.2 26.5 19.9 25.4 20.9 23.9C21.5 24.3 22.2 24.5 23 24.5C25.5 24.5 27.5 22.5 27.5 20C27.5 18.6 26.8 17.4 25.7 16.7C26.2 16 26.5 15.2 26.5 14.4C26.5 12 24.6 10 22.2 10C22 10 21.7 10 21.5 10.1C20.6 7 18.5 5 16 5Z"
      fill="url(#popcornGrad)"
    />
    {/* Buttery yellow popcorn center kernel spots */}
    <circle cx="15.5" cy="15.5" r="2.4" fill="#F59E0B" opacity="0.7" />
    <circle cx="18.5" cy="17.5" r="1.8" fill="#D97706" opacity="0.6" />
    <circle cx="13" cy="17" r="1.5" fill="#B45309" opacity="0.45" />
  </svg>
);

// Authentic 35mm Filmstrip Ribbon (Matches Reference Image with Black Rails, Sprockets & Silver Frames)
const FilmstripRibbon = ({ className = "" }) => {
  const numFrames = 14;
  const cx = 150;
  const cy = 150;
  const rOuter = 142;
  const rInner = 104;
  const rWindowOuter = 133;
  const rWindowInner = 113;
  const rSprocketOuter = 138;
  const rSprocketInner = 108;

  const frames = useMemo(() => {
    const list = [];
    for (let i = 0; i < numFrames; i++) {
      const angleStart = (i * 360) / numFrames + 1.2;
      const angleEnd = ((i + 1) * 360) / numFrames - 1.2;
      const radStart = (angleStart * Math.PI) / 180;
      const radEnd = (angleEnd * Math.PI) / 180;

      const x1 = cx + rWindowOuter * Math.cos(radStart);
      const y1 = cy + rWindowOuter * Math.sin(radStart);
      const x2 = cx + rWindowOuter * Math.cos(radEnd);
      const y2 = cy + rWindowOuter * Math.sin(radEnd);
      const x3 = cx + rWindowInner * Math.cos(radEnd);
      const y3 = cy + rWindowInner * Math.sin(radEnd);
      const x4 = cx + rWindowInner * Math.cos(radStart);
      const y4 = cy + rWindowInner * Math.sin(radStart);

      // 3 sprocket perforation holes along outer and inner margins
      const sprockets = [];
      for (let s = 0; s < 3; s++) {
        const sprocketAngle =
          angleStart + ((angleEnd - angleStart) * (s + 0.5)) / 3;
        const sRad = (sprocketAngle * Math.PI) / 180;
        const ox = cx + rSprocketOuter * Math.cos(sRad);
        const oy = cy + rSprocketOuter * Math.sin(sRad);
        const ix = cx + rSprocketInner * Math.cos(sRad);
        const iy = cy + rSprocketInner * Math.sin(sRad);
        sprockets.push({ ox, oy, ix, iy, angle: sprocketAngle + 90 });
      }

      list.push({
        windowPath: `M ${x1} ${y1} A ${rWindowOuter} ${rWindowOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rWindowInner} ${rWindowInner} 0 0 0 ${x4} ${y4} Z`,
        sprockets,
      });
    }
    return list;
  }, [numFrames]);

  return (
    <svg
      viewBox="0 0 300 300"
      className={`w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glossy silver film exposure frame gradient */}
        <linearGradient id="filmFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#E2E8F0" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#CBD5E1" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.9" />
        </linearGradient>

        {/* Deep cinema black film base */}
        <linearGradient id="filmBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#090D16" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      {/* Main Solid Black 35mm Filmstrip Body */}
      <path
        d={`M ${cx + rOuter} ${cy} A ${rOuter} ${rOuter} 0 1 0 ${cx - rOuter} ${cy} A ${rOuter} ${rOuter} 0 1 0 ${cx + rOuter} ${cy} M ${cx + rInner} ${cy} A ${rInner} ${rInner} 0 1 1 ${cx - rInner} ${cy} A ${rInner} ${rInner} 0 1 1 ${cx + rInner} ${cy}`}
        fill="url(#filmBaseGrad)"
        stroke="#000000"
        strokeWidth="2.5"
      />

      {/* Outer & Inner Thin Red Cinema Edge Guidelines */}
      <circle
        cx={cx}
        cy={cy}
        r={rOuter}
        stroke="#B90101"
        strokeWidth="1.2"
        opacity="0.75"
      />
      <circle
        cx={cx}
        cy={cy}
        r={rInner}
        stroke="#B90101"
        strokeWidth="1.2"
        opacity="0.75"
      />

      {/* Consecutive Film Frames with Silver Window & Crisp Black Separator Bars */}
      {frames.map((frame, idx) => (
        <g key={`film-frame-${idx}`}>
          {/* Silver Film Cell Window */}
          <path
            d={frame.windowPath}
            fill="url(#filmFrameGrad)"
            stroke="#090D16"
            strokeWidth="1"
          />

          {/* White Rectangular Sprocket Holes on Both Margins (35mm authentic look) */}
          {frame.sprockets.map((sp, sIdx) => (
            <React.Fragment key={`sp-${idx}-${sIdx}`}>
              {/* Outer Margin Sprocket */}
              <g
                transform={`translate(${sp.ox}, ${sp.oy}) rotate(${sp.angle})`}
              >
                <rect
                  x="-2.2"
                  y="-1.7"
                  width="4.4"
                  height="3.4"
                  rx="0.5"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="0.5"
                />
              </g>
              {/* Inner Margin Sprocket */}
              <g
                transform={`translate(${sp.ix}, ${sp.iy}) rotate(${sp.angle})`}
              >
                <rect
                  x="-2.2"
                  y="-1.7"
                  width="4.4"
                  height="3.4"
                  rx="0.5"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="0.5"
                />
              </g>
            </React.Fragment>
          ))}
        </g>
      ))}
    </svg>
  );
};

export default function SpidermanLoader({
  fullScreen = false,
  size = "md", // 'sm' | 'md' | 'lg'
  text = "LOADING...",
}) {
  const sizeMap = {
    sm: {
      container: "w-40 h-40",
      ribbonWrap: "w-52 h-52",
      logo: "w-20",
      text: "text-xs",
      popcornSize: "w-5 h-5",
    },
    md: {
      container: "w-56 h-56",
      ribbonWrap: "w-72 h-72 sm:w-80 sm:h-80",
      logo: "w-28 sm:w-32",
      text: "text-sm sm:text-base",
      popcornSize: "w-7 h-7 sm:w-8 sm:h-8",
    },
    lg: {
      container: "w-72 h-72",
      ribbonWrap: "w-96 h-96 sm:w-[420px] sm:h-[420px]",
      logo: "w-36 sm:w-44",
      text: "text-base sm:text-lg",
      popcornSize: "w-9 h-9 sm:w-10 sm:h-10",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6 select-none font-sans">
      {/* 1. Outer Container: 35mm Magazine Film Ribbon Orbit & Looping Popping Popcorn */}
      <div
        className={`relative ${currentSize.container} flex items-center justify-center`}
      >
        {/* Cinema Warm Glow Auras */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#B90101]/30 via-amber-500/20 to-transparent animate-pulse opacity-80 filter blur-md" />
        <div className="absolute -inset-3 rounded-full bg-radial from-[#B90101]/25 via-transparent to-transparent animate-ping duration-1000 opacity-40" />

        {/* 2. 35mm Magazine Filmstrip Ribbon Orbiting in 3D Perspective Behind the Logo */}
        <div
          className={`absolute ${currentSize.ribbonWrap} pointer-events-none flex items-center justify-center z-10`}
          style={{
            perspective: "850px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main Primary Film Ribbon (Tilted 3D Orbit Matching Reference Image) */}
          <div
            className="w-full h-full"
            style={{
              animation: "filmstrip3DOrbit 12s linear infinite",
              transformStyle: "preserve-3d",
            }}
          >
            <FilmstripRibbon />
          </div>

          {/* Secondary Counter-Curving Film Ribbon Strand (Adds Depth Behind Logo) */}
          <div
            className="absolute w-[82%] h-[82%] opacity-60"
            style={{
              animation: "filmstrip3DCounter 16s linear infinite",
              transformStyle: "preserve-3d",
            }}
          >
            <FilmstripRibbon />
          </div>
        </div>

        {/* 3. Popping Popcorn Kernels (Looping in Real-time) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          {/* Popcorn 1: Pops Up-Left */}
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornPop1 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "0s",
            }}
          />
          {/* Popcorn 2: Pops Up-Right */}
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornPop2 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "0.35s",
            }}
          />
          {/* Popcorn 3: Pops Top-Center High */}
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornPop3 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "0.7s",
            }}
          />
          {/* Popcorn 4: Pops Far Left */}
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornPop4 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "1.05s",
            }}
          />
          {/* Popcorn 5: Pops Far Right */}
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornPop5 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "1.4s",
            }}
          />
          {/* Popcorn 6: Pops Bottom-Right */}
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornPop6 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "1.75s",
            }}
          />
          {/* Popcorn 7: Pops Bottom-Left */}
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornPop7 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "2.1s",
            }}
          />
        </div>

        {/* 4. FilmZone Logo in Center (In Front of Film Ribbon) */}
        <div
          className={`relative z-20 flex items-center justify-center p-2 ${currentSize.logo}`}
        >
          <img
            src={filmZoneLogo}
            alt="FilmZone Logo"
            className="w-full h-auto object-contain drop-shadow-[0_0_35px_rgba(185,1,1,0.9)] filter brightness-110 transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>

      {/* 5. FilmZone Cinema Loading Text & Bar */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="flex items-center gap-2">
          {/* Cinema Badge */}
          {/* <span className="px-2.5 py-0.5 rounded-full bg-[#B90101] text-white text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
            <span>🍿</span> FILMZONE
          </span> */}
          <p
            className={`font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-300 to-red-500 animate-pulse ${currentSize.text}`}
          >
            {text}
          </p>
        </div>

        {/* Cinema Golden-Red Shimmer Bar with #C8961E */}
        <div className="w-40 sm:w-52 h-1.5 bg-neutral-800/80 rounded-full overflow-hidden relative shadow-inner border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#B90101] via-[#C8961E] to-[#B90101] w-1/3 rounded-full"
            style={{
              animation: "cinemaSlide 1.6s ease-in-out infinite alternate",
            }}
          />
        </div>
      </div>

      {/* Keyframes for 3D Filmstrip Ribbon Orbit, Popping Popcorn & Cinema Shimmer */}
      <style>{`
        @keyframes filmstrip3DOrbit {
          0% {
            transform: rotateX(54deg) rotateY(-18deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(54deg) rotateY(-18deg) rotateZ(360deg);
          }
        }

        @keyframes filmstrip3DCounter {
          0% {
            transform: rotateX(-48deg) rotateY(16deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(-48deg) rotateY(16deg) rotateZ(-360deg);
          }
        }

        @keyframes cinemaSlide {
          0% { transform: translateX(-60%); }
          100% { transform: translateX(190%); }
        }

        @keyframes popcornPop1 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
          12% { opacity: 1; transform: translate(-45px, -60px) scale(1.35) rotate(-25deg); }
          28% { opacity: 1; transform: translate(-55px, -75px) scale(1.1) rotate(-40deg); }
          50% { opacity: 0.85; transform: translate(-60px, -45px) scale(0.9) rotate(-55deg); }
          75% { opacity: 0; transform: translate(-65px, -15px) scale(0.5) rotate(-70deg); }
          100% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
        }

        @keyframes popcornPop2 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
          12% { opacity: 1; transform: translate(45px, -65px) scale(1.4) rotate(20deg); }
          28% { opacity: 1; transform: translate(58px, -80px) scale(1.15) rotate(35deg); }
          50% { opacity: 0.85; transform: translate(65px, -50px) scale(0.9) rotate(50deg); }
          75% { opacity: 0; transform: translate(70px, -20px) scale(0.5) rotate(65deg); }
          100% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
        }

        @keyframes popcornPop3 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
          14% { opacity: 1; transform: translate(0px, -80px) scale(1.3) rotate(-15deg); }
          30% { opacity: 1; transform: translate(3px, -100px) scale(1.1) rotate(10deg); }
          55% { opacity: 0.8; transform: translate(5px, -65px) scale(0.85) rotate(25deg); }
          80% { opacity: 0; transform: translate(8px, -30px) scale(0.4) rotate(40deg); }
          100% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
        }

        @keyframes popcornPop4 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
          15% { opacity: 1; transform: translate(-70px, -35px) scale(1.3) rotate(-45deg); }
          32% { opacity: 1; transform: translate(-85px, -40px) scale(1.05) rotate(-60deg); }
          55% { opacity: 0.8; transform: translate(-90px, -10px) scale(0.85) rotate(-75deg); }
          78% { opacity: 0; transform: translate(-95px, 15px) scale(0.45) rotate(-90deg); }
          100% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
        }

        @keyframes popcornPop5 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
          15% { opacity: 1; transform: translate(70px, -35px) scale(1.3) rotate(45deg); }
          32% { opacity: 1; transform: translate(85px, -40px) scale(1.05) rotate(60deg); }
          55% { opacity: 0.8; transform: translate(90px, -10px) scale(0.85) rotate(75deg); }
          78% { opacity: 0; transform: translate(95px, 15px) scale(0.45) rotate(90deg); }
          100% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
        }

        @keyframes popcornPop6 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
          16% { opacity: 1; transform: translate(55px, 40px) scale(1.25) rotate(25deg); }
          35% { opacity: 1; transform: translate(65px, 55px) scale(1.05) rotate(40deg); }
          60% { opacity: 0.75; transform: translate(70px, 75px) scale(0.8) rotate(55deg); }
          82% { opacity: 0; transform: translate(75px, 90px) scale(0.4) rotate(70deg); }
          100% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
        }

        @keyframes popcornPop7 {
          0% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
          16% { opacity: 1; transform: translate(-55px, 40px) scale(1.25) rotate(-25deg); }
          35% { opacity: 1; transform: translate(-65px, 55px) scale(1.05) rotate(-40deg); }
          60% { opacity: 0.75; transform: translate(-70px, 75px) scale(0.8) rotate(-55deg); }
          82% { opacity: 0; transform: translate(-75px, 90px) scale(0.4) rotate(-70deg); }
          100% { opacity: 0; transform: translate(0, 0) scale(0.1) rotate(0deg); }
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
