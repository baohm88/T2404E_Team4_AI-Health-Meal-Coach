package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Chào mừng đến với AI Health Coach! 🏥");
            helper.setText(buildWelcomeEmailContent(fullName), true);

            mailSender.send(message);
            log.info("✓ Welcome email sent successfully to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("✗ Failed to send welcome email to: {}", toEmail, e);
            // Don't throw exception - registration should succeed even if email fails
        }
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Xác minh email của bạn (🔒 Mã OTP)");
            helper.setText(buildOtpEmailContent(otp), true);

            mailSender.send(message);
            log.info("✓ OTP email sent successfully to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("✗ Failed to send OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage(), e);
        }
    }

    private String buildWelcomeEmailContent(String fullName) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">AI Health Coach</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #4CAF50;">Xin chào %s! 👋</h2>
                        <p>Cảm ơn bạn đã tham gia cộng đồng <strong>AI Health Coach</strong>.</p>
                        <p>Chúng tôi rất vui khi được đồng hành cùng bạn trên hành trình chăm sóc sức khỏe và xây dựng lối sống lành mạnh.</p>
                        <p>Hãy truy cập ứng dụng để bắt đầu khám phá các tính năng tuyệt vời dành riêng cho bạn nhé!</p>
                        <br>
                        <a href="https://ai-healthcoach.site" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Truy cập ngay</a>
                        <br><br>
                        <p style="font-size: 12px; color: #888;">Trân trọng,<br>Đội ngũ AI Health Coach</p>
                    </div>
                </div>
                """
                .formatted(fullName);
    }

    private String buildOtpEmailContent(String otp) {
        return """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <div style="background-color: #2196F3; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">Xác thực tài khoản</h1>
                    </div>
                    <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                        <p>Xin chào,</p>
                        <p>Bạn vừa yêu cầu xác thực email hoặc đăng nhập. Đây là mã OTP của bạn:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2196F3; background-color: #E3F2FD; padding: 10px 20px; border-radius: 5px;">%s</span>
                        </div>
                        <p>Mã này sẽ hết hạn trong vòng <strong>5 phút</strong>.</p>
                        <p style="color: #d32f2f;">Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
                        <br>
                        <p style="font-size: 12px; color: #888;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                    </div>
                </div>
                """
                .formatted(otp);
    }
}