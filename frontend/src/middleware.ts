import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// CONSTANTS
// ============================================================

const TOKEN_COOKIE = 'access_token';

/** Routes bắt buộc phải đăng nhập mới xem được */
const PROTECTED_ROUTES = [
    '/dashboard',
];

/** Routes dành cho Guest (Login/Register).
 * Nếu đã đăng nhập thì sẽ bị đá về Dashboard.
 */
const AUTH_ROUTES = [
    '/login',
    '/register',
];

// ============================================================
// MIDDLEWARE
// ============================================================

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // Lấy token từ cookie (Middleware chạy ở server/edge nên cần lấy từ cookie)
    const token = request.cookies.get(TOKEN_COOKIE)?.value;
    const isAuthenticated = !!token;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    // 1. Bảo vệ Dashboard: Chưa đăng nhập -> Đá về Login
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Xử lý Auth Routes (Login/Register): Đã đăng nhập -> Đá về Dashboard
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 3. Cho phép tất cả các routes khác (/, /onboarding, /onboarding/result, etc.)
    return NextResponse.next();
}

// ============================================================
// CONFIG
// ============================================================

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|assets).*)',
    ],
};