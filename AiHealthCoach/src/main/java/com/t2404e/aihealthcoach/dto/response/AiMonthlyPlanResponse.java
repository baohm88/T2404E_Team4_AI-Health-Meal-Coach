package com.t2404e.aihealthcoach.dto.response;

import com.t2404e.aihealthcoach.enums.HealthStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiMonthlyPlanResponse {

    private HealthAnalysisDto healthAnalysis;
    private List<MonthlyPlanDto> monthlyPlans;

    @Getter @Setter @Builder
    public static class HealthAnalysisDto {
        private Double bmi;
        private Double bmr;
        private Double tdee;
        private Integer energyScore;
        private HealthStatus healthStatus;
        private String bodyState;
    }

    @Getter @Setter @Builder
    public static class MonthlyPlanDto {
        private Integer monthIndex;
        private Double targetWeightChange;
        private Integer dailyCalories;
        private String note;
    }
}
