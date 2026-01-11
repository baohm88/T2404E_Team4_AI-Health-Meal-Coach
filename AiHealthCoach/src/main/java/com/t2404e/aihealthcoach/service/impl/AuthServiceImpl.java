package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.request.LoginRequest;
import com.t2404e.aihealthcoach.dto.request.RegisterRequest;
import com.t2404e.aihealthcoach.dto.response.AuthResponse;
import com.t2404e.aihealthcoach.entity.User;
import com.t2404e.aihealthcoach.enums.UserRole;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.exception.UnauthorizedException;
import com.t2404e.aihealthcoach.repository.UserRepository;
import com.t2404e.aihealthcoach.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register new user
     * - Check email uniqueness
     * - Hash password
     * - Set default role = USER
     */
    @Override
    public void register(RegisterRequest request) {

        // Check email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create new user entity
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER) // default role
                .status(1)           // active
                .build();

        userRepository.save(user);
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
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invalid email or password"));

        // Check user status
        if (user.getStatus() != 1) {
            throw new UnauthorizedException("User is inactive or deleted");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // TODO: Replace with real JWT token in next step
        String fakeToken = "FAKE_JWT_TOKEN_FOR_SPRINT_1";

        return new AuthResponse(fakeToken);
    }
}
