import React from "react";

function Hero() {
  return (
    <section className=" text-white py-16 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">Welcome to NaiveOJ</h1>
          <p className="text-lg text-gray-300 mb-6">
            Join <span className="text-blue-400 font-semibold">NaiveOJ</span> to
            solve challenging problems, compete in contests, and enhance your
            coding skills. Start your journey today! 🚀
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition">
            Get Started
          </button>
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
