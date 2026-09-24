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

// Teacher's Base Query: prepareHeaders reading accessToken from Redux State or sessionStorage
const cinemaBaseQuery = fetchBaseQuery({
  baseUrl: CINEMA_API_BASE,
  prepareHeaders: (header, { getState }) => {
    const accessToken =
      getState()?.auth?.accessToken || sessionStorage.getItem("accessToken");
    if (accessToken) {
      header.set("Authorization", `Bearer ${accessToken}`);
    }
    return header;
  },
});

// Teacher's exact baseQueryWithReAuth
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args?.url || "";

  // 1. If TMDB endpoint, route to TMDB
  if (!isCinemaApiEndpoint(url)) {
    return tmdbBaseQuery(args, api, extraOptions);
  }

  // 2. Execute request with Teacher's cinema baseQuery
  let result = await cinemaBaseQuery(args, api, extraOptions);

  // 3. If 401 Unauthorized, use Teacher's exact fetch refresh logic
  if (result?.error?.status === 401) {
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (refreshToken && !url.includes("/auth/")) {
      const res = await fetch(`${CINEMA_API_BASE}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("==> new accessToken:", data?.accessToken);

        // Store new accessToken in Redux and sessionStorage
        api.dispatch(setAccessToken(data?.accessToken));
        sessionStorage.setItem("accessToken", data?.accessToken);

        if (data?.refreshToken) {
          sessionStorage.setItem("refreshToken", data.refreshToken);
        }

        // Automatically retry original query with the new token
        result = await cinemaBaseQuery(args, api, extraOptions);
      } else {
        // Only log out if refresh token is genuinely invalid or expired on server
        api.dispatch(logout());
      }
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
