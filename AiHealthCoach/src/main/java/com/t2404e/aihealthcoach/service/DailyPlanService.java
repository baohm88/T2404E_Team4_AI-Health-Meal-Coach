package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.DailyPlanResponse;

import java.util.List;

public interface DailyPlanService {

    List<DailyPlanResponse> generateDailyPlans(Long weeklyPlanId);

    List<DailyPlanResponse> getDailyPlans(Long weeklyPlanId);
}
