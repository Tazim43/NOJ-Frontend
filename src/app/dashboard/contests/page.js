"use client";

import {
  useGetMyContestsQuery,
  useDeleteContestMutation,
} from "@/store/services/contestsApi";
import Link from "next/link";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";

export default function ContestsManagementPage() {
  const { data, isLoading, refetch } = useGetMyContestsQuery();
  const [deleteContest, { isLoading: deleting }] = useDeleteContestMutation();

  const createdContests = data?.data?.created || [];
  const registeredContests = data?.data?.registered || [];

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteContest(id).unwrap();
      alert("✅ Contest deleted successfully");
      refetch();
    } catch (error) {
      alert(`❌ Failed to delete: ${error.data?.message || "Try again"}`);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      UPCOMING: "bg-blue-500/20 text-blue-400",
      REGISTRATION_OPEN: "bg-green-500/20 text-green-400",
      ONGOING: "bg-red-500/20 text-red-400",
      ENDED: "bg-gray-500/20 text-gray-400",
    };
    return badges[status] || badges.UPCOMING;
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Contests</h2>
        <Link href="/dashboard/contests/create">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition font-medium flex items-center gap-2">
            <FiPlus /> Create Contest
          </button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Created Contests */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Contests I Created</h3>
            {createdContests.length > 0 ? (
              <div className="space-y-4">
                {createdContests.map((contest) => (
                  <div
                    key={contest._id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link href={`/contests/${contest._id}`}>
                            <h4 className="text-lg font-semibold hover:text-blue-400 cursor-pointer">
                              {contest.title}
                            </h4>
                          </Link>
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusBadge(
                              contest.status
                            )}`}
                          >
                            {contest.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {new Date(contest.startTime).toLocaleString()} •{" "}
                          {contest.participantCount} participants
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/contests/edit/${contest._id}`}>
                          <button className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded transition">
                            <FiEdit />
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(contest._id, contest.title)
                          }
                          disabled={deleting}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded transition disabled:opacity-50"
                        >
                          <FiTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center text-gray-400">
                <p>You haven't created any contests yet.</p>
                <Link href="/dashboard/contests/create">
                  <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">
                    Create Your First Contest
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Registered Contests */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Contests I'm Participating In
            </h3>
            {registeredContests.length > 0 ? (
              <div className="space-y-4">
                {registeredContests.map((contest) => (
                  <div
                    key={contest._id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link href={`/contests/${contest._id}`}>
                            <h4 className="text-lg font-semibold hover:text-blue-400 cursor-pointer">
                              {contest.title}
                            </h4>
                          </Link>
                          <span
                            className={`px-2 py-1 rounded text-xs ${getStatusBadge(
                              contest.status
                            )}`}
                          >
                            {contest.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {new Date(contest.startTime).toLocaleString()}
                        </p>
                      </div>
                      {contest.status === "ONGOING" && (
                        <Link href={`/contests/${contest._id}/arena`}>
                          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
                            Enter Contest
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center text-gray-400">
                <p>You're not registered for any contests.</p>
                <Link href="/contests">
                  <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition">
                    Browse Contests
                  </button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
