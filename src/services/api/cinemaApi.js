import { baseApi } from "./baseApi";

export const cinemaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // 1. MOVIES (CUSTOMER READ & ADMIN CRUD)
    // ==========================================

    // Customer & Admin: Get all movies from Cinema database
    getCinemaMovies: builder.query({
      query: (params = {}) => {
        const {
          page = 0,
          size = 20,
          sortBy = "createdAt",
          direction = "desc",
        } = params;
        return {
          url: `/movies?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        };
      },
      providesTags: ["Movie"],
    }),

    // Customer & Admin: Get movie by UUID
    getCinemaMovieByUuid: builder.query({
      query: (uuid) => `/movies/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Movie", id: uuid }],
    }),

    // Admin: Import a movie from TMDB into Cinema database
    importMovieFromTmdb: builder.mutation({
      query: (tmdbId) => ({
        url: `/movies/import/${tmdbId}`,
        method: "POST",
      }),
      invalidatesTags: ["Movie"],
    }),

    // Admin: Update movie status (ACTIVE, INACTIVE, COMING_SOON, ARCHIVED)
    updateMovieStatus: builder.mutation({
      query: ({ uuid, status }) => ({
        url: `/movies/${uuid}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Movie"],
    }),

    // Admin: Delete a movie from database
    deleteMovie: builder.mutation({
      query: (uuid) => ({
        url: `/movies/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Movie", "Showtime"],
    }),

    // ==========================================
    // 2. SHOWTIMES (CUSTOMER READ & ADMIN CRUD)
    // ==========================================

    // Customer & Admin: Get all showtimes
    getAllShowtimes: builder.query({
      query: () => "/showtimes",
      providesTags: ["Showtime"],
    }),

    // Customer & Admin: Get showtime by UUID
    getShowtimeByUuid: builder.query({
      query: (uuid) => `/showtimes/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "Showtime", id: uuid }],
    }),

    // Admin: Create a new showtime
    createShowtime: builder.mutation({
      query: (showtimeData) => ({
        url: "/showtimes",
        method: "POST",
        body: showtimeData,
      }),
      invalidatesTags: ["Showtime"],
    }),

    // ==========================================
    // 3. HALLS (READ & ADMIN CRUD)
    // ==========================================

    // Get all cinema halls (Standard, VIP, IMAX, etc.)
    getAllHalls: builder.query({
      query: () => "/halls",
      providesTags: ["Hall"],
    }),

    // Admin: Create a new cinema hall
    createHall: builder.mutation({
      query: (hallData) => ({
        url: "/halls",
        method: "POST",
        body: hallData,
      }),
      invalidatesTags: ["Hall"],
    }),

    // Admin: Delete a cinema hall
    deleteHall: builder.mutation({
      query: (uuid) => ({
        url: `/halls/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hall"],
    }),

    // Admin: Bulk generate seats for a hall
    createSeatsBulk: builder.mutation({
      query: ({ hallUuid, rows }) => ({
        url: `/halls/${hallUuid}/seats/bulk`,
        method: "POST",
        body: { rows },
      }),
      invalidatesTags: ["Seat", "Hall"],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Movie hooks
  useGetCinemaMoviesQuery,
  useLazyGetCinemaMoviesQuery,
  useGetCinemaMovieByUuidQuery,
  useLazyGetCinemaMovieByUuidQuery,
  useImportMovieFromTmdbMutation,
  useUpdateMovieStatusMutation,
  useDeleteMovieMutation,

  // Showtime hooks
  useGetAllShowtimesQuery,
  useLazyGetAllShowtimesQuery,
  useGetShowtimeByUuidQuery,
  useLazyGetShowtimeByUuidQuery,
  useCreateShowtimeMutation,

  // Hall hooks
  useGetAllHallsQuery,
  useGetHallByUuidQuery,
  useCreateHallMutation,
  useDeleteHallMutation,
  useCreateSeatsBulkMutation,
} = cinemaApi;
