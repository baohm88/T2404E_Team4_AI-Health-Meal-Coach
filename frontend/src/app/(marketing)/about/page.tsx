/**
 * About Page - AI Health Coach
 * 
 * Comprehensive introduction to our mission, vision, values, technology, and team.
 * Route: /about
 */

'use client';

import { PageHeader } from '@/components/marketing/PageHeader';
import {
    Users, Code, Brain, Target, Shield, Zap,
    ChevronRight, Heart, Sparkles, Database,
    ArrowRight, Github, Linkedin, Mail
} from 'lucide-react';

import haManhBaoImg from '@/assets/HaManhBao.jpg';
import giaPhatImg from '@/assets/GiaPhat.jpg';
import tongMinhImg from '@/assets/tongMinhImg.jpg';
import luuThanhImg from '@/assets/luuThanhImg.jpg';

const TEAM_MEMBERS = [
    {
        name: 'Hà Mạnh Bảo',
        role: 'Team Lead / Full-stack Developer',
        bio: 'Lãnh đạo dự án AI Health Coach, điều phối quá trình phát triển và định hướng kiến trúc hệ thống.',
        avatar: haManhBaoImg.src,
        icon: Users,
    },
    {
        name: 'Tống Quang Minh',
        role: 'Full-stack Developer',
        bio: 'Xây dựng nhịp cầu giữa dữ liệu và giao diện, đảm bảo sự mượt mà trong từng tương tác người dùng.',
        avatar: tongMinhImg.src,
        icon: Code,
    },
    {
        name: 'Trần Văn Đức',
        role: 'Frontend Developer',
        bio: 'Phát triển toàn diện hệ thống từ mô hình AI, kiến trúc Backend đến trải nghiệm Frontend mượt mà.',
        avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Duc&background=random&size=400',
        icon: Zap,
    },
    {
        name: 'Lưu Thanh',
        role: 'Backend Developer / AI Engineer',
        bio: 'Huấn luyện các mô hình học máy để phân tích dinh dưỡng và đưa ra gợi ý cá nhân hóa chính xác.',
        avatar: luuThanhImg.src,
        icon: Brain,
    },
    {
        name: 'Gia Phát',
        role: 'Tester',
        bio: 'Đảm bảo tính ổn định và bảo mật tối đa cho toàn bộ hệ sinh thái dịch vụ AI Health.',
        avatar: giaPhatImg.src,
        icon: Code,
    },
];

const CORE_VALUES = [
    {
        title: 'Cá Nhân Hóa Tối Đa',
        description: 'Mọi kế hoạch dinh dưỡng đều được AI may đo theo đúng thể trạng và sở thích của riêng bạn.',
        icon: Sparkles,
        color: 'bg-amber-50 text-amber-600',
    },
    {
        title: 'Dựa Trên Khoa Học',
        description: 'Thuật toán được xây dựng dựa trên cơ sở dữ liệu y tế và dinh dưỡng chuẩn quốc tế.',
        icon: Database,
        color: 'bg-blue-50 text-blue-600',
    },
    {
        title: 'Bảo Mật Tuyệt Đối',
        description: 'Dữ liệu sức khỏe của người dùng là tài sản quý giá nhất và luôn được mã hóa an toàn.',
        icon: Shield,
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        title: 'Cải Tiến Liên Tục',
        description: 'Hệ thống AI tự học hỏi từ phản hồi người dùng để ngày càng trở nên thông minh hơn.',
        icon: Zap,
        color: 'bg-purple-50 text-purple-600',
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Background Decorative Orbs */}
            <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] opacity-60 -z-10" />
            <div className="absolute top-[40%] left-[-5%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-[80px] opacity-40 -z-10" />

            <div className="relative pt-16 md:pt-24">
                <PageHeader
                    title="Về AI Health Coach"
                    subtitle="Đổi mới sức khỏe thông qua trí tuệ nhân tạo và dữ liệu dinh dưỡng."
                    gradient={true}
                />

                <main>
                    {/* Mission & Vision Section */}
                    <section className="py-20 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest">
                                        <Heart className="w-4 h-4" /> Sứ mệnh của chúng tôi
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                                        Giúp cuộc sống <br /> trở nên <span className="text-emerald-600">khỏe mạnh hơn</span>
                                    </h2>
                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        Chúng tôi tin rằng việc duy trì một lối sống lành mạnh không nên là một gánh nặng. Với AI Health Coach, chúng tôi đang xây dựng một tương lai nơi mọi người đều có thể tiếp cận với các lời khuyên dinh dưỡng chuyên sâu, cá nhân hóa và dễ thực hiện ngay trong tầm tay.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                            <h4 className="font-bold text-slate-900 mb-2">Tầm nhìn 2030</h4>
                                            <p className="text-sm text-slate-500">Trở thành nền tảng chăm sóc sức khỏe AI hàng đầu Đông Nam Á, phục vụ hàng triệu người dùng mỗi ngày.</p>
                                        </div>
                                        <div className="p-6 bg-emerald-600 rounded-[2rem] text-white">
                                            <h4 className="font-bold mb-2">Cam kết chất lượng</h4>
                                            <p className="text-sm opacity-90">100% đề xuất dựa trên dữ liệu khoa học và đã qua kiểm định bởi các chuyên gia dinh dưỡng.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-100/30 rounded-[3rem] blur-2xl transform rotate-3 scale-105" />
                                    <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-slate-100 border-8 border-white shadow-2xl">
                                        <img
                                            src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80&w=800"
                                            className="w-full h-full object-cover"
                                            alt="Healthcare Technology"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                                            <div className="flex items-center gap-4 text-white">
                                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <Brain className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">Công nghệ cốt lõi</p>
                                                    <p className="text-lg font-bold">Trí tuệ nhân tạo đa tầng</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Core Values Section */}
                    <section className="py-24 bg-slate-50 relative overflow-hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Giá trị cốt lõi</h2>
                                <p className="text-slate-500">Những nguyên tắc dẫn dắt chúng tôi trong mọi quyết định phát triển sản phẩm.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {CORE_VALUES.map((value, idx) => {
                                    const Icon = value.icon;
                                    return (
                                        <div key={idx} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500">
                                            <div className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                            <p className="text-sm text-slate-500 leading-relaxed">{value.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* How AI Works - Brief Technical Insight (Synchronized Light Theme) */}
                    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
                        {/* Decorative background for this section */}
                        <div className="absolute inset-0 bg-emerald-50/20 px-4 py-24 -z-10" />

                        <div className="max-w-6xl mx-auto bg-white rounded-[3.5rem] p-8 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110" />

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-600 text-[10px] font-black uppercase tracking-wider mb-6">
                                        <Database className="w-3 h-3" /> Technical Authority
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                                        Trí tuệ nhân tạo của <br /> chúng tôi <span className="text-emerald-600 italic">hoạt động thế nào?</span>
                                    </h2>
                                    <ul className="space-y-6">
                                        {[
                                            'Phân tích thành phần dinh dưỡng từ ảnh chụp bữa ăn chỉ trong vài giây.',
                                            'Tính toán calo và dinh dưỡng vi lượng dựa trên thói quen sinh hoạt.',
                                            'Nhân diện các rủi ro sức khỏe tiềm ẩn thông qua các chỉ số đo lường.',
                                            'Học hỏi khẩu vị của bạn để đưa ra thực đơn "vừa ngon vừa khỏe".'
                                        ].map((text, i) => (
                                            <li key={i} className="flex gap-5 items-start">
                                                <div className="shrink-0 w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm border border-emerald-100 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                                    {i + 1}
                                                </div>
                                                <p className="text-slate-600 text-base leading-relaxed font-medium">{text}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="relative">
                                    <div className="absolute -inset-4 bg-emerald-100/20 blur-3xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="relative p-10 bg-white border border-slate-200/60 rounded-[3rem] shadow-xl shadow-slate-200/40">
                                        <div className="flex flex-col gap-8">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Scanning model</span>
                                                    <p className="text-xs text-slate-400 mt-0.5 font-bold">A.I Vision Engine v4.5.2</p>
                                                </div>
                                                <div className="w-10 h-2 bg-emerald-100 rounded-full overflow-hidden">
                                                    <div className="h-full w-2/3 bg-emerald-600 animate-[shimmer_2s_infinite]" />
                                                </div>
                                            </div>

                                            <div className="space-y-5">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-lg font-black text-slate-900">98.4%</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Độ chính xác nhận diện</p>
                                                    </div>
                                                    <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
                                                </div>
                                                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                    <div className="h-full w-[98.4%] bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] group/stat hover:bg-emerald-50 hover:border-emerald-100 transition-all duration-300">
                                                    <p className="text-2xl font-black text-slate-900 group-hover/stat:text-emerald-700">50M+</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Data Points</p>
                                                </div>
                                                <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] group/stat hover:bg-emerald-50 hover:border-emerald-100 transition-all duration-300">
                                                    <p className="text-2xl font-black text-slate-900 group-hover/stat:text-emerald-700">&lt;0.5s</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Latency</p>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200">
                                                    Chi tiết kỹ thuật
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Team Section */}
                    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Đội ngũ sáng tạo</h2>
                                <p className="text-slate-500 max-w-2xl mx-auto">Tập hợp những kỹ sư và chuyên gia đầy nhiệt huyết, cam kết thay đổi cách thế giới tiếp cận sức khỏe.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                                {TEAM_MEMBERS.map((member, index) => {
                                    return (
                                        <div key={index} className="group relative">
                                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100 border border-slate-200">
                                                <img
                                                    src={member.avatar}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    alt={member.name}
                                                />
                                                <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/20 transition-colors duration-500" />

                                                {/* Social links on hover */}
                                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 group-hover:bottom-8 transition-all duration-500">
                                                    <a href="#" className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors shadow-lg">
                                                        <Linkedin className="w-4 h-4" />
                                                    </a>
                                                    <a href="#" className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors shadow-lg">
                                                        <Github className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mt-1 mb-3">{member.role}</p>
                                                <p className="text-xs text-slate-500 leading-relaxed italic">{member.bio}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Join Us CTA */}
                    <section className="py-24">
                        <div className="max-w-4xl mx-auto px-4">
                            <div className="relative p-12 md:p-16 rounded-[3.5rem] bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 overflow-hidden text-center">
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl" />
                                <div className="relative z-10">
                                    <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-6" />
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">
                                        Muốn cộng tác cùng <span className="text-emerald-600 italic">AI Health?</span>
                                    </h2>
                                    <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
                                        Chúng tôi luôn chào đón các chuyên gia dinh dưỡng và những lập trình viên tài năng để cùng nhau xây dựng cộng đồng khỏe mạnh.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <a href="mailto:careers@aihealth.vn" className="px-8 py-4 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all hover:shadow-xl hover:shadow-emerald-500/20 flex items-center gap-3">
                                            careers@aihealth.vn <ArrowRight className="w-4 h-4" />
                                        </a>
                                        <button className="px-8 py-4 rounded-full bg-white text-slate-800 font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                                            Tìm hiểu thêm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
