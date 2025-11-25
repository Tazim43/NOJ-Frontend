"use client";

import { useParams } from "next/navigation";
import {
  useGetContestByIdQuery,
  useGetContestProblemsQuery,
} from "@/store/services/contestsApi";
import ContestTimer from "@/components/Contests/ContestTimer";
import Link from "next/link";
import { FiCheckCircle, FiCircle, FiXCircle } from "react-icons/fi";

export default function ContestArenaPage() {
  const { id } = useParams();

  const { data: contestData, isLoading: contestLoading } =
    useGetContestByIdQuery(id);
  const {
    data: problemsData,
    isLoading: problemsLoading,
    error: problemsError,
  } = useGetContestProblemsQuery(id);

  const contest = contestData?.contest;
  const problems = problemsData?.data?.problems || [];

  // Debug logging
  console.log("Contest:", contest);
  console.log("Problems Data:", problemsData);
  console.log("Problems Error:", problemsError);

  if (contestLoading || problemsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Contest not found</h2>
          <Link href="/contests">
            <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg">
              Back to Contests
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {contest.title}
            </h1>
            <Link
              href={`/contests/${id}`}
              className="text-blue-400 hover:underline text-sm"
            >
              ← Back to Contest
            </Link>
          </div>
          {contest.status === "ONGOING" && (
            <ContestTimer
              startTime={contest.startTime}
              endTime={contest.endTime}
            />
          )}
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Problems</h2>
          {contest?.status === "ENDED" && (
            <span className="text-red-400 text-sm font-medium">
              Contest Ended - View Only
            </span>
          )}
        </div>

        {problemsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-3">Loading problems...</p>
          </div>
        ) : problems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2 sm:border-spacing-y-3">
              <thead className="text-gray-400 text-xs sm:text-sm uppercase">
                <tr>
                  <th className="p-2 sm:p-3">#</th>
                  <th className="p-2 sm:p-3 w-2/5 sm:w-auto">Problem Name</th>
                  <th className="p-2 sm:p-3 hidden sm:table-cell">
                    Difficulty
                  </th>
                  <th className="p-2 sm:p-3 w-1/6 sm:w-auto">Score</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">Time</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">Memory</th>
                  <th className="p-2 sm:p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem) => (
                  <tr
                    key={problem._id}
                    className="bg-gray-800 hover:bg-gray-700 transition duration-200 rounded-lg"
                  >
                    <td className="p-2 sm:p-4 font-bold text-blue-400 text-base sm:text-lg">
                      {problem.label}
                    </td>
                    <td className="p-2 sm:p-4 font-medium text-sm sm:text-base">
                      <Link
                        href={`/contests/${id}/problems/${problem._id}`}
                        className="hover:underline text-blue-400"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="p-2 sm:p-4 text-xs sm:text-sm hidden sm:table-cell">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          problem.difficulty === "Easy"
                            ? "bg-green-500/20 text-green-400"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="p-2 sm:p-4 text-purple-400 text-xs sm:text-sm font-semibold">
                      {problem.score || 100}
                    </td>
                    <td className="p-2 sm:p-4 text-teal-400 text-xs sm:text-sm hidden md:table-cell">
                      {problem.timeLimit} ms
                    </td>
                    <td className="p-2 sm:p-4 text-teal-400 text-xs sm:text-sm hidden md:table-cell">
                      {problem.memoryLimit} MB
                    </td>
                    <td className="p-2 sm:p-4">
                      <div className="flex items-center gap-2">
                        <FiCircle className="text-gray-500 text-sm" />
                        <span className="text-xs text-gray-400 hidden sm:inline">
                          Not attempted
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-2">No problems available</p>
            {contest?.status === "UPCOMING" && (
              <p className="text-sm text-gray-500">
                Problems will be visible when the contest starts
              </p>
            )}
            {problemsError && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 font-medium">
                  Error loading problems
                </p>
                <p className="text-sm text-red-300 mt-2">
                  {problemsError?.data?.message ||
                    problemsError?.error ||
                    "Failed to load problems. You may need to register for this contest or wait for it to start."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Link href={`/contests/${id}/leaderboard`}>
          <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-6 text-center cursor-pointer transition">
            <h3 className="font-semibold mb-2">Leaderboard</h3>
            <p className="text-sm text-gray-400">View current standings</p>
          </div>
        </Link>
        <Link href={`/contests/${id}`}>
          <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-6 text-center cursor-pointer transition">
            <h3 className="font-semibold mb-2">My Submissions</h3>
            <p className="text-sm text-gray-400">View your submissions</p>
          </div>
        </Link>
        <Link href={`/contests/${id}`}>
          <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-6 text-center cursor-pointer transition">
            <h3 className="font-semibold mb-2">Announcements</h3>
            <p className="text-sm text-gray-400">Check for updates</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
