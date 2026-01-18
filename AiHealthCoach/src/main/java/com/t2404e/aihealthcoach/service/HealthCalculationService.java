package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.enums.*;

public interface HealthCalculationService {

    double calculateBMI(double heightCm, double weightKg);
    double calculateBMR(Gender gender, int age, double heightCm, double weightKg);
    double calculateTDEE(double bmr, ActivityLevel activityLevel);
    int calculateEnergyScore(StressLevel stressLevel, SleepDuration sleepDuration);
    HealthStatus determineHealthStatus(double bmi);
    int calculateRecommendedCalories(double tdee, GoalType goal);
}
