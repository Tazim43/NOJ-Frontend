import Navbar from "../components/Navbar.js";

export default function Home() {
  return (
    <div className=" max-w-11/12 m-auto">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <main className="p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to NaiveOJ</h1>
        <p className="text-lg">
          NaiveOJ is your go-to platform for competitive programming and coding
          challenges. Join us to sharpen your skills, compete in contests, and
          solve interesting problems.
        </p>
      </main>
    </div>
  );
}
