package com.t2404e.aihealthcoach.dto.response.mealplan;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayPlanDTO {
    private Integer day;
    private List<MealDTO> meals;
    private Integer totalCalories;
    private Integer totalPlannedCalories;
}
