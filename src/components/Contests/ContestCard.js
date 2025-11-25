"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiClock, FiUsers, FiLock } from "react-icons/fi";

const ContestCard = ({ contest }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState(contest.status || "UPCOMING");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const start = new Date(contest.startTime);
      const end = new Date(contest.endTime);

      if (now < start) {
        const diff = start - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`Starts in ${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(`Starts in ${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`Starts in ${minutes}m`);
        }
        setStatus("UPCOMING");
      } else if (now >= start && now < end) {
        const diff = end - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft(`Ends in ${hours}h ${minutes}m`);
        setStatus("ONGOING");
      } else {
        setTimeLeft("Ended");
        setStatus("ENDED");
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [contest.startTime, contest.endTime]);

  const getStatusBadge = () => {
    const badges = {
      UPCOMING: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      REGISTRATION_OPEN: "bg-green-500/20 text-green-400 border-green-500/50",
      ONGOING: "bg-red-500/20 text-red-400 border-red-500/50",
      ENDED: "bg-gray-500/20 text-gray-400 border-gray-500/50",
    };

    return badges[status] || badges.UPCOMING;
  };

  const getActionButton = () => {
    if (status === "ONGOING") {
      return (
        <Link href={`/contests/${contest._id}/arena`}>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium">
            Enter Contest
          </button>
        </Link>
      );
    } else if (status === "UPCOMING" || status === "REGISTRATION_OPEN") {
      return contest.isRegistered ? (
        <Link href={`/contests/${contest._id}`}>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-medium">
            Registered ✓
          </button>
        </Link>
      ) : (
        <Link href={`/contests/${contest._id}`}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-medium">
            Register
          </button>
        </Link>
      );
    } else {
      return (
        <Link href={`/contests/${contest._id}`}>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition font-medium">
            View Results
          </button>
        </Link>
      );
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/contests/${contest._id}`}>
              <h3 className="text-lg sm:text-xl font-bold text-white hover:text-blue-400 transition cursor-pointer">
                {contest.title}
              </h3>
            </Link>
            {contest.isPrivate && (
              <FiLock className="text-yellow-500" title="Private Contest" />
            )}
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">
            {contest.description}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge()} whitespace-nowrap`}
        >
          {status.replace("_", " ")}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <FiClock className="text-blue-400" />
          <span>{timeLeft}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiUsers className="text-green-400" />
          <span>{contest.participantCount || 0} participants</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">●</span>
          <span>{contest.scoringRules || "ICPC"}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-xs text-gray-500">
          <div>
            Start:{" "}
            {new Date(contest.startTime).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div>
            Duration:{" "}
            {Math.round(
              (new Date(contest.endTime) - new Date(contest.startTime)) /
                (1000 * 60 * 60)
            )}{" "}
            hours
          </div>
        </div>
        {getActionButton()}
      </div>
    </div>
  );
};

export default ContestCard;
