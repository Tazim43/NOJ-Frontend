"use client"; // Ensure it's a Client Component
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLoginMutation } from "../../store/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function AuthModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorToast, setErrorToast] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  // Close modal when clicking outside the modal
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

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorToast("Please enter both email and password.");
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();

      if (result?.success) {
        dispatch(setCredentials(result.data)); // Store user data in Redux
        onClose(); // Close the modal (if applicable)
        router.push("/"); // Redirect to home/dashboard
      } else {
        setErrorToast(result?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorToast(error?.data?.message || "An unexpected error occurred.");
    }
  };

  if (!isOpen) return null; // Don't render if modal is closed

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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mb-4">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-primary-dark hover:bg-primary transition duration-200 text-white rounded-lg cursor-pointer shadow-md"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <Link href="/auth/signup">
          <button className="w-full py-2 bg-gray-700 hover:bg-gray-500 transition duration-200 text-white rounded-lg cursor-pointer shadow-md">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
