package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.request.AiHealthAnalysisRequest;
import com.t2404e.aihealthcoach.dto.response.ai.*;
import com.t2404e.aihealthcoach.enums.Gender;
import com.t2404e.aihealthcoach.service.AiHealthAnalysisService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiHealthAnalysisServiceImpl implements AiHealthAnalysisService {

    @Override
    public AiHealthAnalysisResponse analyze(AiHealthAnalysisRequest request) {

        // BMI
        double heightM = request.getHeightCm() / 100.0;
        double bmi = request.getWeightKg() / (heightM * heightM);
        bmi = Math.round(bmi * 10.0) / 10.0;

        // BMR
        double bmr;
        if (request.getGender() == Gender.MALE) {
            bmr = 10 * request.getWeightKg()
                    + 6.25 * request.getHeightCm()
                    - 5 * request.getAge()
                    + 5;
        } else {
            bmr = 10 * request.getWeightKg()
                    + 6.25 * request.getHeightCm()
                    - 5 * request.getAge()
                    - 161;
        }
        bmr = Math.round(bmr);

        // TDEE (mock multiplier)
        double tdee = Math.round(bmr * 1.7);

        // Health status
        String status;
        if (bmi < 18.5) status = "UNDERWEIGHT";
        else if (bmi < 25) status = "NORMAL";
        else if (bmi < 30) status = "OVERWEIGHT";
        else status = "OBESE";

        BodyAnalysis analysis = BodyAnalysis.builder()
                .bmi(bmi)
                .bmr(bmr)
                .tdee(tdee)
                .healthStatus(status)
                .summary("Your body condition can be improved with consistent habits and balanced nutrition.")
                .build();

        LifestyleInsights lifestyle = LifestyleInsights.builder()
                .activity("Increasing daily movement will help improve energy balance.")
                .sleep("Improving sleep quality will enhance recovery.")
                .stress("Managing stress will support better health outcomes.")
                .build();

        ThreeMonthPlan plan = ThreeMonthPlan.builder()
                .goal("WEIGHT_LOSS")
                .totalTargetWeightChangeKg(-6.0)
                .months(List.of(
                        MonthlyPlanPhase.builder()
                                .month(1)
                                .title("Adaptation")
                                .dailyCalories((int) (tdee - 300))
                                .note("Build consistency and adapt to healthier routines.")
                                .build(),
                        MonthlyPlanPhase.builder()
                                .month(2)
                                .title("Acceleration")
                                .dailyCalories((int) (tdee - 450))
                                .note("Increase fat loss with controlled calorie deficit.")
                                .build(),
                        MonthlyPlanPhase.builder()
                                .month(3)
                                .title("Stabilization")
                                .dailyCalories((int) (tdee - 350))
                                .note("Maintain progress and reinforce habits.")
                                .build()
                ))
                .build();

        return AiHealthAnalysisResponse.builder()
                .analysis(analysis)
                .lifestyleInsights(lifestyle)
                .threeMonthPlan(plan)
                .build();
    }
}
