package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.request.AiMealSuggestionRequest;
import com.t2404e.aihealthcoach.dto.response.AiMealSuggestionResponse;
import com.t2404e.aihealthcoach.enums.MealTimeSlot;
import com.t2404e.aihealthcoach.service.AiMealService;
import org.springframework.stereotype.Service;

@Service
public class AiMealServiceImpl implements AiMealService {

    @Override
    public AiMealSuggestionResponse suggestMeal(AiMealSuggestionRequest request) {

        MealTimeSlot slot = request.getMealTime();
        int dailyCalories = request.getDailyCalories();

        return switch (slot) {
            case BREAKFAST -> AiMealSuggestionResponse.builder()
                    .mealName("Oatmeal with banana and boiled egg")
                    .estimatedCalories((int) (dailyCalories * 0.3))
                    .note("Good carbs and protein to start the day")
                    .build();

            case LUNCH -> AiMealSuggestionResponse.builder()
                    .mealName("Grilled chicken salad")
                    .estimatedCalories((int) (dailyCalories * 0.4))
                    .note("High protein, low fat, suitable for weight loss")
                    .build();

            case DINNER -> AiMealSuggestionResponse.builder()
                    .mealName("Steamed fish with vegetables")
                    .estimatedCalories((int) (dailyCalories * 0.25))
                    .note("Light dinner, easy to digest")
                    .build();

            default -> AiMealSuggestionResponse.builder()
                    .mealName("Greek yogurt with nuts")
                    .estimatedCalories((int) (dailyCalories * 0.05))
                    .note("Healthy snack if needed")
                    .build();
        };
    }
}
