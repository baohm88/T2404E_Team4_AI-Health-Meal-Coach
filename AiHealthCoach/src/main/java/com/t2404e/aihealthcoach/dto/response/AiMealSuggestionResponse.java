package com.t2404e.aihealthcoach.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiMealSuggestionResponse {

    private String mealName;
    private Integer estimatedCalories;
    private String note;
}
