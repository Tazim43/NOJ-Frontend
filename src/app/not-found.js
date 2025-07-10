"use client";

import Link from "next/link";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
      <div className="text-center text-gray-200 max-w-md">
        <div className="flex justify-center mb-4">
          <Frown size={64} className="text-red-500" />
        </div>
        <h1 className="text-5xl font-bold mb-2 text-white">404</h1>
        <p className="text-lg mb-4">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <p className="mb-6 text-sm text-gray-400">
          Maybe you mistyped the URL, or the page has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 transition-all px-6 py-2 rounded-md text-white font-medium"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
