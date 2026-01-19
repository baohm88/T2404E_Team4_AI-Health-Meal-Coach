/**
 * Next.js Middleware
 *
 * Route protection for authenticated routes.
 * GUEST FIRST FLOW: Onboarding is PUBLIC (no auth required)
 *
 * Protected routes: /dashboard/*
 * Public routes: /onboarding/*, /login, /register, /
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// CONSTANTS
// ============================================================

const TOKEN_COOKIE = 'access_token';

/** Routes that require authentication */
const PROTECTED_ROUTES = [
    '/dashboard',
];

/** Auth routes - redirect to dashboard if already logged in */
const AUTH_ROUTES = [
    '/login',
    '/register',
];

// ============================================================
// MIDDLEWARE
// ============================================================

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(TOKEN_COOKIE)?.value;
    const isAuthenticated = !!token;

    // Check route types
    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    // Protected routes: Redirect to login if not authenticated
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Auth routes: Redirect to dashboard if already authenticated
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// ============================================================
// CONFIG
// ============================================================

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|assets).*)',
    ],
};
