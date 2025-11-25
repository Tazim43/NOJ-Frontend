import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://noj-backend-dtb7hdajd9gmdvau.malaysiawest-01.azurewebsites.net/api/v1";

export const contestsApi = createApi({
  reducerPath: "contestsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Contest", "Leaderboard", "Clarifications", "Announcements"],
  endpoints: (builder) => ({
    // Contest CRUD
    getAllContests: builder.query({
      query: (params) => ({
        url: "/contests",
        params, // { status: 'upcoming'|'ongoing'|'past', page, limit }
      }),
      providesTags: ["Contest"],
    }),

    getContestById: builder.query({
      query: (id) => `/contests/${id}`,
      providesTags: (result, error, id) => [{ type: "Contest", id }],
    }),

    getMyContests: builder.query({
      query: () => "/contests/my",
      providesTags: ["Contest"],
    }),

    createContest: builder.mutation({
      query: (data) => ({
        url: "/contests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contest"],
    }),

    updateContest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/contests/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Contest", id }],
    }),

    deleteContest: builder.mutation({
      query: (id) => ({
        url: `/contests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contest"],
    }),

    // Contest Problems
    getContestProblems: builder.query({
      query: (contestId) => `/contests/${contestId}/problems`,
      providesTags: (result, error, contestId) => [
        { type: "Contest", id: contestId },
      ],
    }),

    addProblemToContest: builder.mutation({
      query: ({ contestId, problemId, label, score }) => ({
        url: `/contests/${contestId}/problems`,
        method: "POST",
        body: { problemId, label, score },
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "Contest", id: contestId },
      ],
    }),

    removeProblemFromContest: builder.mutation({
      query: ({ contestId, problemId }) => ({
        url: `/contests/${contestId}/problems/${problemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "Contest", id: contestId },
      ],
    }),

    // Registration
    registerForContest: builder.mutation({
      query: ({ contestId, accessCode }) => ({
        url: `/contests/${contestId}/register`,
        method: "POST",
        body: accessCode ? { accessCode } : {},
      }),
      invalidatesTags: (result, error, { contestId }) => [
        { type: "Contest", id: contestId },
      ],
    }),

    unregisterFromContest: builder.mutation({
      query: (contestId) => ({
        url: `/contests/${contestId}/register`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, contestId) => [
        { type: "Contest", id: contestId },
      ],
    }),

    // Submissions
    getContestSubmissions: builder.query({
      query: (contestId) => `/contests/${contestId}/submissions`,
    }),

    // Leaderboard
    getContestLeaderboard: builder.query({
      query: (contestId) => `/contests/${contestId}/leaderboard`,
      providesTags: ["Leaderboard"],
      // Poll every 30 seconds during contest
      pollingInterval: 30000,
    }),

    // Clarifications
    getClarifications: builder.query({
      query: (contestId) => `/contests/${contestId}/clarifications`,
      providesTags: ["Clarifications"],
    }),

    createClarification: builder.mutation({
      query: ({ contestId, question }) => ({
        url: `/contests/${contestId}/clarifications`,
        method: "POST",
        body: { question },
      }),
      invalidatesTags: ["Clarifications"],
    }),

    answerClarification: builder.mutation({
      query: ({ contestId, clarId, answer }) => ({
        url: `/contests/${contestId}/clarifications/${clarId}`,
        method: "PUT",
        body: { answer },
      }),
      invalidatesTags: ["Clarifications"],
    }),

    // Announcements
    getAnnouncements: builder.query({
      query: (contestId) => `/contests/${contestId}/announcements`,
      providesTags: ["Announcements"],
      pollingInterval: 60000, // Poll every minute
    }),

    createAnnouncement: builder.mutation({
      query: ({ contestId, message }) => ({
        url: `/contests/${contestId}/announcements`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ["Announcements"],
    }),

    publishResults: builder.mutation({
      query: (contestId) => ({
        url: `/contests/${contestId}/publish-results`,
        method: "POST",
      }),
      invalidatesTags: (result, error, contestId) => [
        { type: "Contest", id: contestId },
        "Leaderboard",
      ],
    }),
  }),
});

export const {
  useGetAllContestsQuery,
  useGetContestByIdQuery,
  useGetMyContestsQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useDeleteContestMutation,
  useGetContestProblemsQuery,
  useAddProblemToContestMutation,
  useRemoveProblemFromContestMutation,
  useRegisterForContestMutation,
  useUnregisterFromContestMutation,
  useGetContestSubmissionsQuery,
  useGetContestLeaderboardQuery,
  useGetClarificationsQuery,
  useCreateClarificationMutation,
  useAnswerClarificationMutation,
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  usePublishResultsMutation,
} = contestsApi;
