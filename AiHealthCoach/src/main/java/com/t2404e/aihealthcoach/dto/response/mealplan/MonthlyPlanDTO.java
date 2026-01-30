package com.t2404e.aihealthcoach.dto.response.mealplan;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyPlanDTO {
    private String goal;
    private Double totalTargetWeightChangeKg;
    private List<MonthDetailDTO> months;
}
