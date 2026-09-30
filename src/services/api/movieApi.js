import { baseApi } from "./baseApi";

export const movieApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUpcomingMovies: builder.query({
      query: (page = 1) => `/movie/upcoming?page=${page}`,
      transformResponse: (response) => response?.results || response,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Movie", id })),
              { type: "Movie", id: "UPCOMING" },
            ]
          : [{ type: "Movie", id: "UPCOMING" }],
    }),

    getTrendingMovies: builder.query({
      query: (timeWindow = "day") => `/trending/movie/${timeWindow}`,
      transformResponse: (response) => response?.results || response,
      providesTags: [{ type: "Movie", id: "TRENDING" }],
    }),

    getAllTrending: builder.query({
      query: (timeWindow = "day") => `/trending/all/${timeWindow}`,
      transformResponse: (response) => response?.results || response,
      providesTags: [{ type: "Movie", id: "ALL_TRENDING" }],
    }),

    getNowPlayingMovies: builder.query({
      query: (page = 1) => `/movie/now_playing?page=${page}`,
      transformResponse: (response) => response?.results || response,
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Movie", id })),
              { type: "Movie", id: "NOW_PLAYING" },
            ]
          : [{ type: "Movie", id: "NOW_PLAYING" }],
    }),

    getPopularMovies: builder.query({
      query: (page = 1) => `/movie/popular?page=${page}`,
      transformResponse: (response) => response?.results || response,
      providesTags: [{ type: "Movie", id: "POPULAR" }],
    }),

    getTopRatedMovies: builder.query({
      query: (page = 1) => `/movie/top_rated?page=${page}`,
      transformResponse: (response) => response?.results || response,
      providesTags: [{ type: "Movie", id: "TOP_RATED" }],
    }),

    discoverMovies: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.with_genres)
          queryParams.append("with_genres", params.with_genres);
        if (params.sort_by) {
          queryParams.append("sort_by", params.sort_by);
          if (params.sort_by.startsWith("vote_average")) {
            queryParams.append("vote_count.gte", "200");
          }
        }
        if (params.primary_release_year)
          queryParams.append(
            "primary_release_year",
            params.primary_release_year,
          );
        const queryStr = queryParams.toString();
        return `/discover/movie${queryStr ? `?${queryStr}` : ""}`;
      },
      transformResponse: (response) => ({
        results: response?.results || [],
        total_pages: Math.min(response?.total_pages || 1, 500),
        total_results: response?.total_results || 0,
      }),
      providesTags: [{ type: "Movie", id: "DISCOVER" }],
    }),

    getMovieDetails: builder.query({
      query: (id) =>
        `/movie/${id}?append_to_response=videos,credits,similar,images`,
      providesTags: (result, error, id) => [{ type: "Movie", id }],
    }),

    getMovieTrailers: builder.query({
      query: (id) => `/movie/${id}/videos`,
      transformResponse: (response) => response?.results || [],
    }),

    getMovieCredits: builder.query({
      query: (id) => `/movie/${id}/credits`,
    }),

    getMovieGenres: builder.query({
      query: () => "/genre/movie/list",
      transformResponse: (response) => response?.genres || [],
    }),

    searchMovies: builder.query({
      query: ({ query, page = 1 }) =>
        `/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
      transformResponse: (response) => ({
        results: response?.results || [],
        total_pages: Math.min(response?.total_pages || 1, 500),
        total_results: response?.total_results || 0,
      }),
    }),

    searchMulti: builder.query({
      query: ({ query, page = 1 }) =>
        `/search/multi?query=${encodeURIComponent(query)}&page=${page}`,
      transformResponse: (response) => response?.results || [],
    }),

    getMovieRuntime: builder.query({
      query: (id) => `/movie/${id}`,
      transformResponse: (response) => response?.runtime || null,
      providesTags: (result, error, id) => [
        { type: "Movie", id: `runtime-${id}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUpcomingMoviesQuery,
  useGetTrendingMoviesQuery,
  useGetAllTrendingQuery,
  useGetNowPlayingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useDiscoverMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMovieRuntimeQuery,
  useGetMovieTrailersQuery,
  useGetMovieCreditsQuery,
  useGetMovieGenresQuery,
  useSearchMoviesQuery,
  useLazySearchMoviesQuery,
  useSearchMultiQuery,
  useLazySearchMultiQuery,
} = movieApi;
