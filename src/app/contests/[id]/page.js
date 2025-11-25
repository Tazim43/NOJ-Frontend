"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetContestByIdQuery,
  useRegisterForContestMutation,
  useGetContestLeaderboardQuery,
  useGetAnnouncementsQuery,
} from "@/store/services/contestsApi";
import { useSelector } from "react-redux";
import ContestTimer from "@/components/Contests/ContestTimer";
import Link from "next/link";
import { FiUsers, FiClock, FiLock, FiCalendar } from "react-icons/fi";

export default function ContestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [accessCode, setAccessCode] = useState("");
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);

  const { data: contestData, isLoading, refetch } = useGetContestByIdQuery(id);
  const { data: leaderboardData } = useGetContestLeaderboardQuery(id, {
    skip: activeTab !== "leaderboard",
  });
  const { data: announcementsData } = useGetAnnouncementsQuery(id, {
    skip: activeTab !== "announcements",
  });

  const [registerForContest, { isLoading: registering }] =
    useRegisterForContestMutation();

  const contest = contestData?.contest;

  const handleRegister = async () => {
    if (!user) {
      alert("Please login to register for contest");
      return;
    }

    if (contest.isPrivate && !accessCode) {
      setShowAccessCodeModal(true);
      return;
    }

    try {
      await registerForContest({
        contestId: id,
        accessCode: contest.isPrivate ? accessCode : undefined,
      }).unwrap();
      alert("✅ Successfully registered for contest!");
      setShowAccessCodeModal(false);
      refetch();
    } catch (error) {
      alert(
        `❌ Registration failed: ${error.data?.message || "Please try again"}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Contest not found</h2>
          <Link href="/contests">
            <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg">
              Back to Contests
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const tabs = ["overview", "leaderboard", "announcements"];
  const canEnter =
    contest.isRegistered &&
    (contest.status === "ONGOING" || contest.status === "ENDED");

  return (
    <div className="min-h-screen text-white py-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {contest.title}
              </h1>
              {contest.isPrivate && (
                <FiLock className="text-yellow-500" title="Private Contest" />
              )}
            </div>
            <p className="text-gray-400">{contest.description}</p>
          </div>
          {contest.status === "ONGOING" && (
            <ContestTimer
              startTime={contest.startTime}
              endTime={contest.endTime}
            />
          )}
        </div>

        {/* Contest Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center gap-3">
            <FiCalendar className="text-blue-400 text-xl" />
            <div>
              <div className="text-xs text-gray-400">Start Time</div>
              <div className="text-sm font-medium">
                {new Date(contest.startTime).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiClock className="text-green-400 text-xl" />
            <div>
              <div className="text-xs text-gray-400">Duration</div>
              <div className="text-sm font-medium">
                {Math.round(
                  (new Date(contest.endTime) - new Date(contest.startTime)) /
                    (1000 * 60 * 60)
                )}{" "}
                hours
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiUsers className="text-purple-400 text-xl" />
            <div>
              <div className="text-xs text-gray-400">Participants</div>
              <div className="text-sm font-medium">
                {contest.participantCount || 0}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-orange-400 text-xl">●</span>
            <div>
              <div className="text-xs text-gray-400">Format</div>
              <div className="text-sm font-medium">{contest.scoringRules}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {!contest.isRegistered &&
            contest.status !== "ENDED" &&
            contest.status !== "ONGOING" && (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition font-medium"
              >
                {registering ? "Registering..." : "Register Now"}
              </button>
            )}
          {contest.isRegistered && contest.status === "UPCOMING" && (
            <div className="bg-yellow-500/20 text-yellow-400 px-6 py-2 rounded-lg font-medium">
              ✓ Registered - Contest starts soon!
            </div>
          )}
          {canEnter && contest.status === "ONGOING" && (
            <Link href={`/contests/${id}/arena`}>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition font-medium">
                Enter Contest
              </button>
            </Link>
          )}
          {contest.status === "ENDED" && (
            <Link href={`/contests/${id}/arena`}>
              <button className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition font-medium">
                View Problems & Results
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium transition capitalize whitespace-nowrap ${
              activeTab === tab
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {activeTab === "overview" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Contest Rules</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Contest Type:</strong>{" "}
                {contest.contestType}
              </p>
              <p>
                <strong className="text-white">Scoring:</strong>{" "}
                {contest.scoringRules}
              </p>
              {contest.maxParticipants && (
                <p>
                  <strong className="text-white">Max Participants:</strong>{" "}
                  {contest.maxParticipants}
                </p>
              )}
              <p>
                <strong className="text-white">Late Join:</strong>{" "}
                {contest.allowLateJoin ? "Allowed" : "Not Allowed"}
              </p>
              <p>
                <strong className="text-white">Clarifications:</strong>{" "}
                {contest.clarificationsEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Standings</h3>
            {leaderboardData?.data?.leaderboard?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-2">Rank</th>
                      <th className="text-left py-3 px-2">User</th>
                      <th className="text-right py-3 px-2">Score</th>
                      <th className="text-right py-3 px-2">Penalty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.data.leaderboard.map((entry) => (
                      <tr
                        key={entry._id}
                        className="border-b border-gray-800 hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-2 font-bold">{entry.rank}</td>
                        <td className="py-3 px-2">
                          {entry.userId?.username || "Unknown"}
                        </td>
                        <td className="py-3 px-2 text-right">{entry.score}</td>
                        <td className="py-3 px-2 text-right">
                          {entry.penalty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No submissions yet
              </p>
            )}
          </div>
        )}

        {activeTab === "announcements" && (
          <div>
            <h3 className="text-xl font-bold mb-4">Announcements</h3>
            {announcementsData?.data?.announcements?.length > 0 ? (
              <div className="space-y-4">
                {announcementsData.data.announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                  >
                    <p className="text-gray-300">{announcement.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(announcement.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No announcements yet
              </p>
            )}
          </div>
        )}
      </div>

      {/* Access Code Modal */}
      {showAccessCodeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Enter Access Code</h3>
            <p className="text-gray-400 mb-4">
              This is a private contest. Please enter the access code to
              register.
            </p>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Access Code"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleRegister}
                disabled={!accessCode || registering}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
              >
                {registering ? "Registering..." : "Register"}
              </button>
              <button
                onClick={() => {
                  setShowAccessCodeModal(false);
                  setAccessCode("");
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
