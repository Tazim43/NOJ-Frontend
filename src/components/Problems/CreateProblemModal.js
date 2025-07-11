"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateProblemMutation,
  useCreateProblemStatementMutation,
} from "@/store/services/problemsApi";

export default function CreateProblemModal({ onClose }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState(1000);
  const [memoryLimit, setMemoryLimit] = useState(512);

  const [createProblem, { isLoading: creatingProblem }] =
    useCreateProblemMutation();
  const [createProblemStatement, { isLoading: creatingStatement }] =
    useCreateProblemStatementMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Problem title is required");
      return;
    }

    try {
      // Step 1: Create the problem
      const created = await createProblem({
        title: title.trim(),
        timeLimit: Number(timeLimit),
        memoryLimit: Number(memoryLimit),
      }).unwrap();

      const problemId = created.problem._id;

      // Step 2: Create the problem statement with defaults
      await createProblemStatement({
        id: problemId,
        formData: {
          description: "statement",
          inputDescription: "input",
          outputDescription: "output",
        },
      }).unwrap();

      router.push("/dashboard/problemsetting");
      if (onClose) onClose();
    } catch (err) {
      console.error("Failed to create problem or statement", err);
      alert(
        "Failed to create problem or its statement. Please ensure you are logged in."
      );
    }
  };

  const isLoading = creatingProblem || creatingStatement;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-900 rounded-md p-6 w-full max-w-md text-white shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Problem</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Problem Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter problem title"
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="timeLimit" className="block mb-1 font-medium">
              Time Limit (ms)
            </label>
            <input
              id="timeLimit"
              type="number"
              min="100"
              max="10000"
              step="100"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="memoryLimit" className="block mb-1 font-medium">
              Memory Limit (MB)
            </label>
            <input
              id="memoryLimit"
              type="number"
              min="64"
              max="4096"
              step="64"
              value={memoryLimit}
              onChange={(e) => setMemoryLimit(Number(e.target.value))}
              className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
