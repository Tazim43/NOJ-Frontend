"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CodeMirrorEditor from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useSubmitSolutionMutation } from "@/store/services/submissionsApi";

const defaultCodes = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n  // Write your C++ code here\n  return 0;\n}`,
  c: `#include <stdio.h>\n\nint main() {\n  // Write your C code here\n  return 0;\n}`,
  python: `# Write your Python code here\ndef main():\n    pass\n\nmain()`,
  java: `public class Main {\n  public static void main(String[] args) {\n    // Write your Java code here\n  }\n}`,
};

const languageExtensions = {
  cpp: cpp,
  c: cpp,
  python: python,
  java: java,
};

// Judge0 Language IDs
const Languages = {
  c: 50, // C (GCC 9.2.0)
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
  python: 71, // Python (3.8.1)
};

export default function CodeEditorPanel({ id: problemId, contestId }) {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(defaultCodes["cpp"]);
  const [submitSolution, { isLoading }] = useSubmitSolutionMutation();
  const router = useRouter();

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(defaultCodes[selectedLang]);
  };

  const handleSubmit = async () => {
    try {
      const base64Code = btoa(code);
      const language_id = Languages[language];

      const payload = {
        problemId,
        source_code: base64Code,
        language_id,
      };

      // Add contestId if submitting during a contest
      if (contestId) {
        payload.contestId = contestId;
      }

      const response = await submitSolution(payload).unwrap();

      if (response?.data?._id) {
        // Redirect based on whether it's a contest submission
        if (contestId) {
          router.push(`/contests/${contestId}/arena`);
        } else {
          router.push(`/submissions/${response.data._id}`);
        }
      } else {
        throw new Error("Submission ID not found in response.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("❌ Failed to submit. Try again.");
    }
  };

  return (
    <div className="h-full w-full flex flex-col min-h-[400px] sm:min-h-[500px] md:min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 md:px-4 py-2 sm:py-3 bg-gray-800 border-b border-gray-700 gap-2 sm:gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-3 md:gap-4">
          <span className="text-white font-semibold text-sm md:text-base">
            Code Editor
          </span>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-700 text-white px-2 py-1 rounded text-xs sm:text-sm min-w-[80px]"
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Desktop Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="hidden sm:block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-all disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Code Editor */}
      <div className="flex-grow min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
        <CodeMirrorEditor
          value={code}
          height="100%"
          theme={dracula}
          extensions={[languageExtensions[language]()]}
          onChange={(value) => setCode(value)}
          className="h-full text-sm sm:text-base"
        />
      </div>

      {/* Mobile Submit Button */}
      <div className="block sm:hidden px-3 py-3 bg-gray-900 border-t border-gray-700">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded transition-all disabled:opacity-50 font-medium"
        >
          {isLoading ? "Submitting..." : "Submit Solution"}
        </button>
      </div>
    </div>
  );
}
