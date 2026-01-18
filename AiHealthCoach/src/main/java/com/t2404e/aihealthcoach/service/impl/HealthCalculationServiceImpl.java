package com.t2404e.aihealthcoach.service.impl;

import com.t2404e.aihealthcoach.enums.*;
import com.t2404e.aihealthcoach.service.HealthCalculationService;
import org.springframework.stereotype.Service;

@Service
public class HealthCalculationServiceImpl implements HealthCalculationService {

    /**
     * Calculate BMI = weight / (height in meter)^2
     */
    @Override
    public double calculateBMI(double heightCm, double weightKg) {
        double heightMeter = heightCm / 100;
        return Math.round((weightKg / (heightMeter * heightMeter)) * 10.0) / 10.0;
    }

    /**
     * Calculate BMR using Mifflin-St Jeor Equation
     */
    @Override
    public double calculateBMR(
            Gender gender,
            int age,
            double heightCm,
            double weightKg
    ) {
        double bmr;

        if (gender == Gender.MALE) {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        } else {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        }

        return Math.round(bmr);
    }

    /**
     * Calculate TDEE based on activity level
     */
    @Override
    public double calculateTDEE(double bmr, ActivityLevel activityLevel) {
        double multiplier;

        switch (activityLevel) {
            case SEDENTARY -> multiplier = 1.2;
            case LIGHT -> multiplier = 1.375;
            case MODERATE -> multiplier = 1.55;
            case VERY_ACTIVE -> multiplier = 1.725;
            default -> multiplier = 1.2;
        }

        return Math.round(bmr * multiplier);
    }

    /**
     * Calculate Energy Score (0–100) – rule-based
     */
    @Override
    public int calculateEnergyScore(
            StressLevel stressLevel,
            SleepDuration sleepDuration
    ) {
        int score = 100;

        // Stress impact
        switch (stressLevel) {
            case MEDIUM -> score -= 10;
            case HIGH -> score -= 20;
            case VERY_HIGH -> score -= 30;
        }

        // Sleep impact
        switch (sleepDuration) {
            case LESS_THAN_FIVE -> score -= 30;
            case FIVE_TO_SEVEN -> score -= 15;
            case MORE_THAN_NINE -> score -= 5;
        }

//        return Math.max(score, 0);
        return Math.max(0, Math.min(score, 100));
    }

    @Override
    public HealthStatus determineHealthStatus(double bmi) {

        if (bmi < 18.5) {
            return HealthStatus.UNDERWEIGHT;
        } else if (bmi < 25) {
            return HealthStatus.NORMAL;
        } else if (bmi < 30) {
            return HealthStatus.OVERWEIGHT;
        } else {
            return HealthStatus.OBESE;
        }
    }

    @Override
    public int calculateRecommendedCalories(double tdee, GoalType goal) {

        double calories;

        switch (goal) {
            case WEIGHT_LOSS -> calories = tdee - 500;
            case MUSCLE_GAIN -> calories = tdee + 300;
            case MAINTENANCE -> calories = tdee;
            default -> calories = tdee;
        }

        // Safety clamp
        return (int) Math.max(calories, 1200);
    }


}
