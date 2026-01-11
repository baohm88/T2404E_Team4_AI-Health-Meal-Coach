package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;

public interface HealthProfileService {
    void saveOrUpdate(Long userId, HealthProfileRequest request);
}
