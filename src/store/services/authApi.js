import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "../slices/authSlice";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

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
          dispatch(setUser(user));
          console.log("User fetched successfully:", user);
          localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(setUser(null));
          localStorage.removeItem("user");
        } catch (error) {
          console.error("Error logging out:", error);
        }
      },
    }),
  }),
});

export const { useLogoutUserMutation, useGetCurrentUserQuery } = authApi;
