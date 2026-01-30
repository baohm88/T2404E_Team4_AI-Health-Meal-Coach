/**
 * Terms of Service Page - AI Health Coach
 * 
 * Comprehensive legal terms with a premium UI, optimized for clarity and trust.
 * Enhanced with specific clauses for Payment, SLA, and Prohibited Conduct.
 * Route: /terms
 */

'use client';

import { PageHeader } from '@/components/marketing/PageHeader';
import {
    FileText, AlertTriangle, ShieldCheck, Scale,
    UserCheck, Handshake, Mail, CreditCard,
    CheckCircle2, HeartPulse, XCircle, Gauge
} from 'lucide-react';

const TERMS_SECTIONS = [
    {
        id: 'acceptance',
        icon: Handshake,
        title: '1. Chấp thuận điều khoản',
        content: `Chào mừng bạn đến với AI Health Coach. Bằng việc truy cập hoặc sử dụng ứng dụng, bạn đồng ý tuân thủ các Điều khoản này.`,
        items: [
            'Thỏa thuận này là hợp đồng pháp lý giữa bạn và AI Health Coach.',
            'Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.',
            'Chúng tôi có quyền sửa đổi các điều khoản bất cứ lúc nào và sẽ thông báo trước 30 ngày đối với các thay đổi quan trọng.'
        ]
    },
    {
        id: 'medical-disclaimer',
        icon: HeartPulse,
        title: '2. Miễn trừ trách nhiệm Y tế (Medical Disclaimer)',
        isCritical: true,
        content: `QUAN TRỌNG: AI Health Coach là công cụ hỗ trợ lối sống, KHÔNG PHẢI thiết bị y tế hay thay thế bác sĩ.`,
        items: [
            'Các gợi ý dinh dưỡng từ AI chỉ mang tính chất tham khảo chung.',
            'Không sử dụng ứng dụng để chẩn đoán, điều trị hoặc chữa bệnh.',
            'Luôn tham vấn ý kiến bác sĩ trước khi bắt đầu bất kỳ chế độ ăn kiêng hoặc luyện tập mới nào.',
            'Trong trường hợp khẩn cấp về y tế, hãy gọi ngay cho cấp cứu 115.'
        ]
    },
    {
        id: 'user-conduct',
        icon: UserCheck,
        title: '3. Quy định về Hành vi Người dùng',
        content: `Bạn chịu trách nhiệm hoàn toàn về các hoạt động diễn ra dưới tài khoản của mình. Bạn cam kết KHÔNG:`,
        items: [
            'Chia sẻ tài khoản Premium của mình cho nhiều người khác cùng sử dụng.',
            'Sử dụng bot, script hoặc công cụ tự động để thu thập dữ liệu (Scraping) từ hệ thống.',
            'Đảo ngược mã nguồn (Reverse Engineering) hoặc cố gắng truy cập trái phép vào máy chủ.',
            'Tải lên nội dung độc hại, khiêu dâm hoặc vi phạm bản quyền.'
        ]
    },
    {
        id: 'payment',
        icon: CreditCard,
        title: '4. Thanh toán & Hoàn tiền',
        content: `Các quy định liên quan đến gói thành viên Premium và giao dịch tài chính:`,
        items: [
            'Gói đăng ký sẽ tự động gia hạn trừ khi bạn hủy ít nhất 24 giờ trước khi kết thúc chu kỳ.',
            'Chính sách hoàn tiền: Hoàn tiền 100% trong vòng 7 ngày đầu nếu bạn không hài lòng (Money-back Guarantee).',
            'Giá cước có thể thay đổi, nhưng mức giá cũ của bạn sẽ được giữ nguyên trong suốt chu kỳ hiện tại.',
            'Chúng tôi hỗ trợ thanh toán qua Cổng VNPay, thẻ tín dụng và chuyển khoản ngân hàng.'
        ]
    },
    {
        id: 'sla',
        icon: Gauge,
        title: '5. Chất lượng dịch vụ (SLA)',
        content: `Chúng tôi nỗ lực duy trì chất lượng dịch vụ tốt nhất, tuy nhiên không đảm bảo sự hoàn hảo tuyệt đối:`,
        items: [
            'Mục tiêu thời gian hoạt động (Uptime Target) là 99.9% hàng tháng.',
            'Chúng tôi có quyền tạm ngưng dịch vụ để bảo trì kỹ thuật (sẽ thông báo trước trừ trường hợp khẩn cấp).',
            'Không chịu trách nhiệm cho các gián đoạn do sự cố mạng toàn cầu hoặc bất khả kháng.'
        ]
    },
    {
        id: 'intellectual',
        icon: Scale,
        title: '6. Sở hữu trí tuệ',
        content: `Mọi tài nguyên trên nền tảng thuộc quyền sở hữu của AI Health Coach:`,
        items: [
            'Toàn bộ giao diện, logo, mã nguồn và thuật toán AI là tài sản độc quyền.',
            'Bạn được cấp quyền sử dụng hạn chế, không độc quyền và không thể chuyển giao.',
            'Dữ liệu bạn nhập liệu thuộc về bạn, nhưng bạn cấp quyền cho chúng tôi sử dụng nó để huấn luyện AI (ẩn danh).'
        ]
    },
    {
        id: 'termination',
        icon: XCircle,
        title: '7. Chấm dứt dịch vụ',
        content: `Chúng tôi có quyền khóa hoặc xóa tài khoản của bạn nếu phát hiện vi phạm nghiêm trọng:`,
        items: [
            'Vi phạm các điều khoản về hành vi người dùng (mục 3).',
            'Gian lận thanh toán hoặc sử dụng thẻ tín dụng đánh cắp.',
            'Tấn công hệ thống hoặc gây hại cho người dùng khác.'
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
                subtitle="Vui lòng đọc kỹ các quy định dưới đây để đảm bảo quyền lợi khi sử dụng dịch vụ."
                gradient={true}
            />

            <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Important Disclaimer Card */}
                    <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-8 md:p-12 mb-16 relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 p-8 opacity-10 rotate-12">
                            <AlertTriangle className="w-64 h-64 text-amber-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-amber-500 rounded-xl text-white shadow-lg shadow-amber-500/30">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">Cảnh báo quan trọng</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Không phải tư vấn y tế</h2>
                            <p className="text-slate-700 leading-relaxed max-w-3xl text-lg font-medium">
                                AI Health Coach là công cụ hỗ trợ lối sống lành mạnh. Mọi thông tin do AI cung cấp
                                <span className="text-amber-700 font-bold mx-1">KHÔNG THAY THẾ</span>
                                chẩn đoán hoặc phác đồ điều trị của chuyên gia y tế. Người dùng tự chịu trách nhiệm khi áp dụng các gợi ý này.
                            </p>
                        </div>
                    </div>

                    {/* Terms Content Sections */}
                    <div className="space-y-8">
                        {TERMS_SECTIONS.map((section, idx) => {
                            const Icon = section.icon;
                            return (
                                <section key={section.id} className={`bg-white rounded-[2.5rem] p-8 md:p-12 border ${section.isCritical ? 'border-amber-100 ring-4 ring-amber-50/50' : 'border-slate-100'} hover:shadow-xl transition-all duration-300 group`}>
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3 shrink-0">
                                            <div className={`w-14 h-14 ${section.isCritical ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-500'} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                                {section.title}
                                            </h3>
                                        </div>
                                        <div className="md:w-2/3">
                                            <p className="text-slate-700 font-bold mb-6 leading-relaxed">
                                                {section.content}
                                            </p>
                                            <div className="grid grid-cols-1 gap-3">
                                                {section.items.map((item, i) => (
                                                    <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl ${section.isCritical ? 'bg-amber-50/50' : 'bg-slate-50'}`}>
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
                    <div className="mt-20 pt-12 border-t border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] text-center md:text-left">
                                <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-2">
                                    <Scale className="w-5 h-5 text-emerald-600" /> Luật điều chỉnh
                                </h4>
                                <p className="text-sm text-slate-500">
                                    Hợp đồng này được điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp sẽ được giải quyết tại Tòa án có thẩm quyền tại TP. Hồ Chí Minh.
                                </p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] text-center md:text-left flex flex-col justify-center">
                                <h4 className="font-bold text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="w-5 h-5 text-emerald-600" /> Liên hệ pháp chế
                                </h4>
                                <p className="text-sm text-slate-500 mb-2">
                                    Nếu bạn có thắc mắc về điều khoản, vui lòng gửi email về:
                                </p>
                                <a href="mailto:legal@aihealth.vn" className="text-emerald-600 font-bold hover:underline">legal@aihealth.vn</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
