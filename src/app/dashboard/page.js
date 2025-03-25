"use client";
import { useSelector } from "react-redux";
import Image from "next/image";

const Profile = () => {
  // Use useSelector to get the user from the Redux store
  const user = useSelector((state) => state.auth.user);

  // If no user data is available, show a loading message or redirect
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    );
  }

  // Format the date in a user-friendly way
  const createdAt = new Date(user.createAt);
  const formattedDate = `${createdAt.toLocaleString("default", {
    month: "short",
  })} ${createdAt.getDate()}, ${createdAt.getFullYear()}`;

  return (
    <div className=" max-w-6xl mx-auto text-white min-h-screen py-12 px-6">
      {/* Profile Picture */}
      <div className="flex justify-center mb-6">
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

      {/* Full Name */}
      <div className="flex justify-center mb-6">
        <h2 className="text-3xl font-semibold">{user.fullName}</h2>
      </div>

      {/* Profile Info Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <table className="w-full text-white">
          <tbody>
            <tr className="border-b border-gray-600">
              <td className="py-2 font-semibold text-gray-400">
                Current Rating
              </td>
              <td className="py-2 text-right">{user.rating}</td>
            </tr>
            <tr className="border-b border-gray-600">
              <td className="py-2 font-semibold text-gray-400">
                Solved Problems
              </td>
              <td className="py-2 text-right">{user.solveCount}</td>
            </tr>
            <tr className="border-b border-gray-600">
              <td className="py-2 font-semibold text-gray-400">Submissions</td>
              <td className="py-2 text-right">{user.submissionCount}</td>
            </tr>
            <tr>
              <td className="py-2 font-semibold text-gray-400">
                Registered At
              </td>
              <td className="py-2 text-right">{formattedDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
