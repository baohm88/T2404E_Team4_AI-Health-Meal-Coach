package com.t2404e.aihealthcoach.service.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.t2404e.aihealthcoach.entity.VerifyOtp;
import com.t2404e.aihealthcoach.repository.VerifyOtpRepository;
import com.t2404e.aihealthcoach.service.OtpService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of OtpService using MySQL database storage.
 * OTPs are stored in the verify_otp table and expire after 5 minutes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OtpServiceImpl implements OtpService {

    private final VerifyOtpRepository verifyOtpRepository;

    // OTP validity period in minutes
    private static final int OTP_VALIDITY_MINUTES = 5;

    // OTP length
    private static final int OTP_LENGTH = 6;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generate a new 6-digit OTP and store it in the database.
     */
    @Override
    @Transactional
    public String generateOtp(String email) {
        // Generate a random 6-digit OTP
        String otp = String.format("%0" + OTP_LENGTH + "d", secureRandom.nextInt(1000000));

        // Create and save OTP record
        VerifyOtp verifyOtp = VerifyOtp.builder()
                .email(email)
                .otp(otp)
                .createdDate(LocalDateTime.now())
                .build();

        verifyOtpRepository.save(verifyOtp);
        log.info("Generated OTP for email: {}", email);

        return otp;
    }

    /**
     * Verify if the provided OTP is valid and not expired.
     */
    @Override
    @Transactional(readOnly = true)
    public boolean verifyOtp(String email, String otp) {
        Optional<VerifyOtp> latestOtp = verifyOtpRepository.findTopByEmailOrderByCreatedDateDesc(email);

        if (latestOtp.isEmpty()) {
            log.warn("No OTP found for email: {}", email);
            return false;
        }

        VerifyOtp verifyOtp = latestOtp.get();

        // Check if OTP matches
        if (!verifyOtp.getOtp().equals(otp)) {
            log.warn("Invalid OTP provided for email: {}", email);
            return false;
        }

        // Check if OTP is expired (older than 5 minutes)
        LocalDateTime expiryTime = verifyOtp.getCreatedDate().plusMinutes(OTP_VALIDITY_MINUTES);
        if (LocalDateTime.now().isAfter(expiryTime)) {
            log.warn("OTP expired for email: {}", email);
            return false;
        }

        log.info("OTP verified successfully for email: {}", email);
        return true;
    }

    /**
     * Invalidate OTP by marking it as used (setting usageDate).
     */
    @Override
    @Transactional
    public void invalidateOtp(String email) {
        Optional<VerifyOtp> latestOtp = verifyOtpRepository.findTopByEmailOrderByCreatedDateDesc(email);

        if (latestOtp.isPresent()) {
            VerifyOtp verifyOtp = latestOtp.get();
            // Mark as used by setting usageDate to current timestamp (epoch seconds)
            verifyOtp.setUsageDate((int) (System.currentTimeMillis() / 1000));
            verifyOtpRepository.save(verifyOtp);
            log.info("OTP invalidated for email: {}", email);
        }
    }
}
