package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.request.LoginRequest;
import com.t2404e.aihealthcoach.dto.request.RegisterRequest;
import com.t2404e.aihealthcoach.dto.response.AuthResponse;

public interface AuthService {

    /**
     * Authenticate user and return JWT token
     */
    AuthResponse login(LoginRequest request);

    /**
     * Register new user with default role USER
     */
    void register(RegisterRequest request);
}
