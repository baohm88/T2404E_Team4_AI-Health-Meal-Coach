package com.t2404e.aihealthcoach.dto.response;

import java.time.LocalDateTime;

import com.t2404e.aihealthcoach.enums.UserRole;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private UserRole role;
    private Integer status;
    private Boolean isPremium;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(com.t2404e.aihealthcoach.entity.User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .isPremium(user.getIsPremium())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
