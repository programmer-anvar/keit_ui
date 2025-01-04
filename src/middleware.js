import { NextResponse } from 'next/server';

// Define public and static paths
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];
const STATIC_PATHS = ['/_next', '/static', '/images', '/favicon.ico', '/api'];

export function middleware(request) {
    const { pathname, origin, search } = request.nextUrl;
    
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    // Allow static paths
    if (STATIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Handle public paths
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
    
    // If logged in and trying to access public paths, redirect to home
    if (isPublicPath && token) {
        console.log('Redirecting to home from public path');
        const response = NextResponse.redirect(new URL('/', origin));
        return response;
    }

    // If not logged in and trying to access protected paths, redirect to login
    if (!isPublicPath && !token) {
        console.log('Redirecting to login from protected path');
        const loginUrl = new URL('/login', origin);
        
        // Save the original path for redirect after login
        if (pathname !== '/') {
            const fullPath = search ? `${pathname}${search}` : pathname;
            loginUrl.searchParams.set('from', fullPath);
        }
        
        const response = NextResponse.redirect(loginUrl);
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. Matches any path starting with:
         *  - api (API routes)
         *  - _next/static (static files)
         *  - _next/image (image optimization files)
         *  - favicon.ico (favicon file)
         * 2. Matches root path "/"
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/'
    ],
};
