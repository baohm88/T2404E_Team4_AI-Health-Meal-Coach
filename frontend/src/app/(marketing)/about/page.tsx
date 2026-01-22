/**
 * About Page - Team Introduction
 * 
 * Displays team members with avatars, roles, and bios
 * Route: /about
 */

'use client';

import { PageHeader } from '@/components/marketing/PageHeader';
import { Users, Code, Palette, Brain } from 'lucide-react';

const TEAM_MEMBERS = [
    {
        name: 'Hà Mạnh Bảo',
        role: 'Team Lead/BE',
        bio: 'Lãnh đạo dự án AI Health Coach, điều phối toàn bộ quá trình phát triển và đảm bảo chất lượng sản phẩm.',
        avatar: 'https://ui-avatars.com/api/?name=Ha+Manh+Bao&background=059669&color=fff&size=200',
        icon: Users,
    },
    {
        name: 'Tống Quang Minh',
        role: 'Full-stack Developer',
        bio: 'Phát triển backend và frontend, xây dựng API và giao diện người dùng cho ứng dụng.',
        avatar: 'https://ui-avatars.com/api/?name=Tong+Quang+Minh&background=10b981&color=fff&size=200',
        icon: Code,
    },
    {
        name: 'Trần Văn Đức',
        role: 'Frontend Developer',
        bio: 'Chuyên về phát triển giao diện người dùng và tối ưu trải nghiệm sử dụng.',
        avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Duc&background=22c55e&color=fff&size=200',
        icon: Code,
    },
    {
        name: 'Lưu Thanh',
        role: 'AI Engineer',
        bio: 'Phát triển các mô hình AI và thuật toán phân tích dữ liệu dinh dưỡng.',
        avatar: 'https://ui-avatars.com/api/?name=Luu+Thanh&background=16a34a&color=fff&size=200',
        icon: Brain,
    },
    {
        name: 'Gia Phát',
        role: 'Tester',
        bio: 'Xây dựng và tối ưu hệ thống backend, quản lý cơ sở dữ liệu và API.',
        avatar: 'https://ui-avatars.com/api/?name=Gia+Phat&background=0d9488&color=fff&size=200',
        icon: Code,
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white pt-16 md:pt-20">
            <PageHeader
                title="Đội ngũ phát triển"
                subtitle="Những con người đằng sau AI Health Coach"
                gradient
            />

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mission Statement */}
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Chúng tôi là một nhóm những người đam mê công nghệ và sức khỏe,
                            với sứ mệnh giúp mọi người đạt được mục tiêu dinh dưỡng thông qua
                            sức mạnh của trí tuệ nhân tạo. Chúng tôi tin rằng mỗi người đều
                            xứng đáng có một huấn luyện viên sức khỏe cá nhân.
                        </p>
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {TEAM_MEMBERS.map((member, index) => {
                            const Icon = member.icon;
                            return (
                                <div
                                    key={index}
                                    className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                                >
                                    {/* Avatar */}
                                    <div className="relative mb-4">
                                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-emerald-100 group-hover:border-emerald-200 transition-colors">
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Role Icon Badge */}
                                        <div className="absolute bottom-0 right-[calc(50%-48px)] w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-sm font-semibold text-emerald-600 mb-3">
                                            {member.role}
                                        </p>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {member.bio}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Join Us CTA */}
                    <div className="mt-16 text-center">
                        <div className="inline-block bg-emerald-50 rounded-2xl p-8 max-w-2xl">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                Muốn gia nhập đội ngũ?
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Chúng tôi luôn tìm kiếm những tài năng mới để cùng phát triển
                                và mang lại giá trị cho cộng đồng.
                            </p>
                            <a
                                href="mailto:careers@aihealth.vn"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                careers@aihealth.vn
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
