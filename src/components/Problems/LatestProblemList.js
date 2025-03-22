import React from "react";
import PrimaryOutlineBtn from "../Buttons/PrimaryOutlineBtn.js";
import SecondaryOutlineBtn from "../Buttons/SecondaryOutlineBtn.js";

const problems = [
  {
    id: 1,
    title: "Binary Search",
    difficulty: "Medium",
    tags: "Trees, Binary",
    solved: "1,230",
    isSolved: false,
  },
  {
    id: 2,
    title: "Dynamic",
    difficulty: "Hard",
    tags: "DP, Optimization",
    solved: "850",
    isSolved: true,
  },
  {
    id: 3,
    title: "Sorting",
    difficulty: "Easy",
    tags: "Sorting",
    solved: "2,300",
    isSolved: false,
  },
];

const filters = ["ALL", "Binary Search", "DP", "Graphs", "More"];

function LatestProblemList() {
  return (
    <section className=" text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Latest problems</h2>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          {filters.map((filter, index) => (
            <PrimaryOutlineBtn key={index} text={filter} />
          ))}
        </div>

        {/* Problem Table */}
        <div className="space-y-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-gray-900 p-4 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                {problem.isSolved ? (
                  <span className="text-green-400 text-xl">✔</span>
                ) : (
                  <span className="text-gray-400 text-xl">○</span>
                )}
                <h3 className="text-lg font-semibold">{problem.title}</h3>
              </div>

              <span className="text-teal-400">{problem.difficulty}</span>
              <span className="text-gray-400">{problem.tags}</span>
              <span className="text-gray-400">Solved by {problem.solved}</span>
            </div>
          ))}
        </div>

        {/* View All Problems Button */}
        <div className="mt-6">
          <SecondaryOutlineBtn url="/problems" text="View All Problems" />
        </div>
      </div>
    </section>
  );
}

export default LatestProblemList;
