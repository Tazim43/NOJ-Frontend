"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const LOCAL_STORAGE_KEY = "userSettings";

const defaultUser = {
  fullName: "Tazim Uddin",
  username: "tazim01",
  email: "tazim@example.com",
  avatar: "/founder.jpg",
  nativeName: "তাজিম",
  publicEmail: "tazim@example.com",
  website: "https://example.com",
  company: "NaiveOJ",
  institution: "Patuakhali Science and Technology University",
  graduationYear: "2025",
  location: "Bhola, Bangladesh",
  timezone: "UTC +6:00 Dhaka Bangladesh",
  socialAccounts: "https://twitter.com/tazim",
  hideLastSeen: false,
};

export default function SettingsPage() {
  const [formData, setFormData] = useState(defaultUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch {
      // ignore errors
    }
  }, []);

  // Save to localStorage on formData change (debounced to avoid excessive writes)
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarFile(file);
      setFormData((prev) => ({
        ...prev,
        avatar: url,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate async save
    await new Promise((res) => setTimeout(res, 1000));

    alert("Changes saved to localStorage!");
    setIsSubmitting(false);
  };

  return null;

  return (
    <div className="max-w-6xl mx-auto px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-700 rounded-md p-6 space-y-6"
      >
        <div className="flex flex-col sm:flex-row gap-10">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500">
              <Image
                src={formData.avatar}
                alt="Avatar"
                fill
                sizes="112px"
                className="object-cover"
                unoptimized={
                  formData.avatar.startsWith("blob:") ||
                  formData.avatar.startsWith("data:")
                }
              />
            </div>
            <label className="mt-3 inline-block text-sm font-medium text-white bg-gray-800 border border-gray-600 px-4 py-1 rounded cursor-pointer hover:bg-gray-700 transition">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Native Name
              </label>
              <input
                type="text"
                name="nativeName"
                value={formData.nativeName}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Institution
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Time Zone
              </label>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">
                Social Accounts
              </label>
              <input
                type="text"
                name="socialAccounts"
                value={formData.socialAccounts}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                name="hideLastSeen"
                checked={formData.hideLastSeen}
                onChange={handleChange}
                className="accent-blue-500"
              />
              <label className="text-sm text-gray-400">
                Hide Last Seen Time
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 md:px-10 cursor-pointer mx-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
