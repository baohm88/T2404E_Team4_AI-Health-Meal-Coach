/**
 * Privacy Policy Page - AI Health Coach
 * 
 * Displays a professional, comprehensive privacy policy with premium UI styling.
 * Enhanced with specific legal references (Decree 13/2023/ND-CP) and detailed sections.
 * Route: /privacy
 */

'use client';

import { PageHeader } from '@/components/marketing/PageHeader';
import {
    ShieldCheck, Lock, Eye, Users,
    Smartphone, Scale, FileText, Mail,
    CheckCircle2, Info, Key, Globe, Cookie
} from 'lucide-react';

const PRIVACY_SECTIONS = [
    {
        id: 'legal-basis',
        icon: Scale,
        title: '1. Cơ sở pháp lý & Tuân thủ',
        content: `Chính sách bảo mật này được xây dựng dựa trên các quy định pháp luật hiện hành của Việt Nam, đặc biệt là:`,
        highlight: true,
        items: [
            'Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân.',
            'Luật An ninh mạng số 24/2018/QH14.',
            'Luật Giao dịch điện tử số 51/2005/QH11 và các văn bản hướng dẫn thi hành.'
        ]
    },
    {
        id: 'collection',
        icon: Eye,
        title: '2. Thu thập thông tin',
        content: `Chúng tôi chỉ thu thập những dữ liệu cần thiết tối thiểu để cung cấp dịch vụ (Nguyên tắc hạn chế dữ liệu):`,
        items: [
            'Dữ liệu định danh: Họ tên, Email, Số điện thoại (chỉ khi đăng ký).',
            'Dữ liệu sức khỏe (Special Category Data): Chiều cao, cân nặng, chỉ số BMI, thói quen ăn uống.',
            'Dữ liệu hành vi: Lịch sử tương tác với AI, nhật ký bữa ăn.',
            'Dữ liệu thiết bị: IP, Cookie ID, User-Agent để đảm bảo an ninh hệ thống.'
        ]
    },
    {
        id: 'controller',
        icon: Key,
        title: '3. Bên Kiểm soát & Xử lý dữ liệu',
        content: `Mọi dữ liệu của bạn được quản lý trực tiếp bởi AI Health Coach Team. Chúng tôi cam kết:`,
        items: [
            'Không chuyển giao dữ liệu ra khỏi lãnh thổ Việt Nam trừ khi có sự đồng ý của bạn.',
            'Chỉ nhân viên được ủy quyền mới có quyền truy cập vào dữ liệu nhạy cảm.',
            'Mọi đối tác xử lý dữ liệu (nếu có) đều phải ký thỏa thuận bảo mật (NDA) nghiêm ngặt.'
        ]
    },
    {
        id: 'security',
        icon: Lock,
        title: '4. Biện pháp bảo mật kỹ thuật',
        content: `Chúng tôi áp dụng mô hình bảo mật đa lớp (Defense in Depth) để bảo vệ dữ liệu của bạn:`,
        items: [
            'Mã hóa đầu cuối (End-to-End Encryption) cho mọi luồng dữ liệu truyền tải.',
            'Lưu trữ dữ liệu nhạy cảm dưới dạng mã hóa (Encryption at Rest) trên máy chủ đám mây.',
            'Xác thực đa yếu tố (MFA) cho quyền truy cập quản trị hệ thống.',
            'Giám sát an ninh 24/7 để phát hiện và ngăn chặn các cuộc tấn công mạng.'
        ]
    },
    {
        id: 'sharing',
        icon: Users,
        title: '5. Chia sẻ dữ liệu với bên thứ ba',
        content: `Chúng tôi KHÔNG bán dữ liệu của bạn. Việc chia sẻ thông tin chỉ diễn ra trong các trường hợp giới hạn:`,
        items: [
            'Các nhà cung cấp dịch vụ hạ tầng đám mây (Cloud Providers) uy tín.',
            'Đối tác cổng thanh toán (Payment Gateways) để xử lý giao dịch - chúng tôi không lưu số thẻ của bạn.',
            'Khi có yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền theo quy định của pháp luật.'
        ]
    },
    {
        id: 'retention',
        icon: FileText,
        title: '6. Thời gian lưu trữ dữ liệu',
        content: `Dữ liệu của bạn được lưu trữ trong suốt thời gian bạn sử dụng dịch vụ và thêm một khoảng thời gian cần thiết:`,
        items: [
            'Dữ liệu tài khoản: Lưu trữ cho đến khi bạn yêu cầu xóa tài khoản.',
            'Dữ liệu giao dịch: Lưu trữ 10 năm theo quy định của Luật Kế toán.',
            'Dữ liệu nhật ký hệ thống (Logs): Lưu trữ tối đa 12 tháng phục vụ mục đích an ninh.'
        ]
    },
    {
        id: 'cookies',
        icon: Cookie,
        title: '7. Chính sách Cookie & Tracking',
        content: `Chúng tôi sử dụng Cookie để cải thiện trải nghiệm người dùng và phân tích hiệu suất:`,
        items: [
            'Cookie thiết yếu: Bắt buộc để ứng dụng hoạt động (đăng nhập, giỏ hàng).',
            'Cookie phân tích: Giúp chúng tôi hiểu cách bạn sử dụng ứng dụng để cải tiến.',
            'Bạn có quyền từ chối các Cookie không thiết yếu thông qua cài đặt trình duyệt.'
        ]
    },
    {
        id: 'rights',
        icon: ShieldCheck,
        title: '8. Quyền của chủ thể dữ liệu',
        content: `Theo Nghị định 13/2023/NĐ-CP, bạn có các quyền sau đối với dữ liệu cá nhân của mình:`,
        items: [
            'Quyền được biết & Quyền đồng ý: Bạn được thông báo rõ ràng về cách xử lý dữ liệu.',
            'Quyền truy cập & Chỉnh sửa: Xem và cập nhật thông tin cá nhân bất cứ lúc nào.',
            'Quyền xóa dữ liệu (Right to be Forgotten): Yêu cầu xóa toàn bộ dữ liệu khỏi hệ thống.',
            'Quyền rút lại sự đồng ý: Ngừng cho phép chúng tôi xử lý dữ liệu của bạn.'
        ]
    }
];

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#fafbfc] relative overflow-hidden flex flex-col pt-16 md:pt-24 uppercase-none">
            {/* Background Decorative Decor */}
            <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[10%] right-[-15%] w-[800px] h-[800px] bg-emerald-50/40 rounded-full blur-[150px] -z-10" />

            <PageHeader
                title="Chính sách bảo mật"
                subtitle="Cam kết minh bạch và tuân thủ tuyệt đối các quy định pháp luật về bảo vệ dữ liệu cá nhân."
                gradient={true}
            />

            <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Intro Note */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white mb-16 shadow-2xl shadow-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
                            <ShieldCheck className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <Globe className="w-5 h-5 text-emerald-400" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Tuân thủ Nghị định 13/2023/NĐ-CP</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black mb-4">Dữ liệu của bạn. Quyền của bạn.</h2>
                                <p className="text-slate-300 leading-relaxed font-medium">
                                    Tại AI Health Coach, chúng tôi coi trọng quyền riêng tư như sức khỏe của chính bạn.
                                    Chính sách này giải thích minh bạch cách chúng tôi bảo vệ thông tin cá nhân của bạn theo tiêu chuẩn cao nhất.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                    <p className="text-xs text-slate-300 mb-1 uppercase tracking-wider">Hiệu lực từ</p>
                                    <p className="text-xl font-bold font-mono text-emerald-400">01/02/2026</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Policy Content Sections */}
                    <div className="space-y-8">
                        {PRIVACY_SECTIONS.map((section, idx) => {
                            const Icon = section.icon;
                            return (
                                <section key={section.id} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100/60 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-emerald-100 transition-all duration-300 group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3 shrink-0">
                                            <div className={`w-14 h-14 ${section.highlight ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-500'} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                                {section.title}
                                            </h3>
                                        </div>
                                        <div className="md:w-2/3">
                                            <p className="text-slate-700 font-medium mb-6 leading-relaxed border-l-2 border-emerald-500/30 pl-4 py-1">
                                                {section.content}
                                            </p>
                                            <div className="grid grid-cols-1 gap-3">
                                                {section.items.map((item, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                        <span className="leading-relaxed">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                    </div>

                    {/* Contact or Questions */}
                    <div className="mt-20">
                        <div className="text-center bg-emerald-50 border border-emerald-100 rounded-[3rem] p-12 relative overflow-hidden">
                            <h3 className="text-2xl font-black text-slate-900 mb-4">Bộ phận Bảo vệ Dữ liệu (DPO)</h3>
                            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                                Nếu bạn muốn thực hiện các quyền của mình hoặc có bất kỳ câu hỏi nào về bảo mật,
                                vui lòng liên hệ với Cán bộ Bảo vệ Dữ liệu của chúng tôi.
                            </p>
                            <a
                                href="mailto:privacy@aihealth.vn"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <Mail className="w-4 h-4" /> Liên hệ DPO
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
