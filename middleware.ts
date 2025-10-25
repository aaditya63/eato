// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const publicPaths = ["/", "/menu", "/about"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const authPaths = ["/login", "/signup"];
  if (authPaths.includes(pathname)) {
    if (token) {
      // User already logged in → redirect to home or dashboard
      return NextResponse.redirect(new URL("/", req.url));
    }
    // User not logged in → allow access
    return NextResponse.next();
  }

  // 3️⃣ API routes
  if (pathname.startsWith("/api")) {
    // Allow login/signup API without token

    const openApiPaths = ["/api/auth/login", "/api/auth/signup"];
    if (openApiPaths.includes(pathname)) {
      return NextResponse.next();
    }

    // Other API routes require token
    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify token
    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 4️⃣ Protected pages — require login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Define which routes middleware should run on
export const config = {
  matcher: [
    "/",
    "/menu",
    "/about",
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/:path*",
  ],
};
