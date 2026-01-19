package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyPlanPhase {

    private int month;           // 1,2,3
    private String title;        // Adaptation, Acceleration, Stabilization
    private Integer dailyCalories;
    private String note;
}
