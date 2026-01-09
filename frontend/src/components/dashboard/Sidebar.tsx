/**
 * Sidebar Component
 * 
 * Responsive navigation - Desktop sidebar + Mobile bottom nav.
 * Uses constants from dashboard.constants.ts
 * 
 * @see /lib/constants/dashboard.constants.ts
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    DASHBOARD_MENU_ITEMS,
    BRAND,
    MenuItem
} from '@/lib/constants/dashboard.constants';

// ============================================================
// MAIN COMPONENT
// ============================================================

export function Sidebar() {
    const pathname = usePathname();

    return (
        <>
            <DesktopSidebar pathname={pathname} />
            <MobileBottomNav pathname={pathname} />
        </>
    );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface NavProps {
    pathname: string;
}

/** Desktop Sidebar */
const DesktopSidebar = ({ pathname }: NavProps) => (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white/70 backdrop-blur-xl border-r border-slate-100 p-6 z-40">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">{BRAND.SHORT_NAME}</span>
            </div>
            <span className="font-bold text-xl text-slate-800">{BRAND.NAME.replace('AI ', '')}</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
            {DASHBOARD_MENU_ITEMS.map((item) => (
                <DesktopNavItem key={item.href} item={item} isActive={pathname === item.href} />
            ))}
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">{BRAND.COPYRIGHT}</p>
        </div>
    </aside>
);

/** Mobile Bottom Navigation */
const MobileBottomNav = ({ pathname }: NavProps) => (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-4 z-50 safe-area-pb">
        {DASHBOARD_MENU_ITEMS.map((item) => (
            <MobileNavItem key={item.href} item={item} isActive={pathname === item.href} />
        ))}
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
