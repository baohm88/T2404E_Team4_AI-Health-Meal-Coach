/**
 * Terms of Use Page
 * 
 * Displays terms of service with readable typography
 * Route: /terms
 */

import { PageHeader } from '@/components/marketing/PageHeader';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white pt-16 md:pt-20">
            <PageHeader title="Điều khoản sử dụng" />

            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-slate prose-emerald max-w-none">
                        <p className="text-sm text-slate-500 mb-8">
                            Cập nhật lần cuối: 21 tháng 1, 2024
                        </p>

                        <div className="space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    1. Chấp nhận điều khoản
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Bằng cách truy cập và sử dụng AI Health Coach ("Dịch vụ"), bạn đồng ý
                                    bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý
                                    với bất kỳ phần nào của điều khoản, vui lòng không sử dụng dịch vụ của
                                    chúng tôi.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    2. Sử dụng dịch vụ
                                </h2>
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    Bạn đồng ý sử dụng dịch vụ một cách hợp pháp và không:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                    <li>Vi phạm bất kỳ luật hoặc quy định hiện hành nào</li>
                                    <li>Cung cấp thông tin sai lệch hoặc không chính xác</li>
                                    <li>Xâm phạm quyền sở hữu trí tuệ của chúng tôi</li>
                                    <li>Sử dụng dịch vụ cho mục đích thương mại trái phép</li>
                                    <li>Gây hại cho hệ thống hoặc người dùng khác</li>
                                    <li>Tạo tài khoản giả mạo hoặc spam</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    3. Tài khoản người dùng
                                </h2>
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    Khi tạo tài khoản, bạn có trách nhiệm:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                    <li>Cung cấp thông tin chính xác và cập nhật</li>
                                    <li>Bảo mật thông tin đăng nhập của bạn</li>
                                    <li>Chịu trách nhiệm cho mọi hoạt động từ tài khoản của bạn</li>
                                    <li>Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    4. Nội dung và sở hữu trí tuệ
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Tất cả nội dung, tính năng và chức năng của dịch vụ (bao gồm nhưng không
                                    giới hạn văn bản, đồ họa, logo, biểu tượng, hình ảnh, âm thanh, và phần mềm)
                                    là tài sản của AI Health Coach và được bảo vệ bởi luật bản quyền quốc tế.
                                    Bạn không được sao chép, sửa đổi, phân phối hoặc sử dụng nội dung này mà
                                    không có sự cho phép bằng văn bản.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    5. Tuyên bố từ chối trách nhiệm y tế
                                </h2>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-4">
                                    <p className="text-slate-700 leading-relaxed font-medium">
                                        <strong>QUAN TRỌNG:</strong> AI Health Coach cung cấp thông tin dinh dưỡng
                                        và lời khuyên sức khỏe chung chung chỉ nhằm mục đích giáo dục. Dịch vụ
                                        này không thay thế cho tư vấn y tế chuyên nghiệp.
                                    </p>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    Luôn tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng trước khi thay đổi
                                    chế độ ăn uống hoặc tập luyện, đặc biệt nếu bạn có tình trạng sức khỏe đặc biệt.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    6. Giới hạn trách nhiệm
                                </h2>
                                <p className="text-slate-600 leading-relaxed mb-3">
                                    Chúng tôi không chịu trách nhiệm cho:
                                </p>
                                <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                                    <li>Bất kỳ thiệt hại trực tiếp, gián tiếp, hoặc ngẫu nhiên nào phát sinh từ việc sử dụng dịch vụ</li>
                                    <li>Tính chính xác tuyệt đối của các gợi ý dinh dưỡng do AI tạo ra</li>
                                    <li>Kết quả sức khỏe cụ thể của người dùng</li>
                                    <li>Gián đoạn dịch vụ hoặc lỗi kỹ thuật</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    7. Chấm dứt dịch vụ
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Chúng tôi có quyền tạm ngưng hoặc chấm dứt quyền truy cập của bạn vào dịch vụ
                                    bất cứ lúc nào, không cần thông báo trước, nếu bạn vi phạm các điều khoản này
                                    hoặc có hành vi không phù hợp.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    8. Thay đổi điều khoản
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Các thay đổi
                                    quan trọng sẽ được thông báo qua email hoặc thông báo trong ứng dụng. Việc
                                    bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc chấp
                                    nhận điều khoản mới.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    9. Luật áp dụng
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Các điều khoản này được điều chỉnh bởi và giải thích theo luật pháp Việt Nam.
                                    Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền ở Hà Nội.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                    10. Liên hệ
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Nếu bạn có câu hỏi về các điều khoản này, vui lòng liên hệ:
                                </p>
                                <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
                                    <p className="text-slate-700">
                                        <strong>Email:</strong> legal@aihealth.vn<br />
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
