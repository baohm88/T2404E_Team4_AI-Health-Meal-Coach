'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { Bell, Search, UserCircle2 } from 'lucide-react';

export function Header() {
    const user = useAuthStore((state) => state.user);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Chào buổi sáng';
        if (hour < 18) return 'Chào buổi chiều';
        return 'Chào buổi tối';
    };

    return (
        <header className="sticky top-0 z-30 bg-cream/80 backdrop-blur-xl border-b border-slate-100/50">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left: Greeting */}
                <div>
                    <p className="text-slate-500 text-sm">{getGreeting()} 👋</p>
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
