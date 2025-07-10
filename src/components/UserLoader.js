"use client";

import { useGetCurrentUserQuery } from "@/store/services/authApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";

export default function UserLoader() {
  const { data, isSuccess } = useGetCurrentUserQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    }
    console.log(data);
  }, [isSuccess, data, dispatch]);

  return null; // purely for loading user in background
}
