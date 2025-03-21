import React from "react";
import Link from "next/link";

function Navbar() {
  const isAuthenticated = false;

  return (
    <nav className="flex bg-background justify-between items-center p-4 ">
      {/* Left side - Logo */}

      <div className="text-2xl font-bold">
        <Link href="/">NOJ</Link>
      </div>

      {/* Center - Navigation Links */}
      <div className="space-x-4">
        <Link
          href="/problemset"
          className=" font-medium hover:text-gray-300 transition duration-300"
        >
          Problemset
        </Link>
        <Link
          href="/contests"
          className="font-medium hover:text-gray-600 transition duration-300"
        >
          Contests
        </Link>
        <Link
          href="/about"
          className="font-medium hover:text-gray-600 transition duration-300"
        >
          About Us
        </Link>
      </div>

      {/* Right side - Join Now/Profile button */}
      <div>
        {!isAuthenticated ? (
          <Link
            href="/join"
            className="px-4 py-2 border border-secondary text-secondary rounded-lg font-bold transition duration-300  hover:outline-1 hover:outline-secondary"
          >
            Join Now
          </Link>
        ) : (
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">
            Profile
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
