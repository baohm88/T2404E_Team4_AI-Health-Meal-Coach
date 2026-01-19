package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AiHealthAnalysisResponse {

    private BodyAnalysis analysis;
    private LifestyleInsights lifestyleInsights;
    private ThreeMonthPlan threeMonthPlan;
}
