
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Play } from 'lucide-react';
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
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

  const welcomePart = displayedText.slice(0, 11);
  const filmZonePart = displayedText.slice(11);

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

              <a
                href="#team-section"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white dark:bg-white/10 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/20 font-semibold text-sm transition-all border border-[var(--border-light-mode)] dark:border-[var(--border-dark-mode)] shadow-sm dark:shadow-none"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Meet Our Team</span>
              </a>
            </div>

          </div>

          {/* Right Column: Alive 3D Cinema Stage */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-6 min-h-[520px]">
            
            {/* 1. Volumetric Spotlight Godray Behind the Stage */}
            <div className="absolute w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,_var(--primary-red)_0%,_transparent_70%)] opacity-35 blur-3xl pointer-events-none animate-spotlight-pulse" />
            <div className="absolute top-1/4 right-8 w-48 h-48 rounded-full bg-[radial-gradient(circle,_#f59e0b_0%,_transparent_70%)] opacity-25 blur-2xl pointer-events-none animate-float-slow" />

            {/* 2. Interactive Stage Container with Smooth 3D Levitation */}
            <div className="relative w-full max-w-[500px] flex items-center justify-center animate-stage-float">
              
              {/* Photorealistic 3D Render Image */}
              <img
                src={cinemaImage}
                alt="3D Cinema Experience"
                className="w-full h-auto max-h-[480px] object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)] dark:drop-shadow-[0_30px_50px_rgba(220,38,38,0.35)] relative z-10"
              />

              {/* 3. Real 3D Glasses Glowing Anamorphic Lens Flare */}
              <div className="absolute bottom-[24%] left-[43%] -translate-x-1/2 w-14 h-7 rounded-full bg-cyan-400/50 blur-md pointer-events-none z-20 animate-lens-cyan" />
              <div className="absolute bottom-[24%] left-[55%] -translate-x-1/2 w-14 h-7 rounded-full bg-red-500/55 blur-md pointer-events-none z-20 animate-lens-red" />

              {/* 4. Alive Realistic Floating Popcorn Kernels */}
              {/* Popping Kernel 1 */}
              <div className="absolute top-[34%] left-[45%] w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.6)] z-20 animate-popcorn-pop-1 pointer-events-none" />
              {/* Popping Kernel 2 */}
              <div className="absolute top-[32%] left-[53%] w-4 h-4 rounded-full bg-gradient-to-tr from-amber-300 via-amber-100 to-white shadow-[0_0_12px_rgba(251,191,36,0.7)] z-20 animate-popcorn-pop-2 pointer-events-none" />
              {/* Popping Kernel 3 */}
              <div className="absolute top-[40%] left-[39%] w-3 h-3 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-100 shadow-[0_0_8px_rgba(251,191,36,0.5)] z-20 animate-popcorn-pop-3 pointer-events-none" />

              {/* 5. Golden Cinema Sparkles / Projector Dust Moters */}
              <div className="absolute top-[20%] left-[30%] w-1.5 h-1.5 rounded-full bg-amber-300/80 blur-[0.5px] animate-dust-1 pointer-events-none" />
              <div className="absolute top-[25%] right-[22%] w-2 h-2 rounded-full bg-amber-200/90 blur-[0.5px] animate-dust-2 pointer-events-none" />
              <div className="absolute bottom-[35%] right-[15%] w-1.5 h-1.5 rounded-full bg-red-400/80 blur-[0.5px] animate-dust-1 pointer-events-none" />

            </div>

          </div>

        </div>
      </div>

      {/* Cinematic Organic Animations */}
      <style>{`
        /* Smooth Natural Stage Breathing & Float */
        @keyframes stageFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-0.5deg);
          }
        }
        .animate-stage-float {
          animation: stageFloat 5s ease-in-out infinite;
        }

        /* Ambient Spotlight Breathing */
        @keyframes spotlightPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.1); }
        }
        .animate-spotlight-pulse {
          animation: spotlightPulse 4s ease-in-out infinite;
        }

        /* 3D Glasses Cyan Lens Glow */
        @keyframes lensCyan {
          0%, 100% { opacity: 0.45; transform: translate(-50%, 0) scale(1); }
          50% { opacity: 0.85; transform: translate(-50%, -2px) scale(1.15); }
        }
        .animate-lens-cyan {
          animation: lensCyan 3s ease-in-out infinite;
        }

        /* 3D Glasses Red Lens Glow */
        @keyframes lensRed {
          0%, 100% { opacity: 0.5; transform: translate(-50%, 0) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -2px) scale(1.15); }
        }
        .animate-lens-red {
          animation: lensRed 3s ease-in-out infinite 0.4s;
        }

        /* Real Popcorn Popping Motion */
        @keyframes popcornPop1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          30% { opacity: 1; }
          50% { transform: translate(-14px, -24px) rotate(-45deg); opacity: 0.9; }
          80% { opacity: 0; }
        }
        .animate-popcorn-pop-1 {
          animation: popcornPop1 3.4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }

        @keyframes popcornPop2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: translate(18px, -32px) rotate(60deg); opacity: 0.95; }
          80% { opacity: 0; }
        }
        .animate-popcorn-pop-2 {
          animation: popcornPop2 4s cubic-bezier(0.25, 1, 0.5, 1) infinite 1s;
        }

        @keyframes popcornPop3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          35% { opacity: 1; }
          50% { transform: translate(-8px, -18px) rotate(-20deg); opacity: 0.85; }
          75% { opacity: 0; }
        }
        .animate-popcorn-pop-3 {
          animation: popcornPop3 3s cubic-bezier(0.25, 1, 0.5, 1) infinite 1.8s;
        }

        /* Projector Dust Moters */
        @keyframes dustMote1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(12px, -18px); opacity: 0.8; }
        }
        .animate-dust-1 {
          animation: dustMote1 6s ease-in-out infinite;
        }

        @keyframes dustMote2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(-15px, -15px); opacity: 0.9; }
        }
        .animate-dust-2 {
          animation: dustMote2 5s ease-in-out infinite 1s;
        }
      `}</style>
    </section>
  );
}