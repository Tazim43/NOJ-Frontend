"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";

const baseTabs = [
  { name: "Profile", path: "/dashboard" },
  { name: "My Submissions", path: "/dashboard/submissions" },
  // { name: "Settings", path: "/dashboard/settings" },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Add Admin tab if the user is admin
  const tabs = [...baseTabs];
  if (user?.role === "admin" || user?.email === adminEmail) {
    tabs.push({ name: "My Contests", path: "/dashboard/contests" });
    tabs.push({ name: "Admin", path: "/dashboard/admin" });
    tabs.push({ name: "Problemsetting", path: "/dashboard/problemsetting" });
  }

  return (
    <ProtectedRoute>
      <div className="w-full sm:max-w-11/12 m-auto text-white min-h-screen px-2 sm:px-6 py-10">
        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-gray-700 mb-10">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.name}
                href={tab.path}
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

        {children}
      </div>
    </ProtectedRoute>
  );
}
