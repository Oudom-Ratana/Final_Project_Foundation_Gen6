import React from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Heart, Trash2, Play, Film } from "lucide-react";
import { removeFromFavourite } from "../../redux/slices/favouriteSlice";
import { useToggleFavoriteMutation } from "../../services/api/authApi";
import { useAddFavoriteMutation } from "../../services/api/accountApi";

export default function FavouriteMovieCard({
  id,
  title,
  posterUrl,
  duration,
  year,
  genre,
  description,
  isTV = false,
  isCinema = true,
  isFavourite = true,
  onDelete,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [toggleFavoriteTeacher] = useToggleFavoriteMutation();
  const [addFavoriteTmdb] = useAddFavoriteMutation();

  const isCinemaMovie =
    isCinema || (typeof id === "string" && id.includes("-"));
  const detailUrl = isCinemaMovie
    ? `/movies/${id}`
    : `/stream/${id}${isTV ? "?type=tv" : ""}`;

  const handleRemove = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (onDelete) {
      onDelete();
      return;
    }

    // Default removal logic if onDelete prop is not provided
    dispatch(removeFromFavourite(id));

    if (isCinemaMovie) {
      try {
        await toggleFavoriteTeacher(id).unwrap();
      } catch (err) {
        console.warn("Failed to remove favorite from Teacher API:", err);
      }
    } else {
      try {
        await addFavoriteTmdb({
          mediaType: isTV ? "tv" : "movie",
          mediaId: id,
          favorite: false,
        }).unwrap();
      } catch (err) {
        console.warn("Failed to remove favorite from TMDB:", err);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row w-full gap-5 border border-[var(--border-light-mode)] rounded-2xl bg-[var(--primary-color-5)] dark:bg-[var(--primary-color-30)] dark:border-[var(--border-dark-mode)] p-5 transition-all duration-300 hover:border-[#B90101]/40">
      {/* Poster Image */}
      <Link
        to={detailUrl}
        className="h-64 sm:h-56 w-full sm:w-40 shrink-0 overflow-hidden rounded-xl block cursor-pointer bg-neutral-900/40 relative group"
        aria-label={`View ${title}`}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${title} poster`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            No poster
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <Link to={detailUrl}>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white hover:text-[#B90101] transition-colors line-clamp-1">
                {title}
              </h2>
            </Link>

            {/* Favorite / Delete Actions */}
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <button
                type="button"
                onClick={handleRemove}
                className="flex flex-col items-center gap-1 hover:text-[var(--color-primary)] border-none cursor-pointer group"
                title="Remove from favourite"
              >
                <Heart
                  size={20}
                  className="fill-[var(--color-primary)] text-[var(--color-primary)] transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-[var(--color-primary)] text-xs font-semibold">
                  Favourite
                </span>
              </button>

              <div className="h-7 w-px bg-neutral-200 dark:bg-white/10" />

              <button
                type="button"
                onClick={handleRemove}
                className="flex flex-col items-center gap-1 text-neutral-500 hover:text-red-600 transition-colors duration-200 group cursor-pointer"
                title="Delete from favourite"
              >
                <Trash2
                  size={20}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-xs font-semibold">Delete</span>
              </button>
            </div>
          </div>

          <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
            {duration} {year ? `· ${year}` : ""}
          </p>

          {genre && (
            <span className="mt-3 inline-block rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30 px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
              {genre}
            </span>
          )}

          {description && (
            <p className="mt-3 text-[15px] sm:text-[16px] leading-relaxed text-neutral-600 dark:text-neutral-300 line-clamp-3">
              {description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-2">
          <button
            type="button"
            onClick={() => navigate(detailUrl)}
            className="flex w-fit items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-bold text-white hover:brightness-110 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          >
            {isCinemaMovie ? (
              <>
                <Film size={16} />
                <span>View Movie & Showtimes</span>
              </>
            ) : (
              <>
                <Play size={16} className="fill-white" />
                <span>{isTV ? "Watch Series" : "Watch Movie"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
