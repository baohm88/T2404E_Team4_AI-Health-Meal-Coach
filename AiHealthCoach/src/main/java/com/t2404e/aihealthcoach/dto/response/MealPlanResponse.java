package com.t2404e.aihealthcoach.dto.response;

import com.t2404e.aihealthcoach.dto.response.mealplan.DayPlanDTO;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealPlanResponse {
        private LocalDate startDate;
        private Integer totalDays;
        private List<DayPlanDTO> mealPlan;
}
