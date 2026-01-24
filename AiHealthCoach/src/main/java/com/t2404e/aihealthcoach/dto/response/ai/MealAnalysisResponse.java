package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealAnalysisResponse {
    private String foodName;
    private Integer estimatedCalories;
    private String nutritionDetails; // Phân tích chi tiết: protein, carb, fat...
    private String imageUrl;
}
