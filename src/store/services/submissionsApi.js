import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

export const submissionsApi = createApi({
  reducerPath: "submissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Get all submissions with pagination
    getAllSubmissions: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/submissions",
        params: { page, limit },
      }),
    }),

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
  useGetAllSubmissionsQuery,
  useGetMySubmissionsQuery,
  useGetSubmissionByIdQuery,
  useSubmitSolutionMutation,
} = submissionsApi;
