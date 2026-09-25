import { createSlice } from "@reduxjs/toolkit";

const initialAccessToken = sessionStorage.getItem("accessToken") || null;
const initialRefreshToken = sessionStorage.getItem("refreshToken") || null;
const initialUser = sessionStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : null;

const initialState = {
  user: initialUser,
  accessToken: initialAccessToken,
  token: initialAccessToken, // Backwards-compatible alias for existing components
  refreshToken: initialRefreshToken,
  isAuthenticated: !!initialAccessToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Teacher's exact action: setAccessToken
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        sessionStorage.setItem("accessToken", action.payload);
      } else {
        sessionStorage.removeItem("accessToken");
      }
    },
    setCredentials: (state, action) => {
      const { user, token, accessToken, refreshToken } = action.payload;
      const finalAccessToken = accessToken || token;
      if (user !== undefined) {
        state.user = user;
        if (user) sessionStorage.setItem("user", JSON.stringify(user));
      }
      if (finalAccessToken) {
        state.accessToken = finalAccessToken;
        state.token = finalAccessToken;
        sessionStorage.setItem("accessToken", finalAccessToken);
      }
      if (refreshToken) {
        state.refreshToken = refreshToken;
        sessionStorage.setItem("refreshToken", refreshToken);
      }
      state.isAuthenticated = !!(state.accessToken || finalAccessToken);
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (state.user) {
        sessionStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");
      // Clean up legacy localStorage if any
      localStorage.removeItem("cinema_token");
      localStorage.removeItem("cinema_refresh_token");
      localStorage.removeItem("cinema_user");
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setAccessToken,
  setCredentials,
  updateUser,
  logout,
  setError,
  setLoading,
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;
