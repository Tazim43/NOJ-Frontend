"use client";

import React from "react";
import Link from "next/link";
import ProblemStatement from "@/components/ProblemPage/ProblemStatement.js";

export default function ProblemDetails({ problem }) {
  return (
    <section
      className="bg-gray-800 overflow-auto p-6"
      style={{ height: "100%" }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="text-green-400 font-semibold">
          {problem.difficulty}
        </span>
        <span className="text-gray-400">| Tags:</span>
        {problem.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md text-sm select-none"
          >
            {tag}
          </span>
        ))}
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 border-b border-gray-700 pb-1">
          Problem Statement
        </h2>
        <ProblemStatement content={problem.statement} />
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Input</h3>
        <ProblemStatement content={problem.input} />
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Output</h3>
        <ProblemStatement content={problem.output} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-md font-semibold mb-1">Sample Input</h4>
          <pre className="bg-black border border-green-600 rounded p-2 text-green-400 whitespace-pre-wrap max-h-60 overflow-auto">
            {problem.sampleInput}
          </pre>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-1">Sample Output</h4>
          <pre className="bg-black border border-blue-600 rounded p-2 text-blue-400 whitespace-pre-wrap max-h-60 overflow-auto">
            {problem.sampleOutput}
          </pre>
        </div>
      </section>

      <div>
        <Link href="/problemset" className="text-blue-500 hover:underline">
          ← Back to Problemset
        </Link>
      </div>
    </section>
  );
}
