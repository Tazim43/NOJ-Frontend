"use client";

import React from "react";
import Link from "next/link";
import { useGetAllContestsQuery } from "@/store/services/contestsApi";
import SecondaryOutlineBtn from "../Buttons/SecondaryOutlineBtn";

const UpcomingContests = () => {
  const { data, isLoading } = useGetAllContestsQuery({
    status: "upcoming",
    limit: 3,
  });

  const contests = data?.data?.contests || [];

  return (
    <section className="text-white py-2 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Upcoming Contests
        </h2>

        {/* Contest Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {isLoading ? (
            <div className="col-span-2 flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-400"></div>
            </div>
          ) : contests.length > 0 ? (
            contests.map((contest) => {
              const startDate = new Date(contest.startTime);
              const duration = Math.round(
                (new Date(contest.endTime) - startDate) / (1000 * 60 * 60)
              );

              return (
                <div
                  key={contest._id}
                  className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all"
                >
                  <h3 className="text-sm sm:text-lg font-semibold">
                    {contest.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Starts:{" "}
                    {startDate.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                    Duration: {duration} hours
                  </p>
                  <Link href={`/contests/${contest._id}`}>
                    <button className="border border-teal-400 text-teal-400 px-3 py-2 sm:px-4 text-xs sm:text-sm rounded-lg hover:bg-teal-400 hover:text-black transition">
                      Register
                    </button>
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center col-span-2">
              <h3 className="text-sm sm:text-lg font-semibold">
                No Upcoming Contests
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                There are no upcoming contests at the moment. Please check back
                later!
              </p>
            </div>
          )}
        </div>

        {/* View All Contests Button */}
        <div className="mt-4 sm:mt-6">
          <SecondaryOutlineBtn url="/contests" text="View All Contests" />
        </div>
      </div>
    </section>
  );
};

export default UpcomingContests;
