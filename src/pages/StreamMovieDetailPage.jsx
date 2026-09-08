import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Play,
  FileText,
  Clock,
  Calendar,
  ShieldAlert,
  Heart,
  Edit3,
  Film,
  BookOpen,
  Clapperboard,
} from 'lucide-react';
import {
  useGetMovieDetailsQuery,
  useGetMovieTrailersQuery,
} from '../services/api/movieApi';
import { useGetTVDetailsQuery } from '../services/api/tvApi';
import StreamPlayerModal from '../components/stream/StreamPlayerModal';
import SpidermanLoader from '../components/common/SpidermanLoader';

/**
 * StreamMovieDetailPage
 * Free Online Streaming & Trailer Detail View (/stream/:id)
 * Features:
 * - Watch Trailer (YouTube) & Full Movie (VidSrc PM)
 * - Episode Picker [1 - 8]
 * - 5 Glassmorphic Cast & Crew cards
 */
export default function StreamMovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Try fetching movie details first
  const {
    data: movieData,
    isLoading: isMovieLoading,
    isError: isMovieError,
  } = useGetMovieDetailsQuery(id);

  // If movie details fails or if it is a TV series, fetch TV details
  const {
    data: tvData,
    isLoading: isTVLoading,
  } = useGetTVDetailsQuery(id, { skip: !isMovieError && Boolean(movieData) });

  const { data: trailers } = useGetMovieTrailersQuery(id);

  const [isFavourite, setIsFavourite] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerMode, setPlayerMode] = useState('full_movie'); // 'full_movie' | 'trailer'

  const data = movieData || tvData;
  const isTV = Boolean(tvData && !movieData);
  const isLoading = isMovieLoading || (isMovieError && isTVLoading);

  if (isLoading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <SpidermanLoader size="lg" text="LOADING STREAM DETAILS..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full py-20 text-center space-y-4">
        <h2 className="text-3xl font-black text-[#B90101]">Movie Not Found</h2>
        <p className="text-neutral-400">The requested stream movie could not be loaded from TMDB.</p>
        <button
          onClick={() => navigate('/stream')}
          className="px-6 py-2.5 rounded-full bg-[#B90101] text-white font-bold"
        >
          Back to Stream
        </button>
      </div>
    );
  }

  // Extract movie/TV metadata
  const title = data.title || data.name || 'Untitled';
  const genres = data.genres?.map((g) => g.name).join(', ') || 'Action, Adventure, Drama';
  const duration = data.runtime
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}min`
    : data.episode_run_time?.[0]
    ? `${data.episode_run_time[0]}min`
    : '2h 15min';

  const rawDate = data.release_date || data.first_air_date || '2026-07-30';
  const releaseDate = new Date(rawDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const classification = data.adult ? 'R18+' : 'NC15';
  const backdropUrl = data.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : data.poster_path
    ? `https://image.tmdb.org/t/p/original${data.poster_path}`
    : '';

  const posterUrl = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : backdropUrl;

  const trailerKey = trailers?.[0]?.key || data.videos?.results?.[0]?.key;
  const totalEpisodes = data.number_of_episodes || 8;

  // Extract Cast & Crew for 5 Glass Cards
  const crewList = data.credits?.crew || [];
  const castList = data.credits?.cast || [];

  const writer =
    crewList.find((c) => c.job === 'Screenplay' || c.job === 'Writer')?.name ||
    'George R. R. Martin';
  const producer =
    crewList.find((c) => c.job === 'Producer' || c.job === 'Executive Producer')?.name ||
    'D. B. Weiss';
  const creator =
    data.created_by?.[0]?.name ||
    crewList.find((c) => c.job === 'Story' || c.job === 'Creator')?.name ||
    'David Friedman';
  const director =
    crewList.find((c) => c.job === 'Director')?.name || 'Alan Taylor';
  const secondaryDirector =
    crewList.filter((c) => c.job === 'Director')?.[1]?.name ||
    castList?.[0]?.name ||
    'Alex Graves';

  const crewCards = [
    { name: writer, role: 'Writer', icon: Edit3 },
    { name: producer, role: 'Producer', icon: Film },
    { name: creator, role: 'Created by', icon: BookOpen },
    { name: director, role: 'Director', icon: Clapperboard },
    { name: secondaryDirector, role: 'Director', icon: Edit3 },
  ];

  const handleOpenTrailer = () => {
    setPlayerMode('trailer');
    setIsPlayerOpen(true);
  };

  const handleOpenFullMovie = (ep = selectedEpisode) => {
    setSelectedEpisode(ep);
    setPlayerMode('full_movie');
    setIsPlayerOpen(true);
  };

  return (
    <div className="relative w-full -mt-6 sm:-mt-8 pb-20 font-sans select-none">
      {/* 1. Atmospheric Backdrop Background Layer */}
      <div className="absolute inset-0 -top-24 z-0 pointer-events-none overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-[650px] object-cover object-center filter blur-xs opacity-25 dark:opacity-35 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F6F7F9] dark:from-[#080203] via-[#F6F7F9]/80 dark:via-[#080203]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6F7F9] dark:from-[#080203] via-transparent to-[#F6F7F9] dark:to-[#080203]" />
      </div>

      <div className="relative z-10 space-y-12 pt-6">
        {/* 2. Top Navigation (Red Circular Back Button) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/stream')}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#B90101] text-white flex items-center justify-center shadow-lg shadow-red-950/50 hover:brightness-110 active:scale-95 transition"
            aria-label="Back to Stream"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* 3. Main Detail Grid (Poster on Left + Metadata & Video Controls on Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Large Movie Poster Card */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-start">
            <div className="relative aspect-[2/3] w-full max-w-[340px] rounded-[25px] overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-200/80 dark:border-white/15">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Title, Metadata, Action Buttons & Episode Picker */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">
              {title}
            </h1>

            {/* Metadata List with Red Outline Icons */}
            <div className="space-y-3 pt-1 text-sm sm:text-base font-semibold text-neutral-700 dark:text-neutral-200">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#B90101] shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">Genre:</strong> {genres}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#B90101] shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">Duration:</strong> {duration}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#B90101] shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">Release:</strong> {releaseDate}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#B90101] shrink-0" />
                <span>
                  <strong className="text-neutral-900 dark:text-white">Classification:</strong> {classification}
                </span>
              </div>

              {/* Clickable Favourite Button */}
              <button
                type="button"
                onClick={() => setIsFavourite(!isFavourite)}
                className="flex items-center gap-3 text-neutral-700 dark:text-neutral-200 hover:text-[#B90101] transition"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavourite
                      ? 'fill-[#B90101] text-[#B90101]'
                      : 'text-[#B90101]'
                  }`}
                />
                <span className="font-bold">Favourite</span>
              </button>
            </div>

            {/* Action Buttons: Watch Trailer & Full Movie */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              {/* Watch Trailer Button (Red Pill) */}
              <button
                type="button"
                onClick={handleOpenTrailer}
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-full text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-950/50 hover:brightness-110 active:scale-95 transition"
                style={{ backgroundColor: '#B90101' }}
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Trailer</span>
              </button>

              {/* Full Movie Button (Glassmorphic Pill) */}
              <button
                type="button"
                onClick={() => handleOpenFullMovie(1)}
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-neutral-300 dark:border-white/20 bg-white/40 dark:bg-white/10 backdrop-blur-md text-neutral-900 dark:text-white font-bold text-sm uppercase tracking-wider hover:bg-white/60 dark:hover:bg-white/20 active:scale-95 transition shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Full Movie</span>
              </button>
            </div>

            {/* Episode Selector (Figma Golden Buttons) */}
            <div className="space-y-3 pt-4">
              <div className="space-y-0.5">
                <h3 className="text-xl font-black text-neutral-900 dark:text-white">
                  Episode
                </h3>
                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  Total {totalEpisodes}
                </p>
              </div>

              {/* Numbered Episode Buttons in Golden Border (1 to 8) */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {Array.from({ length: Math.min(totalEpisodes, 8) }, (_, idx) => idx + 1).map(
                  (epNumber) => {
                    const isSelected = selectedEpisode === epNumber;
                    return (
                      <button
                        key={epNumber}
                        type="button"
                        onClick={() => handleOpenFullMovie(epNumber)}
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl font-black text-base sm:text-lg flex items-center justify-center transition-all border ${
                          isSelected
                            ? 'bg-[#B90101] text-white border-[#B90101] shadow-lg shadow-red-950/50 scale-105'
                            : 'bg-transparent text-[#EAB308] border-[#EAB308] hover:bg-[#EAB308]/10'
                        }`}
                      >
                        {epNumber}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Row: 5 Glassmorphic Cast & Crew Cards */}
        <div className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {crewCards.map((crew, index) => {
              const IconComp = crew.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200/80 dark:border-white/15 bg-white/70 dark:bg-black/40 backdrop-blur-md p-4 sm:p-5 text-center flex flex-col items-center justify-center gap-2 shadow-sm dark:shadow-xl hover:scale-105 transition-transform"
                >
                  {/* Red Circle Icon */}
                  <div className="w-10 h-10 rounded-full bg-[#B90101] flex items-center justify-center text-white shadow-md">
                    <IconComp className="w-5 h-5" />
                  </div>
                  {/* Name & Role */}
                  <div className="space-y-0.5">
                    <h4 className="font-black text-sm sm:text-base text-neutral-900 dark:text-white line-clamp-1">
                      {crew.name}
                    </h4>
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      {crew.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Stream Video Player Modal (VidSrc PM + TMDB YouTube Trailer) */}
      <StreamPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        tmdbId={id}
        mediaType={isTV ? 'tv' : 'movie'}
        title={title}
        trailerKey={trailerKey}
        initialMode={playerMode}
        season={1}
        episode={selectedEpisode}
        totalEpisodes={totalEpisodes}
        onEpisodeChange={(ep) => setSelectedEpisode(ep)}
      />
    </div>
  );
}

