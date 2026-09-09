import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import {
  useDiscoverMoviesQuery,
  useSearchMoviesQuery,
} from '../services/api/movieApi';
import MovieCard from '../components/home/MovieCard';
import MovieCardSkeleton from '../components/home/MovieCardSkeleton';
import ScrollReveal from '../components/common/ScrollReveal';
import StreamHero from '../components/stream/StreamHero';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function StreamPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [currentPage, setCurrentPage] = useState(pageParam);

  // Sync state with URL param
  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  // Fetch either search query or discover stream movies (16 items)
  const { data: discoverData, isLoading: isDiscoverLoading } =
    useDiscoverMoviesQuery(
      { page: currentPage, sort_by: 'popularity.desc' },
      { skip: Boolean(queryParam) }
    );

  const { data: searchData, isLoading: isSearchLoading } = useSearchMoviesQuery(
    { query: queryParam, page: currentPage },
    { skip: !queryParam }
  );

  const isLoading = queryParam ? isSearchLoading : isDiscoverLoading;
  const rawMovies = queryParam ? searchData : discoverData;
  const movies = rawMovies ? rawMovies.slice(0, 16) : [];

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > 12) return;
    setCurrentPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleHeroSearch = (term) => {
    const newParams = new URLSearchParams();
    if (term) newParams.set('q', term);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="w-full space-y-12 pb-20 font-sans">
      {/* 1. Featured Stream Hero Banner with Search & Favourite Button */}
      <StreamHero onSearch={handleHeroSearch} />

      {/* 2. Free Movies Section */}
      <section className="space-y-8">
        {/* Section Header with Red Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="w-1.5 h-7 rounded-full inline-block"
              style={{ backgroundColor: '#B90101' }}
            />
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
              {queryParam ? `Search Results for "${queryParam}"` : 'Free Movies here'}
            </h2>
          </div>

          {queryParam && (
            <button
              onClick={() => {
                setSearchParams({});
              }}
              className="text-sm font-bold text-[#B90101] hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* 3. 4-Column × 4-Row Responsive Grid (16 Cards or 16 Skeletons) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading || movies.length === 0
            ? Array.from({ length: 16 }).map((_, index) => (
                <MovieCardSkeleton key={`stream-skeleton-${index}`} />
              ))
            : movies.map((movie, index) => (
                <ScrollReveal
                  key={movie.id || index}
                  delay={(index % 4) * 80}
                  duration={700}
                  distance="translate-y-10"
                >
                  <MovieCard movie={movie} />
                </ScrollReveal>
              ))}
        </div>

        {/* 4. Pagination Bar (< 1 2 3 ... 12 >) */}
        <div className="flex items-center justify-center gap-2 pt-8 select-none">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-white hover:bg-[#B90101] disabled:opacity-30 disabled:pointer-events-none transition"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4].map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => handlePageChange(pageNumber)}
              className={`w-10 h-10 rounded-full font-black text-sm flex items-center justify-center transition-all ${
                currentPage === pageNumber
                  ? 'bg-[#B90101] text-white shadow-md'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <span className="text-neutral-400 px-1 font-bold">...</span>

          <button
            type="button"
            onClick={() => handlePageChange(12)}
            className={`w-10 h-10 rounded-full font-black text-sm flex items-center justify-center transition-all ${
              currentPage === 12
                ? 'bg-[#B90101] text-white shadow-md'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            12
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= 12}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-neutral-300 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-white hover:bg-[#B90101] disabled:opacity-30 disabled:pointer-events-none transition"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
