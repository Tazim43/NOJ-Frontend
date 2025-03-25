"use client";
import React, { useEffect, useState } from "react";
import Hero from "@/components/Home/Hero.js";
import UpcomingContests from "@/components/Home/UpcommingContests.js";
import LatestProblemList from "@/components/Problems/LatestProblemList.js";
import { useSelector } from "react-redux";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* Main Content */}

      {isMounted && user ? (
        <Hero username={user.fullName || user.username} isLoggedIn={true} />
      ) : (
        <Hero />
      )}

      <UpcomingContests />

      <LatestProblemList />
    </>
  );
}
