import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import bookingReducer from "./slices/bookingSlice";
import watchlistReducer from "./slices/watchlistSlice";
import uiReducer from "./slices/uiSlice";
import { baseApi } from "../services/api/baseApi";
import favouriteReducer from "./slices/favouriteSlice";
import ticketReducer from "./slices/ticketSlice";

// Middleware to immediately wipe all RTK Query API cache when switching users or logging out
const authResetMiddleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  if (action.type === "auth/logout" || action.type === "auth/setCredentials") {
    storeApi.dispatch(baseApi.util.resetApiState());
  }
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favourite: favouriteReducer,
    booking: bookingReducer,
    watchlist: watchlistReducer,
    ui: uiReducer,
    tickets: ticketReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authResetMiddleware)
      .concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export default store;
