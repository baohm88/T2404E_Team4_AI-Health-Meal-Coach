package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.dto.response.DashboardResponse;
import com.t2404e.aihealthcoach.entity.HealthProfile;
import com.t2404e.aihealthcoach.exception.ResourceNotFoundException;
import com.t2404e.aihealthcoach.repository.HealthProfileRepository;
import com.t2404e.aihealthcoach.service.DashboardService;
import com.t2404e.aihealthcoach.service.HealthCalculationService;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final HealthProfileRepository healthProfileRepository;
    private final HealthCalculationService calculationService;

    public DashboardServiceImpl(
            HealthProfileRepository healthProfileRepository,
            HealthCalculationService calculationService
    ) {
        this.healthProfileRepository = healthProfileRepository;
        this.calculationService = calculationService;
    }


    @Override
    public DashboardResponse getDashboard(Long userId) {

        HealthProfile profile = healthProfileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Health profile not found"));

        double bmi = calculationService.calculateBMI(
                profile.getHeight(),
                profile.getWeight()
        );

        double bmr = calculationService.calculateBMR(
                profile.getGender(),
                profile.getAge(),
                profile.getHeight(),
                profile.getWeight()
        );

        double tdee = calculationService.calculateTDEE(
                bmr,
                profile.getActivityLevel()
        );

        int energyScore = calculationService.calculateEnergyScore(
                profile.getStressLevel(),
                profile.getSleepDuration()
        );

        var healthStatus = calculationService.determineHealthStatus(bmi);

        int recommendedCalories =
                calculationService.calculateRecommendedCalories(tdee, profile.getGoal());

        return DashboardResponse.builder()
                .bmi(bmi)
                .bmr(bmr)
                .tdee(tdee)
                .energyScore(energyScore)
                .healthStatus(healthStatus)
                .recommendedCalories(recommendedCalories)
                .build();
    }

}
