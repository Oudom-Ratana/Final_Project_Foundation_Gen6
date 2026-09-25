import HomeHero from "../components/home/HomeHero";
import TrendingSection from "../components/home/TrendingSection";
import CinemaExperienceSection from "../components/home/CinemaExperienceSection";
import MovieCardStack from "../components/home/MovieCardStack";
import PopcornBarSection from "../components/home/PopcornBarSection";
import FeaturedSeriesSection from "../components/home/FeaturedSeriesSection";
import TrailerSpotlightSection from "../components/home/TrailerSpotlightSection";
import ComingSoonSection from "../components/home/ComingSoonSection";

export default function HomePage() {
  return (
    <div className="w-full font-sans overflow-x-hidden">
      {/* 1. Full-Width Trending Hero Slider */}
      <HomeHero />

      {/* 2. Cinema Highlights (Constrained to max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-24 mt-12 sm:mt-16">
        {/* Now Showing Movies */}
        <TrendingSection />

        {/* FilmZone Cinema Experience */}
        <CinemaExperienceSection />
      </div>

      {/* 3. Full-Width Edge-to-Edge 3D Premiere Blockbuster Showcase */}
      <div className="w-full my-16 sm:my-24">
        <MovieCardStack
          title="Spotlight Premiere Showcase"
          subtitle="Swipe or click through our featured blockbusters in interactive 3D fanned view"
          maxMovies={7}
        />
      </div>

      {/* 4. Concessions, Series, Trailers & Coming Soon (Constrained to max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-24 pb-24">
        {/* Concessions & Snack Combos */}
        <PopcornBarSection />

        {/* Featured Cinema Movies from Teacher API */}
        <FeaturedSeriesSection />

        {/* Official Video Trailer Spotlight */}
        <TrailerSpotlightSection />

        {/* Coming Soon Banners */}
        <ComingSoonSection />
      </div>
    </div>
  );
}
