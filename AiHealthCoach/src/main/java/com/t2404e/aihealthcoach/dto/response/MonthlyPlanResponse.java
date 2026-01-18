package com.t2404e.aihealthcoach.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyPlanResponse {

    private Integer monthIndex;
    private Double targetWeightChange;
    private Integer dailyCalories;
    private String note;
}
