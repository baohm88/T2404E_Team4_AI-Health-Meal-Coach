/**
 * Admin Sidebar Component
 * 
 * Dark-themed sidebar for Admin Portal.
 * Distinguishes admin UI from user dashboard.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ADMIN_MENU_ITEMS, ADMIN_BRAND, AdminMenuItem } from '@/lib/constants/admin.constants';
import { Shield, ChevronLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

// ============================================================
// MAIN COMPONENT
// ============================================================

export function AdminSidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <DesktopSidebar pathname={pathname} />
            <MobileHeader
                isOpen={isMobileMenuOpen}
                onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            <MobileMenu
                pathname={pathname}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
        </>
    );
}

// ============================================================
// DESKTOP SIDEBAR
// ============================================================

interface NavProps {
    pathname: string;
}

const DesktopSidebar = ({ pathname }: NavProps) => (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-slate-900 p-6 z-40">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
                <span className="font-bold text-lg text-white block">{ADMIN_BRAND.NAME}</span>
                <span className="text-xs text-slate-400">Quản trị hệ thống</span>
            </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
            {ADMIN_MENU_ITEMS.map((item) => (
                <DesktopNavItem
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                />
            ))}
        </nav>

        {/* Back to User App */}
        <div className="pt-6 border-t border-slate-700">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
                <ChevronLeft className="w-4 h-4" />
                Quay lại User App
            </Link>
        </div>

        {/* Footer */}
        <div className="pt-4">
            <p className="text-xs text-slate-500">{ADMIN_BRAND.COPYRIGHT}</p>
        </div>
    </aside>
);

// ============================================================
// MOBILE COMPONENTS
// ============================================================

interface MobileHeaderProps {
    isOpen: boolean;
    onToggle: () => void;
}

const MobileHeader = ({ isOpen, onToggle }: MobileHeaderProps) => (
    <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-4 z-50">
        <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">{ADMIN_BRAND.NAME}</span>
        </Link>
        <button
            onClick={onToggle}
            className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white"
        >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
    </div>
);

interface MobileMenuProps {
    pathname: string;
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu = ({ pathname, isOpen, onClose }: MobileMenuProps) => (
    <div
        className={cn(
            'lg:hidden fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-40 transition-all duration-300',
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ paddingTop: '4rem' }}
    >
        <nav className="p-6 space-y-2">
            {ADMIN_MENU_ITEMS.map((item) => (
                <MobileNavItem
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    onClick={onClose}
                />
            ))}
        </nav>
    </div>
);

// ============================================================
// NAV ITEM COMPONENTS
// ============================================================

interface NavItemProps {
    item: AdminMenuItem;
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
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
        >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
        </Link>
    );
};

interface MobileNavItemProps extends NavItemProps {
    onClick: () => void;
}

const MobileNavItem = ({ item, isActive, onClick }: MobileNavItemProps) => {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all',
                isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-300 hover:bg-slate-800'
            )}
        >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
        </Link>
    );
};
