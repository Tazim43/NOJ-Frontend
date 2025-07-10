import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

export const testcasesApi = createApi({
  reducerPath: "testcasesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllTestcases: builder.query({
      query: (problemId) => `/testcases/problem/${problemId}`,
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
  useGetTestcaseByIdQuery,
  useCreateTestcaseMutation,
  useUpdateTestcaseMutation,
  useDeleteTestcaseMutation,
} = testcasesApi;
