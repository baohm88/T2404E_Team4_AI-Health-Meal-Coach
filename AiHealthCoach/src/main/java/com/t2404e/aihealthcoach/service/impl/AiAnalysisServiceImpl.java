//package com.t2404e.aihealthcoach.service.impl;
//
//import com.t2404e.aihealthcoach.dto.request.AiMonthlyPlanRequest;
//import com.t2404e.aihealthcoach.dto.response.AiMonthlyPlanResponse;
//import com.t2404e.aihealthcoach.enums.HealthStatus;
//import com.t2404e.aihealthcoach.service.AiAnalysisService;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class AiAnalysisServiceImpl implements AiAnalysisService {
//
//    @Override
//    public AiMonthlyPlanResponse generateMonthlyPlan(
//            Long userId,
//            AiMonthlyPlanRequest request
//    ) {
//        return AiMonthlyPlanResponse.builder()
//                .healthAnalysis(
//                        AiMonthlyPlanResponse.HealthAnalysisDto.builder()
//                                .bmi(27.8)
//                                .bmr(1850.0)
//                                .tdee(2400.0)
//                                .energyScore(65)
//                                .healthStatus(HealthStatus.OVERWEIGHT)
//                                .bodyState("High stress, insufficient sleep, calorie surplus")
//                                .build()
//                )
//                .monthlyPlans(List.of(
//                        AiMonthlyPlanResponse.MonthlyPlanDto.builder()
//                                .monthIndex(1)
//                                .targetWeightChange(-2.5)
//                                .dailyCalories(1800)
//                                .note("Focus on sleep and light cardio")
//                                .build(),
//                        AiMonthlyPlanResponse.MonthlyPlanDto.builder()
//                                .monthIndex(2)
//                                .targetWeightChange(-3.0)
//                                .dailyCalories(1600)
//                                .note("Increase daily activity")
//                                .build(),
//                        AiMonthlyPlanResponse.MonthlyPlanDto.builder()
//                                .monthIndex(3)
//                                .targetWeightChange(-4.0)
//                                .dailyCalories(1400)
//                                .note("Maintain long-term habits")
//                                .build()
//                ))
//                .build();
//    }
//}


package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.request.AiMonthlyPlanRequest;
import com.t2404e.aihealthcoach.dto.response.AiMonthlyPlanResponse;
import com.t2404e.aihealthcoach.entity.MonthlyPlan;
import com.t2404e.aihealthcoach.enums.HealthStatus;
import com.t2404e.aihealthcoach.repository.MonthlyPlanRepository;
import com.t2404e.aihealthcoach.service.AiAnalysisService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AiAnalysisServiceImpl implements AiAnalysisService {

    private final MonthlyPlanRepository monthlyPlanRepository;

    public AiAnalysisServiceImpl(MonthlyPlanRepository monthlyPlanRepository) {
        this.monthlyPlanRepository = monthlyPlanRepository;
    }

    /**
     * Generate AI monthly plan (mock) and persist to database
     */
    @Override
    @Transactional
    public AiMonthlyPlanResponse generateMonthlyPlan(
            Long userId,
            AiMonthlyPlanRequest request
    ) {

        // ===============================
        // 1. MOCK AI RESPONSE
        // ===============================
        AiMonthlyPlanResponse response = mockAiResponse();

        // ===============================
        // 2. CLEAR OLD PLANS (MVP)
        // ===============================
        monthlyPlanRepository.deleteByUserId(userId);

        // ===============================
        // 3. SAVE NEW MONTHLY PLANS
        // ===============================
        for (AiMonthlyPlanResponse.MonthlyPlanDto dto : response.getMonthlyPlans()) {

            MonthlyPlan plan = MonthlyPlan.builder()
                    .userId(userId)
                    .monthIndex(dto.getMonthIndex())
                    .targetWeightChange(dto.getTargetWeightChange())
                    .dailyCalories(dto.getDailyCalories())
                    .note(dto.getNote())
                    .build();

            monthlyPlanRepository.save(plan);
        }

        // ===============================
        // 4. RETURN RESPONSE FOR UI
        // ===============================
        return response;
    }

    /**
     * Mock AI response – replace with OpenAI later
     */
    private AiMonthlyPlanResponse mockAiResponse() {

        return AiMonthlyPlanResponse.builder()
                .healthAnalysis(
                        AiMonthlyPlanResponse.HealthAnalysisDto.builder()
                                .bmi(27.8)
                                .bmr(1850.0)
                                .tdee(2400.0)
                                .energyScore(65)
                                .healthStatus(HealthStatus.OVERWEIGHT)
                                .bodyState(
                                        "The body shows calorie surplus, high stress, and insufficient sleep."
                                )
                                .build()
                )
                .monthlyPlans(List.of(
                        AiMonthlyPlanResponse.MonthlyPlanDto.builder()
                                .monthIndex(1)
                                .targetWeightChange(-2.5)
                                .dailyCalories(1800)
                                .note("Improve sleep and start light cardio")
                                .build(),
                        AiMonthlyPlanResponse.MonthlyPlanDto.builder()
                                .monthIndex(2)
                                .targetWeightChange(-3.0)
                                .dailyCalories(1600)
                                .note("Increase daily activity and maintain calorie control")
                                .build(),
                        AiMonthlyPlanResponse.MonthlyPlanDto.builder()
                                .monthIndex(3)
                                .targetWeightChange(-4.0)
                                .dailyCalories(1400)
                                .note("Maintain healthy habits for long-term sustainability")
                                .build()
                ))
                .build();
    }
}
