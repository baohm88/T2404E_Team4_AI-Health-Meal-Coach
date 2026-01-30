package com.t2404e.aihealthcoach.dto.response.mealplan;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthDetailDTO {
    private Integer month;
    private String title;
    private Integer dailyCalories;
    private String note;
}
