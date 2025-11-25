"use client";

import { useGetCurrentUserQuery } from "@/store/services/authApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { closeAuthModal } from "@/store/slices/authModalSlice";

export default function UserLoader() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Always fetch from API on mount if no user in Redux
  // Cookies will be sent automatically with credentials: 'include'
  const { isSuccess, data, isError } = useGetCurrentUserQuery(undefined, {
    skip: !!user,
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
      // Don't close auth modal here - let the error handling in authApi handle it
    }
  }, [isError, dispatch]);

  return null;
}
