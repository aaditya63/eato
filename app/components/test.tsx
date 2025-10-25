"use client";
import { useAppSelector } from "@/lib/redux/hooks";
import React from "react";

type Props = {};

export default function TestLoginData({}: Props) {
  const { isUserLoggedIn, user } = useAppSelector((state) => state.auth);
  return (
    <div>
      <p>User is {user?.name}</p>
      <p>Logged in {isUserLoggedIn ? "true" : "false"}</p>
      test
    </div>
  );
}
