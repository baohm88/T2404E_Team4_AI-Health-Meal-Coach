package com.t2404e.aihealthcoach.dto.response;

import com.t2404e.aihealthcoach.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementDto {
    private Long id;
    private String fullName;
    private String email;
    private UserRole role;
    private Integer status; // 1: Active, 0: Inactive
    private Boolean isPremium;
    private LocalDateTime createdAt;
}