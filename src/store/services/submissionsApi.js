import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

export const submissionsApi = createApi({
  reducerPath: "submissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get all submissions by current user
    getMySubmissions: builder.query({
      query: () => "/submissions/my",
    }),

    // Get single submission by ID
    getSubmissionById: builder.query({
      query: (id) => `/submissions/${id}`,
    }),

    // Submit a solution to a problem
    submitSolution: builder.mutation({
      query: ({ problemId, source_code, language_id }) => ({
        url: `/submissions/problems/${problemId}`,
        method: "POST",
        body: {
          source_code,
          language_id,
        },
      }),
    }),
  }),
});

export const {
  useGetMySubmissionsQuery,
  useGetSubmissionByIdQuery,
  useSubmitSolutionMutation,
} = submissionsApi;
