import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

    // 3. Current User Profile (/api/v1/users/me)
    getCurrentUser: builder.query({
      query: () => "/users/me",
      providesTags: ["Auth", "User"],
    }),

    // 4. Refresh Token (/api/v1/auth/refresh)
    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),

    // 5. Logout (/api/v1/auth/logout)
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
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useRefreshTokenMutation,
  useLogoutApiMutation,
} = authApi;
