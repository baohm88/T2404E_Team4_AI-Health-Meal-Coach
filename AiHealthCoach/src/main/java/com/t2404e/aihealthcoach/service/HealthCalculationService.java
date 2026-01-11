package com.t2404e.aihealthcoach.service;

import com.t2404e.aihealthcoach.enums.ActivityLevel;
import com.t2404e.aihealthcoach.enums.Gender;
import com.t2404e.aihealthcoach.enums.SleepDuration;
import com.t2404e.aihealthcoach.enums.StressLevel;

public interface HealthCalculationService {

    double calculateBMI(double heightCm, double weightKg);

    double calculateBMR(Gender gender, int age, double heightCm, double weightKg);

    double calculateTDEE(double bmr, ActivityLevel activityLevel);

    int calculateEnergyScore(StressLevel stressLevel, SleepDuration sleepDuration);
}
