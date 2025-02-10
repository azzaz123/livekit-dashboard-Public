import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  
  // Skip middleware for API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  if (!authToken && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 