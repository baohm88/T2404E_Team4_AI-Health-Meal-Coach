/**
 * Marketing Footer Component
 * 
 * Professional footer with multi-column layout, newsletter signup, and legal info.
 */

'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

const FOOTER_LINKS = {
    product: [
        { label: 'Tính năng AI', href: '/#features' },
        { label: 'Gói Premium', href: '/pricing' },
        { label: 'Câu chuyện thành công', href: '/#testimonials' },
        { label: 'Tải ứng dụng mobile', href: '#' },
    ],
    company: [
        { label: 'Về chúng tôi', href: '/about' },
        { label: 'Đội ngũ', href: '/about#team' },
        { label: 'Liên hệ', href: '/contact' },
        { label: 'Tuyển dụng', href: '/careers' },
    ],
    resources: [
        { label: 'Blog sức khỏe', href: '/blog' },
        { label: 'Trung tâm trợ giúp', href: '/help' },
        { label: 'Cộng đồng', href: '#' },
        { label: 'Trạng thái hệ thống', href: '/status' },
    ],
    legal: [
        { label: 'Chính sách bảo mật', href: '/privacy' },
        { label: 'Điều khoản sử dụng', href: '/terms' },
        { label: 'Chính sách cookie', href: '/cookies' },
        { label: 'Tuân thủ GDPR', href: '/gdpr' },
    ]
};

const SOCIAL_LINKS = [
    { icon: Facebook, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Twitter, href: '#' },
];

export function MarketingFooter() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
                                AI
                            </div>
                            <span className="font-bold text-xl text-slate-900">Health Coach</span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Nền tảng huấn luyện sức khỏe cá nhân hóa hàng đầu, sử dụng trí tuệ nhân tạo để giúp bạn sống khỏe và hạnh phúc hơn mỗi ngày.
                        </p>
                        <div className="flex items-center gap-4">
                            {SOCIAL_LINKS.map((social, idx) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={idx}
                                        href={social.href}
                                        className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 text-sm">Sản phẩm</h4>
                            <ul className="space-y-3">
                                {FOOTER_LINKS.product.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 text-sm">Công ty</h4>
                            <ul className="space-y-3">
                                {FOOTER_LINKS.company.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 text-sm">Tài nguyên</h4>
                            <ul className="space-y-3">
                                {FOOTER_LINKS.resources.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4 text-sm">Pháp lý</h4>
                            <ul className="space-y-3">
                                {FOOTER_LINKS.legal.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <h4 className="font-bold text-slate-900 text-sm">Đăng ký nhận bản tin</h4>
                        <p className="text-xs text-slate-500">Nhận các mẹo sức khỏe và cập nhật tính năng mới nhất hàng tuần.</p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                            >
                                Đăng ký ngay <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Trust Badges */}
                        <div className="pt-4 border-t border-slate-200/60">
                            <div className="flex items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    ISO 27001
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                                    <Globe className="w-3 h-3 text-blue-600" />
                                    GDPR
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} AI Health Coach Platform. All rights reserved.
                    </p>

                    {/* Contact Info Inline */}
                    <div className="flex items-center gap-6 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" /> support@aihealth.vn
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" /> Hà Nội, VN
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
