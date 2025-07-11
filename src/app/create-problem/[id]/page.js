"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetProblemByIdQuery,
  useUpdateProblemMutation,
  useUpdateProblemVisibilityMutation,
} from "@/store/services/problemsApi";

export default function EditProblemPage() {
  const { id: problemId } = useParams();

  const {
    data: problem,
    isLoading,
    isError,
  } = useGetProblemByIdQuery(problemId, {
    skip: !problemId,
  });

  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(1000);
  const [memoryLimit, setMemoryLimit] = useState(256);
  const [isVisible, setIsVisible] = useState(false);
  const [originalVisibility, setOriginalVisibility] = useState(false);

  const [updateProblem, { isLoading: isUpdating }] = useUpdateProblemMutation();
  const [updateVisibility, { isLoading: isVisibilityUpdating }] =
    useUpdateProblemVisibilityMutation();

  useEffect(() => {
    if (problem) {
      setTitle(problem.title || "");
      setTimeLimit(problem.timeLimit || 1000);
      setMemoryLimit(problem.memoryLimit || 256);
      setIsVisible(!!problem.isVisible);
      setOriginalVisibility(!!problem.isVisible);
    }
  }, [problem]);

  const handleSave = async () => {
    try {
      await updateProblem({
        id: problemId,
        title,
        timeLimit: Number(timeLimit),
        memoryLimit: Number(memoryLimit),
      }).unwrap();

      // If visibility was toggled, call the toggle endpoint
      if (isVisible !== originalVisibility) {
        await updateVisibility({ id: problemId }).unwrap();
      }

      alert("Problem updated successfully");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update problem");
    }
  };

  if (!problemId) return <p className="text-white">No problem selected</p>;
  if (isLoading) return <p className="text-white">Loading...</p>;
  if (isError) return <p className="text-red-500">Error loading problem</p>;

  return (
    <div className="max-w-lg space-y-6 text-white">
      <div>
        <label className="block mb-1 text-gray-400">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
          disabled={isUpdating}
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-400">Time Limit (ms)</label>
        <input
          type="number"
          min={1}
          value={timeLimit}
          onChange={(e) => setTimeLimit(parseInt(e.target.value))}
          className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
          disabled={isUpdating}
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-400">Memory Limit (MB)</label>
        <input
          type="number"
          min={1}
          value={memoryLimit}
          onChange={(e) => setMemoryLimit(parseInt(e.target.value))}
          className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
          disabled={isUpdating}
        />
      </div>

      <div>
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
            disabled={isVisibilityUpdating}
          />
          <span>Public Visibility</span>
        </label>
      </div>

      {isVisible && (
        <div>
          <label className="block mb-1 text-gray-400">
            Public URL (click to copy)
          </label>
          <input
            readOnly
            value={`${window.location.origin}/problems/${problemId}`}
            onClick={(e) => e.target.select()}
            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white cursor-pointer select-all"
          />
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isUpdating || isVisibilityUpdating}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUpdating || isVisibilityUpdating ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
