"use client";

import { useState, useEffect, use } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import PrimaryOutlineBtn from "@/components/Buttons/PrimaryOutlineBtn";
import CodeMirrorEditor from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { Editor } from "@monaco-editor/react";

import {
  useGetSolutionQuery,
  useCreateSolutionMutation,
  useDeleteSolutionMutation,
} from "@/store/services/solutionsApi";
import { useGetProblemByIdQuery } from "@/store/services/problemsApi";

const languageMap = {
  105: "cpp",
  103: "c",
  91: "java",
  100: "python",
};

const defaultCodeMap = {
  105: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}\n`,
  103: `#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}\n`,
  91: `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}\n`,
  100: `def main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()\n`,
};

function AddSolutionModal({ problemId, onClose, onAdded }) {
  const [sourceCode, setSourceCode] = useState("");
  const [languageId, setLanguageId] = useState(105);
  const [createSolution, { isLoading }] = useCreateSolutionMutation();

  useEffect(() => {
    setSourceCode(defaultCodeMap[languageId] || "");
  }, [languageId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    setSourceCode(text);
  };

  const handleSubmit = async () => {
    try {
      const encodedSource = btoa(unescape(encodeURIComponent(sourceCode)));
      await createSolution({
        problemId,
        source_code: encodedSource,
        languageId,
      }).unwrap();
      alert("✅ Solution added successfully");
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add solution");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-md w-full max-w-3xl max-h-[90vh] overflow-auto text-white">
        <h3 className="text-xl font-semibold mb-4">Add Solution</h3>

        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Load from file (optional):
          </label>
          <input
            type="file"
            accept=".cpp,.c,.java,.py,.txt"
            onChange={handleFileChange}
            className="text-gray-200"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Language:</label>
          <select
            value={languageId}
            onChange={(e) => setLanguageId(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
          >
            {Object.entries(languageMap).map(([id, name]) => (
              <option key={id} value={id}>
                {name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 border border-gray-700 rounded">
          <CodeMirrorEditor
            value={sourceCode}
            extensions={[
              languageId === 105 || languageId === 103
                ? cpp()
                : languageId === 91
                ? java()
                : python(),
            ]}
            onChange={setSourceCode}
            height="300px"
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              highlightActiveLineGutter: true,
            }}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || sourceCode.trim() === ""}
            className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
          >
            {isLoading ? "Adding..." : "Add Solution"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewSourceModal({ sourceCode, languageId, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-md w-full max-w-4xl max-h-[90vh] overflow-auto flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">View Source Code</h3>
          <button
            onClick={onClose}
            className="text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
        <Editor
          height="80vh"
          defaultLanguage={languageMap[languageId] || "cpp"}
          value={sourceCode}
          theme="vs-dark"
          options={{ readOnly: true, minimap: { enabled: false } }}
        />
      </div>
    </div>
  );
}

export default function SolutionsPage({ params }) {
  const resolvedParams = use(params);
  const problemId = resolvedParams?.id;

  const {
    data: solutions,
    isLoading,
    isError,
    refetch,
  } = useGetSolutionQuery(problemId, {
    skip: !problemId,
  });

  const [deleteSolution] = useDeleteSolutionMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewSourceCode, setViewSourceCode] = useState("");
  const [viewLangId, setViewLangId] = useState(105);

  const primarySolution =
    solutions && solutions.length > 0 ? solutions[0] : null;

  const handleViewSource = (sol) => {
    const decoded = atob(sol.source_code);
    setViewSourceCode(decoded);
    setViewLangId(sol.languageId);
    setShowViewModal(true);
  };

  const handleDelete = async (solId) => {
    if (!confirm("Are you sure you want to delete this solution?")) return;
    try {
      await deleteSolution({ problemId, solutionId: solId }).unwrap();
      alert("Solution deleted");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to delete solution");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">
          Solution Files for Problem {problemId}
        </h2>
        <PrimaryOutlineBtn
          text="Add Solution"
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 text-blue-400 border border-blue-400 rounded hover:bg-blue-500 hover:text-white transition"
        />
      </div>

      {!problemId ? (
        <p className="text-red-500">No problem ID provided.</p>
      ) : isLoading ? (
        <p className="text-white">Loading solutions...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load solutions.</p>
      ) : !solutions || solutions.length === 0 ? (
        <p>No solutions available for this problem.</p>
      ) : (
        <table className="w-full border-separate border-spacing-y-3 text-sm md:text-base">
          <thead>
            <tr className="text-gray-400 text-left">
              <th className="p-3">Language</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Is Primary</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((sol) => (
              <tr
                key={sol._id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-md"
              >
                <td className="p-4">
                  {languageMap[sol.languageId] || "Unknown"}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {new Date(sol.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  {primarySolution?._id === sol._id ? (
                    <span className="text-green-400 font-semibold">
                      Primary
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-4 flex space-x-3">
                  <button
                    onClick={() => handleViewSource(sol)}
                    className="flex cursor-pointer items-center gap-2 px-3 py-1.5 border border-blue-500 text-blue-500 rounded
               hover:bg-blue-500 hover:text-white transition-colors duration-200 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    aria-label="View Source"
                  >
                    <FaEye />
                    <span className="hidden sm:inline font-medium">
                      View Source
                    </span>
                  </button>

                  <button
                    onClick={() => handleDelete(sol._id)}
                    className="flex cursor-pointer items-center gap-2 px-3 py-1.5 border border-red-500 text-red-500 rounded
               hover:bg-red-500 hover:text-white transition-colors duration-200 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    aria-label="Delete Solution"
                  >
                    <FaTrash />
                    <span className="hidden sm:inline font-medium">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <AddSolutionModal
          problemId={problemId}
          onClose={() => setShowAddModal(false)}
          onAdded={() => refetch()}
        />
      )}

      {showViewModal && (
        <ViewSourceModal
          sourceCode={viewSourceCode}
          languageId={viewLangId}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
}
