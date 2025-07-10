"use client";

import { useState } from "react";
import PrimaryOutlineBtn from "@/components/Buttons/PrimaryOutlineBtn";
import Link from "next/link";
import { useGetAllProblemsQuery } from "@/store/services/problemsApi";

const categories = [
  "ALL",
  "DP",
  "Graph",
  "Binary Search",
  "Number Theory",
  "More",
]; // You can add more static categories here

export default function Problemset() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { data, error, isLoading } = useGetAllProblemsQuery();
  const problems = Array.isArray(data?.problems) ? data.problems : [];

  // Filter problems based on selected category/tag
  const filteredProblems = problems.filter((problem) => {
    if (selectedCategory === "ALL") return true;

    if (selectedCategory === "More") {
      // Show problems that have at least one tag NOT in categories (excluding ALL and More)
      const knownTags = categories.filter((c) => c !== "ALL" && c !== "More");
      return problem.tags.some((tag) => !knownTags.includes(tag));
    }
    return problem.tags.includes(selectedCategory);
  });

  if (isLoading) return <p className="p-8 text-white">Loading problems...</p>;

  if (error)
    return (
      <p className="p-8 text-red-500">
        Error loading problems. Please try again later.
      </p>
    );

  return (
    <div className="p-8 min-h-screen text-white">
      <h2 className="text-3xl font-semibold mb-6">Problemset</h2>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        {categories.map((cat) => (
          <PrimaryOutlineBtn
            key={cat}
            text={cat}
            onClick={() => setSelectedCategory(cat)}
            active={selectedCategory === cat}
          />
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400">
              <th className="p-3">Problem Name</th>
              <th className="p-3">Time Limit (ms)</th>
              <th className="p-3">Memory Limit (MB)</th>
              <th className="p-3">Tags</th>
              <th className="p-3">Solve Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500">
                  No problems found.
                </td>
              </tr>
            ) : (
              filteredProblems.map((problem) => (
                <tr
                  key={problem._id}
                  className="bg-gray-900 rounded-lg overflow-hidden"
                >
                  <td className="p-4">
                    <Link
                      href={`/problemset/${problem._id}`}
                      className="font-semibold hover:underline text-blue-400"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="p-4 text-teal-400">{problem.timeLimit} ms</td>
                  <td className="p-4 text-teal-400">
                    {problem.memoryLimit} MB
                  </td>
                  <td className="p-4 text-gray-300">
                    {problem.tags.length > 0
                      ? problem.tags.join(", ")
                      : "No tags"}
                  </td>
                  <td className="p-4 text-gray-300">
                    {problem.solveCount.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
