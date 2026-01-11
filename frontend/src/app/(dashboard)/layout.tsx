'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { useAuthStore } from '@/stores/useAuthStore';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, loginAsGuest } = useAuthStore();

    // Auto-login as guest for development
    useEffect(() => {
        if (!isAuthenticated) {
            loginAsGuest();
        }
    }, [isAuthenticated, loginAsGuest]);

    return (
        <div className="min-h-screen bg-cream">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="lg:pl-64">
                <Header />

                {/* Page Content */}
                <main className="p-6 pb-24 lg:pb-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
