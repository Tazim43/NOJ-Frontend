"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { cpp } from "@codemirror/lang-cpp";
import { highlightActiveLineGutter } from "@codemirror/view";
import { useCreateTestcaseMutation } from "@/store/services/testcasesApi";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
});

function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export default function AddTestPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [problemId, setProblemId] = useState(null);
  const [createTestcase, { isLoading }] = useCreateTestcaseMutation();

  const [mounted, setMounted] = useState(false);
  const [testType, setTestType] = useState("regular");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [useSolutionOutput, setUseSolutionOutput] = useState(false);
  const [outputMode, setOutputMode] = useState("manual"); // "manual" or "generate"

  const inputFileRef = useRef(null);
  const outputFileRef = useRef(null);

  useEffect(() => {
    setMounted(true);

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
        if (
          nextSegment === "tests" &&
          segments[createProblemIndex + 3] === "add"
        ) {
          setProblemId(pid);
        }
      }
    }
  }, [pathname]);

  const handleFileRead = (file, setter) => {
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target.result || "");
    reader.readAsText(file);
  };

  const onInputFileChange = (e) => {
    if (e.target.files?.[0]) handleFileRead(e.target.files[0], setInput);
  };

  const onOutputFileChange = (e) => {
    if (e.target.files?.[0]) {
      handleFileRead(e.target.files[0], setOutput);
      setUseSolutionOutput(false);
      setOutputMode("manual");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problemId) {
      alert("Problem ID not found.");
      return;
    }

    try {
      const payload = {
        problemId,
        input: base64Encode(input),
        expectedOutput: useSolutionOutput ? null : base64Encode(output),
        isSample: testType === "sample",
        // For now, default cpu_time and memory to 0 or you can add inputs for them
        cpu_time: 0,
        memory: 0,
      };

      await createTestcase(payload).unwrap();

      alert("✅ Test case added successfully");
      // Optionally redirect back to tests list
      router.push(`/create-problem/${problemId}/tests`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add test case");
    }
  };

  if (!problemId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        <p>Problem ID not found in URL.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-md text-white shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Test Case</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Test Type */}
        <div>
          <label htmlFor="testType" className="block mb-2 font-semibold">
            Test Type
          </label>
          <select
            id="testType"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="regular">Regular</option>
            <option value="sample">Sample</option>
          </select>
        </div>

        {/* Input Editor */}
        <div>
          <label className="block mb-2 font-semibold">Input</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => inputFileRef.current.click()}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-1 rounded-md text-sm font-semibold transition"
            >
              Open File
            </button>
            <input
              type="file"
              accept=".txt,.in,.input,.cpp,.h"
              className="hidden"
              ref={inputFileRef}
              onChange={onInputFileChange}
            />
          </div>
          {mounted ? (
            <CodeMirror
              value={input}
              extensions={[cpp(), highlightActiveLineGutter()]}
              onChange={setInput}
              height="300px"
              theme="dark"
              editable={true}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
              }}
              className="rounded-md border border-gray-700 bg-gray-900"
            />
          ) : (
            <div className="h-[300px] bg-gray-800 rounded-md animate-pulse" />
          )}
        </div>

        {/* Output Mode Dropdown */}
        <div>
          <label htmlFor="outputMode" className="block mb-2 font-semibold">
            Output Mode
          </label>
          <select
            id="outputMode"
            value={outputMode}
            onChange={(e) => setOutputMode(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="manual">Manual</option>
            <option value="generate">Generate</option>
          </select>
        </div>

        {/* Output Editor - only show if manual */}
        {outputMode === "manual" && (
          <div>
            <label className="block mb-2 font-semibold">Output</label>
            <div className="flex gap-4 items-center mb-2">
              <button
                type="button"
                onClick={() => outputFileRef.current.click()}
                disabled={useSolutionOutput}
                className={`px-4 py-1 rounded-md text-sm font-semibold transition ${
                  useSolutionOutput
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
              >
                Open File
              </button>

              <input
                type="file"
                accept=".txt,.out,.output"
                className="hidden"
                ref={outputFileRef}
                onChange={onOutputFileChange}
              />
            </div>
            {mounted ? (
              <CodeMirror
                value={output}
                extensions={[cpp(), highlightActiveLineGutter()]}
                onChange={setOutput}
                height="300px"
                theme="dark"
                editable={!useSolutionOutput}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLine: true,
                  highlightActiveLineGutter: true,
                }}
                className={`rounded-md border border-gray-700 bg-gray-900 ${
                  useSolutionOutput ? "opacity-70" : ""
                }`}
              />
            ) : (
              <div className="h-[300px] bg-gray-800 rounded-md animate-pulse" />
            )}
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-md font-semibold transition disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Add Test Case"}
          </button>
        </div>
      </form>
    </div>
  );
}
