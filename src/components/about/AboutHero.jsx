import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Sparkles,
  Film,
  Ticket,
  Star,
  Video,
} from "lucide-react";
import cinemaImage from "../../assets/others/imageAboutUs.png";

export default function AboutHero() {
  const fullText = "Welcome to FilmZone";
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        setIsTypingComplete(true); 
        clearInterval(typingInterval);
      }
    }, 150); 

    return () => clearInterval(typingInterval);
  }, []);

  const welcomePart = displayedText.slice(0, 11); 
  const filmZonePart = displayedText.slice(11); 

  return (
    <section className="relative w-full py-8 sm:py-12 lg:py-20 overflow-hidden font-sans">
      <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[var(--primary-red)]/20 rounded-full blur-[180px] pointer-events-none z-0 animate-pulse" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[var(--primary-red)]/10 border border-[var(--primary-red)]/20 text-[var(--primary-red)] font-semibold text-xs uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              <span>Redefining The Theatrical Journey</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.1] min-h-[1.2em]">
              {welcomePart}
              {filmZonePart && (
                <span className="text-[var(--primary-red)]">
                  {filmZonePart}
                </span>
              )}
              {!isTypingComplete && (
                <span className="inline-block ml-1 w-[3px] h-[0.8em] bg-[var(--primary-red)] animate-pulse align-middle" />
              )}
            </h1>

            <h2 className="text-lg sm:text-2xl font-bold text-neutral-800 dark:text-neutral-200 leading-snug">
              Bridging cutting-edge technology with the pure emotion of
              storytelling.
            </h2>

            <p className="text-sm sm:text-lg text-[var(--text-light)] dark:text-[var(--text-black)] leading-relaxed max-w-2xl">
              FilmZone is built for real movie enthusiasts. We provide instant
              access to high-definition trailers, detailed showtime aggregation,
              real-time ticket availability, and an interactive moviegoer
              community—all through a seamless digital experience.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[var(--primary-red)] text-white font-bold text-sm shadow-lg shadow-[var(--primary-red)]/30 hover:shadow-xl hover:shadow-[var(--primary-red)]/50 hover:scale-[1.03] active:scale-95 transition-all duration-300"
              >
                <span>Explore Movies</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center py-6 sm:py-10 min-h-[320px] sm:min-h-[440px] lg:min-h-[500px]">
            <div className="absolute w-[270px] h-[270px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] rounded-full border border-[var(--primary-red)]/20 dark:border-[var(--primary-red)]/30 animate-orbit-cw pointer-events-none flex items-center justify-center">
              <div className="absolute -top-3 sm:-top-5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900 text-[var(--primary-red)] border border-neutral-200 dark:border-[var(--primary-red)]/40 shadow-lg backdrop-blur-md animate-counter-rotate">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="absolute -bottom-3 sm:-bottom-5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900 text-amber-500 border border-neutral-200 dark:border-amber-400/40 shadow-lg backdrop-blur-md animate-counter-rotate">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </div>

              <div className="absolute -right-3 sm:-right-5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white border border-neutral-200 dark:border-white/30 shadow-lg backdrop-blur-md animate-counter-rotate">
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="absolute -left-3 sm:-left-5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900 text-[var(--primary-red)] border border-neutral-200 dark:border-[var(--primary-red)]/40 shadow-lg backdrop-blur-md animate-counter-rotate">
                <Film className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="absolute w-[210px] h-[210px] sm:w-[300px] sm:h-[300px] lg:w-[360px] lg:h-[360px] rounded-full border-2 border-dashed border-[var(--primary-red)]/15 dark:border-[var(--primary-red)]/20 animate-orbit-ccw pointer-events-none" />

            <div className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[var(--primary-red)]/10 dark:bg-[var(--primary-red)]/40 blur-2xl top-6 sm:top-10 right-6 sm:right-10 animate-float-slow pointer-events-none" />
            <div className="absolute w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-amber-500/10 dark:bg-amber-500/30 blur-2xl bottom-6 sm:bottom-10 left-6 sm:left-10 animate-float-reverse pointer-events-none" />

            <div className="relative z-10 w-full flex flex-col items-center justify-center group">
              <div className="relative w-full flex items-center justify-center animate-hero-bounce">
                <img
                  src={cinemaImage}
                  alt="3D Cinema Graphic"
                  className="w-full h-auto max-h-[250px] sm:max-h-[380px] lg:max-h-[480px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_25px_45px_rgba(220,38,38,0.35)] transition-all duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbitCW {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbitCCW {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes counterRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes heroBounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.02); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(15px, -15px); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(-15px, 15px); }
        }

        .animate-orbit-cw {
          animation: orbitCW 20s linear infinite;
        }
        .animate-orbit-ccw {
          animation: orbitCCW 15s linear infinite;
        }
        .animate-counter-rotate {
          animation: counterRotate 20s linear infinite;
        }
        .animate-hero-bounce {
          animation: heroBounce 4.5s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: floatReverse 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}