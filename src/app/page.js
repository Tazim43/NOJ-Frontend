import Hero from "@/components/Home/Hero.js";
import Navbar from "../components/Navbar.js";
import UpcomingContests from "@/components/Home/UpcommingContests.js";
import Footer from "@/components/Footer.js";
import LatestProblemList from "@/components/Problems/LatestProblemList.js";

export default function Home() {
  return (
    <>
      {/* Main Content */}
      <Hero />

      <UpcomingContests />

      <LatestProblemList />
    </>
  );
}
