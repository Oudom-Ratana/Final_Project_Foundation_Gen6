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
  name: 'favourite',
  initialState,
  reducers: {
    addToFavourite: (state, action) => {
      const movie = action.payload;
      if (!movie || !movie.id) return;

      const exists = state.movies.some((m) => m.id === movie.id);
      if (!exists) {
        state.movies.push(movie);
      }
      localStorage.setItem('favouriteMovies', JSON.stringify(state.movies));
    },

    removeFromFavourite: (state, action) => {
      const id = action.payload;
      state.movies = state.movies.filter((m) => m.id !== id);
      localStorage.setItem('favouriteMovies', JSON.stringify(state.movies));
    },
  },
})

export const { addToFavourite, removeFromFavourite } = favouriteSlice.actions;
export default favouriteSlice.reducer;