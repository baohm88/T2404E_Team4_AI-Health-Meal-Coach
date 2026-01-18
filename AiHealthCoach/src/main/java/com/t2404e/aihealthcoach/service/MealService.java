package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.MealResponse;

import java.util.List;

public interface MealService {

    List<MealResponse> generateMeals(Long dailyPlanId, Long userId);

    List<MealResponse> getMeals(Long dailyPlanId, Long userId);
}
