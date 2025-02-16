import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Get the pathname of the request (e.g. /, /protected, /chat)
  const path = request.nextUrl.pathname;

  // Define public routes that don't require authentication
  const isPublicRoute = path === '/login' || path === '/register' || path === '/';

  // Define protected routes
  const isProtectedRoute = 
    path.startsWith('/chat') || 
    path.startsWith('/consultation') || 
    path.startsWith('/dashboard') ||
    path.startsWith('/profile');

  // If the token exists and user tries to access public route
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If no token exists and user tries to access protected route
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
