import { useState, useEffect } from "react";
import { TMDB_100_MOVIES } from "./tmdbCatalog";

const STORAGE_KEY = "admin_movies_catalog";
const CATALOG_EVENT = "filmzone_catalog_updated";


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

export function saveStoredMovies(movies) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  } catch (e) {
    console.error("Error saving stored movies:", e);
  }
  window.dispatchEvent(new Event(CATALOG_EVENT));
}

export function addCatalogMovie(movie) {
  const current = getStoredMovies();
  const updated = [movie, ...current];
  saveStoredMovies(updated);
  return updated;
}

export function updateCatalogMovie(updatedMovie) {
  const current = getStoredMovies();
  const updated = current.map((m) =>
    m.id === updatedMovie.id ? { ...m, ...updatedMovie } : m,
  );
  saveStoredMovies(updated);
  return updated;
}

export function deleteCatalogMovie(movieId) {
  const current = getStoredMovies();
  const updated = current.filter((m) => m.id !== movieId);
  saveStoredMovies(updated);
  return updated;
}

export function resetTo100CatalogMovies() {
  saveStoredMovies(TMDB_100_MOVIES);
  return TMDB_100_MOVIES;
}

export function clearAllCatalogMovies() {
  saveStoredMovies([]);
  return [];
}

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
