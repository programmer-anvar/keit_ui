import { NextResponse } from 'next/server';

export async function authMiddleware(req) {
    const token = req.cookies.get('accessToken');
    
    const url = req.nextUrl.clone();

    if (!token && url.pathname !== '/login') {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (token && url.pathname === '/login') {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
