import Link from "next/link";
import React from "react";

function Hero({ username, isLoggedIn }) {
  return (
    <section className=" text-white py-16 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">
            {isLoggedIn ? `Welcome Back, ${username}!` : "Welcome to NaiveOJ!"}
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            {isLoggedIn
              ? `Great to have you back! You're all set to continue solving exciting challenges, improve your skills, and take part in contests. Let's dive back in and level up your coding journey! 🚀`
              : `NaiveOJ is a platform where you can solve coding problems, take part in contests, and improve your coding skills. Get started today and take your coding journey to the next level!`}
          </p>
          <Link href="/problemset">
            <button className="bg-blue-600 cursor-pointer hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition">
              {isLoggedIn ? "Continue Your Journey" : "Get Started"}
            </button>
          </Link>
        </div>

        {/* Right Side - Hero Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="/hero-image.png"
            alt="Coding Illustration"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
