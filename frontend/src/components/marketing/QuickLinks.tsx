/**
 * Quick Links Component
 * 
 * Navigation links placed below hero section
 */

'use client';

import Link from 'next/link';
import { Users, Mail, Shield, FileText } from 'lucide-react';

const QUICK_LINKS = [
    {
        href: '/about',
        label: 'Về chúng tôi',
        description: 'Tìm hiểu về đội ngũ',
        icon: Users,
    },
    {
        href: '/contact',
        label: 'Liên hệ',
        description: 'Liên hệ hỗ trợ',
        icon: Mail,
    },
    {
        href: '/privacy',
        label: 'Bảo mật',
        description: 'Chính sách bảo mật',
        icon: Shield,
    },
    {
        href: '/terms',
        label: 'Điều khoản',
        description: 'Điều khoản sử dụng',
        icon: FileText,
    },
];

export function QuickLinks() {
    return (
        <section className="py-12 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {QUICK_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group flex flex-col items-center text-center p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-600 transition-colors">
                                    <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1">
                                    {link.label}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {link.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
