import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FileText, Clock, Calendar, ShieldAlert } from "lucide-react";
import { useGetMovieDetailsQuery } from "../services/api/movieApi";
import ShowtimeSection from "../components/booking/ShowtimeSection";
import BookingTypeModal from "../components/booking/BookingTypeModal";
import SpidermanLoader from "../components/common/SpidermanLoader";

/**
 * MovieDetailPage
 * Cinema Ticket Booking Detail Page (/movies/:id)
 * Features:
 * - Large 25px poster & atmospheric backdrop
 * - Live TMDB metadata (Genre, Duration, Release, Classification)
 * - 3-Column Cast & Crew layout (Characters, Writers, Directors)
 * - Showtime Schedule Section (Locations, Date picker, Branch cards, Showtime pills)
 * - "How are you watching today?" Modal (Standard Booking vs Group Booking)
 */
export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch movie details from TMDB
  const { data: movie, isLoading, isError } = useGetMovieDetailsQuery(id);

  const [selectedSession, setSelectedSession] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <SpidermanLoader size="lg" text="LOADING MOVIE DETAILS..." />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="w-full py-20 text-center space-y-4">
        <h2 className="text-3xl font-black text-[#B90101]">Movie Not Found</h2>
        <p className="text-neutral-400">
          The requested movie could not be loaded from TMDB.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-full bg-[#B90101] text-white font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Extract 100% real movie metadata from TMDB API
  const title = movie.title || movie.original_title || "Untitled Movie";
  const genres =
    movie.genres && movie.genres.length > 0
      ? movie.genres.map((g) => g.name).join(", ")
      : "Genre unavailable";

  const duration =
    movie.runtime && movie.runtime > 0
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`
      : "Duration unavailable";

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Release date unavailable";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : "";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : backdropUrl || "/placeholder-poster.png";

  // Extract 100% real Cast & Crew from TMDB credits
  const castList = movie.credits?.cast || [];
  const crewList = movie.credits?.crew || [];

  // 1. Real Directors
  const directors = crewList
    .filter((c) => c.job === "Director")
    .map((c) => ({ name: c.name, role: "Director" }));

  // 2. Real Writers & Creators
  const creators = crewList
    .filter(
      (c) =>
        c.job === "Characters" ||
        c.job === "Comic Book" ||
        c.job === "Novel" ||
        c.job === "Original Story",
    )
    .map((c) => ({ name: c.name, role: "Characters" }));

  const writers = crewList
    .filter(
      (c) =>
        c.job === "Screenplay" ||
        c.job === "Writer" ||
        c.job === "Story" ||
        c.job === "Author",
    )
    .map((c) => ({ name: c.name, role: "Writer" }));

  // 3. Real Lead Cast (Actors)
  const topActors = castList.slice(0, 12).map((actor) => ({
    id: actor.id,
    name: actor.name,
    character: actor.character || "Actor",
    profilePath: actor.profile_path
      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
      : null,
  }));

  // Build the 3-Column Key Contributors list dynamically from real API data
  const keyContributors = [];
  const seenNames = new Set();

  const addPerson = (person) => {
    if (person?.name && !seenNames.has(person.name)) {
      seenNames.add(person.name);
      keyContributors.push(person);
    }
  };

  // Add real key figures in order: Directors -> Creators -> Writers -> Lead Actors
  directors.forEach(addPerson);
  creators.forEach(addPerson);
  writers.forEach(addPerson);
  topActors.forEach((actor) => {
    addPerson({
      name: actor.name,
      role: actor.character ? actor.character : "Cast",
    });
  });

  // Up to 6 real contributors for the 3 columns (2 rows each)
  const heroPeople = keyContributors.slice(0, 6);

  const handleShowtimeSelect = (sessionData) => {
    setSelectedSession({
      ...sessionData,
      movieId: movie.id,
      movieTitle: title,
    });
    setIsBookingModalOpen(true);
  };

  return (
    <div className="relative w-full pb-24 font-sans select-none space-y-12">
      {/* 1. Cinematic Dark Hero Banner matching exact reference design */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800/80 shadow-2xl min-h-[460px]">
        {/* Atmospheric Backdrop Poster Image Layer */}
        {backdropUrl && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover object-center opacity-70 sm:opacity-80 scale-105 transition-opacity duration-700"
            />
            {/* Cinematic Gradient Overlays: keeps background poster clearly visible while maintaining text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
          </div>
        )}

        {/* Hero Content Grid */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Movie Poster with Rounded 25px Corners */}
            <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
              <div className="relative aspect-[2/3] w-full max-w-[280px] sm:max-w-[320px] rounded-[25px] overflow-hidden shadow-2xl bg-neutral-900 border border-white/10">
                <img
                  src={posterUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: Movie Title, Real Metadata, and Real Cast/Crew Grid */}
            <div className="md:col-span-7 lg:col-span-8 space-y-6 pt-2">
              {/* Real Movie Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {title}
              </h1>

              {/* Real Metadata List with Red Outline Icons */}
              <div className="space-y-2.5 pt-1 text-sm sm:text-base text-neutral-300 font-medium">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#B90101] shrink-0" />
                  <span>
                    Genre:{" "}
                    <span className="text-white font-semibold">{genres}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#B90101] shrink-0" />
                  <span>
                    Duration:{" "}
                    <span className="text-white font-semibold">{duration}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#B90101] shrink-0" />
                  <span>
                    Release:{" "}
                    <span className="text-white font-bold">{releaseDate}</span>
                  </span>
                </div>
              </div>

              {/* 3-Column Real Contributors Grid (Directors, Writers, Lead Actors) */}
              {heroPeople.length > 0 && (
                <div className="pt-6 sm:pt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-8 sm:gap-x-12 lg:gap-x-16 gap-y-6">
                  {heroPeople.map((person, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <h4 className="font-bold text-sm sm:text-base text-white leading-tight line-clamp-1">
                        {person.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-400 font-medium line-clamp-1">
                        {person.role}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Cast (Actors) Section with Real Profile Photos from TMDB */}
      {topActors.length > 0 && (
        <div className="max-w-6xl mx-auto px-2 sm:px-4 space-y-5">
          <div className="flex items-center gap-3">
            <span
              className="w-1.5 h-7 rounded-full inline-block"
              style={{ backgroundColor: "#B90101" }}
            />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
              Top Cast
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 select-none scrollbar-thin">
            {topActors.map((actor) => (
              <div
                key={actor.id}
                className="min-w-[110px] max-w-[110px] sm:min-w-[130px] sm:max-w-[130px] flex flex-col items-center text-center space-y-2 group shrink-0"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-neutral-800 border-2 border-neutral-300 dark:border-white/15 shadow-md group-hover:border-[#B90101] transition-all">
                  {actor.profilePath ? (
                    <img
                      src={actor.profilePath}
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 font-black text-xl">
                      {actor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                    {actor.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {actor.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Showtime Section (Locations, Date Selector, Branch Cards) */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <ShowtimeSection onSelectShowtime={handleShowtimeSelect} />
      </div>

      {/* 4. "How are you watching today?" Modal */}
      <BookingTypeModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        session={selectedSession}
        onSelectBookingType={(type) => {
          console.log("Selected booking type:", type, selectedSession);
        }}
      />
    </div>
  );
}
