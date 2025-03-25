"use client";
import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import SecondaryOutlineBtn from "./Buttons/SecondaryOutlineBtn";
import AuthModal from "./Modals/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Clear user data from Redux
    router.push("/");
  };

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

      <div className="flex items-center space-x-4">
        {isMounted && user ? (
          <>
            {/* Profile Icon & Username */}
            <Link href="/dashboard">
              <div className="flex items-center space-x-2 text-white cursor-pointer">
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  width={32} // Width of the avatar
                  height={32} // Height of the avatar
                  className="rounded-full"
                />
                <span className=" text-primary ">{user.username}</span>
              </div>
            </Link>

            {/* Divider */}
            <span className="text-gray-500">|</span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-red-400 cursor-pointer hover:text-red-500 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <SecondaryOutlineBtn
            text="Join Now"
            onClick={() => setIsModalOpen(true)}
          />
        )}
      </div>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
}

export default Navbar;
