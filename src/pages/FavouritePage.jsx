import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { Heart, LogIn, Film } from "lucide-react";
import { toast } from "react-toastify";
import FavouriteMovieCard from "../components/favourite/FavouriteMovieCard";
import SEO from "../components/common/SEO";
import {
  removeFromFavourite,
  setFavouriteMovies,
} from "../redux/slices/favouriteSlice";
import { selectIsAuthenticated } from "../redux/slices/authSlice";
import {
  useGetMyFavoritesQuery,
  useToggleFavoriteMutation,
} from "../services/api/authApi";
import { useGetCinemaMoviesQuery } from "../services/api/cinemaApi";

export default function FavouritePage() {
  const dispatch = useDispatch();
  const token =
    useSelector((state) => state.auth?.accessToken || state.auth?.token) ||
    sessionStorage.getItem("accessToken");

  const {
    data: teacherFavoritesData,
    isLoading: isFavoritesLoading,
    isFetching: isFavoritesFetching,
  } = useGetMyFavoritesQuery(
    { page: 0, size: 50 },
    { skip: !token, refetchOnMountOrArgChange: true },
  );

  const { data: cinemaMoviesData, isLoading: isCinemaLoading } =
    useGetCinemaMoviesQuery({ page: 0, size: 100 });

  const [toggleFavorite] = useToggleFavoriteMutation();

  const cinemaMap = useMemo(() => {
    const map = new Map();
    if (cinemaMoviesData?.content && Array.isArray(cinemaMoviesData.content)) {
      cinemaMoviesData.content.forEach((movie) => {
        if (movie.uuid) map.set(movie.uuid, movie);
      });
    }
    return map;
  }, [cinemaMoviesData]);

  const formattedFavorites = useMemo(() => {
    if (!token) return [];

    const rawList = teacherFavoritesData?.content;
    if (!Array.isArray(rawList)) return [];

    return rawList.map((fav) => {
      const cinemaMovie = cinemaMap.get(fav.movieUuid) || {};

      let posterUrl =
        fav.posterPath ||
        cinemaMovie.posterUrl ||
        cinemaMovie.poster_path ||
        "";
      if (posterUrl && !posterUrl.startsWith("http")) {
        posterUrl = `https://image.tmdb.org/t/p/w500${posterUrl}`;
      }

      const runtimeMinutes = cinemaMovie.runtimeMinutes || cinemaMovie.runtime;
      const duration = runtimeMinutes
        ? `${Math.floor(runtimeMinutes / 60)}h ${runtimeMinutes % 60}m`
        : "2h 00m";

      const releaseDate = fav.releaseDate || cinemaMovie.releaseDate || "";
      const year = releaseDate ? releaseDate.slice(0, 4) : "2026";

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

  useEffect(() => {
    if (token && Array.isArray(teacherFavoritesData?.content)) {
      dispatch(setFavouriteMovies(formattedFavorites));
    }
  }, [formattedFavorites, token, teacherFavoritesData, dispatch]);

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

  const seoEl = (
    <SEO
      title="My Watchlist & Favorites | FilmZone"
      description="Keep track of your favorite blockbuster films and trending series to watch anytime on FilmZone."
      url="/favourite"
    />
  );

  if (!token) {
    return (
      <>
        {seoEl}
        <div className="w-full py-24 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
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
      </>
    );
  }

  const isInitialLoading = isFavoritesLoading && !teacherFavoritesData;
  if (isInitialLoading) {
    return (
      <>
        {seoEl}
        <div className="w-full py-24 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-10 h-10 border-4 border-[#B90101] border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-500 dark:text-neutral-400 font-semibold text-sm">
          Loading your favourites from Cinema API...
        </p>
      </div>
      </>
    );
  }

  const displayMovies = formattedFavorites;

  if (displayMovies.length === 0) {
    return (
      <>
        {seoEl}
        <div className="w-full py-24 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
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
      </>
    );
  }

  return (
    <div className="w-full space-y-8 pb-10 font-sans">
      {seoEl}
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
