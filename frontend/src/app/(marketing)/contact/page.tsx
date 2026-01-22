/**
 * Contact Page
 * 
 * Two-column layout with contact information and contact form
 * Route: /contact
 */

'use client';

import { PageHeader } from '@/components/marketing/PageHeader';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

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
        value: 'Hà Nội, Việt Nam',
        href: null,
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual form submission
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white pt-16 md:pt-20">
            <PageHeader
                title="Liên hệ với chúng tôi"
                subtitle="Có câu hỏi? Chúng tôi luôn sẵn sàng hỗ trợ bạn"
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column - Contact Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Thông tin liên hệ
                            </h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.
                                Hãy liên hệ qua bất kỳ kênh nào dưới đây.
                            </p>

                            <div className="space-y-6">
                                {CONTACT_INFO.map((item, index) => {
                                    const Icon = item.icon;
                                    const content = (
                                        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-colors">
                                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-500 mb-1">
                                                    {item.label}
                                                </p>
                                                <p className="text-lg font-medium text-slate-900">
                                                    {item.value}
                                                </p>
                                            </div>
                                        </div>
                                    );

                                    return item.href ? (
                                        <a key={index} href={item.href}>
                                            {content}
                                        </a>
                                    ) : (
                                        <div key={index}>{content}</div>
                                    );
                                })}
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-8 bg-slate-100 rounded-2xl h-64 flex items-center justify-center">
                                <div className="text-center text-slate-400">
                                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                                    <p className="text-sm">Bản đồ (Tích hợp sau)</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div>
                            <div className="bg-white border border-slate-200 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                    Gửi tin nhắn
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Input */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-semibold text-slate-700 mb-2"
                                        >
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>

                                    {/* Email Input */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold text-slate-700 mb-2"
                                        >
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    {/* Message Textarea */}
                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-semibold text-slate-700 mb-2"
                                        >
                                            Nội dung *
                                        </label>
                                        <textarea
                                            id="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                                            placeholder="Nhập nội dung tin nhắn của bạn..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 from-emerald-600 to-emerald-600"
                                    >
                                        <Send className="w-5 h-5" />
                                        Gửi tin nhắn
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
