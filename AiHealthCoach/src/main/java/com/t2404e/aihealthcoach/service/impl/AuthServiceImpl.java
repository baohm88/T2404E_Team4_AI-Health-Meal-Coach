package com.t2404e.aihealthcoach.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.t2404e.aihealthcoach.config.JwtUtil;
import com.t2404e.aihealthcoach.dto.request.LoginRequest;
import com.t2404e.aihealthcoach.dto.request.RegisterRequest;
import com.t2404e.aihealthcoach.dto.request.ResendOtpRequest;
import com.t2404e.aihealthcoach.dto.request.VerifyOtpRequest;
import com.t2404e.aihealthcoach.dto.response.AuthResponse;
import com.t2404e.aihealthcoach.entity.User;
import com.t2404e.aihealthcoach.enums.UserRole;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.exception.UnauthorizedException;
import com.t2404e.aihealthcoach.repository.UserRepository;
import com.t2404e.aihealthcoach.service.AuthService;
import com.t2404e.aihealthcoach.service.EmailService;
import com.t2404e.aihealthcoach.service.OtpService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final OtpService otpService;

    public AuthServiceImpl(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            EmailService emailService,
            OtpService otpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.otpService = otpService;
    }

    /**
     * Register new user
     * - Check email uniqueness
     * - Hash password
     * - Set default isPremium = false
     * - Set default role = USER
     */
    @Override
    public Long register(RegisterRequest request) {

        // Check email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create new user entity
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .isPremium(false)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER) // default role
                .status(1) // active
                .build();

        User savedUser = userRepository.save(user);

        // Generate and send OTP
        try {
            String otp = otpService.generateOtp(savedUser.getEmail());
            emailService.sendOtpEmail(savedUser.getEmail(), otp);
            log.info("✓ User registered successfully: {}, OTP email sent", savedUser.getEmail());
        } catch (Exception e) {
            log.warn("✗ User registered but failed to send OTP email to: {}", savedUser.getEmail(), e);
        }

        return savedUser.getId(); // Get userId from DB
    }

    /**
     * Login user
     * - Validate email & password
     * - Return AuthResponse (JWT will be added later)
     */
    @Override
    public AuthResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        // Check user status
        if (user.getStatus() != 1) {
            throw new UnauthorizedException("User is inactive or deleted");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // Generate token and send to FE
        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName());

        return new AuthResponse(token, com.t2404e.aihealthcoach.dto.response.UserResponse.fromEntity(user));
    }

    /**
     * Verify OTP and activate user account
     */
    @Override
    public void verifyOtp(VerifyOtpRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Verify OTP
        boolean isValid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }

        // Invalidate OTP after successful verification
        otpService.invalidateOtp(request.getEmail());

        log.info("✓ Email verified successfully for user: {}", request.getEmail());
    }

    /**
     * Resend OTP to user email
     */
    @Override
    public void resendOtp(ResendOtpRequest request) {
        // Verify user exists
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate and send new OTP
        String otp = otpService.generateOtp(request.getEmail());
        emailService.sendOtpEmail(request.getEmail(), otp);

        log.info("✓ OTP resent successfully to: {}", request.getEmail());
    }
}
