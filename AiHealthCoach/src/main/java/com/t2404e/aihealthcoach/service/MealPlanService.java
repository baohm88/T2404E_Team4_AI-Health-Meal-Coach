package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.entity.MealPlan;

public interface MealPlanService {
    void generateForUser(Long userId);
    MealPlan getByUserId(Long userId);
    void regenerate(Long userId);
}
