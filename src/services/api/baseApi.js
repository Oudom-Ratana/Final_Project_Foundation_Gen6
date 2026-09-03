import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.themoviedb.org/3";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token =
        getState().auth.token || localStorage.getItem("cinema_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Movie", "Showtime", "Booking", "Cinema", "Auth"],
  endpoints: () => ({}),
});
