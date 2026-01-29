package com.t2404e.aihealthcoach.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.service.EmailService;
import com.t2404e.aihealthcoach.service.OtpService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * Test controller for OTP functionality
 * WARNING: Remove this in production!
 */
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
@Tag(name = "Testing", description = "Test endpoints for OTP (DEV ONLY - Remove in production)")
public class OtpTestController {

    private final OtpService otpService;
    private final EmailService emailService;

    @GetMapping("/send-otp")
    @Operation(summary = "[DEV] Test gửi OTP", description = "Development endpoint để test gửi email OTP.")
    public ResponseEntity<ApiResponse<String>> testSendOtp(@RequestParam String email) {

        // Generate OTP
        String otp = otpService.generateOtp(email);

        // Send email
        emailService.sendOtpEmail(email, otp);

        return ResponseEntity.ok(
                ApiResponse.success("OTP sent successfully to " + email, "OTP: " + otp));
    }
}
