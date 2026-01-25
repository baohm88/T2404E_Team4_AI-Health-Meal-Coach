package com.t2404e.aihealthcoach.dto.response.mealplan;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealDTO {
    private Long id;
    private String mealName;
    private String quantity;
    private Integer calories;
    private String type;
}
