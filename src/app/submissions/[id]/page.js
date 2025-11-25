"use client";

import { useParams } from "next/navigation";
import { useGetSubmissionByIdQuery } from "@/store/services/submissionsApi";
import { useState } from "react";
import SourceCodeModal from "@/components/Modals/SourceCodeModal";
import { FiRefreshCw } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";

const verdictStyle = (verdict) => {
  const v = verdict.toLowerCase();
  if (v === "accepted") return "bg-green-800 text-green-300";
  if (v.includes("wrong")) return "bg-red-800 text-red-300";
  if (v.includes("runtime")) return "bg-yellow-700 text-yellow-200";
  if (v.includes("time limit exceed")) return "bg-purple-800 text-purple-300";
  if (v === "skipped") return "bg-gray-700 text-gray-300";
  return "bg-red-600 text-white";
};

const languageMap = {
  54: "C++",
  50: "C",
  62: "Java",
  71: "Python",
};

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const { back } = useRouter();

  const {
    data,
    isLoading,
    error,
    refetch: reloadSubmission,
  } = useGetSubmissionByIdQuery(id);

  if (isLoading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (error || !data?.data) {
    return <div className="text-red-500 p-8">Error loading submission.</div>;
  }

  const submission = data.data;
  const decodedCode = atob(submission.source_code);

  const handleReload = async () => {
    setIsReloading(true);
    try {
      await reloadSubmission().unwrap?.();
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      {/* Back Button */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={back}
          className="text-sm cursor-pointer text-blue-400 hover:underline"
        >
          ← Go Back
        </button>

        {/* View Problem Link */}
        {submission.problemId && (
          <Link
            href={`/problemset/${submission.problemId}`}
            className="text-sm text-teal-400 hover:underline"
          >
            → View Problem
          </Link>
        )}
      </div>

      {/* Submission Info */}
      <section className="bg-gray-900 rounded-xl shadow-md p-4 md:p-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-teal-300 tracking-wide">
            Submission #{submission._id}
          </h2>

          <div className="flex gap-2">
            {/* Reload Button */}
            <button
              onClick={handleReload}
              disabled={isReloading}
              className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors duration-300"
              title="Reload Submission"
            >
              <FiRefreshCw
                className={`text-lg transition-transform duration-300 ${
                  isReloading ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">
                {isReloading ? "Reloading..." : "Reload"}
              </span>
            </button>

            {/* View Source Button */}
            <button
              onClick={() => setShowModal(true)}
              className="bg-teal-600 cursor-pointer hover:bg-teal-500 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              View Source
            </button>
          </div>
        </div>

        {/* Submission Summary Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm md:text-base">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="text-left py-2 w-14">#</th>
                <th className="text-left w-28">Time</th>
                <th className="text-left w-24">Language</th>
                <th className="text-left w-16">CPU</th>
                <th className="text-left w-20">Memory</th>
                <th className="text-right w-32 pr-2">Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800 hover:bg-gray-800 transition duration-150">
                <td className="py-3 px-2 font-mono text-blue-400">
                  {submission._id.substring(0, 6)}
                </td>
                <td className="px-2">
                  {new Date(submission.createdAt).toLocaleString()}
                </td>
                <td className="px-2">
                  {languageMap[submission.languageId] ||
                    `Lang ID ${submission.languageId}`}
                </td>
                <td className="px-2">{submission.executionTime} ms</td>
                <td className="px-2">{submission.memoryUsed} KB</td>
                <td className="px-2 text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${verdictStyle(
                      submission.finalVerdict
                    )}`}
                  >
                    {submission.finalVerdict.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tests Table */}
      <section className="bg-gray-900 rounded-xl shadow-md p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-teal-300 mb-6 tracking-wide">
          Tests
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm md:text-base">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="text-left py-2 w-12">#</th>
                <th className="text-left w-24">CPU</th>
                <th className="text-left w-28">Memory</th>
                <th className="text-right w-32 pr-2">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {submission.testCaseResults.map((run, index) => (
                <tr
                  key={run._id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition duration-150"
                >
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="px-2">
                    {(run.executionTime * 1000).toFixed(0)} ms
                  </td>
                  <td className="px-2">{run.memoryUsed} KB</td>
                  <td className="px-2 text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${verdictStyle(
                        run.verdict
                      )}`}
                    >
                      {run.verdict.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <SourceCodeModal
          code={decodedCode}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default SubmissionDetailPage;
