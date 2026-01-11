package com.t2404e.aihealthcoach.dto.response;

import com.t2404e.aihealthcoach.enums.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HealthProfileResponse {

    private Long userId;

    private Gender gender;
    private Integer age;
    private Double height;
    private Double weight;

    private GoalType goal;
    private ActivityLevel activityLevel;
    private StressLevel stressLevel;
    private SleepDuration sleepDuration;
}
