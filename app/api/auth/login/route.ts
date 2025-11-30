import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { use } from "react";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: "Missing" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return NextResponse.json({ error: "Invalid Password" }, { status: 401 });

  const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

  const response = NextResponse.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,  //7 Days
  });


  if(user.role == "ADMIN")
    response.cookies.set({
    name: "role",
    value: "admin",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,  //7 Days
  });
    
  return response;
}