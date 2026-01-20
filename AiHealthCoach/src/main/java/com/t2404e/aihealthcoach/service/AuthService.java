package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.request.LoginRequest;
import com.t2404e.aihealthcoach.dto.request.RegisterRequest;
import com.t2404e.aihealthcoach.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    Long register(RegisterRequest request);
}
