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
    public Page<UserResponse> getUsers(String keyword, Pageable pageable) {
        Page<User> usersPage;
        if (keyword != null && !keyword.trim().isEmpty()) {
            usersPage = userRepository.findByFullNameContainingOrEmailContaining(keyword, keyword, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

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
