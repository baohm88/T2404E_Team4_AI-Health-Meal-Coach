package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThreeMonthPlan {

    private String goal; // WEIGHT_LOSS / MAINTENANCE / MUSCLE_GAIN
    private Double totalTargetWeightChangeKg;
    private List<MonthlyPlanPhase> months;
}
