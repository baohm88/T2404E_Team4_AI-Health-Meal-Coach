/**
 * Marketing Footer Component
 * 
 * Footer with logo, quick links, legal links, and copyright
 */

'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const QUICK_LINKS = [
    { href: '/', label: 'Trang chủ' },
    { href: '/about', label: 'Về chúng tôi' },
    { href: '/contact', label: 'Liên hệ' },
];

const LEGAL_LINKS = [
    { href: '/privacy', label: 'Chính sách bảo mật' },
    { href: '/terms', label: 'Điều khoản sử dụng' },
];

export function MarketingFooter() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Tagline */}
                    <div className="md:col-span-2">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 font-bold text-xl text-slate-900 mb-4"
                        >
                            <span className="text-2xl">🏥</span>
                            <span>AI Health Coach</span>
                        </Link>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                            Huấn luyện viên sức khỏe cá nhân được hỗ trợ bởi AI.
                            Giúp bạn đạt được mục tiêu sức khỏe một cách khoa học và bền vững.
                        </p>

                        {/* Contact Info */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail className="w-4 h-4 text-emerald-600" />
                                <span>support@aihealth.vn</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-4 h-4 text-emerald-600" />
                                <span>1900-xxxx</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                <span>Hà Nội, Việt Nam</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Liên kết</h3>
                        <nav className="flex flex-col gap-3">
                            {QUICK_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-slate-600 hover:text-emerald-600 text-sm transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Pháp lý</h3>
                        <nav className="flex flex-col gap-3">
                            {LEGAL_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-slate-600 hover:text-emerald-600 text-sm transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-slate-200 bg-slate-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
                        <p>© 2024 AI Health Coach. All rights reserved.</p>
                        <p className="text-xs">
                            Made with ❤️ for better health
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
