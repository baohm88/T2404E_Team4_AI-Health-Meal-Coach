package com.t2404e.aihealthcoach.dto.response.mealplan;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealDTO {
    private Long id;
    private Long plannedMealId;
    private String mealName;
    private String quantity;
    private Integer calories;
    private Integer plannedCalories;
    private String type;
    private Boolean checkedIn;
}
