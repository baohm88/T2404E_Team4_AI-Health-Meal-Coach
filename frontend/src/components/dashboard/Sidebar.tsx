/**
 * Sidebar Component
 * 
 * Responsive navigation - Desktop sidebar + Mobile bottom nav.
 * Uses constants from dashboard.constants.ts
 * 
 * @see /lib/constants/dashboard.constants.ts
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';
import {
    DASHBOARD_MENU_ITEMS,
    BRAND,
    MenuItem
} from '@/lib/constants/dashboard.constants';
import { useLogout } from '@/hooks/use-logout';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { getUserFromToken, TokenUser } from '@/lib/auth';

// ============================================================
// MAIN COMPONENT
// ============================================================

export function Sidebar() {
    const pathname = usePathname();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { logout, isLoggingOut } = useLogout();

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = async () => {
        await logout();
        setIsLogoutModalOpen(false);
    };

    const handleLogoutCancel = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            <DesktopSidebar
                pathname={pathname}
                onLogoutClick={handleLogoutClick}
                isLoggingOut={isLoggingOut}
            />
            <MobileBottomNav
                pathname={pathname}
                onLogoutClick={handleLogoutClick}
                isLoggingOut={isLoggingOut}
            />

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                isLoading={isLoggingOut}
            />
        </>
    );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface NavProps {
    pathname: string;
    onLogoutClick: () => void;
    isLoggingOut: boolean;
}

/** Desktop Sidebar */
const DesktopSidebar = ({ pathname, onLogoutClick, isLoggingOut }: NavProps) => (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/70 backdrop-blur-xl border-r border-slate-100 p-6 z-40">
        {/* Logo */}
        <Link href="/" className="mb-10 block transition-transform active:scale-95">
            <Logo />
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
            {DASHBOARD_MENU_ITEMS.map((item) => (
                <DesktopNavItem key={item.href} item={item} isActive={pathname === item.href} />
            ))}
        </nav>

        {/* User Info & Logout - Fixed at bottom */}
        <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
            {/* User Display */}
            <UserDisplay />

            {/* Logout Button */}
            <button
                onClick={onLogoutClick}
                disabled={isLoggingOut}
                className={cn(
                    'flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all',
                    'text-slate-500 hover:bg-red-50 hover:text-red-600',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
            >
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
            </button>
        </div>

        {/* Footer */}
        <div className="pt-4">
            <p className="text-xs text-slate-400 text-center">{BRAND.COPYRIGHT}</p>
        </div>
    </aside>
);

/** Mobile Bottom Navigation */
const MobileBottomNav = ({ pathname, onLogoutClick, isLoggingOut }: NavProps) => (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-4 z-50 safe-area-pb">
        {DASHBOARD_MENU_ITEMS.map((item) => (
            <MobileNavItem key={item.href} item={item} isActive={pathname === item.href} />
        ))}
        {/* Mobile Logout Button */}
        <button
            onClick={onLogoutClick}
            disabled={isLoggingOut}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all text-slate-400 hover:text-red-500"
        >
            <LogOut className="w-6 h-6" />
            <span className="text-xs font-medium">Thoát</span>
        </button>
    </nav>
);

// ============================================================
// NAV ITEM COMPONENTS
// ============================================================

interface NavItemProps {
    item: MenuItem;
    isActive: boolean;
}

const DesktopNavItem = ({ item, isActive }: NavItemProps) => {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
        >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
        </Link>
    );
};

const MobileNavItem = ({ item, isActive }: NavItemProps) => {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                isActive ? 'text-primary' : 'text-slate-400'
            )}
        >
            <Icon className={cn('w-6 h-6', isActive && 'stroke-[2.5px]')} />
            <span className="text-xs font-medium">{item.label}</span>
        </Link>
    );
};

// ============================================================
// USER DISPLAY COMPONENT
// ============================================================

/** Displays current user info from JWT token */
const UserDisplay = () => {
    const [user, setUser] = useState<TokenUser | null>(null);

    useEffect(() => {
        const tokenUser = getUserFromToken();
        setUser(tokenUser);
    }, []);

    if (!user) return null;

    return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50">
            <UserCircle className="w-8 h-8 text-slate-400" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                    {user.fullName}
                </p>
                <p className="text-xs text-slate-500 truncate">
                    {user.email}
                </p>
            </div>
        </div>
    );
};
