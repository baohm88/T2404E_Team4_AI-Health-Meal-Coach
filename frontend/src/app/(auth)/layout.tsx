'use client';

import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-cream-light)] via-[var(--color-cream-pink)] to-[var(--color-cream-blue)] flex items-center justify-center p-6">
            {/* Optional: Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            </div>

            {/* Form container */}
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
