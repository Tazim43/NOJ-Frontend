import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://noj-backend-dtb7hdajd9gmdvau.malaysiawest-01.azurewebsites.net/api/v1";

export const problemsApi = createApi({
  reducerPath: "problemsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // GET all problems
    getAllProblems: builder.query({
      query: () => "/problems",
    }),

    // GET a single problem by ID
    getProblemById: builder.query({
      query: (id) => `/problems/${id}`,
      transformResponse: (response) => response.problem,
    }),

    // GET problems created by the current user
    getMyProblems: builder.query({
      query: () => "/problems/my",
    }),

    // CREATE a new problem
    createProblem: builder.mutation({
      query: (data) => ({
        url: "/problems",
        method: "POST",
        body: data,
      }),
    }),

    // UPDATE a problem by ID
    updateProblem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/problems/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // DELETE a problem by ID
    deleteProblem: builder.mutation({
      query: (id) => ({
        url: `/problems/${id}`,
        method: "DELETE",
      }),
    }),

    // TOGGLE visibility of a problem
    updateProblemVisibility: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/problems/${id}/visibility`,
        method: "PUT",
        body: data,
      }),
    }),

    // CREATE problem statement
    createProblemStatement: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/problems/${id}/statement`,
        method: "POST",
        body: formData,
      }),
    }),

    // UPDATE problem statement
    updateProblemStatement: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/problems/${id}/statement`,
        method: "PUT",
        body: formData,
      }),
    }),

    // GET problem statement
    getProblemStatementById: builder.query({
      query: (id) => `/problems/${id}/statement`,
      transformResponse: (response) => response.problemStatement,
    }),
  }),
});

export const {
  useGetAllProblemsQuery,
  useGetProblemByIdQuery,
  useGetMyProblemsQuery,
  useCreateProblemMutation,
  useUpdateProblemMutation,
  useDeleteProblemMutation,
  useUpdateProblemVisibilityMutation,
  useCreateProblemStatementMutation,
  useUpdateProblemStatementMutation,
  useGetProblemStatementByIdQuery,
} = problemsApi;
