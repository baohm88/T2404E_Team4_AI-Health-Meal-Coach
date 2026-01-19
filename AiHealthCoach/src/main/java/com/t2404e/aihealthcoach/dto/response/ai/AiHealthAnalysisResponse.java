package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiHealthAnalysisResponse {

    private BodyAnalysis analysis;
    private LifestyleInsights lifestyleInsights;
    private ThreeMonthPlan threeMonthPlan;
}
