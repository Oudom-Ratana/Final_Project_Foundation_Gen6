import React from 'react'
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Heart, Trash2, Play } from "lucide-react";
import { removeFromFavourite } from "../../redux/slices/favouriteSlice";

export default function MovieCard({
  id,
  title,
  posterUrl,
  duration,
  year,
  genre,
  description,
  isFavourite = false,
  onDelete,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex w-full gap-5 border border-[var(--border-light-mode)] rounded-2xl bg-[var(--primary-color-5)] dark:bg-[var(--primary-color-30)] dark:border-[var(--border-dark-mode)] p-5">
      <Link
        to={`/stream/${id}`}
        className="h-56 w-40 shrink-0 overflow-hidden rounded-xl block cursor-pointer"
        aria-label={`View ${title}`}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${title} poster`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-black dark:text-white">
            No poster
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-2xl font-bold text-black dark:text-white">{title}</h2>

          <div className="flex shrink-0 items-center gap-3 text-sm ">
            <button
              type="button"
              onClick={() => dispatch(removeFromFavourite(id))}
              className="flex flex-col items-center gap-1 hover:text-[var(--color-primary)] border-none">
              <Heart
                size={20}
                className={isFavourite ? "fill-[var(--color-primary)] text-[var(--color-primary)] inline-block transition-transform duration-200 hover:scale-110" : ""} />
              <span className='text-[var(--color-primary)] inline-block transition-transform duration-200 hover:scale-110'>Favourite</span>
            </button>

            <div className="h-8 w-px" />

            <button
              type="button"
              onClick={onDelete || (() => dispatch(removeFromFavourite(id)))}
              className="flex flex-col items-center gap-1 text-[var(--color-primary)] hover:text-red-700 transition-transform duration-200 hover:scale-110">
              <Trash2 size={20} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <p className="mt-1 text-sm font-medium text-[var(--color-primary)]">
          {duration} · {year}
        </p>

        {genre && (
          <span className="mt-3 w-fit rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white">
            {genre}
          </span>
        )}

        {description && (
          <p className="mt-3 max-w-[950px] text-sm leading-relaxed text-[var(--text-light)] dark:text-white">
            {description}
          </p>
        )}

        <button
          type="button"
          onClick={() => navigate(`/movies/${id}`)}
          className="mt-4 flex w-fit items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-transform duration-200 hover:scale-105"
        >
          <Play size={16} className="fill-white " />
          Full movie
        </button>
      </div>
    </div>
  );
}