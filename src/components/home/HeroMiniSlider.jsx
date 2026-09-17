import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";

function wrapIndex(n, len) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i, active, len) {
  const raw = i - active;
  if (len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export default function HeroMiniSlider({
  slides = [],
  currentIndex = 0,
  onSelectIndex,
}) {
  const reduceMotion = useReducedMotion();
  const len = slides.length;

  if (len === 0) return null;

  // Mini card dimensions
  const cardWidth = 175;
  const cardHeight = 240;
  const maxOffset = 2; // shows 5 cards max in fan

  return (
    <div className="flex flex-col items-center select-none">
      {/* 3D Fan Stage (Frameless, Borderless) */}
      <div
        className="relative w-[340px] sm:w-[380px] h-[260px] flex items-end justify-center"
        style={{ perspective: "900px" }}
      >
        <AnimatePresence initial={false}>
          {slides.map((slide, i) => {
            const off = signedOffset(i, currentIndex, len);
            const abs = Math.abs(off);
            const visible = abs <= maxOffset;

            if (!visible) return null;

            const rotateZ = off * 14;
            const x = off * 78;
            const y = abs * 10;
            const z = -abs * 70;
            const isActive = off === 0;
            const scale = isActive ? 1.05 : 0.88 - abs * 0.05;
            const zIndex = 40 - abs;

            const posterImg =
              slide.poster_path ||
              slide.backdrop_path ||
              "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80";

            return (
              <motion.div
                key={slide.id || i}
                onClick={() => onSelectIndex(i)}
                className={`absolute bottom-2 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "shadow-2xl shadow-black/95 filter brightness-100"
                    : "opacity-75 hover:opacity-100 filter brightness-90 hover:brightness-100"
                }`}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  zIndex,
                  transformStyle: "preserve-3d",
                }}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        y: y + 30,
                        x,
                        rotateZ,
                        scale,
                      }
                }
                animate={{
                  opacity: 1,
                  x,
                  y,
                  rotateZ,
                  scale,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 26,
                }}
              >
                <div
                  className="h-full w-full relative bg-neutral-950"
                  style={{
                    transform: `translateZ(${z}px)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Card Artwork */}
                  <img
                    src={posterImg}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                    loading="eager"
                  />

                  {/* Gradient Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-3 z-10 flex flex-col justify-end space-y-1">
                    <span className="self-start px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#B90101] text-white shadow-sm">
                      {slide.genre || "NOW SHOWING"}
                    </span>

                    <h4 className="text-xs font-black text-white line-clamp-1 leading-tight drop-shadow-md">
                      {slide.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-300 font-semibold">
                      <span className="flex items-center gap-0.5 text-[#FFD700]">
                        <Star className="w-2.5 h-2.5 fill-[#FFD700]" />
                        {slide.vote_average || "8.8"}
                      </span>
                      <span>•</span>
                      <span>{slide.release_date || "2026"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
