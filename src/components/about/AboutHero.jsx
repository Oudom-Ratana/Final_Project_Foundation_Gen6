
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Sparkles, Play, Film, Ticket, Star, Video } from 'lucide-react';
import cinemaImage from '../../assets/others/imageAboutUs.png';

export default function AboutHero() {
  const fullText = "Welcome to FilmZone";
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typing effect implementation
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        setIsTypingComplete(true); // Hide cursor when finished
        clearInterval(typingInterval);
      }
    }, 150); // Speed per letter

    return () => clearInterval(typingInterval);
  }, []);

  // Split displayed text to apply styling specifically to "FilmZone"
  const welcomePart = displayedText.slice(0, 11); // "Welcome to "
  const filmZonePart = displayedText.slice(11);   // "FilmZone"

  return (
    <section className="relative w-full py-12 lg:py-20 overflow-hidden font-sans">
      
      {/* Dark mode extra ambient glow */}
      <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[var(--primary-red)]/20 rounded-full blur-[180px] pointer-events-none z-0 animate-pulse" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Vision, Content & CTA */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-red)]/10 border border-[var(--primary-red)]/20 text-[var(--primary-red)] font-semibold text-xs uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Redefining The Theatrical Journey</span>
            </div>

            {/* Headline with Typing Effect */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.1] min-h-[1.2em]">
              {welcomePart}
              {filmZonePart && (
                <span className="text-[var(--primary-red)]">
                  {filmZonePart}
                </span>
              )}
              {/* Typing Cursor (Disappears when complete) */}
              {!isTypingComplete && (
                <span className="inline-block ml-1 w-[3px] h-[0.8em] bg-[var(--primary-red)] animate-pulse align-middle" />
              )}
            </h1>

            {/* Subheading */}
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-200 leading-snug">
              Bridging cutting-edge technology with the pure emotion of storytelling.
            </h2>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-[var(--text-light)] dark:text-[var(--text-black)] leading-relaxed max-w-2xl">
              FilmZone is built for real movie enthusiasts. We provide instant access to high-definition trailers, detailed showtime aggregation, real-time ticket availability, and an interactive moviegoer community—all through a seamless digital experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--primary-red)] text-white font-bold text-sm shadow-lg shadow-[var(--primary-red)]/30 hover:shadow-xl hover:shadow-[var(--primary-red)]/50 hover:scale-[1.03] active:scale-95 transition-all duration-300"
              >
                <span>Explore Movies</span>
                <ArrowRight className="w-5 h-5" />
              </Link>


              {/* <a
                href="#team-section"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white dark:bg-white/10 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/20 font-semibold text-sm transition-all border border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)] shadow-sm dark:shadow-none"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Meet Our Team</span>
              </a> */}
            </div>

          </div>

          {/* Right Column: Motion Hero Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-10 min-h-[500px]">
            
            {/* Outer Orbit Ring 1 (Clockwise Rotation) */}
            <div className="absolute w-[440px] h-[440px] rounded-full border border-[var(--primary-red)]/20 dark:border-[var(--primary-red)]/30 animate-orbit-cw pointer-events-none flex items-center justify-center">
              
              {/* Floating Orbit Icons */}
              <div className="absolute -top-5 p-3 rounded-2xl bg-white dark:bg-neutral-900 text-[var(--primary-red)] border border-neutral-200 dark:border-[var(--primary-red)]/40 shadow-lg backdrop-blur-md animate-counter-rotate">
                <Ticket className="w-5 h-5" />
              </div>

              <div className="absolute -bottom-5 p-3 rounded-2xl bg-white dark:bg-neutral-900 text-amber-500 border border-neutral-200 dark:border-amber-400/40 shadow-lg backdrop-blur-md animate-counter-rotate">
                <Star className="w-5 h-5 fill-current" />
              </div>

              <div className="absolute -right-5 p-3 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white border border-neutral-200 dark:border-white/30 shadow-lg backdrop-blur-md animate-counter-rotate">
                <Video className="w-5 h-5" />
              </div>

              <div className="absolute -left-5 p-3 rounded-2xl bg-white dark:bg-neutral-900 text-[var(--primary-red)] border border-neutral-200 dark:border-[var(--primary-red)]/40 shadow-lg backdrop-blur-md animate-counter-rotate">
                <Film className="w-5 h-5" />
              </div>
            </div>

            {/* Inner Orbit Ring 2 (Counter-Clockwise Rotation) */}
            <div className="absolute w-[360px] h-[360px] rounded-full border-2 border-dashed border-[var(--primary-red)]/15 dark:border-[var(--primary-red)]/20 animate-orbit-ccw pointer-events-none" />

            {/* Subtle Ambient Soft Lights */}
            <div className="absolute w-28 h-28 rounded-full bg-[var(--primary-red)]/10 dark:bg-[var(--primary-red)]/40 blur-2xl top-10 right-10 animate-float-slow pointer-events-none" />
            <div className="absolute w-24 h-24 rounded-full bg-amber-500/10 dark:bg-amber-500/30 blur-2xl bottom-10 left-10 animate-float-reverse pointer-events-none" />

            {/* Center Cinema Graphic */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center group">
              <div className="relative w-full flex items-center justify-center animate-hero-bounce">
                <img
                  src={cinemaImage}
                  alt="3D Cinema Graphic"
                  className="w-full h-auto max-h-[480px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_25px_45px_rgba(220,38,38,0.35)] transition-all duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Keyframe Animations */}
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
