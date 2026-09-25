import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { Heart, LogIn, Film } from "lucide-react";
import { toast } from "react-toastify";
import FavouriteMovieCard from "../components/favourite/FavouriteMovieCard";
import {
  removeFromFavourite,
  setFavouriteMovies,
} from "../redux/slices/favouriteSlice";
import {
  useGetMyFavoritesQuery,
  useToggleFavoriteMutation,
} from "../services/api/authApi";
import { useGetCinemaMoviesQuery } from "../services/api/cinemaApi";

export default function FavouritePage() {
  const dispatch = useDispatch();

  // Authentication check: Read JWT token
  const token =
    useSelector((state) => state.auth?.accessToken || state.auth?.token) ||
    sessionStorage.getItem("accessToken");

  // 1. Fetch Teacher's API Favorites (always refetch fresh for current user)
  const {
    data: teacherFavoritesData,
    isLoading: isFavoritesLoading,
    isFetching: isFavoritesFetching,
  } = useGetMyFavoritesQuery(
    { page: 0, size: 50 },
    { skip: !token, refetchOnMountOrArgChange: true },
  );

  // 2. Fetch Cinema Movies to enrich details (overview, runtime, genre, etc.)
  const { data: cinemaMoviesData, isLoading: isCinemaLoading } =
    useGetCinemaMoviesQuery({ page: 0, size: 100 });

  // 3. Teacher's Toggle Mutation (PATCH /api/v1/users/me/favorites/{movieUuid})
  const [toggleFavorite] = useToggleFavoriteMutation();

  // Cinema lookup map by UUID
  const cinemaMap = useMemo(() => {
    const map = new Map();
    if (cinemaMoviesData?.content && Array.isArray(cinemaMoviesData.content)) {
      cinemaMoviesData.content.forEach((movie) => {
        if (movie.uuid) map.set(movie.uuid, movie);
      });
    }
    return map;
  }, [cinemaMoviesData]);

  // Combine and format Teacher's Favorites
  const formattedFavorites = useMemo(() => {
    if (!token) return [];

    const rawList = teacherFavoritesData?.content;
    if (!Array.isArray(rawList)) return [];

    return rawList.map((fav) => {
      const cinemaMovie = cinemaMap.get(fav.movieUuid) || {};

      // Determine poster image
      let posterUrl =
        fav.posterPath ||
        cinemaMovie.posterUrl ||
        cinemaMovie.poster_path ||
        "";
      if (posterUrl && !posterUrl.startsWith("http")) {
        posterUrl = `https://image.tmdb.org/t/p/w500${posterUrl}`;
      }

      // Format duration
      const runtimeMinutes = cinemaMovie.runtimeMinutes || cinemaMovie.runtime;
      const duration = runtimeMinutes
        ? `${Math.floor(runtimeMinutes / 60)}h ${runtimeMinutes % 60}m`
        : "2h 00m";

      // Format release year
      const releaseDate = fav.releaseDate || cinemaMovie.releaseDate || "";
      const year = releaseDate ? releaseDate.slice(0, 4) : "2026";

      // Genre resolution
      const genre =
        cinemaMovie.genres?.[0]?.name || cinemaMovie.genre || "Cinema";

      return {
        id: fav.movieUuid,
        uuid: fav.movieUuid,
        favoriteUuid: fav.uuid,
        title: fav.title || cinemaMovie.title || "Cinema Movie",
        posterUrl,
        duration,
        year,
        genre,
        description:
          cinemaMovie.overview ||
          "Experience this thrilling movie at FilmZone cinema halls. Check showtimes and reserve your seats now.",
        isCinema: true,
        isTV: false,
      };
    });
  }, [teacherFavoritesData, cinemaMap, token]);

  // Sync Teacher's API favorites into Redux so that Navbar badges stay synchronized
  useEffect(() => {
    if (token && Array.isArray(teacherFavoritesData?.content)) {
      dispatch(setFavouriteMovies(formattedFavorites));
    }
  }, [formattedFavorites, token, teacherFavoritesData, dispatch]);

  // Handle remove favorite
  const handleRemove = async (movieUuid, movieTitle) => {
    dispatch(removeFromFavourite(movieUuid));
    try {
      await toggleFavorite(movieUuid).unwrap();
      toast.info(`"${movieTitle || "Movie"}" removed from favourites`);
    } catch (err) {
      console.error("Failed to remove favorite from Teacher API:", err);
      toast.error("Could not remove favorite. Please try again.");
    }
  };

  // State 1: Unauthenticated
  if (!token) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-[#B90101]/10 flex items-center justify-center">
          <Heart className="w-8 h-8 text-[#B90101]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          Sign In to View Favourites
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
          Please sign in to your FilmZone account to view and manage your cinema
          favourite movies saved on your account.
        </p>
        <Link
          to="/login"
          className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-bold text-[14px] shadow-lg hover:brightness-110 active:scale-95 transition"
          style={{ backgroundColor: "#B90101" }}
        >
          <LogIn size={16} />
          <span>Sign In to Account</span>
        </Link>
      </div>
    );
  }

  // State 2: Initial Loading
  const isInitialLoading = isFavoritesLoading && !teacherFavoritesData;
  if (isInitialLoading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-10 h-10 border-4 border-[#B90101] border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-500 dark:text-neutral-400 font-semibold text-sm">
          Loading your favourites from Cinema API...
        </p>
      </div>
    );
  }

  // Active movies to render (strictly from Teacher's API for the logged in user)
  const displayMovies = formattedFavorites;

  // State 3: Empty State (Logged in user has 0 favourites)
  if (displayMovies.length === 0) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-[#B90101]/10 flex items-center justify-center">
          <Heart className="w-8 h-8 text-[#B90101]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          No Favourite Movies Yet
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
          You haven&apos;t added any cinema movies to your favourites yet.
          Browse the homepage and tap the heart on any movie poster to save it
          here.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-bold text-[14px] shadow-lg hover:brightness-110 active:scale-95 transition"
          style={{ backgroundColor: "#B90101" }}
        >
          <Film size={16} />
          <span>Browse Now Showing Movies</span>
        </Link>
      </div>
    );
  }

  // State 4: List of Favourites
  return (
    <div className="w-full space-y-8 pb-10 font-sans">
      {/* Page Header with Red Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="w-1.5 h-7 rounded-full inline-block"
            style={{ backgroundColor: "#B90101" }}
          />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
            My Favourite Movies
          </h1>
          <span className="text-sm font-bold text-neutral-400">
            ({displayMovies.length})
          </span>
        </div>
      </div>

      {/* Favourite Movie Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {displayMovies.map((movie) => (
          <FavouriteMovieCard
            key={movie.uuid || movie.id}
            id={movie.uuid || movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            duration={movie.duration}
            year={movie.year}
            genre={movie.genre}
            description={movie.description}
            isCinema={movie.isCinema ?? true}
            isTV={movie.isTV ?? false}
            isFavourite
            onDelete={() => handleRemove(movie.uuid || movie.id, movie.title)}
          />
        ))}
      </div>
    </div>
  );
}
