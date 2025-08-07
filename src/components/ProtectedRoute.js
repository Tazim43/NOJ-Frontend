"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { openAuthModal } from "@/store/slices/authModalSlice";
import { useGetCurrentUserQuery } from "@/store/services/authApi";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasStoredUser = isMounted && !!localStorage.getItem("user");

  // Skip query if user is in state OR if user is in localStorage
  const shouldSkipQuery = !!user || hasStoredUser;

  const { isLoading } = useGetCurrentUserQuery(undefined, {
    skip: shouldSkipQuery,
  });

  useEffect(() => {
    // If no user in state and no stored user, redirect to auth
    if (isMounted && !user && !hasStoredUser && !isLoading) {
      router.push("/");
      dispatch(openAuthModal());
    }
  }, [user, hasStoredUser, isLoading, isMounted, router, dispatch]);

  // Show loading until mounted or while API is loading
  if (!isMounted || (isLoading && hasStoredUser)) {
    return (
      <div className="p-8 min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (user || hasStoredUser) {
    return <div>{children}</div>;
  }

  return null;
}
