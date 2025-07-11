"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

// Color scale for 0 to 20 submissions
const colorScale = [
  "bg-gray-800", // 0 submissions
  "bg-green-100", // 1-3
  "bg-green-300", // 4-7
  "bg-green-500", // 8-14
  "bg-green-700", // 15-20+
];

// Map count to color class, max 20
const getColorClass = (count) => {
  if (count === 0) return colorScale[0];
  if (count <= 3) return colorScale[1];
  if (count <= 7) return colorScale[2];
  if (count <= 14) return colorScale[3];
  return colorScale[4];
};

// Generate dummy data for last 30 days with max 20 submissions
const generateDummyActivityData = () => {
  const today = new Date();
  const data = [];
  for (let i = 170; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    let count = Math.floor(Math.random() * 0); // 0 to 20

    data.push({ date, count });
  }
  return data;
};

const ActivityHeatmap = ({ data }) => {
  const firstDay = data[0].date.getDay();
  const paddingStart = Array(firstDay).fill(null);
  const allDays = [...paddingStart, ...data];
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex space-x-1 overflow-x-auto py-2 w-full">
      {/* Weekday labels */}
      <div className="flex flex-col justify-start mr-2 text-xs text-gray-400 select-none min-w-[2rem]">
        {weekdayLabels.map((d) => (
          <div key={d} className="h-6 mb-1 flex items-center">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks container - flex-grow to fill width */}
      <div className="flex space-x-1 flex-grow min-w-0">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col space-y-1 shrink-0">
            {week.map((day, j) => {
              if (!day) {
                return <div key={j} className="w-6 h-6"></div>;
              }
              const dateStr = day.date.toISOString().slice(0, 10);
              const colorClass = getColorClass(day.count);
              return (
                <div
                  key={j}
                  className={`w-6 h-6 rounded-sm cursor-default ${colorClass} border border-gray-700`}
                  title={`${dateStr}: ${day.count} submissions`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [hasMounted, setHasMounted] = useState(false);

  const dummyActivityData = generateDummyActivityData();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  const createdAt = new Date(user.createAt);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(createdAt);

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="flex justify-center md:justify-start">
            <div className="relative w-32 h-32">
              <Image
                src={user.avatar}
                alt="Profile Picture"
                layout="fill"
                objectFit="cover"
                className="rounded-full border-4 border-blue-500"
              />
            </div>
          </div>

          <h2 className="text-center md:text-left text-2xl font-bold">
            {user.fullName}
          </h2>

          <div className="bg-gray-800 rounded-lg p-4 text-sm shadow-md space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Username</span>
              <span className="text-blue-400 font-medium">{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email</span>
              <span className="text-gray-300 truncate">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Joined</span>
              <span className="text-gray-300">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Stats Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-blue-400">
              Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">Current Rating</p>
                <p className="text-2xl text-blue-500 font-semibold">
                  {user.rating}
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">Solved Problems</p>
                <p className="text-2xl text-green-400 font-semibold">
                  {user.solveCount}
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">Submissions</p>
                <p className="text-2xl text-orange-400 font-semibold">
                  {user.submissionCount}
                </p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">Max Streak</p>
                <p className="text-2xl text-teal-400 font-semibold">–</p>
              </div>
            </div>
          </div>

          {/* Activity Graph */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full">
            <h3 className="text-xl font-semibold mb-6 text-blue-400">
              Activity Graph
            </h3>
            <ActivityHeatmap data={dummyActivityData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
