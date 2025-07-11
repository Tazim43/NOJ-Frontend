"use client";

import React from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { useGetMySubmissionsQuery } from "@/store/services/submissionsApi";

const languageMap = {
  105: "C++",
  103: "C",
  91: "Java",
  100: "Python",
};

export default function SubmissionsPage() {
  const { data, isLoading, isError, error } = useGetMySubmissionsQuery();
  const submissions = [...(data?.data?.submissions ?? [])].reverse();

  if (isLoading)
    return <p className="p-4 text-white text-center">Loading submissions...</p>;

  if (isError)
    return (
      <p className="p-4 text-red-500 text-center">
        Error: {error?.data?.message || error.error}
      </p>
    );

  return (
    <div className=" min-h-screen text-white">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
        Recent Submissions
      </h2>

      {submissions.length === 0 ? (
        <p className="text-center text-gray-400">No submissions found.</p>
      ) : (
        <div className="w-full overflow-x-auto touch-pan-x scroll-smooth rounded-xl shadow-md border border-gray-800">
          <table className="min-w-[640px] w-full text-sm sm:text-base text-left border-separate border-spacing-y-2">
            <thead className="bg-gray-800 text-gray-400 sticky top-0 z-10">
              <tr>
                <th className="p-3 whitespace-nowrap">ID</th>
                <th className="p-3 whitespace-nowrap">When</th>
                <th className="p-3 whitespace-nowrap hidden sm:table-cell">
                  Language
                </th>
                <th className="p-3 whitespace-nowrap">Verdict</th>
                <th className="p-3 whitespace-nowrap hidden md:table-cell">
                  Time
                </th>
                <th className="p-3 whitespace-nowrap hidden md:table-cell">
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
                    <td className="p-3 font-mono text-blue-400 whitespace-nowrap">
                      <Link href={`/submissions/${sub._id}`}>
                        <button className="hover:underline cursor-pointer">
                          {sub._id.slice(-6)}
                        </button>
                      </Link>
                    </td>
                    <td className="p-3 text-gray-300 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-300 whitespace-nowrap hidden sm:table-cell">
                      {languageMap[sub.languageId] || sub.languageId}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {isAccepted ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <FaCheckCircle className="text-sm" /> Accepted
                        </span>
                      ) : verdictLower.includes("wrong") ? (
                        <span className="text-red-400">
                          {sub.finalVerdict.replace(/_/g, " ")}
                        </span>
                      ) : (
                        <span className="text-yellow-400">
                          {sub.finalVerdict.replace(/_/g, " ")}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-gray-300 whitespace-nowrap hidden md:table-cell">
                      {sub.executionTime} ms
                    </td>
                    <td className="p-3 text-gray-300 whitespace-nowrap hidden md:table-cell">
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
  );
}
