 
 import { Link } from 'react-router';
import { ArrowRight, Film, Sparkles } from 'lucide-react';
import cinemaImage from '../../assets/image.png';

export default function AboutHero() {
  return (
    <section className="relative w-full py-8 md:py-12 overflow-hidden font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Mission & Explore CTA */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
            About{' '}
            <span style={{ color: '#B90101' }} className="drop-shadow-sm">
              FilmZone
            </span>
          </h1>

          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-snug">
            Bringing movie lovers closer to the world of cinema.
          </h2>

          <p className="text-[18px] text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
            DigiFilm is a digital cinema platform designed to make discovering movies, exploring showtimes, and connecting with the cinema experience easier and more enjoyable.
          </p>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-white font-black text-[18px] shadow-xl shadow-red-950/40 hover:brightness-110 active:scale-95 transition-all"
              style={{ backgroundColor: '#B90101' }}
            >
              <span>Explore movies</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Cinema Composition */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <div className="absolute w-72 h-72 rounded-full bg-[#B90101]/20 blur-3xl -z-10 pointer-events-none" />

          <div className="relative w-full max-w-md aspect-square rounded-3xl p-4 flex flex-col items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={cinemaImage}
                alt="Cinema 3D Popcorn & Experience"
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: '#B90101' }}
                  >
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-neutral-900 dark:text-white text-sm">
                      Next-Gen Cinema
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      IMAX 3D & Free Streaming
                    </p>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}