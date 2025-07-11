"use client";

import Editor from "@monaco-editor/react";
import { useEffect } from "react";

const SourceCodeModal = ({ code, onClose }) => {
  // Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 rounded-xl w-11/12 max-w-4xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Source Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>
        <div className="h-[500px]">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            options={{
              readOnly: true,
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SourceCodeModal;
