"use client";

import React, { useState } from "react";
import PrimaryOutlineBtn from "../Buttons/PrimaryOutlineBtn";
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
    <section className="text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Latest Problems</h2>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {filters.map((filter, index) => (
            <PrimaryOutlineBtn
              key={index}
              text={filter}
              onClick={() => setSelectedCategory(filter)}
              active={selectedCategory === filter}
            />
          ))}
        </div>

        {/* Problem Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="text-gray-400 text-sm uppercase">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Time Limit</th>
                <th className="p-3">Memory Limit</th>
                <th className="p-3">Tags</th>
                <th className="p-3">Solve Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-400">
                    No recent problems found.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => (
                  <tr
                    key={problem._id}
                    className="bg-gray-900 hover:bg-gray-800 transition duration-200 rounded-lg"
                  >
                    <td className="p-4 font-medium text-blue-400">
                      <Link
                        href={`/problemset/${problem._id}`}
                        className="hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="p-4 text-teal-400">
                      {problem.timeLimit} ms
                    </td>
                    <td className="p-4 text-teal-400">
                      {problem.memoryLimit} MB
                    </td>
                    <td className="p-4 text-gray-300">
                      {problem.tags.length > 0
                        ? problem.tags.join(", ")
                        : "No tags"}
                    </td>
                    <td className="p-4 text-gray-300">
                      {problem.solveCount?.toLocaleString() ?? 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View All Problems Button */}
        <div className="mt-8">
          <SecondaryOutlineBtn url="/problemset" text="View All Problems" />
        </div>
      </div>
    </section>
  );
}
