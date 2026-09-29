import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // 1. AUTHENTICATION (auth-controller)
    // ==========================================

    // 1. Login (/api/v1/auth/login)
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // 2. Register (/api/v1/auth/register)
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // 3. Refresh Token (/api/v1/auth/refresh)
    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),

    // 4. Logout (/api/v1/auth/logout)
    logoutApi: builder.mutation({
      query: (body = {}) => {
        const refreshToken = (
          typeof body === "string"
            ? body
            : body?.refreshToken ||
              sessionStorage.getItem("refreshToken") ||
              localStorage.getItem("cinema_refresh_token") ||
              ""
        ).trim();

        return {
          url: "/auth/logout",
          method: "POST",
          body: { refreshToken },
        };
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // ==========================================
    // 2. CURRENT USER & PROFILE (current-user & user-controller)
    // ==========================================

    // Current User Profile (/api/v1/users/me)
    getCurrentUser: builder.query({
      query: () => "/users/me",
      providesTags: ["Auth", "User"],
    }),

    // Admin: Get all users (/api/v1/users)
    getAllUsers: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/users?page=${page}&size=${size}`;
      },
      providesTags: ["User"],
    }),

    // Admin: Get user by UUID (/api/v1/users/{uuid})
    getUserByUuid: builder.query({
      query: (uuid) => `/users/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "User", id: uuid }],
    }),

    // Update user profile (/api/v1/users/{uuid})
    updateUser: builder.mutation({
      query: ({ uuid, userData }) => ({
        url: `/users/${uuid}`,
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Admin: Delete user (/api/v1/users/{uuid})
    deleteUser: builder.mutation({
      query: (uuid) => ({
        url: `/users/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Admin: Enable user (/api/v1/users/{uuid}/enable)
    enableUser: builder.mutation({
      query: (uuid) => ({
        url: `/users/${uuid}/enable`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    // Admin: Disable user (/api/v1/users/{uuid}/disable)
    disableUser: builder.mutation({
      query: (uuid) => ({
        url: `/users/${uuid}/disable`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    // Admin: Update user role (/api/v1/users/{userUuid}/role)
    updateUserRole: builder.mutation({
      query: ({ userUuid, role }) => ({
        url: `/users/${userUuid}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    // ==========================================
    // 3. FAVORITES (favorite-controller)
    // ==========================================

    // Get my favorites (/api/v1/users/me/favorites)
    getMyFavorites: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/users/me/favorites?page=${page}&size=${size}`;
      },
      providesTags: ["Favorite"],
    }),

    // Toggle favorite (/api/v1/users/me/favorites/{movieUuid})
    toggleFavorite: builder.mutation({
      query: (movieUuid) => ({
        url: `/users/me/favorites/${movieUuid}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Favorite"],
    }),

    // Check favorite status for a movie (/api/v1/users/me/favorites/{movieUuid}/status)
    getFavoriteStatus: builder.query({
      query: (movieUuid) => `/users/me/favorites/${movieUuid}/status`,
      providesTags: (result, error, movieUuid) => [
        { type: "Favorite", id: movieUuid },
      ],
    }),

    // Get total favorite count (/api/v1/users/me/favorites/count)
    getMyFavoriteCount: builder.query({
      query: () => "/users/me/favorites/count",
      providesTags: ["Favorite"],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutApiMutation,

  // User profile hooks
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useGetUserByUuidQuery,
  useLazyGetUserByUuidQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useEnableUserMutation,
  useDisableUserMutation,
  useUpdateUserRoleMutation,

  // Favorites hooks
  useGetMyFavoritesQuery,
  useLazyGetMyFavoritesQuery,
  useToggleFavoriteMutation,
  useGetFavoriteStatusQuery,
  useLazyGetFavoriteStatusQuery,
  useGetMyFavoriteCountQuery,
} = authApi;
