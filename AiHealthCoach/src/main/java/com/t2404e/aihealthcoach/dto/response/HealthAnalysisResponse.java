package com.t2404e.aihealthcoach.dto.response;

import com.t2404e.aihealthcoach.enums.HealthStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthAnalysisResponse {

    private Double bmi;
    private Double bmr;
    private Double tdee;
    private Integer energyScore;
    private HealthStatus healthStatus;
    private String bodyState;
}
