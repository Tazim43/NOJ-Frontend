"use client";
import { useState } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa"; // Icons for completion status
import PrimaryOutlineBtn from "@/components/Buttons/PrimaryOutlineBtn";

const problems = [
  {
    name: "Binary Search Trees",
    difficulty: "Medium",
    tags: ["Trees", "Binary Search"],
    solves: 1230,
    solved: true,
  },
  {
    name: "Dynamic Programming",
    difficulty: "Hard",
    tags: ["DP", "Optimization"],
    solves: 850,
    solved: false,
  },
  {
    name: "Sorting Algorithms",
    difficulty: "Easy",
    tags: ["Sorting"],
    solves: 2300,
    solved: false,
  },
  {
    name: "Binary Search Trees",
    difficulty: "Medium",
    tags: ["Trees", "Binary Search"],
    solves: 1230,
    solved: true,
  },
];

const categories = ["ALL", "Binary Search", "DP", "Graphs", "More"];

export default function Problemset() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  return (
    <div className="p-8  min-h-screen text-white">
      <h2 className="text-3xl font-semibold mb-6">Problemset</h2>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        {categories.map((cat, index) => (
          <PrimaryOutlineBtn key={index} text={cat} />
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400">
              <th className="p-3">Problem Name</th>
              <th className="p-3">Difficulty</th>
              <th className="p-3">Tags</th>
              <th className="p-3">Solve Count</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr
                key={index}
                className="bg-gray-900 rounded-lg overflow-hidden"
              >
                <td className="p-4 flex items-center">
                  {problem.solved ? (
                    <FaCheckCircle className="text-teal-400 w-5 h-5 mr-3" />
                  ) : (
                    <FaRegCircle className="text-gray-500 w-5 h-5 mr-3" />
                  )}
                  <span className="font-semibold">{problem.name}</span>
                </td>
                <td className="p-4 text-teal-400">{problem.difficulty}</td>
                <td className="p-4 text-gray-300">{problem.tags.join(", ")}</td>
                <td className="p-4 text-gray-300">
                  Solved by {problem.solves.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
