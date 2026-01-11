package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.request.HealthProfileRequest;
import com.t2404e.aihealthcoach.dto.response.HealthProfileResponse;

public interface HealthProfileService {
    void saveOrUpdate(Long userId, HealthProfileRequest request);
    HealthProfileResponse getByUserId(Long userId);
}
