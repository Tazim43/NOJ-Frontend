import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://noj-backend-dtb7hdajd9gmdvau.malaysiawest-01.azurewebsites.net/api/v1";

export const solutionsApi = createApi({
  reducerPath: "solutionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Create a solution for a problem
    createSolution: builder.mutation({
      query: ({ problemId, source_code, languageId }) => ({
        url: `/solutions/problem/${problemId}`,
        method: "POST",
        body: { source_code, languageId },
      }),
    }),

    // Get all solutions for a problem
    getSolution: builder.query({
      query: (problemId) => `/solutions/problem/${problemId}`,
      transformResponse: (response) => response.data,
    }),

    // Get a single solution by problemId and solutionId
    getSolutionById: builder.query({
      query: ({ problemId, solutionId }) =>
        `/solutions/${problemId}/${solutionId}`,
    }),

    // Update a solution
    updateSolution: builder.mutation({
      query: ({ problemId, solutionId, source_code, languageId }) => ({
        url: `/solutions/${problemId}/${solutionId}`,
        method: "PUT",
        body: { source_code, languageId },
      }),
    }),

    // Delete a solution
    deleteSolution: builder.mutation({
      query: ({ problemId, solutionId }) => ({
        url: `/solutions/${problemId}/${solutionId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateSolutionMutation,
  useGetSolutionQuery,
  useGetSolutionByIdQuery,
  useUpdateSolutionMutation,
  useDeleteSolutionMutation,
} = solutionsApi;
