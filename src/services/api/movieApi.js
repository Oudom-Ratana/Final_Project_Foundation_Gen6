import { baseApi } from "./baseApi";
import { MOCK_MOVIES } from "../../utils/mockData";

export const movieApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNowPlayingMovies: builder.query({
      query: (page = 1) => `/movie/now_playing?page=${page}`,
      transformResponse: (response) => response?.results || response,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Movie", id })),
              { type: "Movie", id: "LIST" },
            ]
          : [{ type: "Movie", id: "LIST" }],
      // Fallback mock transform when offline or no API key
      transformErrorResponse: () => {
        return MOCK_MOVIES.filter((m) => m.status === "Now Showing");
      },
    }),

    getUpcomingMovies: builder.query({
      query: (page = 1) => `/movie/upcoming?page=${page}`,
      transformResponse: (response) => response?.results || response,
      providesTags: [{ type: "Movie", id: "UPCOMING" }],
    }),

    getFreeStreamMovies: builder.query({
      query: () => `/movie/free-stream`,
      // Provide free streaming movies or fallback to mock free movies
      transformResponse: (response) =>
        response || MOCK_MOVIES.filter((m) => m.isFreeStream),
    }),

    getMovieDetails: builder.query({
      query: (id) => `/movie/${id}?append_to_response=videos,credits`,
      providesTags: (result, error, id) => [{ type: "Movie", id }],
    }),

    getMovieTrailers: builder.query({
      query: (id) => `/movie/${id}/videos`,
      transformResponse: (response) => response?.results || [],
    }),

    searchMovies: builder.query({
      query: (searchTerm) =>
        `/search/movie?query=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response) => response?.results || [],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNowPlayingMoviesQuery,
  useGetUpcomingMoviesQuery,
  useGetFreeStreamMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMovieTrailersQuery,
  useLazySearchMoviesQuery,
} = movieApi;
