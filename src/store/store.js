import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import { authApi } from "./services/authApi.js";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
