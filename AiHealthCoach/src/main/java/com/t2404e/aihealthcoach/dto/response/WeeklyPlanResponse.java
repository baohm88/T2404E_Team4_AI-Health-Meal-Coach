package com.t2404e.aihealthcoach.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyPlanResponse {

    private Integer weekIndex;
    private Double targetWeightChange;
    private Integer dailyCalories;
    private String note;
}
