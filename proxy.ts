import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import {
  isRequestBodyWithinLimit,
  isTrustedMutationRequest,
} from '@/lib/request-security';

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin');
  const isOnAdminLogin = req.nextUrl.pathname === '/admin/login';

  if (req.nextUrl.pathname.startsWith('/api/') && !isTrustedMutationRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Origin request tidak diizinkan' },
      { status: 403 }
    );
  }

  if (req.nextUrl.pathname.startsWith('/api/') && !(await isRequestBodyWithinLimit(req))) {
    return NextResponse.json(
      { success: false, error: 'Ukuran request melebihi batas yang diizinkan' },
      { status: 413 }
    );
  }

  // Allow public access to admin login page
  if (isOnAdminLogin) {
    // Redirect to dashboard if already logged in
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
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
  matcher: ['/admin/:path*', '/api/:path*'],
};

