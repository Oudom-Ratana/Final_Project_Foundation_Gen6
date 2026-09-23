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
    // If Authorization is explicitly set to empty (e.g. for /auth/refresh), do not attach the expired token
    if (header.get("Authorization") === "") {
      header.delete("Authorization");
      return header;
    }

    const rawToken =
      getState()?.auth?.accessToken || sessionStorage.getItem("accessToken");
    const token = typeof rawToken === "string" ? rawToken.trim() : "";

    if (token && token.length > 5) {
      header.set(
        "Authorization",
        token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      );
    }
    return header;
  },
});

// Teacher's baseQueryWithReAuth: 100% pure RTK Query silent refresh
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  const url = typeof args === "string" ? args : args?.url || "";

  // 1. If TMDB endpoint, route to TMDB
  if (!isCinemaApiEndpoint(url)) {
    return tmdbBaseQuery(args, api, extraOptions);
  }

  // 2. Execute request with Teacher's cinema baseQuery
  let result = await cinemaBaseQuery(args, api, extraOptions);

  // 3. If 401 Unauthorized, automatically refresh using pure RTK Query
  if (result?.error?.status === 401) {
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (
      refreshToken &&
      !url.includes("/auth/refresh") &&
      !url.includes("/auth/login")
    ) {
      // Pure RTK Query: call cinemaBaseQuery without the expired Authorization header
      const refreshResult = await cinemaBaseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          headers: {
            Authorization: "", // Tells prepareHeaders NOT to attach the expired token
          },
          body: {
            refreshToken: refreshToken,
          },
        },
        api,
        extraOptions,
      );

      if (refreshResult?.data?.accessToken) {
        const newAccessToken = refreshResult.data.accessToken;

        // 1. Store new accessToken in Redux and sessionStorage
        api.dispatch(setAccessToken(newAccessToken));
        sessionStorage.setItem("accessToken", newAccessToken);

        if (refreshResult.data.refreshToken) {
          sessionStorage.setItem(
            "refreshToken",
            refreshResult.data.refreshToken,
          );
        }

        // 2. Automatically retry original query with the new token
        result = await cinemaBaseQuery(args, api, extraOptions);
      } else {
        // Refresh token genuinely invalid or expired -> logout
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
