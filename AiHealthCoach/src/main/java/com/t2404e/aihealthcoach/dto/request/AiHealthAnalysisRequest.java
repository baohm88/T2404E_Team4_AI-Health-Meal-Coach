package com.t2404e.aihealthcoach.dto.request;

import com.t2404e.aihealthcoach.enums.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiHealthAnalysisRequest {

    @NotNull
    @Min(10)
    @Max(100)
    private Integer age;

    @NotNull
    private Gender gender;

    @NotNull
    @DecimalMin("100.0")
    @DecimalMax("250.0")
    private Double heightCm;

    @NotNull
    @DecimalMin("30.0")
    @DecimalMax("300.0")
    private Double weightKg;

    @NotNull
    private ActivityLevel activityLevel;

    @NotNull
    private SleepDuration sleepDuration;

    @NotNull
    private StressLevel stressLevel;
}
