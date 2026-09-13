import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import bookingReducer from "./slices/bookingSlice";
import watchlistReducer from "./slices/watchlistSlice";
import uiReducer from "./slices/uiSlice";
import { baseApi } from "../services/api/baseApi";
import  favouriteReducer from "./slices/favouriteSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favourite: favouriteReducer,
    booking: bookingReducer,
    watchlist: watchlistReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export default store;
