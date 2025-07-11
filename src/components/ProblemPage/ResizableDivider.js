"use client";

export default function ResizableDivider({ onMouseDown }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-6 cursor-col-resize bg-gray-700 relative flex justify-center items-center hover:bg-gray-600"
      title="Drag to resize"
    >
      {/* Stylish vertical bars */}
      <div className="w-1 h-10 bg-gray-400 rounded"></div>
      <div className="w-1 h-10 bg-gray-400 rounded mx-1"></div>
      <div className="w-1 h-10 bg-gray-400 rounded"></div>
    </div>
  );
}
