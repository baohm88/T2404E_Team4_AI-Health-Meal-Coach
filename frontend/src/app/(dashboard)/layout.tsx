'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
// Không import useRouter hay useEffect để redirect ở đây để tránh loop

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 🛡️ AUTH GUARD:
    // Việc kiểm tra đăng nhập đã được xử lý bởi src/middleware.ts
    // Dashboard không cần tự kiểm tra lại để tránh xung đột redirect (Loop).

    return (
        <div className="min-h-screen bg-cream">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="lg:pl-64">
                <Header />

                {/* Main Page Content */}
                <main className="p-6 pb-24 lg:pb-6">
                    {children}
                </main>
            </div>
        </div>
    );
}