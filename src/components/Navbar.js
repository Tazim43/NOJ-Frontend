"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SecondaryOutlineBtn from "./Buttons/SecondaryOutlineBtn";
import AuthModal from "./Modals/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // Optional icon lib

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <nav className="bg-nav xl:px-20 md:px-10 px-5 py-3 ">
      <div className="flex justify-between items-center">
        {/* Left: Logo */}
        <div className="text-2xl font-bold text-white">
          <Link href="/">NOJ</Link>
        </div>

        {/* Center: Nav Links (hidden on mobile) */}
        <div className="hidden md:flex space-x-4 text-white">
          <Link
            href="/problemset"
            className="font-medium hover:text-gray-300 transition"
          >
            Problemset
          </Link>
          <Link
            href="/submissions"
            className="font-medium hover:text-gray-300 transition"
          >
            Submissions
          </Link>
          <Link
            href="/contests"
            className="font-medium hover:text-gray-300 transition"
          >
            Contests
          </Link>
          <Link
            href="/about"
            className="font-medium hover:text-gray-300 transition"
          >
            About Us
          </Link>
        </div>

        {/* Right: Auth/Profile (always visible) */}
        <div className="flex items-center space-x-4">
          {isMounted && user ? (
            <>
              <Link href="/dashboard">
                <div className="flex items-center space-x-2 text-white cursor-pointer">
                  <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-primary text-sm md:text-base ">
                    {"Dashboard"}
                  </span>
                </div>
              </Link>
              <span className="text-gray-500 hidden md:inline">|</span>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-500 cursor-pointer transition text-sm md:text-base"
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

          {/* Hamburger for mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col space-y-2 text-white">
          <Link
            href="/problemset"
            className="hover:text-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            Problemset
          </Link>
          <Link
            href="/contests"
            className="hover:text-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            Contests
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-300"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
}

export default Navbar;
