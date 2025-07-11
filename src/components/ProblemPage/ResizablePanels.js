"use client";

import React, { useState, useRef } from "react";
import ResizableDivider from "@/components/ProblemPage/ResizableDivider";
import ProblemDetails from "@/components/ProblemPage/ProblemDetails";
import dynamic from "next/dynamic";

const CodeEditorPanel = dynamic(
  () => import("@/components/CodeEditor/CodeEditorPanel"),
  { ssr: false }
);

export default function ResizablePanels({ problem }) {
  const [leftWidth, setLeftWidth] = useState(60); // in %
  const isDragging = useRef(false);

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const totalWidth = window.innerWidth;
    const newLeftWidth = (e.clientX / totalWidth) * 100;
    if (newLeftWidth > 20 && newLeftWidth < 80) setLeftWidth(newLeftWidth);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <main
      className="flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-1 overflow-hidden">
        <div style={{ width: `${leftWidth}%`, height: "100%" }}>
          <ProblemDetails problem={problem} />
        </div>

        <ResizableDivider onMouseDown={handleMouseDown} />

        <section
          className="bg-gray-800 border-l border-gray-700 overflow-auto"
          style={{ width: `${100 - leftWidth}%`, height: "100%" }}
        >
          <div className="h-full p-4">
            <CodeEditorPanel />
          </div>
        </section>
      </div>
    </main>
  );
}
