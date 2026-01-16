package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.dto.response.MonthlyPlanResponse;

import java.util.List;

public interface MonthlyPlanService {

    List<MonthlyPlanResponse> getMonthlyPlans(Long userId);
}
