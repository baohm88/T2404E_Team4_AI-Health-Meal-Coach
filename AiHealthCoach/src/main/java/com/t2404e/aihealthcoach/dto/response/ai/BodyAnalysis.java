package com.t2404e.aihealthcoach.dto.response.ai;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BodyAnalysis {

    private double bmi;
    private double bmr;
    private double tdee;
    private String healthStatus; // UNDERWEIGHT, NORMAL, OVERWEIGHT, OBESE
    private String summary;
}
