package com.t2404e.aihealthcoach.dto.request;

import com.t2404e.aihealthcoach.enums.MealTimeSlot;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiMealSuggestionRequest {

    @NotNull
    private Integer dailyCalories;

    @NotNull
    private MealTimeSlot mealTime;
}
