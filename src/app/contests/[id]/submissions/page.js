"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import {
  useGetContestByIdQuery,
  useGetContestSubmissionsQuery,
} from "@/store/services/contestsApi";

const languageMap = {
  54: "C++",
  50: "C",
  62: "Java",
  71: "Python",
};

export default function ContestSubmissionsPage() {
  const { id } = useParams();

  const { data: contestData, isLoading: contestLoading } =
    useGetContestByIdQuery(id);
  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetContestSubmissionsQuery(id);

  const contest = contestData?.contest;
  const submissions = submissionsData?.data || [];

  if (contestLoading || submissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 px-2">
          Contest Submissions
        </h2>
        <h3 className="text-base sm:text-lg text-gray-400 mb-4 px-2">
          {contest?.title}
        </h3>
        <Link
          href={`/contests/${id}/arena`}
          className="text-blue-400 hover:underline text-sm px-2 inline-block mb-6"
        >
          ← Back to Arena
        </Link>

        {submissions.length === 0 ? (
          <p className="text-center text-gray-400 px-2 py-12">
            No submissions found for this contest.
          </p>
        ) : (
          <div className="w-full overflow-x-auto touch-pan-x scroll-smooth rounded-xl shadow-md border border-gray-800">
            <table className="min-w-[800px] w-full text-xs sm:text-sm lg:text-base text-left border-separate border-spacing-y-1 sm:border-spacing-y-2">
              <thead className="bg-gray-800 text-gray-400 sticky top-0 z-10">
                <tr>
                  <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    ID
                  </th>
                  <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    User
                  </th>
                  <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    Problem
                  </th>
                  <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    When
                  </th>
                  <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    Language
                  </th>
                  <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    Verdict
                  </th>
                  <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    Time
                  </th>
                  <th className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                    Memory
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const verdictLower = sub.finalVerdict.toLowerCase();
                  const isAccepted = verdictLower === "accepted";

                  return (
                    <tr
                      key={sub._id}
                      className="bg-gray-900 hover:bg-gray-800 transition duration-150 rounded-lg"
                    >
                      <td className="p-2 sm:p-3 font-mono text-blue-400 whitespace-nowrap text-xs sm:text-sm">
                        <Link href={`/submissions/${sub._id}`}>
                          <button className="hover:underline cursor-pointer">
                            {sub._id.slice(-6)}
                          </button>
                        </Link>
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                        <Link href={`/profile/${sub.userId.username}`}>
                          <button className="text-blue-400 hover:underline cursor-pointer max-w-[80px] sm:max-w-none truncate block">
                            {sub.userId.username}
                          </button>
                        </Link>
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap max-w-[120px] sm:max-w-[200px] text-xs sm:text-sm">
                        <Link
                          href={`/contests/${id}/problems/${sub.problemId._id}`}
                        >
                          <button className="text-blue-400 hover:underline cursor-pointer truncate block">
                            {sub.problemId.title}
                          </button>
                        </Link>
                      </td>
                      <td className="p-2 sm:p-3 text-gray-300 whitespace-nowrap text-xs sm:text-sm">
                        <span className="block sm:hidden">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                        <span className="hidden sm:block">
                          {new Date(sub.createdAt).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-gray-300 whitespace-nowrap text-xs sm:text-sm">
                        <span className="block sm:hidden">
                          {languageMap[sub.languageId]?.substring(0, 3) ||
                            sub.languageId}
                        </span>
                        <span className="hidden sm:block">
                          {languageMap[sub.languageId] || sub.languageId}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                        {isAccepted ? (
                          <span className="text-green-400 flex items-center gap-1">
                            <FaCheckCircle className="text-xs sm:text-sm" />
                            <span className="hidden sm:inline">Accepted</span>
                            <span className="sm:hidden">AC</span>
                          </span>
                        ) : verdictLower.includes("wrong") ? (
                          <span className="text-red-400">
                            <span className="block sm:hidden">WA</span>
                            <span className="hidden sm:block">
                              {sub.finalVerdict.replace(/_/g, " ")}
                            </span>
                          </span>
                        ) : (
                          <span className="text-yellow-400">
                            <span className="block sm:hidden">
                              {sub.finalVerdict.substring(0, 3)}
                            </span>
                            <span className="hidden sm:block">
                              {sub.finalVerdict.replace(/_/g, " ")}
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="p-2 sm:p-3 text-gray-300 whitespace-nowrap text-xs sm:text-sm">
                        {sub.executionTime} ms
                      </td>
                      <td className="p-2 sm:p-3 text-gray-300 whitespace-nowrap text-xs sm:text-sm">
                        {sub.memoryUsed} KB
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
