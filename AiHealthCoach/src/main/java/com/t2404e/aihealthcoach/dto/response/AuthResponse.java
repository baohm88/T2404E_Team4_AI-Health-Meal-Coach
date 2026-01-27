package com.t2404e.aihealthcoach.dto.response;

import lombok.Getter;

@Getter
public class AuthResponse {
    private String token;
    private com.t2404e.aihealthcoach.dto.response.UserResponse user;

    public AuthResponse(String token, com.t2404e.aihealthcoach.dto.response.UserResponse user) {
        this.token = token;
        this.user = user;
    }
}