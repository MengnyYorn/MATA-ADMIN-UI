import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const sessionCookieName =
  process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin') && !request.cookies.has(sessionCookieName)) {
    const login = new URL('/login', request.url);
    login.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
