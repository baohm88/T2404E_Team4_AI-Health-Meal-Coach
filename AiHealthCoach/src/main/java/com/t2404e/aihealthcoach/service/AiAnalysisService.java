package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.request.AiMonthlyPlanRequest;
import com.t2404e.aihealthcoach.dto.response.AiMonthlyPlanResponse;

public interface AiAnalysisService {

    AiMonthlyPlanResponse generateMonthlyPlan(
            Long userId,
            AiMonthlyPlanRequest request
    );
}
