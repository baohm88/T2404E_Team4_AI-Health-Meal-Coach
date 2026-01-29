package com.t2404e.aihealthcoach.service;

/**
 * Service interface for OTP (One-Time Password) operations.
 * Handles generation, verification, and invalidation of OTPs.
 */
public interface OtpService {

    /**
     * Generate a new OTP for the given email.
     * 
     * @param email the user's email address
     * @return the generated OTP code
     */
    String generateOtp(String email);

    /**
     * Verify if the provided OTP is valid for the given email.
     * 
     * @param email the user's email address
     * @param otp   the OTP code to verify
     * @return true if the OTP is valid, false otherwise
     */
    boolean verifyOtp(String email, String otp);

    /**
     * Invalidate the OTP for the given email after successful verification.
     * 
     * @param email the user's email address
     */
    void invalidateOtp(String email);
}
