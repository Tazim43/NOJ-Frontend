"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiFilePlus, FiTrash } from "react-icons/fi";
import CreateProblemModal from "@/components/Problems/CreateProblemModal";
import {
  useGetMyProblemsQuery,
  useDeleteProblemMutation,
} from "@/store/services/problemsApi";

export default function ProblemSettingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useGetMyProblemsQuery();
  const [deleteProblem, { isLoading: deleting }] = useDeleteProblemMutation();

  const problems = data?.problems ?? [];

  const handleCreateProblem = (type, title) => {
    console.log("Creating problem:", { type, title });
    // redirect or mutation logic
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    try {
      await deleteProblem(id).unwrap();
      alert("✅ Problem deleted successfully.");
      refetch(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete problem.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row max-w-7xl mx-auto px-4 py-8 gap-4 text-white">
      {/* Sidebar */}
      <div className="w-full sm:w-64 flex-shrink-0 space-y-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded transition"
        >
          <FiFilePlus className="mr-2" />
          New
        </button>

        <div className="bg-gray-900 rounded-md border border-gray-700 p-4 text-sm text-gray-400">
          Share your feedback and help us improve{" "}
          <strong>Problem Creation</strong>.
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-gray-900 rounded-md border border-gray-700 p-4 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h2 className="text-lg sm:text-xl font-semibold">All Problems</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-sm rounded px-3 py-2 pl-9 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <FiSearch className="absolute top-2.5 left-2.5 text-gray-400 text-sm" />
            </div>
          </div>

          {/* Problem List */}
          <div className="divide-y divide-gray-800">
            {isLoading ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Loading...
              </p>
            ) : isError ? (
              <p className="text-sm text-red-500 text-center py-8">
                Failed to load problems.
              </p>
            ) : problems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No problems found.
              </p>
            ) : (
              problems
                .filter((p) =>
                  p.title?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((problem) => (
                  <div
                    key={problem._id}
                    className="flex justify-between items-center py-3"
                  >
                    <div className="p-1">
                      <Link
                        href={`/create-problem/${problem._id}`}
                        className="text-blue-400 hover:underline text-sm sm:text-base"
                      >
                        {problem.title}
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="text-red-400 cursor-pointer hover:text-red-300 transition text-sm flex items-center gap-1"
                      disabled={deleting}
                    >
                      <FiTrash size={16} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                ))
            )}
          </div>

          {/* Pagination (Static) */}
          <div className="flex justify-center pt-4">
            <span className="bg-blue-500 text-white text-xs sm:text-sm rounded px-3 py-1">
              1
            </span>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <CreateProblemModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProblem}
        />
      )}
    </div>
  );
}
