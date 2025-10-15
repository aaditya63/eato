// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  
  const url = req.nextUrl.clone();

  // public routes
  if (url.pathname.startsWith('/api/auth') || url.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Optionally forward user info via headers:
    // req.headers.set('x-user-id', (payload as any).sub.toString());
    return NextResponse.next();
  } catch (err) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

}

// match whatever paths you want protected:
export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
