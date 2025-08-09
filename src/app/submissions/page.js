"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetAllSubmissionsQuery } from "@/store/services/submissionsApi";

const languageMap = {
  105: "C++",
  103: "C",
  91: "Java",
  100: "Python",
};

export default function SubmissionsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useGetAllSubmissionsQuery({
    page: currentPage,
    limit: limit,
  });

  const submissions = data?.data?.submissions || [];
  const pagination = data?.data?.pagination || {};

  if (isLoading)
    return <p className="p-4 text-white text-center">Loading submissions...</p>;

  if (isError) {
    console.error("Error fetching submissions:", error);
    return (
      <p className="p-4 text-red-500 text-center">
        Error: {error?.data?.message || error.error}
      </p>
    );
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 min-h-screen text-white">
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 px-2">
        All Submissions
      </h2>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-400 px-2">No submissions found.</p>
      ) : (
        <>
          {/* Responsive Table View */}
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
                        <Link href={`/problemset/${sub.problemId._id}`}>
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

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6 px-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <FaChevronLeft className="text-sm" />
                Previous
              </button>

              <span className="text-gray-300 text-sm sm:text-base text-center px-2">
                Page {pagination.currentPage} of {pagination.totalPages}
                <span className="hidden sm:inline">
                  {" "}
                  ({pagination.totalSubmissions} total)
                </span>
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                Next
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
