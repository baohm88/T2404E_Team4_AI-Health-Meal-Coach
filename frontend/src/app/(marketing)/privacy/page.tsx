/**
 * Privacy Policy Page
 * 
 * Displays privacy policy with readable typography
 * Route: /privacy
 */

import { PageHeader } from '@/components/marketing/PageHeader';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white pt-16 md:pt-20">
            <PageHeader title="Chính sách bảo mật" />

            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-slate prose-emerald max-w-none">
                        <p className="text-sm text-slate-500 mb-8">
                            Cập nhật lần cuối: 21 tháng 1, 2024
                        </p>

                        <div className="space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    1. Thu thập thông tin
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Chúng tôi thu thập thông tin bạn cung cấp trực tiếp khi đăng ký tài khoản,
                                    bao gồm tên, email, thông tin cơ thể (chiều cao, cân nặng), và các chỉ số
                                    sức khỏe khác. Dữ liệu này được sử dụng để cá nhân hóa trải nghiệm của bạn
                                    và tạo ra các kế hoạch dinh dưỡng phù hợp.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    2. Sử dụng thông tin
                                </h2>
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    Thông tin của bạn được sử dụng để:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                    <li>Cung cấp và cải thiện dịch vụ của chúng tôi</li>
                                    <li>Cá nhân hóa lộ trình dinh dưỡng và lời khuyên sức khỏe</li>
                                    <li>Gửi thông báo và cập nhật quan trọng</li>
                                    <li>Phân tích và cải thiện hiệu suất ứng dụng</li>
                                    <li>Tuân thủ các yêu cầu pháp lý</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    3. Bảo mật dữ liệu sức khỏe
                                </h2>
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    Chúng tôi cam kết bảo vệ thông tin sức khỏe của bạn với các biện pháp
                                    bảo mật nghiêm ngặt:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                    <li>Mã hóa dữ liệu SSL/TLS khi truyền tải</li>
                                    <li>Mã hóa dữ liệu lưu trữ trong cơ sở dữ liệu</li>
                                    <li>Kiểm tra bảo mật định kỳ</li>
                                    <li>Hạn chế quyền truy cập chỉ cho nhân viên được ủy quyền</li>
                                    <li>Tuân thủ các tiêu chuẩn bảo mật quốc tế</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    4. Chia sẻ thông tin
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn cho bên
                                    thứ ba. Thông tin của bạn chỉ được chia sẻ trong các trường hợp sau:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4 mt-3">
                                    <li>Khi có sự đồng ý rõ ràng từ bạn</li>
                                    <li>Với các nhà cung cấp dịch vụ hỗ trợ (đã ký thỏa thuận bảo mật)</li>
                                    <li>Khi pháp luật yêu cầu</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    5. Quyền của người dùng
                                </h2>
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    Bạn có các quyền sau đối với dữ liệu cá nhân:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                    <li>Quyền truy cập và xem dữ liệu của mình</li>
                                    <li>Quyền chỉnh sửa thông tin không chính xác</li>
                                    <li>Quyền xóa tài khoản và dữ liệu</li>
                                    <li>Quyền xuất dữ liệu sang định dạng khác</li>
                                    <li>Quyền từ chối tiếp thị</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    6. Cookie và công nghệ theo dõi
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng, phân tích
                                    lưu lượng truy cập và cá nhân hóa nội dung. Bạn có thể quản lý cookie
                                    thông qua cài đặt trình duyệt của mình.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    7. Liên hệ
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ:
                                </p>
                                <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
                                    <p className="text-slate-700">
                                        <strong>Email:</strong> privacy@aihealth.vn<br />
                                        <strong>Địa chỉ:</strong> Hà Nội, Việt Nam
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
