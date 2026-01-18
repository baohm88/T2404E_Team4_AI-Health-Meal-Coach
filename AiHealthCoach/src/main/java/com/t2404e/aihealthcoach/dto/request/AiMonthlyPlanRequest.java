package com.t2404e.aihealthcoach.dto.request;

import com.t2404e.aihealthcoach.enums.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiMonthlyPlanRequest {

    @NotNull(message = "Age is required")
    private Integer age;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Height is required")
    private Double height;

    @NotNull(message = "Weight is required")
    private Double weight;

    @NotNull(message = "Sleep hours is required")
    private Integer sleepHours;

    @NotNull(message = "Stress level is required")
    private StressLevel stressLevel;

    @NotNull(message = "Activity level is required")
    private ActivityLevel activityLevel;

    @NotBlank(message = "Work pressure description is required")
    private String workPressure;

    @NotBlank(message = "Eating habit description is required")
    private String eatingHabit;

    private String medicalHistory;
}
