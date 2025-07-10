"use client";

import React, { useState } from "react";
import { useSignupMutation } from "@/store/services/authApi";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [signup, { isLoading }] = useSignupMutation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData((prev) => ({ ...prev, avatar: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.fullName.trim() ||
      !formData.password
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      // Prepare form data
      const payload = new FormData();
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("fullName", formData.fullName);
      payload.append("password", formData.password);
      if (formData.avatar) {
        payload.append("avatar", formData.avatar);
      }

      await signup(payload).unwrap();

      setSuccessMsg("User registered successfully! You can now log in.");
      setFormData({
        username: "",
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        avatar: null,
      });
    } catch (err) {
      setErrorMsg(
        err?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-gray-850 rounded-2xl shadow-xl border border-gray-700 p-8">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-white tracking-wide">
          Create an Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
          noValidate
        >
          {[
            {
              label: "Username",
              name: "username",
              type: "text",
              placeholder: "Choose a username",
              required: true,
            },
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "you@example.com",
              required: true,
            },
            {
              label: "Full Name",
              name: "fullName",
              type: "text",
              placeholder: "Your full name",
              required: true,
            },
            {
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "Enter password",
              required: true,
            },
            {
              label: "Confirm Password",
              name: "confirmPassword",
              type: "password",
              placeholder: "Confirm your password",
              required: true,
            },
          ].map(({ label, name, type, placeholder, required }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                value={formData[name]}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500
                  focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:border-cyan-400
                  transition-shadow duration-300 shadow-sm
                  hover:shadow-md
                "
                autoComplete={
                  name === "password" || name === "confirmPassword"
                    ? "new-password"
                    : "off"
                }
                spellCheck="false"
              />
            </div>
          ))}

          {/* Avatar Upload */}
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Avatar (optional)
            </label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-gray-300 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 cursor-pointer
                file:cursor-pointer
                file:bg-cyan-600 file:text-white file:px-4 file:py-1 file:rounded-lg
                file:hover:bg-cyan-700
                transition-colors duration-300
              "
            />
            {formData.avatar && (
              <p
                className="mt-2 text-sm text-cyan-400 font-medium truncate"
                title={formData.avatar.name}
              >
                {formData.avatar.name}
              </p>
            )}
          </div>

          {/* Error message */}
          {errorMsg && (
            <div
              role="alert"
              className="rounded-md bg-red-700/80 text-red-200 py-2 px-4 text-center font-semibold animate-fadeIn"
            >
              {errorMsg}
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div
              role="alert"
              className="rounded-md bg-green-700/80 text-green-200 py-2 px-4 text-center font-semibold animate-fadeIn"
            >
              {successMsg}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-semibold py-3 rounded-xl
              shadow-lg transition-transform transform hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>

      {/* Animate fadeIn keyframes for messages */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        /* custom bg color */
        .bg-gray-850 {
          background-color: #1f2937;
        }
      `}</style>
    </div>
  );
}
