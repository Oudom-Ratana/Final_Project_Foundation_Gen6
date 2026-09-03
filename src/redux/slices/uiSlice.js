import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trailerModal: {
    isOpen: false,
    videoKey: null,
    movieTitle: "",
  },
  searchQuery: "",
  selectedGenre: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openTrailerModal: (state, action) => {
      state.trailerModal = {
        isOpen: true,
        videoKey: action.payload.videoKey || "dQw4w9WgXcQ", // fallback or real key
        movieTitle: action.payload.title || "Trailer",
      };
    },
    closeTrailerModal: (state) => {
      state.trailerModal = {
        isOpen: false,
        videoKey: null,
        movieTitle: "",
      };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedGenre: (state, action) => {
      state.selectedGenre = action.payload;
    },
  },
});

export const {
  openTrailerModal,
  closeTrailerModal,
  setSearchQuery,
  setSelectedGenre,
} = uiSlice.actions;

export const selectTrailerModal = (state) => state.ui.trailerModal;
export const selectSearchQuery = (state) => state.ui.searchQuery;
export const selectSelectedGenre = (state) => state.ui.selectedGenre;

export default uiSlice.reducer;
