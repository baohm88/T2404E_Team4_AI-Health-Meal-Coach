/**
 * Contact Page - Optimized for Single Screen View
 * 
 * Fits all content within the viewport height to avoid scrolling.
 * Route: /contact
 */

'use client';

import { PageHeader } from '@/components/marketing/PageHeader';
import { Mail, Phone, MapPin } from 'lucide-react';

const CONTACT_INFO = [
    {
        icon: Mail,
        label: 'Email',
        value: 'support@aihealth.vn',
        href: 'mailto:support@aihealth.vn',
    },
    {
        icon: Phone,
        label: 'Hotline',
        value: '1900-xxxx',
        href: 'tel:1900xxxx',
    },
    {
        icon: MapPin,
        label: 'Địa chỉ',
        value: 'Tập đoàn Baliogo XRF7+827, Đại Kim, Hoàng Mai, Hà Nội',
        href: null,
    },
];

export default function ContactPage() {
    return (
        <div className="h-screen bg-[#fafbfc] relative overflow-hidden flex flex-col pt-16">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[100px] opacity-40 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-[80px] opacity-30 -z-10" />

            {/* Compact Header Area */}
            <div className="flex-shrink-0 py-6 px-4 sm:px-6 lg:px-8 text-center bg-white/40 backdrop-blur-md border-b border-slate-100/50">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    Liên hệ với <span className="text-emerald-600 italic">chúng tôi</span>
                </h1>
                <p className="text-sm md:text-base text-slate-500 font-medium max-w-xl mx-auto mt-1">
                    Hỗ trợ nhanh chóng & tận tâm cho hành trình sức khỏe của bạn.
                </p>
            </div>

            {/* Main Content Area - Fill remaining space */}
            <div className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-6 md:gap-8">

                    {/* Left Column - Contact Info (Compact Cards) */}
                    <div className="lg:w-[35%] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                            {CONTACT_INFO.map((item, index) => {
                                const Icon = item.icon;
                                const content = (
                                    <div className="group bg-white p-4 lg:p-5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                                <Icon className="w-5 lg:w-6 h-5 lg:h-6" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                                <p className="text-sm lg:text-base font-bold text-slate-800 break-all leading-tight">{item.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                );

                                return item.href ? (
                                    <a key={index} href={item.href} className="block transform transition-transform active:scale-[0.98]">
                                        {content}
                                    </a>
                                ) : (
                                    <div key={index}>{content}</div>
                                );
                            })}
                        </div>

                        {/* Live Google Map */}
                        <div className="flex-1 hidden lg:flex flex-col relative group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.483707045367!2d105.8098117124341!3d20.97323898959954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad8a27da867b%3A0xaf4ce83118c0b152!2zVOG6rXAgxJFvw6BuIEJhbGlvZ28!5e0!3m2!1svi!2s!4v1769183544081!5m2!1svi!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>

                    {/* Right Column - Google Form (Expands to fill) */}
                    <div className="lg:w-[65%] h-full flex flex-col relative">
                        {/* Glassmorphism Wrapper for Form */}
                        <div className="flex-1 bg-white border border-slate-200/60 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden flex flex-col">
                            {/* Form Header */}
                            <div className="flex-shrink-0 bg-slate-50/80 backdrop-blur-sm border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                    </div>
                                    <h2 className="text-base lg:text-lg font-black text-slate-900 tracking-tight">Gửi tin nhắn trực tiếp</h2>
                                </div>
                                <div className="hidden sm:block px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em]">
                                    Live Form
                                </div>
                            </div>

                            {/* Iframe Area - Scrollable internal but page fits screen */}
                            <div className="flex-1 w-full bg-slate-50/30 relative">
                                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none" />
                                <iframe
                                    src="https://docs.google.com/forms/d/e/1FAIpQLSdQmsUMESWSeQJ9LWOkVNhMsBzc4Y_OZTaJG_Pacd54JXXoHQ/viewform?embedded=true"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    marginHeight={0}
                                    marginWidth={0}
                                    className="absolute inset-0 block bg-white"
                                >
                                    Đang tải biểu mẫu…
                                </iframe>
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent z-10 pointer-events-none" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer Badges (Very bottom - Separate row) */}
            <div className="flex-shrink-0 pb-6 flex justify-center gap-8 lg:gap-12 opacity-40">
                {['🔒 SSL Secured', '🛡️ Privacy First', '⚡ Fast Support'].map(text => (
                    <div key={text} className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{text}</span>
                    </div>
                ))}
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
