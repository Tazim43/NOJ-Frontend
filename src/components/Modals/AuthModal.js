"use client"; // Ensure it's a Client Component
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function AuthModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    // Close modal when pressing Escape key
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      modalRef.current?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md z-50 animate-fade-in"
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        tabIndex={-1} // Make the modal focusable
        className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg w-96 text-center relative transform transition-all scale-100 animate-scale-in"
        aria-labelledby="modal-header"
        aria-describedby="modal-description"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-white transition duration-200 text-lg"
          aria-label="Close modal"
        >
          ✖
        </button>

        {/* Header */}
        <h2 id="modal-header" className="text-2xl font-bold mb-4">
          Welcome to NaiveOJ
        </h2>
        <p id="modal-description" className="text-gray-400 text-sm mb-6">
          Enhance your coding skills with us.
        </p>

        {/* Buttons */}
        <Link href="/auth/login">
          <button className="w-full py-2 mb-3 bg-primary-dark hover:bg-primary transition duration-200 text-white rounded-lg cursor-pointer shadow-md">
            Login
          </button>
        </Link>

        <Link href="/auth/signup">
          <button className="w-full py-2 bg-gray-700 hover:bg-gray-500 transition duration-200 text-white rounded-lg cursor-pointer shadow-md">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
