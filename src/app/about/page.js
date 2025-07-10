"use client";

import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="min-h-screen text-white px-6 md:px-16 py-12">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-400 mb-4">
          About Us
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Welcome to <span className="font-bold">NaiveOJ</span> — a smart online
          platform for coding challenges, interviews, and contests.
        </p>
      </section>

      {/* Team Section */}
      <section className="mb-20">
        <h2 className="text-2xl text-teal-400 font-semibold text-center mb-10">
          Meet the Founder
        </h2>
        <div className="flex justify-center">
          <TeamMember
            name="Md. Tazim Uddin"
            role="Founder & Full-Stack Developer"
            image="/founder.jpg"
            icpcStatus="ICPC Asia West Finalist 2025"
            codeforcesRating="1853"
          />
        </div>
      </section>

      {/* Mission */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold text-teal-400 text-center">
          Our Mission
        </h2>
        <p className="text-gray-400 text-center max-w-3xl mx-auto mt-6 text-lg leading-relaxed">
          My mission with <span className="font-bold">NaiveOJ</span> is to
          empower programmers worldwide by providing high-quality problems,
          smart mock interviews, and seamless contest hosting — all under one
          platform.
        </p>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-semibold text-teal-400 text-center mb-10">
          Why Choose NaiveOJ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            title="Smart Online Judge"
            description="Our fast and accurate judging system supports real-time evaluations with detailed feedback."
          />
          <Feature
            title="AI Coding Interviewer"
            description="Prepare for technical interviews with AI-driven mock sessions tailored to your level."
          />
          <Feature
            title="Premium Problemsets"
            description="Access exclusive handpicked problems to sharpen your DSA and problem-solving skills."
          />
        </div>
      </section>
    </div>
  );
}

// --- Team Member Card ---
function TeamMember({ name, role, image, icpcStatus, codeforcesRating }) {
  return (
    <div className="bg-gray-900 px-10 py-12 rounded-2xl shadow-xl border border-gray-700 max-w-xl w-full hover:border-teal-500 transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <Image
          src={image}
          alt={name}
          width={144}
          height={144}
          className="rounded-full border-4 border-teal-400 shadow-md object-cover"
        />
        <h3 className="text-2xl md:text-3xl font-semibold mt-6">{name}</h3>
        <p className="text-gray-400 text-base md:text-lg mt-1">{role}</p>
        {icpcStatus && (
          <p className="text-teal-300 mt-3 text-sm md:text-base">
            {icpcStatus}
          </p>
        )}
        {codeforcesRating && (
          <p className="text-teal-300 text-sm md:text-base mt-1">
            Codeforces Rating: {codeforcesRating}
          </p>
        )}
      </div>
    </div>
  );
}

// --- Feature Card ---
function Feature({ title, description }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-teal-500 transition">
      <h3 className="text-xl font-semibold text-teal-400 mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
