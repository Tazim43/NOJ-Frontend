"use client";

import { useState } from "react";
import { useGetAllContestsQuery } from "@/store/services/contestsApi";
import ContestCard from "@/components/Contests/ContestCard";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function ContestPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [page, setPage] = useState(1);
  const user = useSelector((state) => state.auth.user);
  const isAdmin =
    user?.role === "admin" ||
    user?.role === "super-admin" ||
    user?.email === "tazim0877@gmail.com" ||
    user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const { data, isLoading, isError } = useGetAllContestsQuery({
    status: activeTab,
    page,
    limit: 10,
  });

  const contests = data?.data?.contests || [];
  const pagination = data?.data?.pagination || {};

  const tabs = [
    { id: "upcoming", label: "Upcoming" },
    { id: "ongoing", label: "Ongoing" },
    { id: "past", label: "Past" },
  ];

  return (
    <div className="min-h-screen text-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Contests</h2>
        {isAdmin && (
          <Link href="/dashboard/contests/create">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition font-medium">
              + Create Contest
            </button>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setPage(1);
            }}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === tab.id
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
          <p className="text-red-400">
            Failed to load contests. Please try again later.
          </p>
        </div>
      )}

      {/* Contests List */}
      {!isLoading && !isError && (
        <>
          {contests.length > 0 ? (
            <div className="space-y-4">
              {contests.map((contest) => (
                <ContestCard key={contest._id} contest={contest} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-12 flex flex-col items-center justify-center text-gray-400">
              <p className="text-lg text-center mb-2">
                No {activeTab} contests at the moment.
              </p>
              {activeTab === "upcoming" && (
                <p className="text-sm text-gray-500">
                  Check back soon for new contests!
                </p>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
