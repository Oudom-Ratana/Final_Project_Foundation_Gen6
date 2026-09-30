import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),

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


    getCurrentUser: builder.query({
      query: () => "/users/me",
      providesTags: ["Auth", "User"],
    }),

    getAllUsers: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/users?page=${page}&size=${size}`;
      },
      providesTags: ["User"],
    }),

    getUserByUuid: builder.query({
      query: (uuid) => `/users/${uuid}`,
      providesTags: (result, error, uuid) => [{ type: "User", id: uuid }],
    }),

    updateUser: builder.mutation({
      query: ({ uuid, userData }) => ({
        url: `/users/${uuid}`,
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (uuid) => ({
        url: `/users/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    enableUser: builder.mutation({
      query: (uuid) => ({
        url: `/users/${uuid}/enable`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    disableUser: builder.mutation({
      query: (uuid) => ({
        url: `/users/${uuid}/disable`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    updateUserRole: builder.mutation({
      query: ({ userUuid, role }) => ({
        url: `/users/${userUuid}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),


    getMyFavorites: builder.query({
      query: (params = {}) => {
        const { page = 0, size = 20 } = params;
        return `/users/me/favorites?page=${page}&size=${size}`;
      },
      providesTags: ["Favorite"],
    }),

    toggleFavorite: builder.mutation({
      query: (movieUuid) => ({
        url: `/users/me/favorites/${movieUuid}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Favorite"],
    }),

    getFavoriteStatus: builder.query({
      query: (movieUuid) => `/users/me/favorites/${movieUuid}/status`,
      providesTags: (result, error, movieUuid) => [
        { type: "Favorite", id: movieUuid },
      ],
    }),

    getMyFavoriteCount: builder.query({
      query: () => "/users/me/favorites/count",
      providesTags: ["Favorite"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutApiMutation,

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

  useGetMyFavoritesQuery,
  useLazyGetMyFavoritesQuery,
  useToggleFavoriteMutation,
  useGetFavoriteStatusQuery,
  useLazyGetFavoriteStatusQuery,
  useGetMyFavoriteCountQuery,
} = authApi;
