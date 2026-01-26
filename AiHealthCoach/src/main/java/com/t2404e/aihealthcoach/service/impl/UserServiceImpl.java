package com.t2404e.aihealthcoach.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.t2404e.aihealthcoach.dto.response.UserResponse;
import com.t2404e.aihealthcoach.entity.User;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.UserRepository;
import com.t2404e.aihealthcoach.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public Page<UserResponse> getUsers(String keyword, Integer status, Boolean isPremium, String startDateStr, String endDateStr, Pageable pageable) {
        java.time.LocalDateTime startDate = null;
        java.time.LocalDateTime endDate = null;

        try {
            if (startDateStr != null && !startDateStr.isEmpty()) {
                // Parse start of day
                startDate = java.time.LocalDate.parse(startDateStr).atStartOfDay();
            }
            if (endDateStr != null && !endDateStr.isEmpty()) {
                // Parse end of day
                endDate = java.time.LocalDate.parse(endDateStr).atTime(java.time.LocalTime.MAX);
            }
        } catch (Exception e) {
            // Ignore parse error, treat as null or logged
            System.err.println("Date parse error: " + e.getMessage());
        }

        Page<User> usersPage = userRepository.searchUsers(keyword, status, isPremium, startDate, endDate, pageable);

        // Map Entity -> DTO
        return usersPage.map(this::convertToDTO);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = findUserEntityById(id);
        return convertToDTO(user);
    }

    @Override
    public User findUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public void toggleUserStatus(Long id) {
        User user = findUserEntityById(id);
        
        // Toggle: If 1 (ACTIVE) -> 0 (INACTIVE), otherwise -> 1
        if (user.getStatus() != null && user.getStatus() == 1) {
            user.setStatus(0);
        } else {
            user.setStatus(1);
        }
        userRepository.save(user);
    }

    @Override
    public void togglePremiumStatus(Long id) {
        User user = findUserEntityById(id);
        user.setIsPremium(!Boolean.TRUE.equals(user.getIsPremium()));
        userRepository.save(user);
    }



    private UserResponse convertToDTO(User user) {
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
