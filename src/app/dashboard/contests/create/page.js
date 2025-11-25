"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateContestMutation } from "@/store/services/contestsApi";
import { useGetAllProblemsQuery } from "@/store/services/problemsApi";

export default function CreateContestPage() {
  const router = useRouter();
  const [createContest, { isLoading: creating }] = useCreateContestMutation();
  const { data: problemsData } = useGetAllProblemsQuery();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    timeZone: "UTC",
    contestType: "Individual",
    scoringRules: "ICPC",
    registrationStartTime: "",
    registrationEndTime: "",
    isPrivate: false,
    accessCode: "",
    maxParticipants: "",
    allowLateJoin: false,
    clarificationsEnabled: true,
    isVisible: true,
    problems: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProblemToggle = (problemId) => {
    setFormData((prev) => ({
      ...prev,
      problems: prev.problems.includes(problemId)
        ? prev.problems.filter((id) => id !== problemId)
        : [...prev.problems, problemId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      alert("Start time must be before end time");
      return;
    }

    if (
      new Date(formData.registrationStartTime) >=
      new Date(formData.registrationEndTime)
    ) {
      alert("Registration start must be before registration end");
      return;
    }

    if (new Date(formData.registrationEndTime) > new Date(formData.startTime)) {
      alert("Registration must end before contest starts");
      return;
    }

    try {
      // Generate problem order (A, B, C, etc.) and default scores
      const problemOrder = formData.problems.map(
        (_, index) => String.fromCharCode(65 + index) // A, B, C, D...
      );
      const problemScores = formData.problems.map(() => 100); // Default 100 points each

      const contestData = {
        ...formData,
        problemOrder,
        problemScores,
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : null,
      };

      const result = await createContest(contestData).unwrap();
      alert("✅ Contest created successfully!");
      router.push(`/contests/${result.contest._id}`);
    } catch (error) {
      alert(
        `❌ Failed to create contest: ${error.data?.message || "Try again"}`
      );
    }
  };

  const problems = problemsData?.problems || [];

  return (
    <div className="text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Contest</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Basic Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Contest Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g., Weekly Contest #1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Describe your contest..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contest Type *
                </label>
                <select
                  name="contestType"
                  value={formData.contestType}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="Individual">Individual</option>
                  <option value="Team">Team</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Scoring Rules *
                </label>
                <select
                  name="scoringRules"
                  value={formData.scoringRules}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="ICPC">ICPC</option>
                  <option value="IOI">IOI</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Time Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Time Settings</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Registration Start *
                </label>
                <input
                  type="datetime-local"
                  name="registrationStartTime"
                  value={formData.registrationStartTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Registration End *
                </label>
                <input
                  type="datetime-local"
                  name="registrationEndTime"
                  value={formData.registrationEndTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contest Start *
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contest End *
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Time Zone
              </label>
              <input
                type="text"
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Access Control</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Private Contest</label>
            </div>

            {formData.isPrivate && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Access Code
                </label>
                <input
                  type="text"
                  name="accessCode"
                  value={formData.accessCode}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter access code for private contest"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Participants (optional)
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="allowLateJoin"
                checked={formData.allowLateJoin}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Allow Late Join</label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="clarificationsEnabled"
                checked={formData.clarificationsEnabled}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">
                Enable Clarifications
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">
                Make Contest Visible
              </label>
            </div>
          </div>
        </div>

        {/* Problems Selection */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Select Problems</h3>
          <p className="text-sm text-gray-400 mb-4">
            Choose problems for this contest
          </p>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <input
                  type="checkbox"
                  checked={formData.problems.includes(problem._id)}
                  onChange={() => handleProblemToggle(problem._id)}
                  className="w-4 h-4"
                />
                <label className="flex-1 cursor-pointer">
                  <span className="font-medium">{problem.title}</span>
                  <span
                    className={`ml-2 text-xs px-2 py-1 rounded ${
                      problem.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-400"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </label>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-400 mt-4">
            {formData.problems.length} problem(s) selected
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={creating || formData.problems.length === 0}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition font-medium"
          >
            {creating ? "Creating..." : "Create Contest"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
