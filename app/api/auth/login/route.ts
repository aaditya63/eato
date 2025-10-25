import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });

  const response = NextResponse.json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      gender: user.gender,
      age: user.age,
      profilePhoto: user.profilePhoto,
    },
  });

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}