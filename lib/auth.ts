// lib/auth.ts
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Reads the JWT from cookies, verifies it, and returns the user if valid.
 * Works inside server components or server API routes.
 */
export async function getUserFromRequest(req: Request) {
  // Get raw cookie header (e.g. "token=abc123; other=value")
  const cookie = req.headers.get("cookie") || "";

  // Extract the "token" value using regex
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;

  const token = match[1];
  try {
    // Decode + verify the token using your secret
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };

    // Find the user in the database using the ID stored in the token
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true, email: true, name: true },
    });

    return user;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}
