import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { Heart } from "lucide-react";
import FavouriteMovieCard from "../components/favourite/FavouriteMovieCard";
import { removeFromFavourite } from "../redux/slices/favouriteSlice";

export default function FavouritePage() {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.favourite.movies) || [];

  if (movies.length === 0) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-[#B90101]/10 flex items-center justify-center">
          <Heart className="w-8 h-8 text-[#B90101]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          No Favourite Movies Yet
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
          You haven&apos;t added any movies to your favourites yet. Browse the
          stream and tap the heart on any movie to save it here.
        </p>
        <Link
          to="/stream"
          className="mt-2 inline-flex items-center gap-2 px-6 py-2 rounded-full text-white font-bold text-[14px] shadow-lg hover:brightness-110 active:scale-95 transition"
          style={{ backgroundColor: '#B90101' }}
        >
          <span>Browse Stream</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 pb-10 font-sans">
      {/* Page Header with Red Bar */}
      <div className="flex items-center gap-3">
        <span
          className="w-1.5 h-7 rounded-full inline-block"
          style={{ backgroundColor: '#B90101' }}
        />
        <h2 className="text-btn-card)] sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white">
          My Favourite Movies
        </h2>
        <span className="text-sm font-bold text-neutral-400">
          ({movies.length})
        </span>
      </div>

      {/* Favourite Movie Cards */}
      <div className="grid grid-cols-1 gap-6">
        {movies.map((movie) => (
          <FavouriteMovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            duration={movie.duration}
            year={movie.year}
            genre={movie.genre}
            description={movie.description}
            isFavourite
            onDelete={() => dispatch(removeFromFavourite(movie.id))}
          />
        ))}
      </div>
    </div>
  );
}
