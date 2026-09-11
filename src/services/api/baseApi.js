import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.themoviedb.org/3';

const TMDB_ACCESS_TOKEN =
  import.meta.env.VITE_TMDB_ACCESS_TOKEN ||
  import.meta.env.VITE_TMDB_API_KEY;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // 1. Attach TMDB Access Token for all TMDB requests
      if (TMDB_ACCESS_TOKEN) {
        headers.set('Authorization', `Bearer ${TMDB_ACCESS_TOKEN}`);
      }

      // 2. Attach user session token if present
      const userToken =
        getState()?.auth?.token || localStorage.getItem('cinema_token');
      if (userToken && !TMDB_ACCESS_TOKEN) {
        headers.set('Authorization', `Bearer ${userToken}`);
      }

      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Movie', 'TV', 'Season', 'Episode', 'Showtime', 'Booking', 'Cinema', 'Auth'],
  endpoints: () => ({}),
});
