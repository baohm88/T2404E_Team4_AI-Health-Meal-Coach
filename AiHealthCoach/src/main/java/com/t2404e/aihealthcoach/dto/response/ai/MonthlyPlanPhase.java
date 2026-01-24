package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyPlanPhase {

    private int month; // 1,2,3
    private String title; // Adaptation, Acceleration, Stabilization
    private Integer dailyCalories;
    private String macronutrients; // P: %, C: %, F: %
    private String habitFocus;
    private String mealTips; // Gợi ý chi tiết cho các bữa ăn
    private String specificActions; // Các hành động cụ thể hàng ngày
    private List<MealPlanDetail> sampleDailyMeals;
    private List<WeeklyPlanPhase> weeks;
    private String note;
}
