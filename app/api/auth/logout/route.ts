import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const headers = new Headers();

  // Clear token cookie
  headers.append(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
  );

  // Clear another cookie
  headers.append(
    "Set-Cookie",
    serialize("role", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })
  );

  return NextResponse.json(
    { message: "logged out", success: true },
    { headers }
  );
}

