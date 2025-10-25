"use client"

import { setUserFromStorage } from "@/lib/redux/auth/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AppInit() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setUserFromStorage());
  }, [dispatch]);

  return null;
}