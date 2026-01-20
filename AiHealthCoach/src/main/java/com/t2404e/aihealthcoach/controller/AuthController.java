package com.t2404e.aihealthcoach.controller;

import com.t2404e.aihealthcoach.common.ApiResponse;
import com.t2404e.aihealthcoach.dto.request.LoginRequest;
import com.t2404e.aihealthcoach.dto.request.RegisterRequest;
import com.t2404e.aihealthcoach.dto.response.AuthResponse;
import com.t2404e.aihealthcoach.dto.response.RegisterResponse;
import com.t2404e.aihealthcoach.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {

        Long userId = authService.register(request);

        // Save userId temporarily in SESSION
        httpRequest.getSession(true).setAttribute("TEMP_USER_ID", userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", new RegisterResponse(userId)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success("Login successful", response)
        );
    }
}
