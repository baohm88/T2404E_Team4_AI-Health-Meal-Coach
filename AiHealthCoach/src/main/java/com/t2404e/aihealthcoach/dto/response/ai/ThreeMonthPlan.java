package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ThreeMonthPlan {

    private String goal; // WEIGHT_LOSS / MAINTENANCE / MUSCLE_GAIN
    private Double totalTargetWeightChangeKg;
    private List<MonthlyPlanPhase> months;
}
