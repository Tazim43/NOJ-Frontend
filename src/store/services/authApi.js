import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, logout } from "../slices/authSlice";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://noj-backend-dtb7hdajd9gmdvau.malaysiawest-01.azurewebsites.net/api/v1";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),

  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const user = data?.data;

          // Update Redux state only - cookies handle persistence
          dispatch(setUser(user));
        } catch (error) {
          // Only logout on authentication errors (401/403)
          if (error?.error?.status === 401 || error?.error?.status === 403) {
            dispatch(logout());
          }
          // For other errors, don't logout - might be network issues
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        // Clear state immediately, don't wait for API
        dispatch(logout());

        try {
          await queryFulfilled;
          // Backend clears cookies
        } catch (error) {
          console.error("Error logging out:", error);
          // Still consider logout successful on client side
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLogoutUserMutation, useGetCurrentUserQuery } = authApi;
