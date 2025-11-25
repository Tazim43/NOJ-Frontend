"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  useGetContestByIdQuery,
  useGetContestProblemsQuery,
} from "@/store/services/contestsApi";
import { useSubmitSolutionMutation } from "@/store/services/submissionsApi";
import { useGetAllSampleTestcasesQuery } from "@/store/services/testcasesApi";
import ProblemStatement from "@/components/ProblemPage/ProblemStatement.js";
import dynamic from "next/dynamic";
import ContestTimer from "@/components/Contests/ContestTimer";
import Link from "next/link";
import "katex/dist/katex.min.css";

const CodeEditorPanel = dynamic(
  () => import("@/components/CodeEditor/CodeEditorPanel.js"),
  { ssr: false }
);

const languageOptions = [
  { id: 50, name: "C (GCC 9.2.0)", extension: "c" },
  { id: 54, name: "C++ (GCC 9.2.0)", extension: "cpp" },
  { id: 62, name: "Java (OpenJDK 13.0.1)", extension: "java" },
  { id: 71, name: "Python (3.8.1)", extension: "py" },
];

export default function ContestProblemPage() {
  const { id: contestId, problemId } = useParams();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const [leftWidth, setLeftWidth] = useState(60); // %
  const isDragging = useRef(false);

  const { data: contestData } = useGetContestByIdQuery(contestId);
  const { data: problemsData } = useGetContestProblemsQuery(contestId);
  const { data: sampleTestcases } = useGetAllSampleTestcasesQuery(problemId, {
    skip: !problemId,
  });

  const contest = contestData?.contest;
  const problems = problemsData?.data?.problems || [];
  const problem = problems.find((p) => p._id === problemId);
  const sampleTests = sampleTestcases || [];

  const contestEnded = contest && new Date() > new Date(contest.endTime);
  const contestStarted = contest && new Date() >= new Date(contest.startTime);

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

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
          <Link href={`/contests/${contestId}/arena`}>
            <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg">
              Back to Contest
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-400">
            {problem.label}
          </span>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold truncate">
            {problem.title}
          </h1>
        </div>
        {contest?.status === "ONGOING" && (
          <ContestTimer
            startTime={contest.startTime}
            endTime={contest.endTime}
          />
        )}
      </header>

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Problem Section */}
        <section
          className="bg-gray-800 overflow-auto p-3 sm:p-4 md:p-6 w-full md:w-auto"
          style={{
            width: window.innerWidth >= 768 ? `${leftWidth}%` : "100%",
          }}
        >
          <div className="mb-3 sm:mb-4">
            <Link
              href={`/contests/${contestId}/arena`}
              className="text-blue-400 hover:underline text-sm inline-block mb-4"
            >
              ← Back to Contest Arena
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-green-400 font-semibold text-sm sm:text-base">
                {problem.difficulty}
              </span>
              <span className="text-gray-400">| Tags:</span>
              {problem.tags && problem.tags.length > 0 ? (
                problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-700 text-gray-300 px-1.5 py-0.5 sm:px-2 rounded-md text-xs sm:text-sm select-none"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 italic text-xs sm:text-sm">
                  No tags
                </span>
              )}
              {problem.score && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="text-purple-400 font-semibold text-sm sm:text-base">
                    {problem.score} points
                  </span>
                </>
              )}
            </div>
          </div>

          {!contestStarted && (
            <div className="mb-4 sm:mb-6 border border-yellow-500 bg-yellow-950 rounded p-3 sm:p-4 text-yellow-400 font-medium text-sm sm:text-base">
              ⏳ Contest has not started yet. Problem details will be available
              when the contest begins.
            </div>
          )}

          {contestEnded && (
            <div className="mb-4 sm:mb-6 border border-red-500 bg-red-950 rounded p-3 sm:p-4 text-red-400 font-medium text-sm sm:text-base">
              ⏱️ Contest has ended. Submissions are no longer accepted.
            </div>
          )}

          {problem.statementId ? (
            <>
              <section className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 border-b border-gray-700 pb-1">
                  Problem Statement
                </h2>
                <ProblemStatement content={problem.statementId.description} />
              </section>

              <section className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1">
                  Input
                </h3>
                <ProblemStatement
                  content={problem.statementId.inputDescription}
                />
              </section>

              <section className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1">
                  Output
                </h3>
                <ProblemStatement
                  content={problem.statementId.outputDescription}
                />
              </section>
            </>
          ) : (
            <div className="mb-4 sm:mb-6 border border-red-500 bg-red-950 rounded p-3 sm:p-4 text-red-400 font-medium text-sm sm:text-base">
              No statement available.
            </div>
          )}

          {/* Sample Testcases */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 border-b border-gray-700 pb-1">
              Sample Testcases
            </h2>

            {sampleTests.length === 0 ? (
              <p className="text-gray-400 italic text-sm sm:text-base">
                No sample testcases available.
              </p>
            ) : (
              sampleTests.map((test, idx) => (
                <div
                  key={test._id}
                  className="mb-3 sm:mb-4 rounded-md bg-gray-900 border border-gray-700 p-3 sm:p-4"
                >
                  <h3 className="font-semibold mb-2 text-teal-400 text-sm sm:text-base">
                    Sample Test {idx + 1}
                  </h3>
                  <div>
                    <strong className="text-sm sm:text-base">Input:</strong>
                    <pre className="bg-black rounded p-2 mt-1 text-green-400 whitespace-pre-wrap max-h-32 sm:max-h-48 overflow-auto text-xs sm:text-sm">
                      {test.input ? base64Decode(test.input) : "[No input]"}
                    </pre>
                  </div>
                  <div className="mt-2">
                    <strong className="text-sm sm:text-base">
                      Expected Output:
                    </strong>
                    <pre className="bg-black rounded p-2 mt-1 text-blue-400 whitespace-pre-wrap max-h-32 sm:max-h-48 overflow-auto text-xs sm:text-sm">
                      {test.expectedOutput
                        ? base64Decode(test.expectedOutput)
                        : "[No output]"}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </section>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2">
              Constraints
            </h3>
            <ul className="text-gray-300 text-xs sm:text-sm space-y-1">
              <li>Time Limit: {problem.timeLimit} ms</li>
              <li>Memory Limit: {problem.memoryLimit} MB</li>
            </ul>
          </div>
        </section>

        {/* Resizer - only on desktop */}
        <div
          onMouseDown={handleMouseDown}
          className="hidden md:block w-1 cursor-col-resize bg-gray-600 hover:bg-gray-500"
          style={{ width: "4px" }}
        ></div>

        {/* Code Editor Section */}
        <section
          className="bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700 overflow-auto w-full md:w-auto min-h-[50vh] md:min-h-auto"
          style={{
            width: window.innerWidth >= 768 ? `${100 - leftWidth}%` : "100%",
          }}
        >
          <div className="h-full p-3 sm:p-4">
            <CodeEditorPanel id={problemId} contestId={contestId} />
          </div>
        </section>
      </main>
    </div>
  );
}
