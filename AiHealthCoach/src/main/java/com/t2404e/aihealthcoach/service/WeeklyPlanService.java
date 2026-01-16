package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.WeeklyPlanResponse;

import java.util.List;

public interface WeeklyPlanService {

    List<WeeklyPlanResponse> generateWeeklyPlans(Long monthlyPlanId);

    List<WeeklyPlanResponse> getWeeklyPlans(Long monthlyPlanId);
}
