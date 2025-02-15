import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isChatPage = request.nextUrl.pathname.startsWith('/chat');

  // If trying to access chat without token, redirect to login
  if (isChatPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login with valid token, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/login']
};
