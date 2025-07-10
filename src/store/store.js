import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import { authApi } from "./services/authApi.js";
import { problemsApi } from "./services/problemsApi.js";
import { submissionsApi } from "./services/submissionsApi.js";
import { testcasesApi } from "./services/testcasesApi.js";
import { solutionsApi } from "./services/solutionsApi.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [problemsApi.reducerPath]: problemsApi.reducer,
    [submissionsApi.reducerPath]: submissionsApi.reducer,
    [testcasesApi.reducerPath]: testcasesApi.reducer,
    [solutionsApi.reducerPath]: solutionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(problemsApi.middleware)
      .concat(submissionsApi.middleware)
      .concat(testcasesApi.middleware)
      .concat(solutionsApi.middleware),
});

export default store;
