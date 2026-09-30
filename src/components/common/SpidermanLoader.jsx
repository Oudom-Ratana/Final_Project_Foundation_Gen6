import React from "react";
import popcornBucketImg from "../../assets/loader/popcorn-bucket1.png";
import popcornKernelImg from "../../assets/loader/popcorn-kernel.png";

const PopcornKernel = ({ className = "", style = {} }) => (
  <img
    src={popcornKernelImg}
    alt="Popcorn"
    className={`absolute pointer-events-none object-contain select-none ${className}`}
    style={style}
    draggable="false"
  />
);












export default function SpidermanLoader({
  fullScreen = false,
  size = "md", 
  text = "LOADING...",
}) {
  const sizeMap = {
    sm: {
      container: "w-40 h-40",
      ribbonWrap: "w-52 h-52",
      bucketSize: "w-20 h-24",
      text: "text-xs",
      popcornSize: "w-5 h-5",
    },
    md: {
      container: "w-56 h-56",
      ribbonWrap: "w-72 h-72 sm:w-80 sm:h-80",
      bucketSize: "w-28 h-34 sm:w-32 sm:h-38",
      text: "text-sm sm:text-base",
      popcornSize: "w-7 h-7 sm:w-8 sm:h-8",
    },
    lg: {
      container: "w-72 h-72",
      ribbonWrap: "w-96 h-96 sm:w-[420px] sm:h-[420px]",
      bucketSize: "w-36 h-44 sm:w-42 sm:h-50",
      text: "text-base sm:text-lg",
      popcornSize: "w-9 h-9 sm:w-10 sm:h-10",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-6 select-none font-sans">
      <div
        className={`relative ${currentSize.container} flex items-center justify-center`}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#B90101]/30 via-amber-500/20 to-transparent animate-pulse opacity-80 filter blur-md" />
        <div className="absolute -inset-3 rounded-full bg-radial from-[#B90101]/25 via-transparent to-transparent animate-ping duration-1000 opacity-40" />


        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornBurst1 2.0s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "0s",
            }}
          />
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornBurst2 2.0s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "0.35s",
            }}
          />
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornBurst3 2.0s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "0.7s",
            }}
          />
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornBurst4 2.0s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "1.05s",
            }}
          />
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornBurst5 2.0s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "1.4s",
            }}
          />
          <PopcornKernel
            className={currentSize.popcornSize}
            style={{
              animation:
                "popcornBurst3 2.0s infinite cubic-bezier(0.25, 1, 0.5, 1)",
              animationDelay: "1.75s",
            }}
          />
        </div>

        <div
          className={`relative z-20 flex items-center justify-center ${currentSize.bucketSize}`}
          style={{
            animation: "bucketJiggle 2.0s infinite ease-in-out",
          }}
        >
          <img
            src={popcornBucketImg}
            alt="Cinema Popcorn Bucket"
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable="false"
          />
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <div className="flex items-center gap-2">
          <p
            className={`font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-300 to-red-500 animate-pulse ${currentSize.text}`}
          >
            {text}
          </p>
        </div>

        <div className="w-40 sm:w-52 h-1.5 bg-neutral-800/80 rounded-full overflow-hidden relative shadow-inner border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#B90101] via-[#C8961E] to-[#B90101] w-1/3 rounded-full"
            style={{
              animation: "cinemaSlide 1.6s ease-in-out infinite alternate",
            }}
          />
        </div>
      </div>

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

        /* Popcorn Bucket Subtle Micro-Jiggle */
        @keyframes bucketJiggle {
          0%, 100% { transform: translateY(0) scale(1); }
          20% { transform: translateY(-3px) scale(1.02) rotate(-1deg); }
          40% { transform: translateY(1px) scale(0.99) rotate(1deg); }
          65% { transform: translateY(-2px) scale(1.01) rotate(-0.5deg); }
          85% { transform: translateY(0.5px) scale(1) rotate(0.5deg); }
        }

        /* Popcorn 1: Pops Up-Left */
        @keyframes popcornBurst1 {
          0% { opacity: 0; transform: translate(0, -20px) scale(0.2) rotate(0deg); }
          15% { opacity: 1; transform: translate(-30px, -85px) scale(1.3) rotate(-35deg); }
          32% { opacity: 1; transform: translate(-45px, -115px) scale(1.1) rotate(-65deg); }
          55% { opacity: 0.9; transform: translate(-55px, -80px) scale(0.9) rotate(-110deg); }
          80% { opacity: 0; transform: translate(-65px, -15px) scale(0.4) rotate(-160deg); }
          100% { opacity: 0; transform: translate(0, -20px) scale(0.2) rotate(0deg); }
        }

        /* Popcorn 2: Pops Up-Right */
        @keyframes popcornBurst2 {
          0% { opacity: 0; transform: translate(0, -20px) scale(0.2) rotate(0deg); }
          15% { opacity: 1; transform: translate(30px, -90px) scale(1.35) rotate(40deg); }
          32% { opacity: 1; transform: translate(50px, -120px) scale(1.15) rotate(75deg); }
          55% { opacity: 0.9; transform: translate(60px, -85px) scale(0.9) rotate(120deg); }
          80% { opacity: 0; transform: translate(70px, -20px) scale(0.4) rotate(170deg); }
          100% { opacity: 0; transform: translate(0, -20px) scale(0.2) rotate(0deg); }
        }

        /* Popcorn 3: Pops High Straight Up */
        @keyframes popcornBurst3 {
          0% { opacity: 0; transform: translate(0, -20px) scale(0.2) rotate(0deg); }
          14% { opacity: 1; transform: translate(0px, -105px) scale(1.4) rotate(15deg); }
          30% { opacity: 1; transform: translate(4px, -140px) scale(1.15) rotate(45deg); }
          55% { opacity: 0.85; transform: translate(8px, -95px) scale(0.85) rotate(90deg); }
          80% { opacity: 0; transform: translate(10px, -30px) scale(0.4) rotate(140deg); }
          100% { opacity: 0; transform: translate(0, -20px) scale(0.2) rotate(0deg); }
        }

        /* Popcorn 4: Bursts Far Left */
        @keyframes popcornBurst4 {
          0% { opacity: 0; transform: translate(-10px, -20px) scale(0.2) rotate(0deg); }
          16% { opacity: 1; transform: translate(-55px, -70px) scale(1.25) rotate(-50deg); }
          35% { opacity: 1; transform: translate(-75px, -95px) scale(1.05) rotate(-90deg); }
          60% { opacity: 0.8; transform: translate(-90px, -50px) scale(0.8) rotate(-140deg); }
          85% { opacity: 0; transform: translate(-100px, 5px) scale(0.35) rotate(-190deg); }
          100% { opacity: 0; transform: translate(-10px, -20px) scale(0.2) rotate(0deg); }
        }

        /* Popcorn 5: Bursts Far Right */
        @keyframes popcornBurst5 {
          0% { opacity: 0; transform: translate(10px, -20px) scale(0.2) rotate(0deg); }
          16% { opacity: 1; transform: translate(55px, -70px) scale(1.25) rotate(50deg); }
          35% { opacity: 1; transform: translate(75px, -95px) scale(1.05) rotate(90deg); }
          60% { opacity: 0.8; transform: translate(90px, -50px) scale(0.8) rotate(140deg); }
          85% { opacity: 0; transform: translate(100px, 5px) scale(0.35) rotate(190deg); }
          100% { opacity: 0; transform: translate(10px, -20px) scale(0.2) rotate(0deg); }
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
