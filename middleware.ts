// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  email: string;
  role: string;
}

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
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

  if (pathname.startsWith("/api")) {
    
    // Public API routes
    if (pathname.startsWith("/api/public")) {
      return NextResponse.next();
    }
    
    // Allow login/signup API without token
    const openApiPaths = [
      "/api/auth/login",
      "/api/auth/signup",
      "/api/auth/logout",
    ];
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

    // Verify token and then attach user info to request headers
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const user = payload as unknown as JwtPayload;

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-email", user.email);
      requestHeaders.set("x-user-role", user.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (err) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  //  Protected pages — require login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// middleware should run on
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
