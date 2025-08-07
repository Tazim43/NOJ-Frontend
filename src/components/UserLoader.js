"use client";

import { useGetCurrentUserQuery } from "@/store/services/authApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { closeAuthModal } from "@/store/slices/authModalSlice";

export default function UserLoader() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("user") !== "undefined"
    ) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        dispatch(setUser(storedUser));
        dispatch(closeAuthModal());
      }
    }
  }, [dispatch]);

  if (user) {
    return null; // User already loaded, no need to fetch again
  }

  const { data, isSuccess } = useGetCurrentUserQuery();
  useEffect(() => {
    dispatch(closeAuthModal());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data.data));
      dispatch(closeAuthModal());
    }
  }, [isSuccess, data, dispatch]);

  return null; // purely for loading user in background
}
