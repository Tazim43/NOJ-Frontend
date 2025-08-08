"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetAllProblemsQuery } from "@/store/services/problemsApi";

const categories = [
  "ALL",
  "DP",
  "Graph",
  "Binary Search",
  "Number Theory",
  "More",
];

export default function Problemset() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { data, error, isLoading } = useGetAllProblemsQuery();
  const problems = Array.isArray(data?.problems) ? data.problems : [];

  // Filter problems based on selected category/tag
  const filteredProblems = problems.filter((problem) => {
    if (selectedCategory === "ALL") return true;

    if (selectedCategory === "More") {
      const knownTags = categories.filter((c) => c !== "ALL" && c !== "More");
      return problem.tags.some((tag) => !knownTags.includes(tag));
    }
    return problem.tags.includes(selectedCategory);
  });

  if (isLoading) return <p className="p-6 text-white">Loading problems...</p>;

  if (error)
    return (
      <p className="p-6 text-red-500">
        Error loading problems. Please try again later.
      </p>
    );

  return (
    <div className="min-h-screen text-white py-8 sm:py-10 md:py-12 px-3 sm:px-6 md:px-12">
      <div className=" mx-auto">
        {/* Header with Title and Filter */}
        <div className="flex items-start justify-between mb-4 sm:mb-6 gap-4">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold">
            Problemset
          </h2>

          {/* Filter Select Dropdown */}
          <div className="flex flex-col items-end">
            <label
              htmlFor="category-filter"
              className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
            >
              Filter by Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors duration-200 min-w-[120px] sm:min-w-[200px]"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-gray-900">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2 sm:border-spacing-y-3">
            <thead className="text-gray-400 text-xs sm:text-sm uppercase">
              <tr>
                <th className="p-2 sm:p-3 w-2/5 sm:w-auto">Problem Name</th>
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
                    No problems found.
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
                    <td className="p-2 sm:p-4 text-teal-400 text-xs sm:text-sm md:text-base w-1/6 sm:w-auto">
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
      </div>
    </div>
  );
}
