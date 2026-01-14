package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.request.AiMonthlyPlanRequest;
import com.t2404e.aihealthcoach.dto.response.AiMonthlyPlanResponse;
import com.t2404e.aihealthcoach.enums.HealthStatus;
import com.t2404e.aihealthcoach.service.AiAnalysisService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiAnalysisServiceImpl implements AiAnalysisService {

    @Override
    public AiMonthlyPlanResponse generateMonthlyPlan(
            Long userId,
            AiMonthlyPlanRequest request
    ) {
        return AiMonthlyPlanResponse.builder()
                .healthAnalysis(
                        AiMonthlyPlanResponse.HealthAnalysisDto.builder()
                                .bmi(27.8)
                                .bmr(1850.0)
                                .tdee(2400.0)
                                .energyScore(65)
                                .healthStatus(HealthStatus.OVERWEIGHT)
                                .bodyState("High stress, insufficient sleep, calorie surplus")
                                .build()
                )
                .monthlyPlans(List.of(
                        AiMonthlyPlanResponse.MonthlyPlanDto.builder()
                                .monthIndex(1)
                                .targetWeightChange(-2.5)
                                .dailyCalories(1800)
                                .note("Focus on sleep and light cardio")
                                .build(),
                        AiMonthlyPlanResponse.MonthlyPlanDto.builder()
                                .monthIndex(2)
                                .targetWeightChange(-3.0)
                                .dailyCalories(1600)
                                .note("Increase daily activity")
                                .build(),
                        AiMonthlyPlanResponse.MonthlyPlanDto.builder()
                                .monthIndex(3)
                                .targetWeightChange(-4.0)
                                .dailyCalories(1400)
                                .note("Maintain long-term habits")
                                .build()
                ))
                .build();
    }
}
