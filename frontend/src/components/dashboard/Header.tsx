/**
 * Dashboard Header Component
 *
 * Displays:
 * - Time-based greeting with emoji
 * - User name from JWT token
 * - Search and notification buttons
 *
 * @see /lib/auth.ts - JWT decoding utilities
 */

'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, UserCircle2 } from 'lucide-react';
import { getUserFromToken, TokenUser } from '@/lib/auth';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get time-based greeting with emoji
 * @returns Greeting string based on current hour
 */
const getGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) {
        return 'Chào buổi sáng ☀️';
    } else if (hour >= 11 && hour < 14) {
        return 'Chào buổi trưa 🌤️';
    } else if (hour >= 14 && hour < 18) {
        return 'Chào buổi chiều 🌥️';
    } else if (hour >= 18 && hour < 22) {
        return 'Chào buổi tối 🌙';
    } else {
        return 'Xin chào 👋';
    }
};

// ============================================================
// COMPONENT
// ============================================================

export function Header() {
    const [user, setUser] = useState<TokenUser | null>(null);
    const [greeting, setGreeting] = useState('Xin chào 👋');

    // Get user from JWT token on mount
    useEffect(() => {
        const tokenUser = getUserFromToken();
        setUser(tokenUser);
        setGreeting(getGreeting());
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-cream/80 backdrop-blur-xl border-b border-slate-100/50">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left: Greeting */}
                <div>
                    <p className="text-slate-500 text-sm">{greeting}</p>
                    <h1 className="text-xl font-bold text-slate-800">
                        {user?.fullName || 'Người dùng'}
                    </h1>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Search Button */}
                    <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <button className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                    </button>

                    {/* Avatar - Using UserCircle2 icon as default */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                        <UserCircle2 className="w-10 h-10 text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}
