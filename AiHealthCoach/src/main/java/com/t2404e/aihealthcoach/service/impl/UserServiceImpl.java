package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.entity.User;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.UserRepository;
import com.t2404e.aihealthcoach.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean isPremium(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
        return Boolean.TRUE.equals(user.getIsPremium());
    }
}
