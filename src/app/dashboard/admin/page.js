"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";

const dummyUsers = [
  {
    id: 1,
    fullName: "Tazim Uddin",
    username: "tazim01",
    email: "tazim@example.com",
    role: "admin",
  },
  {
    id: 2,
    fullName: "Alice Johnson",
    username: "alicej",
    email: "alice@example.com",
    role: "user",
  },
  {
    id: 3,
    fullName: "Bob Smith",
    username: "bob22",
    email: "bob@example.com",
    role: "user",
  },
];

export default function AdminPanelPage() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const user = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState(dummyUsers);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({});

  if (!user || user.email !== adminEmail) {
    return (
      <div className="text-red-500 text-center mt-20 text-lg font-semibold">
        ❌ Access Denied — Admins Only
      </div>
    );
  }

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setFormState(user);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormState({});
  };

  const handleSave = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === editingId ? { ...formState } : u))
    );
    setEditingId(null);
    setFormState({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="text-white px-4 md:px-8 py-10  mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3 text-sm md:text-base">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-3">Full Name</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-md"
              >
                <td className="p-4">
                  {editingId === u.id ? (
                    <input
                      name="fullName"
                      value={formState.fullName}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-600 px-2 py-1 rounded text-white w-full"
                    />
                  ) : (
                    u.fullName
                  )}
                </td>
                <td className="p-4">
                  {editingId === u.id ? (
                    <input
                      name="username"
                      value={formState.username}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-600 px-2 py-1 rounded text-white w-full"
                    />
                  ) : (
                    u.username
                  )}
                </td>
                <td className="p-4">
                  {editingId === u.id ? (
                    <input
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-600 px-2 py-1 rounded text-white w-full"
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td className="p-4">
                  {editingId === u.id ? (
                    <select
                      name="role"
                      value={formState.role}
                      onChange={handleChange}
                      className="bg-gray-800 border border-gray-600 px-2 py-1 rounded text-white w-full"
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  ) : (
                    <span
                      className={`${
                        u.role === "admin" ? "text-yellow-400" : "text-teal-400"
                      } font-medium`}
                    >
                      {u.role}
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  {editingId === u.id ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 text-green-400 border border-green-500 hover:bg-green-500 hover:text-white rounded transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 text-gray-400 border border-gray-600 hover:bg-gray-700 hover:text-white rounded transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(u)}
                        className="px-3 py-1 text-blue-400 border border-blue-500 hover:bg-blue-500 hover:text-white rounded transition flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1 text-red-400 border border-red-500 hover:bg-red-500 hover:text-white rounded transition flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
