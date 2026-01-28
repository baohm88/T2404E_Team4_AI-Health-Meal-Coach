/**
 * Marketing Header Component
 * 
 * Simple header matching original Navbar design
 * Logo + Login + GET STARTED only
 */

'use client';

import { useIsAuthenticated } from '@/stores/useAuthStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function MarketingHeader() {
    const [scrolled, setScrolled] = useState(false);
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // console.log(isAuthenticated); // Debug removed
    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-bold text-xl tracking-tight text-slate-900">
                    AI Health Coach
                </Link>

                {/* Right Nav */}
                <div className="flex items-center gap-6">
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${scrolled
                                ? 'bg-primary text-white hover:bg-green-600'
                                : 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                                }`}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-slate-700 font-medium hover:text-slate-900 transition-colors hidden sm:block"
                            >
                                Login
                            </Link>
                            <Link
                                href="/onboarding"
                                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${scrolled
                                    ? 'bg-primary text-white hover:bg-green-600'
                                    : 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                                    }`}
                            >
                                GET STARTED
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
