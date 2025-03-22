import React from "react";
import SecondaryOutlineBtn from "../Buttons/SecondaryOutlineBtn";

const contests = [
  // {
  //   id: 1,
  //   title: "Code Marathon",
  //   date: "Nov 25, 2023, 9:00 AM",
  //   duration: "5 hours",
  // },
  // {
  //   id: 2,
  //   title: "Algorithm Sprint",
  //   date: "Dec 1, 2023, 11:00 AM",
  //   duration: "3 hours",
  // },
];

const UpcomingContests = () => {
  return (
    <section className="text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Upcoming Contests</h2>

        {/* Contest Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contests.length > 0 ? (
            contests.map((contest) => (
              <div
                key={contest.id}
                className="bg-gray-900 p-6 rounded-xl shadow-md"
              >
                <h3 className="text-lg font-semibold">{contest.title}</h3>
                <p className="text-gray-400 text-sm">Starts: {contest.date}</p>
                <p className="text-gray-400 text-sm mb-4">
                  Duration: {contest.duration}
                </p>
                <button className="border border-teal-400 text-teal-400 px-4 py-2 rounded-lg hover:bg-teal-400 hover:text-black transition">
                  Register
                </button>
              </div>
            ))
          ) : (
            <div className="bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center">
              <h3 className="text-lg font-semibold">No Upcoming Contests</h3>
              <p className="text-gray-400 text-sm mt-2">
                There are no upcoming contests at the moment. Please check back
                later!
              </p>
            </div>
          )}
        </div>

        {/* View All Contests Button */}
        <div className="mt-6">
          <SecondaryOutlineBtn url="/contests" text="View All Contests" />
        </div>
      </div>
    </section>
  );
};

export default UpcomingContests;
