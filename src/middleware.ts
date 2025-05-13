import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  const path = request.nextUrl.pathname;
  
  // Protected routes that require authentication
  const strictlyProtectedPaths = [
    '/profile/edit',
    '/quiz/create',
    '/dashboard'
  ];
  
  // Special case: /profile is protected but /profile/[userId] is public
  const isBaseProfilePath = path === '/profile';
  
  // For /profile/[userId], we allow public access to view profiles
  const isUserProfilePath = path.match(/^\/profile\/[^\/]+$/);
  
  // Check if the path is one of the strictly protected paths
  const isStrictlyProtected = strictlyProtectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
  
  // Require authentication for strictly protected paths and base profile path
  if ((isStrictlyProtected || isBaseProfilePath) && !isAuthenticated) {
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/quiz/create/:path*',
    '/dashboard/:path*',
  ],
};