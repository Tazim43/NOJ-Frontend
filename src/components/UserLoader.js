"use client";

import { useGetCurrentUserQuery } from "@/store/services/authApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { closeAuthModal } from "@/store/slices/authModalSlice";

export default function UserLoader() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !hasCheckedStorage) {
      try {
        const storedUserData = localStorage.getItem("user");
        if (
          storedUserData &&
          storedUserData !== "undefined" &&
          storedUserData !== "null"
        ) {
          const storedUser = JSON.parse(storedUserData);
          if (storedUser && typeof storedUser === "object") {
            // Only set user if not already logged out in Redux
            if (!user) {
              dispatch(setUser(storedUser));
              dispatch(closeAuthModal());
            }
          }
        }
      } catch (error) {
        console.warn("Invalid user data in localStorage, clearing...");
        localStorage.removeItem("user");
      } finally {
        setHasCheckedStorage(true);
      }
    }
  }, [dispatch, hasCheckedStorage, user]);

  // Only fetch from API if no user exists and we've checked localStorage
  const shouldSkipQuery = !!user || !hasCheckedStorage;

  const { isSuccess, data, isError } = useGetCurrentUserQuery(undefined, {
    skip: shouldSkipQuery,
  });

  // Handle successful API response (authApi already handles localStorage)
  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUser(data.data));
      dispatch(closeAuthModal());
    }
  }, [isSuccess, data, dispatch]);

  // Handle API errors silently - user simply not logged in
  useEffect(() => {
    if (isError) {
      // Silently handle error - user is not authenticated
      dispatch(closeAuthModal());
    }
  }, [isError, dispatch]);

  return null;
}
