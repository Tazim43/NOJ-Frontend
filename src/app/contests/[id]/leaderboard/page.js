"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useGetContestByIdQuery,
  useGetContestLeaderboardQuery,
} from "@/store/services/contestsApi";
import { FaMedal, FaTrophy, FaAward } from "react-icons/fa";

export default function ContestLeaderboardPage() {
  const { id } = useParams();
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: contestData, isLoading: contestLoading } =
    useGetContestByIdQuery(id);
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    refetch,
  } = useGetContestLeaderboardQuery(id, {
    pollingInterval: autoRefresh ? 30000 : 0, // Auto-refresh every 30 seconds
  });

  const contest = contestData?.contest;
  const leaderboard = leaderboardData?.data?.leaderboard || [];
  const isFrozen = leaderboardData?.data?.isFrozen || false;

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-400 text-xl" />;
    if (rank === 2) return <FaMedal className="text-gray-300 text-xl" />;
    if (rank === 3) return <FaMedal className="text-orange-400 text-xl" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-orange-400";
    return "text-gray-400";
  };

  if (contestLoading || leaderboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 min-h-screen text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
              Contest Leaderboard
            </h2>
            <h3 className="text-base sm:text-lg text-gray-400">
              {contest?.title}
            </h3>
            <Link
              href={`/contests/${id}/arena`}
              className="text-blue-400 hover:underline text-sm"
            >
              ← Back to Arena
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              Auto-refresh
            </label>
            <button
              onClick={() => refetch()}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Contest Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
          {isFrozen && (
            <div className="mb-4 bg-blue-900 border border-blue-700 rounded-lg p-3">
              <p className="text-blue-300 text-sm flex items-center gap-2">
                <span className="text-lg">❄️</span>
                <span>
                  Leaderboard is frozen. Final standings will be revealed after
                  the contest ends.
                </span>
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Scoring Type:</span>
              <span className="ml-2 font-semibold text-blue-400">
                {contest?.scoringType || "ICPC"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <span
                className={`ml-2 font-semibold ${
                  contest?.status === "ONGOING"
                    ? "text-green-400"
                    : contest?.status === "ENDED"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {contest?.status}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Participants:</span>
              <span className="ml-2 font-semibold text-purple-400">
                {leaderboard.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      {leaderboard.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-400 text-lg">No submissions yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Be the first to solve a problem!
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto overflow-x-auto touch-pan-x scroll-smooth rounded-xl shadow-md border border-gray-800">
          <table className="min-w-[800px] w-full text-xs sm:text-sm lg:text-base text-left border-separate border-spacing-y-1 sm:border-spacing-y-2">
            <thead className="bg-gray-800 text-gray-400 sticky top-0 z-10">
              <tr>
                <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                  Rank
                </th>
                <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                  Username
                </th>
                <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                  Score
                </th>
                <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                  Solved
                </th>
                {contest?.scoringType === "ICPC" && (
                  <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    Penalty
                  </th>
                )}
                <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                  Last Submission
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.userId._id}
                  className={`bg-gray-900 hover:bg-gray-800 transition duration-150 rounded-lg ${
                    entry.rank <= 3 ? "bg-opacity-90" : ""
                  }`}
                >
                  <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank)}
                      <span className={`font-bold ${getRankColor(entry.rank)}`}>
                        #{entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    <Link href={`/profile/${entry.userId.username}`}>
                      <button className="text-blue-400 hover:underline cursor-pointer font-medium">
                        {entry.userId.username}
                      </button>
                    </Link>
                  </td>
                  <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    <span className="font-bold text-green-400">
                      {entry.totalScore}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    <span className="text-teal-400">
                      {entry.problemsSolved}
                    </span>
                  </td>
                  {contest?.scoringType === "ICPC" && (
                    <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                      <span className="text-red-400">{entry.penalty}</span>
                    </td>
                  )}
                  <td className="p-2 sm:p-3 text-gray-300 whitespace-nowrap text-xs sm:text-sm">
                    <span className="block sm:hidden">
                      {new Date(entry.lastSubmissionTime).toLocaleTimeString()}
                    </span>
                    <span className="hidden sm:block">
                      {new Date(entry.lastSubmissionTime).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Scoring Info */}
      <div className="max-w-7xl mx-auto mt-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-sm">Scoring Rules:</h3>
        {contest?.scoringType === "ICPC" ? (
          <ul className="text-xs text-gray-400 space-y-1">
            <li>
              • Problems are scored as either solved (1) or not solved (0)
            </li>
            <li>
              • Penalty is calculated as: (time from contest start to AC) + (20
              minutes × wrong submissions)
            </li>
            <li>• Lower penalty is better in case of tie in problems solved</li>
          </ul>
        ) : (
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Each problem has a maximum score</li>
            <li>• Partial credit is awarded based on test cases passed</li>
            <li>• Your best submission for each problem counts</li>
          </ul>
        )}
      </div>
    </div>
  );
}
