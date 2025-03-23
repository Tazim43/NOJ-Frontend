"use client";
import React, { useState } from "react";
import Link from "next/link";
import SecondaryOutlineBtn from "./Buttons/SecondaryOutlineBtn";
import AuthModal from "./Modals/AuthModal";

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <SecondaryOutlineBtn
            text="Join Now"
            onClick={() => setIsModalOpen(true)}
          />
        ) : (
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">
            Profile
          </button>
        )}
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
}

export default Navbar;
