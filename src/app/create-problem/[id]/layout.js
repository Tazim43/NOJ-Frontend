"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

// Hardcoded tab list with paths using :id placeholder
const tabs = [
  { name: "Attributes", path: "/create-problem/:id" },
  { name: "Statement", path: "/create-problem/:id/statement" },
  { name: "Tests", path: "/create-problem/:id/tests" },
  { name: "Solutions", path: "/create-problem/:id/solutions" },
  { name: "Editorial", path: "/create-problem/:id/editorial" },
];

export default function ProblemDetailsLayout({ children }) {
  const { id } = useParams();
  const pathname = usePathname();

  // Replace :id in tab paths with actual ID
  const resolvedTabs = tabs.map((tab) => ({
    ...tab,
    resolvedPath: tab.path.replace(":id", id),
  }));

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-6 py-8 text-white">
      {/* Problem Title and Done Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Divide By</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-700 mb-10">
        {resolvedTabs.map((tab) => {
          const isActive = pathname === tab.resolvedPath;

          return (
            <Link
              key={tab.path}
              href={tab.resolvedPath}
              className={`px-2 sm:px-4 py-2 rounded-t-md text-xs sm:text-sm md:text-base font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gray-800 text-blue-400 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  );
}
