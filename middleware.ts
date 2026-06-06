import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin');
  const isOnAdminLogin = req.nextUrl.pathname === '/admin/login';

  // Allow public access to admin login page
  if (isOnAdminLogin) {
    // Redirect to dashboard if already logged in
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // Protect all other admin routes
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};

