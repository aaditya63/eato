"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart, UserRound, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";

type Props = {};

export default function Navbar({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div className={`${ pathname.includes("login") || pathname.includes("signup") ? "hidden" : ""} grid grid-cols-2 md:grid-cols-5 w-full h-[50px] bg-[#FFFD8F] p-2`}>
        <div className="flex justify-start items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="flex md:hidden text-[#043915]"
          >
            <Menu className="h-6 w-6" />
          </button>

          <p className="text-[24px] font-[700] text-[#043915]">Eato</p>
        </div>

        <div className="hidden md:flex col-span-3 justify-center items-center gap-3">
          <Button
            onClick={() => router.push("/")}
            className="bg-transparent hover:bg-transparent text-[#043915] font-[700] text-[18px] hover:underline cursor-pointer"
          >
            Home
          </Button>
          <Button
            onClick={() => { router.push("/menu"); }}
            className="bg-transparent hover:bg-transparent text-[#043915] font-[700] text-[18px] hover:underline cursor-pointer"
          >
            Menu
          </Button>
          <Button
            onClick={() => router.push("/about")}
            className="bg-transparent hover:bg-transparent text-[#043915] font-[700] text-[18px] hover:underline cursor-pointer"
          >
            About
          </Button>
        </div>

        <div className="flex justify-end items-center gap-2">
          <Button className="bg-[#B0CE88] text-[#043915] font-[700] hover:bg-[#B0CE88] cursor-pointer">
            <ShoppingCart className="mr-1" /> Cart
          </Button>
          <Button onClick={() => router.push("/login")}  className="bg-[#B0CE88] text-[#043915] font-[700] hover:bg-[#B0CE88] cursor-pointer">
            <UserRound className="mr-1" /> Login
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#FFFD8F] text-[#043915] p-5 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-[#043915]"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Sidebar content */}
        <div className="mt-10 flex flex-col gap-6">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="bg-transparent text-[#043915] text-lg font-bold hover:underline"
          >
            Home
          </Button>
          <Button
            onClick={() => router.push("/menu")}
            variant="ghost"
            className="bg-transparent text-[#043915] text-lg font-bold hover:underline"
          >
            Menu
          </Button>
          <Button
            onClick={() => router.push("/about")}
            variant="ghost"
            className="bg-transparent text-[#043915] text-lg font-bold hover:underline"
          >
            About
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 bg-opacity-30 z-40"
        />
      )}
    </>
  );
}
