"use client";

export default function ContestPage() {
  return (
    <div className="min-h-screen text-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6">
        All Contests
      </h2>

      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 flex items-center justify-center text-gray-400">
        <p className="text-sm sm:text-base md:text-lg text-center">
          🚫 No upcoming contests at the moment.
        </p>
      </div>
    </div>
  );
}
