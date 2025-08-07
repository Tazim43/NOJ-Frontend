"use client"; // Ensure it's a Client Component
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AuthModal({ onClose }) {
  const modalRef = useRef(null);
  const [errorToast, setErrorToast] = useState(null);

  const isOpen = useSelector((state) => state.authModal.isOpen);

  useEffect(() => {
    // Close modal when pressing Escape key
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    // Close modal when clicking outside the modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      modalRef.current?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle google login
  const handleLogin = () => {
    if (
      !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      !process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ||
      !process.env.NEXT_PUBLIC_GOOGLE_ROOT_URL
    ) {
      setErrorToast("Sorry, Internal Server Error");
      return;
    }

    const options = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
      response_type: "code",
      access_type: "offline",
      prompt: "select_account",
      scope: "openid email profile",
    };

    const qs = new URLSearchParams(options).toString();

    const googleAuthUrl = `${process.env.NEXT_PUBLIC_GOOGLE_ROOT_URL}?${qs}`;

    window.location.href = googleAuthUrl; // Redirect to Google OAuth
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-xl z-50 animate-fade-in"
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
        <p id="modal-description" className="text-red-400 text-sm mb-2">
          {errorToast}
        </p>

        <button
          onClick={handleLogin}
          className="w-full py-2 mb-2 bg-[#5595fc] hover:bg-[#357ae8] transition duration-200 text-white rounded-lg cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 48 48"
            className="inline-block"
            aria-hidden="true"
          >
            <g>
              <path
                fill="#4285F0"
                d="M24 9.5c3.54 0 6.73 1.22 9.24 3.23l6.91-6.91C36.36 2.09 30.55 0 24 0 14.61 0 6.27 5.48 1.91 13.44l8.51 6.62C12.77 13.1 17.97 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.09 24.56c0-1.64-.15-3.22-.42-4.76H24v9.04h12.44c-.54 2.91-2.18 5.38-4.65 7.04l7.23 5.62C43.73 37.73 46.09 31.76 46.09 24.56z"
              />
              <path
                fill="#FBBC05"
                d="M13.42 28.06c-.54-1.62-.85-3.34-.85-5.06s.31-3.44.85-5.06l-8.51-6.62C2.31 14.82 1 19.23 1 24c0 4.77 1.31 9.18 3.91 12.68l8.51-6.62z"
              />
              <path
                fill="#EA4335"
                d="M24 46c6.55 0 12.36-2.09 16.91-5.72l-7.23-5.62c-2.01 1.35-4.57 2.14-7.68 2.14-6.03 0-11.23-3.6-13.58-8.82l-8.51 6.62C6.27 42.52 14.61 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </g>
          </svg>
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
