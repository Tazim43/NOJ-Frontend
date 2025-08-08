"use client";

import React, { useState } from "react";
import SecondaryOutlineBtn from "../Buttons/SecondaryOutlineBtn";
import Link from "next/link";
import { useGetAllProblemsQuery } from "@/store/services/problemsApi";

const filters = [
  "ALL",
  "DP",
  "Graph",
  "Binary Search",
  "Number Theory",
  "More",
];

export default function LatestProblemList() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { data, error, isLoading } = useGetAllProblemsQuery();
  const problems = Array.isArray(data?.problems) ? data.problems : [];

  const filteredProblems = problems
    .filter((problem) => {
      if (selectedCategory === "ALL") return true;

      if (selectedCategory === "More") {
        const knownTags = filters.filter((t) => t !== "ALL" && t !== "More");
        return problem.tags.some((tag) => !knownTags.includes(tag));
      }

      return problem.tags.includes(selectedCategory);
    })
    .slice(-5)
    .reverse();

  if (isLoading)
    return <p className="p-6 text-white">Loading latest problems...</p>;

  if (error)
    return (
      <p className="p-6 text-red-500">
        Error loading problems. Please try again later.
      </p>
    );

  return (
    <section className="text-white py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Latest Problems
        </h2>

        {/* Filter Select Dropdown */}
        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="category-filter"
            className="block text-xs sm:text-sm font-medium text-gray-300 mb-2"
          >
            Filter by Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-1 text-sm sm:text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors duration-200 min-w-[150px] sm:min-w-[200px]"
          >
            {filters.map((filter) => (
              <option key={filter} value={filter} className="bg-gray-900">
                {filter}
              </option>
            ))}
          </select>
        </div>

        {/* Problem Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2 sm:border-spacing-y-3">
            <thead className="text-gray-400 text-xs sm:text-sm uppercase">
              <tr>
                <th className="p-2 sm:p-3 w-2/5 sm:w-auto">Title</th>
                <th className="p-2 sm:p-3 w-1/6 sm:w-auto">Time</th>
                <th className="p-2 sm:p-3 w-1/6 sm:w-auto">Memory</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">Tags</th>
                <th className="p-2 sm:p-3 w-1/6 sm:w-auto">Solved</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-4 sm:p-6 text-gray-400"
                  >
                    No recent problems found.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => (
                  <tr
                    key={problem._id}
                    className="bg-gray-900 hover:bg-gray-800 transition duration-200 rounded-lg"
                  >
                    <td className="p-2 sm:p-4 font-medium text-blue-400 text-sm sm:text-base w-2/5 sm:w-auto">
                      <Link
                        href={`/problemset/${problem._id}`}
                        className="hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="p-2 sm:p-4 text-teal-400 text-xs sm:tex-sm md:text-base w-1/6 sm:w-auto">
                      {problem.timeLimit} ms
                    </td>
                    <td className="p-2 sm:p-4 text-teal-400 text-xs sm:text-sm md:text-base w-1/6 sm:w-auto">
                      {problem.memoryLimit} MB
                    </td>
                    <td className="p-2 sm:p-4 text-gray-300 text-xs sm:text-sm md:text-base hidden sm:table-cell">
                      {problem.tags.length > 0
                        ? problem.tags.join(", ")
                        : "No tags"}
                    </td>
                    <td className="p-2 sm:p-4 text-gray-300 text-xs sm:text-sm w-1/6 sm:w-auto">
                      {problem.solveCount?.toLocaleString() ?? 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View All Problems Button */}
        <div className="mt-6 sm:mt-8">
          <SecondaryOutlineBtn url="/problemset" text="View All Problems" />
        </div>
      </div>
    </section>
  );
}
