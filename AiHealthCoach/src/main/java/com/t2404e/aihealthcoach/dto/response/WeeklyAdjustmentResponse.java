package com.t2404e.aihealthcoach.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyAdjustmentResponse {

    private Integer oldTargetCalories;
    private Integer newTargetCalories;
    private String adjustmentNote;
}
