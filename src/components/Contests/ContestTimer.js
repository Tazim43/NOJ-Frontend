"use client";

import React, { useState, useEffect } from "react";
import { FiClock } from "react-icons/fi";

const ContestTimer = ({ endTime, startTime }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isEnded, setIsEnded] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endTime);
      const start = new Date(startTime);
      const totalDuration = end - start;

      if (now >= end) {
        setTimeLeft("Contest Ended");
        setIsEnded(true);
        setProgress(0);
        return;
      }

      if (now < start) {
        setTimeLeft("Not Started");
        setProgress(100);
        return;
      }

      const diff = end - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );

      // Calculate progress
      const elapsed = now - start;
      const progressPercent = ((totalDuration - diff) / totalDuration) * 100;
      setProgress(100 - progressPercent);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime, startTime]);

  const getColorClass = () => {
    if (isEnded) return "text-gray-400";
    if (progress < 10) return "text-red-500";
    if (progress < 30) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
      <FiClock className={`text-xl ${getColorClass()}`} />
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">Time Remaining</span>
        <span className={`text-lg font-mono font-bold ${getColorClass()}`}>
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default ContestTimer;
