/**
 * Admin Layout
 * 
 * Root layout for Admin Portal with dark sidebar.
 */

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="lg:pl-64 pt-16 lg:pt-0">
                <AdminHeader />

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
