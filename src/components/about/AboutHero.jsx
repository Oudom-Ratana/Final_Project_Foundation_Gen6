
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import cinemaImage from '../../assets/others/imageAboutUs.png';

export default function AboutHero() {
  return (
    <section className="relative w-full py-8 md:py-12 overflow-hidden font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Mission & Explore CTA */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-h1 text-neutral-900 dark:text-white font-bold tracking-tight leading-tight">
            About{' '}
            <span className="text-primary-red drop-shadow-sm">
              FilmZone
            </span>
          </h1>

          <h2 className="text-h2 text-neutral-900 dark:text-white font-bold leading-snug">
            Bringing movie lovers closer to the world of cinema.
          </h2>

          <p className="text-card-description text-[#828282] dark:text-[rgba(255,255,255,0.7)] leading-relaxed max-w-xl">
            FilmZone is a digital cinema platform designed to make discovering movies, exploring showtimes, and connecting with the cinema experience easier and more enjoyable.
          </p>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-primary-red text-white font-bold text-btn hover:bg-primary-dark active:scale-95 transition-all"
            >
              <span>Explore movies</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Cinema Composition */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          {/* Increased background glow size */}
          <div className="absolute w-96 h-96 rounded-full bg-primary-red/20 blur-3xl -z-10 pointer-events-none" />

          {/* Increased max-width from max-w-md to max-w-xl and removed strict padding */}
          <div className="relative w-full max-w-xl rounded-3xl flex flex-col items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={cinemaImage}
                alt="Cinema 3D Popcorn & Experience"
                className="w-full h-auto max-h-[500px] object-contain filter drop-shadow-2xl"
                style={{
                  animation: 'floatImage 3s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes floatImage {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-16px);
          }
        }
      `}</style>
    </section>
  );
}