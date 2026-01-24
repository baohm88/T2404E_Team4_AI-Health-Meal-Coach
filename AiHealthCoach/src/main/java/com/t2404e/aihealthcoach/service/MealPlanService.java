package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.entity.MealPlan;

public interface MealPlanService {
    MealPlan generateForUser(Long userId);
    MealPlan getByUserId(Long userId);
    MealPlan regenerate(Long userId);
}
