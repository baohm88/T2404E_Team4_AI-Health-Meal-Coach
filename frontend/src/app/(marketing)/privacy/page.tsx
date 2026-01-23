/**
 * Privacy Policy Page - AI Health Coach
 * 
 * Displays a professional, comprehensive privacy policy with premium UI styling.
 * Route: /privacy
 */

'use client';

import { PageHeader } from '@/components/marketing/PageHeader';
import {
    ShieldCheck, Lock, Eye, Users,
    Smartphone, Server, FileText, Mail,
    ChevronRight, CheckCircle2, Info
} from 'lucide-react';

const PRIVACY_SECTIONS = [
    {
        id: 'collection',
        icon: Eye,
        title: '1. Thu thập thông tin',
        content: `Chúng tôi thu thập thông tin để cung cấp trải nghiệm AI Health Coach cá nhân hóa tốt nhất cho bạn. Thông tin bao gồm:`,
        items: [
            'Thông tin cá nhân cơ bản (Tên, Email, Số điện thoại)',
            'Chỉ số sinh trắc học (Chiều cao, cân nặng, tỷ lệ mỡ, độ tuổi)',
            'Dữ liệu lối sống (Mức độ vận động, thói quen ăn uống, dị ứng thực phẩm)',
            'Dữ liệu kỹ thuật (Địa chỉ IP, loại thiết bị, hệ điều hành)'
        ]
    },
    {
        id: 'usage',
        icon: Smartphone,
        title: '2. Cách chúng tôi sử dụng dữ liệu',
        content: `Dữ liệu của bạn được thuật toán AI của chúng tôi phân tích để:`,
        items: [
            'Phát triển lộ trình dinh dưỡng và kế hoạch tập luyện cá nhân hóa.',
            'Cải thiện độ chính xác của mô hình nhận diện thực phẩm qua hình ảnh.',
            'Cảnh báo các rủi ro sức khỏe tiềm ẩn dựa trên thói quen ăn uống.',
            'Hỗ trợ khách hàng và giải quyết các vấn đề kỹ thuật nhanh chóng.'
        ]
    },
    {
        id: 'security',
        icon: Lock,
        title: '3. Bảo mật thông tin tuyệt đối',
        content: `Sự an toàn của dữ liệu sức khỏe là ưu tiên hàng đầu của chúng tôi. Chúng tôi áp dụng các tiêu chuẩn bảo mật ngân hàng:`,
        items: [
            'Mã hóa toàn bộ dữ liệu truyền tải qua giao thức SSL/TLS mới nhất.',
            'Lưu trữ dữ liệu trên hệ thống đám mây bảo mật với tường lửa đa lớp.',
            'Hệ thống phát hiện xâm nhập và kiểm tra bảo mật định kỳ hàng tháng.',
            'Nhân viên chỉ có quyền truy cập dữ liệu ở mức tối thiểu cần thiết (Principle of Least Privilege).'
        ]
    },
    {
        id: 'sharing',
        icon: Users,
        title: '4. Chia sẻ với bên thứ ba',
        content: `AI Health cam kết KHÔNG BÁN dữ liệu cá nhân của bạn cho bất kỳ đơn vị quảng cáo nào. Chúng tôi chỉ chia sẻ thông tin khi:`,
        items: [
            'Có sự đồng ý rõ ràng và bằng văn bản từ chính chủ sở hữu dữ liệu.',
            'Cần thiết để tuân thủ các quy định pháp luật và yêu cầu từ cơ quan chức năng.',
            'Hợp tác với các đối tác dịch vụ hạ tầng (AWS, Google Cloud) đã được ký kết thỏa thuận bảo mật nghiêm ngặt.'
        ]
    },
    {
        id: 'rights',
        icon: ShieldCheck,
        title: '5. Quyền lợi của bạn',
        content: `Bạn có quyền kiểm soát hoàn toàn dữ liệu của mình bất cứ lúc nào:`,
        items: [
            'Quyền yêu cầu trích xuất toàn bộ dữ liệu cá nhân đang lưu trữ.',
            'Quyền sửa đổi hoặc cập nhật các thông tin không chính xác.',
            'Quyền "được quên" - yêu cầu xóa vĩnh viễn tài khoản và dữ liệu liên quan.',
            'Quyền từ chối nhận các thông báo tiếp thị không thiết yếu.'
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
                subtitle="Chúng tôi bảo vệ dữ liệu của bạn bằng công nghệ hiện đại nhất và đạo đức nghề nghiệp cao nhất."
                gradient={true}
            />

            <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Intro Note */}
                    <div className="bg-emerald-600 rounded-[2.5rem] p-8 md:p-12 text-white mb-16 shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <ShieldCheck className="w-48 h-48" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Info className="w-5 h-5 text-emerald-200" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">Cập nhật lần cuối: 23/01/2026</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black mb-4">Cam kết của AI Health</h2>
                            <p className="text-emerald-50 leading-relaxed max-w-2xl font-medium">
                                Chúng tôi hiểu rằng dữ liệu sức khỏe là thông tin cực kỳ nhạy cảm.
                                Tại AI Health Coach, chúng tôi không chỉ tuân thủ các quy định pháp luật hiện hành
                                mà còn đặt ra các tiêu chuẩn cao hơn về đạo đức AI để đảm bảo
                                thông tin của bạn luôn an toàn và được sử dụng đúng mục đích.
                            </p>
                        </div>
                    </div>

                    {/* Policy Content Sections */}
                    <div className="space-y-12">
                        {PRIVACY_SECTIONS.map((section, idx) => {
                            const Icon = section.icon;
                            return (
                                <section key={section.id} className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3">
                                            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2.5xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                                                {section.title}
                                            </h3>
                                            <div className="h-1.5 w-12 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="md:w-2/3">
                                            <p className="text-lg text-slate-700 font-medium mb-8 leading-relaxed">
                                                {section.content}
                                            </p>
                                            <div className="grid grid-cols-1 gap-4">
                                                {section.items.map((item, i) => (
                                                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent group-hover:border-slate-100 transition-colors">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
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

                    {/* Contact or Questions */}
                    <div className="mt-20 text-center bg-white border border-slate-100 rounded-[3rem] p-12 md:p-16 shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
                        <h3 className="text-2xl font-black text-slate-900 mb-6">Bạn có câu hỏi về quyền riêng tư?</h3>
                        <p className="text-slate-500 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                            Đội ngũ bảo mật dữ liệu của chúng tôi luôn sẵn sàng lắng nghe
                            và giải đáp mọi nghi vấn của bạn liên quan đến cách thức xử lý thông tin.
                        </p>
                        <a
                            href="mailto:privacy@aihealth.vn"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
                        >
                            <Mail className="w-4 h-4" /> Liên hệ Phòng Bảo Mật
                        </a>
                    </div>

                    {/* Footer Legal Fine Print */}
                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                            AI Health Coach tuân thủ quy định GDPR & các tiêu chuẩn bảo vệ dữ liệu cá nhân tại Việt Nam.<br />
                            Việc sử dụng dịch vụ của bạn đồng nghĩa với việc bạn chấp thuận các điều khoản này.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
