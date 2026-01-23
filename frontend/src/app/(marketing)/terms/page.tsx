/**
 * Terms of Service Page - AI Health Coach
 * 
 * Comprehensive legal terms with a premium UI, optimized for clarity and trust.
 * Route: /terms
 */

'use client';

import { PageHeader } from '@/components/marketing/PageHeader';
import {
    FileText, AlertTriangle, ShieldCheck, Scale,
    UserCheck, Handshake, Mail, Info,
    ChevronRight, CheckCircle2, HeartPulse
} from 'lucide-react';

const TERMS_SECTIONS = [
    {
        id: 'acceptance',
        icon: Handshake,
        title: '1. Chấp thuận điều khoản',
        content: `Bằng việc truy cập và sử dụng AI Health Coach, bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản này.`,
        items: [
            'Điều khoản có hiệu lực ngay khi bạn bắt đầu sử dụng dịch vụ.',
            'Nếu bạn không đồng ý, vui lòng ngừng sử dụng sản phẩm ngay lập tức.',
            'Chúng tôi có quyền sửa đổi điều khoản và sẽ thông báo trước 15 ngày.',
            'Người dùng dưới 18 tuổi cần có sự giám sát của người bảo hộ.'
        ]
    },
    {
        id: 'disclaimer',
        icon: HeartPulse,
        title: '2. Miễn trừ y tế (Medical Disclaimer)',
        isCritical: true,
        content: `Đây là phần quan trọng nhất: AI Health Coach KHÔNG phải là một tổ chức y tế và không cung cấp dịch vụ khám chữa bệnh.`,
        items: [
            'Các gợi ý từ AI chỉ mang tính chất tham khảo và hỗ trợ dinh dưỡng chung.',
            'Không sử dụng các gợi ý của chúng tôi thay thế cho lời khuyên của bác sĩ.',
            'Luôn tham vấn chuyên gia y tế trước khi bắt đầu chế độ ăn kiêng nghiêm ngặt.',
            'Chúng tôi không chịu trách nhiệm cho các phản ứng cơ thể do áp dụng lộ trình AI.'
        ]
    },
    {
        id: 'account',
        icon: UserCheck,
        title: '3. Trách nhiệm người dùng',
        content: `Để AI hoạt động chính xác nhất, bạn có trách nhiệm với các thông tin cung cấp:`,
        items: [
            'Cung cấp chỉ số cơ thể trung thực và cập nhật (Cân nặng, chiều cao, bệnh lý).',
            'Bảo mật tuyệt đối thông tin đăng nhập và không chia sẻ tài khoản cho người khác.',
            'Chịu trách nhiệm cho mọi hoạt động phát sinh dưới danh nghĩa tài khoản của mình.',
            'Báo cáo ngay nếu phát hiện hành vi xâm nhập trái phép từ bên ngoài.'
        ]
    },
    {
        id: 'intellectual',
        icon: Scale,
        title: '4. Sở hữu trí tuệ',
        content: `Toàn bộ nền tảng bao gồm mã nguồn, thuật toán AI và thiết kế là tài sản của chúng tôi:`,
        items: [
            'Bạn không được phép sao chép, chỉnh sửa hoặc dịch ngược thuật toán AI.',
            'Logo và tên thương hiệu AI Health Coach được bảo hộ sở hữu trí tuệ.',
            'Dữ liệu bạn tải lên (ảnh món ăn) thuộc quyền sở hữu của bạn nhưng AI được phép phân tích.',
            'Nghiêm cấm việc sử dụng dịch vụ cho mục đích thương mại trái phép.'
        ]
    },
    {
        id: 'liability',
        icon: AlertTriangle,
        title: '5. Giới hạn trách nhiệm',
        content: `AI Health cam kết nỗ lực tối đa để duy trì dịch vụ, tuy nhiên có các giới hạn sau:`,
        items: [
            'Chúng tôi không cam kết kết quả giảm cân/tăng cơ cụ thể trong thời gian cố định.',
            'Không chịu trách nhiệm cho sự gián đoạn dịch vụ do hạ tầng mạng toàn cầu.',
            'Mức bồi thường tối đa (nếu có) sẽ không vượt quá phí dịch vụ bạn đã thanh toán.',
            'Quyết định cuối cùng trong việc xử lý vi phạm thuộc về ban quản trị.'
        ]
    }
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#fafbfc] relative overflow-hidden flex flex-col pt-16 md:pt-24">
            {/* Background Decorative Decor */}
            <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[100px] -z-10" />

            <PageHeader
                title="Điều khoản sử dụng"
                subtitle="Quy định rõ ràng về quyền lợi và trách nhiệm để xây dựng một cộng đồng khỏe mạnh, chuyên nghiệp."
                gradient={true}
            />

            <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Important Disclaimer Card */}
                    <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-8 md:p-12 mb-16 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <HeartPulse className="w-64 h-64 text-amber-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-600 rounded-lg shadow-lg shadow-amber-200">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Thông tin quan trọng cần lưu ý</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">Cam kết về Tính xác thực Y tế</h2>
                            <p className="text-slate-600 leading-relaxed max-w-2xl text-lg font-medium">
                                AI Health Coach là một công cụ hỗ trợ thông tin, <strong>không phải thực thể y tế.</strong>
                                Bằng việc sử dụng ứng dụng, bạn công nhận rằng các lời khuyên dinh dưỡng
                                từ trí tuệ nhân tạo không mang tính chất chẩn đoán hay điều trị bệnh lý.
                            </p>
                        </div>
                    </div>

                    {/* Terms Content Sections */}
                    <div className="space-y-12">
                        {TERMS_SECTIONS.map((section, idx) => {
                            const Icon = section.icon;
                            return (
                                <section key={section.id} className={`bg-white rounded-[3rem] p-8 md:p-12 border ${section.isCritical ? 'border-amber-100 shadow-xl shadow-amber-500/5' : 'border-slate-100 shadow-sm'} hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 group relative`}>
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <div className="md:w-1/3">
                                            <div className={`w-16 h-16 ${section.isCritical ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-emerald-600'} rounded-2.5xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-sm border border-black/5`}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                                                {section.title}
                                            </h3>
                                            <p className="text-sm font-black uppercase tracking-widest text-slate-300"></p>
                                        </div>
                                        <div className="md:w-2/3">
                                            <p className="text-lg text-slate-700 font-bold mb-8 leading-relaxed">
                                                {section.content}
                                            </p>
                                            <div className="grid grid-cols-1 gap-4">
                                                {section.items.map((item, i) => (
                                                    <div key={i} className="flex items-start gap-4 p-5 bg-[#fbfcfd] rounded-2.5xl border border-transparent group-hover:border-slate-100/60 transition-colors">
                                                        <CheckCircle2 className={`w-5 h-5 ${section.isCritical ? 'text-amber-500' : 'text-emerald-500'} shrink-0 mt-0.5`} />
                                                        <span className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                    </div>

                    {/* Legal Footer Section */}
                    <div className="mt-20 flex flex-col items-center">
                        <div className="w-20 h-1 bg-slate-200 rounded-full mb-12" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                            <div className="p-10 bg-white border border-slate-100 rounded-[3rem] text-center group hover:border-emerald-200 transition-all">
                                <Scale className="w-10 h-10 text-emerald-600 mx-auto mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                <h4 className="font-black text-slate-800 mb-2">Luật áp dụng</h4>
                                <p className="text-sm text-slate-500 font-medium">Toàn bộ hợp đồng và tranh chấp được điều chỉnh bởi hệ thống pháp luật hiện hành tại Việt Nam.</p>
                            </div>
                            <div className="p-10 bg-white border border-slate-100 rounded-[3rem] text-center group hover:border-emerald-200 transition-all">
                                <Mail className="w-10 h-10 text-emerald-600 mx-auto mb-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                                <h4 className="font-black text-slate-800 mb-2">Thắc mắc pháp lý</h4>
                                <p className="text-sm text-slate-500 font-medium pb-2">Giải đáp mọi nghi vấn qua địa chỉ:</p>
                                <a href="mailto:legal@aihealth.vn" className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:underline">legal@aihealth.vn</a>
                            </div>
                        </div>

                        <p className="mt-16 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] text-center max-w-2xl leading-loose">
                            Cập nhật gần nhất: 23 tháng 01, 2026<br />
                            @2026 AI Health Coach Platform. Bảo lưu mọi quyền.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
