import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, logout } from "../../redux/slices/authSlice";

const TMDB_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const CINEMA_API_BASE =
  import.meta.env.VITE_CINEMA_API_BASE_URL ||
  "https://cinema-booking-api.eunglyzhia.com/api/v1";

// Checks if the endpoint belongs to the Teacher's Cinema Booking API
const isCinemaApiEndpoint = (url) => {
  if (typeof url !== "string") return false;
  return (
    url.startsWith("/movies") ||
    url.startsWith("/auth") ||
    url.startsWith("/users") ||
    url.startsWith("/showtimes") ||
    url.startsWith("/halls") ||
    url.startsWith("/seats") ||
    url.startsWith("/bookings") ||
    url.startsWith("/concessions") ||
    url.startsWith("/tickets") ||
    url.startsWith("/payments") ||
    url.startsWith("/files") ||
    url.startsWith("/api/v1")
  );
};

// Base query for TMDB API (Streaming & Trailers)
const tmdbBaseQuery = fetchBaseQuery({
  baseUrl: TMDB_API_BASE,
  prepareHeaders: (headers) => {
    if (TMDB_ACCESS_TOKEN) {
      headers.set("Authorization", `Bearer ${TMDB_ACCESS_TOKEN}`);
    }
    headers.set("accept", "application/json");
    return headers;
  },
});

// Teacher's Base Query: prepareHeaders reading accessToken from Redux State
const cinemaBaseQuery = fetchBaseQuery({
  baseUrl: CINEMA_API_BASE,
  prepareHeaders: (header, { getState }) => {
    const rawToken = getState()?.auth?.accessToken || getState()?.auth?.token;
    const token = typeof rawToken === "string" ? rawToken.trim() : "";

    if (token && token !== "Bearer" && token.length > 5) {
      header.set(
        "Authorization",
        token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      );
    }
    header.set("accept", "application/json");
    return header;
  },
});

// Teacher's baseQueryWithReAuth pattern with sessionStorage
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args?.url || "";

  // 1. If TMDB endpoint, route to TMDB
  if (!isCinemaApiEndpoint(url)) {
    return tmdbBaseQuery(args, api, extraOptions);
  }

  // 2. Execute request with Teacher's cinema baseQuery
  let result = await cinemaBaseQuery(args, api, extraOptions);

  // 3. If 401 Unauthorized, use Teacher's refresh token flow
  if (result?.error?.status === 401) {
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (
      refreshToken &&
      !url.includes("/auth/refresh") &&
      !url.includes("/auth/login")
    ) {
      // Use RTK Query's cinemaBaseQuery instead of native fetch
      const refreshResult = await cinemaBaseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: {
            refreshToken: refreshToken,
          },
        },
        api,
        extraOptions,
      );

      if (refreshResult?.data?.accessToken) {
        const newAccessToken = refreshResult.data.accessToken;
        console.log("==> new accessToken:", newAccessToken);
        api.dispatch(setAccessToken(newAccessToken));

        if (refreshResult.data.refreshToken) {
          sessionStorage.setItem(
            "refreshToken",
            refreshResult.data.refreshToken,
          );
        }

        // Retry the original query with the new token via RTK Query
        result = await cinemaBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else if (result?.error?.status === 401 && !url.includes("/auth/login")) {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    "Movie",
    "TV",
    "Season",
    "Episode",
    "Showtime",
    "Booking",
    "Cinema",
    "Hall",
    "Seat",
    "Ticket",
    "Payment",
    "Concession",
    "Auth",
    "User",
    "Favorite",
  ],
  endpoints: () => ({}),
});
