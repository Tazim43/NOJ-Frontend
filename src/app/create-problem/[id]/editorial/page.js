"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RickEditorBox from "@/components/Editor/RichEditorBox"; // Must be a default export

export default function EditorialPage() {
  const { id: problemId } = useParams();
  const [language, setLanguage] = useState("English");
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");

  const storageKey = `editorial-${problemId}-${language}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setSavedContent(saved);
  }, [storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, content);
    setSavedContent(content);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 text-white bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Preview */}
        <div className="bg-gray-800 border border-gray-700 rounded p-6">
          <h2 className="text-2xl font-bold mb-4">📘 Preview Editorial</h2>
          {savedContent ? (
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: savedContent }}
            />
          ) : (
            <p className="text-gray-400">No editorial saved yet.</p>
          )}
        </div>

        {/* Language Selector */}
        <div className="flex items-center space-x-4">
          <label htmlFor="lang" className="text-sm font-medium">
            Language
          </label>
          <select
            id="lang"
            className="bg-gray-800 border border-gray-600 px-3 py-1 rounded text-white"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              const nextKey = `editorial-${problemId}-${e.target.value}`;
              const nextContent = localStorage.getItem(nextKey) || "";
              setContent(nextContent);
              setSavedContent(nextContent);
            }}
          >
            <option>English</option>
            <option>Bangla</option>
          </select>
        </div>

        {/* Editor */}
        <div>
          <label className="block mb-2 text-sm font-medium">Content</label>
          <RickEditorBox value={content} onChange={setContent} />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
          >
            💾 Save Editorial
          </button>
        </div>
      </div>
    </div>
  );
}
