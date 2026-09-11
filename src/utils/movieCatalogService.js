import { useState, useEffect } from "react";
import { TMDB_100_MOVIES } from "./tmdbCatalog";

const STORAGE_KEY = "admin_movies_catalog";
const CATALOG_EVENT = "flixzone_catalog_updated";

/**
 * Get all active movies set by Admin (or fallback safely to full 100 TMDB movies)
 */
export function getStoredMovies() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error parsing stored movies:", e);
  }
  return TMDB_100_MOVIES;
}

/**
 * Save movies and notify all pages/components in real-time
 */
export function saveStoredMovies(movies) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  } catch (e) {
    console.error("Error saving stored movies:", e);
  }
  // Dispatch event so any open React component re-renders instantly
  window.dispatchEvent(new Event(CATALOG_EVENT));
}

/**
 * Add a new movie to the catalog
 */
export function addCatalogMovie(movie) {
  const current = getStoredMovies();
  const updated = [movie, ...current];
  saveStoredMovies(updated);
  return updated;
}

/**
 * Update an existing movie in the catalog
 */
export function updateCatalogMovie(updatedMovie) {
  const current = getStoredMovies();
  const updated = current.map((m) =>
    m.id === updatedMovie.id ? { ...m, ...updatedMovie } : m,
  );
  saveStoredMovies(updated);
  return updated;
}

/**
 * Delete a movie from the catalog
 */
export function deleteCatalogMovie(movieId) {
  const current = getStoredMovies();
  const updated = current.filter((m) => m.id !== movieId);
  saveStoredMovies(updated);
  return updated;
}

/**
 * Reset to full 100 offline TMDB movies
 */
export function resetTo100CatalogMovies() {
  saveStoredMovies(TMDB_100_MOVIES);
  return TMDB_100_MOVIES;
}

/**
 * Clear all movies and reset to empty
 */
export function clearAllCatalogMovies() {
  saveStoredMovies([]);
  return [];
}

/**
 * Custom React Hook that keeps user & admin views 100% in sync in real-time
 */
export function useActiveMovies() {
  const [movies, setMovies] = useState(getStoredMovies);

  useEffect(() => {
    const handleUpdate = () => {
      setMovies(getStoredMovies());
    };

    window.addEventListener(CATALOG_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(CATALOG_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return movies;
}
