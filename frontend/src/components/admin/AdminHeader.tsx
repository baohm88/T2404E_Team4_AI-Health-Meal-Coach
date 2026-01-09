/**
 * Admin Header Component
 * 
 * Header for Admin pages with page title and admin info.
 */

'use client';

import { usePathname } from 'next/navigation';
import { Shield, Bell } from 'lucide-react';
import { ADMIN_MENU_ITEMS } from '@/lib/constants/admin.constants';

export function AdminHeader() {
    const pathname = usePathname();

    // Get current page info
    const currentPage = ADMIN_MENU_ITEMS.find(item => item.href === pathname);
    const pageTitle = currentPage?.label || 'Admin';

    return (
        <header className="sticky top-0 lg:top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left: Page Title */}
                <div>
                    <h1 className="text-xl font-bold text-slate-800">{pageTitle}</h1>
                    <p className="text-sm text-slate-500">
                        {currentPage?.description || 'Admin Dashboard'}
                    </p>
                </div>

                {/* Right: Admin Info */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                    </button>

                    {/* Admin Avatar */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800">Admin</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
