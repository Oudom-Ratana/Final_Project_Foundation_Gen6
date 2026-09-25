import { createSlice } from "@reduxjs/toolkit";

// Load favourites persisted in localStorage (if any)
const loadInitialMovies = () => {
  try {
    const stored = localStorage.getItem("favouriteMovies");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState = {
  movies: loadInitialMovies(),
};

export const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    addToFavourite: (state, action) => {
      const movie = action.payload;
      const targetId = movie?.uuid || movie?.id;
      if (!targetId) return;

      const exists = state.movies.some(
        (m) =>
          String(m.id) === String(targetId) ||
          (m.uuid && String(m.uuid) === String(targetId)) ||
          (movie.uuid && String(m.uuid) === String(movie.uuid)) ||
          (movie.id && String(m.id) === String(movie.id)),
      );
      if (!exists) {
        state.movies.push({
          ...movie,
          id: targetId,
          uuid: movie.uuid || targetId,
        });
      }
      try {
        localStorage.setItem("favouriteMovies", JSON.stringify(state.movies));
      } catch {}
    },

    removeFromFavourite: (state, action) => {
      const id = String(action.payload);
      state.movies = state.movies.filter(
        (m) => String(m.id) !== id && String(m.uuid) !== id,
      );
      try {
        localStorage.setItem("favouriteMovies", JSON.stringify(state.movies));
      } catch {}
    },

    toggleFavourite: (state, action) => {
      const movie = action.payload;
      const targetId = movie?.uuid || movie?.id;
      if (!targetId) return;

      const index = state.movies.findIndex(
        (m) =>
          String(m.id) === String(targetId) ||
          (m.uuid && String(m.uuid) === String(targetId)) ||
          (movie.uuid && String(m.uuid) === String(movie.uuid)) ||
          (movie.id && String(m.id) === String(movie.id)),
      );
      if (index >= 0) {
        state.movies.splice(index, 1);
      } else {
        state.movies.push({
          ...movie,
          id: targetId,
          uuid: movie.uuid || targetId,
        });
      }
      try {
        localStorage.setItem("favouriteMovies", JSON.stringify(state.movies));
      } catch {}
    },

    setFavouriteMovies: (state, action) => {
      state.movies = action.payload || [];
      try {
        localStorage.setItem("favouriteMovies", JSON.stringify(state.movies));
      } catch {}
    },

    clearFavourites: (state) => {
      state.movies = [];
      try {
        localStorage.removeItem("favouriteMovies");
      } catch {}
    },
  },
  extraReducers: (builder) => {
    // Whenever user logs out or logs into a new account, completely wipe favourite state & localStorage
    builder.addMatcher(
      (action) =>
        action.type === "auth/logout" || action.type === "auth/setCredentials",
      (state) => {
        state.movies = [];
        try {
          localStorage.removeItem("favouriteMovies");
        } catch {}
      },
    );
  },
});

export const {
  addToFavourite,
  removeFromFavourite,
  toggleFavourite,
  setFavouriteMovies,
  clearFavourites,
} = favouriteSlice.actions;

export const selectFavouriteMovies = (state) => state.favourite.movies;

export default favouriteSlice.reducer;
