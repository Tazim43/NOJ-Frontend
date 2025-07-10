"use client";

import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProblemStatement from "@/components/ProblemPage/ProblemStatement.js";
import Link from "next/link";
import dynamic from "next/dynamic";
import "katex/dist/katex.min.css";
import { useGetProblemByIdQuery } from "@/store/services/problemsApi";
import { useGetAllTestcasesQuery } from "@/store/services/testcasesApi";

const CodeEditorPanel = dynamic(
  () => import("@/components/CodeEditor/CodeEditorPanel.js"),
  {
    ssr: false,
  }
);

function base64Decode(str) {
  try {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  } catch {
    return "[Invalid base64]";
  }
}

export default function ProblemPage() {
  const { id } = useParams();

  const { data: problem, isLoading, isError } = useGetProblemByIdQuery(id);

  // Fetch all testcases for this problem
  const {
    data: testcases,
    isLoading: testcasesLoading,
    isError: testcasesError,
  } = useGetAllTestcasesQuery(id, {
    skip: !id,
  });

  const [leftWidth, setLeftWidth] = useState(60); // %
  const isDragging = useRef(false);

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const totalWidth = window.innerWidth;
    const newLeftWidth = (e.clientX / totalWidth) * 100;
    if (newLeftWidth > 20 && newLeftWidth < 80) setLeftWidth(newLeftWidth);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (isLoading)
    return (
      <div className="text-white p-8">
        <p>Loading problem details...</p>
      </div>
    );

  if (isError || !problem)
    return (
      <div className="text-white p-8">
        <h2 className="text-2xl font-semibold">Problem not found</h2>
        <Link href="/problemset" className="text-blue-500 hover:underline">
          ← Back to Problemset
        </Link>
      </div>
    );

  // Filter sample testcases
  const sampleTests = testcases?.filter((test) => test.isSample) || [];

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      <header className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold truncate w-full sm:w-auto">
          {problem.title}
        </h1>
      </header>

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Problem Section */}
        <section
          className="bg-gray-800 overflow-auto p-4 md:p-6"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {problem.difficulty ? (
              <span className="text-green-400 font-semibold">
                {problem.difficulty}
              </span>
            ) : (
              <span className="text-gray-400 font-semibold">{"Unknown"}</span>
            )}

            <span className="text-gray-400 hidden sm:inline">| Tags:</span>
            {problem.tags && problem.tags.length > 0 ? (
              problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md text-sm select-none"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-gray-500 italic">No tags</span>
            )}
          </div>

          {problem.statementId ? (
            <>
              <section className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2 border-b border-gray-700 pb-1">
                  Problem Statement
                </h2>
                <ProblemStatement content={problem.statementId.description} />
              </section>

              <section className="mb-6">
                <h3 className="text-base md:text-lg font-semibold mb-1">
                  Input
                </h3>
                <ProblemStatement
                  content={problem.statementId.inputDescription}
                />
              </section>

              <section className="mb-6">
                <h3 className="text-base md:text-lg font-semibold mb-1">
                  Output
                </h3>
                <ProblemStatement
                  content={problem.statementId.outputDescription}
                />
              </section>
            </>
          ) : (
            <div className="mb-6 border border-red-500 bg-red-950 rounded p-4 text-red-400 font-medium">
              No statement available.
            </div>
          )}

          {/* Sample Testcases Section */}
          <section className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold mb-2 border-b border-gray-700 pb-1">
              Sample Testcases
            </h2>

            {testcasesLoading && <p>Loading sample testcases...</p>}
            {testcasesError && (
              <p className="text-red-500">Failed to load sample testcases.</p>
            )}

            {!testcasesLoading &&
              !testcasesError &&
              sampleTests.length === 0 && (
                <p className="text-gray-400 italic">
                  No sample testcases available.
                </p>
              )}

            {sampleTests.map((test, idx) => (
              <div
                key={test._id}
                className="mb-4 rounded-md bg-gray-900 border border-gray-700 p-4"
              >
                <h3 className="font-semibold mb-2 text-teal-400">
                  Sample Test {idx + 1}
                </h3>
                <div>
                  <strong>Input:</strong>
                  <pre className="bg-black rounded p-2 mt-1 text-green-400 whitespace-pre-wrap max-h-48 overflow-auto text-sm">
                    {test.input ? base64Decode(test.input) : "[No input]"}
                  </pre>
                </div>
                <div className="mt-2">
                  <strong>Expected Output:</strong>
                  <pre className="bg-black rounded p-2 mt-1 text-blue-400 whitespace-pre-wrap max-h-48 overflow-auto text-sm">
                    {test.expectedOutput
                      ? base64Decode(test.expectedOutput)
                      : "[No output]"}
                  </pre>
                </div>
              </div>
            ))}
          </section>

          <div>
            <Link href="/problemset" className="text-blue-500 hover:underline">
              ← Back to Problemset
            </Link>
          </div>
        </section>

        {/* Resizer - only on desktop */}
        <div
          onMouseDown={handleMouseDown}
          className="hidden md:block w-1 cursor-col-resize bg-gray-600 hover:bg-gray-500"
          style={{ width: "4px" }}
        ></div>

        {/* Code Editor Panel */}
        <section
          className="bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700 overflow-auto"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="h-full p-4">
            <CodeEditorPanel id={id} />
          </div>
        </section>
      </main>
    </div>
  );
}
