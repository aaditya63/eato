"use client"

import { setUserFromStorage } from "@/lib/redux/auth/authSlice";
import { useCart } from "@/lib/redux/cart/useCart";
import { AppDispatch } from "@/lib/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AppInit() {
  const dispatch = useDispatch<AppDispatch>();

   const { fetchServerCart } = useCart();

  useEffect(() => {
    dispatch(setUserFromStorage());
    fetchServerCart();

  }, [dispatch]);

  return null;
}