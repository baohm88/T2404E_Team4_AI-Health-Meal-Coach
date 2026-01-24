package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.MealPlanResponse;

public interface MealPlanService {
    MealPlanResponse generateForUser(Long userId);

    MealPlanResponse getByUserId(Long userId);

    MealPlanResponse regenerate(Long userId);
}
