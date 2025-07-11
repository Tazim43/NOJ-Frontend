"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetProblemStatementByIdQuery,
  useUpdateProblemStatementMutation,
} from "@/store/services/problemsApi";
import RichEditorBox from "@/components/Editor/RichEditorBox";

export default function StatementPage() {
  const { id: problemId } = useParams();

  const {
    data: statement,
    isLoading,
    isError,
  } = useGetProblemStatementByIdQuery(problemId, { skip: !problemId });

  const [updateStatement, { isLoading: isSaving }] =
    useUpdateProblemStatementMutation();

  // State variables to hold content for editors
  const [description, setDescription] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [outputDescription, setOutputDescription] = useState("");

  // When statement data loads, update states
  useEffect(() => {
    if (statement) {
      setDescription(statement.description || "");
      setInputDescription(statement.inputDescription || "");
      setOutputDescription(statement.outputDescription || "");
    }
  }, [statement]);

  const handleSave = async () => {
    try {
      await updateStatement({
        id: problemId,
        formData: {
          description,
          inputDescription,
          outputDescription,
          imageList: [], // optional, keep empty if unused
        },
      }).unwrap();
      alert("✅ Problem statement updated successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update problem statement");
    }
  };

  if (!problemId) return <p className="text-red-500">No problem ID found</p>;
  if (isLoading) return <p className="text-white">Loading statement...</p>;
  if (isError) return <p className="text-red-500">Error loading statement</p>;

  return (
    <div className="space-y-10 text-white max-w-3xl mx-auto py-6">
      <RichEditorBox
        label="Statement"
        value={description}
        onChange={setDescription}
      />
      <RichEditorBox
        label="Input"
        value={inputDescription}
        onChange={setInputDescription}
      />
      <RichEditorBox
        label="Output"
        value={outputDescription}
        onChange={setOutputDescription}
      />

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? "Saving..." : "Save Statement"}
      </button>
    </div>
  );
}
