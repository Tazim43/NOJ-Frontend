import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://noj-backend-dtb7hdajd9gmdvau.malaysiawest-01.azurewebsites.net/api/v1";

export const testcasesApi = createApi({
  reducerPath: "testcasesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllTestcases: builder.query({
      query: (problemId) => `/testcases/problem/${problemId}`,
    }),

    getAllSampleTestcases: builder.query({
      query: (problemId) => `/testcases/sample/problem/${problemId}`,
    }),

    getTestcaseById: builder.query({
      query: ({ problemId, testcaseId }) =>
        `/testcases/problem/${problemId}/testcase/${testcaseId}`,
    }),

    createTestcase: builder.mutation({
      query: ({ problemId, ...data }) => ({
        url: `/testcases/problem/${problemId}`,
        method: "POST",
        body: data,
      }),
    }),

    updateTestcase: builder.mutation({
      query: ({ problemId, testcaseId, ...data }) => ({
        url: `/testcases/problem/${problemId}/testcase/${testcaseId}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteTestcase: builder.mutation({
      query: ({ problemId, testcaseId }) => ({
        url: `/testcases/problem/${problemId}/testcase/${testcaseId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllTestcasesQuery,
  useGetAllSampleTestcasesQuery,
  useGetTestcaseByIdQuery,
  useCreateTestcaseMutation,
  useUpdateTestcaseMutation,
  useDeleteTestcaseMutation,
} = testcasesApi;
