package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.request.WeeklyAdjustmentRequest;
import com.t2404e.aihealthcoach.dto.response.WeeklyAdjustmentResponse;
import com.t2404e.aihealthcoach.dto.response.WeeklyPlanResponse;

import java.util.List;

public interface WeeklyPlanService {

    List<WeeklyPlanResponse> generateWeeklyPlans(Long monthlyPlanId, Long userId);

    List<WeeklyPlanResponse> getWeeklyPlans(Long monthlyPlanId, Long userId);

    WeeklyAdjustmentResponse adjustWeeklyPlan(
            Long weeklyPlanId,
            Long userId,
            WeeklyAdjustmentRequest request
    );
}
