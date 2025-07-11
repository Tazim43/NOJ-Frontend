"use client";

import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useGetAllTestcasesQuery,
  useDeleteTestcaseMutation,
} from "@/store/services/testcasesApi";

export default function TestsPage() {
  const pathname = usePathname();
  const [problemId, setProblemId] = useState(null);
  const [deleteTestcase] = useDeleteTestcaseMutation();

  useEffect(() => {
    if (pathname) {
      const segments = pathname.split("/");
      const createProblemIndex = segments.findIndex(
        (seg) => seg === "create-problem"
      );
      if (
        createProblemIndex !== -1 &&
        segments.length > createProblemIndex + 2
      ) {
        const pid = segments[createProblemIndex + 1];
        const nextSegment = segments[createProblemIndex + 2];
        if (nextSegment === "tests") {
          setProblemId(pid);
        }
      }
    }
  }, [pathname]);

  const {
    data: tests,
    isLoading,
    isError,
    refetch,
  } = useGetAllTestcasesQuery(problemId, {
    skip: !problemId,
  });

  const handleDelete = async (testcaseId) => {
    if (!confirm("Are you sure you want to delete this test?")) return;
    try {
      await deleteTestcase({ problemId, testcaseId }).unwrap();
      alert("Test deleted successfully.");
      refetch();
    } catch (err) {
      alert("Failed to delete test.");
      console.error(err);
    }
  };

  if (!problemId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        <p>Problem ID not found in URL.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-semibold">
        <p>Loading tests...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        <p>Failed to load tests.</p>
      </div>
    );
  }

  if (!tests || tests.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 font-medium gap-4">
        <p>No tests available for this problem.</p>
        <Link href={`/create-problem/${problemId}/tests/add`}>
          <button className="bg-teal-500 px-5 py-2 rounded-md hover:bg-teal-600 transition text-white font-semibold">
            + Add Test
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6  mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-teal-400">Tests</h1>
        <Link href={`/create-problem/${problemId}/tests/add`}>
          <button className="bg-teal-500 cursor-pointer px-5 py-2 rounded-md hover:bg-teal-600 transition text-white font-semibold">
            + Add Test
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {tests.map((test, idx) => (
          <div
            key={test._id}
            className="bg-gray-900 rounded-lg px-6 py-4 flex justify-between items-center border border-gray-800 hover:border-teal-500 transition"
          >
            {/* Left Side: Test Info */}
            <div className="flex flex-col gap-1 max-w-[65%]">
              <span className="text-lg font-medium text-blue-400 cursor-default">
                {test.isSample
                  ? `Sample Test - ${idx + 1}`
                  : `Test - ${idx + 1}`}
              </span>

              <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
                <span className="flex items-center gap-1 truncate">
                  <FaFileAlt className="text-gray-500" />
                  Input size:{" "}
                  {test.input ? `${atob(test.input).length} B` : "0 B"}, Output
                  size:{" "}
                  {test.expectedOutput
                    ? `${atob(test.expectedOutput).length} B`
                    : "0 B"}
                </span>
                <span>Weight: 1</span>
              </div>
            </div>

            {/* Right Side: Metadata and Delete */}
            <div className="flex items-center gap-4 text-sm text-gray-400 min-w-[140px]">
              <div className="flex flex-col items-end">
                <div>CPU: {test.cpu_time?.toFixed(3)}s</div>
                <div>Memory: {test.memory} KB</div>
              </div>
              <button
                onClick={() => handleDelete(test._id)}
                className="text-red-500 hover:text-red-600 transition p-1 rounded"
                title="Delete Test"
                aria-label="Delete Test"
              >
                <FaTrash className="text-lg" />
              </button>
              <BsThreeDotsVertical className="text-gray-500 hover:text-white cursor-pointer text-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
