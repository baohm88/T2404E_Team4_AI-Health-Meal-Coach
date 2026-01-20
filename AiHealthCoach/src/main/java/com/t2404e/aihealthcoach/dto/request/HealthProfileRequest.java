package com.t2404e.aihealthcoach.dto.request;

import com.t2404e.aihealthcoach.enums.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthProfileRequest {

    @NotNull(message = "Age is required")
    @Min(value = 10, message = "Age must be at least 10")
    @Max(value = 100, message = "Age must be less than or equal to 100")
    private Integer age;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Height is required")
    @DecimalMin(value = "100.0", message = "Height must be at least 100 cm")
    @DecimalMax(value = "250.0", message = "Height must be less than or equal to 250 cm")
    private Double height;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "30.0", message = "Weight must be at least 30 kg")
    @DecimalMax(value = "300.0", message = "Weight must be less than or equal to 300 kg")
    private Double weight;

    @NotNull(message = "Activity level is required")
    private ActivityLevel activityLevel;

    @NotNull(message = "Stress level is required")
    private StressLevel stressLevel;

    @NotNull(message = "Sleep duration is required")
    private SleepDuration sleepDuration;
}
