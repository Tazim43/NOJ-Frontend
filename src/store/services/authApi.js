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

          // Update Redux state
          dispatch(setUser(user));

          // Handle localStorage (side effect in appropriate place)
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(user));
          }
        } catch (error) {
          // Handle error silently - user is not authenticated
          dispatch(logout());
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

        // Clear localStorage immediately
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.clear(); // Clear all storage to be safe
        }

        try {
          await queryFulfilled;
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
