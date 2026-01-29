package com.t2404e.aihealthcoach.service;

/**
 * Service for sending emails
 */
public interface EmailService {

    /**
     * Send welcome email to newly registered user
     * 
     * @param toEmail  recipient email address
     * @param fullName user's full name
     */
    void sendWelcomeEmail(String toEmail, String fullName);

    /**
     * Send OTP verification email to user
     * 
     * @param toEmail recipient email address
     * @param otp     6-digit OTP code
     */
    void sendOtpEmail(String toEmail, String otp);
}
