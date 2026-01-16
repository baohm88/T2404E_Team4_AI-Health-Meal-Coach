package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.response.MonthlyPlanResponse;
import com.t2404e.aihealthcoach.entity.MonthlyPlan;
import com.t2404e.aihealthcoach.repository.MonthlyPlanRepository;
import com.t2404e.aihealthcoach.service.MonthlyPlanService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MonthlyPlanServiceImpl implements MonthlyPlanService {

    private final MonthlyPlanRepository monthlyPlanRepository;

    public MonthlyPlanServiceImpl(MonthlyPlanRepository monthlyPlanRepository) {
        this.monthlyPlanRepository = monthlyPlanRepository;
    }

    @Override
    public List<MonthlyPlanResponse> getMonthlyPlans(Long userId) {

        List<MonthlyPlan> plans =
                monthlyPlanRepository.findByUserIdOrderByMonthIndexAsc(userId);

        return plans.stream()
                .map(plan -> MonthlyPlanResponse.builder()
                        .monthIndex(plan.getMonthIndex())
                        .targetWeightChange(plan.getTargetWeightChange())
                        .dailyCalories(plan.getDailyCalories())
                        .note(plan.getNote())
                        .build()
                )
                .toList();
    }
}
