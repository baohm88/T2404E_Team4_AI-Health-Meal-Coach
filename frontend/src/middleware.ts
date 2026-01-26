import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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

    // 3. Phân quyền (RBAC)
    // Lưu ý: Middleware chạy trên Edge Runtime, một số thư viện nodejs không chạy được.
    // jwt-decode chạy tốt trên Edge.
    if (isAuthenticated && token) {
        try {
            const { jwtDecode } = require('jwt-decode'); // Import dynamic để tránh lỗi build static nếu có
            const decoded: any = jwtDecode(token);
            const role = decoded?.role || 'USER';

            // ⛔ ADMIN trying to access CLIENT Pages -> Redirect to Admin
            // (Optional: Prevent Admin from accidentally using user features)
            if (role === 'ADMIN' && pathname.startsWith('/dashboard')) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }

            // ⛔ USER trying to access ADMIN Pages -> Redirect to Dashboard
            if (role !== 'ADMIN' && pathname.startsWith('/admin')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        } catch (e) {
            console.error('Middleware decode error:', e);
            // If token invalid, maybe force logout? For now just ignore rbacs
        }
    }

    // 4. Cho phép tất cả các routes khác
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