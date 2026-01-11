package com.t2404e.aihealthcoach.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardResponse {
    private double bmi;
    private double bmr;
    private double tdee;
    private int energyScore;
}